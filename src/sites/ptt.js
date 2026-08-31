/* ==================== PTT 数据适配(仅 www.pttime.org / nicept.net / ptfans.cc) ==================== */
export const __isPTT = /pttime\.org|nicept\.net|ptfans\.cc/i.test(location.hostname);
// 详情链接:PTT 用 details.php?id=..&hit=1(已在 __pttParse 解析为 torrentLink),其他站点用 /detail/{id}
/** @param {any} it */
export function __ksDetailUrl(it) {
  if (__isPTT) return (it && it.torrentLink) || "/details.php?id=" + it.id + "&hit=1";
  return "/detail/" + it.id;
}
// PTT 分类 → M-Team CATEGORY_NAME/COLOR 键 映射(保证名称与配色正确)
export const __PTT_CAT_MAP = {
  "100": "100", "401": "401", "402": "402", "403": "407", "404": "408",
  "405": "450", "406": "404", "407": "405", "408": "405", "409": "423",
  "411": "406", "412": "449", "420": "443", "421": "450", "422": "422",
  "423": "450", "430": "450",
};
/** @param {string} s */
export function __pttParseSize(s) {
  s = (s || "").trim().toUpperCase();
  const m = s.match(/([\d.]+)\s*(B|KB|MB|GB|TB)/);
  if (!m) return 0;
  const mult = /** @type {any} */ ({ B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 })[m[2]] || 1;
  return Math.round(parseFloat(m[1]) * mult);
}
// 解析 NexusPHP 的发布时间(如 "2年7月"/"4月28天"/"3天"/"5周")为 ISO 日期
/** @param {string} s */
export function __pttParseCreated(s) {
  s = (s || "").trim();
  let d = new Date();
  let yr = s.match(/(\d+)\s*年/), mo = s.match(/(\d+)\s*月/), wk = s.match(/(\d+)\s*周/), dy = s.match(/(\d+)\s*天/), hr = s.match(/(\d+)\s*时/);
  if (yr) d.setFullYear(d.getFullYear() - parseInt(yr[1]));
  if (mo) d.setMonth(d.getMonth() - parseInt(mo[1]));
  if (wk) d.setDate(d.getDate() - parseInt(wk[1]) * 7);
  if (dy) d.setDate(d.getDate() - parseInt(dy[1]));
  if (hr) d.setHours(d.getHours() - parseInt(hr[1]));
  return d.toISOString();
}
// NexusPHP 各站的列表结构差异(表格选择器 + 列索引 + 折扣标记方式)
export const __NX_CFG = {
  "pttime.org": { table: "#torrenttable", cSize: 10, cSeeders: 11, cLeechers: 12, cCompleted: 13, cComments: 7, cCreated: 9, discFont: true },
  "nicept.net": { table: "table.torrents", cSize: 7, cSeeders: 8, cLeechers: 9, cCompleted: 10, cComments: 5, cCreated: 6, discFont: false },
  "ptfans.cc": { table: "table.torrents", cSize: 8, cSeeders: 9, cLeechers: 10, cCompleted: 11, cComments: 6, cCreated: 7, discFont: false },
};
export function __nxHost() {
  return location.hostname.replace(/^www\./, "");
}
/** @param {any} doc */
export function __pttParse(doc) {
  const d = doc || document;
  const cfg = /** @type {any} */ (__NX_CFG)[__nxHost()] || { table: "#torrenttable", cSize: 10, cSeeders: 11, cLeechers: 12, cCompleted: 13, cComments: 7, cCreated: 9, discFont: true };
  const table = d.querySelector(cfg.table) || d.getElementById("torrenttable") || d.querySelector("table.torrents");
  if (!table) return [];
  const rows = Array.from(table.querySelectorAll("tr"));
  const out = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const cells = Array.from(row.querySelectorAll("td"));
    if (cells.length < 12) continue;
    const detailLink = Array.from(row.querySelectorAll('a[href*="details.php"]')).find(
      (a) => !/userdetails/i.test(a.href) && /details\.php\?id=/.test(a.href)
    );
    if (!detailLink) continue;
    try {
      const href = detailLink.href;
      const idM = href.match(/id=(\d+)/);
      const id = idM ? idM[1] : "";
      const name = (detailLink.textContent || "").trim();
      let category = "";
      const catA = cells[0] && cells[0].querySelector('a[href*="cat="]');
      if (catA) { const cm = catA.href.match(/cat=(\d+)/); if (cm) category = /** @type {any} */ (__PTT_CAT_MAP)[cm[1]] || cm[1]; }
      /** @type {any[]} */
      let imageList = [];
      try {
        // 封面图提取: 多来源多属性, 过滤占位图; 兼容协议相对(//)图床地址
        const imgs = row.querySelectorAll("td.torrentimg img, img.nexus-lazy-load, img.lazy-image, td.torrentimg a img");
        for (let k = 0; k < imgs.length; k++) {
          const im = imgs[k];
          let s = im.getAttribute("data-src") || im.getAttribute("src") || im.getAttribute("data-original") || "";
          if (!s) continue;
          // 过滤占位/无意义图。注意: 不能用笼统的 pic/ 前缀, 否则会误杀合法图床
          // (如 pic.daxiangjiao.org/pic/2026/.. 含 /pic/ 子路径)。占位图均为相对路径
          // pic/... 或含 trans.gif/spinner/spacer/noimage 等关键词, 此处精确匹配。
          if (/^pic\/|^\.?\/pic\//i.test(s)) continue;
          if (/trans\.gif|spacer|noimage|noposter|blank\.|loading\.gif|^data:/i.test(s)) continue;
          if (s.startsWith("//")) s = location.protocol + s;
          else if (s.startsWith("/")) s = location.origin + s;
          else if (!/^https?:/i.test(s)) s = location.origin + "/" + s;
          if (s) {
            imageList = [s];
            break;
          }
        }
      } catch (e) {}
      if (!imageList.length && /ptfans\.cc/i.test(location.hostname)) {
        try {
          if ((window.__kesaImgDiag = (window.__kesaImgDiag || 0) + 1) <= 3) {
            console.log("[封面诊断] ptfans 无图行HTML:", (row.outerHTML || "").slice(0, 400));
          }
        } catch (e2) {}
      }
      const size = __pttParseSize(cells[cfg.cSize] ? cells[cfg.cSize].textContent : "");
      const seeders = parseInt((cells[cfg.cSeeders] ? cells[cfg.cSeeders].textContent : "") || "0") || 0;
      const leechers = parseInt((cells[cfg.cLeechers] ? cells[cfg.cLeechers].textContent : "") || "0") || 0;
      const completed = parseInt((cells[cfg.cCompleted] ? cells[cfg.cCompleted].textContent : "") || "0") || 0;
      const comments = parseInt((cells[cfg.cComments] ? cells[cfg.cComments].textContent : "") || "0") || 0;
      let discount = "NORMAL";
      if (cfg.discFont) {
        const pEl = row.querySelector("font.promotion");
        const pTxt = pEl ? pEl.textContent.trim() : "";
        discount = pTxt.includes("免费") ? "FREE" : (pTxt.includes("50") || pTxt.includes("半") ? "PERCENT_50" : "NORMAL");
      } else {
        if (row.querySelector("img.pro_free, img.pro_free2up")) discount = "FREE";
        else if (row.querySelector("img.pro_2xfree")) discount = "2XFree";
        else if (row.querySelector("img.pro_50pctdown, img.pro_50pctup")) discount = "PERCENT_50";
      }
      let smallDescr = "";
      const subEl = detailLink.parentElement ? detailLink.parentElement.querySelector("font:not(.promotion)") : null;
      if (subEl) smallDescr = subEl.textContent.trim();
      let labels = 0;
      /** @type {any[]} */ (row.querySelectorAll("span.tags")).forEach((t) => {
        const txt = t.textContent;
        if (txt.includes("DIY")) labels |= 1;
        if (txt.includes("国配")) labels |= 2;
        if (txt.includes("中字")) labels |= 4;
      });
      const createdDate = __pttParseCreated(cells[cfg.cCreated] ? cells[cfg.cCreated].textContent : "");
      out.push({
        name, id, size, smallDescr, labels, category,
        torrentLink: href, imageList, collection: false,
        status: { seeders, leechers, comments, discount, toppingLevel: 0, createdDate, discountEndTime: null },
      });
    } catch (e) {}
  }
  return out;
}
export function __pttLoadMasonry() {
  if (window.Masonry) return;
  if (document.querySelector('script[data-ptt-masonry]')) return;
  ["https://unpkg.com/masonry-layout@4.2.2/dist/masonry.pkgd.min.js",
   "https://unpkg.com/imagesloaded@5/imagesloaded.pkgd.min.js"].forEach((src) => {
    const sc = document.createElement("script");
    sc.src = src;
    sc.setAttribute("data-ptt-masonry", "1");
    (document.head || document.documentElement).appendChild(sc);
  });
}
/** @param {number} page */
export function __pttInject(page) {
  const S = window.__kesaHijack;
  console.log("[PTT适配] handler=", S && typeof S.handler, "page=", page);
  if (!S || typeof S.handler !== "function") return false;
  const objs = __pttParse(document);
  console.log("[PTT适配] 解析到种子数:", objs.length);
  if (!objs.length) return false;
  try {
    S.handler({ type: "res", data: JSON.stringify({ data: { data: objs, pageNumber: page || 1 } }) });
    console.log("[PTT适配] 已注入第", page, "页");
    return true;
  } catch (e) {
    console.error("[PTT适配] 注入异常:", e);
    return false;
  }
}
export function __pttBoot() {
  if (!__isPTT) return;
  console.log("[PTT适配] __pttBoot 启动");
  // 1. 提供 M-Team 的瀑布流宿主元素(Mr 组件依赖 div.app-content__inner 定位)
  if (!document.querySelector("div.app-content__inner")) {
    const sc = document.createElement("div");
    sc.className = "app-content__inner";
    sc.style.cssText = "display:none;";
    // 锚定原种子表格位置,使瀑布流显示在内容区(两行页码之间)而非页面底部
    const tl = document.getElementById("torrenttable") || document.querySelector("table.torrents");
    const mo = tl && tl.closest("table.mainouter");
    const anchor = tl || mo;
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(sc, anchor.nextSibling);
    else document.body.appendChild(sc);
  }
  // 1b. 提供 .ant-layout 宿主元素(Mr onMount 的 ye 滚动元素;PTT 没有则 ye=null 会抛异常跳过 U() 绑定 handler)
  if (!document.querySelector(".ant-layout")) {
    const al = document.createElement("div");
    al.className = "ant-layout";
    al.style.cssText = "display:none;";
    document.body.appendChild(al);
  }
  // 2. 加载 Masonry / imagesLoaded(异步;wr 会轮询等待 window.Masonry)
  __pttLoadMasonry();
  // 3. 等待 handler 就绪并注入首页数据
  const tryOnce = () => { if (!__pttInject(1)) setTimeout(tryOnce, 500); };
  setTimeout(tryOnce, 2000);
  // 3b. PTT 预览小窗口加宽(自适应屏幕宽度,最大 1600px)
  if (!document.getElementById("__pttPreviewCss")) {
    const st = document.createElement("style");
    st.id = "__pttPreviewCss";
    st.textContent =
      "div#_iframe ._iframe{width:min(var(--pw,1600px),94vw)!important;height:var(--ph,96%)!important}" +
      "div#_iframe ._iframe iframe{width:100%!important;height:100%}";
    (document.head || document.documentElement).appendChild(st);
  }
  // 检查侧边栏是否在 DOM 中
  setTimeout(() => {
    const sp = document.querySelector(".sideP");
    console.log("[PTT适配] 侧边栏 .sideP 存在:", !!sp, sp ? ("display=" + getComputedStyle(sp).display + " rect=" + JSON.stringify(sp.getBoundingClientRect())) : "");
  }, 4000);
}
