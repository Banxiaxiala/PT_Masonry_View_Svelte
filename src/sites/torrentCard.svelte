<script>
  import {
    _CARD_SHOW,
    _iframe_switch,
    _iframe_url,
    _pic_failed_showInfo,
  } from "../stores";
  import { sortMasonry } from "../utils";
  import { __isPTT, __ksDetailUrl } from "./ptt";
  import { config as _mtConfig } from "./mteam";

  /** 父传值: 种子信息 (统一结构 {name,id,size,smallDescr,labels,tags,category,categoryName,imageList,status:{...},torrentLink}) */
  /** @type {any} */
  export let torrentInfo;
  /** 父传值: 卡片宽度 */
  /** @type {any} */
  export let cardWidth;
  /** 父传值: 卡片在列表中的序号(供左上角黄色序号角标) */
  export let index = 0;
  /** 父传值: 当前站点 config(含 CATEGORY 配色 / CATEGORY_NAME 中文分类名) */
  export let siteConfig = null;

  // ------------------------------------------------
  // 安全的 torrentInfo: 防止访问 undefined 属性
  /** @type {any} */
  let it;
  $: {
    it = torrentInfo || {};
    it.status = torrentInfo.status || {};
  }

  /** 站点 config: 优先父传 siteConfig, 回退 M-Team 默认(避免 import 失败) */
  /** @type {any} */
  let cfg;
  $: cfg = siteConfig || { CATEGORY: {}, CATEGORY_NAME: {} };

  /** 详情链接: 优先用原表格解析的真实详情链接(NexusPHP 站 details.php?id=..),
   * 其次 PTT(__ksDetailUrl), 最后 M-Team /detail/{id}。
   * 修复: kamept 等 NexusPHP 站此前误用 /detail/{id}(M-Team 风格)导致跳错。
   */
  function detailLink() {
    if (it.torrentLink) return it.torrentLink;
    if (__isPTT) return __ksDetailUrl(it);
    if (it.id) return "/detail/" + it.id;
    return "#";
  }

  /** 点击卡片标题/封面: 在网页内 iframe 中打开详情预览(不再新标签页) */
  /** @param {any} e */
  function onClickCard(e) {
    const link = detailLink();
    if (!link || link === "#") return;
    // 阻止默认跳转
    if (e && e.preventDefault) e.preventDefault();
    $_iframe_switch = 1;
    // iframe 需要绝对地址(相对路径拼接站点根)
    // 参考 1.2.3b: PTT/nexusphp(ptfans/nicept/pttime) 点击在网页内打开详情页预览
    const __isNexus = __isPTT; // ptfans/nicept/pttime 均为 NexusPHP, 详情页锚点 #kdescr 定位简介
    $_iframe_url = (/^https?:/.test(link) ? link : location.origin + link) + (__isNexus ? "#kdescr" : "");
  }

  /** M-Team GAY 分区隐藏: 已按用户要求移除(改用其他方式实现) */

  /** 封面图 */
  let picSrc = "";
  $: picSrc = (it.imageList && it.imageList[0]) || "";

  // 封面图加载完全交由 lib/lazyImage 的 __kesaWatchLazy 队列接管:
  // - 原表格 lazy img 通过 new Image() 预热进浏览器缓存(并强制 loading=eager)
  // - 卡片 <img class="nexus-lazy-load_Kesa"> 走并发限制的 __kesaQueue
  // - 加载前查 __kesaFindLoaded: 命中页面里同 src 已加载的 img, 直接 l.src=o 复用缓存(不重新请求)
  // - onerror 重试 1 次 → 仍失败走 image_proxy.php 端点回退 → 仍失败 SVG 占位
  // 因此此处不主动写 src 也不监听 on:error, 避免和队列冲突。

  /** 分类颜色(优先站点 CATEGORY 映射, 未知用透明) */
  let cateColor = "transparent";
  $: {
    cateColor = (cfg.CATEGORY && cfg.CATEGORY[it.category]) ?? "transparent";
  }
  /** 分类文字: 恢复为原始黑色(用户要求保留原字体色), 分类条背景用分类色区分分区。
   *  未知分类的色条背景不再用黑色(用浅灰), 保证黑字在任意背景上都可读。 */
  const cateFontColor = "#000000";
  /** 未知分类时色条/卡片的回退背景色: 不再用黑色, 用浅灰(#eee)保证黑字可读 */
  const cateFallbackBg = "#eeeeee";

  /** M-Team CATEGORY_NAME 映射(M-Team 分类号→中文), 以 any 断言避免索引标红 */
  /** @type {any} */
  const _mteamCateName = _mtConfig.CATEGORY_NAME || {};

  /** 分类文本: 优先中文名(站点原始分类名/ CATEGORY_NAME), 其次 M-Team CATEGORY_NAME(PTT 分类号), 最后回退数字 */
  $: cateName =
    it.categoryName ||
    (cfg.CATEGORY_NAME && cfg.CATEGORY_NAME[it.category]) ||
    (_mteamCateName && _mteamCateName[it.category]) ||
    it.category ||
    "";

  /** 文件大小整理 */
  /** @param {any} size */
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
  /** @type {Record<string, string>} */
  const _discountText = { FREE: "免费", PERCENT_50: "50%", "2XFree": "2X免费" };
  const _discount = () => it.status.discount;

  /** 折扣剩余小时数(有 discountEndTime 时计算) */
  function discountRemainHour() {
    if (!it.status.discountEndTime) return "";
    const end = new Date(it.status.discountEndTime).getTime();
    const hours = Math.floor((end - Date.now()) / 3600000);
    return hours > 0 ? " : " + hours + " 小时" : "";
  }

  /** 置顶星星: toppingLevel 数量生成 */
  $: topStars = Array(Math.max(0, Number(it.status.toppingLevel) || 0)).fill(0);

  /** 上传时间: 距现在多少天/时 */
  $: upTime = (() => {
    if (!it.status.createdDate) return "";
    const past = new Date(it.status.createdDate).getTime();
    if (isNaN(past)) return "";
    const diff = Date.now() - past;
    const day = Math.floor(diff / 86400000);
    const hour = Math.floor((diff % 86400000) / 3600000);
    return (day > 0 ? day + " 日" : "") + (hour > 0 ? hour + " 时" : "");
  })();

  /** 调用瀑布流整理 */
  function sort_masonry() {
    sortMasonry();
  }
