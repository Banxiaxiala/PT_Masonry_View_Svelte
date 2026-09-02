export let version = '1.2.81b';

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
      // 排除根级种子详情页 /detail/<id>(M-Team/mua 的 torrent 详情)；
      // 用 *://*/detail/* 锚定"detail 紧跟在域名后"，不误伤 /profile/detail/<id>(M-Team 使用者详情)。
      "https://*.m-team.cc/detail/*",
      "*://*/detail/*",
      "*/details.php*",
      "*preview.php*",
      "*torrent-details*",
      // M-Team 消息页(message/-2 等)不是种子列表, 不需要瀑布流
      "*m-team*/message/*",
      // M-Team 个人控制面板(usercp?tab=personal)不是种子列表, 不需要瀑布流
      "*m-team*/usercp*",
    ],
    grant: [
      "GM_xmlhttpRequest",
      "GM_getValue",
      "GM_setValue",
    ],
    license: "MIT",
    "run-at": "document-start",

    // 自动更新源：GreasyFork update 源（脚本 ID 593866）。脚本已发布到 GreasyFork，通过 GitHub Webhook 自动同步。
    updateURL: "https://update.greasyfork.org/scripts/593866/PT种子列表瀑布流视图-svelte重构.user.js",
    downloadURL: "https://update.greasyfork.org/scripts/593866/PT种子列表瀑布流视图-svelte重构.user.js",

    // NOTE: 经常修改这里就行了
  };
}