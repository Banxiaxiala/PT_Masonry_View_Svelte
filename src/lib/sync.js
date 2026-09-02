/* ============================================================================
 * sync.js — 独立同步模块 (Svelte 重构版 PT 瀑布流视图 的"同步/已读/页码"核心)
 *
 * 说明：
 *   - 本文件为独立模块，仅使用浏览器全局 (window/localStorage/GM_getValue/
 *     GM_setValue/GM_xmlhttpRequest/document)，不引入 svelte stores。
 *   - 原 bundle 依赖 svelte 的 writable store (xt) 与 localStorage 封装 (lt)，
 *     此处用等价的极简自定义 store {get(), set(v), subscribe(cb)} 复刻其行为。
 *   - 所有关键函数以 ES 命名导出，同时挂载到 window 供宿主调用。
 * ========================================================================== */

/* ---------- 极简响应式 store 封装 (复刻 svelte writable + lt 的 localStorage 持久化) ---------- */
// 所有站点级设置统一存于 localStorage 的 "Kesa:Masonry" JSON 对象下的对应 key
const __STORE_NS = "Kesa:Masonry";

/**
 * @param {any} key
 * @param {any} defaultValue
 */
function __mkLocalStore(key, defaultValue) {
  // 设置按站点独立存储: 子键 = key + "." + 当前站点域名 (如 _all_tags.example.com),
  // 每个站点各自保存/读取自己的过滤/已读设置, 互不覆盖。
  const host = (typeof location !== "undefined" && location.hostname) || "";
  const nsKey = key + "." + host;
  let value = defaultValue;
  // 初始化：从 localStorage 读取(本站子键); 首次访问本站时把旧版全局子键迁移到本站后缀
  try {
    const obj = JSON.parse(localStorage.getItem(__STORE_NS) || "{}") || {};
    if (obj[nsKey] !== undefined) {
      value = obj[nsKey];
    } else if (host && obj[key] !== undefined) {
      value = obj[key];
      obj[nsKey] = value;
      localStorage.setItem(__STORE_NS, JSON.stringify(obj));
    }
  } catch (e) {}
  const subs = new Set();
  const store = {
    get() {
      return value;
    },
    /**
     * @param {any} v
     */
    set(v) {
      const changed = v !== value;
      value = v;
      // 持久化到 localStorage (本站子键)
      try {
        const obj = JSON.parse(localStorage.getItem(__STORE_NS) || "{}") || {};
        obj[nsKey] = v;
        localStorage.setItem(__STORE_NS, JSON.stringify(obj));
      } catch (e) {}
      // 通知订阅者
      if (changed) {
        for (const cb of [...subs]) {
          try {
            cb(value);
          } catch (e) {}
        }
      }
      return v;
    },
    /**
     * @param {any} cb
     */
    subscribe(cb) {
      subs.add(cb);
      // 立即以当前值通知订阅者(复刻 svelte writable store 语义),
      // 否则 svelte/store 的 get()(经 subscribe 取值) 会因收不到首值而返回 undefined
      try {
        cb(value);
      } catch (e) {}
      return function () {
        subs.delete(cb);
      };
    },
    /**
     * @param {any} fn
     */
    update(fn) {
      return store.set(fn(value));
    },
  };
  return store;
}

// 读取 store 当前值 (等价原 bundle 的 it(t))
/**
 * @param {any} s
 */
function __storeVal(s) {
  return s.get();
}

/* ============================================================================
 * 1. 读取追踪 + 名称过滤 + WebDAV 配置
 * ========================================================================== */
// 已读 ID 列表 (localStorage key: _read_ids, 默认 [])
const __readIds = __mkLocalStore("_read_ids", []);
// 隐藏已读卡片 (localStorage key: _hide_read_cards, 默认 false)
const __hideReadCards = __mkLocalStore("_hide_read_cards", false);
// 隐藏"历史观看" (localStorage key: _hide_history_read, 默认 false)
const __hideHistoryRead = __mkLocalStore("_hide_history_read", false);
// 图片加载失败时显示标题 (localStorage key: _showInfoOnPicFail, 默认 1)
const __showInfoOnPicFail = __mkLocalStore("_showInfoOnPicFail", 1);
// 预览大图默认状态 (localStorage key: _state_hover_pic, 默认 false)
const __stateHoverPic = __mkLocalStore("_state_hover_pic", false);
// 已屏蔽标签 (localStorage key: _blocked_tags, 默认 [])
const __bTags = __mkLocalStore("_blocked_tags", []);
// 全部标签 (localStorage key: _all_tags, 默认 [])
const __aTags = __mkLocalStore("_all_tags", []);
// 名称过滤关键词 (localStorage key: _name_filter_keywords, 默认 [])
const __nameFilter = __mkLocalStore("_name_filter_keywords", []);

// 兼容旧版字符串格式：若旧值是非数组，拆分为多个气泡（空格分隔）
{
  const _old = __storeVal(__nameFilter);
  if (!Array.isArray(_old)) {
    __nameFilter.set(
      typeof _old === "string"
        ? _old
            .trim()
            .split(/\s+/)
            .filter(Boolean)
        : [],
    );
  }
}

// 进入页面时的已读快照 (module 级数组变量；"隐藏历史观看"据此实时判定)
/** @type {any[]} */
let __historyReadSnapshot = [];

// WebDAV 配置 (GM key pt_wdv_cfg 优先，回退 localStorage Kesa:Masonry._webdav_config)
// 实现为一个自定义 store：初始化读 GM/本地，set 时写回 GM
let __wdvCfgInit = null;
try {
  const __s = GM_getValue("pt_wdv_cfg", null);
  __wdvCfgInit = __s ? JSON.parse(__s) : null;
} catch (e) {}
if (!__wdvCfgInit || typeof __wdvCfgInit !== "object") {
  try {
    const __raw = JSON.parse(localStorage.getItem("Kesa:Masonry") || "{}");
    __wdvCfgInit = __raw._webdav_config || null;
  } catch (e) {}
}
let __wdvCfgValue = Object.assign({ url: "", user: "", pass: "", path: "PT_Masonry_ReadIds.json" }, __wdvCfgInit || {});
const __wdvCfgSubs = new Set();
const __wdvCfg = {
  get() {
    return __wdvCfgValue;
  },
  /**
   * @param {any} v
   */
  set(v) {
    const changed = v !== __wdvCfgValue;
    __wdvCfgValue = v;
    try {
      GM_setValue("pt_wdv_cfg", JSON.stringify(v));
    } catch (e) {}
    if (changed) {
      for (const cb of [...__wdvCfgSubs]) {
        try {
          cb(__wdvCfgValue);
        } catch (e) {}
      }
    }
    return v;
  },
  /**
   * @param {any} cb
   */
  subscribe(cb) {
    __wdvCfgSubs.add(cb);
    return function () {
      __wdvCfgSubs.delete(cb);
    };
  },
  /**
   * @param {any} fn
   */
  update(fn) {
    return __wdvCfg.set(fn(__wdvCfgValue));
  },
};

// 标记单个种子为已读
/**
 * @param {any} id
 */
function __markRead(id) {
  const cur = __storeVal(__readIds);
  if (!cur.includes(id)) {
    __readIds.set([...cur, id]);
  }
}

// 应用"隐藏已读卡片 / 隐藏历史观看"
// 重构(v1.2.29b): 不再直接改内联 style.display, 而是 toggle `.kesa-hide` class。
// 卡片根元素是 Svelte 组件, 模板 style 带 "display:{gayHidden?'none':''}", 每次 Svelte 重渲染
// (点击标记已读/懒加载 onload/翻页 each 更新)都会用 '' 覆盖内联 display:none, 这是"隐藏历史
// 观看/隐藏已读"反复修不好、需手动重启开关才生效的根因。改用 CSS class + !important 后:
//   - class 优先级高于内联 display, 永不被子组件重渲染覆盖;
//   - 不再需要 el.__readHidden / el.__nameFiltered 这类脆弱的内联 display 协调标记;
//   - 隐藏逻辑各自 toggle 独立 class, 与 gayHidden(内联 display) 天然共存。
function __applyHideReadCards() {
  const hide = __storeVal(__hideReadCards),
    hideHist = __storeVal(__hideHistoryRead);
  const readSet = __storeVal(__readIds);
  // 遍历所有 .card, 直接由卡片自身 id 与快照/已读集合比对判定, 不依赖 .pt-read 类是否已应用
  // (手工翻页/点击加载下一页后若标记未及时打上, 仅遍历 .card.pt-read 会漏掉新卡片)。
  document.querySelectorAll(".card").forEach((el) => {
    const id = __extractId(el);
    // 隐藏已读卡片: id 在已读集合即隐藏; 隐藏历史观看: id 在进入页面时的快照即隐藏
    const isRead = !!id && readSet.includes(id);
    const isHist = !!id && __historyReadSnapshot.includes(id);
    const shouldHide = (hide && isRead) || (hideHist && isHist);
    el.classList.toggle("kesa-hide-read", shouldHide);
  });
}

// 取卡片标题文字
/**
 * @param {any} el
 */
function __cardName(el) {
  const a = el.querySelector(".card-title a.two-lines");
  if (a) return (a.textContent || "").trim();
  const t = el.querySelector(".card-title");
  if (t) return (t.textContent || "").trim();
  return "";
}

