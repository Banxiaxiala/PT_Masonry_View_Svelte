/**
 * 全局工具类函数~
 */

import { get } from 'svelte/store'
import { _show_nexus_pic, _delay_nexus_pic, _state_hover_pic, _preview_style } from '../stores'

export { debounce, throttle, sortMasonry, NEXUS_TOOLS }
/**瀑布流执行次数 */
const _SORT_COUNT = {
  /**外部呼叫函数次数 */
  Call: 0,
  /**函数实际执行次数 */
  Run: 0,
}
// NOTE: 1. 抽象工具-------------------------------
/** @type {any} */
let timer = null;
/** 防抖函数
 * @param {any} func 操作函数
 * @param {any} delay 延迟
 * @returns
 */
function debounce(func, delay) {
  return function () {
    if (timer) {
      console.warn('debounce dupe!!!!!!');
      clearTimeout(timer);
    }
    timer = setTimeout(/** @this {any} */ function () {
      func.apply(this, arguments);
      // console.log('防抖: ', func.name);
      timer = null;
    }, delay);
  };
}

/** 节流函数
 * @param {any} func 操作函数
 * @param {any} delay 延迟
 * @returns
 */
function throttle(func, delay) {
  /** @type {any} */
  let timerId;
  let lastExecTime = 0;

  return /** @this {any} @param {any[]} args */ function (...args) {
    const currentTime = Date.now();
    const elapsedTime = currentTime - lastExecTime;

    if (!timerId && elapsedTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = currentTime;
        timerId = null;
      }, delay - elapsedTime);
    }
  };
}

// NOTE: 2. 瀑布流整理调用-------------------------------
/**设置节流 Masonry 执行体*/
const throttleSort = throttle(doSortMasonry, 1500);
const throttleSort_fast = throttle(doSortMasonry, 30);

/**实际执行整理 Masonry */
function doSortMasonry() {
  _SORT_COUNT.Run++
  // console.log(`实际执行次数: ${_time}`);
  console.log(`呼叫整理次数: ${_SORT_COUNT.Call}   实际整理次数: ${_SORT_COUNT.Run}`);
  masonry.layout()
}

/**外部呼叫整理 Masonry: 根据速度调整 */
function sortMasonry(speed = 'normal') {
  _SORT_COUNT.Call++
  if (masonry) {
    if (speed === 'fast') {
      throttleSort_fast()
    } else {
      throttleSort()
    }
  }
  // 同步预热/排队懒加载图片(兼容各站不同滚动容器)
  if (typeof __kesaWatchLazy === 'function') __kesaWatchLazy();
}

// NOTE: 3b. 图片懒加载并发队列(替换简单的 IntersectionObserver)-------------------------------
// 并发数 4, 4 秒超时, 复用已加载同 src 图片, 失败降级处理
/** @type {any[]} */
let __kesaQ = [];
let __kesaBusy = 0;
/** @type {Record<string, any>} */
let __kesaDone = {};
const __kesaLimit = 4;

/** 预热原列表封面图 + 排队所有未加载懒加载图片 */
function __kesaWatchLazy() {
  // 原列表封面 loading=lazy 且被 display:none 隐藏, 从不加载; 强制 eager 并用 new Image() 灌入缓存复用
  /** @type {NodeListOf<HTMLImageElement>} */
  (document.querySelectorAll('img[loading="lazy"]')).forEach(/** @param {any} im */ (im) => {
    const src = im.getAttribute("src") || im.getAttribute("data-src") || "";
    if (!src || /emptyImg|trans\.gif|spinner|^data:/i.test(src)) return;
    if (im.loading !== "eager") im.loading = "eager";
    if (!im.__warmed) {
      im.__warmed = 1;
      const w = new Image();
      w.src = src;
    }
  });
  // 直接排队加载所有未加载的懒加载图片
  (document.querySelectorAll(".nexus-lazy-load_Kesa:not(.preview_Kesa)")).forEach(/** @param {any} l */ (l) => {
    if (l.dataset.src && !l.__kesaQueued && !l.__kesaFail) __kesaQueue(l);
  });
}

/** 入队卡片 img (已入队/已失败/无 data-src 的跳过)
 * @param {any} l
 */
function __kesaQueue(l) {
  if (l.__kesaQueued || l.classList.contains("preview_Kesa") || l.__kesaFail) return;
  const o = l.dataset.src;
  if (!o) return;
  if (__kesaDone[o] === 1) {
    ((l.__kesaQueued = 1), (l.referrerPolicy = "no-referrer"), (l.src = o), l.classList.add("preview_Kesa"), sortMasonry());
    return;
  }
  if (__kesaDone[o] === -1) {
    ((l.__kesaQueued = 1), (l.__kesaFail = 1), (l.src = o), l.classList.add("preview_Kesa"), sortMasonry());
    return;
  }
  ((l.__kesaQueued = 1), __kesaQ.push(l), __kesaPump());
}

