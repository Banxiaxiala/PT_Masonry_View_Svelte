<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import {
    _current_bgColor,
    _show_originTable,
    _Global_Masonry,
    _show_mode,
    _card_width,
    _CARD_SHOW,
    _turnPage,
    _iframe_switch,
    _panelPos,
    _show_debug_btn,
    _show_nexus_pic,
    _delay_nexus_pic,
    _show_configPanel,
    _current_domain,
    _pic_failed_showInfo,
    _state_hover_pic,
    _animated,
    _card_layout,
    _previewWidth,
    _previewHeight,
    _preview_style,
  } from "./stores";

  import { sortMasonry } from "./utils";
  import Switch from "./component/switch.svelte";
  import { GLOBAL_SITE } from "./sites";
  // 同步/已读/名称过滤/TAG 过滤 面板填充函数 (来自独立同步模块 sync.js)
  import {
    __initReadTracking,
    __fillWebDAVSection,
    __fillReadSection,
    __fillTagSection,
    __fillNameFilterSection,
    __hideReadCards,
    __hideHistoryRead,
  } from "./lib/sync";

  // 配置拖拽侧边栏 ------------------------------------------------
  /** 侧边栏的 dom 对象 */
  let sideDom;
  /** 是否触发移动 trigger */
  let isMouseDown = false;
  /** 侧边栏横坐标 */
  let offsetX = 0;
  /** 侧边栏纵坐标 */
  let offsetY = 0;

  const onMouseDown = (e) => {
    e.preventDefault();
    isMouseDown = true;
    offsetX = e.clientX - sideDom.getBoundingClientRect().left;
    offsetY = e.clientY - sideDom.getBoundingClientRect().top;
  };

  const onMouseMove = (e) => {
    // NOTE: 这里还是别取消这个, 会指针指在别的地方的
    // e.preventDefault();

    if (!isMouseDown) return;
    const res_X = posRangeIn(
      e.clientX - offsetX,
      0,
      window.innerWidth - (sideDom.getBoundingClientRect().width + 5)
    );
    const res_Y = posRangeIn(
      e.clientY - offsetY,
      0,
      window.innerHeight - (sideDom.getBoundingClientRect().height + 5)
    );

    // console.log(sideDom.getBoundingClientRect().width);

    $_panelPos = { x: res_X, y: res_Y };
  };

  const onMouseUp = () => {
    isMouseDown = false;
  };

  /** 重置瀑布流边栏位置 */
  function resetPanelPos() {
    if ($_panelPos.x == 0 && $_panelPos.y == 0) alert("无需重置瀑布流边栏位置");
    $_panelPos = { x: 0, y: 0 };
  }

  /** 给指定变量设置上下范围
   * @param target 指定变量
   * @param min 下边界值
   * @param max 上边界值
   */
  function posRangeIn(target, min, max) {
    if (target <= min) target = min;
    if (target >= max) target = max;
    return target;
  }

  // ------------------------------------------------

  /** 父传值: 原有种子列表*/
  export let originTable;

  // ------------------------------------------------

  /** 按钮1函数: 显示原有列表*/
  function __show_originTable() {
    // console.log($_show_originTable);

    // $_show_originTable = $_show_originTable == 0 ? 1 : 0;
    // originTable.style.display = $_show_originTable === 1 ? "" : "none";

    $_show_mode = !$_show_mode;

    window.CHANGE_CARD_LAYOUT();
  }

  /** 按钮2函数: 手动整理瀑布流布局*/
  function __sort_masonry() {
    // @ts-ignore
    $_Global_Masonry.layout();
  }

  /** 切换宽度 */
  function config_changeWidth() {
    $_card_width = $_card_width == 300 ? 200 : 300;
    console.log(`[debug]\$card_width: ${$_card_width}`);

    sortMasonryBundle();
  }

  /** 显示所有详情界面 */
  function config_showAllDetails() {
    $_CARD_SHOW.all = !$_CARD_SHOW.all;

    sortMasonryBundle();
  }

  /** 模式切换按钮标签 */
  let label_switchMode = $_turnPage ? "滚动加载" : "按钮加载";
  function config_switchMode() {
    $_turnPage = !$_turnPage;
    label_switchMode = $_turnPage ? "滚动加载" : "按钮加载";
  }

  /** 切换下一页加载模式 */
  function config_changeLoadMode() {
    $_iframe_switch = $_iframe_switch == 0 ? 1 : 0;
  }

  // ------------------------------------------------

  /** 封装的瀑布流整理函数 */
  function sortMasonryBundle() {
    sortMasonry("fast");
    sortMasonry("fast");
    sortMasonry();
    sortMasonry();
  }

  // ------------------------------------------------

  onMount(() => {
    // 拖拽边栏监听
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // 已读样式/点击标记/隐藏历史观看快照: 由 main.js 入口统一调用 __initReadTracking,
    // 不再依赖侧边栏挂载时序(用户不打开侧边栏也能正确记录 __historyReadSnapshot,
    // 修复"首次开启'隐藏历史观看'开关需手动重启才生效" BUG)
    // 说明: "隐藏已读卡片 / 隐藏历史观看" 两个开关已原生并入下方"配置常驻卡片信息"模块,
    // 不再经 MutationObserver 注入(__fillCardInfoSectionObserver 已废弃)。

    // 注入"同步(WebDAV) / 已读标记 / TAG 过滤 / 名称过滤" 四个配置面板(各自挂在对应容器内)
    // NOTE: 配置面板默认关闭(#if $_show_configPanel), onMount 时占位 div 尚不在 DOM,
    // 因此不能只调一次, 需用 MutationObserver 持续监听, 等占位 div 出现后再填充(已填充的跳过)
    const secFill = () => {
      const webdav = document.getElementById("kesaPanelWebdav");
      const read = document.getElementById("kesaPanelRead");
      const tag = document.getElementById("kesaPanelTag");
      const name = document.getElementById("kesaPanelName");
      if (webdav && !webdav.dataset.filled) { webdav.dataset.filled = "1"; __fillWebDAVSection(webdav); }
      if (read && !read.dataset.filled) { read.dataset.filled = "1"; __fillReadSection(read); }
      if (tag && !tag.dataset.filled) { tag.dataset.filled = "1"; __fillTagSection(tag); }
      if (name && !name.dataset.filled) { name.dataset.filled = "1"; __fillNameFilterSection(name); }
    };
    secFill();
    const secObs = new MutationObserver(() => {
      // 配置面板展开后占位 div 才会被 Svelte 创建, 出现时触发填充
      if (!document.getElementById("kesaPanelWebdav")) return;
      secFill();
      // 四个都已填充后不再监听
      if (
        document.getElementById("kesaPanelWebdav")?.dataset.filled &&
        document.getElementById("kesaPanelRead")?.dataset.filled &&
        document.getElementById("kesaPanelTag")?.dataset.filled &&
        document.getElementById("kesaPanelName")?.dataset.filled
      ) {
        secObs.disconnect();
      }
    });
    secObs.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      secObs.disconnect();
    };
  });
