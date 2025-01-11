<script>
  import {
    _current_domain,
    _Global_Masonry,
    _current_bgColor,
    _turnPage,
    _iframe_switch,
    _iframe_url,
    _show_configPanel,
    _list_viewMode,
    _animated,
    _card_layout,
  } from "../stores";
  import { onDestroy, onMount } from "svelte";
  import { fade } from "svelte/transition";
  import {
    sortMasonry,
    NEXUS_TOOLS,
    // @ts-ignore
    debounce,
    parseLocalStorage,
    debounceImmediate,
  } from "../utils";
  // @ts-ignore
  import { CARD, PAGE } from "../default.config";
  import {
    // @ts-ignore
    GLOBAL_SITE,
    GET_CURRENT_PT_DOMAIN,
    // @ts-ignore
    GET_TORRENT_LIST_SELECTOR,
    GET_SITE_BACKGROUND_COLOR,
  } from "./index";
  import "../utils/masonry.pkgd.Kesa";
  import TestMteam from "./newMteam.svelte";
  import { config } from "./newMteam";
  // 父子参数 ------------------------------------------------

  /** 父传值: 瀑布流dom*/
  export let waterfallNode;

  /** 父传值: 瀑布流父dom*/
  export let waterfallParentNode;

  /** 父传值: 原列表dom*/
  // export let _ORIGIN_TL_Node;

  /** 父传值: 重置原列表节点DOM函数*/
  export let update_ORIGIN_TL_Node;

  // 0. 变量声明 & 配置 ------------------------------------------------

  // search api
  // const searchApiURL = location.origin + config.API.search.url + '/api';
  const affix = location.origin.match(/\.([^.]+)$/)[0];
  const _searchApiURL_generate = 'https://api.m-team'+ affix + '/api' + config.API.search.url; // 按照本链接生成的
  const _searchApiURL_localStorage = localStorage.getItem('apiHost') + config.API.search.url ; // 从 localStorage 获取的
  // NOTE:先这么着吧, 看之后有没有机会做一个筛选...
  const searchApiURL = _searchApiURL_localStorage || _searchApiURL_generate; 

  // NOTE: 这里不能注释掉, 必须留着, 不然 MT 可能不加载 NEXUS_TOOLS
  // Nexus_Tools 绑定
  // @ts-ignore
  window.NEXUS_TOOLS = NEXUS_TOOLS;

  // 瀑布流变量声明
  let masonry;

  // 卡片宽度变化相应
  // @ts-ignore
  $: if (masonry) {
    CARD.CARD_WIDTH = resizeMasonry($_card_layout.column, $_card_layout.gap);
    console.log("卡片宽度:\t", CARD.CARD_WIDTH);

    CHANGE_CARD_LAYOUT();
  }

  // loading 相关变量
  /** loading 样式变化 trigger 声明 */
  let loading_hide = false;
  /** loading 第一次 trigger 声明 */
  let loading_first = true;

  // loading 初始化 -> 瀑布流父 DOM 保留高度
  waterfallParentNode.style.height = "116px";

  // 1. 获取当前域名 & 背景颜色 --------------------------------------------------------------------------------------
  $_current_domain = GET_CURRENT_PT_DOMAIN();

  /** 获取主题背景色 */
  const bgColor = GET_SITE_BACKGROUND_COLOR();
  $_current_bgColor = bgColor;
  console.log("背景颜色:", bgColor);

  // 2. 组件函数 ------------------------------------------------

  const originSelector = GET_TORRENT_LIST_SELECTOR();

  /** 切换显示模式 */
  function ChangeShowMode() {
    const _$_ORIGIN_TL_Node = document.querySelector(originSelector);
    const _$nextPageNode = document.querySelector(".nextPage");
    const _$waterfallNode = document.querySelector(
      ".waterfall.waterfall_newMT",
    );
    // 一组: 原表格
    if (_$_ORIGIN_TL_Node)
      _$_ORIGIN_TL_Node.style.display = $_list_viewMode ? "none" : "block";

    // 一组: 瀑布流 + 按钮
    _$nextPageNode.style.display = $_list_viewMode ? "block" : "none";
    _$waterfallNode.style.display = $_list_viewMode ? "block" : "none";
  }

  /** 调整卡片布局 */
  function CHANGE_CARD_LAYOUT() {
    ChangeShowMode();

    // console.log("card width changed.");

    resizeMasonry($_card_layout.column, $_card_layout.gap);
    sortMasonry("fast");
    sortMasonry("fast");
  }
  // @ts-ignore
  window.CHANGE_CARD_LAYOUT = CHANGE_CARD_LAYOUT;

  /**调整瀑布流列数 & 间隔
   * @param {number} columns 列数
   * @param {number} gutter 间隔(px)
   * @returns {number} 卡片宽度
   */
  function resizeMasonry(columns, gutter = 10) {
    // 最少两列
    if (columns <= 1 || gutter <= 1) {
      console.warn("卡片列数或卡片间隔过小, 列数不小于2, 间隔不小于1");
      return;
    }

    // 算宽度
    const widthContainer = document.querySelector("div.waterfall").clientWidth;
    const widthCard = (widthContainer - (columns - 1) * gutter) / columns;

    // 配置宽度
    Array.from(document.querySelectorAll(".card")).forEach(
      (el) => (el.style.width = widthCard + "px"),
    );

    if (masonry) {
      masonry.options.columnWidth = widthCard;
      masonry.options.gutter = gutter;
      masonry.layout();
    }

    // 往 localstorage 里写列数和间隔

    return widthCard;
  }

  // 3. 请求函数 ------------------------------------------------
  let infoList = [];
  // $: {
  //   console.log(infoList);
  // }

  //NOTE: 24.4.28 M-Team 改版后需要 Authorization
  // 从LocalStorage获取auth内容
  const auth = localStorage.getItem("auth") || "";

  /** Headers */
  const headers = {
    "Content-Type": "application/json;charset=UTF-8",
    Authorization: auth,
    // NOTE: 250111: 应对 M-team 主站 api 添加 Ts 的请求头
    // @ts-ignore
    "Ts": Math.floor(new Date() / 1000),
  };

  /**初始化 search 请求->已封装好载荷(payload)*/
  function RequestExample() {
    // ------------ 页面请求
    console.log("当前页面 path:\t", location.pathname);

    let pageSize = getPageSize();

    const payload = {
      pageNumber: 1,
      pageSize,
      visible: 1,
      // mode: UrlPath_2_ParamList(),
      // sortDirection: "DESC",
      // sortField: "CREATED_DATE",
    };
    Object.assign(payload, UrlPath_2_ParamList());

    console.log(payload);

    fetch(searchApiURL, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        // 在这里处理返回的数据
        console.log(data);
        const list = data.data.data;

        // 处理数据
        infoList = [...list];
      })
      .then(() => {
        // 设置页数
        PAGE.$setPage(payload.pageNumber);

        // 这里专用
        masonry.reloadItems();

        // loading 解除 & loading 非第一次标记
        loading_first = false;
        loading_hide = true;
        waterfallParentNode.style.height = "auto";

        // Nexus Tools 延时生效
        masonry.once("layoutComplete", () => {
          NEXUS_TOOLS();
        });
        // setTimeout(NEXUS_TOOLS, 600);

        // NOTE: 如果站点有特殊操作, 这里执行
        // console.log("[Special]<MTeam> ===> First Request");
        GLOBAL_SITE[$_current_domain]?.special();
      })
      .catch((error) => {
        // 处理错误
        console.error("网络请求错误:", error);
      });
  }

  /** payload 示例
  /* categories:[],
  /* pageNumber: 7,
  /* pageSize: 100,
  /* sortDirection: "DESC",
  /* sortField: "CREATED_DATE",
  /* visible: 1,
  */

  /**常规 search 请求
   * 详见 {@link https://test2.m-team.cc/api/doc.html#/%E5%B8%B8%E8%A7%84%E6%8E%A5%E5%8F%A3/%E7%A7%8D%E5%AD%90/search newMT接口文档}
   * @param {object} payload - 自定义载荷(payload)
   * @param {string} payload.mode - 大致分类
   * @param {number[]} payload.categories - 具体分类
   * @param {number} payload.pageNumber - 页数
   * @param {number} payload.pageSize - 每页种子数
   * @param {string} payload.sortDirection - 正倒序(ACS,DESC)
   * @param {string} payload.sortField - 自定义载荷(CREATED_DATE,SIZE)
   * @param {function} successCallback - 成功后的回调函数
   */

  function Request(payload, successCallback = null) {
    // ------------ 页面请求
    console.log("当前页面 path:\t", location.pathname);
    // const url = "https://test2.m-team.cc/api/torrent/search";

    fetch(searchApiURL, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        // 在这里处理返回的数据
        console.log(data);
        const list = data.data.data;

        // 处理数据
        infoList = [...list];
      })
      .then(() => {
        // 这里专用
        masonry.reloadItems();

        // loading 解除
        loading_hide = true;

        // Nexus Tools 延时生效
        masonry.once("layoutComplete", () => {
          NEXUS_TOOLS();
        });

        if (successCallback) successCallback();
        // setTimeout(NEXUS_TOOLS, 600);
      })
      .catch((error) => {
        // 处理错误
        console.error("网络请求错误:", error);
      });
  }

  /** 获取 ls 里的 pageSize */
  function getPageSize(defaultNum = 100) {
    const sysinfo = parseLocalStorage("persist:persist").sysinfo;
    if (!sysinfo.pageSize) return defaultNum;
    if (!sysinfo.pageSize.torrent) return defaultNum;
    return Number(sysinfo.pageSize.torrent);
  }

  // 4. URL path 劫持函数 ------------------------------------------------

  /**URL路径转化 => search api 参数列表
   * @param path 默认值为 URL pathname
   */
  function UrlPath_2_ParamList(path = location.href) {
    // 补全 url
    // if (path != location.pathname) console.log(`path自定义路径: ${path}`);
    let url = path;
    // 以 /browse 开头的是非完整链接, 不能自动获取 searchParam, 需要补全
    if (path.indexOf("/browse") == 0) {
      url = location.origin + path;
    }
    console.log(`url 补全: ${url}`);

    let urlObject = new URL(url);

    // 从 url对象 获得 mode / categories / standards 等参数
    // -- mode
    let mode = urlObject.pathname.split("/")[2];
    let categories = urlObject.searchParams.getAll("cat");
    let standards = urlObject.searchParams.getAll("stand");
    let pageNumber = Number(urlObject.searchParams.get("pageNumber")) || 1;
    let pageSize = getPageSize(100);
    let sortParam = urlObject.searchParams.get("sort");
    let onlyFav = Number(urlObject.searchParams.get("onlyFav"));

    let output = {};

    if (mode) output.mode = mode;
    else output.mode = "normal";
    if (categories) output.categories = categories;
    if (standards.length) output.standards = standards;
    if (pageNumber) output.pageNumber = pageNumber;
    if (pageSize) output.pageSize = pageSize;
    if (onlyFav) output.onlyFav = onlyFav;

    // NOTE: 这里存在将来变更的隐患捏
    if (sortParam) {
      // console.log(sortParam);
      let field = sortParam.split(":")[0].toUpperCase();
      if (field.includes("DATE")) output.sortField = "CREATED_DATE";
      if (field.includes("SIZE")) output.sortField = "SIZE";
      if (field.includes("SEEDER")) output.sortField = "SEEDERS";
      if (field.includes("LEECHER")) output.sortField = "LEECHERS";
      if (field.includes("TIME")) output.sortField = "TIMES_COMPLETED";
      // output.sortField;

      let direction = sortParam.split(":")[1].toUpperCase();
      if (direction.includes("ASC")) output.sortDirection = "ASC";
      if (direction.includes("DESC")) output.sortDirection = "DESC";
      // output.sortDirection;
    }

    // 设置当前页数
    // PAGE.$setPage(pageNumber);
    // console.log('========------------===========');
    // console.log(pageNumber);
    // console.log('========------------===========');

    // 输出
    // console.log(output);
    return output;
  }

  // FIXME: 这里在每次切换 /browse 又回来之后, _ORIGIN_TL_Node 会丢失
  // 解决方法: 每次跳页面重置 _ORIGIN_TL_Node

  // 保存原始的 pushState 方法
  const originalPushState = history.pushState;
  /**劫持pushState方法*/
  function OverWritePushState() {
    // 重写 pushState 方法
    // @ts-ignore
    history.pushState = function (state, title, path) {
      // loading 开启
      loading_hide = false;

      // 在这里执行自定义逻辑
      // NOTE: 获取目标 URL Path
      // console.log("pushState ---> state:", state);
      // console.log("pushState ---> title:", title);
      console.log(
        `%c ====> URL跳转劫持: %c${path}`,
        "color: cyan",
        "color: white",
      );

      // 判读是否在 /browse path 内, 在就进行 search api 筛选
      // @ts-ignore
      if (path.includes("/browse") || path == "/browse") {
        console.log("--->属于 browse 范围, search 启动");

        // 在 /browse 内即显示 waterfallParentNode
        waterfallParentNode.style.display = "block";

        // 从 path 中获取 search api 中 category 的部分
        // @ts-ignore
        const searchApiList = UrlPath_2_ParamList(path);

        // 获取 pageSize
        const pageSizeParam = getPageSize();

        // 装载 payload
        const payload = {
          pageNumber: 1,
          pageSize: pageSizeParam,
          visible: 1,
          // mode: searchApiList,
          // sortDirection: "DESC",
          // sortField: "CREATED_DATE",
        };

        Object.assign(payload, searchApiList);
        console.log(payload);

        Request(payload, () => {
          // 设置页数
          PAGE.$setPage(payload.pageNumber);

          // 默认每次切换页面重置 ORIGIN_TL_Node
          update_ORIGIN_TL_Node();

          // NOTE:在这里可以执行额外的操作，例如触发自定义事件等
          // MTeam站点特殊操作 => 原表格的 悬浮预览 和 iframe内置窗口预览种子详情
          // console.log("[Special]<MTeam> ===> OverWritePushState");
          let res = GLOBAL_SITE[$_current_domain]?.special();
          // console.log(res);

          let count = 0;
          intervalID = setInterval(() => {
            if (res) {
              clearInterval(intervalID);
              console.log(`触发特殊次数: [${count}]`);
            }
            count += 1;
            res = GLOBAL_SITE[$_current_domain]?.special();
            if (res) {
              clearInterval(intervalID);
              console.log(`触发特殊次数: [${count}]`);
            }

            if (count >= 5) {
              clearInterval(intervalID);
              console.log(
                "======> 触发特殊次数: [${count}] setInterval 已取消. <======",
              );
            }
          }, 1000);

          // NOTE:在这里可以执行额外的操作，例如触发自定义事件等
        });

        // 按时调整显示模式
        ChangeShowMode();
      } else {
        // 不在 /browse 内即不显示 waterfallParentNode
        waterfallParentNode.style.display = "none";

        // 显示主表
        document.querySelector(originSelector).style.display = "block";
      }

      // FIXME: 别动这个就行
      // 调用原始的 pushState 方法
      originalPushState.apply(history, arguments);
    };
  }

  // 5. 翻页相关部分 ------------------------------------------------
  // 设定初始页数
  PAGE.$setPage(1);

  /** 延迟加载事件 */
  let debounceLoad;
  // 对延迟加载事件进行防抖
  debounceLoad = debounceImmediate(loadNextPage, PAGE.GAP);

  /**NOTE: 滚动DOM ( newMT 的 滚动DOM 不是 body, 是 .ant-layout)*/
  const scrollDOM = document.querySelector(".ant-layout");
  /**滑动翻页函数判定*/
  function scan_and_launch() {
    const scrollHeight = scrollDOM.scrollHeight;
    const clientHeight = scrollDOM.clientHeight;
    const scrollTop = scrollDOM.scrollTop || scrollDOM.scrollTop;
    // console.log(scrollHeight, clientHeight, scrollTop);
    if (scrollTop + clientHeight >= scrollHeight - PAGE.DISTANCE_newMT) {
      // TODO: 注意写这里
      if ($_turnPage) {
        debounceLoad();
      } else {
        console.log("加载模式: 按钮");
      }

      // 这里整理一下瀑布流, 往往这里会出一点格式问题
      sortMasonry();
    }
  }

  /**页数记录专用对象*/
  const PageManager = {};

  /** 加载下一页的本体函数 */
  function loadNextPage() {
    // -- 1. 对 目标页数页数 & 单页数量 进行统计 -> 打包要 POST 的 payload
    const payload = {
      pageNumber: PAGE.$getCurrentPage() + 1,
      pageSize: getPageSize(),
      visible: 1,
      // mode: UrlPath_2_ParamList(),
      // sortDirection: "DESC",
      // sortField: "CREATED_DATE",
    };
    // console.log("++++++++++++++++++++++++");
    // console.log(payload.pageNumber);
    // console.log("++++++++++++++++++++++++");
    Object.assign(payload, UrlPath_2_ParamList());
    Object.assign(payload, { pageNumber: PAGE.$getCurrentPage() + 1 });
    console.log(payload);

    // -- 2. fetch payload, 并在获得后更新 List
    fetch(searchApiURL, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        // 在这里处理返回的数据
        console.log(data);
        const list = data.data.data;

        // 处理数据
        infoList = [...infoList, ...list];
      })
      .then(() => {
        // 这里专用
        masonry.reloadItems();

        // Nexus Tools 延时生效
        masonry.once("layoutComplete", () => {
          NEXUS_TOOLS();
        });

        // -- 3. 收尾, 更新当前页数等
        // 页数处理
        PAGE.$turnPage();
      })
      .catch((error) => {
        // 处理错误
        console.error("网络请求错误:", error);
      });
  }
  // window.loadNextPage = loadNextPage;

  /** 翻页组件调用函数
   * @param event
   */
  function turnPage() {
    // 加载下一页
    if (!$_turnPage) debounceLoad();
  }
  window.$$$turnPage = turnPage;

  // NOTE: 响应式变化: 卡片动画缓动
  $: {
    if (masonry) masonry.options.transitionDuration = $_animated ? "0.4s" : "0";
  }

  // 6. 原表格悬浮预览图片 ------------------------------------------------

  // interval
  let intervalID;

  /** 监视原表格是否有 DOM 变化 */
  function observerDomChange() {
    console.log("------------------OB START------------------");
    let attempts = 0; // 当前已尝试次数
    const maxAttempts = 10; // 尝试次数上限
    const interval = 2000; // 2 秒

    // 寻找目标元素
    const findTargetElement = () => {
      attempts++;
      const targetElement = document.querySelector(".ant-spin-container");
      if (targetElement) {
        console.log(`<special> 第 ${attempts} 次找到目标元素，开始监视...`);
        startObserving(targetElement);
      } else if (attempts < maxAttempts) {
        console.log(`<special> 第 ${attempts} 次未找到目标元素，继续尝试...`);
        setTimeout(findTargetElement, interval);
      } else {
        console.warn(
          "<special> 未找到 .ant-spin-container, M-Team 特殊函数失效",
        );
      }
    };

    // 找到后开始 OB
    const startObserving = (targetElement) => {
      const observer = new MutationObserver((mutationsList, observer) => {
        mutationsList.forEach((mutation) => {
          if (mutation.type === "childList" || mutation.type === "attributes") {
            console.log("<special> <-- 原表格 DOM 发生了变化 -->");
            // NOTE: 如果站点有特殊操作, 这里执行
            GLOBAL_SITE[$_current_domain]?.special();
          }
        });
      });

      // 配置 Mutation Observer 监视的选项
      const config = { attributes: true, childList: true, subtree: false };

      // 开始监视目标元素
      observer.observe(targetElement, config);

      // 在不需要时停止监视
      // observer.disconnect();
    };

    findTargetElement();
  }

  // 7. onMount 启动 ------------------------------------------------
  /** onMount, 启动!!!!!!!!!!!!!!!!*/
  onMount(() => {
    // 生成瀑布流
    // @ts-ignore
    masonry = new Masonry(waterfallNode, {
      itemSelector: ".card",
      columnWidth: resizeMasonry($_card_layout.column, $_card_layout.gap),
      gutter: $_card_layout.gap,

      // transitions Duration 默认值为 0.4
      transitionDuration: $_animated ? 0.4 : 0,
    });

    resizeMasonry($_card_layout.column, $_card_layout.gap);

    // 绑定各种全局变量
    // @ts-ignore
    window.masonry = masonry;
    $_Global_Masonry = masonry;

    // 初始化整理布局
    masonry.layout("fast");
    masonry.layout("fast");

    // 给瀑布流节点放一个手动点击整理的功能
    waterfallNode.addEventListener("click", (event) => {
      // 模拟 self, 只有在点击本身而非子元素的时候时触发效果
      if (event.target === event.currentTarget) {
        if (masonry) masonry.layout();
        console.log("Masonry 已整理~");
      }
    });

    // 滚动到底部检测
    scrollDOM.addEventListener("scroll", function () {
      if ($_list_viewMode) scan_and_launch();
    });

    // 初始化 search 请求
    RequestExample();

    // 劫持 path 变化 => 页面内主循环函数
    OverWritePushState();

    // 原表格悬浮预览大图
    observerDomChange();
  });

  onDestroy(() => {
    if (intervalID) clearInterval(intervalID);
  });