// 应用名称过滤：命中任一关键词即隐藏卡片
// (v1.2.29b 重构: 与隐藏已读/历史观看统一用 .kesa-hide class + !important, 不再改内联 display,
//  也不再用 __nameFiltered 标记协调; 各隐藏逻辑独立, 关闭过滤时只移除本 class 即可恢复显示)
function __applyHideNameFilter() {
  const kws = (__storeVal(__nameFilter) || []).filter((/** @type {any} */ k) => (k || "").trim());
  document.querySelectorAll(".card").forEach((el) => {
    if (!kws.length) {
      el.classList.remove("kesa-hide");
      return;
    }
    const name = __cardName(el).toLowerCase();
    const hit = kws.some((/** @type {any} */ k) => name.indexOf(String(k).toLowerCase()) !== -1);
    el.classList.toggle("kesa-hide", hit);
  });
}

// 从卡片 DOM 提取种子 ID
/**
 * @param {any} card
 */
function __extractId(card) {
  const link = card.querySelector('a[href*="details.php"],a[href*="/detail/"]');
  if (!link) return null;
  var m = link.href.match(/[?&]id=(\d+)/);
  if (m) return m[1];
  m = link.href.match(/\/detail\/(\d+)/);
  if (m) return m[1];
  return null;
}

// 应用已读样式类 (pt-read) 并联动隐藏
function __applyReadClasses() {
  const readSet = __storeVal(__readIds);
  document.querySelectorAll(".card").forEach((el) => {
    const id = __extractId(el);
    el.classList.toggle("pt-read", !!(id && readSet.includes(id)));
  });
  __applyHideReadCards();
}

// 初始化读取追踪：注入样式 + 点击/中键标记已读 + MutationObserver + 详情页自动标记
function __initReadTracking() {
  if (document.getElementById("pt-read-style")) return;
  __historyReadSnapshot = [...__storeVal(__readIds)];
  const s = document.createElement("style");
  s.id = "pt-read-style";
  s.textContent =
    // 已读变灰(不隐藏)
    ".card.pt-read{opacity:0.55!important;filter:grayscale(0.6)!important;transition:opacity .3s ease,filter .3s ease!important}.card.pt-read:hover{opacity:0.75!important;filter:grayscale(0.3)!important}" +
    // 程序隐藏: 用 CSS class + !important, 而非内联 style.display。
    // 原因: 卡片根元素是 Svelte 组件, 其模板 style 里带 "display:{gayHidden?'none':''}", 每次
    // Svelte 重渲染都会用 '' 覆盖掉我们内联设置的 display:none, 导致"隐藏历史观看/隐藏已读"
    // 在翻页/点击标记已读等触发 Svelte 更新后失效(需手动重启开关才短暂生效)。
    // 改用 class + !important 后, class 优先级高于内联 display, 永不被子组件重渲染覆盖。
    // kesa-hide(名称过滤) 与 kesa-hide-read(隐藏已读/历史观看) 各自独立 toggle, 互不覆盖。
    ".card.kesa-hide{display:none!important}.card.kesa-hide-read{display:none!important}";
  // 兜底 document.documentElement: run-at: document-start 时 document.head 可能尚未存在
  (document.head || document.documentElement).appendChild(s);
  // 首次加载即标记已读并应用隐藏(含"隐藏历史观看"), 否则需开关一次才生效
  __applyReadClasses();
  // BUG修复(v1.2.50b): 全局订阅 __readIds, 任何变更(点击卡片标记已读等)都立即重应用已读样式。
  // 此前"点击变灰"依赖 __fillReadSection 里 _read_ids 的 subscribe 或 MutationObserver(翻页加卡片时
  // 才触发), 首屏未打开配置面板时点卡片只更新 store 无订阅者调 __applyReadClasses, 导致第一页点
  // 卡片不变灰, 直到点"加载下一页"触发 MutationObserver 才生效。此订阅让 store 变更即生效、自包含。
  __readIds.subscribe(() => {
    __applyReadClasses();
  });
  // 点击/中键标记已读(中键视为同款标记); 标记后由 __applyReadClasses 统一更新卡片状态与隐藏
  /**
   * @param {any} e
   */
  function markRead(e) {
    const card = e.target.closest(".card");
    if (!card) return;
    const id = __extractId(card);
    if (!id) return;
    const cur = __storeVal(__readIds);
    if (cur.includes(id)) return;
    __readIds.set([...cur, id]);
  }
  document.addEventListener("click", markRead, true);
  document.addEventListener(
    "auxclick",
    function (e) {
      if (e.button === 1) markRead(e);
    },
    true,
  );
  // 卡片增删后统一重新应用已读标记与隐藏(含页码跳转导航后渲染的新卡片)
  /** @type {any} */
  let timer;
  const obs = new MutationObserver(function (muts) {
    const hasCard = muts.some((mu) =>
      Array.from(mu.addedNodes)
        .concat(Array.from(mu.removedNodes))
        .some((n) => {
          if (!n || n.nodeType !== 1) return false;
          return (n.classList && n.classList.contains("card")) || (n.querySelector && n.querySelector(".card"));
        }),
    );
    if (!hasCard) return;
    clearTimeout(timer);
    timer = setTimeout(function () {
      __applyReadClasses();
      __applyHideNameFilter();
    }, 200);
  });
  obs.observe(document.body, { childList: true, subtree: true });
  const url = window.location.href;
  var m = url.match(/[?&]id=(\d+)/);
  if (m) {
    const cur = __storeVal(__readIds);
    if (!cur.includes(m[1])) __readIds.set([...cur, m[1]]);
  }
}

/* ---------- 开关组件 ---------- */
// 复刻原 bundle 的 __mkSwitch: 标签 + checkbox 样式的开关
/**
 * @param {any} checked
 * @param {any} onChange
 */
function __mkSwitch(checked, onChange) {
  const w = document.createElement("div");
  w.className = "s_switch svelte-2vaqag svelte-2vaqag";
  w.style.cssText = "flex:0 0 auto;line-height:0;";
  const inp = document.createElement("input");
  inp.type = "checkbox";
  inp.className = "svelte-2vaqag svelte-2vaqag";
  inp.checked = !!checked;
  inp.style.cssText =
    "width:0;height:0;display:none;visibility:hidden;margin:0;padding:0;";
  const id = "_kesa_sw_" + Math.random().toString(36).slice(2, 10);
  inp.id = id;
  const lb = document.createElement("label");
  lb.className = "svelte-2vaqag svelte-2vaqag";
  lb.setAttribute("for", id);
  // 复刻 component/switch.svelte 的 label 样式(48x12 轨道)与 ::after(24px 滑块),
  // 全部用 inline 样式, 避免依赖 Svelte scoped CSS 或站点自身 CSS 造成开关外观不一致。
  lb.style.cssText =
    "width:48px;height:12px;display:inline-block;position:relative;background-color:#777;border:2px solid #555;border-radius:30px;transition:all .2s;cursor:pointer;box-sizing:content-box;";
  const knob = document.createElement("span");
  knob.style.cssText =
    "position:absolute;left:-2px;top:-6px;width:24px;height:24px;border-radius:50%;background-color:#555;transition:transform .2s;pointer-events:none;box-sizing:border-box;";
  lb.appendChild(knob);
  /**
   * @param {any} on
   */
  function paint(on) {
    lb.style.backgroundColor = on ? "#00a0fc" : "#777";
    lb.style.borderColor = on ? "#006dc9" : "#555";
    knob.style.backgroundColor = on ? "#0054b0" : "#555";
    knob.style.transform = on ? "translateX(28px)" : "translateX(0)";
  }
  paint(!!checked);
  inp.addEventListener("change", function () {
    paint(inp.checked);
    onChange(inp.checked);
  });
  w.appendChild(inp);
  w.appendChild(lb);
  return w;
}

// 开关行 (label + checkbox 样式开关)
/**
 * @param {any} labelText
 * @param {any} checked
 * @param {any} onChange
 * @param {any} desc
 */
function __mkSwitchRow(labelText, checked, onChange, desc) {
  const row = document.createElement("div");
  // 复刻 component/switch.svelte 的 .switch 样式: 高度 30px, flex 两端对齐,
  // 与侧边栏其他开关行(如 Switch 组件渲染的"瀑布流/原有列表")的视觉格式一致。
  // 之前用 .switch svelte-2vaqag class 是依赖组件 scoped 样式, 但纯 DOM 创建的
  // 元素不会继承 Svelte scoped 样式, 导致"隐藏已读/隐藏历史观看"两个开关的
  // 文字位置(垂直居中、高度、宽度)与侧边栏其他开关不一致, 改为 inline 样式。
  row.className = "switch svelte-2vaqag svelte-2vaqag";
  row.style.cssText =
    "width:100%;height:30px;min-height:30px;display:flex;align-items:center;justify-content:space-between;box-sizing:border-box;max-width:100%;";
  const lb = document.createElement("div");
  // 复刻 Switch 组件 .s_title 样式: display:flex, align-items:center,
  // font-size:14px, position:relative(为了 title 提示浮层定位)。
  // 注意: 不要加 flex:1 / min-width:0, 与组件 .s_title 保持一致,
  // 否则文字宽度被撑满、开关位置与其他开关行(如"显示种子名称")不对齐。
  lb.className = "s_title svelte-2vaqag svelte-2vaqag";
  lb.style.cssText =
    "display:flex;align-items:center;font-size:14px;line-height:1;font-weight:400;color:#000;position:relative;flex:0 0 auto;min-width:0;white-space:nowrap;";
  lb.textContent = labelText;
  if (desc) lb.title = desc;
  const sw = __mkSwitch(checked, function (/** @type {any} */ v) {
    onChange(v);
  });
  row.appendChild(lb);
  row.appendChild(sw);
  return row;
}

