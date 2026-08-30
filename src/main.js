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
  // document-start 时无 table.torrents, 但占位节点可立即创建,
  // 数据由 _index.svelte 的劫持路由填充。占位节点创建后即可挂载。
  _ORIGIN_TL_Node = document.createElement("div");
  _ORIGIN_TL_Node.id = "__kesaMTPlaceholder";
  _ORIGIN_TL_Node.style.display = "none";
  document.body.append(_ORIGIN_TL_Node);
  console.log("M-Team NEW_MT 站: 已创建瀑布流挂载占位节点");
  mountApp();
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
