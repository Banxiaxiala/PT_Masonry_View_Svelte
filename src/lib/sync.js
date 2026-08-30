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

function __mkLocalStore(key, defaultValue) {
  let value = defaultValue;
  // 初始化：从 localStorage 读取
  try {
    const obj = JSON.parse(localStorage.getItem(__STORE_NS) || "{}") || {};
    if (obj[key] !== undefined) value = obj[key];
  } catch (e) {}
  const subs = new Set();
  const store = {
    get() {
      return value;
    },
    set(v) {
      const changed = v !== value;
      value = v;
      // 持久化到 localStorage
      try {
        const obj = JSON.parse(localStorage.getItem(__STORE_NS) || "{}") || {};
        obj[key] = v;
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
    subscribe(cb) {
      subs.add(cb);
      return function () {
        subs.delete(cb);
      };
    },
    update(fn) {
      return store.set(fn(value));
    },
  };
  return store;
}

// 读取 store 当前值 (等价原 bundle 的 it(t))
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
  subscribe(cb) {
    __wdvCfgSubs.add(cb);
    return function () {
      __wdvCfgSubs.delete(cb);
    };
  },
  update(fn) {
    return __wdvCfg.set(fn(__wdvCfgValue));
  },
};

// 标记单个种子为已读
function __markRead(id) {
  const cur = __storeVal(__readIds);
  if (!cur.includes(id)) {
    __readIds.set([...cur, id]);
  }
}

// 应用"隐藏已读卡片 / 隐藏历史观看"
function __applyHideReadCards() {
  const hide = __storeVal(__hideReadCards),
    hideHist = __storeVal(__hideHistoryRead);
  // 每次应用都按"进入页面时的已读快照"实时判定历史观看, 不依赖一次性卡片标记,
  // 从而保证无论卡片何时渲染/已读何时合并都能正确隐藏(修复"刷新后需点配置才生效")
  document.querySelectorAll(".card.pt-read").forEach((el) => {
    const id = __extractId(el);
    const isHist = hideHist && id && __historyReadSnapshot.includes(id);
    el.style.display = hide || isHist ? "none" : "";
  });
  if (hide || hideHist) {
    document.querySelectorAll(".card:not(.pt-read)").forEach((el) => {
      if (el.style.display === "none") el.style.display = "";
    });
  }
}

// 取卡片标题文字
function __cardName(el) {
  const a = el.querySelector(".card-title a.two-lines");
  if (a) return (a.textContent || "").trim();
  const t = el.querySelector(".card-title");
  if (t) return (t.textContent || "").trim();
  return "";
}

// 应用名称过滤：命中任一关键词即隐藏卡片
function __applyHideNameFilter() {
  const kws = (__storeVal(__nameFilter) || []).filter((k) => (k || "").trim());
  document.querySelectorAll(".card").forEach((el) => {
    if (!kws.length) {
      if (el.__nameFiltered) {
        el.style.display = "";
        el.__nameFiltered = false;
      }
      return;
    }
    const name = __cardName(el).toLowerCase();
    const hit = kws.some((k) => name.indexOf(String(k).toLowerCase()) !== -1);
    el.style.display = hit ? "none" : "";
    el.__nameFiltered = hit;
  });
}

// 从卡片 DOM 提取种子 ID
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
    ".card.pt-read{opacity:0.55!important;filter:grayscale(0.6)!important;transition:opacity .3s ease,filter .3s ease!important}.card.pt-read:hover{opacity:0.75!important;filter:grayscale(0.3)!important}";
  document.head.appendChild(s);
  // 首次加载即标记已读并应用隐藏(含"隐藏历史观看"), 否则需开关一次才生效
  __applyReadClasses();
  // 点击/中键标记已读(中键视为同款标记); 标记后由 __applyReadClasses 统一更新卡片状态与隐藏
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
function __mkSwitch(checked, onChange) {
  const w = document.createElement("div");
  w.className = "s_switch svelte-zt6zlx svelte-zt6zlx";
  const inp = document.createElement("input");
  inp.type = "checkbox";
  inp.className = "svelte-zt6zlx svelte-zt6zlx";
  inp.checked = !!checked;
  const id = "_kesa_sw_" + Math.random().toString(36).slice(2, 10);
  inp.id = id;
  const lb = document.createElement("label");
  lb.className = "svelte-zt6zlx svelte-zt6zlx";
  lb.setAttribute("for", id);
  inp.addEventListener("change", function () {
    onChange(inp.checked);
  });
  w.appendChild(inp);
  w.appendChild(lb);
  return w;
}

// 开关行 (label + checkbox 样式开关)
function __mkSwitchRow(labelText, checked, onChange, desc) {
  const row = document.createElement("div");
  row.className = "switch svelte-zt6zlx svelte-zt6zlx";
  const lb = document.createElement("div");
  lb.className = "s_title svelte-zt6zlx";
  lb.textContent = labelText;
  if (desc) lb.title = desc;
  const sw = __mkSwitch(checked, function (v) {
    onChange(v);
  });
  row.appendChild(lb);
  row.appendChild(sw);
  return row;
}

/* ---------- 已读标记 配置面板 ---------- */
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
  const ua = __readIds.subscribe((v) => {
    countLabel.textContent = `已标记 ${v.length} 个种子`;
    __applyReadClasses();
  });
  return () => {
    ua();
  };
}