/* ---------- 已读标记 配置面板 ---------- */
/**
 * @param {any} container
 */
function __fillReadSection(container) {
  const h1 = document.createElement("h1");
  h1.className = "s_title";
  h1.textContent = "已读标记";
  container.appendChild(h1);
  const hint = document.createElement("div");
  hint.style.cssText = "color:#999;font-size:11px;margin:0 0 6px 0;padding:0 10px;";
  hint.textContent = "点击卡片标记已读，再次点击取消";
  container.appendChild(hint);
  const panel = document.createElement("div");
  panel.className = "s_panel";
  panel.style.cssText = "display:flex;flex-wrap:wrap;gap:4px;";
  container.appendChild(panel);
  const row = document.createElement("div");
  row.style.cssText = "display:flex;gap:4px;padding:8px 10px 0;";
  const clearBtn = document.createElement("button");
  clearBtn.textContent = "清除所有已读标记";
  clearBtn.style.cssText =
    "border:none;background:#e55;color:#fff;border-radius:4px;cursor:pointer;padding:4px 12px;font-size:12px;";
  row.appendChild(clearBtn);
  container.appendChild(row);
  const countLabel = document.createElement("div");
  countLabel.style.cssText = "color:#999;font-size:11px;padding:4px 10px 0;";
  container.appendChild(countLabel);
  clearBtn.onclick = () => {
    __readIds.set([]);
  };
  const ua = __readIds.subscribe((/** @type {any} */ v) => {
    countLabel.textContent = `已标记 ${v.length} 个种子`;
    __applyReadClasses();
  });
  return () => {
    ua();
  };
}

/* ---------- TAG 过滤 配置面板 ---------- */
/**
 * @param {any} container
 */
function __fillTagSection(container) {
  const h1 = document.createElement("h1");
  h1.className = "s_title";
  h1.textContent = "TAG 过滤";
  container.appendChild(h1);
  const hint = document.createElement("div");
  hint.style.cssText = "color:#999;font-size:11px;margin:0 0 6px 0;padding:0 10px;";
  hint.textContent = "点击标签切换屏蔽(红=已屏蔽)，改后刷新页面生效";
  container.appendChild(hint);
  const panel = document.createElement("div");
  panel.className = "s_panel";
  panel.style.cssText =
    "display:flex;flex-direction:row;flex-wrap:wrap;justify-content:flex-start;align-items:flex-start;align-content:flex-start;gap:6px;width:100%;";
  container.appendChild(panel);
  const row = document.createElement("div");
  row.style.cssText = "display:flex;gap:4px;padding:8px 10px 0;";
  const inp = document.createElement("input");
  inp.placeholder = "手动添加屏蔽TAG";
  inp.style.cssText = "flex:1;border:1px solid #ccc;border-radius:4px;padding:3px 6px;font-size:12px;";
  const addBtn = document.createElement("button");
  addBtn.textContent = "+";
  addBtn.style.cssText = "border:none;background:#3fa7d6;color:#fff;border-radius:4px;cursor:pointer;padding:0 10px;";
  row.appendChild(inp);
  row.appendChild(addBtn);
  container.appendChild(row);
  /** @type {any[]} */
  let _a = [],
    /** @type {any[]} */
    _b = [];
  function render() {
    panel.innerHTML = "";
    if (_a.length === 0 && _b.length === 0) {
      const e = document.createElement("span");
      e.style.cssText = "color:#bbb;font-size:11px;";
      e.textContent = "暂无标签，加载种子后显示";
      panel.appendChild(e);
      return;
    }
    const merged = [...new Set([..._a, ..._b])];
    merged.forEach((/** @type {any} */ tg) => {
      const on = _b.includes(tg);
      const c = document.createElement("span");
      c.textContent = tg;
      c.style.cssText =
        "display:inline-block;padding:3px 10px;border-radius:8px;cursor:pointer;font-size:12px;line-height:1.4;white-space:nowrap;border:1px solid " +
        (on ? "#e55" : "#9ac6ff") +
        ";background:" +
        (on ? "#fde8e8" : "#eef4ff") +
        ";color:" +
        (on ? "#c00" : "#1a4b8f") +
        ";";
      c.title = on ? "点击取消屏蔽" : "点击屏蔽此TAG";
      c.onclick = () => {
        const cur = __storeVal(__bTags);
        if (cur.includes(tg)) __bTags.set(cur.filter((/** @type {any} */ x) => x !== tg));
        else __bTags.set([...cur, tg]);
      };
      panel.appendChild(c);
    });
  }
  addBtn.onclick = () => {
    const v = inp.value.trim();
    if (!v) return;
    const cur = __storeVal(__bTags);
    if (!cur.includes(v)) __bTags.set([...cur, v]);
    inp.value = "";
  };
  inp.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addBtn.click();
  });
  const ua = __aTags.subscribe((/** @type {any} */ v) => {
    _a = v;
    render();
  });
  const ub = __bTags.subscribe((/** @type {any} */ v) => {
    _b = v;
    render();
  });
  return () => {
    ua();
    ub();
  };
}

/* ---------- 名称过滤 配置面板 ---------- */
/**
 * @param {any} container
 */
function __fillNameFilterSection(container) {
  const h1 = document.createElement("h1");
  h1.className = "s_title";
  h1.textContent = "名称过滤";
  container.appendChild(h1);
  const hint = document.createElement("div");
  hint.style.cssText = "color:#999;font-size:11px;margin:0 0 6px 0;padding:0 10px;";
  hint.textContent = "输入文字后回车(或点添加)生成气泡，命中任一气泡即隐藏卡片；气泡可删除，空格作为匹配字符";
  container.appendChild(hint);
  const chipBox = document.createElement("div");
  chipBox.className = "s_panel";
  chipBox.style.cssText = "display:flex;flex-wrap:wrap;gap:6px;width:100%;box-sizing:border-box;";
  container.appendChild(chipBox);
  const row = document.createElement("div");
  row.style.cssText = "display:flex;gap:4px;padding:8px 10px 0;width:100%;box-sizing:border-box;";
  const inp = document.createElement("input");
  inp.type = "text";
  inp.placeholder = "输入关键词后回车添加";
  inp.style.cssText = "flex:1;min-width:0;border:1px solid #ccc;border-radius:4px;padding:5px 8px;font-size:12px;box-sizing:border-box;";
  const addBtn = document.createElement("button");
  addBtn.textContent = "添加";
  addBtn.style.cssText = "border:none;background:#5b9cf6;color:#fff;border-radius:4px;cursor:pointer;padding:4px 12px;font-size:12px;flex:none;";
  const clearBtn = document.createElement("button");
  clearBtn.textContent = "清空";
  clearBtn.style.cssText = "border:none;background:#e55;color:#fff;border-radius:4px;cursor:pointer;padding:4px 12px;font-size:12px;flex:none;";
  row.appendChild(inp);
  row.appendChild(addBtn);
  row.appendChild(clearBtn);
  container.appendChild(row);
  const countLabel = document.createElement("div");
  countLabel.style.cssText = "color:#999;font-size:11px;padding:4px 10px 0;";
  container.appendChild(countLabel);
  function renderChips() {
    chipBox.textContent = "";
    const kws = __storeVal(__nameFilter) || [];
    kws.forEach((/** @type {any} */ kw, /** @type {any} */ idx) => {
      if (!(kw || "").trim()) return;
      const chip = document.createElement("span");
      chip.style.cssText =
        "display:inline-flex;align-items:center;gap:4px;background:#e8f1ff;border:1px solid #b9d5ff;color:#2b5bb0;border-radius:12px;padding:2px 8px;font-size:12px;max-width:100%;";
      const label = document.createElement("span");
      label.textContent = kw;
      label.style.cssText = "overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:180px;";
      const x = document.createElement("button");
      x.textContent = "×";
      x.title = "移除该关键词";
      x.style.cssText =
        "border:none;background:none;color:#2b5bb0;cursor:pointer;font-size:14px;line-height:1;padding:0 2px;";
      x.onclick = () => {
        const cur = __storeVal(__nameFilter) || [];
        cur.splice(idx, 1);
        __nameFilter.set(cur.slice());
      };
      chip.appendChild(label);
      chip.appendChild(x);
      chipBox.appendChild(chip);
    });
    if (!chipBox.childNodes.length) {
      const empty = document.createElement("span");
      empty.style.cssText = "color:#bbb;font-size:11px;padding:2px 4px;";
      empty.textContent = "暂无过滤关键词";
      chipBox.appendChild(empty);
    }
  }
  function addKeyword() {
    const v = inp.value.trim();
    if (!v) return;
    const cur = __storeVal(__nameFilter) || [];
    if (!cur.includes(v)) cur.push(v);
    __nameFilter.set(cur.slice());
    inp.value = "";
    inp.focus();
  }
  function apply() {
    __applyHideNameFilter();
    renderChips();
    const kws = (__storeVal(__nameFilter) || []).filter((/** @type {any} */ k) => (k || "").trim());
    const total = document.querySelectorAll(".card").length;
    // v1.2.29b: 隐藏改用 CSS class(!important) 而非内联 style.display, 故按 class 统计
    const hidden = document.querySelectorAll(".card.kesa-hide,.card.kesa-hide-read").length;
    countLabel.textContent = kws.length
      ? `已隐藏 ${hidden} / 共 ${total} 个卡片(命中任一关键词)`
      : `共 ${total} 个卡片`;
  }
  inp.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword();
    }
  });
  addBtn.onclick = addKeyword;
  clearBtn.onclick = () => {
    __nameFilter.set([]);
    inp.value = "";
    inp.focus();
  };
  const un = __nameFilter.subscribe(() => apply());
  return () => {
    un();
  };
}

