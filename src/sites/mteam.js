import { _iframe_switch, _iframe_url } from '../stores'
export { CONFIG as config };
const CONFIG = {
  /** 默认的种子表格 dom selector */
  torrentListTable: "table.torrents",

  /** 将 种子列表dom 的信息变为 json对象列表 */
  TORRENT_LIST_TO_JSON,

  /** 加载图片等待时的默认图片 */
  LOADING_PIC: "logo.png",

  /**如果站点有自定义的icon, 可以用自定义的 */
  ICON: {},

  /**如果站点有必要设置分类颜色, 可以用自定义的 */
  CATEGORY: {
    // 成人分类
    410: '#f52bcb', // 有码 HD
    429: '#f52bcb', // 无码 HD
    424: '#db55a9', // 有码 Xvid
    430: '#db55a9', // 无码 Xvid
    437: '#f77afa', // 有码 DVD
    426: '#f77afa', // 无码 DVD
    431: '#19a7ec', // 有码 BluRay
    432: '#19a7ec', // 无码 BluRay
    440: '#f52bcb', // GAY
    436: '#e85fc0', // 0 day  (原 #bb1e9a 过深, 提亮保证黑字可读)
    425: '#e85fc0', // 写真 video
    433: '#e85fc0', // 写真 pic
    411: '#f49800', // H-Game
    412: '#f49800', // H-Anime
    413: '#f49800', // H-Comic

    // 综合分类
    401: '#e06a75', // Movie SD   (原 #c74854 偏深)
    419: '#ee6352', // Movie HD   (原 #c01a20 深红提亮, 参照 mua 红色)
    420: '#e06a75', // Movie DVD
    421: '#4d94e6', // Movie BluRay (原 #00a0e9 提亮)
    439: '#5a78d6', // Movie Remux (原 #1b2a51 深藏青提亮)
    403: '#e06a75', // TV SD
    402: '#4d94e6', // TV HD    (原 #276fb8 提亮)
    435: '#4dbebd', // TV DVD
    438: '#5fb0e6', // TV BluRay (原 #1897d6 提亮)
    404: '#23ac38', // 纪录教育
    405: '#d8a25e', // Anime    (原 #996c34 深棕提亮)
    407: '#23ac38', // Sport
    422: '#f39800', // Software
    423: '#f39800', // Game
    427: '#f39800', // EBook
    409: '#d8a25e', // Other    (原 #996c34 提亮)

    // 音乐分类
    406: '#a97fd0', // MV        (原 #8a57a1 提亮)
    408: '#a97fd0', // Music AAC/ALAC
    434: '#a97fd0', // Music 无损
  },

  /** 分类号 -> 中文名(供卡片分类标签显示, 对齐参考版 rhfb99; 未知分类回退显示原数字) */
  CATEGORY_NAME: {
    115: "AV(有码)",
    120: "AV(无码)",
    410: "有码 HD",
    429: "无码 HD",
    424: "有码 Xvid",
    430: "无码 Xvid",
    437: "有码 DVD",
    426: "无码 DVD",
    431: "有码 BluRay",
    432: "无码 BluRay",
    440: "GAY",
    436: "0 day",
    425: "写真 video",
    433: "写真 pic",
    411: "H-Game",
    412: "H-Anime",
    413: "H-Comic",
    100: "Movie",
    401: "Movie SD",
    419: "Movie HD",
    420: "Movie DVD",
    421: "Movie BluRay",
    439: "Movie Remux",
    105: "TV",
    403: "TV SD",
    402: "TV HD",
    435: "TV DVDiSo",
    438: "TV BluRay",
    444: "Documentary",
    404: "Documentary",
    449: "Anime",
    405: "Anime",
    443: "教育",
    427: "教育文档",
    441: "教育影片",
    442: "教育音频",
    447: "Game",
    423: "Game",
    448: "TV Game",
    450: "其他",
    407: "Sport",
    422: "软件",
    409: "Other",
    110: "Music",
    406: "MV",
    408: "Music AAC/ALAC",
    434: "Music 无损",
  },

  /** 索引 */
  INDEX: 0,

  /** iframe 宽度 */
  Iframe_Width: 1260,

  /** NOTE: 站点特殊操作 */
  special: function () {
    table_Iframe_Set();
  },

  /** NOTE: 站点下一页加载后操作 */
  pageLoaded: function () {
    table_Iframe_Set();
  }
};

