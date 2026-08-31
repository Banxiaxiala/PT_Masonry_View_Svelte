/// <reference types="svelte" />
/// <reference types="vite/client" />
/// <reference types="vite-plugin-monkey/client" />
/// <reference types="vite-plugin-monkey/global" />

// --------------------------------------------
// 油猴脚本项目自有的全局类型声明
// 供 checkJs:true 下的 .js / .svelte 源码类型检查使用, 消除 TS2339/TS2304 标红
// --------------------------------------------

declare global {
  interface Window {
    // 脚本挂载到 window 的自定义全局
    Masonry?: any;
    turnPage?: any;
    CHANGE_CARD_LAYOUT?: (...args: any[]) => any;
    __kesaHijack?: any;
    __kesaHijackInject?: any;
    __kesaPageSync?: any;
    __kesaWdSync?: any;
    __kesaRestoring?: any;
    __kesaRead?: any;
    __kesaWd?: any;
    __kesaPage?: any;
    __kesaImgDiag?: any;
    // jQuery(站点自带)
    jQuery?: any;
    $?: any;
  }

  interface Element {
    // querySelector 返回泛型 Element 时访问子类常见属性, 补声明避免 TS2339 标红
    dataset: DOMStringMap;
    style: CSSStyleDeclaration;
    title: string;
    href: string;
    // 自用扩展属性(赋值不限定具体类型, 兼容字符串/数值/布尔)
    __warmed?: any;
    __kesaQueued?: any;
    __kesaFail?: any;
    __kesaImgDiag?: any;
    outlayerGUID?: number;
    __kesaHijack?: any;
  }

  interface Node {
    turnPage?: any;
    // addedNodes / childNodes 返回 Node, 运行时已有 nodeType/判空检查, 补常见属性避免 TS2339
    classList: DOMTokenList;
    querySelector<E extends Element = Element>(selectors: string): E | null;
    style: CSSStyleDeclaration;
  }

  // 站点/脚本运行环境提供的全局变量(非 window 属性访问)
  var jQuery: any;
  var $: any;
  var masonry: any;
  var DOM: any;
  var list: any;
  var ksearchboxmain: any;
}

export {};