/* ---------- 同步 (WebDAV) 配置面板 ---------- */
/**
 * @param {any} container
 */
function __fillWebDAVSection(container) {
  const h1 = document.createElement("h1");
  h1.className = "s_title";
  h1.textContent = "同步 (WebDAV)";
  container.appendChild(h1);
  const hint = document.createElement("div");
  hint.style.cssText = "color:#999;font-size:11px;margin:0 0 6px 0;padding:0 10px;";
  hint.textContent =
    "配置全局共用(换站不丢); 已读标记/设置/页码按站点各存 3 个独立文件(<host>.read/page/cfg.json), 各站互不干扰、上传下载只同步当前站(省流量)。打开站点自动下载、关闭页面自动上传, 已做流量优化; 也可手动点击下方按钮。侧边栏黄色'最大N页'按钮一键跳转到历史最大页码";
  container.appendChild(hint);
  const panel = document.createElement("div");
  panel.className = "s_panel";
  panel.style.cssText = "display:flex;flex-direction:column;gap:6px;width:100%;";
  container.appendChild(panel);
  /**
   * @param {any} label
   * @param {any} key
   * @param {any} type
   */
  function mkRow(label, key, type) {
    const w = document.createElement("div");
    w.style.cssText = "display:flex;align-items:center;gap:6px;width:100%;";
    const lb = document.createElement("span");
    lb.style.cssText = "width:64px;font-size:12px;color:#333;flex-shrink:0;";
    lb.textContent = label;
    const inp = document.createElement("input");
    inp.type = type || "text";
    inp.value = (__storeVal(__wdvCfg) && __storeVal(__wdvCfg)[key]) || "";
    inp.style.cssText = "flex:1;min-width:0;border:1px solid #ccc;border-radius:4px;padding:3px 6px;font-size:12px;box-sizing:border-box;";
    inp.onchange = () => {
      const cur = __storeVal(__wdvCfg);
      cur[key] = inp.value.trim();
      __wdvCfg.set(cur);
    };
    // 订阅配置变化, 实时把最新值回填到输入框(修复"服务器地址等所有网站都不显示":
    // 占位面板每次打开都重新填充, 只要 store 里有值, 输入框就一定能显示出来)。
    // 用户正在编辑该输入框时跳过回填, 避免光标跳动覆盖输入。
    const un = __wdvCfg.subscribe((/** @type {any} */ v) => {
      if (document.activeElement !== inp) {
        const nv = (v && v[key]) || "";
        if (inp.value !== nv) inp.value = nv;
      }
    });
    w.appendChild(lb);
    w.appendChild(inp);
    panel.appendChild(w);
    return { inp, un };
  }
  /** @type {any[]} */
  const unSubs = [];
  unSubs.push(mkRow("服务器地址", "url", "text").un);
  unSubs.push(mkRow("账号", "user", "text").un);
  unSubs.push(mkRow("密码", "pass", "password").un);
  unSubs.push(mkRow("文件路径", "path", "text").un);
  const status = document.createElement("div");
  status.style.cssText = "color:#3a7;font-size:12px;padding:2px 10px;min-height:16px;word-break:break-all;";
  status.textContent = "";
  container.appendChild(status);
  const btnRow = document.createElement("div");
  btnRow.style.cssText = "display:flex;gap:8px;padding:4px 10px;";
  /**
   * @param {any} text
   * @param {any} fn
   */
  function mkBtn(text, fn) {
    const b = document.createElement("button");
    b.textContent = text;
    b.style.cssText =
      "flex:1;border:none;border-radius:8px;background:#3fa7d6;color:#fff;cursor:pointer;padding:6px 0;font-size:12px;";
    b.onclick = async () => {
      status.style.color = "#d90";
      status.textContent = text + "中...";
      try {
        status.textContent = await fn();
        status.style.color = "#3a7";
      } catch (e) {
        status.style.color = "#c00";
        status.textContent = /** @type {any} */ (e).message;
      }
    };
    btnRow.appendChild(b);
    return b;
  }
  mkBtn("上传到服务器", function () {
    return __wdvUpload(true);
  });
  mkBtn("下载并合并", __wdvDownload);
  container.appendChild(btnRow);
  // 清除页码记录(本地当前站页码; 服务器本站 page.json 在下次下载时可能拉回)
  const clearRow = document.createElement("div");
  clearRow.style.cssText = "display:flex;gap:8px;padding:4px 10px;";
  const clearBtn = document.createElement("button");
  clearBtn.textContent = "清除历史页码记录";
  clearBtn.style.cssText =
    "flex:1;border:none;border-radius:8px;background:#e55;color:#fff;cursor:pointer;padding:6px 0;font-size:12px;";
  clearBtn.onclick = async () => {
    status.style.color = "#d90";
    status.textContent = "清除中...";
    try {
      if (typeof window.__kesaPageSync === "function") window.__kesaPageSync("clearLocal");
      await __wdvUpload(true);
      status.style.color = "#3a7";
      status.textContent = "已清空页码并上传(本地+服务器)";
    } catch (e) {
      status.style.color = "#c00";
      status.textContent = /** @type {any} */ (e).message;
    }
  };
  clearRow.appendChild(clearBtn);
  container.appendChild(clearRow);
  // 返回清理函数: 面板销毁时取消配置订阅(与其他填充函数一致)
  return function () {
    for (let i = 0; i < unSubs.length; i++) {
      try {
        unSubs[i]();
      } catch (e) {}
    }
  };
}

/* ============================================================================
 * 2. WebDAV 核心
 *    同步文件按站点分离成 3 个独立文件(后续调整互不牵连、各站上传下载只读写当前站文件):
 *      PT_Masonry_Sync/<host>.read.json   —— 已读标记
 *      PT_Masonry_Sync/<host>.page.json   —— 页码(每页记录最大翻到几页)
 *      PT_Masonry_Sync/<host>.cfg.json    —— 配置(Kesa:Masonry 过滤/已读相关 + Kesa:Fall)
 *    流量优化: 上传时已读/配置/页码各自按"是否有变化"决定是否写盘, 无变化的不重复上传。
 * ========================================================================== */
// 计算 WebDAV 根目录(服务器地址 + 路径); 路径做 URL 编码, 避免中文/特殊字符被服务器拒收
function __wdvBase() {
  const c = __storeVal(__wdvCfg);
  let p = (c.path || "").trim().replace(/^\/+|\/+$/g, "");
  if (!p) p = "PT_Masonry_Sync";
  p = p
    .split("/")
    .map(function (/** @type {any} */ seg) {
      return encodeURIComponent(seg).replace(/%2F/gi, "/");
    })
    .join("/");
  return (c.url || "").replace(/\/+$/, "") + "/" + p;
}

// 返回某类本站同步文件的 URL (kind: read / page / cfg)
/**
 * @param {string} kind
 */
function __wdvFileUrl(kind) {
  const ext = kind === "read" ? "read.json" : kind === "page" ? "page.json" : "cfg.json";
  return __wdvBase() + "/" + location.hostname + "." + ext;
}

// 读取某类本站同步文件: 成功返回解析对象; 404 返回 null(供迁移); 其他错误抛异常
/**
 * @param {string} kind
 */
async function __wdvReadKind(kind) {
  const r = await __wdvFetch(__wdvFileUrl(kind), "GET", null);
  if (r.status >= 200 && r.status < 300) {
    return JSON.parse(r.responseText || "{}") || {};
  }
  if (r.status === 404) return null;
  if (r.status === 401) {
    throw new Error(
      "读取同步文件失败 HTTP 401(认证失败)：请核对 WebDAV 账号/密码。坚果云等需使用「应用密码」而非登录密码(在 账户信息→安全选项 中生成)",
    );
  }
  throw new Error("读取同步文件失败 HTTP " + r.status);
}

// 写入某类本站同步文件
/**
 * @param {string} kind
 * @param {any} data
 */
async function __wdvWriteKind(kind, data) {
  const r = await __wdvFetch(__wdvFileUrl(kind), "PUT", JSON.stringify(data));
  if (r.status === 401) {
    throw new Error(
      "上传失败 HTTP 401(认证失败)：请核对 WebDAV 账号/密码。坚果云等需使用「应用密码」而非登录密码(在 账户信息→安全选项 中生成)",
    );
  }
  if (r.status < 200 || r.status >= 300) throw new Error("上传失败 HTTP " + r.status);
}

// ---- 旧版数据一次性迁移: 本站单文件 <host>.json 与 统一文件 PT_Masonry_Sync.json ----
// 缓存到页面级, 避免每类文件 404 时重复请求旧文件
/** @type {any} */
let __legacyCache = null;
/**
 * @returns {Promise<any>}
 */
