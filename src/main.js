import App from './main.svelte';
import { GET_TORRENT_LIST_SELECTOR, IS_MT } from './sites/index.js';
// -------------------------------------------------------------

export { _ORIGIN_TL_Node };

// -------------------------------------------------------------

console.log("________PT-TorrentList-Masonry________");

// -------------------------------------------------------------
/** 相应站点的种子列表 selector */
const list_selector = GET_TORRENT_LIST_SELECTOR();
/**原种子列表DOM */
let _ORIGIN_TL_Node = document.querySelector(list_selector);

/** 当前是否为 M-Team NEW_MT 站(SPA, 无原始种子表格, 数据来自劫持 /search) */
const isMT = IS_MT(window.location.hostname);

// M-Team SPA 在 document-start 时无 table.torrents, 但有种子列表 selector。
// 为其创建隐藏占位节点, 使 main.svelte 正常挂载瀑布流; 数据由 _index.svelte 的劫持路由填充。
if (isMT && !_ORIGIN_TL_Node) {
  _ORIGIN_TL_Node = document.createElement("div");
  _ORIGIN_TL_Node.id = "__kesaMTPlaceholder";
  _ORIGIN_TL_Node.style.display = "none";
  document.body.append(_ORIGIN_TL_Node);
  console.log("M-Team NEW_MT 站: 已创建瀑布流挂载占位节点");
}

// 没有相应站点的种子列表 selector 或 种子列表 dom 不存在 就不进行整个程序
if (list_selector && !!_ORIGIN_TL_Node) {
  const app = new App({
    target: (() => {
      const app = document.createElement('div');
      document.body.append(app);
      return app;
    })(),
  });
}
else { console.log('未识别到种子列表捏~') }