function __kesaPump() {
  while (__kesaBusy < __kesaLimit && __kesaQ.length) {
    const l = __kesaQ.shift();
    ((l.__kesaQueued = 0), __kesaStart(l));
  }
}

/** 在所有 <img> 中查找已加载完成且 src 匹配的 img(实现"复用原列表图片链接")
 * @param {any} o
 */
function __kesaFindLoaded(o) {
  try {
    const all = document.querySelectorAll("img");
    for (let i = 0; i < all.length; i++) {
      const im = all[i];
      const src = im.currentSrc || im.getAttribute("src") || "";
      if (src === o && im.complete && im.naturalWidth > 0) return im;
    }
  } catch (e) {}
  return null;
}

function __kesaFailSvg() {
  return (
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='560'><text x='50%' y='50%' font-size='24' fill='#aaa' text-anchor='middle' dominant-baseline='middle'>暂时无法加载出图片</text></svg>"
    )
  );
}

/** 实际加载单张卡片图
 * @param {any} l
 */
function __kesaStart(l) {
  if (l.__kesaBusy || l.classList.contains("preview_Kesa")) return;
  const o = l.dataset.src;
  if (!o) {
    l.__kesaFail = 1;
    return;
  }
  // 复用页面中已加载的同 src 图片, 避免重新请求卡住
  const __re = __kesaFindLoaded(o);
  if (__re) {
    ((l.referrerPolicy = __re.referrerPolicy || ""),
      (l.src = o),
      l.classList.add("preview_Kesa"),
      (__kesaDone[o] = 1),
      sortMasonry());
    return;
  }
  ((l.__kesaBusy = 1), __kesaBusy++);
  const p = new Image();
  const a = l.__kesaTry | 0;
  /** @type {any} */
  let __to = null;
  a >= 1 && (p.referrerPolicy = "no-referrer");
  p.onload = () => {
    __to && clearTimeout(__to);
    if (l.__kesaTimedOut) {
      (__kesaDone[o] = 1), (l.referrerPolicy = p.referrerPolicy), (l.src = o), l.classList.add("preview_Kesa"), sortMasonry();
      return;
    }
    ((__kesaDone[o] = 1),
      (l.__kesaBusy = 0),
      __kesaBusy--,
      __kesaPump(),
      (l.referrerPolicy = p.referrerPolicy),
      (l.src = o),
      l.classList.add("preview_Kesa"),
      sortMasonry());
  };
  p.onerror = () => {
    __to && clearTimeout(__to);
    if (l.__kesaTimedOut) {
      (__kesaDone[o] = -1), (l.__kesaFail = 1), (l.src = __kesaFailSvg()), l.classList.add("preview_Kesa"), sortMasonry();
      return;
    }
    l.__kesaTry = a + 1;
    if (a === 0) {
      ((l.__kesaBusy = 0),
        __kesaBusy--,
        setTimeout(() => {
          __kesaQ.unshift(l), __kesaPump();
        }, 500));
      return;
    }
    if (a === 1 && !/ptfans\.cc/i.test(location.hostname) && !o.includes("image_proxy.php") && !l.__kesaProxy) {
      // ptfans.cc 的 image_proxy.php 端点已失效, 跳过无效重试
      ((l.__kesaProxy = 1),
        (l.dataset.src = location.origin + "/image_proxy.php?url=" + encodeURIComponent(o)),
        (l.__kesaBusy = 0),
        __kesaBusy--,
        setTimeout(() => {
          __kesaQ.unshift(l), __kesaPump();
        }, 500));
      return;
    }
    ((__kesaDone[o] = -1),
      (l.__kesaFail = 1),
      (l.__kesaBusy = 0),
      __kesaBusy--,
      __kesaPump(),
      (l.src = o),
      l.classList.add("preview_Kesa"),
      sortMasonry());
  };
  p.src = o;
  // 4 秒超时: 仅释放并发槽, 该图继续后台加载, 完成后自动显示
  __to = setTimeout(function () {
    if (l.__kesaTimedOut) return;
    (l.__kesaTimedOut = 1), (l.__kesaBusy = 0), __kesaBusy--, __kesaPump();
  }, 4000);
}