async function __wdvLegacy() {
  if (__legacyCache) return __legacyCache;
  /** @type {{ readIds: any, config: any, pages: any }} */
  const out = { readIds: [], config: null, pages: {} };
  // 1) 旧版统一文件 PT_Masonry_Sync.json: 提取本站已读/配置 + 本站页码(按 URL 域名拆分)
  try {
    const oldUrl = __wdvBase() + "/PT_Masonry_Sync.json";
    const or = await __wdvFetch(oldUrl, "GET", null);
    if (or.status >= 200 && or.status < 300) {
      const j = JSON.parse(or.responseText || "{}") || {};
      const sites = (j.sites && typeof j.sites === "object") ? j.sites : {};
      const pages = (j.pages && typeof j.pages === "object") ? j.pages : {};
      const st = sites[location.hostname] || {};
      out.readIds = Array.isArray(st.readIds) ? st.readIds : [];
      if (st.config && typeof st.config.masonry === "string") out.config = st.config;
      for (const k in pages) {
        try {
          if (new URL(k).hostname === location.hostname) out.pages[k] = pages[k];
        } catch (e) {}
      }
    }
  } catch (e) {}
  // 2) 旧版本站单文件 <host>.json(含 readIds/config/pages): 覆盖/补齐上述数据
  try {
    const r = await __wdvFetch(__wdvBase() + "/" + location.hostname + ".json", "GET", null);
    if (r.status >= 200 && r.status < 300) {
      const j = JSON.parse(r.responseText || "{}") || {};
      if (Array.isArray(j.readIds) && j.readIds.length) out.readIds = j.readIds;
      if (j.config && typeof j.config === "object") out.config = j.config;
      if (j.pages && typeof j.pages === "object") {
        for (const k in j.pages) out.pages[k] = j.pages[k];
      }
    }
  } catch (e) {}
  __legacyCache = out;
  return out;
}

// 读取某类数据: 优先本站独立文件, 404 时尝试从旧文件迁移(一次性)返回历史数据
/**
 * @param {string} kind
 */
async function __wdvReadData(kind) {
  const d = await __wdvReadKind(kind);
  if (d !== null) return d;
  const legacy = await __wdvLegacy();
  if (kind === "read") {
    return { version: 4, host: location.hostname, readIds: legacy.readIds, updated: 0 };
  }
  if (kind === "cfg") {
    return { version: 4, host: location.hostname, config: legacy.config, updated: 0 };
  }
  return { version: 4, host: location.hostname, pages: legacy.pages, updated: 0 };
}

function __wdvAuth() {
  const c = __storeVal(__wdvCfg);
  return "Basic " + btoa(unescape(encodeURIComponent((c.user || "") + ":" + (c.pass || ""))));
}

// 请求封装: 优先 GM_xmlhttpRequest, 回退 fetch
/**
 * @param {any} url
 * @param {any} method
 * @param {any} body
 */
function __wdvFetch(url, method, body) {
  const auth = __wdvAuth();
  return new Promise(function (resolve, reject) {
    if (typeof GM_xmlhttpRequest === "function") {
      GM_xmlhttpRequest({
        method: method,
        url: url,
        headers: { Authorization: auth, "Content-Type": "application/json" },
        data: body || undefined,
        timeout: 30000,
        onload: function (r) {
          resolve(r);
        },
        onerror: function () {
          reject(new Error("网络错误(目标服务器不可达或未开跨域)"));
        },
        ontimeout: function () {
          reject(new Error("请求超时(30s)"));
        },
      });
    } else {
      fetch(url, {
        method: method,
        headers: { Authorization: auth, "Content-Type": "application/json" },
        body: body,
      }).then(
        function (r) {
          r.text().then(function (t) {
            resolve({ status: r.status, responseText: t });
          });
        },
        function (e) {
          reject(e);
        },
      );
    }
  });
}

// 去掉整个 Kesa:Masonry 里的已读 id 子键(_read_ids 或 _read_ids.<host>),
// 让 cfg.json 只同步配置、不再顺带备份已读; 已读完全交给 read.json 精确同步,
// 避免 cfg/read 两文件冗余存同一份已读, 也避免已读增删触发 cfg.json 重复写盘。
/**
 * @param {any} cfgStr
 */
function __cfgStripReads(cfgStr) {
  if (!cfgStr) return cfgStr;
  try {
    const o = JSON.parse(cfgStr);
    for (const k in o) {
      if (k.indexOf("_read_ids") === 0) delete o[k];
    }
    return JSON.stringify(o);
  } catch (e) {
    return cfgStr;
  }
}

// 上传: 把本站已读/配置/页码 分别合并到 3 个本站独立文件(各站独立)。
// 流量优化(坚果云): 手动上传(force=true)三部分全传; 自动上传(force=false)按"是否有变化"逐文件决定, 无变化的不重复写盘。
/**
 * @param {any} force
 */
async function __wdvUpload(force) {
  const c = __storeVal(__wdvCfg);
  if (!c.url || !c.pass) throw new Error("请先填写 WebDAV 配置");
  const ids = [...__storeVal(__readIds)];
  // 配置快照/上传一律用"剔除已读子键"后的净化串, 让 cfg 变化检测只反映真实配置变动。
  const cfgStr = __cfgStripReads(localStorage.getItem("Kesa:Masonry") || "{}");
  const fallStr = localStorage.getItem("Kesa:Fall") || "{}";
  const snapIds = GM_getValue("pt_sync_idsSnap", "");
  const snapCfg = GM_getValue("pt_sync_cfgSnap", "");
  const snapFall = GM_getValue("pt_sync_cfgFallSnap", "");
  const idsChanged = ids.join(",") !== snapIds;
  const cfgChanged = cfgStr !== snapCfg || fallStr !== snapFall;
  const pagesDirty =
    typeof window.__kesaPageSync === "function" && window.__kesaPageSync("isDirty");
  if (!force && !idsChanged && !cfgChanged && !pagesDirty) {
    return "无变化, 跳过上传(节省流量)";
  }

  // ---- 已读(仅读 read.json) ----
  let readMsg = "已读无变化";
  if (force || idsChanged) {
    const rd = await __wdvReadData("read");
    const stIds = Array.isArray(rd.readIds) ? rd.readIds : [];
    const merged = [...new Set([...stIds, ...ids])];
    rd.readIds = merged;
    rd.updated = Date.now();
    await __wdvWriteKind("read", rd);
    readMsg = "已上传 " + merged.length + " 条已读标记";
    if (merged.length !== __storeVal(__readIds).length) {
      __readIds.set(merged);
      __applyReadClasses();
    }
    GM_setValue("pt_sync_idsSnap", merged.join(","));
  }

  // ---- 配置(仅读写 cfg.json, 含过滤/已读相关设置) ----
  let cfgMsg = "配置无变化";
  if (force || cfgChanged) {
    const cf = await __wdvReadData("cfg");
    cf.config = { masonry: cfgStr, fall: fallStr };
    cf.updated = Date.now();
    await __wdvWriteKind("cfg", cf);
    cfgMsg = "配置已同步";
    GM_setValue("pt_sync_cfgSnap", cfgStr);
    GM_setValue("pt_sync_cfgFallSnap", fallStr);
  }

  // ---- 页码(仅读写 page.json, 逐 key 取 max 合并, 本地为空保留远端) ----
  // 站点隔离: pages 的 key 是含 host 的完整 URL, 本站 page.json 只应存本站页码。
  // 此前直接把跨站本地 pt_pagemax 全量(含其它站 URL key)逐 key 写回本站文件, 造成
  // 单站 page.json 混入其它站页码, 下载时又把别站页码并回本地 → 跨站互相污染。
  let pageMsg = "页码无变化";
  if (force || pagesDirty) {
    const pg = await __wdvReadData("page");
    const remote = (pg.pages && typeof pg.pages === "object") ? pg.pages : {};
    // 只保留远端文件中属于本站 host 的页码(丢弃历史混入的其它站 key)
    const siteOnly = {};
    for (const h in remote) {
      try {
        if (new URL(h).hostname === location.hostname) siteOnly[h] = remote[h];
      } catch (e) {
        siteOnly[h] = remote[h]; // key 不是合法 URL(无法判站)时保守保留
      }
    }
    const local =
      typeof window.__kesaPageSync === "function" ? window.__kesaPageSync("get") : null;
    if (local && typeof local === "object") {
      for (const h in local) {
        let sameSite = false;
        try {
          sameSite = new URL(h).hostname === location.hostname;
        } catch (e) {}
        if (!sameSite) continue; // 只合并本站本地页码, 不把其它站写入本站文件
        const lv = (local[h] && local[h].max) || 0;
        const rv = (siteOnly[h] && siteOnly[h].max) || 0;
        if (lv > rv) siteOnly[h] = { max: lv };
      }
    }
    pg.pages = siteOnly;
    pg.updated = Date.now();
    await __wdvWriteKind("page", pg);
    const pageInfo =
      typeof window.__kesaPageSync === "function" ? window.__kesaPageSync("maxPage") || 0 : 0;
    pageMsg = "页码已合并(当前站最大 " + pageInfo + " 页)";
    if (typeof window.__kesaPageSync === "function") window.__kesaPageSync("setDirty", false);
  }
  return readMsg + "，" + cfgMsg + "，" + pageMsg;
}

