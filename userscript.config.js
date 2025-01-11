export const config = {
  name: {
    "": "PT种子列表瀑布流视图(Svelte重构)",
    en: "PT_Masonry_View_Svelte",
  },
  icon: "https://avatars.githubusercontent.com/u/23617963",
  namespace: "https://github.com/KesaubeEire/PT_Masonry_View_Svelte",
  description: {
    "": "PT种子列表无限下拉瀑布流视图(Svelte重构)",
    en: "PT Masonry View by Svelte.",
  },
  author: "Kesa",
  match: [
    "https://kamept.com/*",
    // "https://pterclub.com/*",

    // M-Team 全系列域名
    "https://kp.m-team.cc/*",
    "https://xp.m-team.io/*",
    "https://xp.m-team.cc/*",
    "https://ap.m-team.cc/*",
    "https://test2.m-team.cc/*",
  ],
  exclude: [
    // np
    "*/offers.php*",
    "*/index.php*",
    "*/forums.php*",
    "*/viewrequests.php*",
    "*/seek.php*",

    // M-Team
    "*m-team*/detail/*",
  ],

  // 暂时弃用这个设计, 可能没啥用还容易导致 bug
  // "run-at": "document-start",
  // "run-at": "document-idle",

  grant: "none",
  license: "MIT",

  // NOTE: 经常修改这里就行了
  version: "1.1.14b",
}