/* ---------- TAG 过滤 配置面板 ---------- */
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
  let _a = [],
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
    merged.forEach((tg) => {
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
        if (cur.includes(tg)) __bTags.set(cur.filter((x) => x !== tg));
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
  const ua = __aTags.subscribe((v) => {
    _a = v;
    render();
  });
  const ub = __bTags.subscribe((v) => {
    _b = v;
    render();
  });
  return () => {
    ua();
    ub();
  };
}

/* ---------- "隐藏已读/隐藏历史观看"开关: 注入"卡片信息 > 配置常驻卡片信息"面板 ---------- */
function __fillCardInfoSectionObserver() {
  let swReadInp = null,
    swHistInp = null;
  function build() {
    const panel = (function () {
      const holder = document.querySelector(".configP_holder");
      if (!holder) return null;
      const sections = holder.querySelectorAll(".section");
      for (let i = 0; i < sections.length; i++) {
        const h1 = sections[i].querySelector("h1.s_title");
        if (h1 && h1.textContent === "卡片信息") {
          const sub = sections[i].querySelector("h3.s_title");
          const subSec = sub && sub.parentElement;
          if (subSec && subSec.textContent.indexOf("配置常驻卡片信息") !== -1) {
            const p = subSec.querySelector(":scope > .s_panel");
            if (p) return p;
          }
        }
      }
      return null;
    })();
    if (!panel || panel.querySelector(".kesaHideReadRows")) return null;
    const wrap = document.createElement("div");
    wrap.className = "kesaHideReadRows";
    wrap.style.cssText = "border-top:1px solid #eee;margin-top:4px;padding-top:2px;";
    const swRead = __mkSwitchRow(
      "隐藏已读卡片",
      __storeVal(__hideReadCards),
      function (v) {
        if (v) __hideHistoryRead.set(false);
        __hideReadCards.set(v);
      },
      "隐藏所有已读卡片(与隐藏历史观看互斥)",
    );
    const swHist = __mkSwitchRow(
      "隐藏历史观看",
      __storeVal(__hideHistoryRead),
      function (v) {
        if (v) __hideReadCards.set(false);
        __hideHistoryRead.set(v);
      },
      "隐藏刷新前已观看的卡片, 刷新后新看的只变灰(与隐藏已读卡片互斥)",
    );
    swReadInp = swRead.querySelector("input");
    swHistInp = swHist.querySelector("input");
    wrap.appendChild(swRead);
    wrap.appendChild(swHist);
    panel.appendChild(wrap);
    return wrap;
  }
  function tryFill() {
    if (!build()) return;
    const u1 = __hideReadCards.subscribe((v) => {
      if (swReadInp) swReadInp.checked = v;
      __applyHideReadCards();
    });
    const u2 = __hideHistoryRead.subscribe((v) => {
      if (swHistInp) swHistInp.checked = v;
      __applyHideReadCards();
    });
    window.__kesaHideReadCleanup = function () {
      u1();
      u2();
    };
  }
  try {
    tryFill();
  } catch (e) {}
  const mo = new MutationObserver(function () {
    try {
      tryFill();
    } catch (e) {}
  });
  mo.observe(document.body, { childList: true, subtree: true });
}

/* ---------- 名称过滤 配置面板 ---------- */
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
    kws.forEach((kw, idx) => {
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
    const kws = (__storeVal(__nameFilter) || []).filter((k) => (k || "").trim());
    const total = document.querySelectorAll(".card").length;
    const hidden = document.querySelectorAll(".card[style*='display: none']").length;
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
function __fillWebDAVSection(container) {
  const h1 = document.createElement("h1");
  h1.className = "s_title";
  h1.textContent = "同步 (WebDAV)";
  container.appendChild(h1);
  const hint = document.createElement("div");
  hint.style.cssText = "color:#999;font-size:11px;margin:0 0 6px 0;padding:0 10px;";
  hint.textContent =
    "配置全局共用(换站不丢); 已读标记/设置按站点、页码全部站点, 均存入同一个统一文件并整体同步(自动合并)。打开站点自动下载、关闭页面自动上传, 已做流量优化; 也可手动点击下方按钮。侧边栏黄色'最大N页'按钮一键跳转到历史最大页码";
  container.appendChild(hint);
  const panel = document.createElement("div");
  panel.className = "s_panel";
  panel.style.cssText = "display:flex;flex-direction:column;gap:6px;width:100%;";
  container.appendChild(panel);
  function mkRow(label, key, type) {
    const c = __storeVal(__wdvCfg);
    const w = document.createElement("div");
    w.style.cssText = "display:flex;align-items:center;gap:6px;width:100%;";
    const lb = document.createElement("span");
    lb.style.cssText = "width:64px;font-size:12px;color:#333;flex-shrink:0;";
    lb.textContent = label;
    const inp = document.createElement("input");
    inp.type = type || "text";
    inp.value = c[key] || "";
    inp.style.cssText = "flex:1;min-width:0;border:1px solid #ccc;border-radius:4px;padding:3px 6px;font-size:12px;";
    inp.onchange = () => {
      const cur = __storeVal(__wdvCfg);
      cur[key] = inp.value.trim();
      __wdvCfg.set(cur);
    };
    w.appendChild(lb);
    w.appendChild(inp);
    panel.appendChild(w);
    return inp;
  }
  mkRow("服务器地址", "url", "text");
  mkRow("账号", "user", "text");
  mkRow("密码", "pass", "password");
  mkRow("文件路径", "path", "text");
  const status = document.createElement("div");
  status.style.cssText = "color:#3a7;font-size:12px;padding:2px 10px;min-height:16px;word-break:break-all;";
  status.textContent = "";
  container.appendChild(status);
  const btnRow = document.createElement("div");
  btnRow.style.cssText = "display:flex;gap:8px;padding:4px 10px;";
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
        status.textContent = e.message;
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
  // 清除页码记录(本地+远程统一文件中的 pages 一并清空)
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
      status.textContent = e.message;
    }
  };
  clearRow.appendChild(clearBtn);
  container.appendChild(clearRow);
}

/* ============================================================================
 * 2. WebDAV 核心
 * ========================================================================== */
function __wdvUrl() {
  const c = __storeVal(__wdvCfg);
  // 统一同步文件: 已读标记(sites.<host>) + 页码(pages) 共用一个文件
  let p = (c.path || "").trim().replace(/^\/+|\/+$/g, "");
  if (!p) p = "PT_Masonry_Sync.json";
  if (!/\.[^/]+$/.test(p)) p += "/PT_Masonry_Sync.json";
  else p = p.replace(/[^/]+$/, "PT_Masonry_Sync.json");
  return (c.url || "").replace(/\/+$/, "") + "/" + p;
}

// 读取统一同步文件(整文件), 404视为空; 兼容旧版: 若统一文件不存在, 尝试合并旧文件迁移
async function __wdvReadFull() {
  const c = __storeVal(__wdvCfg);
  if (!c.url) return { version: 2, sites: {}, pages: {} };
  const r = await __wdvFetch(__wdvUrl(), "GET", null);
  if (r.status === 404) {
    // 迁移旧版数据: 本站旧已读文件 <host>.json + 旧页码文件 PT_Masonry_PageMax.json
    const legacy = { sites: {}, pages: {} };
    const base = (c.url || "").replace(/\/+$/, "");
    async function fetchLegacy(name, parse) {
      try {
        const gr = await __wdvFetch(base + "/" + name, "GET", null);
        if (gr.status >= 200 && gr.status < 300) return parse(JSON.parse(gr.responseText || "{}"));
      } catch (e) {}
      return null;
    }
    const host = location.hostname;
    const gj = await fetchLegacy(host + ".json", function (j) {
      const so = {};
      if (Array.isArray(j.ids)) so.readIds = j.ids;
      if (j.config && typeof j.config.masonry === "string") so.config = j.config;
      return so.readIds || so.config ? so : null;
    });
    if (gj) legacy.sites[host] = gj;
    const pj = await fetchLegacy("PT_Masonry_PageMax.json", function (j) {
      return j && typeof j === "object" ? j : {};
    });
    if (pj) legacy.pages = pj;
    return Object.assign({ version: 2, sites: {}, pages: {} }, legacy);
  }
  if (r.status >= 200 && r.status < 300) {
    let j = {};
    try {
      j = JSON.parse(r.responseText || "{}") || {};
    } catch (e) {
      j = {};
    }
    if (!j.sites || typeof j.sites !== "object") j.sites = {};
    if (!j.pages || typeof j.pages !== "object") j.pages = {};
    return j;
  }
  throw new Error("读取同步文件失败 HTTP " + r.status);
}

// 写入统一同步文件
async function __wdvWriteFull(full) {
  const r = await __wdvFetch(__wdvUrl(), "PUT", JSON.stringify(full));
  if (r.status < 200 || r.status >= 300) throw new Error("上传失败 HTTP " + r.status);
}

function __wdvAuth() {
  const c = __storeVal(__wdvCfg);
  return "Basic " + btoa(unescape(encodeURIComponent((c.user || "") + ":" + (c.pass || ""))));
}

// 请求封装: 优先 GM_xmlhttpRequest, 回退 fetch
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

// 上传: 合并本站已读/设置 + 页码 后整体写回统一文件 (流量优化: force=false 时无变化则跳过)
async function __wdvUpload(force) {
  const c = __storeVal(__wdvCfg);
  if (!c.url || !c.pass) throw new Error("请先填写 WebDAV 配置");
  const host = location.hostname;
  const ids = [...__storeVal(__readIds)];
  const cfgStr = localStorage.getItem("Kesa:Masonry") || "{}";
  const fallStr = localStorage.getItem("Kesa:Fall") || "{}";
  // 流量优化(坚果云): 自动上传时无变化则跳过; 手动上传(force=true)总是执行
  const idsLocalKey = ids.join(",");
  const snapIds = GM_getValue("pt_sync_idsSnap", "");
  const snapCfg = GM_getValue("pt_sync_cfgSnap", "");
  const snapFall = GM_getValue("pt_sync_cfgFallSnap", "");
  if (!force && idsLocalKey === snapIds && cfgStr === snapCfg && fallStr === snapFall) {
    // 本站已读无变化; 若页码也无脏数据则跳过
    const pagesDirty = typeof window.__kesaPageSync === "function" && window.__kesaPageSync("isDirty");
    if (!pagesDirty) return "无变化, 跳过上传(节省流量)";
  }
  // 读整文件(含其它站已读 + 页码), 合并本站已读/设置后整体写回
  const full = await __wdvReadFull();
  const sites = full.sites || {};
  const st = sites[host] || {};
  const stIds = Array.isArray(st.readIds) ? st.readIds : [];
  const merged = [...new Set([...stIds, ...ids])];
  sites[host] = {
    readIds: merged,
    config: { masonry: cfgStr, fall: fallStr },
  };
  full.sites = sites;
  // 页码部分: 从页码模块取其本地数据一并写回
  if (typeof window.__kesaPageSync === "function") {
    const pg = window.__kesaPageSync("get");
    if (pg && typeof pg === "object") full.pages = pg;
  }
  full.updated = Date.now();
  await __wdvWriteFull(full);
  if (merged.length !== __storeVal(__readIds).length) {
    __readIds.set(merged);
    __applyReadClasses();
  }
  GM_setValue("pt_sync_idsSnap", merged.join(","));
  GM_setValue("pt_sync_cfgSnap", cfgStr);
  GM_setValue("pt_sync_cfgFallSnap", fallStr);
  if (typeof window.__kesaPageSync === "function") window.__kesaPageSync("setDirty", false);
  return "已上传 " + merged.length + " 条已读标记 + 页码";
}

// 下载: 读取统一文件并合并本站已读/设置 + 页码
async function __wdvDownload(updateHistSnapshot) {
  const c = __storeVal(__wdvCfg);
  if (!c.url || !c.pass) throw new Error("请先填写 WebDAV 配置");
  const host = location.hostname;
  const full = await __wdvReadFull();
  const st = (full.sites || {})[host] || {};
  const remote = Array.isArray(st.readIds) ? st.readIds : [];
  const merged = [...new Set([...__storeVal(__readIds), ...remote])];
  // 打开页面拉取的远端已读也属于"历史观看"(本会话点击之前), 刷新快照使"隐藏历史观看"一并生效
  if (updateHistSnapshot) __historyReadSnapshot = [...merged];
  __readIds.set(merged);
  __applyReadClasses();
  let cfgMsg = "";
  if (st.config && typeof st.config.masonry === "string") {
    try {
      const far = JSON.parse(st.config.masonry);
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
        cfgMsg = "，配置已同步(刷新后生效)";
      }
    } catch (e) {}
  }
  // 页码部分: 合并进页码模块本地存储
  let pageMsg = "";
  if (typeof window.__kesaPageSync === "function" && full.pages && typeof full.pages === "object") {
    pageMsg = window.__kesaPageSync("merge", full.pages) || "";
  }
  return "已下载并合并, 共 " + merged.length + " 条已读标记" + cfgMsg + (pageMsg ? "，" + pageMsg : "");
}