// 下载: 读取本站 3 个独立文件并合并本站已读/配置/页码(各站独立, 只读本站文件)
/**
 * @param {any} [updateHistSnapshot]
 */
async function __wdvDownload(updateHistSnapshot) {
  const c = __storeVal(__wdvCfg);
  if (!c.url || !c.pass) throw new Error("请先填写 WebDAV 配置");

  // ---- 已读(read.json) ----
  const rd = await __wdvReadData("read");
  const remote = Array.isArray(rd.readIds) ? rd.readIds : [];
  const merged = [...new Set([...__storeVal(__readIds), ...remote])];
  // 打开页面拉取的远端已读也属于"历史观看"(本会话点击之前), 刷新快照使"隐藏历史观看"一并生效
  if (updateHistSnapshot) __historyReadSnapshot = [...merged];
  __readIds.set(merged);
  __applyReadClasses();

  // ---- 配置(cfg.json): 合并远端缺失子键到本地 Kesa:Masonry ----
  let cfgMsg = "配置无变化";
  const cf = await __wdvReadData("cfg");
  if (cf.config && typeof cf.config.masonry === "string") {
    try {
      const far = JSON.parse(cf.config.masonry);
      const local = JSON.parse(localStorage.getItem("Kesa:Masonry") || "{}");
      let changed = false;
      for (const k in far) {
        if (local[k] === undefined) {
          local[k] = far[k];
          changed = true;
        }
      }
      if (changed) {
        localStorage.setItem("Kesa:Masonry", JSON.stringify(local));
        cfgMsg = "配置已同步(刷新后生效)";
      }
    } catch (e) {}
  }

  // ---- 页码(page.json): 合并进页码模块本地存储 ----
  const pg = await __wdvReadData("page");
  let pageMsg = "";
  if (typeof window.__kesaPageSync === "function" && pg.pages && typeof pg.pages === "object") {
    pageMsg = window.__kesaPageSync("merge", pg.pages) || "";
  }
  return "已下载并合并，共 " + merged.length + " 条已读标记，" + cfgMsg + "，" + pageMsg;
}

/* ============================================================================
 * 3. 自动同步 + 桥接
 * ========================================================================== */
/**
 * @param {any} fn
 * @param {any} tag
 */
function __wdvAutoRun(fn, tag) {
  try {
    const c = __storeVal(__wdvCfg);
    if (!c.url || !c.pass) return;
    fn()
      .then(function (/** @type {any} */ m) {
        console.log("[WebDAV] " + tag + ":", m);
      })
      .catch(function (/** @type {any} */ e) {
        console.warn("[WebDAV] " + tag + "失败:", e.message);
      });
  } catch (e) {}
}

// 打开页面自动下载 (每 10 分钟最多拉取 1 次, 节省流量)
function __wdvAutoSync() {
  const last = parseInt(GM_getValue("pt_sync_lastGetIds", "0"), 10) || 0;
  if (Date.now() - last < 10 * 60000) return;
  GM_setValue("pt_sync_lastGetIds", String(Date.now()));
  __wdvAutoRun(function () {
    return __wdvDownload(true);
  }, "打开页面自动同步");
}

// 关闭页面自动上传 (无变化则跳过)
function __wdvAutoPush() {
  __wdvAutoRun(function () {
    return __wdvUpload(false);
  }, "关闭页面自动上传");
}

// 桥接: 供自包含的"全局同步/页码同步"模块调用已读标记/设置的上传下载
window.__kesaWdSync = function (/** @type {any} */ action) {
  try {
    if (action === "upload") return __wdvUpload(true);
    if (action === "autopush") return __wdvUpload(false); // 自动上传: 无变化则跳过(省流量)
    if (action === "download") return __wdvDownload();
  } catch (e) {
    return Promise.reject(e);
  }
  return Promise.resolve("未操作");
};

/* ============================================================================
 * 4. 刷新后恢复页码 (实时记录 + 刷新跳转)
 * ========================================================================== */
function __kesaStateKey() {
  return "__kesaState_" + location.hostname;
}

/**
 * @param {any} n
 */
function __kesaSavePageState(n) {
  try {
    // 恢复跳转期间(旧页面被替换前)不覆盖已保存状态
    if (window.__kesaRestoring) return;
    const key = __kesaStateKey();
    const st = JSON.parse(localStorage.getItem(key) || "null") || {};
    st.page = n || 1;
    const u = new URL(location.href);
    u.searchParams.delete("page");
    u.searchParams.delete("pageNumber");
    st.url = u.toString(); // 保留筛选/排序, 去掉页码参数
    st.ts = Date.now();
    localStorage.setItem(key, JSON.stringify(st));
    try {
      sessionStorage.setItem("__kesa_lastUrl", location.href);
    } catch (e2) {}
  } catch (e) {}
}

function __kesaRestorePage() {
  try {
    // 仅"真实刷新"(F5/Ctrl+R, navigation type=reload)才恢复页码;
    // 手动改URL回车/点击链接/前进后退(type=navigate/back_forward)属导航, 一律不恢复
    let navType = "";
    try {
      const nav = /** @type {PerformanceNavigationTiming | undefined} */ (performance.getEntriesByType("navigation")[0]);
      navType = nav ? nav.type : "";
    } catch (e) {}
    if (navType && navType !== "reload") {
      try {
        sessionStorage.setItem("__kesa_lastUrl", location.href);
      } catch (e2) {}
      return;
    }
    const st = JSON.parse(localStorage.getItem(__kesaStateKey()) || "null");
    if (!st || !st.page || st.page < 1) return;
    const last = sessionStorage.getItem("__kesa_lastUrl");
    // 首次访问/新标签页(sessionStorage 为空): 不恢复
    if (!last) {
      try {
        sessionStorage.setItem("__kesa_lastUrl", location.href);
      } catch (e2) {}
      return;
    }
    const base = (/** @type {any} */ u) => {
      const x = new URL(u);
      x.searchParams.delete("page");
      x.searchParams.delete("pageNumber");
      return x.toString();
    };
    // 与上次浏览的基础URL(忽略页码)不一致 => 用户导航到其它页/类别, 不恢复
    if (base(location.href) !== base(last)) {
      try {
        sessionStorage.setItem("__kesa_lastUrl", location.href);
      } catch (e2) {}
      return;
    }
    const isNX = __kesaIsNX();
    const u = new URL(location.href);
    const cur = Number(u.searchParams.get(isNX ? "page" : "pageNumber")) || 1;
    if (cur === st.page) return;
    const target = new URL(st.url || location.href);
    target.searchParams.set(isNX ? "page" : "pageNumber", st.page);
    console.log("[恢复页码] 刷新后跳转:", target.toString(), "saved=", st.page, "cur=", cur);
    window.__kesaRestoring = true; // 阻止旧页面在替换前覆盖已保存状态
    location.replace(target.toString());
  } catch (e) {}
}

// NexusPHP 站点列表页(.php, 如 torrents.php/special.php/adults.php)用 page 参数; M-Team(/browse)用 pageNumber
function __kesaIsNX() {
  return /\.php/i.test(location.pathname);
}

// ---- 侧边栏"第 N 页"指示器(点击直接跳转该页真实 URL) ----
function __kesaCurPage() {
  try {
    const sp = new URLSearchParams(location.search);
    const v = parseInt(sp.get("page") || sp.get("pageNumber") || sp.get("p") || "", 10);
    return isNaN(v) || v < 1 ? 1 : v;
  } catch (e) {
    return 1;
  }
}
function __kesaPageUrl(/** @type {any} */ n) {
  try {
    const u = new URL(location.href);
    // 替换而非新增: 先清掉两个页码参数, 再设置正确的那个
    u.searchParams.delete("page");
    u.searchParams.delete("pageNumber");
    u.searchParams.set(__kesaIsNX() ? "page" : "pageNumber", n);
    return u.toString();
  } catch (e) {
    return location.href;
  }
}
function __kesaPageInd(/** @type {any} */ n) {
  try {
    if (!document.getElementById("__kesaPageCss")) {
      const st = document.createElement("style");
      st.id = "__kesaPageCss";
      st.textContent =
        ".kesaPageGo{display:block;text-align:center;font-size:11px;font-weight:600;color:#fff;background:rgba(64,64,64,.85);border-radius:8px;padding:3px 6px;margin:4px 6px;line-height:1.5;cursor:pointer}.kesaPageGo:hover{background:#0054b0}";
      (document.head || document.documentElement).appendChild(st);
    }
    const cur = n || __kesaCurPage();
    // 实时记录页码(在判断侧边栏之前, 确保任何情况下都记录), 供刷新后恢复
    __kesaSavePageState(cur);
    // 真实页码显示在侧边栏底部, 点击可直接跳转到该页真实 URL(便于存档)
    const sb = document.querySelector(".sideP");
    if (!sb) return;
    /** @type {any} */
    let el = document.querySelector(".kesaPageGo");
    if (!el) {
      el = document.createElement("div");
      el.className = "kesaPageGo";
      el.addEventListener("click", () => {
        const pg = parseInt(el.dataset.page, 10) || 1;
        __kesaSavePageState(pg);
        location.href = __kesaPageUrl(pg);
      });
      sb.appendChild(el);
    }
    el.dataset.page = String(cur);
    el.textContent = "第 " + cur + " 页";
  } catch (e) {}
}