</script>

<div
  class="card"
  style="
    width: {cardWidth}px;
    border-color: {cateColor && cateColor !== 'transparent' ? cateColor : cateFallbackBg};
    background-color:#ffffff;
    background: linear-gradient(to bottom, {cateColor && cateColor !== 'transparent' ? cateColor : cateFallbackBg} 18px, #ffffff 18px);"
>
  <div
    class="card-holder"
    style="background: linear-gradient(to bottom, {cateColor && cateColor !== 'transparent' ? cateColor : cateFallbackBg} 18px, #ffffff 18px);"
  >
    <!-- 分类标签(顶部 18px 色条, 内含分类小图标 + 分类文本) -->
    <div
      class="card-category"
      data-href="/browse?cat={it.category}"
      style="background-color: {cateColor && cateColor !== 'transparent' ? cateColor : cateFallbackBg}; color: {cateFontColor}"
    >
      {cateName}
    </div>

    <!-- 标题 & 详情链接 -->
    {#if $_CARD_SHOW.title}
      <div class="card-title">
        <a class="two-lines" href={detailLink()} target="_blank" on:click={onClickCard}>
          <b>{it.name}</b>
        </a>
      </div>
    {/if}

    <!-- 封面图(走懒加载队列 __kesaWatchLazy, 见 lib/lazyImage.js)
         无 data-src 时直接显示 pic_error 占位, 不创建空 img -->
    <div class="card-image" on:click={onClickCard}>
      {#if !picSrc}
        <div class="pic_error">
          {$_pic_failed_showInfo ? (it.name || "暂无图片") : "暂无图片"}
        </div>
      {:else}
        <img
          class="card-image--img nexus-lazy-load_Kesa"
          data-src={picSrc}
          alt={it.name}
          on:load={sort_masonry}
        />
      {/if}
      <!-- 左上角序号角标(黑色圆角, 黄色数字) -->
      <div class="card-index">{index + 1}</div>
      <!-- 局部悬浮预览触发区(预览大图方式=局部悬浮时, 鼠标悬停此处触发大图预览) -->
      <div class="hover-trigger">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </div>
      <!-- 折扣角标 -->
      {#if it.status.discount && it.status.discount != "NORMAL"}
        <div class="card-discount" class:isFree={it.status.discount == "FREE"} class:is50={it.status.discount == "PERCENT_50"}>
          {_discountText[it.status.discount] || it.status.discount}
        </div>
      {/if}
    </div>

    <!-- 置顶和免费(受"显示置顶和免费"开关控制) -->
    {#if $_CARD_SHOW.free && (it.status.toppingLevel || (it.status.discount && it.status.discount != "NORMAL"))}
      <div class="cl-tags top_and_free">
        {#if it.status.toppingLevel}
          {#each topStars as _, ts}
            <span class="_tag _tag_pin" title="置顶">置顶</span>
          {/each}
        {/if}
        {#if it.status.discount && it.status.discount != "NORMAL"}
          <span class="_tag _tag_discount_free" class:isFree={it.status.discount == "FREE"} class:is50={it.status.discount == "PERCENT_50"}>
            {_discountText[it.status.discount] || it.status.discount}{discountRemainHour()}
          </span>
        {/if}
      </div>
    {/if}

    <!-- 上传时间(受"显示上传时间"开关控制) -->
    {#if $_CARD_SHOW.upload_time && upTime}
      <div class="card-line upload-time">上传:{upTime}前</div>
    {/if}

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

    <!-- 标签 (labels 位运算: 1=DIY 2=国配 4=中字; 以及站点原始 tags 数组) -->
    {#if $_CARD_SHOW.tags && (Number(it.labels) || (it.tags && it.tags.length))}
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
        {#if it.tags && it.tags.length}
          {#each it.tags as tg}
            {#if tg && ["DIY", "国配", "中字"].indexOf(String(tg).trim()) === -1}
              <span class="_tag _tag_other">{tg}</span>
            {/if}
          {/each}
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  /* 卡片 */
  .card {
    border: 2px solid;
    border-radius: 16px;
    margin: 6px 0;
    overflow: hidden;
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.3) 0px 6px 0px 0px, rgba(0, 0, 0, 0.1) -1px -1px 0px 0px;
    transition: box-shadow 0.2s;
  }

  /* 指针卡片悬浮效果 */
  .card:hover {
    box-shadow: rgba(115, 0, 255, 0.3) 5px 5px 0px 0px, rgba(0, 0, 0, 0.1) -1px -1px 0px 0px;
  }

  /* 卡片标题 */
  .card-title {
    padding: 2px 0;
  }

  /* 卡片内部容器: 背景由内联渐变控制(统一主题=顶部分类色 18px + 白色正文区),
     参照参考版 rhfb99 / M-Team(白色卡片背景), 而非跟随 $_current_bgColor,
     避免 M-Team 深色背景(1a1a1a)让标题区呈灰色 */

  /* 卡片分类(顶部 18px 色条, 背景=分类色, 文字=原始黑色; 未知分类回退浅灰) */
  .card-category {
    height: 18px;
    padding: 0 2px;
    border: 1px;
    background-color: #eee;
    color: #000;
    font-weight: 900;
    text-align: center;
    letter-spacing: 2px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
    justify-content: center;
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
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: color 0.3s;
    color: black;
  }

  /* 卡片标题: hover时变为正常 */
  .two-lines:hover {
    -webkit-line-clamp: 100;
    line-clamp: 100;
  }

  /* 卡片信息行: 标签行 */
  .cl-tags {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 2px;
    padding-top: 4px;
    padding-bottom: 4px;
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
  /* 置顶/折扣/其他标签 */
  ._tag_pin { background-color: rgb(245, 166, 35); }
  ._tag_discount_free { background-color: rgb(16, 142, 233); }
  ._tag_discount_free.isFree { background-color: rgb(16, 142, 233); }
  ._tag_discount_free.is50 { background-color: rgb(255, 85, 0); }
  ._tag_other { background-color: rgb(108, 108, 108); }

  /* 上传时间行 */
  .upload-time {
    color: #666;
    font-size: 12px;
  }

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

  /* 局部悬浮预览触发区: 固定在封面右下角, 悬停触发大图预览(参照参考版圆形样式) */
  .hover-trigger {
    position: absolute;
    right: 8px;
    bottom: 8px;
    z-index: 3;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    background-color: rgba(0, 0, 0, 0.55);
    color: #fff;
    cursor: pointer;
    pointer-events: auto;
  }
  .hover-trigger:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }

  /* 左上角序号角标(黑色圆角, 黄色数字) */
  .card-index {
    position: absolute;
    top: 0;
    left: 0;
    padding-right: 9px;
    padding-left: 2px;
    margin: 0;
    height: 20px;
    line-height: 16px;
    font-size: 16px;
    background-color: #000;
    color: #ffff00;
    border-top-right-radius: 100px;
    border-bottom-right-radius: 100px;
    display: flex;
    align-items: center;
    pointer-events: none;
  }
  .card-discount.isFree { background-color: rgb(16, 142, 233); }
  .card-discount.is50 { background-color: rgb(255, 85, 0); }

  /* 卡片索引 / 副标题 */
  .card-description {
    padding: 2px 4px;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .card-description, .card-description:hover {
    color: black;
  }
</style>