// NOTE: 3. Nexus 工具(触摸预览 + 懒加载)-------------------------------/**NEXUS 预览工具箱, 提供图片预览和图片懒加载, 神器*/
/**NEXUS 预览工具箱, 提供图片预览和图片懒加载, 神器*/
function NEXUS_TOOLS() {
  console.log('------------------------NEXUS TOOLS------------------------');
  jQuery(document).ready(function () {
    // console.log("----jQuery 加载完毕 | Kesa 改版 nexus 工具启动!---");

    /**
     * 获取图片位置
     * @param {*} event 鼠标事件对象
     * @param {*} imgEle 图片元素对象
     * @returns
     */
    function getImgPosition(event, imgEle) {
      // console.log(e, imgEle)

      // 获取图片的原始宽度和高度
      let imgWidth = imgEle.prop("naturalWidth");
      let imgHeight = imgEle.prop("naturalHeight");

      // 计算图片的宽高比
      let ratio = imgWidth / imgHeight;

      // 设置图片的偏移量, 初始为 10
      let offsetX = 0;
      let offsetY = 0;

      // 设置为预览图片默认 or 预览图片尽可能占满屏幕
      if (true) {
      }

      // 计算图片应该显示的宽度和高度，初始值为窗口的宽度和高度减去鼠标事件对象的坐标。
      let width = window.innerWidth - event.clientX;
      let height = window.innerHeight - event.clientY;

      // 设置偏移量是否需要改变的标记，初始值为 0 和 false。
      let changeOffsetY = 0;
      let changeOffsetX = false;

      // 如果鼠标位置在窗口的右半边且图片的右侧会超出窗口边界，
      // 就将偏移量需要改变的标记设置为 true，
      // 并将图片的宽度调整为鼠标事件对象的横坐标。
      if (event.clientX > window.innerWidth / 2 && event.clientX + imgWidth > window.innerWidth) {
        changeOffsetX = true;
        width = event.clientX;
      }

      // 如果鼠标位置在窗口的下半边，且图片的下侧会超出窗口边界，
      // 就将偏移量需要改变的标记设置为 1 或 2，并将图片的高度调整为鼠标事件对象的纵坐标。
      if (event.clientY > window.innerHeight / 2) {
        if (event.clientY + imgHeight / 2 > window.innerHeight) {
          changeOffsetY = 1;
          height = event.clientY;
        } else if (event.clientY + imgHeight > window.innerHeight) {
          changeOffsetY = 2;
          height = event.clientY;
        }
      }

      // let log = `innerWidth: ${window.innerWidth}, innerHeight: ${window.innerHeight}, pageX: ${event.pageX}, pageY: ${event.pageY}, imgWidth: ${imgWidth}, imgHeight: ${imgHeight}, width: ${width}, height: ${height}, offsetX: ${offsetX}, offsetY: ${offsetY}, changeOffsetX: ${changeOffsetX}, changeOffsetY: ${changeOffsetY}`;
      // console.log(log);

      // 如果图片的宽度大于应该显示的宽度，
      // 就将图片的宽度调整为应该显示的宽度，
      // 并根据宽高比计算出新的高度。
      if (imgWidth > width) {
        imgWidth = width;
        imgHeight = imgWidth / ratio;
      }

      // 如果图片的高度大于应该显示的高度，
      // 就将图片的高度调整为应该显示的高度，
      // 并根据宽高比计算出新的宽度。
      if (imgHeight > height) {
        imgHeight = height;
        imgWidth = imgHeight * ratio;
      }

      // 如果偏移量需要改变，
      // 就将偏移量设置为鼠标事件对象横坐标和应该显示的宽度之差再加上 10 的负值。
      if (changeOffsetX) {
        // console.log('X轴反转');
        offsetX = -imgWidth;
      }

      // 如果偏移量需要改变，且需要向上偏移，
      // 则将偏移量设置为图片的高度减去窗口剩余的高度和鼠标事件对象纵坐标之差的负值；
      // 如果需要向上和向下偏移，则将偏移量设置为图片的高度的一半的负值。
      if (changeOffsetY == 1) {
        offsetY = -(imgHeight - (window.innerHeight - event.clientY));
      } else if (changeOffsetY == 2) {
        offsetY = -imgHeight / 2;
      }

      // if (changeOffsetX) { console.log(`imgWidth: ${imgWidth}, imgHeight: ${imgHeight}, offsetX: ${offsetX}, offsetY: ${offsetY}`); }
      // console.log(`changeOffsetY: ${changeOffsetY}`);
      // 返回对象
      return { imgWidth, imgHeight, offsetX, offsetY };
    }

    /** 计算最小容纳比例
     * @param {any} pic
     * @param {any} container
     */
    function getMinRatio(pic, container) {
      return Math.min(container.width / pic.width, container.height / pic.height)
    }

    /**
     * 获取图片位置_Kesa版
     * @param {*} event 鼠标事件对象
     * @param {*} imgEle 图片元素对象
     * @returns
     */
    function previewPosition_Kesa(event, imgEle) {
      // 获取图片的原始宽度和高度
      let imgWidth = imgEle.prop("naturalWidth") ?? 0;
      let imgHeight = imgEle.prop("naturalHeight") ?? 0;


      // 计算图片的宽高比
      let ratio = imgWidth / imgHeight;

      // 设置图片的偏移量, 初始为 10
      let offsetX = 0;
      let offsetY = 0;

      // 获取鼠标位置
      const mouseX = event.clientX;
      const mouseY = event.clientY;
      // 获取视口宽高
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // 定义视口缓冲距离
      const borderY = 10
      const borderX = 10

      // 获取鼠标位置到视口上下左右的距离
      const distanceToTop = mouseY;
      const distanceToBottom = viewportHeight - mouseY;
      const distanceToLeft = mouseX;
      const distanceToRight = viewportWidth - mouseX;

      // 定义size对象
      const picSize = {
        width: imgWidth,
        height: imgHeight
      }
      /** @type {Record<string, any>} */
      const containerSize = {
        bot: {
          width: viewportWidth,
          height: distanceToBottom,
        },
        top: {
          width: viewportWidth,
          height: distanceToTop,
        },
        right: {
          width: distanceToRight,
          height: viewportHeight,
        },
        left: {
          width: distanceToLeft,
          height: viewportHeight,
        },
      }

      /**定义可容纳最大比例 */
      let maxRatio = 0
      /**定义可容纳最大比例的位置 */
      let maxPosition = ''

      for (const key in containerSize) {
        if (Object.hasOwnProperty.call(containerSize, key)) {
          const element = containerSize[key];
          if (getMinRatio(picSize, element) > maxRatio) {
            maxRatio = getMinRatio(picSize, element)
            maxPosition = key
          }
        }
      }

      // console.log(`最大的位置: ${maxPosition}  
      // top: ${getMinRatio(picSize, containerSize['top'])}  
      // bot: ${getMinRatio(picSize, containerSize['bot'])}  
      // left: ${getMinRatio(picSize, containerSize['left'])}  
      // right: ${getMinRatio(picSize, containerSize['right'])}
      // `);



      /** @type {Record<string, any>} */
      const result = {
        top: {
          left: 0,
          top: 0,
          width: viewportWidth,
          height: distanceToTop,
        },
        bot: {
          left: 0,
          top: distanceToTop,
          width: viewportWidth,
          height: distanceToBottom,
        },
        left: {
          left: 0,
          top: 0,
          width: distanceToLeft,
          height: viewportHeight,
        },
        right: {
          left: distanceToLeft,
          top: 0,
          width: distanceToRight,
          height: viewportHeight,
        },
        default: {
          left: 0,
          top: 0,
          width: 0,
          height: 0,
        },
      }

      const container = maxPosition != '' ? result[maxPosition] : result['default']
      return container

      // console.log(
      //   '2_Bottom:', distanceToBottom,
      //   '2_Top:', distanceToTop,
      //   '2_Left:', distanceToLeft,
      //   '2_Right:', distanceToRight
      // )

      // return {
      //   left: event.pageX + position.offsetX,
      //   top: event.pageY + position.offsetY,
      //   width: position.imgWidth,
      //   height: position.imgHeight,
      // };

    }

    /**
     * 获取展示位置
     * @param {*} event
     * @param {*} position
     * @returns
     */
    function getPosition(event, position) {
      return {
        left: event.pageX + position.offsetX,
        top: event.pageY + position.offsetY,
        width: position.imgWidth,
        height: position.imgHeight,
      };
    }

    // -------------preview
    const selector = "img.preview_Kesa";
    /** @type {any} */
    let imgEle;
    let imgPosition;

    // 1. 原始方法: 判断是否有 #nexus-preview, 没有就新建一个
    if (!jQuery("#nexus-preview").length) {
      const _previewDom = document.body.appendChild(document.createElement('img'));
      _previewDom.id = 'nexus-preview';
    }
    const previewEle = jQuery("#nexus-preview");

    // 2. Kesa方法: 判断是否有 #kp_container, 没有就新建一个
    /** 创建 Kesa 预览容器
     * @param {any} color
     */
    function createKesaPreview(color) {
      const parent =
        jQuery('<div>', {
          id: 'kp_container',
          css: {
            backgroundColor: color,
            opacity: 1,
            position: 'fixed',
            zIndex: 20000,
            pointerEvents: 'none',
            transition: 'all .3s'
          }
        });
      parent.append(jQuery('<img>', {
        class: 'kp_img',
        css: {
          position: 'absolute',
          zIndex: 20002,
          pointerEvents: 'none',
          width: '100%',
          height: '100%',
          // 预览大图默认状态: 开启=铺满(contain) 关闭=尽量原图大小(scale-down)
          objectFit: get(_state_hover_pic) ? 'contain' : 'scale-down',
        }
      }))
      parent.append(jQuery('<img>', {
        class: 'kp_img',
        css: {
          position: 'absolute',
          zIndex: 20001,
          pointerEvents: 'none',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: `blur(8px)`
        }
      }))
      return parent
    }

    // const kesa_preview = createKesaPreview('')
    const kesa_preview = (jQuery('#kp_container').length > 0) ? jQuery('#kp_container') : createKesaPreview('')
    jQuery("body").append(kesa_preview)

    // 预览大图默认状态切换: 开启=铺满(contain) 关闭=尽量原图大小(scale-down)
    _state_hover_pic.subscribe(v => {
      /** @type {any} */
      const __im = document.querySelectorAll("#kp_container .kp_img")[0];
      if (__im) __im.style.objectFit = v ? "contain" : "scale-down";
    });

    /** timer 用来搞延迟加载图片的 */
    /** @type {any} */
    let buffer = null;
    // 预览大图方式: 局部悬浮(悬停 .hover-trigger 触发) 或 全图悬浮(悬停整张图触发)
    // 两种目标都要绑定; 局部模式下 .hover-trigger 覆盖在图上(pointer-events:auto), 悬停它即触发, 不会遮挡整图信息
    const triggerSel = "div.hover-trigger";
    /** 从触发元素解析出对应卡片封面图
     * @param {any} el
     */
    function resolvePreviewImg(el) {
      const card = el && el.closest ? el.closest(".card") : null;
      const img = card ? card.querySelector("img.preview_Kesa, img.card-image--img.nexus-lazy-load_Kesa") : null;
      return jQuery(img || el);
    }
    jQuery("body")
      .on("mouseover", selector + "," + triggerSel, /** @this {any} @param {any} e */ function (e) {
        // 局部悬浮模式下仅接受 hover-trigger 触发; 全图模式下仅接受整图触发
        const isTrigger = jQuery(this).is(triggerSel);
        if (get(_preview_style) && !isTrigger) return;
        if (!get(_preview_style) && isTrigger) return;
        imgEle = resolvePreviewImg(this);
        // NOTE: 加一个延迟, 让突然划过去的指针不被大图干扰
        buffer = setTimeout(() => {

          // NOTE: 这里加了个判断是否开启触摸显示大图的 boolean
          if (get(_show_nexus_pic)) {

            imgPosition = getImgPosition(e, imgEle);
            let position = getPosition(e, imgPosition);
            let src = imgEle.attr("src");
            if (src) {
              // FIXME: 2选1: 渐变 or 直接出现消失
              // previewEle.attr("src", src).css(position).fadeIn("fast");
              if (kesa_preview) kesa_preview.find('.kp_img').attr('src', src)
            }

            // kesa_preview.css(previewPosition_Kesa(e, imgEle)).fadeIn('fast')
            kesa_preview.css(previewPosition_Kesa(e, imgEle)).show()
          }
        }, get(_delay_nexus_pic));
      })
      .on("mouseout", selector + "," + triggerSel, /** @param {any} e */ function (e) {
        // FIXME: 2选1: 渐变 or 直接出现消失
        // previewEle.hide();// previewEle.fadeOut();
        kesa_preview.hide();// kesa_preview.fadeOut()

        if (buffer) clearTimeout(buffer)
      })
      .on("mousemove", selector + "," + triggerSel, /** @param {any} e */ function (e) {
        if (!imgEle || !imgEle.length) return;
        imgPosition = getImgPosition(e, imgEle);
        let position = getPosition(e, imgPosition);

        // FIXME: 2选1: 渐变 or 直接出现消失
        // previewEle.css(position);
        kesa_preview.css(previewPosition_Kesa(e, imgEle))
      });

    // -------------lazy load (并发队列: 预热 + 排队 + 超时 + 复用, 兼容各站滚动容器)
    if ("IntersectionObserver" in window) {
      __kesaWatchLazy();
    }
  });
}