/* ============================================================================
 * 5. 多设备页码同步(WebDAV): 记录/合并最大页码, 悬浮按钮跳转
 *    (原 bundle 的自包含 IIFE, 移植为模块内的自执行部分)
 * ========================================================================== */
(function () {
  // 本地页码数据(GM key pt_pagemax): 只负责本地记录/合并最大页码 + 悬浮跳转按钮;
  // 网络同步(上传/下载)统一由主作用域"已读标记同步"处理(本站独立文件 PT_Masonry_Sync/<host>.page.json),
  // 本模块通过 window.__kesaPageSync 桥接把本地页码交给主作用域上传/合并, 避免双写。
  function __pmGet() {
    try {
      return JSON.parse(GM_getValue("pt_pagemax", "null")) || {};
    } catch (e) {
      return {};
    }
  }
  /**
   * @param {any} st
   */
  function __pmSet(st) {
    try {
      GM_setValue("pt_pagemax", JSON.stringify(st));
    } catch (e) {}
  }
  // 归一化任一URL为页面上下文key: 去页码 + 去NexusPHP默认筛选参数
  /**
   * @param {any} u
   */
  function __pmNormKey(u) {
    try {
      const x = new URL(u);
      x.searchParams.delete("page");
      x.searchParams.delete("pageNumber");
      // NexusPHP 站点(如 kamept/ptfans)导航时强制附加的默认筛选参数: 去掉默认值, 使"无参数"与"带默认参数"的同一列表共享页码key
      if (x.searchParams.get("inclbookmarked") === "0") x.searchParams.delete("inclbookmarked");
      if (x.searchParams.get("spstate") === "0") x.searchParams.delete("spstate");
      if (x.searchParams.get("incldead") === "1") x.searchParams.delete("incldead");
      return x.toString();
    } catch (e) {
      return u;
    }
  }
  // 页面上下文key = 当前页归一化base URL, 使同一站点不同分类/筛选各记各的
  function __pmKey() {
    return __pmNormKey(location.href);
  }
  // 迁移旧数据: 旧key含默认筛选参数, 归一化后合并(保留较大max)
  function __pmMigrate() {
    try {
      const st = __pmGet();
      let changed = false;
      for (const k in st) {
        const nk = __pmNormKey(k);
        if (nk !== k) {
          if (!st[nk] || st[k].max > st[nk].max) st[nk] = st[k];
          delete st[k];
          changed = true;
        }
      }
      if (changed) __pmSet(st);
    } catch (e) {}
  }
  /**
   * @param {any} key
   */
  function __pmMaxFor(key) {
    const e = __pmGet()[key];
    return e && e.max ? e.max : 0;
  }
  // ---- 本地脏标记: 页码变化置脏; 实际上传/下载由主作用域统一处理(关页兜底+手动按钮) ----
  let __pmDirty = false;
  /**
   * @param {any} pg
   */
  function __pmRecord(pg) {
    try {
      const host = __pmKey();
      const st = __pmGet();
      const cur = st[host];
      if (!cur || pg > (cur.max || 0)) {
        st[host] = { max: pg };
        __pmSet(st);
        __pmDirty = true; // 仅置脏, 交给主作用域上传
      }
    } catch (e) {}
  }
  // 桥接给主作用域: 读取本地页码 / 合并远端页码 / 查询与重置脏标记 / 清空本地页码
  window.__kesaPageSync = function (/** @type {any} */ action, /** @type {any} */ data) {
    try {
      if (action === "get") return __pmGet();
      if (action === "merge" && data && typeof data === "object") {
        const st = __pmGet();
        let changed = false;
        let maxCur = 0;
        for (const h in data) {
          const rv = (data[h] && data[h].max) || 0;
          const lv = (st[h] && st[h].max) || 0;
          if (rv > lv) {
            st[h] = { max: rv };
            changed = true;
          }
          if (rv > maxCur) maxCur = rv;
        }
        if (changed) __pmSet(st);
        // 合并远端页码后刷新悬浮"最大N页"按钮文本, 否则按钮停留在启动时的旧值(需求: 最大X页需从webdav同步下来)
        if (changed) {
          try {
            __pmBtn();
          } catch (e) {}
        }
        const curMax = (st[__pmKey()] && st[__pmKey()].max) || maxCur || 0;
        return changed
          ? "页码已合并(当前站最大 " + curMax + " 页)"
          : "页码已是最新(当前站最大 " + curMax + " 页)";
      }
      if (action === "isDirty") return !!__pmDirty;
      if (action === "maxPage") {
        const st = __pmGet();
        const cur = st[__pmKey()];
        return (cur && cur.max) || 0;
      }
      if (action === "setDirty") {
        __pmDirty = !!data;
        return;
      }
      if (action === "clearLocal") {
        __pmSet({});
        __pmDirty = true;
        return;
      }
    } catch (e) {}
    return undefined;
  };
  function __pmCurrentPage() {
    // 页内"加载下一页"时地址栏页码不更新(fetch拼接), 只有侧边栏"第 N 页"指示器 data-page 是最新权威值
    try {
      const go = document.querySelector(".kesaPageGo");
      if (go) {
        const n = parseInt(/** @type {any} */ (go.dataset.page), 10);
        if (!isNaN(n) && n >= 1) return n;
      }
    } catch (e) {}
    try {
      const u = new URL(location.href);
      const isNX = /\.php/i.test(location.pathname);
      const n = parseInt(/** @type {any} */ (u.searchParams.get(isNX ? "page" : "pageNumber")), 10);
      return isNaN(n) ? 1 : n;
    } catch (e) {
      return 1;
    }
  }
  /**
   * @param {any} pg
   */
  function __pmUrlForPage(pg) {
    try {
      const u = new URL(location.href);
      u.searchParams.delete("page");
      u.searchParams.delete("pageNumber");
      // NexusPHP(.php, 如 ptfans special.php)用 page; M-Team 用 pageNumber; 保留筛选/排序参数
      u.searchParams.set(/\.php/i.test(location.pathname) ? "page" : "pageNumber", String(Math.max(1, pg)));
      return u.toString();
    } catch (e) {
      return location.href;
    }
  }
  // 悬浮按钮(侧边栏, sideP 风格)
  function __pmBtn() {
    try {
      const sb = document.querySelector(".sideP");
      if (!sb) return;
      /** @type {any} */
      let el = document.querySelector(".kesaPageMaxGo");
      if (!el) {
        el = document.createElement("div");
        el.className = "kesaPageMaxGo";
        el.title = "打开本PT站历史最大页码(多设备WebDAV同步)";
        el.addEventListener("click", function () {
          const m = __pmMaxFor(__pmKey());
          if (m < 1) {
            el.textContent = "暂无页码记录";
            setTimeout(function () {
              if (el.isConnected) el.textContent = "最大页码: -";
            }, 1500);
            return;
          }
          el.textContent = "正在打开第 " + m + " 页...";
          location.href = __pmUrlForPage(m);
        });
        sb.appendChild(el);
      }
      const m = __pmMaxFor(__pmKey());
      el.textContent = m >= 1 ? "最大 " + m + " 页" : "最大页码: -";
    } catch (e) {}
  }
  // 底部页码选择器(上一页/当前页/下一页/跳转; 所有站点通用)
  let __pmSelLog = 0;
  function __pmPageSel() {
    try {
      // 已存在: 仅更新当前页显示与上一页禁用态
      const old = document.getElementById("kesaMtPageSel");
      if (old) {
        const c = __pmCurrentPage();
        const curEl = document.getElementById("kesaMtPageSelCur");
        if (curEl) curEl.textContent = "第 " + c + " 页";
        const prevBtn = /** @type {HTMLButtonElement | null} */ (document.getElementById("kesaMtPageSelPrev"));
        if (prevBtn) prevBtn.disabled = c <= 1;
        return;
      }
      // 页码选择器(上一页/下一页/跳转)注入位置: 放到"点击加载下一页"按钮(#_turnPage)之后,
      // 即瀑布流卡片框架外面、加载下一页按钮下方, 符合"卡片 → 点击加载下一页 → 页码导航"的阅读顺序。
      // 说明: 真实的"点击加载下一页"按钮是 BtnTurnPage 组件的 #_turnPage(普通文档流, 位于 .nextPage 容器内);
      // 而 _index.svelte 里的 #turnPage 是 position:absolute 的占位(display:none, 位于瀑布流内部),
      // **不能**作为定位依据(否则页码导航会被插到瀑布流内部, 位置异常)。
      // 定位一律以 .nextPage(瀑布流卡片框架外、卡片下方)为锚, 用 insertAdjacentElement("afterend")
      // 把页码导航插到该容器之后; 无 .nextPage 时兜底插到瀑布流容器 div.waterfall 之后。
      let wrap = null;
      const np = document.querySelector("div.nextPage");
      const btn0 = document.getElementById("_turnPage");
      if (btn0) {
        // 定位"点击加载下一页"按钮的容器(.nextPage / 按钮父元素), 页码导航插到容器之后
        wrap = btn0.parentElement || btn0.parentNode || np;
      } else if (np) {
        // #_turnPage 缺失(M-Team SPA 可能重建 .nextPage 使 BtnTurnPage 挂载丢失): 直接用 .nextPage 作为锚
        wrap = np;
      } else {
        const wf = document.querySelector("div.waterfall");
        if (wf && wf.parentNode) {
          // 无按钮容器时兜底: 插到瀑布流容器之后
          wrap = wf;
        }
      }
      if (!wrap) {
        if (__pmSelLog++ < 3) console.log("[kesa] 页码选择器: 未找到可注入位置");
        return;
      }
      // 兜底创建"点击加载下一页"按钮: BtnTurnPage 组件在 M-Team SPA 重建 .nextPage 后挂载丢失,
      // 导致瀑布流下"没有加载下一页按钮"。这里在 .nextPage 内重建(仅当缺失时), 自愈补上。
      try {
        const npEl = document.querySelector("div.nextPage");
        if (npEl && !document.getElementById("_turnPage")) {
          const tb = document.createElement("button");
          tb.id = "_turnPage";
          tb.textContent = "点击加载下一页";
          tb.style.cssText =
            "width:100%;height:32px;border-radius:16px;line-height:20px;font-size:14px;margin:10px 0;padding:0 10px;border:1px solid #3fa7d6;background:#fff;color:#3fa7d6;cursor:pointer;";
          tb.onclick = function (ev) {
            if (ev && ev.preventDefault) ev.preventDefault();
            // 优先用 window.turnPage 原地接续加载(瀑布流模式): NexusPHP(.php)与 M-Team(SPA, 走 /search API 追加)都支持;
            // 仅当 turnPage 不可用(如未处于瀑布流模式)时, 才退回 URL 翻页(跳 pageNumber)。
            if (typeof window.turnPage === "function") {
              window.turnPage(ev);
            } else {
              location.href = __pmUrlForPage(__pmCurrentPage() + 1);
            }
          };
          npEl.appendChild(tb);
        }
      } catch (e) {}
      const box = document.createElement("div");
      box.id = "kesaMtPageSel";
      // position:relative + z-index 参照参考版 1.2.3b: 页码选择器(上一页/下一页/跳转)需置于卡片之上,
      // 否则会被 Masonry 绝对定位的卡片盖住(尤其非 M-Team 站"被压到卡片下面")。
      box.style.cssText = "display:flex;align-items:center;gap:6px;justify-content:center;margin-top:8px;flex-wrap:wrap;position:relative;z-index:20000;";
      const btnStyle =
        "border:none;background:#3fa7d6;color:#fff;border-radius:4px;padding:4px 12px;font-size:12px;cursor:pointer;";
      const prev = document.createElement("button");
      prev.id = "kesaMtPageSelPrev";
      prev.textContent = "◀ 上一页";
      prev.style.cssText = btnStyle;
      prev.onclick = function () {
        const t = __pmCurrentPage() - 1;
        // M-Team/NEX(.php 站)优先用 AJAX 换页(不整体刷新); 不可用则退回整体跳转
        if (typeof window.__kesaMTTurnPage === "function" && window.__kesaMTTurnPage(t)) return;
        if (typeof window.__kesaNexTurnPage === "function" && window.__kesaNexTurnPage(t)) return;
        location.href = __pmUrlForPage(t);
      };
      const cur = document.createElement("span");
      cur.id = "kesaMtPageSelCur";
      cur.style.cssText = "color:#333;font-size:12px;font-weight:600;min-width:52px;text-align:center;";
      cur.textContent = "第 " + __pmCurrentPage() + " 页";
      const next = document.createElement("button");
      next.textContent = "下一页 ▶";
      next.style.cssText = btnStyle;
      next.onclick = function () {
        const t = __pmCurrentPage() + 1;
        // M-Team/NEX(.php 站)优先用 AJAX 换页(不整体刷新); 不可用则退回整体跳转
        if (typeof window.__kesaMTTurnPage === "function" && window.__kesaMTTurnPage(t)) return;
        if (typeof window.__kesaNexTurnPage === "function" && window.__kesaNexTurnPage(t)) return;
        location.href = __pmUrlForPage(t);
      };
      const inp = document.createElement("input");
      inp.type = "number";
      inp.min = "1";
      inp.placeholder = "N";
      inp.style.cssText =
        "width:56px;border:1px solid #ccc;border-radius:4px;padding:2px 6px;font-size:12px;text-align:center;";
      const go = document.createElement("button");
      go.textContent = "跳转";
      go.style.cssText = btnStyle;
      go.onclick = function () {
        const n = parseInt(inp.value, 10);
        if (!n || n < 1) return;
        // M-Team/NEX(.php 站)优先用 AJAX 换页(不整体刷新); 不可用则退回整体跳转
        if (typeof window.__kesaMTTurnPage === "function" && window.__kesaMTTurnPage(n)) return;
        if (typeof window.__kesaNexTurnPage === "function" && window.__kesaNexTurnPage(n)) return;
        location.href = __pmUrlForPage(n);
      };
      inp.addEventListener("keydown", function (e) {
        if (e.key === "Enter") go.click();
      });
      box.appendChild(prev);
      box.appendChild(cur);
      box.appendChild(next);
      box.appendChild(inp);
      box.appendChild(go);
      // 注入位置: 统一用 insertAdjacentElement("afterend") 插到"点击加载下一页"按钮容器
      // (.nextPage)之后, 即卡片框架外、按钮下方; 兜底时插到瀑布流容器之后。
      /** @type {Element} */ (wrap).insertAdjacentElement("afterend", box);
      prev.disabled = __pmCurrentPage() <= 1;
      console.log("[kesa] 页码选择器已注入");
    } catch (e) {}
  }
  // CSS
  try {
    if (!document.getElementById("__kesaPageMaxCss")) {
      const st = document.createElement("style");
      st.id = "__kesaPageMaxCss";
      st.textContent =
        ".kesaPageMaxGo{display:block;text-align:center;font-size:11px;font-weight:600;color:#ff0;background:rgba(64,64,64,.85);border-radius:8px;padding:3px 6px;margin:4px 6px;line-height:1.5;cursor:pointer}.kesaPageMaxGo:hover{background:#6531ff}";
      (document.head || document.documentElement).appendChild(st);
    }
  } catch (e) {}
  // 记录/轮询: 本地记录最大页码 + 注入页码选择器/悬浮跳转按钮
  let __pmLastPage = 0;
  __pmMigrate(); // 启动即迁移旧key, 让无参数/带默认参数的同一列表立即共享最大页码
  setTimeout(function () {
    __pmPageSel(); // 尽早尝试注入页码选择器
    __pmBtn();
  }, 1000);
  setInterval(function () {
    try {
      const pg = __pmCurrentPage();
      if (pg !== __pmLastPage) {
        __pmLastPage = pg;
        __pmRecord(pg);
      }
      __pmMigrate(); // 迁移旧key(含默认筛选参数)为归一化key, 使无参数/带默认参数同列表共享
      __pmBtn();
      __pmPageSel();
    } catch (e) {}
  }, 2000);
  // 上传/下载由主作用域统一处理(打开自动下载+关页兜底上传), 本模块仅提供本地数据与桥接, 避免双写
})();

