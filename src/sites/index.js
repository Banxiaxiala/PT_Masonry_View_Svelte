import { config as config_Kame } from "./kamept";
import { config as config_Mteam } from "./mteam";
import { __isPTT, __pttParse } from "./ptt";

/** 站点参数相关参数顶层对象 */
const SITE = {
  // ---- M-Team NEW_MT 站 (mteamHijack.js 劫持路由) ----
  "kp.m-team.cc": config_Mteam,
  "xp.m-team.cc": config_Mteam,
  "ap.m-team.cc": config_Mteam,
  "test2.m-team.cc": config_Mteam,

  // ---- NexusPHP DOM 站 (ptt.js 的 __pttParse 逻辑) ----
  "kamept.com": config_Kame,
  "pttime.org": { ...config_Kame, torrentListTable: "#torrenttable" },
  "www.pttime.org": { ...config_Kame, torrentListTable: "#torrenttable" },
  "nicept.net": { ...config_Kame, torrentListTable: "table.torrents" },
  "ptfans.cc": { ...config_Kame, torrentListTable: "table.torrents" },
  // mua.xloli.cc 为 NexusPHP(torrents.php), 列结构与 kamept 一致
  "mua.xloli.cc": config_Kame,
};

/** 判断是否为 NexusPHP DOM 站
 * @param {string} domain 域名
 * @returns {boolean}
 */
function IS_NEXUSPHP(domain) {
  return /kamept\.com|pttime\.org|nicept\.net|ptfans\.cc/i.test(domain || "");
}

/** 判断是否为 M-Team NEW_MT 站
 * @param {string} domain 域名
 * @returns {boolean}
 */
function IS_MT(domain) {
  return /(?:kp|xp|ap|test2)\.m-team\.cc/i.test(domain || "");
}

/** 判断该域名是否为受支持的站点
 * @param {string} domain 域名
 * @returns {boolean}
 */
function isSupportedDomain(domain) {
  return !!(domain && SITE[domain]);
}

/** 获得当前PT站的名字 @returns 当前PT站名 */
function GET_CURRENT_PT_DOMAIN() {
  const domain = window.location.hostname;
  // 输出当前链接的域名
  // console.log("当前站点: ", domain);
  return domain;
}

/** 判断该页面是否存在种子列表
 * @returns selector
 */
function GET_TORRENT_LIST_SELECTOR() {
  const domain = GET_CURRENT_PT_DOMAIN();
  console.log("|-> 当前站点: ", domain);
  console.log('|-> 当前页面: ', window.location.pathname);

  const res = SITE[domain]?.torrentListTable ?? null;
  console.log('|-> 站点selector:', res);
  return res
}

export {
  GET_CURRENT_PT_DOMAIN,
  SITE as GLOBAL_SITE,
  GET_TORRENT_LIST_SELECTOR,
  IS_NEXUSPHP,
  IS_MT,
  isSupportedDomain,
  __isPTT,
  __pttParse,
}