</script>

<!-- --------------------------------NOTE:侧边栏-------------------------------- -->
<div
  class="sideP"
  bind:this={sideDom}
  style="
  top:{$_panelPos.y}px;
  left:{$_panelPos.x}px;
  background-color:{$_current_bgColor};
  "
>
  <!-- 侧边栏拖拽条 -->
  <!-- TODO: 仿照 PTPP 插件做拖拽效果, 优先度低 -->
  <div class="sideP__title" on:mousedown={onMouseDown} />

  <!-- 按钮列表 -->
  <div class="sideP__out">
    <!-- 按钮1: 显示原有列表 -->
    <button class="sideP__btn" on:click={__show_originTable}>
      {#if $_show_mode}
        <div>
          <svg
            enable-background="new 0 0 64 64"
            width="24"
            height="24"
            id="Layer_1"
            version="1.1"
            viewBox="0 0 64 64"
          >
            <path
              d="M19,2.875H3.5c-0.829,0-1.5,0.671-1.5,1.5v19.979c0,0.829,0.671,1.5,1.5,1.5H19c0.829,0,1.5-0.671,1.5-1.5V4.375  C20.5,3.546,19.829,2.875,19,2.875z M17.5,22.854H5V5.875h12.5V22.854z"
              fill="white"
            />
            <path
              d="M19,28.773H3.5c-0.829,0-1.5,0.671-1.5,1.5v6.166c0,0.828,0.671,1.5,1.5,1.5H19c0.829,0,1.5-0.672,1.5-1.5v-6.166  C20.5,29.445,19.829,28.773,19,28.773z M17.5,34.939H5v-3.166h12.5V34.939z"
              fill="white"
            />
            <path
              d="M19,40.859H3.5c-0.829,0-1.5,0.672-1.5,1.5v17.266c0,0.828,0.671,1.5,1.5,1.5H19c0.829,0,1.5-0.672,1.5-1.5V42.359  C20.5,41.531,19.829,40.859,19,40.859z M17.5,58.125H5V43.859h12.5V58.125z"
              fill="white"
            />
            <path
              d="M40,2.875H24.5c-0.829,0-1.5,0.671-1.5,1.5v14.25c0,0.829,0.671,1.5,1.5,1.5H40c0.828,0,1.5-0.671,1.5-1.5V4.375  C41.5,3.546,40.828,2.875,40,2.875z M38.5,17.125H26V5.875h12.5V17.125z"
              fill="white"
            />
            <path
              d="M40,23.125H24.5c-0.829,0-1.5,0.671-1.5,1.5V46.5c0,0.828,0.671,1.5,1.5,1.5H40c0.828,0,1.5-0.672,1.5-1.5V24.625  C41.5,23.796,40.828,23.125,40,23.125z M38.5,45H26V26.125h12.5V45z"
              fill="white"
            />
            <path
              d="M40,51H24.5c-0.829,0-1.5,0.672-1.5,1.5v7.125c0,0.828,0.671,1.5,1.5,1.5H40c0.828,0,1.5-0.672,1.5-1.5V52.5  C41.5,51.672,40.828,51,40,51z M38.5,58.125H26V54h12.5V58.125z"
              fill="white"
            />
            <path
              d="M60.5,2.875H45c-0.828,0-1.5,0.671-1.5,1.5v35.171c0,0.828,0.672,1.5,1.5,1.5h15.5c0.828,0,1.5-0.672,1.5-1.5V4.375  C62,3.546,61.328,2.875,60.5,2.875z M59,38.046H46.5V5.875H59V38.046z"
              fill="white"
            />
            <path
              d="M60.5,44.346H45c-0.828,0-1.5,0.672-1.5,1.5v13.779c0,0.828,0.672,1.5,1.5,1.5h15.5c0.828,0,1.5-0.672,1.5-1.5V45.846  C62,45.018,61.328,44.346,60.5,44.346z M59,58.125H46.5V47.346H59V58.125z"
              fill="white"
            />
          </svg>
        </div>
        <div>瀑布流</div>
      {:else}
        <div>
          <!-- svg 列表图标 -->
          <svg
            viewBox="0 0 32 32"
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <style>
                .cls-1 {
                  fill: none;
                  stroke: #000;
                  stroke-linecap: round;
                  stroke-linejoin: round;
                  stroke-width: 2px;
                }
              </style>
            </defs>
            <title />
            <g data-name="43-browser" id="_43-browser">
              <rect class="cls-1" height="30" width="30" x="1" y="1" />
              <line class="cls-1" x1="1" x2="31" y1="9" y2="9" />
              <line class="cls-1" x1="5" x2="7" y1="5" y2="5" />
              <line class="cls-1" x1="11" x2="13" y1="5" y2="5" />
              <line class="cls-1" x1="9" x2="25" y1="16" y2="16" />
              <line class="cls-1" x1="7" x2="25" y1="20" y2="20" />
              <line class="cls-1" x1="7" x2="25" y1="24" y2="24" />
            </g>
          </svg>
        </div>
        <div>原有列表</div>
      {/if}
    </button>

    <!-- 按钮2: 手动整理布局 -->
    <button class="sideP__btn" on:click={__sort_masonry}>
      <div>
        <!-- svg 整理布局图标 (对齐 1.2.3b 参考版: 白描双箭头刷新图标) -->
        <svg
          enable-background="new 0 0 59.381 59.166"
          height="20"
          width="20"
          id="Layer_1"
          version="1.1"
          viewBox="0 0 59.381 59.166"
          xml:space="preserve"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <path
            d="M19.334,1.298c-0.005-0.037-0.005-0.074-0.013-0.109c-0.01-0.047-0.029-0.092-0.043-0.139  c-0.015-0.046-0.025-0.095-0.044-0.139c-0.016-0.037-0.039-0.071-0.058-0.107c-0.026-0.049-0.049-0.1-0.08-0.146  c-0.023-0.034-0.053-0.063-0.079-0.095c-0.035-0.043-0.068-0.089-0.107-0.128c-0.024-0.024-0.053-0.043-0.079-0.065  c-0.049-0.042-0.099-0.086-0.153-0.122c-0.004-0.002-0.007-0.006-0.011-0.009c-0.027-0.018-0.058-0.028-0.086-0.043  c-0.054-0.03-0.107-0.062-0.166-0.085c-0.043-0.017-0.087-0.027-0.131-0.041c-0.05-0.015-0.099-0.032-0.15-0.042  c-0.055-0.011-0.109-0.013-0.165-0.017C17.931,0.009,17.894,0,17.855,0c-0.006,0-0.011,0.001-0.017,0.002  c-0.054,0-0.106,0.009-0.16,0.016c-0.046,0.006-0.093,0.007-0.138,0.017c-0.027,0.005-0.052,0.017-0.078,0.024  c-0.068,0.018-0.135,0.036-0.199,0.063c-0.007,0.003-0.013,0.008-0.02,0.011c-0.081,0.036-0.159,0.078-0.232,0.127  c-0.023,0.016-0.043,0.037-0.066,0.055c-0.054,0.042-0.109,0.083-0.157,0.131c-0.021,0.022-0.039,0.049-0.06,0.072  c-0.045,0.051-0.089,0.103-0.127,0.159c-0.002,0.004-0.006,0.007-0.009,0.011L0.239,26.081c-0.448,0.696-0.248,1.625,0.449,2.073  c0.251,0.162,0.532,0.239,0.811,0.239c0.493,0,0.976-0.243,1.263-0.688L16.355,6.599v51.067c0,0.828,0.671,1.5,1.5,1.5  s1.5-0.672,1.5-1.5V1.5c0-0.005-0.001-0.01-0.001-0.015C19.353,1.422,19.343,1.36,19.334,1.298z"
            fill="white"
          />
          <path
            d="M58.693,31.013c-0.697-0.449-1.625-0.248-2.073,0.448L43.026,52.567V1.5c0-0.829-0.672-1.5-1.5-1.5s-1.5,0.671-1.5,1.5  v56.166c0,0.005,0.001,0.009,0.001,0.014c0.001,0.067,0.011,0.133,0.021,0.199c0.005,0.032,0.005,0.065,0.012,0.098  c0.012,0.058,0.033,0.112,0.053,0.169c0.012,0.036,0.02,0.073,0.034,0.108c0.025,0.06,0.061,0.116,0.094,0.173  c0.016,0.025,0.026,0.055,0.044,0.079c0.03,0.045,0.068,0.085,0.104,0.126c0.027,0.033,0.052,0.068,0.082,0.098  c0.027,0.027,0.061,0.049,0.09,0.074c0.046,0.039,0.092,0.08,0.143,0.114c0.004,0.002,0.008,0.006,0.012,0.009  c0.011,0.007,0.022,0.009,0.033,0.016c0.098,0.06,0.202,0.105,0.313,0.143c0.03,0.01,0.061,0.021,0.092,0.028  c0.119,0.03,0.242,0.052,0.37,0.053c0.001,0,0.002,0,0.003,0l0,0c0.001,0,0.001,0,0.001,0c0.117,0,0.229-0.017,0.338-0.042  c0.031-0.007,0.061-0.019,0.091-0.027c0.078-0.023,0.154-0.052,0.227-0.088c0.035-0.017,0.068-0.035,0.102-0.055  c0.069-0.041,0.133-0.087,0.194-0.137c0.027-0.022,0.055-0.043,0.081-0.067c0.083-0.079,0.157-0.166,0.221-0.262  c0.002-0.004,0.006-0.006,0.008-0.01l16.354-25.393C59.591,32.39,59.39,31.461,58.693,31.013z"
            fill="white"
          />
        </svg>
      </div>
      <div>整理布局</div>
    </button>

    <!-- 按钮3: 呼出详细配置栏 -->
    <button
      class="sideP__btn"
      on:click={() => {
        $_show_configPanel = !$_show_configPanel;
      }}
    >
      <div>
        <!-- svg 设置图标 -->
        <svg
          width="24"
          height="24"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <style>
              .cls-1 {
                fill: none;
                stroke: #fff;
                stroke-linecap: round;
                stroke-linejoin: round;
                stroke-width: 2px;
              }
            </style>
          </defs>
          <title />
          <g data-name="80-setting" id="_80-setting">
            <circle class="cls-1" cx="10" cy="6" r="3" />
            <circle class="cls-1" cx="22" cy="16" r="3" />
            <circle class="cls-1" cx="10" cy="26" r="3" />
            <line class="cls-1" x1="7" x2="1" y1="6" y2="6" />
            <line class="cls-1" x1="15" x2="1" y1="16" y2="16" />
            <line class="cls-1" x1="7" x2="1" y1="26" y2="26" />
            <line class="cls-1" x1="31" x2="17" y1="26" y2="26" />
            <line class="cls-1" x1="31" x2="25" y1="16" y2="16" />
            <line class="cls-1" x1="31" x2="17" y1="6" y2="6" />
          </g>
        </svg>
      </div>
      <div>详细配置</div>
    </button>

    {#if $_show_debug_btn}
      <!-- 按钮4: debug -->
      <button class="sideP__btn" on:click={config_changeWidth}>
        [d]切换宽度
      </button>

      <!-- 按钮5: debug -->
      <button class="sideP__btn" on:click={config_showAllDetails}>
        [d]显示详情
      </button>

      <!-- 按钮6: debug -->
      <button class="sideP__btn" on:click={config_switchMode}>
        [d]{label_switchMode}
      </button>

      <!-- 按钮6: debug -->
      <button class="sideP__btn" on:click={config_changeLoadMode}>
        [d]iframe
      </button>
    {/if}
  </div>
</div>

<!-- 详细配置面板 -->
{#if $_show_configPanel}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class="configP"
    transition:fade={{ duration: 100 }}
    on:click|self={() => ($_show_configPanel = false)}
  >
    <div class="configP_holder">
      <!-- 标题区 -->
      <div class="configP_title">
        <p>详细配置面板</p>
        <!-- ---------------- 返回按钮 ---------------- -->
        <button on:click={() => ($_show_configPanel = false)}>
          <!-- <svg height="28" width="28" viewBox="0 0 48 48">
            <path
              d="M38 12.83l-2.83-2.83-11.17 11.17-11.17-11.17-2.83 2.83 11.17 11.17-11.17 11.17 2.83 2.83 11.17-11.17 11.17 11.17 2.83-2.83-11.17-11.17z"
              fill="red"
            />
            <path d="M0 0h48v48h-48z" fill="none" />
          </svg> -->
          <svg
            class="feather feather-x"
            fill="none"
            height="28"
            width="28"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <line x1="20" x2="6" y1="6" y2="20" />
            <line x1="6" x2="20" y1="6" y2="20" />
          </svg>
        </button>
      </div>

      <!-- --------------------------------NOTE:配置区-------------------------------- -->

      <!-- ---------------- 常用配置 ---------------- -->
      <div class="section">
        <h1 class="s_title">常用配置</h1>
        <div class="s_panel">
          <Switch
            title_fixed={"显示模式"}
            title_green="瀑布流"
            title_red="原始表格"
            label="原始表格模式仅支持点击图片显示iframe和加载下一页"
            bind:checked={$_show_mode}
            func={() => {
              window.CHANGE_CARD_LAYOUT();
            }}
          />

          <Switch
            title_fixed={"加载下一页方式"}
            title_green="按钮(默认)"
            title_red="滚动(谨慎使用)"
            label="滚动模式下 MT 等网站频繁使用可能会导致 120"
            bind:checked={$_turnPage}
            green_state={false}
          />
          <Switch
            title_fixed={"卡片移动动画"}
            title_green="开启"
            title_red="关闭"
            label="开启关闭瀑布流卡片高度变化时的缓动动画"
            bind:checked={$_animated}
          />
          <Switch
            title_fixed={"侧边栏debug按钮"}
            title_green="隐藏(默认)"
            title_red="显示(开发用)"
            label="显示/隐藏侧边栏上的调试按钮(开发用)"
            bind:checked={$_show_debug_btn}
            green_state={false}
          />
          <Switch
            title_fixed={"悬浮预览大图"}
            title_green="默认开启"
            title_red="核心功能->确定不用再关"
            label="鼠标悬浮到种子图片时显示大图预览"
            bind:checked={$_show_nexus_pic}
          />
          {#if $_show_nexus_pic}
            <Switch
              title_fixed={"预览大图方式"}
              title_green="局部悬浮预览区域"
              title_red="全图悬浮预览"
              label="开发中 <br> 为优化用户预览大图体验 <br> 鼠标放到图片上就显示大图会遮挡信息 <br> 指定在图片的局部 区域放大"
              bind:checked={$_preview_style}
            />
          {/if}
          <Switch
            title_fixed={`悬浮预览延迟${
                $_delay_nexus_pic ? ":" + $_delay_nexus_pic + "ms" : ""
              }`}
              title_red={`${$_delay_nexus_pic ? "" : "无延迟"}`}
              label="防止无意滑动时大图打开妨碍预览"
              type="range"
            >
              <input
                type="range"
                bind:value={$_delay_nexus_pic}
                min="0"
                max="1500"
                step="100"
                list="values"
              />
            </Switch>

          <!-- 图片加载失败时显示标题 -->
          <Switch
            title_fixed="图片加载失败时显示标题"
            label="图片加载失败时在卡片上显示种子标题"
            bind:checked={$_pic_failed_showInfo}
            green_state={false}
          />

          <!-- 预览大图默认状态 -->
          <Switch
            title_fixed="预览大图默认状态"
            title_green="铺满(contain)"
            title_red="尽量原图大小"
            label="开启=铺满(contain); 关闭=尽量原图大小(scale-down)"
            bind:checked={$_state_hover_pic}
            green_state={false}
          />

          <!-- NOTE: 废弃的旧型样式 -->
          {#if false}
            <!-- 按钮: 切换下一页加载模式 -->
            <button
              class="sideP__btn"
              on:click={config_switchMode}
              style="background-color:{!$_turnPage ? '#59CD90' : '#FBC4AB'}"
            >
              加载下一页: {label_switchMode}
              {#if $_turnPage}
                <span
                  style="color: red;"
                  title="MT等网站频繁使用可能会导致 120"
                >
                  (谨慎使用!)
                </span>
              {:else}
                (默认)
              {/if}
            </button>

            <!-- 按钮: 显示侧边栏 debug 按钮 -->
            <button
              class="sideP__btn"
              on:click={() => {
                $_show_debug_btn = !$_show_debug_btn;
              }}
              style="background-color:{$_show_debug_btn
                ? '#59CD90'
                : '#FBC4AB'}"
            >
              显示侧边栏 debug 按钮:
              {#if $_show_debug_btn}
                <span style="color: green;">是</span>
              {:else}
                <span style="color: red;">否</span>(默认)
              {/if}
            </button>

            <!-- 按钮: 显示鼠标悬浮预览大图 -->
            <button
              class="sideP__btn"
              on:click={() => {
                $_show_nexus_pic = !$_show_nexus_pic;
              }}
              style="background-color:{$_show_nexus_pic
                ? '#59CD90'
                : '#FBC4AB'}"
            >
              是否显示鼠标悬浮预览大图:
              {#if $_show_nexus_pic}
                <span style="color: green;">是</span>(默认)
              {:else}
                <span style="color: red;">否</span>
              {/if}
            </button>

            <!-- 按钮: 悬浮预览延迟 -->
            <button
              class="sideP__btn"
              on:click={() => {
                $_delay_nexus_pic = $_delay_nexus_pic == 0 ? 600 : 0;
              }}
              style="background-color:{$_delay_nexus_pic
                ? '#59CD90'
                : '#FBC4AB'}"
              disabled={!$_show_nexus_pic}
            >
              是否延迟悬浮预览:
              {#if $_delay_nexus_pic != 0}
                <span style="color: green;">延迟{$_delay_nexus_pic}ms</span
                >(默认)
              {:else}
                <span style="color: red;">不延迟</span>
              {/if}
            </button>
          {/if}
        </div>
      </div>

      <!-- ---------------- 卡片布局 ---------------- -->
      <div class="section">
        <h1 class="s_title">卡片布局</h1>
        <div class="s_panel">
          <Switch
            title_fixed={`卡片列数: ${$_card_layout.column}`}
            label="范围: 2~7 列"
            type="range"
          >
            <input
              type="range"
              min="2"
              max="7"
              step="1"
              list="values"
              bind:value={$_card_layout.column}
              on:change={() => { $_card_layout = { ...$_card_layout }; }}
            />
          </Switch>

          <Switch
            title_fixed={`卡片间距: ${$_card_layout.gap}px`}
            label="范围: 2~100 px"
            type="range"
          >
            <input
              type="range"
              min="2"
              max="100"
              step="1"
              list="values"
              bind:value={$_card_layout.gap}
              on:change={() => { $_card_layout = { ...$_card_layout }; }}
            />
          </Switch>

          <Switch
            title_fixed={`浏览器边距: ${$_card_layout.margin ?? 20}px`}
            label="范围: 0~500 px(可输入)"
            type="range"
          >
            <input
              type="range"
              min="0"
              max="500"
              step="1"
              list="values"
              bind:value={$_card_layout.margin}
              on:change={() => { $_card_layout = { ...$_card_layout }; }}
            />
          </Switch>

          <Switch
            title_fixed={`预览窗口宽度: ${$_previewWidth > 0 ? $_previewWidth : (GLOBAL_SITE[$_current_domain] ? GLOBAL_SITE[$_current_domain].Iframe_Width : 1000)}px`}
            label="范围: 400~2000 px(0=站点默认)"
            type="range"
          >
            <input
              type="range"
              min="400"
              max="2000"
              step="10"
              list="values"
              value={$_previewWidth > 0 ? $_previewWidth : (GLOBAL_SITE[$_current_domain] ? GLOBAL_SITE[$_current_domain].Iframe_Width : 1000)}
              on:input={e => { $_previewWidth = Number(e.target.value); }}
              on:change={e => { $_previewWidth = Number(e.target.value); }}
            />
          </Switch>

          <Switch
            title_fixed={`预览窗口高度: ${$_previewHeight > 0 ? $_previewHeight : 96}%`}
            label="范围: 40~100 %(0=默认)"
            type="range"
          >
            <input
              type="range"
              min="40"
              max="100"
              step="1"
              list="values"
              value={$_previewHeight > 0 ? $_previewHeight : 96}
              on:input={e => { $_previewHeight = Number(e.target.value); }}
              on:change={e => { $_previewHeight = Number(e.target.value); }}
            />
          </Switch>
        </div>
      </div>

      <!-- ---------------- 卡片信息 ---------------- -->
      <div class="section">
        <h1 class="s_title">卡片信息</h1>
        <div class="s_panel">
          <!-- 按钮: 显示详情 -->
          <Switch
            title_fixed="卡片信息"
            title_green="显示下方所选信息(精简)"
            title_red="显示所有信息(较乱)"
            bind:checked={$_CARD_SHOW.all}
            green_state={false}
            on:click={sortMasonryBundle}
          />
          <!-- <button class="sideP__btn" on:click={config_showAllDetails}>显示所有详情界面</button> -->
        </div>

        <!-- 子面板: 配置常驻卡片信息 -->
        <div class="section">
          <h3 class="s_title">配置常驻卡片信息</h3>
          <div class="s_panel">
            <Switch
              title_fixed="显示种子名称"
              label="在卡片上显示种子完整名称"
              bind:checked={$_CARD_SHOW.title}
            />
            <Switch
              title_fixed="显示置顶和免费"
              label="显示置顶(星星)与免费/折扣(2x免费/50%下载等)标识"
              bind:checked={$_CARD_SHOW.free}
            />
            <Switch
              title_fixed="显示副标题"
              label="显示种子副标题/描述文字"
              bind:checked={$_CARD_SHOW.sub_title}
            />
            <Switch
              title_fixed="显示标签"
              label="显示 DIY/国配/中字 及站点标签"
              bind:checked={$_CARD_SHOW.tags}
            />
            <Switch
              title_fixed="显示 [大小/下载/收藏]"
              label="显示文件大小、下载量与收藏数"
              bind:checked={$_CARD_SHOW.size_download_collect}
            />
            <Switch
              title_fixed="显示上传时间"
              label="显示种子上传时间(多少时间前)"
              bind:checked={$_CARD_SHOW.upload_time}
            />
            <Switch
              title_fixed="显示 [评论/上传/下载/完成]"
              label="显示评论数、上传/下载量与完成数"
              bind:checked={$_CARD_SHOW.statistics}
            />

            <!-- 隐藏已读卡片 / 隐藏历史观看 (原生并入本模块, 统一样式) -->
            <Switch
              title_fixed="隐藏已读卡片"
              label="隐藏所有已读卡片(与隐藏历史观看互斥)"
              bind:checked={$__hideReadCards}
              func={() => {
                if ($__hideReadCards) $__hideHistoryRead = false;
              }}
            />
            <Switch
              title_fixed="隐藏历史观看"
              label="隐藏刷新前已观看的卡片, 刷新后新看的只变灰(与隐藏已读卡片互斥)"
              bind:checked={$__hideHistoryRead}
              func={() => {
                if ($__hideHistoryRead) $__hideReadCards = false;
              }}
            />

            <!-- NOTE: 废弃的旧型样式 -->
            {#if false}
              <span class="s_checkbox">
                <input
                  type="checkbox"
                  bind:checked={$_CARD_SHOW.title}
                  on:change={() => {
                    // console.log($_CARD_SHOW.title);
                    sortMasonry();
                  }}
                />
                显示种子名称
              </span>

              <span class="s_checkbox">
                <input
                  type="checkbox"
                  bind:checked={$_CARD_SHOW.free}
                  on:change={() => {
                    // console.log($_CARD_SHOW.free);
                    sortMasonry();
                  }}
                />
                显示置顶和免费
              </span>

              <span class="s_checkbox">
                <input
                  type="checkbox"
                  bind:checked={$_CARD_SHOW.sub_title}
                  on:change={() => {
                    // console.log($_CARD_SHOW.sub_title);
                    sortMasonry();
                  }}
                />
                显示副标题
              </span>

              <span class="s_checkbox">
                <input
                  type="checkbox"
                  bind:checked={$_CARD_SHOW.tags}
                  on:change={() => {
                    // console.log($_CARD_SHOW.tags);
                    sortMasonry();
                  }}
                />
                显示标签
              </span>

              <span class="s_checkbox">
                <input
                  type="checkbox"
                  bind:checked={$_CARD_SHOW.size_download_collect}
                  on:change={() => {
                    // console.log($_CARD_SHOW.size_download_collect);
                    sortMasonry();
                  }}
                />
                显示大小&下载&收藏
              </span>

              <span class="s_checkbox">
                <input
                  type="checkbox"
                  bind:checked={$_CARD_SHOW.upload_time}
                  on:change={() => {
                    // console.log($_CARD_SHOW.upload_time);
                    sortMasonry();
                  }}
                />
                显示上传时间
              </span>

              <span class="s_checkbox">
                <input
                  type="checkbox"
                  bind:checked={$_CARD_SHOW.statistics}
                  on:change={() => {
                    // console.log('statistics:\t'+$_CARD_SHOW.statistics);
                    sortMasonry();
                  }}
                />
                显示评论/上传/下载/完成
              </span>
            {/if}
          </div>
        </div>
      </div>

      <!-- ---------------- 同步/已读/TAG/名称过滤 (由 sync.js 填充) ---------------- -->
      <div class="section" id="kesaPanelWebdav" />
      <div class="section" id="kesaPanelRead" />
      <div class="section" id="kesaPanelTag" />
      <div class="section" id="kesaPanelName" />
    </div>
  </div>
{/if}

<!-- 按钮: 重置瀑布流配置边栏位置 -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="reset_panel_pos" on:click={resetPanelPos}>重置瀑布流配置边栏位置</div>

<style>
  .sideP {
    position: fixed;

    /* 已动态配置 */
    /* left: 0px; */
    /* top: 0px; */

    /* transition: top 0.1s; */
    /* transition: left 0.1s; */

    opacity: 0.4;

    margin: 4px 2px;

    /* 已动态配置 */
    /* background-color: #9ac6ff; */

    border-radius: 8px;
    overflow: hidden;

    z-index: 40000;

    border: 2px solid transparent;

    &:hover {
      opacity: 1;
      border: 2px solid yellow;
    }
  }

  .sideP__title {
    width: 100%;
    height: 8px;

    background-color: yellow;

    &:hover {
      cursor: move;
    }
  }

  .sideP__out {
    display: flex;
    flex-direction: column;
  }

  .sideP__btn {
    background-color: gray;
    color: white;

    padding: 4px 8px;

    margin: 4px;
    border-radius: 8px;

    cursor: pointer;

    border: none;

    &:hover {
      background-color: rgb(101, 49, 255);
    }
  }

  .configP {
    position: fixed;

    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;

    padding: 0;
    margin: 0;

    z-index: 50000;

    background-color: rgba(0, 0, 0, 0.2);

    color: #000;
  }

  .configP_holder {
    position: absolute;
    right: 20px;
    top: 20px;
    overflow-y: scroll;

    box-sizing: content-box;
    width: 360px;
    max-height: calc(100vh - 40px);
    padding: 0;
    margin: 0;

    /* 与 kamept 等站统一: 配置面板固定浅蓝背景, 不随站点主题色(否则 M-Team 深色主题会变黑) */
    /* border-top-left-radius: 24px; */
    /* border-bottom-left-radius: 24px; */
    border-radius: 24px;
    border: 2px solid black;
    background-color: rgb(212, 231, 255);

    /* 统一字体: 不随站点 body 继承(否则 M-Team body 16px 与 loli body 10.67px 差异巨大) */
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, "PingFang SC", "Microsoft YaHei", sans-serif;
    font-size: 14px;
    line-height: 1.4;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .configP_title {
    position: fixed;

    box-sizing: border-box;
    width: inherit;

    display: flex;
    justify-content: space-between;
    align-items: center;

    height: 40px;
    padding: 0 10px;

    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    border-bottom: 2px solid black;
    background-color: rgb(154, 198, 255);

    /* 与 kamept 等站统一: 配置面板标题固定浅蓝背景, 不随站点主题色(否则 M-Team 深色主题会变黑) */

    z-index: 2;

    & p {
      font-size: 18px;
      font-weight: 500;
      margin: 0;
      line-height: 1;
    }

    & button {
      border: none;
      padding: 0;
      margin: 0;
      background-color: transparent;
    }
  }

  .section {
    margin: 16px 18px;

    & button {
      border-radius: 10px;
      margin: 4px;
      padding: 12px 16px;
    }

    & .s_title {
      text-align: center;

      /* 统一 section 标题字体: 不随站点 h1/h3 继承(否则 M-Team h1=32px/500, loli h1=16px/700 差异巨大) */
      font-weight: 700;
      line-height: 1.4;
    }

    & h1.s_title {
      font-size: 18px;
      margin: 4px 0;
    }

    & h3.s_title {
      font-size: 14px;
      margin: 2px 0;
    }

    & .s_panel {
      display: flex;
      flex-direction: column;
      /* flex-wrap: wrap; */
      justify-content: space-evenly;
      align-items: center;
    }

    & .s_checkbox {
      padding: 12px;
      margin: 4px;
      border-radius: 10px;
      border: 1px solid black;

      font-size: 14px;
      display: flex;
      align-items: center;
    }
  }

  .configP_holder .section:nth-child(2) {
    margin-top: 48px;
  }

  #reset_panel_pos {
    width: 100%;
    text-align: center;
    /* background-color: #fff; */
    border: 1px solid black;
    border-radius: 16px;
    /* padding: 8px 0; */
  }
</style>
