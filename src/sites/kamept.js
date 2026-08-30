import { _iframe_switch, _iframe_url } from '../stores'
import { get } from 'svelte/store'
import { __aTags, __bTags } from '../lib/sync'
export { CONFIG as config };
const CONFIG = {
  /** 默认的种子表格 dom selector */
  torrentListTable: "table.torrents",

  /** 将 种子列表dom 的信息变为 json对象列表 */
  TORRENT_LIST_TO_JSON,

  /** 加载图片等待时的默认图片 */
  LOADING_PIC: "pic/logo2_100.png",

  /** 如果站点有自定义的icon, 可以用自定义的 */
  ICON: {},

  /** 如果站点有必要设置分类颜色, 可以用自定义的 */
  CATEGORY: {
    // [粉色]AV: 同人AV 男娘 VR同人
    410: '#FF66FF',
    413: '#FF66FF',
    414: '#FF66FF',
    // [绿色]图: cos图 画师CG 游戏CG 单行本 同人志
    417: '#59CD90',
    433: '#59CD90',
    434: '#59CD90',
    424: '#59CD90',
    435: '#59CD90',
    // [黄色]动画: 里番 2D 3D
    411: '#FAC05E',
    419: '#FAC05E',
    423: '#FAC05E',
    // [紫色]声音: 外语音声 中文音声 视频音声 音乐
    420: '#3FA7D6',
    421: '#3FA7D6',
    422: '#3FA7D6',
    437: '#3FA7D6',
    // [红色]游戏: 游戏 中文游戏
    415: '#EE6352',
    418: '#EE6352',

  },
  /** 索引 */
  INDEX: 0,

  /** iframe 宽度 */
  Iframe_Width: 1260,

  /** NOTE: 站点特殊操作 */
  special: function () {
    // 给龟站的搜索箱默认设置为"不扩展", 否则平常占地方(from tg by LNN)
    // 防御: 修复 1.2.13b 卡片仍不显示——当页面加载了 jQuery(如 kamept 的 nexus.js)时,
    // `$('ksearchboxmain')` 返回"空 jQuery 集合"(truthy)而非元素, 其 .style 为 undefined,
    // 直接 `.style.display = 'none'` 会抛 `Cannot set properties of undefined`, 中断组件初始化 → 卡片全不渲染。
    // 故统一取原生元素: jQuery 取 [0] / 原生 getElementById, 再判空后赋值。
    let _box = null;
    if (typeof $ === "function" && $(ksearchboxmain).length) {
      _box = $(ksearchboxmain)[0];
    } else {
      _box = document.getElementById('ksearchboxmain');
    }
    if (_box) _box.style.display = 'none';

    // "点此查看即将断种资源" 文字设置为黑色(from tg by LNN)
    const link = document.querySelector('a[href="?sort=7&type=asc&seeders_begin=1"]');
    // 防御: childNodes 可能为空 → childNodes[0] 为 undefined, 访问 .style.color 会抛错
    const _fc = link && link.childNodes && link.childNodes[0];
    if (_fc) _fc.style.color = 'black';


    // 让勋章不被卡片遮盖
    let np = document.querySelector('img#nexus-preview');
    if (np)
      np.style.zIndex = 12000;
    // -------------------------------

    // 原表格点击图片显示 iframe
    table_Iframe_Set()
  },

  /** NOTE: 站点下一页加载后操作 */
  pageLoaded: function () {
    // 原生 nexus tools
    var script = document.createElement("script");
    script.src = "https://kamept.com/js/nexus.js";
    document.head.appendChild(script);

    // -------------------------------

    // 原表格点击图片显示 iframe
    table_Iframe_Set()
  }
};

/** 原表格点击图片显示 iframe */
function table_Iframe_Set() {
  const lists = Array.from(document.querySelectorAll('.torrentname'))
  lists.forEach(el => el.addEventListener('click', function (event) {
    // 阻止 a 标签的默认行为
    event.preventDefault();

    // 对 iframe 进行操作
    _iframe_switch.set(1)

    // console.log(el.children[0].children[0].children[1].querySelector('a').href);
    _iframe_url.set(el.children[0].children[0].children[1].querySelector('a').href + "#kdescr")
  }))
}

/** 将 种子列表dom 的信息变为 json对象列表
 * @param {*} torrent_list_Dom 种子列表dom
 * @returns {[]} 种子列表信息的 json对象列表
 */
