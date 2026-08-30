<script>
  import {
    _current_domain,
    _Global_Masonry,
    _card_layout,
    _animated,
    _current_bgColor,
    _turnPage,
    _iframe_switch,
    _iframe_url,
    _show_configPanel,
  } from "../stores";
  import { onMount, afterUpdate } from "svelte";

  import { sortMasonry, NEXUS_TOOLS, debounce } from "../utils";
  import { __kesaWatchLazy } from "../lib/lazyImage";
  import {
    GLOBAL_SITE,
    GET_CURRENT_PT_DOMAIN,
    GET_TORRENT_LIST_SELECTOR,
    IS_MT,
    __isPTT,
    __pttParse,
    __pttBoot,
  } from "./index";
  import "../utils/masonry.pkgd.Kesa";

  import { CARD, PAGE } from "../default.config";
  import { Launch_Hijack } from "../lib/mteamHijack";
  import {
    __kesaRestorePage,
    __kesaSavePageState,
    __kesaPageInd,
    __applyReadClasses,
  } from "../lib/sync";

  import TorrentCard from "./torrentCard.svelte";

  // 父子参数 ------------------------------------------------

  /** 父传值: 原有种子列表dom*/
  export let originTable;

  /** 父传值: 瀑布流dom*/
  export let waterfallNode;

  // 组件函数 ------------------------------------------------

  /** 旧结构 -> 新结构 归一化适配 (供统一卡片消费)
   * 新结构: {name, id, size(数字), smallDescr, labels, category, imageList:[url],
   *          status:{seeders, leechers, comments, discount, toppingLevel, createdDate, discountEndTime},
   *          torrentLink}
   * 若已是新结构(有 imageList/status), 原样返回
   * @param {object} it 种子信息对象
   * @returns {object} 新结构种子对象
   */
  function __normalizeTorrent(it) {
    if (!it) return it;
    // 已是新结构: 直接消费
    if (it.imageList || it.status) return it;
    // 旧结构(kamept/mteam 的 config.TORRENT_LIST_TO_JSON 输出) -> 转新结构
    const status = it.status || {};
    return {
      name: it.torrent_name || it.name || "",
      // keyed each 需要稳定唯一 key: 优先 torrentId, 其次原始链接兜底(防止 torrentId 全为 null 时 key 重复致渲染异常)
      id: it.torrentId != null ? it.torrentId : (it.id != null ? it.id : (it.torrentLink || it.categoryLink || "")) ,
      size: typeof it.size === "number" ? it.size : __parseSize(it.size),
      smallDescr: it.description || "",
      labels: it.labels || 0,
      category: it.categoryNumber != null ? it.categoryNumber : it.category,
      imageList: it.picLink ? [it.picLink] : [],
      status: {
        seeders: it.seeders || 0,
        leechers: it.leechers || 0,
        comments: it.comments || 0,
        discount: (status.discount) || __mapDiscount(it.free_type),
        toppingLevel: 0,
        createdDate: it.upload_date || "",
        discountEndTime: null,
      },
      torrentLink: it.torrentLink || "",
      collection: it.collectState === "Bookmarked",
    };
  }

  /** 解析大小字符串为数字(如 "1.5 GB" -> 字节数) */
  function __parseSize(s) {
    if (s == null) return 0;
    if (typeof s === "number") return s;
    const m = String(s).trim().toUpperCase().match(/([\d.]+)\s*(B|KB|MB|GB|TB)/);
    if (!m) return 0;
    const mult = { B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 }[m[2]] || 1;
    return Math.round(parseFloat(m[1]) * mult);
  }

  /** 旧 free_type(如 "_FREE") -> 新 discount(FREE/PERCENT_50/NORMAL) */
  function __mapDiscount(free_type) {
    const t = String(free_type || "").toUpperCase();
    if (t.indexOf("FREE") !== -1) return "FREE";
    if (t.indexOf("50") !== -1 || t.indexOf("2X") !== -1) return "PERCENT_50";
    return "NORMAL";
  }

  /** 从 URL 解析当前页码(NexusPHP 用 page, M-Team 用 pageNumber)
   * @returns {number} 页码(无则 1)
   */
  function currentPageFromUrl() {
    try {
      const sp = new URLSearchParams(window.location.search);
      const v = parseInt(sp.get("page") || sp.get("pageNumber") || sp.get("p") || "", 10);
      return isNaN(v) || v < 1 ? 1 : v;
    } catch (e) {
      return 1;
    }
  }

  /** 根据列数/间距/边距计算卡片宽度(列数驱动, 参考 1.2.3b)
   * @param {number} column 列数
   * @param {number} gap 卡片间距px
   */
  function computeCardWidth(column, gap) {
    if (!waterfallNode) return 0;
    const _wf = waterfallNode;
    const _margin = $_card_layout.margin ?? 20;
    _wf.style.width = "calc(100vw - " + 2 * _margin + "px)";
    _wf.style.marginLeft = _margin - _wf.getBoundingClientRect().left + "px";
    _wf.style.marginRight = "0px";
    if (column <= 1 || gap <= 1) {
      console.warn("卡片列数或卡片间隔过小, 列数不小于2, 间隔不小于1");
      return 0;
    }
    // 容器尚无实际宽度(卡片未渲染/容器暂未排版)时用视口宽兜底,
    // 否则 (0-(column-1)*gap)/column 得到负宽(如 -15)导致卡片不可见。
    let _cw = _wf.clientWidth;
    if (!_cw || _cw <= 0) _cw = window.innerWidth - 2 * _margin;
    const U = (_cw - (column - 1) * gap) / column;
    // 同步每张卡片宽度
    if (waterfallNode) {
      Array.from(waterfallNode.querySelectorAll(".card")).forEach((W) => {
        W.style.width = U + "px";
      });
    }
    return U;
  }

  /** 调整卡片布局 (列数驱动) */
  function CHANGE_CARD_LAYOUT() {
    const { column, gap } = $_card_layout;
    const U = computeCardWidth(column, gap);
    if (U <= 0) return;
    CARD.CARD_WIDTH = U;
    if (masonry) {
      masonry.options.columnWidth = U;
      masonry.options.gutter = gap;
      masonry.options.transitionDuration = $_animated ? 0.4 : 0;
      masonry.layout();
    }
    sortMasonry("fast");
    sortMasonry("fast");
  }
  window.CHANGE_CARD_LAYOUT = CHANGE_CARD_LAYOUT;

  // 卡片移动动画开关: 实时切换 masonry 缓动动画
  $: if (masonry) {
    masonry.options.transitionDuration = $_animated ? 0.4 : 0;
  }

  // 翻页相关 ------------------------------------------------

  /** 控制加载按钮是否激活 */
  let isButtonDisabled = false;
  /** 控制翻页 & onMount 响应 */
  let onMountSignal = false;
  /** 加载文字 */
  const LOAD_TEXT = {
    normal: "点击加载下一页",
    suspend: `下一页加载CD: ${PAGE.GAP} ms`,
    disable: "不可用",
  };

  /** 翻页
   * @param event
   */
  function turnPage(event) {
    // 防止默认行为的发生
    event.preventDefault();
    // console.log(event);

    // 加载下一页
    if (!$_turnPage) debounceLoad();

    // 加载下一页3秒防抖
    if (!isButtonDisabled) {
      isButtonDisabled = true;
      setTimeout(() => {
        isButtonDisabled = false;
      }, PAGE.GAP);
    }
  }
  window.turnPage = turnPage;

  /** 延迟调用 Nexus Tool */
  function nexus_tool_delay() {
    setTimeout(NEXUS_TOOLS, 500);
  }

  // ------------------------------------------------
  // FIXME: 瀑布流渲染流程------------------------------------------------

  // 1. 获取当前域名 & 背景颜色 --------------------------------------------------------------------------------------
  $_current_domain = GET_CURRENT_PT_DOMAIN();
  // console.log($_current_domain);

  /** 获取主题背景色 */
  const mainOuterDOM = document.querySelector("table.mainouter");
  const themeColor = mainOuterDOM
    ? window.getComputedStyle(mainOuterDOM)["background-color"]
    : "#1a1a1a";
  $_current_bgColor = themeColor;
  console.log("背景颜色:", themeColor);

  // 2. 根据当前域名拿到对应的数据 --------------------------------------------------------------------------------------
  const config = GLOBAL_SITE[$_current_domain];
  let infoList = [];

  /** 当前是否为 M-Team NEW_MT 站(SPA, 数据来自劫持 /search 请求) */
  const isMT = IS_MT($_current_domain);

  if (isMT) {
    // M-Team 路由: 数据来自对站点自身 /search 请求的劫持(res>POST->/search 事件),
    // 而非 NexusPHP 的 DOM 解析。初始 infoList 为空, 等首个响应事件填充。
    console.log("M-Team NEW_MT 站: 走劫持 /search 数据源路由");
  } else if (__isPTT) {
    // PTT(www.pttime.org/nicept.net/ptfans.cc) 专属架构路由: 结构与普通 NexusPHP 站不同(adults.php 等),
    // 参照参考版 1.2.3b 采用 NEW_MT 注入路由——__pttBoot 提供宿主 + 经 window.__kesaHijack.handler
    // 注入首页数据(onMount 里 __pttHandlerBoot 注册 handler)。初始 infoList 为空, 等注入填充。
    console.log("PTT 站: 走 __pttBoot 宿主/注入路由(参照参考版 1.2.3b)");
  } else {
    // NexusPHP 路由: 直接解析原表格 DOM
    // PTT/NicePT/PTFans 用 __pttParse(按站点列索引适配); 其余(kamept)用各站 config.TORRENT_LIST_TO_JSON
    try {
      infoList = [
        ...infoList,
        ...(__isPTT
          ? __pttParse(originTable)
          : config.TORRENT_LIST_TO_JSON(originTable).map(__normalizeTorrent)),
      ];
    } catch (err) {
      // 防御: 解析崩溃会让 new Waterfall() 抛错 → 卡片/加载按钮全不渲染(但悬浮窗已先建, 仍显示)。
      // 这里捕获并打印, 避免整组件初始化失败, 并让具体错误在控制台可见。
      console.error("[Waterfall] 种子列表解析失败, 卡片可能为空:", err);
      infoList = [];
    }
  }

  console.log("---> 环境:\t", import.meta.env.VITE_APP_ENV);

  if (import.meta.env.VITE_APP_ENV == "development") {
    console.log(infoList);
  }

  // NOTE: 如果站点有特殊操作, 这里执行
  // 防御: special() 若抛错会中断组件初始化(卡片全不渲染), 故捕获并打印
  try {
    GLOBAL_SITE[$_current_domain]?.special();
  } catch (err) {
    console.error("[Waterfall] 站点特殊操作 special() 失败(不影响卡片渲染):", err);
  }

  // 3. 开整瀑布流 --------------------------------------------------------------------------------------

  let masonry;
  $: if (masonry) {
    CARD.CARD_WIDTH = computeCardWidth($_card_layout.column, $_card_layout.gap);
    console.log("卡片宽度:\t", CARD.CARD_WIDTH);

    CHANGE_CARD_LAYOUT();
  }

  // FIXME:
  // 4. 底部检测 & 加载下一页 --------------------------------------------------------------------------------------
  // |-- 4.1 检测是否到了底部

  /** 延迟加载事件 */
  let debounceLoad;
  function scan_and_launch() {
    const scrollHeight = document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop + clientHeight >= scrollHeight - PAGE.DISTANCE) {
      if ($_turnPage) debounceLoad();
      else {
        console.log("加载模式: 按钮");
      }

      // 这里整理一下瀑布流, 往往这里会出一点格式问题
      sortMasonry();
    }
  }

  // |-- 4.2 加载下一页
  debounceLoad = debounce(loadNextPage, PAGE.GAP);

  /** 加载下一页的本体函数 */
  function loadNextPage() {
    console.log("到页面底部啦!!! Scrolled to bottom!");
    // |--|-- 4.2.1 获取下一页的链接
    // 使用 URLSearchParams 对象获取当前网页的查询参数
    const urlSearchParams = new URLSearchParams(window.location.search);

    // 获取名为 "page" 的参数的值 -> 初始为页面值, 更新为更新值
    PAGE.PAGE_CURRENT = PAGE.IS_ORIGIN
      ? Number(urlSearchParams.get("page"))
      : PAGE.PAGE_CURRENT;

    // PAGE 初始页面值获取
    if (PAGE.IS_ORIGIN) PAGE.PAGE_ORIGIN = PAGE.PAGE_CURRENT;

    // 如果 "page" 参数不存在，则将页数设为 0，否则打印当前页数
    if (!PAGE.PAGE_CURRENT) {
      console.log(
        `网页链接没有page参数, 无法跳转下一页, 生成PAGE.PAGE_CURRENT为0`
      );
      PAGE.PAGE_CURRENT = 0;
    } else {
      console.log("当前页数: " + PAGE.PAGE_CURRENT);
    }

    // 将页数加 1，并设置为新的 "page" 参数的值
    // @ts-ignore
    PAGE.PAGE_NEXT = parseInt(PAGE.PAGE_CURRENT) + 1;
    // @ts-ignore
    urlSearchParams.set("page", PAGE.PAGE_NEXT);

    // 生成新的链接，包括原网页的域名、路径和新的查询参数
    PAGE.NEXT_URL =
      window.location.origin +
      window.location.pathname +
      "?" +
      urlSearchParams.toString();

    // 打印新的链接
    console.log("New URL:", PAGE.NEXT_URL);

    // TODO: 搞个 list 放入所有生成的新链接, 如果新链接存在就不 fetch 新数据

    // |--|-- 4.2.2 加载下一页 html 获取 json 信息对象
    fetch(PAGE.NEXT_URL)
      .then((response) => response.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const table = doc.querySelector(GET_TORRENT_LIST_SELECTOR());

        // NOTE: 原表格随着下一页加载增多
        // FIXME: 目前这里没有问题, 但是保不准其他站点会有问题, 到时候再说吧
        // console.log(table);

        if (__isPTT) {
          // PTT/NicePT/PTFans: 用 __pttParse 按站点列索引解析下一页(不 append 原表格行, 瀑布流直接消费 infoList)
          const objs = __pttParse(doc);
          if (objs.length) {
            infoList = [...infoList, ...objs];
            PAGE.IS_ORIGIN = false;
            PAGE.PAGE_CURRENT = PAGE.PAGE_NEXT;
            onMountSignal = true;
            setTimeout(() => { onMountSignal = false; }, 1000);
          } else {
            console.log("获取不到下页信息, 可能到头了");
          }
          // 记录页码(供刷新恢复 + WebDAV 页码同步) + 更新侧边栏"第 N 页"指示器
          __kesaSavePageState(PAGE.PAGE_NEXT);
          __kesaPageInd(PAGE.PAGE_NEXT);
          return;
        }

        // 获取下一页表格
        const list = Array.from(table.cloneNode(true).children[0].children);
        // 改第一行的标题名称
        list[0].children[1].textContent = `
        ↓ 新加载第${PAGE.PAGE_NEXT - PAGE.PAGE_ORIGIN}页`;

        console.log(PAGE.PAGE_ORIGIN);
        // 将新表格加入原表格
        originTable.children[0].append(...list);

        // NOTE: 如果站点有下一页加载后操作, 这里执行
        // GLOBAL_SITE[$_current_domain]?.pageLoaded();
        typeof GLOBAL_SITE[$_current_domain]?.pageLoaded === "function"
          ? GLOBAL_SITE[$_current_domain]?.pageLoaded()
          : null;

        // NOTE: 瀑布流
        infoList = [
          ...infoList,
          ...config.TORRENT_LIST_TO_JSON(table).map(__normalizeTorrent),
        ];

        // // |--|-- 4.2.3 渲染 下一页信息 并 加到 waterfallNode 里面来
        // PUT_TORRENT_INTO_MASONRY(table, waterfallNode, false, masonry);
        // // PUT_TORRENT_INTO_MASONRY(_ORIGIN_TL_Node, waterfallNode, false, masonry);

        // // 生成新的时候再改一次图片宽度
        // CHANGE_CARD_WIDTH(CARD.CARD_WIDTH, waterfallNode, masonry);

        // FIXME: 这里没搞定捏

        // 页数更新, 在上面几行更新会导致没有下一页的情况下仍然触发
        PAGE.IS_ORIGIN = false;
        PAGE.PAGE_CURRENT = PAGE.PAGE_NEXT;

        // 记录页码(供刷新恢复 + WebDAV 页码同步) + 更新侧边栏"第 N 页"指示器
        __kesaSavePageState(PAGE.PAGE_NEXT);
        __kesaPageInd(PAGE.PAGE_NEXT);

        // NOTE: 配置 onMount 和 翻页的协同响应, 避免被其他 dom 刷新干扰重复调用
        onMountSignal = true;
        setTimeout(() => {
          onMountSignal = false;
        }, 1000);
      })
      .catch((error) => {
        // console.error(error);
        console.warn("获取不到下页信息, 可能到头了");
        console.warn(error);
      });
  }

  /** 启动项目配置*/
  onMount(() => {
    // 生成瀑布流
    // @ts-ignore
    masonry = new Masonry(waterfallNode, {
      itemSelector: ".card",
      columnWidth: computeCardWidth($_card_layout.column, $_card_layout.gap),
      gutter: $_card_layout.gap,
      transitionDuration: $_animated ? 0.4 : 0,
    });

    // 绑定各种全局变量
    // @ts-ignore
    window.masonry = masonry;
    $_Global_Masonry = masonry;

    // 初始化整理布局
    masonry.layout("fast");
    masonry.layout("fast");

    // 刷新后恢复页码(仅真实刷新 F5/Ctrl+R 时, 依据 base URL 一致才跳转)
    __kesaRestorePage();
    // 实时记录当前页码 + 侧边栏"第 N 页"指示器(点击跳转真实 URL)
    __kesaSavePageState(currentPageFromUrl());
    __kesaPageInd(currentPageFromUrl());

    // 窗口尺寸变化后重跑布局(防抖, 保持用户设定列数 + 重新居中)
    if (!window.__kesaResizeBound) {
      window.__kesaResizeBound = true;
      let rTimer = null;
      window.addEventListener("resize", function () {
        clearTimeout(rTimer);
        rTimer = setTimeout(function () {
          window.CHANGE_CARD_LAYOUT && window.CHANGE_CARD_LAYOUT();
        }, 120);
      });
    }

    // M-Team 路由: 启动劫持, 监听 /search 请求与响应
    if (isMT) {
      __mteamBoot();
    }

    // PTT 专属架构路由: 注册 __kesaHijack.handler 处理器(参照参考版 1.2.3b __kesaBind),
    // 供 __pttBoot 的 __pttInject(1) 经 S.handler 注入首页数据填充 infoList。
    if (__isPTT) {
      __pttHandlerBoot();
    }

    // 给瀑布流节点放一个手动点击整理的功能
    waterfallNode.addEventListener("click", (event) => {
      // 模拟 self, 只有在点击本身而非子元素的时候时触发效果
      if (event.target === event.currentTarget) {
        if (masonry) masonry.layout();
        console.log("Masonry 已整理~");
      }
    });

    // 滚动到底部检测
    window.addEventListener("scroll", function () {
      scan_and_launch();
    });

    // Nexus Tools
    NEXUS_TOOLS();

    // NOTE: 这里不能注释掉, 必须留着, 不然 MT 可能不加载 NEXUS_TOOLS
    // @ts-ignore
    window.NEXUS_TOOLS = NEXUS_TOOLS;
  });

  /**
   * M-Team NEW_MT 站数据源: 启动 Launch_Hijack 劫持站点自身的 /search POST 请求,
   * 监听 req/res 自定义事件, 从响应 JSON(rawObject.data 种子数组)填充 infoList 并刷新瀑布流。
   * 参考 PT_Fall-View/src/views/Entry_Mteam.svelte 的 launchFallView 逻辑。
   */
  let __mteamReqListener = null;
  let __mteamResListener = null;
  let __mteamDocListener = null;
  /** 是否接受本次 /search 响应(仅种子列表请求, 过滤 "mode":"waterfall" 等非列表请求) */
  let __mteamIsAccept = false;
  /** 是否已拿到种子数据(劫持或回退任一成功即置位, 避免重复请求) */
  let __mteamGot = false;
  function __mteamBoot() {
    // 启动劫持(XHR + fetch), 无需清理(脚本生命周期与页面一致)
    Launch_Hijack({ path: "/search", method: "POST" });

    // 请求事件: 判断是否种子列表请求
    __mteamReqListener = (e) => {
      const url = (e.detail && e.detail.url) || "";
      const body = (e.detail && e.detail.body) || "";
      // 仅接受 /api/torrent/search 的种子列表请求, 过滤 "mode":"waterfall"(瀑布流辅助请求)
      if (url.includes("api/torrent/search") && !String(body).includes('"mode":"waterfall"')) {
        __mteamIsAccept = true;
      } else {
        __mteamIsAccept = false;
      }
    };
    window.addEventListener("req>POST->/search", __mteamReqListener);

    // 响应事件: 填充数据
    __mteamResListener = (e) => {
      if (!__mteamIsAccept) return; // 非种子列表请求不处理
      try {
        const rawObject = JSON.parse(e.detail.data);
        const list = rawObject && rawObject.data ? rawObject.data : [];
        if (!Array.isArray(list)) return;

        // 每个 /search 响应即一页完整数据, 整体替换(分页导航由站点发起新请求, 触发新响应)
        __mtFill(list);
      } catch (err) {
        console.warn("M-Team 响应解析失败:", err);
      }
    };
    window.addEventListener("res>POST->/search", __mteamResListener);

    // ---- M-Team 沙盒回退数据源 ----
    // 油猴脚本运行在 sandbox, 无法劫持页面主世界(webpack 应用)发起的 XHR/fetch,
    // 故 `res>POST->/search` 事件在 SSR 页(/browse/movie 等)永不触发 → infoList 恒空 → 卡片 0。
    // 这里提供回退: 向页面主世界注入脚本读取 localStorage + HMAC-SHA1 签名 + fetch 请求
    // apiHost + /torrent/search, 再通过 document 自定义事件(跨世界共享)把 data.data 回传沙盒。
    __mteamDocListener = (e) => {
      const list = e.detail && e.detail.list;
      if (!Array.isArray(list) || !list.length) return;
      __mtFill(list);
    };
    document.addEventListener("__kesaMTData", __mteamDocListener);

    // 劫持 3 秒仍无数据 → 主动签名请求回退(参考 1.2.3b __kesaOldU 方案, 适配沙盒)
    setTimeout(() => {
      if (__mteamGot) return;
      __mtFetchFallback();
      // 轮询兜底: 即便 CustomEvent 跨世界不可达, 也能从共享 DOM 属性(documentElement)读到数据
      let __polls = 0;
      const __poll = setInterval(() => {
        if (__mteamGot) { clearInterval(__poll); return; }
        const arr = document.documentElement && document.documentElement.__kesaMTData;
        if (Array.isArray(arr) && arr.length) {
          clearInterval(__poll);
          __mtFill(arr);
          return;
        }
        if (++__polls >= 8) clearInterval(__poll); // 最多约 4 秒
      }, 500);
    }, 3000);
  }

  /** M-Team 沙盒回退: 注入主世界脚本执行签名请求, 结果经 document 自定义事件回传 */
  function __mtFetchFallback() {
    try {
      // 主世界脚本: 读取 localStorage → 签名 → fetch apiHost + /torrent/search → 派发 __kesaMTData
      const mainScript = `(function(){
        try{
          var __secret="HLkPcWmycL57mfJt";
          var __apiHost=localStorage.getItem("apiHost")||"";
          var __u=(__apiHost||("https://api.m-team"+location.origin.match(/\\.([^.]+)$/)[0]+"/api"))+"/torrent/search";
          var __o={${__mtBuildReqBody()}};
          __o._timestamp=Date.now();
          if(!window.crypto||!window.crypto.subtle)return;
          window.crypto.subtle.importKey("raw",new TextEncoder().encode(__secret),{name:"HMAC",hash:"SHA-1"},false,["sign"]).then(function(k){
            return window.crypto.subtle.sign("HMAC",k,new TextEncoder().encode("POST&"+new URL(__u).pathname+"&"+__o._timestamp));
          }).then(function(sig){
            __o._sgin=btoa(String.fromCharCode.apply(null,new Uint8Array(sig)));
            var __h={"Content-Type":"application/json",version:"1.1.7",webVersion:"1170",visitorId:localStorage.getItem("visitorId")||"",did:localStorage.getItem("did")||"",authorization:localStorage.getItem("auth")||"",ts:Math.floor(Date.now()/1e3)};
            return fetch(__u,{method:"POST",headers:__h,body:JSON.stringify(__o)});
          }).then(function(r){return r.json();}).then(function(j){
            var __arr=(j&&j.data&&j.data.data)||[];
            if(!__arr.length)return;
            document.documentElement.__kesaMTData=__arr;
            document.dispatchEvent(new CustomEvent("__kesaMTData",{detail:{list:__arr}}));
          }).catch(function(err){console.warn("[Masonry] M-Team 回退请求失败:",err);});
        }catch(err){console.warn("[Masonry] M-Team 回退注入失败:",err);}
      })();`;
      const s = document.createElement("script");
      s.textContent = mainScript;
      (document.head || document.documentElement).appendChild(s);
      s.remove();
      console.log("[Masonry] M-Team 劫持无数据, 已回退主动签名请求(注入主世界)");
    } catch (err) {
      console.warn("[Masonry] M-Team 回退启动失败:", err);
    }
  }

  /** M-Team 回退请求体: 从当前 URL 解析 mode/分类/页码/排序 */
  function __mtBuildReqBody() {
    try {
      const u = new URL(window.location.href);
      const mode = u.pathname.split("/")[2] || "normal";
      const cats = u.searchParams.getAll("cat");
      const pageNum = Number(u.searchParams.get("pageNumber")) || 1;
      const sort = u.searchParams.get("sort") || "";
      const b = ["pageNumber:" + pageNum, "pageSize:20", "visible:1"];
      if (mode) b.push("mode:" + JSON.stringify(mode));
      if (cats && cats.length) b.push("categories:" + JSON.stringify(cats));
      if (sort) {
        let sf = sort.split(":")[0].toUpperCase();
        let sfF = "";
        if (sf.includes("DATE")) sfF = "CREATED_DATE";
        else if (sf.includes("SIZE")) sfF = "SIZE";
        else if (sf.includes("SEEDER")) sfF = "SEEDERS";
        else if (sf.includes("LEECHER")) sfF = "LEECHERS";
        else if (sf.includes("TIME")) sfF = "TIMES_COMPLETED";
        let sd = sort.split(":")[1].toUpperCase().includes("ASC") ? "ASC" : "DESC";
        if (sfF) { b.push("sortField:" + JSON.stringify(sfF)); b.push("sortDirection:" + JSON.stringify(sd)); }
      }
      return b.join(",");
    } catch (e) {
      return "pageNumber:1,pageSize:20,visible:1,mode:\"normal\"";
    }
  }

  /** 填充 infoList 并刷新瀑布流(M-Team 通用) */
  function __mtFill(list) {
    if (__mteamGot) return;
    __mteamGot = true;
    try {
      infoList = list.map(__normalizeTorrent);
    } catch (err) {
      console.warn("M-Team 数据归一化失败:", err);
      infoList = list;
    }
    // 等 Svelte 把卡片渲染进 DOM 后再重算布局: 首次 masonry 创建时 infoList 为空,
    // 容器 clientWidth=0 曾导致卡片负宽(-15)不可见, 必须在卡片存在后重新计算宽度并排版。
    setTimeout(() => {
      if (window.CHANGE_CARD_LAYOUT) window.CHANGE_CARD_LAYOUT();
      if (masonry) {
        masonry.reloadItems();
        masonry.layout("fast");
        masonry.layout("fast");
      }
      setTimeout(NEXUS_TOOLS, 300);
    }, 80);
  }

  // ---- PTT 专属架构数据源(参照参考版 1.2.3b 的 NEW_MT 注入路由) ----
  // PTT(www.pttime.org/nicept.net/ptfans.cc) 结构(adults.php 等)与普通 NexusPHP 站不同,
  // 不走 DOM 解析路由, 而由 __pttBoot(main.js) 提供宿主并调用 __pttInject(page) 把首页数据
  // 经 window.__kesaHijack.handler 注入。此处注册该 handler(镜像参考版 __kesaHandler)。
  /** PTT 是否已绑定 handler(避免重复绑定) */
  let __pttHooked = false;
  function __pttHandlerBoot() {
    const S = window.__kesaHijack;
    if (!S || __pttHooked) return;
    __pttHooked = true;
    S.handler = __pttHandler;
    // 消费 __pttBoot 注入前的排队数据(若 __pttInject 在 handler 就绪前先到)
    if (S.queue && S.queue.length) {
      const q = S.queue;
      S.queue = [];
      q.forEach((d) => { try { __pttHandler(d); } catch (e) {} });
    }
  }
  /** PTT 注入处理器: 解析 __pttInject 派发的 {type:"res", data} 并填充 infoList 刷新瀑布流 */
  function __pttHandler(d) {
    if (!d || d.type !== "res") return;
    if (d.body && d.body.indexOf('"mode":"waterfall"') >= 0) return;
    let re;
    try { re = JSON.parse(d.data); } catch (e) { return; }
    const pl = re && re.data, ls = pl && pl.data;
    if (!Array.isArray(ls)) return;
    let list;
    try { list = ls.map(__normalizeTorrent); } catch (err) { list = ls; }
    const pg = pl.pageNumber || 1;
    const cur = currentPageFromUrl();
    infoList = pg === 1 || infoList.length === 0 || pg <= cur ? [...list] : [...infoList, ...list];
    try {
      const S = window.__kesaHijack;
      if (S && typeof S.setPage === "function") S.setPage(pg);
    } catch (e) {}
    // 等 Svelte 把卡片渲染进 DOM 后再重算布局(参照 __mtFill: 首次 masonry 创建时 infoList 为空,
    // 容器 clientWidth=0 曾导致卡片负宽不可见, 必须在卡片存在后重新计算宽度并排版)
    setTimeout(() => {
      if (window.CHANGE_CARD_LAYOUT) window.CHANGE_CARD_LAYOUT();
      if (masonry) {
        masonry.reloadItems();
        masonry.layout("fast");
        masonry.layout("fast");
      }
      setTimeout(NEXUS_TOOLS, 300);
    }, 80);
  }

  /** 更新项目配置*/
  afterUpdate(() => {
    console.log("afterUpdate-------------------->");

    // 懒加载接管: 每次 svelte 更新后接管新插入的 .nexus-lazy-load_Kesa 卡片图
    // (去重由 __kesaQueue 内部 __kesaQueued/__kesaFail 标志保证, 重复调用无副作用)
    try { __kesaWatchLazy(); } catch (e) {}

    // 已读标记 + 隐藏历史观看: 每次 svelte 更新后重新应用。
    // 修复"点击加载下一页后, 新加载的下一页历史观看没有被隐藏"的 BUG——
    // svelte 非 keyed each 复用了已有 .card 节点(只更新内容不增删节点),
    // MutationObserver 只监听 childList(节点增删)看不到这种就地更新, 导致 __applyReadClasses
    // 不触发; 在 afterUpdate(svelte 每次更新后必触发)里主动重新应用即可覆盖。
    // (__applyReadClasses 按 __historyReadSnapshot 实时判定历史观看, 幂等可重复调用)
    try { __applyReadClasses(); } catch (e) {}

    // 配置 onMount 和 翻页的协同响应, 避免被其他 dom 刷新干扰重复调用
    if (masonry && onMountSignal) {
      console.log("reload Items-------------------->");
      masonry.reloadItems();
      masonry.layout();
      // setTimeout(NEXUS_TOOLS, 500);

      // NOTE: 修复了直接调用 Nexus 会导致懒加载失效的 bug
      setTimeout(NEXUS_TOOLS, 600);

      // masonry.on("layoutComplete", nexus_tool_delay);
      // setTimeout(() => {
      //   masonry.off("layoutComplete", nexus_tool_delay);
      // }, 1500);

      // masonry.on("layoutComplete", function () {
      //   setTimeout(NEXUS_TOOLS, 500);
      // });
      // NEXUS_TOOLS();
    }
  });
</script>

<!-- 卡片渲染模版 -->
{#each infoList as info, i (info.id)}
  <TorrentCard torrentInfo={info} cardWidth={CARD.CARD_WIDTH} index={i} />
{/each}

<!-- 点击加载下一页的按钮 -->
<div>
  <button
    id="turnPage"
    on:click={turnPage}
    disabled={$_turnPage || isButtonDisabled}
  >
    {#if $_turnPage}
      {LOAD_TEXT.disable}
    {:else if isButtonDisabled}
      {LOAD_TEXT.suspend}
    {:else}
      {LOAD_TEXT.normal}
    {/if}
  </button>
</div>

<style>
  /* 加载下一页按钮: 参照参考版 1.2.3b 加 z-index, 避免在非 M-Team 站点被卡片盖住(卡片 z 层更高时按钮"被压到卡片下面") */
  #turnPage {
    width: 100%;
    height: 32px;
    border-radius: 16px;
    line-height: 20px;
    font-size: 14px;

    position: absolute;
    bottom: 0px;
    z-index: 20000;
  }
</style>