/* ============================================================================
 * 3. 自动同步 + 桥接
 * ========================================================================== */
function __wdvAutoRun(fn, tag) {
  try {
    const c = __storeVal(__wdvCfg);
    if (!c.url || !c.pass) return;
    fn()
      .then(function (m) {
        console.log("[WebDAV] " + tag + ":", m);
      })
      .catch(function (e) {
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
window.__kesaWdSync = function (action) {
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
      const nav = performance.getEntriesByType("navigation")[0];
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
    const base = (u) => {
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
function __kesaPageUrl(n) {
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
function __kesaPageInd(n) {
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
  // 网络同步(上传/下载)统一由主作用域"已读标记同步"处理(共用统一文件 PT_Masonry_Sync.json),
  // 本模块通过 window.__kesaPageSync 桥接把本地页码交给主作用域上传/合并, 避免双写。
  function __pmGet() {
    try {
      return JSON.parse(GM_getValue("pt_pagemax", "null")) || {};
    } catch (e) {
      return {};
    }
  }
  function __pmSet(st) {
    try {
      GM_setValue("pt_pagemax", JSON.stringify(st));
    } catch (e) {}
  }
  // 归一化任一URL为页面上下文key: 去页码 + 去NexusPHP默认筛选参数
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
  function __pmMaxFor(key) {
    const e = __pmGet()[key];
    return e && e.max ? e.max : 0;
  }
  // ---- 本地脏标记: 页码变化置脏; 实际上传/下载由主作用域统一处理(关页兜底+手动按钮) ----
  let __pmDirty = false;
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
  window.__kesaPageSync = function (action, data) {
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
        return changed ? "已合并页码(当前站最大 " + maxCur + " 页)" : "";
      }
      if (action === "isDirty") return !!__pmDirty;
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
        const n = parseInt(go.dataset.page, 10);
        if (!isNaN(n) && n >= 1) return n;
      }
    } catch (e) {}
    try {
      const u = new URL(location.href);
      const isNX = /\.php/i.test(location.pathname);
      const n = parseInt(u.searchParams.get(isNX ? "page" : "pageNumber"), 10);
      return isNaN(n) ? 1 : n;
    } catch (e) {
      return 1;
    }
  }
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
        const prevBtn = document.getElementById("kesaMtPageSelPrev");
        if (prevBtn) prevBtn.disabled = c <= 1;
        return;
      }
      // 定位"加载下一页"按钮(M-Team 的 #turnPage / 含"加载下一页"文本的按钮)
      let btn = document.getElementById("turnPage");
      if (!btn) {
        const all = document.querySelectorAll("button");
        for (let i = 0; i < all.length; i++) {
          if (all[i].textContent.indexOf("加载下一页") >= 0) {
            btn = all[i];
            break;
          }
        }
      }
      let wrap = null;
      let afterWf = false;
      if (btn) {
        wrap = btn.parentElement || btn.parentNode;
      } else {
        // NexusPHP 等: 注入到瀑布流容器之后
        const wf = document.querySelector("div.waterfall");
        if (wf && wf.parentNode) {
          afterWf = true;
          wrap = wf;
        }
        if (!wrap) {
          if (__pmSelLog++ < 3) console.log("[kesa] 页码选择器: 未找到可注入位置");
          return;
        }
      }
      if (!wrap) return;
      const box = document.createElement("div");
      box.id = "kesaMtPageSel";
      box.style.cssText = "display:flex;align-items:center;gap:6px;justify-content:center;margin-top:8px;flex-wrap:wrap;";
      const btnStyle =
        "border:none;background:#3fa7d6;color:#fff;border-radius:4px;padding:4px 12px;font-size:12px;cursor:pointer;";
      const prev = document.createElement("button");
      prev.id = "kesaMtPageSelPrev";
      prev.textContent = "◀ 上一页";
      prev.style.cssText = btnStyle;
      prev.onclick = function () {
        location.href = __pmUrlForPage(__pmCurrentPage() - 1);
      };
      const cur = document.createElement("span");
      cur.id = "kesaMtPageSelCur";
      cur.style.cssText = "color:#333;font-size:12px;font-weight:600;min-width:52px;text-align:center;";
      cur.textContent = "第 " + __pmCurrentPage() + " 页";
      const next = document.createElement("button");
      next.textContent = "下一页 ▶";
      next.style.cssText = btnStyle;
      next.onclick = function () {
        location.href = __pmUrlForPage(__pmCurrentPage() + 1);
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
        location.href = __pmUrlForPage(n);
      };
      inp.addEventListener("keydown", function (e) {
        if (e.key === "Enter") go.onclick();
      });
      box.appendChild(prev);
      box.appendChild(cur);
      box.appendChild(next);
      box.appendChild(inp);
      box.appendChild(go);
      if (afterWf) wrap.insertAdjacentElement("afterend", box);
      else wrap.appendChild(box);
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
  __fillCardInfoSectionObserver,
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
  fillCardInfoSectionObserver: __fillCardInfoSectionObserver,
};
