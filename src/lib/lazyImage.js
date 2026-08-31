/* ==================== 懒加载接管器(参照 1.2.3b 实现) ====================
 *
 * 背景:
 *  - 卡片 <img> 是 svelte 动态创建的, 站点原页面的 IntersectionObserver / loading=lazy
 *    不会接管这些新元素, 导致 data-src 永远不会拷贝到 src, 图片一直显示 LOADING_PIC。
 *  - 站点原表格的 <img loading="lazy"> 在表格被 display:none 隐藏后, 浏览器也不会触发
 *    懒加载 → 卡片如果只拷贝 data-src 字符串, 重新发请求会卡住(尤其图床较慢时)。
 *
 * 策略(参照 1.2.3b __kesaWatchLazy / __kesaQueue / __kesaStart):
 *  1) __kesaWatchLazy():
 *     a) 预热原列表 <img loading="lazy">: 把 src/data-src 灌入 `new Image()` 浏览器缓存,
 *        并强制 loading="eager", 供后续卡片复用/命中缓存, 避免重新请求。
 *     b) 接管所有 `.nexus-lazy-load_Kesa:not(.preview_Kesa)` 卡片 img:
 *        按 data-src 加入并发限制 4 的队列 __kesaQ, 由 __kesaPump 派发到 __kesaStart。
 *  2) __kesaStart(l):
 *     a) 加载前 __kesaFindLoaded(o) 查页面里已有同 src 已加载的 img, 命中则直接 l.src=o
 *        (浏览器从缓存读取, 不重新请求) — 用户的"复用原列表图片链接"诉求。
 *     b) 否则 new Image() 预加载, onload 后 l.src=o + classList.add("preview_Kesa") +
 *        __kesaDone[o]=1 (标记已成功, 后续同 src 直接命中)。
 *     c) onerror 重试一次, 第二次仍失败则走站点 image_proxy.php?url= 端点回退
 *        (绕 referer / 防盗链), 仍失败则 SVG 占位"暂时无法加载出图片"。
 *
 * 接入点:
 *  - main.svelte onMount: 调用一次 __kesaWatchLazy() 预热原图。
 *  - _index.svelte afterUpdate: 每次卡片渲染后调用 __kesaWatchLazy() 接管新卡片。
 */

let __kesaQ = [];
let __kesaBusy = 0;
let __kesaDone = {}; // 1=成功 -1=失败
const __kesaLimit = 4;
const __kesaFailSvg = () => {
  return (
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='560'><text x='50%' y='50%' font-size='24' fill='#aaa' text-anchor='middle' dominant-baseline='middle'>暂时无法加载出图片</text></svg>"
    )
  );
};

/** 主入口: 预热原列表 + 接管所有 .nexus-lazy-load_Kesa 卡片 img */
export function __kesaWatchLazy() {
  try {
    // 1) 预热原列表封面图: 站点原表格(即将被 display:none 隐藏)的 lazy img 不会触发加载,
    //    这里强制 eager 并 new Image() 灌入浏览器缓存, 卡片可命中缓存/直接复用
    /** @type {NodeListOf<HTMLImageElement>} */
    (document.querySelectorAll('img[loading="lazy"]')).forEach((im) => {
      const src = im.getAttribute("src") || im.getAttribute("data-src") || "";
      if (!src || /emptyImg|trans\.gif|spinner|^data:/i.test(src)) return;
      if (im.loading !== "eager") im.loading = "eager";
      if (!im.__warmed) {
        im.__warmed = 1;
        try {
          const w = new Image();
          w.src = src;
        } catch (e) {}
      }
    });
  } catch (e) {}
  try {
    // 2) 接管所有卡片懒加载图(不依赖 IntersectionObserver root, 兼容各站不同滚动容器)
    document.querySelectorAll(".nexus-lazy-load_Kesa:not(.preview_Kesa)").forEach((l) => {
      if (l.dataset.src && !l.__kesaQueued && !l.__kesaFail) __kesaQueue(l);
    });
  } catch (e) {}
}