/** 原表格点击图片显示 iframe */
function table_Iframe_Set() {
  const lists = Array.from(document.querySelectorAll('td.torrentimg a'))
  lists.forEach(el => el.addEventListener('click', function (event) {
    // 阻止 a 标签的默认行为
    event.preventDefault();

    // 对 iframe 进行操作
    _iframe_switch.set(1)
    _iframe_url.set(/** @type {HTMLAnchorElement} */ (el).href + "#kdescr")
  }))
}

/**
 * 将 种子列表dom 的信息变为 json对象列表
 * @param {Element} torrent_list_Dom 种子列表dom
 * @returns {any[]} 种子列表信息的 json对象列表
 */
function TORRENT_LIST_TO_JSON(torrent_list_Dom) {
  // 获取表格中的所有行
  const rows = torrent_list_Dom.querySelectorAll("tbody tr");
  // const rows = torrent_list_Dom.querySelectorAll("tr");
  // const rows = div.querySelectorAll('tr');

  // 种子信息 -> 存储所有行数据的数组
  /** @type {any[]} */
  const data = [];

  // 遍历每一行并提取数据
  rows.forEach(/** @param {any} row */ (row) => {
    // 获取种子分类
    const categoryImg = /** @type {HTMLImageElement | null} */ (row.querySelector("td:nth-child(1) > a > img"));
    const category = categoryImg ? categoryImg.title : "";
    // 若没有分类则退出
    if (!category) return;

    // 获取种子分类链接 / 分类号
    const categoryLinkDOM = /** @type {HTMLAnchorElement | null} */ (categoryImg && categoryImg.parentNode);
    const categoryLink = categoryLinkDOM ? categoryLinkDOM.href : "";
    const categoryNumber = categoryLink.slice(-3);
    // const _categoryImg = categoryImg.cloneNode(true)
    // _categoryImg.className = "card-category-img"
    const str = categoryImg ? categoryImg.style.backgroundImage : ""
    const regex = /url\("(.*)"\)/; // 匹配包含在双引号中的内容
    const result = str.match(regex); // 使用正则表达式匹配结果
    const _categoryImg = (result && result.length > 1) ? result[1] : null;

    // console.log(categoryLinkDOM);
    // console.log(categoryLink, categoryNumber);

    // 加index
    const torrentIndex = CONFIG.INDEX++;

    // 获取种子名称
    const torrentNameLink = /** @type {HTMLAnchorElement | null} */ (row.querySelector(".torrentname a"));
    const torrentName = torrentNameLink ? torrentNameLink.title.trim() : "";

    // 获取种子详情链接
    const torrentLink = torrentNameLink ? torrentNameLink.href : "";
    // console.log(torrentLink);

    // 获取种子id
    const pattern = /id=(\d+)&hit/;
    const match = torrentLink.match(pattern);
    const torrentId = match ? parseInt(match[1]) : null;

    // 获取 mouse_over 和 mouse_out
    const imgDom = row.querySelector(".torrentname img");
    const _mouseOver = imgDom ? imgDom.getAttribute("onmouseover") : null;
    // const _mouseOut = imgDom.getAttribute("onmouseout");
    // console.log(_mouseOver);

    // 获取预览图片链接
    const raw1 = _mouseOver ? _mouseOver.split(',')[2].toString() : '';
    const picLink = raw1 ? raw1.slice(raw1.indexOf("'") + 1, raw1.lastIndexOf("'")) : '/pic/nopic.jpg'

    // 获取描述
    const desCell = row.querySelector(".torrentname td:nth-child(2)");
    const length = desCell ? desCell.childNodes.length - 1 : -1;
    const desDom = desCell && desCell.childNodes[length];
    const description = desDom && desDom.nodeName == '#text' ? desDom.textContent.trim() : "";

    // 获取置顶信息
    const place_at_the_top = row.querySelectorAll(".torrentname img.sticky");
    const pattMsg = place_at_the_top[0] ? /** @type {HTMLImageElement} */ (place_at_the_top[0]).title : "";

    // 获取临时标签: 新 / 热门 等
    const tempTagDom = row.querySelectorAll('.torrentname font');
    // console.log(tempTagDom);

    // 获取免费折扣类型
    const freeTypeImg = /** @type {HTMLImageElement | null} */ (row.querySelector('img[class^="pro_"]'));
    // console.log(freeTypeImg);
    // if (freeTypeImg) { console.log(freeTypeImg.alt); }
    const freeType = freeTypeImg
      ? "_" + freeTypeImg.alt.replace(/\s+/g, "")
      : "";

    // 获取免费剩余时间
    const freeRemainingTimeSpan = /** @type {HTMLElement | null} */ (row.querySelector(".torrentname td:nth-child(2) span"));
    const freeRemainingTime = freeRemainingTimeSpan
      ? freeRemainingTimeSpan.innerText
      : "";

    // 获取标签
    const tagSpans = row.querySelectorAll(".torrentname img[class^='label_']");
    // const raw_tags = row.querySelector(".torrentname");
    const tagsDOM = Array.from(tagSpans);
    let tags = tagSpans ? tagsDOM.map((el) => /** @type {HTMLImageElement} */ (el).title.trim()) : [];
    const raw_tags = tagsDOM.map((el) => el.outerHTML).join("&nbsp;");
    // console.log(raw_tags);

    // 获取下载链接
    const downloadLink = `download.php?id=${torrentId}`;

    // 获取收藏链接
    const collectLink = `javascript: bookmark(${torrentId},${torrentIndex});`;
    // 获取收藏状态
    const collectDOM = /** @type {HTMLAnchorElement | null} */ (row.querySelector(".torrentname a[id^='bookmark']"));
    const collectState = collectDOM ? /** @type {HTMLImageElement} */ (collectDOM.children[0]).alt : "";
    // console.log(collectState);

    // 获取评论数量
    const commentsLink = row.querySelector("td.rowfollow:nth-child(3) a");
    // console.log(commentsLink.innerHTML);
    const comments = commentsLink ? parseInt(commentsLink.textContent) : 0;

    // 获取上传日期
    const uploadDateSpan = /** @type {HTMLElement | null} */ (row.querySelector("td:nth-child(4) span"));
    const uploadDate = uploadDateSpan ? uploadDateSpan.title : "";

    // 获取文件大小
    const sizeCell = row.querySelector("td:nth-child(5)");
    const size = sizeCell ? sizeCell.textContent.trim() : "";

    // 获取做种人数
    const seedersLink = row.querySelector("td:nth-child(6) a");
    const seeders = seedersLink ? parseInt(seedersLink.textContent) : 0;

    // 获取下载人数
    const leechersCell = row.querySelector("td:nth-child(7)");
    const leechers = leechersCell ? parseInt(leechersCell.textContent) : 0;

    // 获取完成下载数
    const snatchedLink = row.querySelector("td:nth-child(8) a");
    const snatched = snatchedLink ? parseInt(snatchedLink.textContent) : 0;

    // 将当前行的数据格式化为 JSON 对象
    const rowData = {
      torrentIndex,
      _categoryImg,
      category,
      categoryLink,
      categoryNumber,
      torrent_name: torrentName,
      torrentLink,
      torrentId,
      picLink,
      place_at_the_top,
      pattMsg,
      downloadLink,
      collectLink,
      collectState,
      tempTagDom,
      freeTypeImg,
      free_type: freeType,
      free_remaining_time: freeRemainingTime,
      raw_tags,
      tagsDOM,
      tags,
      description,
      comments,
      upload_date: uploadDate,
      size,
      seeders,
      leechers,
      snatched,
    };

    // 将当前行的 JSON 对象添加到数组中
    data.push(rowData);
  });
  return data;
}