</script>

<div
  class:masonry_Holder_unload_1st={!loading_hide && loading_first}
  class:masonry_Holder_loaded_1st={loading_hide && loading_first}
  class:masonry_Holder_unloaded={!loading_hide && !loading_first}
  class:masonry_Holder_loaded={loading_hide && !loading_first}
>
  {#if !loading_hide}
    <!-- loading 占位 -->
    <div class="loading_Holder" transition:fade={{ duration: 600 }}>
      <div class="loading_SubHolder">
        <div class="loading_Text">页面切换加载中...</div>
      </div>
    </div>
  {/if}

  <!-- 卡片渲染模版 -->
  <!-- {#if $_current_domain == "test2.m-team.cc"} -->
  {#each infoList as info, index (info.id + index)}
    <TestMteam {index} torrentInfo={info} cardWidth={CARD.CARD_WIDTH} />
  {/each}
  <!-- {/if} -->
</div>

<style>
  /* 四种 loading 状态的 Masonry Holder */
  .masonry_Holder_unload_1st {
    height: 96px;
    background: grey;
    position: relative;
  }
  .masonry_Holder_loaded_1st {
    position: unset;
    background: transparent;
    padding: 0;
  }
  .masonry_Holder_unloaded {
    position: unset;
    background: transparent;
  }
  .masonry_Holder_loaded {
    position: relative;
    background: transparent;
  }

  /* loading holder 的几个样式 */
  .loading_Holder {
    background-color: #bccad6;

    position: absolute;

    width: 100%;
    height: 100%;

    z-index: 10001;

    border-radius: 8px;

    display: flex;
    /* align-items: center; */
    justify-content: center;

    /* opacity: 0.9; */
  }
  .loading_SubHolder {
    position: relative;
    padding: 40px 0;
  }

  .loading_Text {
    position: sticky;
    top: 40px;
  }
</style>
