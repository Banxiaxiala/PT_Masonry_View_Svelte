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
  import {
    GLOBAL_SITE,
    GET_CURRENT_PT_DOMAIN,
    GET_TORRENT_LIST_SELECTOR,
    IS_MT,
    __isPTT,
    __pttParse,
  } from "./index";
  import "../utils/masonry.pkgd.Kesa";

  import { CARD, PAGE } from "../default.config";
  import { Launch_Hijack } from "../lib/mteamHijack";
  import { __kesaRestorePage, __kesaSavePageState, __kesaPageInd } from "../lib/sync";

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
    const U = (_wf.clientWidth - (column - 1) * gap) / column;
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
  } else {
    // NexusPHP 路由: 直接解析原表格 DOM
    // PTT/NicePT/PTFans 用 __pttParse(按站点列索引适配); 其余(kamept)用各站 config.TORRENT_LIST_TO_JSON
    infoList = [
      ...infoList,
      ...(__isPTT
        ? __pttParse(originTable)
        : config.TORRENT_LIST_TO_JSON(originTable).map(__normalizeTorrent)),
    ];
  }

  console.log("---> 环境:\t", import.meta.env.VITE_APP_ENV);

  if (import.meta.env.VITE_APP_ENV == "development") {
    console.log(infoList);
  }

  // NOTE: 如果站点有特殊操作, 这里执行
  GLOBAL_SITE[$_current_domain]?.special();

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
  /** 是否接受本次 /search 响应(仅种子列表请求, 过滤 "mode":"waterfall" 等非列表请求) */
  let __mteamIsAccept = false;
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
        infoList = list.map(__normalizeTorrent);

        if (masonry) {
          masonry.reloadItems();
          masonry.layout("fast");
          masonry.layout("fast");
        }
        // 整理懒加载
        setTimeout(NEXUS_TOOLS, 600);
      } catch (err) {
        console.warn("M-Team 响应解析失败:", err);
      }
    };
    window.addEventListener("res>POST->/search", __mteamResListener);
  }

  /** 更新项目配置*/
  afterUpdate(() => {
    console.log("afterUpdate-------------------->");

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
{#each infoList as info (info.id)}
  <TorrentCard torrentInfo={info} cardWidth={CARD.CARD_WIDTH} />
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
  /* 卡片: 收藏按钮 */
  #turnPage {
    width: 100%;
    height: 32px;
    border-radius: 16px;
    line-height: 20px;
    font-size: 14px;

    position: absolute;
    bottom: 0px;
  }
</style>
