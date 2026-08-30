<script>
  import {
    _CARD_SHOW,
    _current_bgColor,
    _iframe_switch,
    _iframe_url,
    _SITE_SETTING,
    _pic_failed_showInfo,
  } from "../stores";
  import { sortMasonry } from "../utils";
  import { config } from "./mteam";
  import { __isPTT, __ksDetailUrl } from "./ptt";

  /** 父传值: 种子信息 (统一结构 {name,id,size,smallDescr,labels,category,imageList,status:{...},torrentLink}) */
  export let torrentInfo;
  /** 父传值: 卡片宽度 */
  export let cardWidth;

  // ------------------------------------------------
  // 安全的 torrentInfo: 防止访问 undefined 属性
  let it;
  $: {
    it = torrentInfo || {};
    it.status = torrentInfo.status || {};
  }

  /** 详情链接: PTT 用 __ksDetailUrl(it), 其他用 /detail/{id} */
  function detailLink() {
    if (__isPTT) return __ksDetailUrl(it);
    if (it.id) return "/detail/" + it.id;
    return it.torrentLink || "#";
  }

  /** M-Team NEW_MT 站: 点击卡片标题/封面在 iframe 中打开详情 */
  function onClickCard(e) {
    // 非 M-Team 站走默认新标签页
    if (__isPTT) return;
    const link = detailLink();
    if (!link || link === "#") return;
    // 阻止默认跳转
    if (e && e.preventDefault) e.preventDefault();
    $_iframe_switch = 1;
    // iframe 需要绝对地址(相对路径拼接站点根)
    $_iframe_url = /^https?:/.test(link) ? link : location.origin + link;
  }

  /** M-Team GAY 分区隐藏: category 440(及成人分类)按配置隐藏 */
  $: gayHidden =
    !__isPTT && it.category === 440 && $_SITE_SETTING.mt.hide_gay;

  /** 封面图 */
  let picSrc = "";
  $: picSrc = (it.imageList && it.imageList[0]) || "";

  /** 图片加载失败占位 */
  let picError = false;
  const onPicError = () => {
    picError = true;
    sort_masonry();
  };

  /** 根据背景颜色动态调整文字黑白 */
  function getTextColor(background) {
    const color = (background || "").replace("#", "");
    if (!/^[0-9a-fA-F]{6}$/.test(color)) return "black";
    const red = parseInt(color.substr(0, 2), 16);
    const green = parseInt(color.substr(2, 2), 16);
    const blue = parseInt(color.substr(4, 2), 16);
    const brightness = (red * 299 + green * 587 + blue * 114) / 1000;
    return brightness < 128 ? "white" : "black";
  }

  /** 分类颜色(优先站点 CATEGORY 映射, 未知用透明) */
  let cateColor = "transparent";
  let cateFontColor = "black";
  $: {
    cateColor = config.CATEGORY[it.category] ?? "transparent";
    cateFontColor = cateColor && cateColor !== "transparent" ? getTextColor(cateColor) : "black";
  }

  /** 文件大小整理 */
  function getFileSize(size) {
    size = Number(size) || 0;
    if (size === 0) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    let i = 0;
    let sizeCopy = size;
    while (sizeCopy >= 1024 && i < units.length - 1) {
      sizeCopy /= 1024;
      i++;
    }
    const formattedSize = sizeCopy.toFixed(2).replace(/\.?0+$/, "");
    return `${formattedSize} ${units[i]}`;
  }

  /** 折扣文案 */
  const _discountText = { FREE: "免费", PERCENT_50: "50%" };
  const _discount = () => it.status.discount;

  /** 调用瀑布流整理 */
  function sort_masonry() {
    sortMasonry();
  }
</script>

<div
  class="card"
  style="
    width: {cardWidth}px;
    background-color:{$_current_bgColor};
    display: {gayHidden ? 'none' : ''}"
