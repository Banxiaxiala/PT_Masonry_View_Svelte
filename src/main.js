import App from './main.svelte';
import { GET_TORRENT_LIST_SELECTOR, IS_MT } from './sites/index.js';
// -------------------------------------------------------------

export { _ORIGIN_TL_Node };

// -------------------------------------------------------------

console.log("________PT-TorrentList-Masonry________");

// -------------------------------------------------------------
/** 相应站点的种子列表 selector */
const list_selector = GET_TORRENT_LIST_SELECTOR();

/**原种子列表DOM(初始为 null, 待等待到真实表格后赋值) */
let _ORIGIN_TL_Node = null;

/** 当前是否为 M-Team NEW_MT 站(SPA, 无原始种子表格, 数据来自劫持 /search) */
const isMT = IS_MT(window.location.hostname);

/**
 * 挂载瀑布流 App。
 * 说明: 脚本 run-at 为 document-start, 此时页面 DOM 尚未解析完,
 * NexusPHP 站的 table.torrents 还不存在, 需等待其出现后再挂载。
 */
function mountApp() {
  const app = new App({
    target: (() => {
      const div = document.createElement('div');
      document.body.append(div);
      return div;
    })(),
  });
}

// M-Team NEW_MT 站优先判断: SPA 无原始种子表格, 不依赖 list_selector。
// (list_selector 需精确命中 SITE[domain], 若访问的 m-team 子域不在白名单
//  list_selector 为 null, 但劫持 /search 数据源仍可用, 必须能正常挂载)
if (isMT) {
  // 参照 1.2.3b: M-Team 瀑布流应作为真实 div.app-content__inner 的兄弟节点插入,
  // _ORIGIN_TL_Node 即真实容器, 这样瀑布流模式隐藏原生种子表格时瀑布流自然显示在内容区。
  // SSR 页(/browse/* 等)的 div.app-content__inner 由 webpack 应用异步渲染, 需轮询等待。
  let mtTries = 0;
  const mtTimer = setInterval(() => {
    mtTries++;
    _ORIGIN_TL_Node =
      document.querySelector("div.app-content__inner") ||
      document.querySelector("table.w-full.table-fixed");
    if (_ORIGIN_TL_Node) {
      clearInterval(mtTimer);
      console.log("M-Team 站: 已定位原生表格容器, 挂载瀑布流");
      mountApp();
    } else if (mtTries > 100) {
      // 约 10s 上限; SPA 页(/search 等)可能无 div.app-content__inner,
      // fallback 创建占位节点挂载, 保证 SPA 页瀑布流仍可用。
      clearInterval(mtTimer);
      _ORIGIN_TL_Node = document.createElement("div");
      _ORIGIN_TL_Node.id = "__kesaMTPlaceholder";
      _ORIGIN_TL_Node.style.display = "none";
      document.body.append(_ORIGIN_TL_Node);
      console.log("M-Team SPA 站: 未发现原生表格容器, 使用占位节点挂载");
      mountApp();
    }
  }, 100);
} else if (!list_selector) {
  // 没有相应站点的种子列表 selector 就不进行整个程序
  console.log('未识别到种子列表 selector 捏~');
} else {
  // NexusPHP DOM 站: 轮询等待原种子表格出现后再挂载(避免 document-start 时序问题)
  let tries = 0;
  const MAX_TRIES = 100; // 约 10s 上限, 防止非列表页无限轮询
  const waitTimer = setInterval(() => {
    tries++;
    _ORIGIN_TL_Node = document.querySelector(list_selector);
    if (_ORIGIN_TL_Node || tries > MAX_TRIES) {
      clearInterval(waitTimer);
      if (_ORIGIN_TL_Node) {
        mountApp();
      } else {
        console.log('等待超时: 未识别到种子列表 DOM 捏~');
      }
    }
  }, 100);
}
