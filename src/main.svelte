<script>
  import "./app.css";
  import "./utils/masonry.pkgd.Kesa";
  import { onMount } from "svelte";
  import Sidepanel from "./sidepanel.svelte";
  import Waterfall from "./sites/_index.svelte";
  import {
    _Global_Masonry,
    _show_mode,
    _iframe_switch,
    _iframe_url,
    _current_domain,
    _show_configPanel,
    _previewWidth,
    _previewHeight,
  } from "./stores";
  import { GET_TORRENT_LIST_SELECTOR, GLOBAL_SITE, IS_MT, __isPTT } from "./sites";
  import { __wdvAutoSync, __wdvAutoPush } from "./lib/sync";
  import { __kesaWatchLazy } from "./lib/lazyImage";
  import BtnTurnPage from "./component/btnTurnPage.svelte";
  import { fade } from "svelte/transition";
  // ------------------------------------------------

  console.log(
    `[${new Date().toLocaleTimeString()}]<--------------------------HMR-------------------------->`
  );

  // 1. 隐藏原种子列表并进行前置操作 --------------------------------------------------------------------------------------
  // 参照 1.2.3b: M-Team 的 _ORIGIN_TL_Node 直接用真实 div.app-content__inner(由 main.js
  // 轮询等到出现后才挂载), 瀑布流作为其兄弟节点插入; 这样瀑布流模式隐藏原生表格时,
  // 瀑布流自然显示在内容区, 而非被原生表格埋在下方面不可见。
  // SPA 页(/search 等)无 div.app-content__inner 时 fallback 到 #__kesaMTPlaceholder。
  let _ORIGIN_TL_Node;
  if (__isPTT) {
    // PTT(pttime/nicept/ptfans) 专属架构: __pttBoot 伪造的 div.app-content__inner 只是空宿主,
    // 不含原列表。_ORIGIN_TL_Node 必须指向真实原种子表格(#torrenttable / table.torrents),
    // 瀑布流模式的隐藏逻辑(display:none)才能隐藏原列表, 否则原始列表会残留可见。
    // main.js 已轮询等原表格出现后才 mountApp, 此处应能取到; 兜底再退回宿主。
    _ORIGIN_TL_Node = document.querySelector(GET_TORRENT_LIST_SELECTOR());
    if (!_ORIGIN_TL_Node) {
      _ORIGIN_TL_Node = document.querySelector("div.app-content__inner");
    }
  } else {
    _ORIGIN_TL_Node = document.querySelector("div.app-content__inner");
    if (!_ORIGIN_TL_Node && IS_MT(window.location.hostname)) {
      _ORIGIN_TL_Node = document.querySelector("#__kesaMTPlaceholder");
    }
    if (!_ORIGIN_TL_Node) {
      _ORIGIN_TL_Node = document.querySelector(GET_TORRENT_LIST_SELECTOR());
    }
  }
  // 隐藏原有视图
  // @ts-ignore
  // _ORIGIN_TL_Node.style.display = "none";

  $: {
    if (_ORIGIN_TL_Node) {
      _ORIGIN_TL_Node.style.display = $_show_mode ? "none" : "block";
    }
    // 注意: nextPageNode 承载的是 BtnTurnPage 组件的 #_turnPage("点击加载下一页"按钮),
    // 它是瀑布流 UI 的一部分, 应与瀑布流同步显示(瀑布流模式=block), 不能跟随原表格隐藏。
    // 若写成 $_show_mode ? "none" : "block", 瀑布流模式下会把加载按钮连同样隐藏掉,
    // 用户就看不到"点击加载下一页"了(同时紧随其后的页码导航 #kesaMtPageSel 也随之下移/不可见)。
    nextPageNode.style.display = $_show_mode ? "block" : "none";

    waterfallNode.style.display = $_show_mode ? "block" : "none";
  }

  // 这里检测 Masonry 是否加载成功了 ------------------
  // @ts-ignore
  while (!Masonry) {
    console.log("等待初始化......");
  }

  // 表格父节点
  const parentNode = _ORIGIN_TL_Node.parentNode;

  // 放置瀑布流的节点
  const waterfallNode = document.createElement("div");
  // 添加class
  waterfallNode.classList.add("waterfall");
  // PTT(www.pttime.org 等)结构与其他站点不同(adults.php 等专属架构),
  // 参照参考版 1.2.3b 采用 waterfall_newMT 专属布局(高度自适应), 避免卡片盖住页码导航
  if (__isPTT) waterfallNode.classList.add("waterfall_newMT");
  // 将瀑布流节点放置在表格节点上面
  parentNode.insertBefore(waterfallNode, _ORIGIN_TL_Node.nextSibling);

  // 放置随表格的下一页按钮的节点
  const nextPageNode = document.createElement("div");
  // 添加class
  nextPageNode.classList.add("nextPage");
  // 参照参考版 1.2.3b: .nextPage{position:relative;z-index:20000}
  // 保证"加载下一页"按钮在所有站点(尤其非 M-Team)不被瀑布流卡片盖住
  nextPageNode.style.position = "relative";
  nextPageNode.style.zIndex = "20000";
  // 将"加载下一页"按钮节点放在瀑布流节点之后(卡片框架外面、卡片下方),
  // 符合"卡片 → 点击加载下一页 → 页码导航"的正常阅读顺序;
  // 若插到 waterfallNode 之前(即瀑布流上方), 按钮会与卡片重叠/盖住卡片。
  parentNode.insertBefore(nextPageNode, waterfallNode.nextSibling);

  // console.log(waterfallNode);

  // 面板相关 ------------------------------------------------
  /** 关闭 iframe */
  function toggleIframe() {
    $_iframe_switch = 0;
  }

  /** esc 控制关闭所有面板 */
  function key_closePanels(event) {
    // console.log(event);
    if (event.key === "Escape") {
      console.log(event);
      $_iframe_switch = 0;
      $_show_configPanel = false;
    }
  }

  // ------------------------------------------------
  let masonry;

  // 预览窗口大小(参考 1.2.3b): 订阅 store 注入全局 CSS 变量 --pw/--ph 并同步站点 Iframe_Width
  // 宽度: 0=站点默认(Iframe_Width) 其他=自定义; 高度: 0=默认96% 其他=自定义%
  _previewWidth.subscribe((__pwV) => {
    try {
      const __site = GLOBAL_SITE[$_current_domain];
      if (__site && __pwV > 0) __site.Iframe_Width = __pwV;
      const __def = (__site && __site.Iframe_Width) || 1000;
      document.documentElement.style.setProperty("--pw", (__pwV > 0 ? __pwV : __def) + "px");
    } catch (e) {}
  });
  _previewHeight.subscribe((__phV) => {
    try {
      document.documentElement.style.setProperty("--ph", (__phV > 0 ? __phV : 96) + "%");
    } catch (e) {}
  });
  // 全局注入预览窗口尺寸样式(跨站点生效, 否则宽度/高度滑块失效)
  if (!document.getElementById("__pwSizeCss")) {
    const __pwStyle = document.createElement("style");
    __pwStyle.id = "__pwSizeCss";
    __pwStyle.textContent =
      "div#_iframe ._iframe{width:min(var(--pw,1600px),94vw)!important;height:var(--ph,96%)!important}" +
      "div#_iframe ._iframe iframe{width:100%!important;height:100%}";
    (document.head || document.documentElement).appendChild(__pwStyle);
  }

  /** 启动项目配置*/
  onMount(() => {
    // UI -> 1. 边栏配置
    const componentSidePanel = new Sidepanel({
      target: document.body,
      props: {
        // 传递给组件的属性
        originTable: _ORIGIN_TL_Node,
      },
    });

    // UI -> 2. 瀑布流配置
    const componentMasonry = new Waterfall({
      target: waterfallNode,
      props: {
        // 传递给组件的属性
        originTable: _ORIGIN_TL_Node,
        waterfallNode,
      },
    });

    // UI -> 3. 原表格下一页按钮配置
    const componentBtnTurnPage = new BtnTurnPage({
      target: nextPageNode,
    });

    // 懒加载接管器: 启动时预热原列表封面图(new Image() 灌浏览器缓存 + 强制 eager),
    // 后续由 _index.svelte afterUpdate 在每次卡片渲染后接管新增的 .nexus-lazy-load_Kesa。
    // 设计: 复用原列表已加载的同 src 图(避免重复请求), 失败回退站点 image_proxy 端点。
    __kesaWatchLazy();

    // 多设备 WebDAV 同步: 打开页面自动下载(已读/设置/页码), 关闭页面自动上传(兜底)
    __wdvAutoSync();
    window.addEventListener("pagehide", __wdvAutoPush);
  });
</script>

<!-- iframe 详情 -->
{#if $_iframe_switch}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div id="_iframe" on:click={toggleIframe} transition:fade={{ duration: 300 }}>
    <div class="_iframe">
      <iframe
        src={$_iframe_url}
        frameborder="0"
        title="wow"
        style="width:
          {GLOBAL_SITE[$_current_domain]
          ? GLOBAL_SITE[$_current_domain].Iframe_Width
          : 1000}px"
      />
    </div>
  </div>
{/if}

<!-- NOTE: svelte 绑定 window -> 按 escape 退出各种子面板 -->
<svelte:window on:keydown|capture={key_closePanels} />

<style>
  div#_iframe {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 38, 38, 0.607);
    z-index: 30000;

    display: flex;
  }

  /* 预览窗口大小由全局 --pw/--ph 控制(侧边栏"预览窗口宽度/高度"滑块) */
  ._iframe {
    width: min(var(--pw, 1600px), 94vw);
    height: var(--ph, 96%);
    margin: auto;
  }

  ._iframe iframe {
    width: 100%;
    height: 100%;
    border: 0;
    margin: auto;
  }
</style>