function TORRENT_LIST_TO_JSON(torrent_list_Dom) {
  // 获取表格中的所有行
  const rows = torrent_list_Dom.querySelectorAll("tbody tr");
  // const rows = torrent_list_Dom.querySelectorAll("tr");
  // const rows = div.querySelectorAll('tr');

  // 种子信息 -> 存储所有行数据的数组
  const data = [];

  // 遍历每一行并提取数据
  rows.forEach((row) => {
    // 获取种子分类
    const categoryImg = row.querySelector("td:nth-child(1) > a > img");
    const category = categoryImg ? categoryImg.alt : "";
    // 若没有分类则退出
    if (!category) return;

    // [TAG过滤] 收集分类到全部标签(供侧边栏 TAG 面板展示)
    const _all = get(__aTags);
    if (!_all.includes(category)) __aTags.set([..._all, category]);
    // [TAG过滤] 若该分类已被屏蔽则跳过(不生成卡片)
    if (get(__bTags).includes(category)) return;

    // 获取种子分类链接 / 分类号
    const categoryLinkDOM = categoryImg.parentNode;
    const categoryLink = categoryLinkDOM && categoryLinkDOM.href ? categoryLinkDOM.href : "";
    const categoryNumber = typeof categoryLink === "string" ? categoryLink.slice(-3) : "";
    const _categoryImg = categoryImg.cloneNode(true)
    _categoryImg.className = "card-category-img"
    // console.log(categoryLinkDOM);
    // console.log(categoryLink, categoryNumber);

    // 加index
    // const torrentIndex = CARD.CARD_INDEX++;
    const torrentIndex = CONFIG.INDEX++;

    // 获取种子名称
    const torrentNameLink = row.querySelector(".torrentname a");
    const torrentName = torrentNameLink ? torrentNameLink.textContent.trim() : "";

    // 获取种子详情链接
    // 防御: .torrentname a 缺失(部分非标准行/未登录等)时用空串兜底, 避免 .href 报 null 中断整页解析
    const torrentLink = torrentNameLink && torrentNameLink.href ? torrentNameLink.href : "";
    // console.log(torrentLink);

    // 获取种子id
    // 兼容 details.php?id=123 与 details.php?id=123&hit=1 等格式, 若解析不到则用整个链接兜底
    const pattern = /id=(\d+)/;
    const match = torrentLink.match(pattern);
    const torrentId = match ? parseInt(match[1]) : null;

    // 获取预览图片链接
    // 防御: 某些行可能无封面图元素, 避免 getAttribute 报 null 导致整页解析崩溃
    const _picImg = row.querySelector(".torrentname img");
    const picLink = _picImg ? (_picImg.getAttribute("data-src") || "") : "";

    // 获取描述
    const desCell = row.querySelector(".torrentname td:nth-child(2)");
    // 防御: desCell 缺失时跳过该行, 不让整体解析中断
    if (!desCell) return;
    const length = desCell.childNodes.length - 1;
    const desDom = desCell.childNodes[length];
    const description = desDom && desDom.nodeName == '#text' ? desDom.textContent.trim() : "";

    // 获取置顶信息
    const place_at_the_top = row.querySelectorAll(".torrentname img.sticky");
    const pattMsg = place_at_the_top[0] ? place_at_the_top[0].title : "";

    // 获取临时标签: 新 / 热门 等
    const tempTagDom = Array.from(row.querySelectorAll('.torrentname font'));
    // console.log(tempTagDom);

    // 获取免费折扣类型
    const freeTypeImg = row.querySelector('img[class^="pro_"]');
    // console.log(freeTypeImg);
    // console.log(freeTypeImg.alt);
    const freeType = freeTypeImg
      ? "_" + freeTypeImg.alt.replace(/\s+/g, "")
      : "";

    // 获取免费剩余时间
    // const freeRemainingTimeSpan = row.querySelector("font");
    const freeRemainingTimeSpan = freeType ? tempTagDom.pop() : "";
    const freeRemainingTime = freeRemainingTimeSpan
      ? freeRemainingTimeSpan.innerText
      : "";

    // 获取标签
    const tagSpans = row.querySelectorAll(".torrentname span");
    // const raw_tags = row.querySelector(".torrentname");
    const tagsDOM = Array.from(tagSpans);
    let tags = tagSpans ? tagsDOM.map((span) => span.textContent.trim()) : [];

    // console.log(index);
    // console.log(torrentName);
    // console.log(tags);

    if (freeRemainingTime != "") {
      // console.log(tags[0]);
      tags.shift();
      tagsDOM.shift();
    }
    const raw_tags = tagsDOM.map((el) => el.outerHTML).join("");
    // console.log(raw_tags);

    // 获取下载链接
    const downloadLink = `download.php?id=${torrentId}`;

    // 获取收藏链接
    const collectLink = `javascript: bookmark(${torrentId},${torrentIndex});`;
    // 获取收藏状态
    // 防御: 收藏按钮缺失时(非列表行/未登录等)用空串兜底, 避免 .children[0].alt 报 null
    const collectDOM = row.querySelector(".torrentname a[id^='bookmark']");
    const collectState =
      collectDOM && collectDOM.children && collectDOM.children[0]
        ? collectDOM.children[0].alt
        : "";
    // console.log(collectState);

    // 获取评论数量
    const commentsLink = row.querySelector("td.rowfollow:nth-child(3) a");
    // console.log(commentsLink.innerHTML);
    const comments = commentsLink ? parseInt(commentsLink.textContent) : 0;

    // 获取上传日期
    const uploadDateSpan = row.querySelector("td:nth-child(4) span");
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
      upload_date: uploadDate,
      comments,
      size,
      seeders,
      leechers,
      snatched,
    };

    // 将当前行的 JSON 对象添加到数组中
    data.push(rowData);
  });
  // @ts-ignore
  return data;
}