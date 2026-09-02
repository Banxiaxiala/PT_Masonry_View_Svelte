import App from './main.svelte';
import { GET_TORRENT_LIST_SELECTOR, IS_MT, __isPTT, __pttBoot } from './sites/index.js';
import { __initReadTracking } from './lib/sync';
import { __initUserDetail } from './lib/userdetail';
// -------------------------------------------------------------

export { _ORIGIN_TL_Node };

// -------------------------------------------------------------

console.log("________PT-TorrentList-Masonry________");

/**
 * 关键: __initReadTracking 必须独立于侧边栏挂载, 在脚本启动早期就执行,
 * 这样无论用户是否打开过侧边栏的"详细配置"面板, __historyReadSnapshot 都
 * 能被正确记录, "隐藏历史观看"开关首次开启即生效(不需要手动重启开关)。
 *
 * 修复前该函数在 sidepanel.svelte 的 onMount 异步调用, 依赖于:
 *   1) main.svelte 的 onMount 已被 Svelte 调度执行
 *   2) Sidepanel 组件已实例化 + onMount 已跑
 * 时序风险: 1.2.27b 前 __applyHideReadCards 只遍历 .card.pt-read, 若快照
 * 记录与卡片渲染间出现顺序错位/快照为空(.pt-read 未及时标), "隐藏历史
 * 观看" 首次开启时不生效, 必须手动重启开关重新触发 __applyHideReadCards。
 * 修复: 提前到 main.js 入口, 与侧边栏解耦, 保证快照最先记录。
 *
 * run-at: document-start 模式下 document.head 通常已存在, 注入 style
 * 仍包一层 try/catch 兜底, 避免极端时序下 document.head 还未创建报错。
 * __applyReadClasses() 此时卡片可能还没渲染, 这次遍历是 no-op; 真正生效
 * 靠 _index.svelte afterUpdate 与 MutationObserver 后续触发(1.2.27b 已修复,
 * 直接遍历所有 .card 不依赖 .pt-read 类)。
 */
try {
  __initReadTracking();
} catch (e) {
  // 极端 document-start 时序 (document.head 不存在等) 兜底, 推迟到
  // DOMContentLoaded 后再试一次, 保证快照记录与样式注入都成功。
  console.warn("[kesa] __initReadTracking 首次执行失败, 推迟到 DOMContentLoaded 重试:", e);
  const __retryInit = () => {
    try { __initReadTracking(); } catch (e2) { console.error("[kesa] __initReadTracking 重试仍失败:", e2); }
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", __retryInit, { once: true });
  } else {
    setTimeout(__retryInit, 0);
  }
}

// 用户详情页(userdetails.php)专用功能: 提取完成/未完成种子写入已读。
// 独立于瀑布流主逻辑, 仅在该页面注入按钮, 不干扰种子列表页/详情页。
try {
  __initUserDetail();
} catch (e) {
  console.warn("[kesa] __initUserDetail 执行失败:", e);
}

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

// ptfans.cc 根首页(https://ptfans.cc/ 及 https://www.ptfans.cc/)是空首页, 无种子列表,
// 不需要挂载瀑布流。虽然 userscript.config.js 的 exclude 已加 "@exclude https://ptfans.cc(/)" 
// 拦截, 但不同油猴管理器对仅域名的 exclude 匹配行为不完全一致, 为保险起见在运行时也
// 直接判断路径, 命中根首页立即终止, 避免瀑布流误挂载(与 M-Team /message/* 消息页守卫同理)。
// 注: 模块顶层不能用 return, 故用布尔开关包裹下方整段挂载逻辑。
const __isRootHome = /ptfans\.cc/i.test(window.location.hostname) &&
  /^\/(index\.php)?$/i.test(window.location.pathname);
if (!__isRootHome) {

// PTT(www.pttime.org/nicept.net/ptfans.cc) 专属架构: 结构与普通 NexusPHP 站不同
// (adults.php 等), 参照参考版 1.2.3b 采用 NEW_MT 注入路由——
// __pttBoot 提供 .app-content__inner/.ant-layout 宿主 + 加载 Masonry + 经
// window.__kesaHijack.handler 注入首页数据(_index.svelte onMount 注册 handler)。
// 但脚本 run-at 为 document-start, 需先轮询等 #torrenttable 出现再 __pttBoot 锚定宿主。
if (__isPTT) {
  // PTT(www.pttime.org/nicept.net/ptfans.cc) 专属架构: 参照参考版 1.2.3b 采用 NEW_MT 注入路由——
  // __pttBoot 提供 .app-content__inner/.ant-layout 宿主 + 加载 Masonry + 经 window.__kesaHijack.handler
  // 注入首页数据(_index.svelte onMount 注册 handler)。脚本 run-at 为 document-start,
  // 此时 #torrenttable 尚不存在, __pttBoot 内部锚定宿主会退到 body 末尾致瀑布流位置不对,
  // 故先轮询等原种子表格出现再 __pttBoot + 挂载(参照 NexusPHP 轮询时序)。
  let pttTries = 0;
  const pttTimer = setInterval(() => {
    pttTries++;
    _ORIGIN_TL_Node =
      document.querySelector("#torrenttable") ||
      document.querySelector("table.torrents");
    if (_ORIGIN_TL_Node || pttTries > 100) {
      clearInterval(pttTimer);
      console.log("PTT 站: 已定位原种子表格, 走 __pttBoot 宿主/注入路由(参照参考版 1.2.3b)");
      __pttBoot();
      mountApp();
    }
  }, 100);
}
else if (isMT) {
  // M-Team NEW_MT 站优先判断: SPA 无原始种子表格, 不依赖 list_selector。
  // (list_selector 需精确命中 SITE[domain], 若访问的 m-team 子域不在白名单
  //  list_selector 为 null, 但劫持 /search 数据源仍可用, 必须能正常挂载)
  // 参照 1.2.3b: M-Team 瀑布流应作为真实 div.app-content__inner 的兄弟节点插入,
  // _ORIGIN_TL_Node 即真实容器, 这样瀑布流模式隐藏原生种子表格时瀑布流自然显示在内容区。
  // SSR 页(/browse/* 等)的 div.app-content__inner 由 webpack 应用异步渲染, 需轮询等待。
  // 排除 M-Team 消息页(/message/*, 如 kp.m-team.cc/message/-2): 不是种子列表, 不需要瀑布流。
  // 虽然 userscript.config.js exclude 已拦截, 但 SPA 客户端路由跳转时脚本不会被重载,
  // 需在运行时也判断路径, 避免消息页误挂瀑布流。
  if (/\/message\/.*/i.test(window.location.pathname)) {
    console.log("M-Team 消息页(/message/*): 跳过瀑布流挂载");
  } else {
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
  }
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
} else {
  console.log("ptfans.cc 根首页: 跳过瀑布流挂载");
}
