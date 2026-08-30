export let version = '1.2.12b';

export function config(mode) {
  return {
    version,
    name: {
      "": "PT种子列表瀑布流视图(Svelte重构)",
      en: "PT_Masonry_View_Svelte",
    },
    icon: "https://avatars.githubusercontent.com/u/23617963",
    namespace: "https://github.com/KesaubeEire/PT_Masonry_View_Svelte",
    description: {
      "": "PT种子列表无限下拉瀑布流视图(Svelte重构) [M-Team数据源: 劫持站点自身请求(原作者逻辑)]",
      en: "PT Masonry View by Svelte.",
    },
    author: "Kesa",
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