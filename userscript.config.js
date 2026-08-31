export let version = '1.2.47b';

export function config(mode) {
  return {
    version,
    name: {
      "": "PT种子列表瀑布流视图(Svelte重构)",
      en: "PT_Masonry_View_Svelte",
    },
    icon: "https://avatars.githubusercontent.com/u/35516655",
    namespace: "https://github.com/Banxiaxiala/PT_Masonry_View_Svelte",
    description: {
      "": "PT种子列表无限下拉瀑布流视图(Svelte重构)。适配站点: M-Team(m-team.cc各子域, 劫持 /search API)✅、mua.xloli.cc(独立站, 复用 M-Team 架构)✅、KamePT(kamept.com)✅、PTT(pttime.org)✅、NicePT(nicept.net)✅、PTFans(ptfans.cc)✅。",
      en: "PT Masonry View by Svelte. Supported sites: M-Team✅, mua.xloli.cc✅, KamePT✅, PTT✅, NicePT✅, PTFans✅.",
    },
    author: "Banxiaxiala",
    match: [
      // NexusPHP 站
      "https://kamept.com/*",
      "https://www.pttime.org/*",
      "https://pttime.org/*",
      "https://www.nicept.net/*",
      "https://www.ptfans.cc/*",
      "https://ptfans.cc/*",
      // M-Team 系(NEW_MT, 劫持 /search JSON) - 用 *.m-team.cc 通配所有子域(kp/xp/ap/zp/hp 等)
      "https://*.m-team.cc/*",
      "https://mua.xloli.cc/*",
    ],
    exclude: [
      // ptfans.cc 根首页(https://ptfans.cc/)无种子列表, 不需要加载脚本; 其余页面照常
      "https://ptfans.cc",
      "https://ptfans.cc/",
      "*/offers.php*",
      "*/index.php*",
      "*/forums.php*",
      "*/viewrequests.php*",
      "*/seek.php*",
      "*m-team*/detail/*",
      "*/detail/*",
      "*details.php*",
      "*preview.php*",
      "*torrent-details*",
      // M-Team 消息页(message/-2 等)不是种子列表, 不需要瀑布流
      "*m-team*/message/*",
    ],
    grant: [
      "GM_xmlhttpRequest",
      "GM_getValue",
      "GM_setValue",
    ],
    license: "MIT",
    "run-at": "document-start",

    // NOTE: 经常修改这里就行了
  };
}