>
  <div class="card-holder">
    <!-- 分类标签 -->
    <div
      class="card-category"
      style="background-color: {cateColor}; color: {cateFontColor}"
    >
      {it.category}
    </div>

    <!-- 标题 & 详情链接 -->
    {#if $_CARD_SHOW.title}
      <div class="card-title">
        <a class="two-lines" href={detailLink()} target="_blank" on:click={onClickCard}>
          <b>{it.name}</b>
        </a>
      </div>
    {/if}

    <!-- 封面图(懒加载) -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="card-image" on:click={onClickCard}>
      {#if picError}
        <div class="pic_error">
          {$_pic_failed_showInfo ? (it.name || "图片加载失败") : "图片加载失败"}
        </div>
      {:else}
        <img
          class="card-image--img nexus-lazy-load_Kesa"
          src={config.LOADING_PIC}
          data-src={picSrc}
          alt={it.name}
          on:load={sort_masonry}
          on:error={onPicError}
        />
      {/if}
      <!-- 折扣角标 -->
      {#if it.status.discount && it.status.discount != "NORMAL"}
        <div class="card-discount" class:isFree={it.status.discount == "FREE"} class:is50={it.status.discount == "PERCENT_50"}>
          {_discountText[it.status.discount] || it.status.discount}
        </div>
      {/if}
    </div>

    <!-- 卡片信息 -->
    <div class="card-details">
      <!-- 大小 -->
      {#if $_CARD_SHOW.size_download_collect}
        <div class="card-line"><b>大小:</b> {getFileSize(it.size)}</div>
      {/if}

      <!-- 做种 / 下载 / 评论 -->
      {#if $_CARD_SHOW.statistics}
        <div class="card-line">
          评论:<b>{it.status.comments ?? 0}</b>&nbsp;&nbsp;
          做种:<b>{it.status.seeders ?? 0}</b>&nbsp;&nbsp;
          下载:<b>{it.status.leechers ?? 0}</b>
        </div>
      {/if}
    </div>

    <!-- 副标题 -->
    {#if $_CARD_SHOW.sub_title && it.smallDescr}
      <a class="card-description" href={detailLink()}>
        {it.smallDescr}
      </a>
    {/if}

    <!-- 标签 (labels 位运算: 1=DIY 2=国配 4=中字) -->
    {#if $_CARD_SHOW.tags && (Number(it.labels) || 0)}
      <div class="cl-tags">
        {#if (Number(it.labels) & 1) === 1}
          <span class="_tag _tag_diy">DIY</span>
        {/if}
        {#if (Number(it.labels) & 2) === 2}
          <span class="_tag _tag_dub">国配</span>
        {/if}
        {#if (Number(it.labels) & 4) === 4}
          <span class="_tag _tag_sub">中字</span>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  /* 卡片 */
  .card {
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 16px;
    margin: 6px 0;
    overflow: hidden;
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.3) 3px 3px 0px, rgba(0, 0, 0, 0.1) -1px -1px 0px;
    transition: box-shadow 0.2s;
  }

  /* 指针卡片悬浮效果 */
  .card:hover {
    box-shadow: rgba(115, 0, 255, 0.3) 5px 5px 0px, rgba(0, 0, 0, 0.1) -1px -1px 0px;
  }

  /* 卡片标题 */
  .card-title {
    padding: 2px 0;
  }

  /* 卡片内部容器 */
  .card-holder {
    background-color: rgba(255, 255, 255, 0.5);
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0));
  }

  /* 卡片分类 */
  .card-category {
    text-align: center;
    letter-spacing: 2px;
    font-weight: 700;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /* 卡片行默认样式 */
  .card-line {
    margin-top: 1px;
    margin-bottom: 1px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    height: 20px;
  }

  /* 卡片标题: 默认两行 */
  .two-lines {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: color 0.3s;
  }

  /* 卡片标题: hover时变为正常 */
  .two-lines:hover {
    -webkit-line-clamp: 100;
  }

  /* 卡片信息行: 标签行 */
  .cl-tags {
    display: flex;
    justify-content: left;
    align-items: center;
    flex-wrap: wrap;
    gap: 2px;
    transform: translateX(4px);
    padding-top: 2px;
  }

  /* 标签 */
  ._tag {
    height: 1.3em;
    line-height: 1.3em;
    padding: 0 0.5em;
    border-radius: 6px;
    font-size: 12px;
    color: #fff;
  }
  ._tag_diy { background-color: rgb(90, 189, 72); }
  ._tag_dub { background-color: rgb(90, 59, 20); }
  ._tag_sub { background-color: rgb(59, 74, 127); }

  /* 卡片简介总容器 */
  .card-details {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  /* 卡片图像div */
  .card-image {
    height: 100%;
    position: relative;
  }

  /* 卡片图像div -> img标签 */
  .card-image img {
    width: 100%;
    object-fit: cover;
  }

  /* 图片加载失败占位 */
  .pic_error {
    width: 100%;
    height: 100%;
    min-height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 13px;
    color: #999;
    background-color: rgba(0, 0, 0, 0.06);
    padding: 8px;
    box-sizing: border-box;
  }

  /* 折扣角标 */
  .card-discount {
    position: absolute;
    top: 4px;
    right: 4px;
    z-index: 2;
    padding: 0 6px;
    border-radius: 6px;
    font-size: 12px;
    color: #fff;
    pointer-events: none;
  }
  .card-discount.isFree { background-color: rgb(16, 142, 233); }
  .card-discount.is50 { background-color: rgb(255, 85, 0); }

  /* 卡片索引 / 副标题 */
  .card-description {
    padding-left: 4px;
    padding-right: 4px;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