/* ============================================================================
 * 导出 + 挂载到 window (供宿主调用)
 * ========================================================================== */
// ES 命名导出
export {
  __readIds,
  __hideReadCards,
  __wdvCfg,
  __nameFilter,
  __bTags,
  __aTags,
  __hideHistoryRead,
  __showInfoOnPicFail,
  __stateHoverPic,
  __historyReadSnapshot,
  __wdvUpload,
  __wdvDownload,
  __wdvAutoSync,
  __wdvAutoPush,
  __applyReadClasses,
  __applyHideReadCards,
  __applyHideNameFilter,
  __initReadTracking,
  __fillWebDAVSection,
  __fillReadSection,
  __fillNameFilterSection,
  __fillTagSection,
  __mkSwitchRow,
  __markRead,
  __extractId,
  __kesaStateKey,
  __kesaSavePageState,
  __kesaRestorePage,
  __kesaIsNX,
  __kesaCurPage,
  __kesaPageUrl,
  __kesaPageInd,
};

// 挂载到 window：读取追踪 / WebDAV / 页码
window.__kesaRead = {
  readIds: __readIds,
  hideReadCards: __hideReadCards,
  hideHistoryRead: __hideHistoryRead,
  historyReadSnapshot: __historyReadSnapshot,
  markRead: __markRead,
  applyReadClasses: __applyReadClasses,
  applyHideReadCards: __applyHideReadCards,
  applyHideNameFilter: __applyHideNameFilter,
  initReadTracking: __initReadTracking,
  extractId: __extractId,
};

window.__kesaWd = {
  cfg: __wdvCfg,
  nameFilter: __nameFilter,
  bTags: __bTags,
  aTags: __aTags,
  showInfoOnPicFail: __showInfoOnPicFail,
  stateHoverPic: __stateHoverPic,
  upload: __wdvUpload,
  download: __wdvDownload,
  autoSync: __wdvAutoSync,
  autoPush: __wdvAutoPush,
};

window.__kesaPage = {
  stateKey: __kesaStateKey,
  savePageState: __kesaSavePageState,
  restorePage: __kesaRestorePage,
  isNX: __kesaIsNX,
  curPage: __kesaCurPage,
  pageUrl: __kesaPageUrl,
  pageInd: __kesaPageInd,
  mkSwitchRow: __mkSwitchRow,
  fillWebDAVSection: __fillWebDAVSection,
  fillReadSection: __fillReadSection,
  fillNameFilterSection: __fillNameFilterSection,
  fillTagSection: __fillTagSection,
};