/** 入队卡片 img (已入队/已失败/无 data-src 的跳过) */
function __kesaQueue(l) {
  if (l.__kesaQueued || l.classList.contains("preview_Kesa") || l.__kesaFail) return;
  const o = l.dataset.src;
  if (!o) return;
  if (__kesaDone[o] === 1) {
    // 已成功的同 src: 直接设 src (命中浏览器缓存)
    try {
      l.referrerPolicy = "no-referrer";
      l.src = o;
      l.classList.add("preview_Kesa");
      try { l.dispatchEvent(new Event("load")); } catch (e) {}
    } catch (e) {}
    return;
  }
  if (__kesaDone[o] === -1) {
    // 已失败过的同 src: 走占位
    try {
      l.__kesaFail = 1;
      l.src = __kesaFailSvg();
      l.classList.add("preview_Kesa");
    } catch (e) {}
    return;
  }
  l.__kesaQueued = 1;
  __kesaQ.push(l);
  __kesaPump();
}

/** 派发: 并发限制 4, 不停从队列取任务交给 __kesaStart */
function __kesaPump() {
  while (__kesaBusy < __kesaLimit && __kesaQ.length) {
    const l = __kesaQ.shift();
    l.__kesaQueued = 0;
    __kesaStart(l);
  }
}

/** 在所有 <img> 中查找已加载完成且 src 匹配的 img(实现"复用原列表图片链接") */
function __kesaFindLoaded(o) {
  try {
    const all = document.querySelectorAll("img");
    for (let i = 0; i < all.length; i++) {
      const im = all[i];
      const src = im.currentSrc || im.getAttribute("src") || "";
      if (src === o && im.complete && im.naturalWidth > 0) return im;
    }
  } catch (e) {}
  return null;
}

/** 实际加载单张卡片图 */
function __kesaStart(l) {
  if (l.__kesaBusy || l.classList.contains("preview_Kesa")) return;
  const o = l.dataset.src;
  if (!o) {
    l.__kesaFail = 1;
    return;
  }
  // 复用页面中已加载的同 src 图片(尤其原列表已加载的图), 避免重新请求
  const __re = __kesaFindLoaded(o);
  if (__re) {
    try {
      l.referrerPolicy = __re.referrerPolicy || "no-referrer";
      l.src = o;
      l.classList.add("preview_Kesa");
      __kesaDone[o] = 1;
      try { l.dispatchEvent(new Event("load")); } catch (e) {}
    } catch (e) {}
    return;
  }
  l.__kesaBusy = 1;
  __kesaBusy++;
  try {
    const p = new Image();
    const a = l.__kesaTry | 0;
    if (a >= 1) p.referrerPolicy = "no-referrer";
    p.onload = () => {
      try {
        __kesaDone[o] = 1;
        l.__kesaBusy = 0;
        __kesaBusy--;
        __kesaPump();
        l.referrerPolicy = p.referrerPolicy || "no-referrer";
        l.src = o;
        l.classList.add("preview_Kesa");
        try { l.dispatchEvent(new Event("load")); } catch (e) {}
      } catch (e) {}
    };
    p.onerror = () => {
      try {
        l.__kesaTry = a + 1;
        if (a === 0) {
          // 第一次失败: 500ms 后重试(不换 src, 留给浏览器自身重连/换 referer)
          l.__kesaBusy = 0;
          __kesaBusy--;
          setTimeout(() => {
            try { __kesaQ.unshift(l); __kesaPump(); } catch (e) {}
          }, 500);
          return;
        }
        if (a === 1 && !/ptfans\.cc/i.test(location.hostname) && !o.includes("image_proxy.php") && !l.__kesaProxy) {
          // 第二次失败: 走站点 image_proxy.php 端点回退(绕 referer/防盗链)
          // ptfans.cc 的 image_proxy.php 已失效, 跳过无效重试
          try {
            l.__kesaProxy = 1;
            l.dataset.src = location.origin + "/image_proxy.php?url=" + encodeURIComponent(o);
          } catch (e) {}
          l.__kesaBusy = 0;
          __kesaBusy--;
          setTimeout(() => {
            try { __kesaQ.unshift(l); __kesaPump(); } catch (e) {}
          }, 500);
          return;
        }
        // 全部失败: SVG 占位
        __kesaDone[o] = -1;
        l.__kesaFail = 1;
        l.__kesaBusy = 0;
        __kesaBusy--;
        try {
          l.src = __kesaFailSvg();
          l.classList.add("preview_Kesa");
        } catch (e) {}
      } catch (e) {}
    };
    p.src = o;
  } catch (e) {
    // new Image 异常(如无效 src) → 立即失败
    l.__kesaBusy = 0;
    __kesaBusy--;
    __kesaDone[o] = -1;
    l.__kesaFail = 1;
  }
}
