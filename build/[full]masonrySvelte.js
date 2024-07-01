// ==UserScript==
// @name            PT种子列表瀑布流视图(Svelte重构)
// @name:en         PT_Masonry_View_Svelte
// @namespace       https://github.com/KesaubeEire/PT_Masonry_View_Svelte
// @version         1.1.13b
// @author          Kesa
// @description     PT种子列表无限下拉瀑布流视图(Svelte重构)
// @description:en  PT Masonry View by Svelte.
// @license         MIT
// @icon            https://avatars.githubusercontent.com/u/23617963
// @match           https://kamept.com/*
// @match           https://kp.m-team.cc/*
// @match           https://xp.m-team.io/*
// @match           https://xp.m-team.cc/*
// @match           https://ap.m-team.cc/*
// @match           https://test2.m-team.cc/*
// @exclude         */offers.php*
// @exclude         */index.php*
// @exclude         */forums.php*
// @exclude         */viewrequests.php*
// @exclude         */seek.php*
// @exclude         *m-team*/detail/*
// @grant           none
// ==/UserScript==

(t=>{const e=document.createElement("style");e.dataset.source="vite-plugin-monkey",e.textContent=t,document.head.append(e)})(' div.waterfall{width:100%;padding-top:20px;padding-bottom:60px;border-radius:20px;height:100%;margin:20px auto;transition:height .3s}div.waterfall_newMT{padding-top:0;padding-bottom:0;margin:10px auto}button.debug{position:fixed;top:10px;right:10px;padding:4px;background-color:#333;color:#fff;border:none;border-radius:5px;cursor:pointer}button#toggle_oldTable{top:10px}button#btnReLayout{top:40px}button#btnSwitchMode{top:70px}button#sort_masonry{top:100px}.pic_error{height:100px;display:flex;justify-content:center;align-items:center}.ant-menu-submenu-popup{z-index:12000}.svelte-zt6zlx.svelte-zt6zlx,.svelte-zt6zlx.svelte-zt6zlx:after,.svelte-zt6zlx.svelte-zt6zlx:before{box-sizing:content-box}.switch.svelte-zt6zlx.svelte-zt6zlx{width:100%;height:30px;display:flex;align-items:center;justify-content:space-between}.s_title.svelte-zt6zlx.svelte-zt6zlx{display:flex;align-items:center;font-size:14px;position:relative}.title_green.svelte-zt6zlx.svelte-zt6zlx{color:green;font-weight:800}.title_red.svelte-zt6zlx.svelte-zt6zlx{color:red;font-weight:800}.s_title.svelte-zt6zlx:has(.hint):hover ._hint.svelte-zt6zlx{display:block}._hint.svelte-zt6zlx.svelte-zt6zlx{display:none;position:absolute;bottom:28px;left:0;width:max-content;height:auto;background-color:#fff;border:1px solid black;border-radius:8px;padding:4px 8px;box-sizing:content-box;z-index:1}input[type=checkbox].svelte-zt6zlx.svelte-zt6zlx{width:0px;height:0px;display:none;visibility:hidden}label.svelte-zt6zlx.svelte-zt6zlx{width:48px;height:12px;display:inline-block;position:relative;background-color:#777;border:2px solid #555;border-radius:30px;transition:all .2s}label.svelte-zt6zlx.svelte-zt6zlx:after{content:"";display:block;width:24px;height:24px;background-color:#555;position:absolute;border-radius:50%;left:-2px;top:-6px;transition:transform .2s}input[type=checkbox].svelte-zt6zlx:checked~label.svelte-zt6zlx{background-color:#00a0fc;border-color:#006dc9}input[type=checkbox].svelte-zt6zlx:checked~label.svelte-zt6zlx:after{background-color:#0054b0;transform:translate(28px)}.sideP.svelte-gqty0r.svelte-gqty0r{position:fixed;opacity:.4;margin:4px 2px;border-radius:8px;overflow:hidden;z-index:40000;border:2px solid transparent}.sideP.svelte-gqty0r.svelte-gqty0r:hover{opacity:1;border:2px solid yellow}.sideP__title.svelte-gqty0r.svelte-gqty0r{width:100%;height:8px;background-color:#ff0}.sideP__title.svelte-gqty0r.svelte-gqty0r:hover{cursor:move}.sideP__out.svelte-gqty0r.svelte-gqty0r{display:flex;flex-direction:column}.sideP__btn.svelte-gqty0r.svelte-gqty0r{width:72px;font-size:14px;background-color:gray;color:#fff;padding:4px 8px;margin:4px;border-radius:8px;cursor:pointer;border:none}.sideP__btn.svelte-gqty0r.svelte-gqty0r:hover{background-color:#6531ff}.configP.svelte-gqty0r.svelte-gqty0r{position:fixed;left:0;top:0;width:100vw;height:100vh;padding:0;margin:0;z-index:50000;color:#000;background-color:#0003}.configP_holder.svelte-gqty0r.svelte-gqty0r{box-sizing:content-box;position:absolute;right:20px;top:20px;overflow-y:scroll;width:360px;max-height:calc(100vh - 40px);padding:0;margin:0;border-radius:24px;border:2px solid black;background-color:#d4e7ff}.configP_holder.svelte-gqty0r.svelte-gqty0r::-webkit-scrollbar{display:none}.configP_title.svelte-gqty0r.svelte-gqty0r{position:fixed;box-sizing:border-box;width:inherit;display:flex;justify-content:space-between;align-items:center;height:40px;padding:0 10px;border-top-left-radius:24px;border-top-right-radius:24px;border-bottom:2px solid black;background-color:#9ac6ff;z-index:2}.configP_title.svelte-gqty0r.svelte-gqty0r p{font-size:18px;font-weight:500}.configP_title.svelte-gqty0r.svelte-gqty0r button{border:none;padding:0;margin:0;background-color:transparent}.section.svelte-gqty0r.svelte-gqty0r{margin:16px 18px}.section.svelte-gqty0r.svelte-gqty0r button{border-radius:10px;margin:4px;padding:12px 16px}.section.svelte-gqty0r.svelte-gqty0r .s_title{text-align:center}.section.svelte-gqty0r.svelte-gqty0r .s_panel{display:flex;flex-direction:column;justify-content:space-evenly;align-items:center}.section.svelte-gqty0r.svelte-gqty0r .s_checkbox{padding:12px;margin:4px;border-radius:10px;border:1px solid black;font-size:14px;display:flex;align-items:center}.section.svelte-gqty0r.svelte-gqty0r h1{font-size:14pt}.configP_holder.svelte-gqty0r .section.svelte-gqty0r:nth-child(2){margin-top:48px}#reset_panel_pos.svelte-gqty0r.svelte-gqty0r{width:100%;text-align:center;border:1px solid black;border-radius:16px}.card.svelte-1d0ss3t.svelte-1d0ss3t{border:1px solid rgba(255,255,255,.5);border-radius:16px;margin:6px 0;overflow:hidden;cursor:pointer;box-shadow:#0000004d 3px 3px,#0000001a -1px -1px;transition:box-shadow .2s}.card.svelte-1d0ss3t.svelte-1d0ss3t:hover{box-shadow:#7300ff4d 5px 5px,#0000001a -1px -1px}.card-title.svelte-1d0ss3t.svelte-1d0ss3t{padding:2px 0}.card-holder.svelte-1d0ss3t.svelte-1d0ss3t{background-color:#ffffff80;background:linear-gradient(to bottom,rgba(255,255,255,.4),rgba(255,255,255,0))}.card-category.svelte-1d0ss3t.svelte-1d0ss3t{text-align:center;letter-spacing:2px;font-weight:700}.card-line.svelte-1d0ss3t.svelte-1d0ss3t{margin-top:1px;margin-bottom:1px;display:flex;justify-content:space-evenly;align-items:center;height:20px}.two-lines.svelte-1d0ss3t.svelte-1d0ss3t{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;transition:color .3s}.two-lines.svelte-1d0ss3t.svelte-1d0ss3t:hover{-webkit-line-clamp:100}.cl-center.svelte-1d0ss3t.svelte-1d0ss3t{display:flex;justify-content:space-evenly;align-items:center}.cl-tags.svelte-1d0ss3t.svelte-1d0ss3t{display:flex;justify-content:left;align-items:center;flex-wrap:wrap;gap:2px;transform:translate(4px)}.cl-tags.svelte-1d0ss3t.svelte-1d0ss3t:has(span){padding-top:2px}.card-details.svelte-1d0ss3t.svelte-1d0ss3t{display:flex;justify-content:center;align-items:center;flex-direction:column}.card-image.svelte-1d0ss3t.svelte-1d0ss3t{height:100%;position:relative}.card-image.svelte-1d0ss3t img.svelte-1d0ss3t{width:100%;object-fit:cover;margin-bottom:-3px}.card-alter.svelte-1d0ss3t.svelte-1d0ss3t{text-align:center;height:20px;display:flex;justify-content:center;align-items:center}.top_and_free.svelte-1d0ss3t.svelte-1d0ss3t{padding:2px;border-radius:4px;margin-bottom:2px;display:flex;justify-content:center;align-items:center;line-height:11px;height:11px;font-size:10px}._Free.svelte-1d0ss3t.svelte-1d0ss3t{color:#00f}._2XFree.svelte-1d0ss3t.svelte-1d0ss3t{color:green}.card-description.svelte-1d0ss3t.svelte-1d0ss3t{padding-left:4px;padding-right:4px}.card-index.svelte-1d0ss3t.svelte-1d0ss3t{position:absolute;top:0;left:0;padding-right:9px;padding-left:2px;margin:0;height:20px;line-height:16px;font-size:16px;background-color:#000;color:#ff0;border-top-right-radius:100px;border-bottom-right-radius:100px;display:flex;align-items:center;pointer-events:none}.hover-trigger.svelte-1d0ss3t.svelte-1d0ss3t{position:absolute;top:8px;right:8px;padding:0;width:42px;margin:0;height:40px;line-height:16px;font-size:16px;opacity:.75;border-radius:9999px;display:flex;align-items:center}.hover-trigger.svelte-1d0ss3t.svelte-1d0ss3t:hover{opacity:1}.btnCollet.svelte-1d0ss3t.svelte-1d0ss3t{padding:1px 2px;cursor:pointer}.hot.svelte-1d0ss3t.svelte-1d0ss3t,.new.svelte-1d0ss3t.svelte-1d0ss3t{padding:0 2px;border-radius:8px;background:white;margin:2px}#turnPage.svelte-kydsmq{width:100%;height:32px;border-radius:16px;line-height:20px;font-size:14px;position:absolute;bottom:0px}#_turnPage.svelte-1gtc1kh{width:100%;height:34px;border-radius:12px;line-height:20px;font-size:16px;margin:0;padding:0 10px}.card-category.svelte-rhfb99.svelte-rhfb99{height:18px;padding:0 2px;border:1px;background:black;color:#fff;font-weight:900;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;display:flex;align-items:center;justify-content:center}.card_category-img.svelte-rhfb99.svelte-rhfb99{height:32px;background-size:100% 141%;background-position:center top;padding-top:6px}.card.svelte-rhfb99.svelte-rhfb99{border:2px solid;border-radius:16px;margin:6px 0;overflow:hidden;box-shadow:#0000004d 0 6px,#0000001a -1px -1px;transition:box-shadow .2s}.card-title.svelte-rhfb99.svelte-rhfb99{padding:2px 0}.card-holder.svelte-rhfb99.svelte-rhfb99{background-color:#ffffff80}.card-line.svelte-rhfb99.svelte-rhfb99{margin-top:1px;margin-bottom:2px;display:flex;justify-content:space-evenly;align-items:center;height:20px}.two-lines.svelte-rhfb99.svelte-rhfb99{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;transition:color .3s;color:#000}.two-lines.svelte-rhfb99.svelte-rhfb99:hover{-webkit-line-clamp:100}.cl-center.svelte-rhfb99.svelte-rhfb99{display:flex;justify-content:space-evenly;align-items:center}.cl-tags.svelte-rhfb99.svelte-rhfb99{display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:2px;padding-top:4px;padding-bottom:4px}.icon_holder.svelte-rhfb99.svelte-rhfb99{border-color:#2f4879;border-radius:100px;height:20px;width:20px;display:inline-flex;align-items:center;justify-content:center}.cl-btn.svelte-rhfb99.svelte-rhfb99{display:flex;justify-content:center;align-items:center;padding:1px 6px;border-radius:8px;background-color:#edf3ff}._tag.svelte-rhfb99.svelte-rhfb99{height:1.3em;line-height:1.3em;padding:0 .5em;border-radius:6px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji"}._tag_diy.svelte-rhfb99.svelte-rhfb99{color:#fff;background-color:#5abd48}._tag_dub.svelte-rhfb99.svelte-rhfb99{color:#fff;background-color:#5a3b14}._tag_sub.svelte-rhfb99.svelte-rhfb99{color:#fff;background-color:#3b4a7f}._tag_discount_50.svelte-rhfb99.svelte-rhfb99{background-color:#f50;color:#fff}._tag_discount_free.svelte-rhfb99.svelte-rhfb99{background-color:#108ee9;color:#fff}.card-details.svelte-rhfb99.svelte-rhfb99{display:flex;justify-content:center;align-items:center;flex-direction:column}.card-image.svelte-rhfb99.svelte-rhfb99{height:100%;position:relative}.card-image.svelte-rhfb99 img.svelte-rhfb99{width:100%;object-fit:cover}.card-description.svelte-rhfb99.svelte-rhfb99{padding:2px 4px}.card-description.svelte-rhfb99 a.svelte-rhfb99,.card-description.svelte-rhfb99 a.svelte-rhfb99:hover{color:#000}.card-index.svelte-rhfb99.svelte-rhfb99{position:absolute;top:0;left:0;padding-right:9px;padding-left:2px;margin:0;height:20px;line-height:16px;font-size:16px;background-color:#000;color:#ff0;border-top-right-radius:100px;border-bottom-right-radius:100px;display:flex;align-items:center;pointer-events:none}.hover-trigger.svelte-rhfb99.svelte-rhfb99{position:absolute;top:8px;right:8px;padding:0;width:42px;margin:0;height:40px;line-height:16px;font-size:16px;opacity:.75;border-radius:9999px;display:flex;align-items:center}.hover-trigger.svelte-rhfb99.svelte-rhfb99:hover{opacity:1}.masonry_Holder_unload_1st.svelte-11rmzun{height:96px;background:grey;position:relative}.masonry_Holder_loaded_1st.svelte-11rmzun{position:unset;background:transparent;padding:0}.masonry_Holder_unloaded.svelte-11rmzun{position:unset;background:transparent}.masonry_Holder_loaded.svelte-11rmzun{position:relative;background:transparent}.loading_Holder.svelte-11rmzun{background-color:#bccad6;position:absolute;width:100%;height:100%;z-index:10001;border-radius:8px;display:flex;justify-content:center}.loading_SubHolder.svelte-11rmzun{position:relative;padding:40px 0}.loading_Text.svelte-11rmzun{position:sticky;top:40px}div#_iframe.svelte-1exar3b.svelte-1exar3b{position:fixed;top:0;left:0;width:100vw;height:100vh;background-color:#0026269b;z-index:30000;display:flex}div._iframe.svelte-1exar3b.svelte-1exar3b{height:96%;margin:auto;position:relative}div._iframe.svelte-1exar3b iframe.svelte-1exar3b{height:100%;border-radius:20px}._iframeCloseBtn.svelte-1exar3b.svelte-1exar3b{width:40px;height:40px;background:white;position:absolute;top:10px;right:10px;border-radius:40px;transition:all .5s}._iframeCloseBtn.svelte-1exar3b.svelte-1exar3b:hover{opacity:.7;transform:scale(1.2)}._iframeCloseBtn.svelte-1exar3b.svelte-1exar3b:active{opacity:.9;transform:scale(1.9)} ');

(function () {
  'use strict';

  function noop() {
  }
  const identity = (x) => x;
  function assign(tar, src) {
    for (const k in src)
      tar[k] = src[k];
    return tar;
  }
  function is_promise(value) {
    return !!value && (typeof value === "object" || typeof value === "function") && typeof value.then === "function";
  }
  function run(fn) {
    return fn();
  }
  function blank_object() {
    return /* @__PURE__ */ Object.create(null);
  }
  function run_all(fns) {
    fns.forEach(run);
  }
  function is_function(thing) {
    return typeof thing === "function";
  }
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
  }
  let src_url_equal_anchor;
  function src_url_equal(element_src, url) {
    if (!src_url_equal_anchor) {
      src_url_equal_anchor = document.createElement("a");
    }
    src_url_equal_anchor.href = url;
    return element_src === src_url_equal_anchor.href;
  }
  function is_empty(obj) {
    return Object.keys(obj).length === 0;
  }
  function subscribe(store, ...callbacks) {
    if (store == null) {
      return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
  }
  function get_store_value(store) {
    let value;
    subscribe(store, (_) => value = _)();
    return value;
  }
  function component_subscribe(component, store, callback) {
    component.$$.on_destroy.push(subscribe(store, callback));
  }
  function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
      const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
      return definition[0](slot_ctx);
    }
  }
  function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
  }
  function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
      const lets = definition[2](fn(dirty));
      if ($$scope.dirty === void 0) {
        return lets;
      }
      if (typeof lets === "object") {
        const merged = [];
        const len = Math.max($$scope.dirty.length, lets.length);
        for (let i = 0; i < len; i += 1) {
          merged[i] = $$scope.dirty[i] | lets[i];
        }
        return merged;
      }
      return $$scope.dirty | lets;
    }
    return $$scope.dirty;
  }
  function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
    if (slot_changes) {
      const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
      slot.p(slot_context, slot_changes);
    }
  }
  function get_all_dirty_from_scope($$scope) {
    if ($$scope.ctx.length > 32) {
      const dirty = [];
      const length = $$scope.ctx.length / 32;
      for (let i = 0; i < length; i++) {
        dirty[i] = -1;
      }
      return dirty;
    }
    return -1;
  }
  function set_store_value(store, ret, value) {
    store.set(value);
    return ret;
  }
  const is_client = typeof window !== "undefined";
  let now = is_client ? () => window.performance.now() : () => Date.now();
  let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
  const tasks = /* @__PURE__ */ new Set();
  function run_tasks(now2) {
    tasks.forEach((task) => {
      if (!task.c(now2)) {
        tasks.delete(task);
        task.f();
      }
    });
    if (tasks.size !== 0)
      raf(run_tasks);
  }
  function loop(callback) {
    let task;
    if (tasks.size === 0)
      raf(run_tasks);
    return {
      promise: new Promise((fulfill) => {
        tasks.add(task = { c: callback, f: fulfill });
      }),
      abort() {
        tasks.delete(task);
      }
    };
  }
  const globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
  function append(target, node) {
    target.appendChild(node);
  }
  function get_root_for_style(node) {
    if (!node)
      return document;
    const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
    if (root && root.host) {
      return root;
    }
    return node.ownerDocument;
  }
  function append_empty_stylesheet(node) {
    const style_element = element("style");
    append_stylesheet(get_root_for_style(node), style_element);
    return style_element.sheet;
  }
  function append_stylesheet(node, style) {
    append(node.head || node, style);
    return style.sheet;
  }
  function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
  }
  function detach(node) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }
  function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
      if (iterations[i])
        iterations[i].d(detaching);
    }
  }
  function element(name) {
    return document.createElement(name);
  }
  function svg_element(name) {
    return document.createElementNS("http://www.w3.org/2000/svg", name);
  }
  function text(data) {
    return document.createTextNode(data);
  }
  function space() {
    return text(" ");
  }
  function empty() {
    return text("");
  }
  function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
  }
  function self(fn) {
    return function(event) {
      if (event.target === this)
        fn.call(this, event);
    };
  }
  function attr(node, attribute, value) {
    if (value == null)
      node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
      node.setAttribute(attribute, value);
  }
  function to_number(value) {
    return value === "" ? null : +value;
  }
  function children(element2) {
    return Array.from(element2.childNodes);
  }
  function set_data(text2, data) {
    data = "" + data;
    if (text2.data === data)
      return;
    text2.data = data;
  }
  function set_input_value(input, value) {
    input.value = value == null ? "" : value;
  }
  function set_style(node, key, value, important) {
    if (value == null) {
      node.style.removeProperty(key);
    } else {
      node.style.setProperty(key, value, important ? "important" : "");
    }
  }
  function toggle_class(element2, name, toggle) {
    element2.classList[toggle ? "add" : "remove"](name);
  }
  function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
    const e = document.createEvent("CustomEvent");
    e.initCustomEvent(type, bubbles, cancelable, detail);
    return e;
  }
  class HtmlTag {
    constructor(is_svg = false) {
      this.is_svg = false;
      this.is_svg = is_svg;
      this.e = this.n = null;
    }
    c(html) {
      this.h(html);
    }
    m(html, target, anchor = null) {
      if (!this.e) {
        if (this.is_svg)
          this.e = svg_element(target.nodeName);
        else
          this.e = element(target.nodeType === 11 ? "TEMPLATE" : target.nodeName);
        this.t = target.tagName !== "TEMPLATE" ? target : target.content;
        this.c(html);
      }
      this.i(anchor);
    }
    h(html) {
      this.e.innerHTML = html;
      this.n = Array.from(this.e.nodeName === "TEMPLATE" ? this.e.content.childNodes : this.e.childNodes);
    }
    i(anchor) {
      for (let i = 0; i < this.n.length; i += 1) {
        insert(this.t, this.n[i], anchor);
      }
    }
    p(html) {
      this.d();
      this.h(html);
      this.i(this.a);
    }
    d() {
      this.n.forEach(detach);
    }
  }
  const managed_styles = /* @__PURE__ */ new Map();
  let active = 0;
  function hash(str) {
    let hash2 = 5381;
    let i = str.length;
    while (i--)
      hash2 = (hash2 << 5) - hash2 ^ str.charCodeAt(i);
    return hash2 >>> 0;
  }
  function create_style_information(doc, node) {
    const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
    managed_styles.set(doc, info);
    return info;
  }
  function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
    const step = 16.666 / duration;
    let keyframes = "{\n";
    for (let p = 0; p <= 1; p += step) {
      const t = a + (b - a) * ease(p);
      keyframes += p * 100 + `%{${fn(t, 1 - t)}}
`;
    }
    const rule = keyframes + `100% {${fn(b, 1 - b)}}
}`;
    const name = `__svelte_${hash(rule)}_${uid}`;
    const doc = get_root_for_style(node);
    const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
    if (!rules[name]) {
      rules[name] = true;
      stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
    }
    const animation = node.style.animation || "";
    node.style.animation = `${animation ? `${animation}, ` : ""}${name} ${duration}ms linear ${delay}ms 1 both`;
    active += 1;
    return name;
  }
  function delete_rule(node, name) {
    const previous = (node.style.animation || "").split(", ");
    const next = previous.filter(
      name ? (anim) => anim.indexOf(name) < 0 : (anim) => anim.indexOf("__svelte") === -1
      // remove all Svelte animations
    );
    const deleted = previous.length - next.length;
    if (deleted) {
      node.style.animation = next.join(", ");
      active -= deleted;
      if (!active)
        clear_rules();
    }
  }
  function clear_rules() {
    raf(() => {
      if (active)
        return;
      managed_styles.forEach((info) => {
        const { ownerNode } = info.stylesheet;
        if (ownerNode)
          detach(ownerNode);
      });
      managed_styles.clear();
    });
  }
  let current_component;
  function set_current_component(component) {
    current_component = component;
  }
  function get_current_component() {
    if (!current_component)
      throw new Error("Function called outside component initialization");
    return current_component;
  }
  function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
  }
  function afterUpdate(fn) {
    get_current_component().$$.after_update.push(fn);
  }
  function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
  }
  const dirty_components = [];
  const binding_callbacks = [];
  let render_callbacks = [];
  const flush_callbacks = [];
  const resolved_promise = /* @__PURE__ */ Promise.resolve();
  let update_scheduled = false;
  function schedule_update() {
    if (!update_scheduled) {
      update_scheduled = true;
      resolved_promise.then(flush);
    }
  }
  function add_render_callback(fn) {
    render_callbacks.push(fn);
  }
  function add_flush_callback(fn) {
    flush_callbacks.push(fn);
  }
  const seen_callbacks = /* @__PURE__ */ new Set();
  let flushidx = 0;
  function flush() {
    if (flushidx !== 0) {
      return;
    }
    const saved_component = current_component;
    do {
      try {
        while (flushidx < dirty_components.length) {
          const component = dirty_components[flushidx];
          flushidx++;
          set_current_component(component);
          update(component.$$);
        }
      } catch (e) {
        dirty_components.length = 0;
        flushidx = 0;
        throw e;
      }
      set_current_component(null);
      dirty_components.length = 0;
      flushidx = 0;
      while (binding_callbacks.length)
        binding_callbacks.pop()();
      for (let i = 0; i < render_callbacks.length; i += 1) {
        const callback = render_callbacks[i];
        if (!seen_callbacks.has(callback)) {
          seen_callbacks.add(callback);
          callback();
        }
      }
      render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
      flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
  }
  function update($$) {
    if ($$.fragment !== null) {
      $$.update();
      run_all($$.before_update);
      const dirty = $$.dirty;
      $$.dirty = [-1];
      $$.fragment && $$.fragment.p($$.ctx, dirty);
      $$.after_update.forEach(add_render_callback);
    }
  }
  function flush_render_callbacks(fns) {
    const filtered = [];
    const targets = [];
    render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
    targets.forEach((c) => c());
    render_callbacks = filtered;
  }
  let promise;
  function wait() {
    if (!promise) {
      promise = Promise.resolve();
      promise.then(() => {
        promise = null;
      });
    }
    return promise;
  }
  function dispatch(node, direction, kind) {
    node.dispatchEvent(custom_event(`${direction ? "intro" : "outro"}${kind}`));
  }
  const outroing = /* @__PURE__ */ new Set();
  let outros;
  function group_outros() {
    outros = {
      r: 0,
      c: [],
      p: outros
      // parent group
    };
  }
  function check_outros() {
    if (!outros.r) {
      run_all(outros.c);
    }
    outros = outros.p;
  }
  function transition_in(block, local) {
    if (block && block.i) {
      outroing.delete(block);
      block.i(local);
    }
  }
  function transition_out(block, local, detach2, callback) {
    if (block && block.o) {
      if (outroing.has(block))
        return;
      outroing.add(block);
      outros.c.push(() => {
        outroing.delete(block);
        if (callback) {
          if (detach2)
            block.d(1);
          callback();
        }
      });
      block.o(local);
    } else if (callback) {
      callback();
    }
  }
  const null_transition = { duration: 0 };
  function create_bidirectional_transition(node, fn, params, intro) {
    const options = { direction: "both" };
    let config = fn(node, params, options);
    let t = intro ? 0 : 1;
    let running_program = null;
    let pending_program = null;
    let animation_name = null;
    function clear_animation() {
      if (animation_name)
        delete_rule(node, animation_name);
    }
    function init2(program, duration) {
      const d = program.b - t;
      duration *= Math.abs(d);
      return {
        a: t,
        b: program.b,
        d,
        duration,
        start: program.start,
        end: program.start + duration,
        group: program.group
      };
    }
    function go(b) {
      const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
      const program = {
        start: now() + delay,
        b
      };
      if (!b) {
        program.group = outros;
        outros.r += 1;
      }
      if (running_program || pending_program) {
        pending_program = program;
      } else {
        if (css) {
          clear_animation();
          animation_name = create_rule(node, t, b, duration, delay, easing, css);
        }
        if (b)
          tick(0, 1);
        running_program = init2(program, duration);
        add_render_callback(() => dispatch(node, b, "start"));
        loop((now2) => {
          if (pending_program && now2 > pending_program.start) {
            running_program = init2(pending_program, duration);
            pending_program = null;
            dispatch(node, running_program.b, "start");
            if (css) {
              clear_animation();
              animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
            }
          }
          if (running_program) {
            if (now2 >= running_program.end) {
              tick(t = running_program.b, 1 - t);
              dispatch(node, running_program.b, "end");
              if (!pending_program) {
                if (running_program.b) {
                  clear_animation();
                } else {
                  if (!--running_program.group.r)
                    run_all(running_program.group.c);
                }
              }
              running_program = null;
            } else if (now2 >= running_program.start) {
              const p = now2 - running_program.start;
              t = running_program.a + running_program.d * easing(p / running_program.duration);
              tick(t, 1 - t);
            }
          }
          return !!(running_program || pending_program);
        });
      }
    }
    return {
      run(b) {
        if (is_function(config)) {
          wait().then(() => {
            config = config(options);
            go(b);
          });
        } else {
          go(b);
        }
      },
      end() {
        clear_animation();
        running_program = pending_program = null;
      }
    };
  }
  function handle_promise(promise2, info) {
    const token = info.token = {};
    function update2(type, index, key, value) {
      if (info.token !== token)
        return;
      info.resolved = value;
      let child_ctx = info.ctx;
      if (key !== void 0) {
        child_ctx = child_ctx.slice();
        child_ctx[key] = value;
      }
      const block = type && (info.current = type)(child_ctx);
      let needs_flush = false;
      if (info.block) {
        if (info.blocks) {
          info.blocks.forEach((block2, i) => {
            if (i !== index && block2) {
              group_outros();
              transition_out(block2, 1, 1, () => {
                if (info.blocks[i] === block2) {
                  info.blocks[i] = null;
                }
              });
              check_outros();
            }
          });
        } else {
          info.block.d(1);
        }
        block.c();
        transition_in(block, 1);
        block.m(info.mount(), info.anchor);
        needs_flush = true;
      }
      info.block = block;
      if (info.blocks)
        info.blocks[index] = block;
      if (needs_flush) {
        flush();
      }
    }
    if (is_promise(promise2)) {
      const current_component2 = get_current_component();
      promise2.then((value) => {
        set_current_component(current_component2);
        update2(info.then, 1, info.value, value);
        set_current_component(null);
      }, (error) => {
        set_current_component(current_component2);
        update2(info.catch, 2, info.error, error);
        set_current_component(null);
        if (!info.hasCatch) {
          throw error;
        }
      });
      if (info.current !== info.pending) {
        update2(info.pending, 0);
        return true;
      }
    } else {
      if (info.current !== info.then) {
        update2(info.then, 1, info.value, promise2);
        return true;
      }
      info.resolved = promise2;
    }
  }
  function update_await_block_branch(info, ctx, dirty) {
    const child_ctx = ctx.slice();
    const { resolved } = info;
    if (info.current === info.then) {
      child_ctx[info.value] = resolved;
    }
    if (info.current === info.catch) {
      child_ctx[info.error] = resolved;
    }
    info.block.p(child_ctx, dirty);
  }
  function outro_and_destroy_block(block, lookup) {
    transition_out(block, 1, 1, () => {
      lookup.delete(block.key);
    });
  }
  function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block2, next, get_context) {
    let o = old_blocks.length;
    let n = list.length;
    let i = o;
    const old_indexes = {};
    while (i--)
      old_indexes[old_blocks[i].key] = i;
    const new_blocks = [];
    const new_lookup = /* @__PURE__ */ new Map();
    const deltas = /* @__PURE__ */ new Map();
    const updates = [];
    i = n;
    while (i--) {
      const child_ctx = get_context(ctx, list, i);
      const key = get_key(child_ctx);
      let block = lookup.get(key);
      if (!block) {
        block = create_each_block2(key, child_ctx);
        block.c();
      } else if (dynamic) {
        updates.push(() => block.p(child_ctx, dirty));
      }
      new_lookup.set(key, new_blocks[i] = block);
      if (key in old_indexes)
        deltas.set(key, Math.abs(i - old_indexes[key]));
    }
    const will_move = /* @__PURE__ */ new Set();
    const did_move = /* @__PURE__ */ new Set();
    function insert2(block) {
      transition_in(block, 1);
      block.m(node, next);
      lookup.set(block.key, block);
      next = block.first;
      n--;
    }
    while (o && n) {
      const new_block = new_blocks[n - 1];
      const old_block = old_blocks[o - 1];
      const new_key = new_block.key;
      const old_key = old_block.key;
      if (new_block === old_block) {
        next = new_block.first;
        o--;
        n--;
      } else if (!new_lookup.has(old_key)) {
        destroy(old_block, lookup);
        o--;
      } else if (!lookup.has(new_key) || will_move.has(new_key)) {
        insert2(new_block);
      } else if (did_move.has(old_key)) {
        o--;
      } else if (deltas.get(new_key) > deltas.get(old_key)) {
        did_move.add(new_key);
        insert2(new_block);
      } else {
        will_move.add(old_key);
        o--;
      }
    }
    while (o--) {
      const old_block = old_blocks[o];
      if (!new_lookup.has(old_block.key))
        destroy(old_block, lookup);
    }
    while (n)
      insert2(new_blocks[n - 1]);
    run_all(updates);
    return new_blocks;
  }
  function bind(component, name, callback) {
    const index = component.$$.props[name];
    if (index !== void 0) {
      component.$$.bound[index] = callback;
      callback(component.$$.ctx[index]);
    }
  }
  function create_component(block) {
    block && block.c();
  }
  function mount_component(component, target, anchor, customElement) {
    const { fragment, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
      add_render_callback(() => {
        const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
        if (component.$$.on_destroy) {
          component.$$.on_destroy.push(...new_on_destroy);
        } else {
          run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
      });
    }
    after_update.forEach(add_render_callback);
  }
  function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
      flush_render_callbacks($$.after_update);
      run_all($$.on_destroy);
      $$.fragment && $$.fragment.d(detaching);
      $$.on_destroy = $$.fragment = null;
      $$.ctx = [];
    }
  }
  function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
      dirty_components.push(component);
      schedule_update();
      component.$$.dirty.fill(0);
    }
    component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
  }
  function init(component, options, instance2, create_fragment2, not_equal, props, append_styles, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
      fragment: null,
      ctx: [],
      // state
      props,
      update: noop,
      not_equal,
      bound: blank_object(),
      // lifecycle
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
      // everything else
      callbacks: blank_object(),
      dirty,
      skip_bound: false,
      root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
      const value = rest.length ? rest[0] : ret;
      if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
        if (!$$.skip_bound && $$.bound[i])
          $$.bound[i](value);
        if (ready)
          make_dirty(component, i);
      }
      return ret;
    }) : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
    if (options.target) {
      if (options.hydrate) {
        const nodes = children(options.target);
        $$.fragment && $$.fragment.l(nodes);
        nodes.forEach(detach);
      } else {
        $$.fragment && $$.fragment.c();
      }
      if (options.intro)
        transition_in(component.$$.fragment);
      mount_component(component, options.target, options.anchor, options.customElement);
      flush();
    }
    set_current_component(parent_component);
  }
  class SvelteComponent {
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
    $on(type, callback) {
      if (!is_function(callback)) {
        return noop;
      }
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1)
          callbacks.splice(index, 1);
      };
    }
    $set($$props) {
      if (this.$$set && !is_empty($$props)) {
        this.$$.skip_bound = true;
        this.$$set($$props);
        this.$$.skip_bound = false;
      }
    }
  }
  /*!
   * Masonry PACKAGED v4.2.2
   * Cascading grid layout library
   * https://masonry.desandro.com
   * MIT License
   * by David DeSandro
   */
  (function(window2, factory8) {
    if (typeof define == "function" && define.amd) {
      define("jquery-bridget/jquery-bridget", ["jquery"], function(jQuery) {
        return factory8(window2, jQuery);
      });
    } else {
      window2.jQueryBridget = factory8(
        window2,
        window2.jQuery
      );
    }
  })(window, function factory(window2, jQuery) {
    var arraySlice = Array.prototype.slice;
    var console2 = window2.console;
    var logError = typeof console2 == "undefined" ? function() {
    } : function(message) {
      console2.error(message);
    };
    function jQueryBridget(namespace, PluginClass, $) {
      $ = $ || jQuery || window2.jQuery;
      if (!$) {
        return;
      }
      if (!PluginClass.prototype.option) {
        PluginClass.prototype.option = function(opts) {
          if (!$.isPlainObject(opts)) {
            return;
          }
          this.options = $.extend(true, this.options, opts);
        };
      }
      $.fn[namespace] = function(arg0) {
        if (typeof arg0 == "string") {
          var args = arraySlice.call(arguments, 1);
          return methodCall(this, arg0, args);
        }
        plainCall(this, arg0);
        return this;
      };
      function methodCall($elems, methodName, args) {
        var returnValue;
        var pluginMethodStr = "$()." + namespace + '("' + methodName + '")';
        $elems.each(function(i, elem) {
          var instance2 = $.data(elem, namespace);
          if (!instance2) {
            logError(namespace + " not initialized. Cannot call methods, i.e. " + pluginMethodStr);
            return;
          }
          var method = instance2[methodName];
          if (!method || methodName.charAt(0) == "_") {
            logError(pluginMethodStr + " is not a valid method");
            return;
          }
          var value = method.apply(instance2, args);
          returnValue = returnValue === void 0 ? value : returnValue;
        });
        return returnValue !== void 0 ? returnValue : $elems;
      }
      function plainCall($elems, options) {
        $elems.each(function(i, elem) {
          var instance2 = $.data(elem, namespace);
          if (instance2) {
            instance2.option(options);
            instance2._init();
          } else {
            instance2 = new PluginClass(elem, options);
            $.data(elem, namespace, instance2);
          }
        });
      }
      updateJQuery($);
    }
    function updateJQuery($) {
      if (!$ || $ && $.bridget) {
        return;
      }
      $.bridget = jQueryBridget;
    }
    updateJQuery(jQuery || window2.jQuery);
    return jQueryBridget;
  });
  (function(global2, factory8) {
    if (typeof define == "function" && define.amd) {
      define("ev-emitter/ev-emitter", factory8);
    } else {
      global2.EvEmitter = factory8();
    }
  })(typeof window != "undefined" ? window : globalThis, function() {
    function EvEmitter() {
    }
    var proto = EvEmitter.prototype;
    proto.on = function(eventName, listener) {
      if (!eventName || !listener) {
        return;
      }
      var events = this._events = this._events || {};
      var listeners = events[eventName] = events[eventName] || [];
      if (listeners.indexOf(listener) == -1) {
        listeners.push(listener);
      }
      return this;
    };
    proto.once = function(eventName, listener) {
      if (!eventName || !listener) {
        return;
      }
      this.on(eventName, listener);
      var onceEvents = this._onceEvents = this._onceEvents || {};
      var onceListeners = onceEvents[eventName] = onceEvents[eventName] || {};
      onceListeners[listener] = true;
      return this;
    };
    proto.off = function(eventName, listener) {
      var listeners = this._events && this._events[eventName];
      if (!listeners || !listeners.length) {
        return;
      }
      var index = listeners.indexOf(listener);
      if (index != -1) {
        listeners.splice(index, 1);
      }
      return this;
    };
    proto.emitEvent = function(eventName, args) {
      var listeners = this._events && this._events[eventName];
      if (!listeners || !listeners.length) {
        return;
      }
      listeners = listeners.slice(0);
      args = args || [];
      var onceListeners = this._onceEvents && this._onceEvents[eventName];
      for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i];
        var isOnce = onceListeners && onceListeners[listener];
        if (isOnce) {
          this.off(eventName, listener);
          delete onceListeners[listener];
        }
        listener.apply(this, args);
      }
      return this;
    };
    proto.allOff = function() {
      delete this._events;
      delete this._onceEvents;
    };
    return EvEmitter;
  });
  /*!
   * getSize v2.0.3
   * measure size of elements
   * MIT license
   */
  (function(window2, factory8) {
    if (typeof define == "function" && define.amd) {
      define("get-size/get-size", factory8);
    } else {
      window2.getSize = factory8();
    }
  })(window, function factory2() {
    function getStyleSize(value) {
      var num = parseFloat(value);
      var isValid = value.indexOf("%") == -1 && !isNaN(num);
      return isValid && num;
    }
    function noop2() {
    }
    var logError = typeof console == "undefined" ? noop2 : function(message) {
      console.error(message);
    };
    var measurements = [
      "paddingLeft",
      "paddingRight",
      "paddingTop",
      "paddingBottom",
      "marginLeft",
      "marginRight",
      "marginTop",
      "marginBottom",
      "borderLeftWidth",
      "borderRightWidth",
      "borderTopWidth",
      "borderBottomWidth"
    ];
    var measurementsLength = measurements.length;
    function getZeroSize() {
      var size = {
        width: 0,
        height: 0,
        innerWidth: 0,
        innerHeight: 0,
        outerWidth: 0,
        outerHeight: 0
      };
      for (var i = 0; i < measurementsLength; i++) {
        var measurement = measurements[i];
        size[measurement] = 0;
      }
      return size;
    }
    function getStyle(elem) {
      var style = getComputedStyle(elem);
      if (!style) {
        logError("Style returned " + style + ". Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1");
      }
      return style;
    }
    var isSetup = false;
    var isBoxSizeOuter;
    function setup() {
      if (isSetup) {
        return;
      }
      isSetup = true;
      var div = document.createElement("div");
      div.style.width = "200px";
      div.style.padding = "1px 2px 3px 4px";
      div.style.borderStyle = "solid";
      div.style.borderWidth = "1px 2px 3px 4px";
      div.style.boxSizing = "border-box";
      var body = document.body || document.documentElement;
      body.appendChild(div);
      var style = getStyle(div);
      isBoxSizeOuter = Math.round(getStyleSize(style.width)) == 200;
      getSize.isBoxSizeOuter = isBoxSizeOuter;
      body.removeChild(div);
    }
    function getSize(elem) {
      setup();
      if (typeof elem == "string") {
        elem = document.querySelector(elem);
      }
      if (!elem || typeof elem != "object" || !elem.nodeType) {
        return;
      }
      var style = getStyle(elem);
      if (style.display == "none") {
        return getZeroSize();
      }
      var size = {};
      size.width = elem.offsetWidth;
      size.height = elem.offsetHeight;
      var isBorderBox = size.isBorderBox = style.boxSizing == "border-box";
      for (var i = 0; i < measurementsLength; i++) {
        var measurement = measurements[i];
        var value = style[measurement];
        var num = parseFloat(value);
        size[measurement] = !isNaN(num) ? num : 0;
      }
      var paddingWidth = size.paddingLeft + size.paddingRight;
      var paddingHeight = size.paddingTop + size.paddingBottom;
      var marginWidth = size.marginLeft + size.marginRight;
      var marginHeight = size.marginTop + size.marginBottom;
      var borderWidth = size.borderLeftWidth + size.borderRightWidth;
      var borderHeight = size.borderTopWidth + size.borderBottomWidth;
      var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;
      var styleWidth = getStyleSize(style.width);
      if (styleWidth !== false) {
        size.width = styleWidth + // add padding and border unless it's already including it
        (isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth);
      }
      var styleHeight = getStyleSize(style.height);
      if (styleHeight !== false) {
        size.height = styleHeight + // add padding and border unless it's already including it
        (isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight);
      }
      size.innerWidth = size.width - (paddingWidth + borderWidth);
      size.innerHeight = size.height - (paddingHeight + borderHeight);
      size.outerWidth = size.width + marginWidth;
      size.outerHeight = size.height + marginHeight;
      return size;
    }
    return getSize;
  });
  (function(window2, factory8) {
    if (typeof define == "function" && define.amd) {
      define("desandro-matches-selector/matches-selector", factory8);
    } else {
      window2.matchesSelector = factory8();
    }
  })(window, function factory3() {
    var matchesMethod = function() {
      var ElemProto = window.Element.prototype;
      if (ElemProto.matches) {
        return "matches";
      }
      if (ElemProto.matchesSelector) {
        return "matchesSelector";
      }
      var prefixes = ["webkit", "moz", "ms", "o"];
      for (var i = 0; i < prefixes.length; i++) {
        var prefix = prefixes[i];
        var method = prefix + "MatchesSelector";
        if (ElemProto[method]) {
          return method;
        }
      }
    }();
    return function matchesSelector(elem, selector2) {
      return elem[matchesMethod](selector2);
    };
  });
  (function(window2, factory8) {
    if (typeof define == "function" && define.amd) {
      define("fizzy-ui-utils/utils", [
        "desandro-matches-selector/matches-selector"
      ], function(matchesSelector) {
        return factory8(window2, matchesSelector);
      });
    } else {
      window2.fizzyUIUtils = factory8(
        window2,
        window2.matchesSelector
      );
    }
  })(window, function factory4(window2, matchesSelector) {
    var utils = {};
    utils.extend = function(a, b) {
      for (var prop in b) {
        a[prop] = b[prop];
      }
      return a;
    };
    utils.modulo = function(num, div) {
      return (num % div + div) % div;
    };
    var arraySlice = Array.prototype.slice;
    utils.makeArray = function(obj) {
      if (Array.isArray(obj)) {
        return obj;
      }
      if (obj === null || obj === void 0) {
        return [];
      }
      var isArrayLike = typeof obj == "object" && typeof obj.length == "number";
      if (isArrayLike) {
        return arraySlice.call(obj);
      }
      return [obj];
    };
    utils.removeFrom = function(ary, obj) {
      var index = ary.indexOf(obj);
      if (index != -1) {
        ary.splice(index, 1);
      }
    };
    utils.getParent = function(elem, selector2) {
      while (elem.parentNode && elem != document.body) {
        elem = elem.parentNode;
        if (matchesSelector(elem, selector2)) {
          return elem;
        }
      }
    };
    utils.getQueryElement = function(elem) {
      if (typeof elem == "string") {
        return document.querySelector(elem);
      }
      return elem;
    };
    utils.handleEvent = function(event) {
      var method = "on" + event.type;
      if (this[method]) {
        this[method](event);
      }
    };
    utils.filterFindElements = function(elems, selector2) {
      elems = utils.makeArray(elems);
      var ffElems = [];
      elems.forEach(function(elem) {
        if (!(elem instanceof HTMLElement)) {
          return;
        }
        if (!selector2) {
          ffElems.push(elem);
          return;
        }
        if (matchesSelector(elem, selector2)) {
          ffElems.push(elem);
        }
        var childElems = elem.querySelectorAll(selector2);
        for (var i = 0; i < childElems.length; i++) {
          ffElems.push(childElems[i]);
        }
      });
      return ffElems;
    };
    utils.debounceMethod = function(_class, methodName, threshold) {
      threshold = threshold || 100;
      var method = _class.prototype[methodName];
      var timeoutName = methodName + "Timeout";
      _class.prototype[methodName] = function() {
        var timeout = this[timeoutName];
        clearTimeout(timeout);
        var args = arguments;
        var _this = this;
        this[timeoutName] = setTimeout(function() {
          method.apply(_this, args);
          delete _this[timeoutName];
        }, threshold);
      };
    };
    utils.docReady = function(callback) {
      var readyState = document.readyState;
      if (readyState == "complete" || readyState == "interactive") {
        setTimeout(callback);
      } else {
        document.addEventListener("DOMContentLoaded", callback);
      }
    };
    utils.toDashed = function(str) {
      return str.replace(/(.)([A-Z])/g, function(match, $1, $2) {
        return $1 + "-" + $2;
      }).toLowerCase();
    };
    var console2 = window2.console;
    utils.htmlInit = function(WidgetClass, namespace) {
      utils.docReady(function() {
        var dashedNamespace = utils.toDashed(namespace);
        var dataAttr = "data-" + dashedNamespace;
        var dataAttrElems = document.querySelectorAll("[" + dataAttr + "]");
        var jsDashElems = document.querySelectorAll(".js-" + dashedNamespace);
        var elems = utils.makeArray(dataAttrElems).concat(utils.makeArray(jsDashElems));
        var dataOptionsAttr = dataAttr + "-options";
        var jQuery = window2.jQuery;
        elems.forEach(function(elem) {
          var attr2 = elem.getAttribute(dataAttr) || elem.getAttribute(dataOptionsAttr);
          var options;
          try {
            options = attr2 && JSON.parse(attr2);
          } catch (error) {
            if (console2) {
              console2.error("Error parsing " + dataAttr + " on " + elem.className + ": " + error);
            }
            return;
          }
          var instance2 = new WidgetClass(elem, options);
          if (jQuery) {
            jQuery.data(elem, namespace, instance2);
          }
        });
      });
    };
    return utils;
  });
  (function(window2, factory8) {
    if (typeof define == "function" && define.amd) {
      define(
        "outlayer/item",
        [
          "ev-emitter/ev-emitter",
          "get-size/get-size"
        ],
        factory8
      );
    } else {
      window2.Outlayer = {};
      window2.Outlayer.Item = factory8(
        window2.EvEmitter,
        window2.getSize
      );
    }
  })(window, function factory5(EvEmitter, getSize) {
    function isEmptyObj(obj) {
      for (var prop in obj) {
        return false;
      }
      prop = null;
      return true;
    }
    var docElemStyle = document.documentElement.style;
    var transitionProperty = typeof docElemStyle.transition == "string" ? "transition" : "WebkitTransition";
    var transformProperty = typeof docElemStyle.transform == "string" ? "transform" : "WebkitTransform";
    var transitionEndEvent = {
      WebkitTransition: "webkitTransitionEnd",
      transition: "transitionend"
    }[transitionProperty];
    var vendorProperties = {
      transform: transformProperty,
      transition: transitionProperty,
      transitionDuration: transitionProperty + "Duration",
      transitionProperty: transitionProperty + "Property",
      transitionDelay: transitionProperty + "Delay"
    };
    function Item(element2, layout) {
      if (!element2) {
        return;
      }
      this.element = element2;
      this.layout = layout;
      this.position = {
        x: 0,
        y: 0
      };
      this._create();
    }
    var proto = Item.prototype = Object.create(EvEmitter.prototype);
    proto.constructor = Item;
    proto._create = function() {
      this._transn = {
        ingProperties: {},
        clean: {},
        onEnd: {}
      };
      this.css({
        position: "absolute"
      });
    };
    proto.handleEvent = function(event) {
      var method = "on" + event.type;
      if (this[method]) {
        this[method](event);
      }
    };
    proto.getSize = function() {
      this.size = getSize(this.element);
    };
    proto.css = function(style) {
      var elemStyle = this.element.style;
      for (var prop in style) {
        var supportedProp = vendorProperties[prop] || prop;
        elemStyle[supportedProp] = style[prop];
      }
    };
    proto.getPosition = function() {
      var style = getComputedStyle(this.element);
      var isOriginLeft = this.layout._getOption("originLeft");
      var isOriginTop = this.layout._getOption("originTop");
      var xValue = style[isOriginLeft ? "left" : "right"];
      var yValue = style[isOriginTop ? "top" : "bottom"];
      var x = parseFloat(xValue);
      var y = parseFloat(yValue);
      var layoutSize = this.layout.size;
      if (xValue.indexOf("%") != -1) {
        x = x / 100 * layoutSize.width;
      }
      if (yValue.indexOf("%") != -1) {
        y = y / 100 * layoutSize.height;
      }
      x = isNaN(x) ? 0 : x;
      y = isNaN(y) ? 0 : y;
      x -= isOriginLeft ? layoutSize.paddingLeft : layoutSize.paddingRight;
      y -= isOriginTop ? layoutSize.paddingTop : layoutSize.paddingBottom;
      this.position.x = x;
      this.position.y = y;
    };
    proto.layoutPosition = function() {
      var layoutSize = this.layout.size;
      var style = {};
      var isOriginLeft = this.layout._getOption("originLeft");
      var isOriginTop = this.layout._getOption("originTop");
      var xPadding = isOriginLeft ? "paddingLeft" : "paddingRight";
      var xProperty = isOriginLeft ? "left" : "right";
      var xResetProperty = isOriginLeft ? "right" : "left";
      var x = this.position.x + layoutSize[xPadding];
      style[xProperty] = this.getXValue(x);
      style[xResetProperty] = "";
      var yPadding = isOriginTop ? "paddingTop" : "paddingBottom";
      var yProperty = isOriginTop ? "top" : "bottom";
      var yResetProperty = isOriginTop ? "bottom" : "top";
      var y = this.position.y + layoutSize[yPadding];
      style[yProperty] = this.getYValue(y);
      style[yResetProperty] = "";
      this.css(style);
      this.emitEvent("layout", [this]);
    };
    proto.getXValue = function(x) {
      var isHorizontal = this.layout._getOption("horizontal");
      return this.layout.options.percentPosition && !isHorizontal ? x / this.layout.size.width * 100 + "%" : x + "px";
    };
    proto.getYValue = function(y) {
      var isHorizontal = this.layout._getOption("horizontal");
      return this.layout.options.percentPosition && isHorizontal ? y / this.layout.size.height * 100 + "%" : y + "px";
    };
    proto._transitionTo = function(x, y) {
      this.getPosition();
      var curX = this.position.x;
      var curY = this.position.y;
      var didNotMove = x == this.position.x && y == this.position.y;
      this.setPosition(x, y);
      if (didNotMove && !this.isTransitioning) {
        this.layoutPosition();
        return;
      }
      var transX = x - curX;
      var transY = y - curY;
      var transitionStyle = {};
      transitionStyle.transform = this.getTranslate(transX, transY);
      this.transition({
        to: transitionStyle,
        onTransitionEnd: {
          transform: this.layoutPosition
        },
        isCleaning: true
      });
    };
    proto.getTranslate = function(x, y) {
      var isOriginLeft = this.layout._getOption("originLeft");
      var isOriginTop = this.layout._getOption("originTop");
      x = isOriginLeft ? x : -x;
      y = isOriginTop ? y : -y;
      return "translate3d(" + x + "px, " + y + "px, 0)";
    };
    proto.goTo = function(x, y) {
      this.setPosition(x, y);
      this.layoutPosition();
    };
    proto.moveTo = proto._transitionTo;
    proto.setPosition = function(x, y) {
      this.position.x = parseFloat(x);
      this.position.y = parseFloat(y);
    };
    proto._nonTransition = function(args) {
      this.css(args.to);
      if (args.isCleaning) {
        this._removeStyles(args.to);
      }
      for (var prop in args.onTransitionEnd) {
        args.onTransitionEnd[prop].call(this);
      }
    };
    proto.transition = function(args) {
      if (!parseFloat(this.layout.options.transitionDuration)) {
        this._nonTransition(args);
        return;
      }
      var _transition = this._transn;
      for (var prop in args.onTransitionEnd) {
        _transition.onEnd[prop] = args.onTransitionEnd[prop];
      }
      for (prop in args.to) {
        _transition.ingProperties[prop] = true;
        if (args.isCleaning) {
          _transition.clean[prop] = true;
        }
      }
      if (args.from) {
        this.css(args.from);
        this.element.offsetHeight;
      }
      this.enableTransition(args.to);
      this.css(args.to);
      this.isTransitioning = true;
    };
    function toDashedAll(str) {
      return str.replace(/([A-Z])/g, function($1) {
        return "-" + $1.toLowerCase();
      });
    }
    var transitionProps = "opacity," + toDashedAll(transformProperty);
    proto.enableTransition = function() {
      if (this.isTransitioning) {
        return;
      }
      var duration = this.layout.options.transitionDuration;
      duration = typeof duration == "number" ? duration + "ms" : duration;
      this.css({
        transitionProperty: transitionProps,
        transitionDuration: duration,
        transitionDelay: this.staggerDelay || 0
      });
      this.element.addEventListener(transitionEndEvent, this, false);
    };
    proto.onwebkitTransitionEnd = function(event) {
      this.ontransitionend(event);
    };
    proto.onotransitionend = function(event) {
      this.ontransitionend(event);
    };
    var dashedVendorProperties = {
      "-webkit-transform": "transform"
    };
    proto.ontransitionend = function(event) {
      if (event.target !== this.element) {
        return;
      }
      var _transition = this._transn;
      var propertyName = dashedVendorProperties[event.propertyName] || event.propertyName;
      delete _transition.ingProperties[propertyName];
      if (isEmptyObj(_transition.ingProperties)) {
        this.disableTransition();
      }
      if (propertyName in _transition.clean) {
        this.element.style[event.propertyName] = "";
        delete _transition.clean[propertyName];
      }
      if (propertyName in _transition.onEnd) {
        var onTransitionEnd = _transition.onEnd[propertyName];
        onTransitionEnd.call(this);
        delete _transition.onEnd[propertyName];
      }
      this.emitEvent("transitionEnd", [this]);
    };
    proto.disableTransition = function() {
      this.removeTransitionStyles();
      this.element.removeEventListener(transitionEndEvent, this, false);
      this.isTransitioning = false;
    };
    proto._removeStyles = function(style) {
      var cleanStyle = {};
      for (var prop in style) {
        cleanStyle[prop] = "";
      }
      this.css(cleanStyle);
    };
    var cleanTransitionStyle = {
      transitionProperty: "",
      transitionDuration: "",
      transitionDelay: ""
    };
    proto.removeTransitionStyles = function() {
      this.css(cleanTransitionStyle);
    };
    proto.stagger = function(delay) {
      delay = isNaN(delay) ? 0 : delay;
      this.staggerDelay = delay + "ms";
    };
    proto.removeElem = function() {
      this.element.parentNode.removeChild(this.element);
      this.css({ display: "" });
      this.emitEvent("remove", [this]);
    };
    proto.remove = function() {
      if (!transitionProperty || !parseFloat(this.layout.options.transitionDuration)) {
        this.removeElem();
        return;
      }
      this.once("transitionEnd", function() {
        this.removeElem();
      });
      this.hide();
    };
    proto.reveal = function() {
      delete this.isHidden;
      this.css({ display: "" });
      var options = this.layout.options;
      var onTransitionEnd = {};
      var transitionEndProperty = this.getHideRevealTransitionEndProperty("visibleStyle");
      onTransitionEnd[transitionEndProperty] = this.onRevealTransitionEnd;
      this.transition({
        from: options.hiddenStyle,
        to: options.visibleStyle,
        isCleaning: true,
        onTransitionEnd
      });
    };
    proto.onRevealTransitionEnd = function() {
      if (!this.isHidden) {
        this.emitEvent("reveal");
      }
    };
    proto.getHideRevealTransitionEndProperty = function(styleProperty) {
      var optionStyle = this.layout.options[styleProperty];
      if (optionStyle.opacity) {
        return "opacity";
      }
      for (var prop in optionStyle) {
        return prop;
      }
    };
    proto.hide = function() {
      this.isHidden = true;
      this.css({ display: "" });
      var options = this.layout.options;
      var onTransitionEnd = {};
      var transitionEndProperty = this.getHideRevealTransitionEndProperty("hiddenStyle");
      onTransitionEnd[transitionEndProperty] = this.onHideTransitionEnd;
      this.transition({
        from: options.visibleStyle,
        to: options.hiddenStyle,
        // keep hidden stuff hidden
        isCleaning: true,
        onTransitionEnd
      });
    };
    proto.onHideTransitionEnd = function() {
      if (this.isHidden) {
        this.css({ display: "none" });
        this.emitEvent("hide");
      }
    };
    proto.destroy = function() {
      this.css({
        position: "",
        left: "",
        right: "",
        top: "",
        bottom: "",
        transition: "",
        transform: ""
      });
    };
    return Item;
  });
  /*!
   * Outlayer v2.1.1
   * the brains and guts of a layout library
   * MIT license
   */
  (function(window2, factory8) {
    if (typeof define == "function" && define.amd) {
      define(
        "outlayer/outlayer",
        [
          "ev-emitter/ev-emitter",
          "get-size/get-size",
          "fizzy-ui-utils/utils",
          "./item"
        ],
        function(EvEmitter, getSize, utils, Item) {
          return factory8(window2, EvEmitter, getSize, utils, Item);
        }
      );
    } else {
      window2.Outlayer = factory8(
        window2,
        window2.EvEmitter,
        window2.getSize,
        window2.fizzyUIUtils,
        window2.Outlayer.Item
      );
    }
  })(window, function factory6(window2, EvEmitter, getSize, utils, Item) {
    var console2 = window2.console;
    var jQuery = window2.jQuery;
    var noop2 = function() {
    };
    var GUID = 0;
    var instances = {};
    function Outlayer(element2, options) {
      var queryElement = utils.getQueryElement(element2);
      if (!queryElement) {
        if (console2) {
          console2.error("Bad element for " + this.constructor.namespace + ": " + (queryElement || element2));
        }
        return;
      }
      this.element = queryElement;
      if (jQuery) {
        this.$element = jQuery(this.element);
      }
      this.options = utils.extend({}, this.constructor.defaults);
      this.option(options);
      var id = ++GUID;
      this.element.outlayerGUID = id;
      instances[id] = this;
      this._create();
      var isInitLayout = this._getOption("initLayout");
      if (isInitLayout) {
        this.layout();
      }
    }
    Outlayer.namespace = "outlayer";
    Outlayer.Item = Item;
    Outlayer.defaults = {
      containerStyle: {
        position: "relative"
      },
      initLayout: true,
      originLeft: true,
      originTop: true,
      resize: true,
      resizeContainer: true,
      // item options
      transitionDuration: "0.4s",
      hiddenStyle: {
        opacity: 0,
        transform: "scale(0.001)"
      },
      visibleStyle: {
        opacity: 1,
        transform: "scale(1)"
      }
    };
    var proto = Outlayer.prototype;
    utils.extend(proto, EvEmitter.prototype);
    proto.option = function(opts) {
      utils.extend(this.options, opts);
    };
    proto._getOption = function(option) {
      var oldOption = this.constructor.compatOptions[option];
      return oldOption && this.options[oldOption] !== void 0 ? this.options[oldOption] : this.options[option];
    };
    Outlayer.compatOptions = {
      // currentName: oldName
      initLayout: "isInitLayout",
      horizontal: "isHorizontal",
      layoutInstant: "isLayoutInstant",
      originLeft: "isOriginLeft",
      originTop: "isOriginTop",
      resize: "isResizeBound",
      resizeContainer: "isResizingContainer"
    };
    proto._create = function() {
      this.reloadItems();
      this.stamps = [];
      this.stamp(this.options.stamp);
      utils.extend(this.element.style, this.options.containerStyle);
      var canBindResize = this._getOption("resize");
      if (canBindResize) {
        this.bindResize();
      }
    };
    proto.reloadItems = function() {
      this.items = this._itemize(this.element.children);
    };
    proto._itemize = function(elems) {
      var itemElems = this._filterFindItemElements(elems);
      var Item2 = this.constructor.Item;
      var items = [];
      for (var i = 0; i < itemElems.length; i++) {
        var elem = itemElems[i];
        var item = new Item2(elem, this);
        items.push(item);
      }
      return items;
    };
    proto._filterFindItemElements = function(elems) {
      return utils.filterFindElements(elems, this.options.itemSelector);
    };
    proto.getItemElements = function() {
      return this.items.map(function(item) {
        return item.element;
      });
    };
    proto.layout = function() {
      this._resetLayout();
      this._manageStamps();
      var layoutInstant = this._getOption("layoutInstant");
      var isInstant = layoutInstant !== void 0 ? layoutInstant : !this._isLayoutInited;
      this.layoutItems(this.items, isInstant);
      this._isLayoutInited = true;
    };
    proto._init = proto.layout;
    proto._resetLayout = function() {
      this.getSize();
    };
    proto.getSize = function() {
      this.size = getSize(this.element);
    };
    proto._getMeasurement = function(measurement, size) {
      var option = this.options[measurement];
      var elem;
      if (!option) {
        this[measurement] = 0;
      } else {
        if (typeof option == "string") {
          elem = this.element.querySelector(option);
        } else if (option instanceof HTMLElement) {
          elem = option;
        }
        this[measurement] = elem ? getSize(elem)[size] : option;
      }
    };
    proto.layoutItems = function(items, isInstant) {
      items = this._getItemsForLayout(items);
      this._layoutItems(items, isInstant);
      this._postLayout();
    };
    proto._getItemsForLayout = function(items) {
      return items.filter(function(item) {
        return !item.isIgnored;
      });
    };
    proto._layoutItems = function(items, isInstant) {
      this._emitCompleteOnItems("layout", items);
      if (!items || !items.length) {
        return;
      }
      var queue = [];
      items.forEach(function(item) {
        var position = this._getItemLayoutPosition(item);
        position.item = item;
        position.isInstant = isInstant || item.isLayoutInstant;
        queue.push(position);
      }, this);
      this._processLayoutQueue(queue);
    };
    proto._getItemLayoutPosition = function() {
      return {
        x: 0,
        y: 0
      };
    };
    proto._processLayoutQueue = function(queue) {
      this.updateStagger();
      queue.forEach(function(obj, i) {
        this._positionItem(obj.item, obj.x, obj.y, obj.isInstant, i);
      }, this);
    };
    proto.updateStagger = function() {
      var stagger = this.options.stagger;
      if (stagger === null || stagger === void 0) {
        this.stagger = 0;
        return;
      }
      this.stagger = getMilliseconds(stagger);
      return this.stagger;
    };
    proto._positionItem = function(item, x, y, isInstant, i) {
      if (isInstant) {
        item.goTo(x, y);
      } else {
        item.stagger(i * this.stagger);
        item.moveTo(x, y);
      }
    };
    proto._postLayout = function() {
      this.resizeContainer();
    };
    proto.resizeContainer = function() {
      var isResizingContainer = this._getOption("resizeContainer");
      if (!isResizingContainer) {
        return;
      }
      var size = this._getContainerSize();
      if (size) {
        this._setContainerMeasure(size.width, true);
        this._setContainerMeasure(size.height, false);
      }
    };
    proto._getContainerSize = noop2;
    proto._setContainerMeasure = function(measure, isWidth) {
      if (measure === void 0) {
        return;
      }
      var elemSize = this.size;
      if (elemSize.isBorderBox) {
        measure += isWidth ? elemSize.paddingLeft + elemSize.paddingRight + elemSize.borderLeftWidth + elemSize.borderRightWidth : elemSize.paddingBottom + elemSize.paddingTop + elemSize.borderTopWidth + elemSize.borderBottomWidth;
      }
      measure = Math.max(measure, 0);
      this.element.style[isWidth ? "width" : "height"] = measure + "px";
    };
    proto._emitCompleteOnItems = function(eventName, items) {
      var _this = this;
      function onComplete() {
        _this.dispatchEvent(eventName + "Complete", null, [items]);
      }
      var count = items.length;
      if (!items || !count) {
        onComplete();
        return;
      }
      var doneCount = 0;
      function tick() {
        doneCount++;
        if (doneCount == count) {
          onComplete();
        }
      }
      items.forEach(function(item) {
        item.once(eventName, tick);
      });
    };
    proto.dispatchEvent = function(type, event, args) {
      var emitArgs = event ? [event].concat(args) : args;
      this.emitEvent(type, emitArgs);
      if (jQuery) {
        this.$element = this.$element || jQuery(this.element);
        if (event) {
          var $event = jQuery.Event(event);
          $event.type = type;
          this.$element.trigger($event, args);
        } else {
          this.$element.trigger(type, args);
        }
      }
    };
    proto.ignore = function(elem) {
      var item = this.getItem(elem);
      if (item) {
        item.isIgnored = true;
      }
    };
    proto.unignore = function(elem) {
      var item = this.getItem(elem);
      if (item) {
        delete item.isIgnored;
      }
    };
    proto.stamp = function(elems) {
      elems = this._find(elems);
      if (!elems) {
        return;
      }
      this.stamps = this.stamps.concat(elems);
      elems.forEach(this.ignore, this);
    };
    proto.unstamp = function(elems) {
      elems = this._find(elems);
      if (!elems) {
        return;
      }
      elems.forEach(function(elem) {
        utils.removeFrom(this.stamps, elem);
        this.unignore(elem);
      }, this);
    };
    proto._find = function(elems) {
      if (!elems) {
        return;
      }
      if (typeof elems == "string") {
        elems = this.element.querySelectorAll(elems);
      }
      elems = utils.makeArray(elems);
      return elems;
    };
    proto._manageStamps = function() {
      if (!this.stamps || !this.stamps.length) {
        return;
      }
      this._getBoundingRect();
      this.stamps.forEach(this._manageStamp, this);
    };
    proto._getBoundingRect = function() {
      var boundingRect = this.element.getBoundingClientRect();
      var size = this.size;
      this._boundingRect = {
        left: boundingRect.left + size.paddingLeft + size.borderLeftWidth,
        top: boundingRect.top + size.paddingTop + size.borderTopWidth,
        right: boundingRect.right - (size.paddingRight + size.borderRightWidth),
        bottom: boundingRect.bottom - (size.paddingBottom + size.borderBottomWidth)
      };
    };
    proto._manageStamp = noop2;
    proto._getElementOffset = function(elem) {
      var boundingRect = elem.getBoundingClientRect();
      var thisRect = this._boundingRect;
      var size = getSize(elem);
      var offset = {
        left: boundingRect.left - thisRect.left - size.marginLeft,
        top: boundingRect.top - thisRect.top - size.marginTop,
        right: thisRect.right - boundingRect.right - size.marginRight,
        bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom
      };
      return offset;
    };
    proto.handleEvent = utils.handleEvent;
    proto.bindResize = function() {
      window2.addEventListener("resize", this);
      this.isResizeBound = true;
    };
    proto.unbindResize = function() {
      window2.removeEventListener("resize", this);
      this.isResizeBound = false;
    };
    proto.onresize = function() {
      this.resize();
    };
    utils.debounceMethod(Outlayer, "onresize", 100);
    proto.resize = function() {
      if (!this.isResizeBound || !this.needsResizeLayout()) {
        return;
      }
      this.layout();
    };
    proto.needsResizeLayout = function() {
      var size = getSize(this.element);
      var hasSizes = this.size && size;
      return hasSizes && size.innerWidth !== this.size.innerWidth;
    };
    proto.addItems = function(elems) {
      var items = this._itemize(elems);
      if (items.length) {
        this.items = this.items.concat(items);
      }
      return items;
    };
    proto.appended = function(elems) {
      var items = this.addItems(elems);
      if (!items.length) {
        return;
      }
      this.layoutItems(items, true);
      this.reveal(items);
    };
    proto.prepended = function(elems) {
      var items = this._itemize(elems);
      if (!items.length) {
        return;
      }
      var previousItems = this.items.slice(0);
      this.items = items.concat(previousItems);
      this._resetLayout();
      this._manageStamps();
      this.layoutItems(items, true);
      this.reveal(items);
      this.layoutItems(previousItems);
    };
    proto.reveal = function(items) {
      this._emitCompleteOnItems("reveal", items);
      if (!items || !items.length) {
        return;
      }
      var stagger = this.updateStagger();
      items.forEach(function(item, i) {
        item.stagger(i * stagger);
        item.reveal();
      });
    };
    proto.hide = function(items) {
      this._emitCompleteOnItems("hide", items);
      if (!items || !items.length) {
        return;
      }
      var stagger = this.updateStagger();
      items.forEach(function(item, i) {
        item.stagger(i * stagger);
        item.hide();
      });
    };
    proto.revealItemElements = function(elems) {
      var items = this.getItems(elems);
      this.reveal(items);
    };
    proto.hideItemElements = function(elems) {
      var items = this.getItems(elems);
      this.hide(items);
    };
    proto.getItem = function(elem) {
      for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (item.element == elem) {
          return item;
        }
      }
    };
    proto.getItems = function(elems) {
      elems = utils.makeArray(elems);
      var items = [];
      elems.forEach(function(elem) {
        var item = this.getItem(elem);
        if (item) {
          items.push(item);
        }
      }, this);
      return items;
    };
    proto.remove = function(elems) {
      var removeItems = this.getItems(elems);
      this._emitCompleteOnItems("remove", removeItems);
      if (!removeItems || !removeItems.length) {
        return;
      }
      removeItems.forEach(function(item) {
        item.remove();
        utils.removeFrom(this.items, item);
      }, this);
    };
    proto.destroy = function() {
      var style = this.element.style;
      style.height = "";
      style.position = "";
      style.width = "";
      this.items.forEach(function(item) {
        item.destroy();
      });
      this.unbindResize();
      var id = this.element.outlayerGUID;
      delete instances[id];
      delete this.element.outlayerGUID;
      if (jQuery) {
        jQuery.removeData(this.element, this.constructor.namespace);
      }
    };
    Outlayer.data = function(elem) {
      elem = utils.getQueryElement(elem);
      var id = elem && elem.outlayerGUID;
      return id && instances[id];
    };
    Outlayer.create = function(namespace, options) {
      var Layout = subclass(Outlayer);
      Layout.defaults = utils.extend({}, Outlayer.defaults);
      utils.extend(Layout.defaults, options);
      Layout.compatOptions = utils.extend({}, Outlayer.compatOptions);
      Layout.namespace = namespace;
      Layout.data = Outlayer.data;
      Layout.Item = subclass(Item);
      utils.htmlInit(Layout, namespace);
      if (jQuery && jQuery.bridget) {
        jQuery.bridget(namespace, Layout);
      }
      return Layout;
    };
    function subclass(Parent) {
      function SubClass() {
        Parent.apply(this, arguments);
      }
      SubClass.prototype = Object.create(Parent.prototype);
      SubClass.prototype.constructor = SubClass;
      return SubClass;
    }
    var msUnits = {
      ms: 1,
      s: 1e3
    };
    function getMilliseconds(time) {
      if (typeof time == "number") {
        return time;
      }
      var matches = time.match(/(^\d*\.?\d*)(\w*)/);
      var num = matches && matches[1];
      var unit = matches && matches[2];
      if (!num.length) {
        return 0;
      }
      num = parseFloat(num);
      var mult = msUnits[unit] || 1;
      return num * mult;
    }
    Outlayer.Item = Item;
    return Outlayer;
  });
  /*!
   * Masonry v4.2.2
   * Cascading grid layout library
   * https://masonry.desandro.com
   * MIT License
   * by David DeSandro
   */
  (function(window2, factory8) {
    if (typeof define == "function" && define.amd) {
      define(
        [
          "outlayer/outlayer",
          "get-size/get-size"
        ],
        factory8
      );
    } else {
      window2.Masonry = factory8(
        window2.Outlayer,
        window2.getSize
      );
    }
  })(window, function factory7(Outlayer, getSize) {
    var Masonry2 = Outlayer.create("masonry");
    Masonry2.compatOptions.fitWidth = "isFitWidth";
    var proto = Masonry2.prototype;
    proto._resetLayout = function() {
      this.getSize();
      this._getMeasurement("columnWidth", "outerWidth");
      this._getMeasurement("gutter", "outerWidth");
      this.measureColumns();
      this.colYs = [];
      for (var i = 0; i < this.cols; i++) {
        this.colYs.push(0);
      }
      this.maxY = 0;
      this.horizontalColIndex = 0;
    };
    proto.measureColumns = function() {
      this.getContainerWidth();
      if (!this.columnWidth) {
        var firstItem = this.items[0];
        var firstItemElem = firstItem && firstItem.element;
        this.columnWidth = firstItemElem && getSize(firstItemElem).outerWidth || // if first elem has no width, default to size of container
        this.containerWidth;
      }
      var columnWidth = this.columnWidth += this.gutter;
      var containerWidth = this.containerWidth + this.gutter;
      var cols = containerWidth / columnWidth;
      var excess = columnWidth - containerWidth % columnWidth;
      var mathMethod = excess && excess < 1 ? "round" : "floor";
      cols = Math[mathMethod](cols);
      this.cols = Math.max(cols, 1);
    };
    proto.getContainerWidth = function() {
      var isFitWidth = this._getOption("fitWidth");
      var container = isFitWidth ? this.element.parentNode : this.element;
      var size = getSize(container);
      this.containerWidth = size && size.innerWidth;
    };
    proto._getItemLayoutPosition = function(item) {
      item.getSize();
      var remainder = item.size.outerWidth % this.columnWidth;
      var mathMethod = remainder && remainder < 1 ? "round" : "ceil";
      var colSpan = Math[mathMethod](item.size.outerWidth / this.columnWidth);
      colSpan = Math.min(colSpan, this.cols);
      var colPosMethod = this.options.horizontalOrder ? "_getHorizontalColPosition" : "_getTopColPosition";
      var colPosition = this[colPosMethod](colSpan, item);
      var position = {
        x: this.columnWidth * colPosition.col,
        y: colPosition.y
      };
      var setHeight = colPosition.y + item.size.outerHeight;
      var setMax = colSpan + colPosition.col;
      for (var i = colPosition.col; i < setMax; i++) {
        this.colYs[i] = setHeight;
      }
      return position;
    };
    proto._getTopColPosition = function(colSpan) {
      var colGroup = this._getTopColGroup(colSpan);
      var minimumY = Math.min.apply(Math, colGroup);
      return {
        col: colGroup.indexOf(minimumY),
        y: minimumY
      };
    };
    proto._getTopColGroup = function(colSpan) {
      if (colSpan < 2) {
        return this.colYs;
      }
      var colGroup = [];
      var groupCount = this.cols + 1 - colSpan;
      for (var i = 0; i < groupCount; i++) {
        colGroup[i] = this._getColGroupY(i, colSpan);
      }
      return colGroup;
    };
    proto._getColGroupY = function(col, colSpan) {
      if (colSpan < 2) {
        return this.colYs[col];
      }
      var groupColYs = this.colYs.slice(col, col + colSpan);
      return Math.max.apply(Math, groupColYs);
    };
    proto._getHorizontalColPosition = function(colSpan, item) {
      var col = this.horizontalColIndex % this.cols;
      var isOver = colSpan > 1 && col + colSpan > this.cols;
      col = isOver ? 0 : col;
      var hasSize = item.size.outerWidth && item.size.outerHeight;
      this.horizontalColIndex = hasSize ? col + colSpan : this.horizontalColIndex;
      return {
        col,
        y: this._getColGroupY(col, colSpan)
      };
    };
    proto._manageStamp = function(stamp) {
      var stampSize = getSize(stamp);
      var offset = this._getElementOffset(stamp);
      var isOriginLeft = this._getOption("originLeft");
      var firstX = isOriginLeft ? offset.left : offset.right;
      var lastX = firstX + stampSize.outerWidth;
      var firstCol = Math.floor(firstX / this.columnWidth);
      firstCol = Math.max(0, firstCol);
      var lastCol = Math.floor(lastX / this.columnWidth);
      lastCol -= lastX % this.columnWidth ? 0 : 1;
      lastCol = Math.min(this.cols - 1, lastCol);
      var isOriginTop = this._getOption("originTop");
      var stampMaxY = (isOriginTop ? offset.top : offset.bottom) + stampSize.outerHeight;
      for (var i = firstCol; i <= lastCol; i++) {
        this.colYs[i] = Math.max(stampMaxY, this.colYs[i]);
      }
    };
    proto._getContainerSize = function() {
      this.maxY = Math.max.apply(Math, this.colYs);
      var size = {
        height: this.maxY
      };
      if (this._getOption("fitWidth")) {
        size.width = this._getContainerFitWidth();
      }
      return size;
    };
    proto._getContainerFitWidth = function() {
      var unusedCols = 0;
      var i = this.cols;
      while (--i) {
        if (this.colYs[i] !== 0) {
          break;
        }
        unusedCols++;
      }
      return (this.cols - unusedCols) * this.columnWidth - this.gutter;
    };
    proto.needsResizeLayout = function() {
      var previousWidth = this.containerWidth;
      this.getContainerWidth();
      return previousWidth != this.containerWidth;
    };
    return Masonry2;
  });
  function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
    const o = +getComputedStyle(node).opacity;
    return {
      delay,
      duration,
      easing,
      css: (t) => `opacity: ${t * o}`
    };
  }
  const subscriber_queue = [];
  function writable(value, start = noop) {
    let stop;
    const subscribers = /* @__PURE__ */ new Set();
    function set(new_value) {
      if (safe_not_equal(value, new_value)) {
        value = new_value;
        if (stop) {
          const run_queue = !subscriber_queue.length;
          for (const subscriber of subscribers) {
            subscriber[1]();
            subscriber_queue.push(subscriber, value);
          }
          if (run_queue) {
            for (let i = 0; i < subscriber_queue.length; i += 2) {
              subscriber_queue[i][0](subscriber_queue[i + 1]);
            }
            subscriber_queue.length = 0;
          }
        }
      }
    }
    function update2(fn) {
      set(fn(value));
    }
    function subscribe2(run2, invalidate = noop) {
      const subscriber = [run2, invalidate];
      subscribers.add(subscriber);
      if (subscribers.size === 1) {
        stop = start(set) || noop;
      }
      run2(value);
      return () => {
        subscribers.delete(subscriber);
        if (subscribers.size === 0 && stop) {
          stop();
          stop = null;
        }
      };
    }
    return { set, update: update2, subscribe: subscribe2 };
  }
  const _SORT_COUNT = {
    /**外部呼叫函数次数 */
    Call: 0,
    /**函数实际执行次数 */
    Run: 0
  };
  function debounceImmediate(func2, delay) {
    let timeout;
    return function() {
      const immediate = !timeout;
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        timeout = null;
      }, delay);
      if (immediate) {
        func2.apply(this, arguments);
      }
    };
  }
  function throttle(func2, delay) {
    let timerId;
    let lastExecTime = 0;
    return function(...args) {
      const currentTime = Date.now();
      const elapsedTime = currentTime - lastExecTime;
      if (!timerId && elapsedTime > delay) {
        func2.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
          func2.apply(this, args);
          lastExecTime = currentTime;
          timerId = null;
        }, delay - elapsedTime);
      }
    };
  }
  const throttleSort = throttle(doSortMasonry, 1500);
  const throttleSort_fast = throttle(doSortMasonry, 30);
  function doSortMasonry() {
    _SORT_COUNT.Run++;
    console.log(`呼叫整理次数: ${_SORT_COUNT.Call}   实际整理次数: ${_SORT_COUNT.Run}`);
    masonry.layout();
  }
  function sortMasonry(speed = "normal") {
    if (get_store_value(_animated)) {
      _SORT_COUNT.Call++;
      if (masonry) {
        if (speed === "fast") {
          throttleSort_fast();
        } else {
          throttleSort();
        }
      }
    } else {
      _SORT_COUNT.Call++;
      if (masonry)
        doSortMasonry();
    }
  }
  const existingContainer = document.getElementById("kp_container");
  const kesa_preview = existingContainer ? existingContainer : createKesaPreview("");
  document.body.appendChild(kesa_preview);
  const selector$1 = "img.preview_Kesa";
  let buffer = null;
  function NEXUS_TOOLS() {
    console.log("------------------------ NEXUS TOOLS Without jQuery ------------------------");
    document.body.addEventListener("mouseover", function(e) {
      const imgEle = get_store_value(_trigger_nexus_pic) == 0 ? e.target : e.relatedTarget;
      if (get_store_value(_trigger_nexus_pic) == 0) {
        if (e.target.matches(selector$1)) {
          handleMouseOver(e, imgEle);
        }
      }
      if (get_store_value(_trigger_nexus_pic) == 1) {
        if (e.target.matches("div.hover-trigger")) {
          handleMouseOver(e, imgEle);
        }
      }
    });
    document.body.addEventListener("mouseout", function(e) {
      if (e.target.matches(selector$1)) {
        handleMouseOut();
      }
    });
    document.body.addEventListener("mousemove", function(e) {
      const imgEle = e.target;
      if (get_store_value(_trigger_nexus_pic) == 0) {
        handleMouseMove(e, imgEle);
      }
      if (get_store_value(_trigger_nexus_pic) == 1 && e.target.matches(selector$1)) {
        handleMouseMove(e, imgEle);
      }
    });
    if ("IntersectionObserver" in window) {
      let imgList = [...document.querySelectorAll(".nexus-lazy-load_Kesa")];
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          entry.intersectionRatio;
          if (entry.isIntersecting && !el.classList.contains("preview_Kesa")) {
            const source = el.dataset.src;
            el.src = source;
            el.classList.add("preview_Kesa");
            sortMasonry();
          }
        });
      });
      imgList.forEach((img) => io.observe(img));
    }
  }
  function getMinRatio(pic, container) {
    return Math.min(container.width / pic.width, container.height / pic.height);
  }
  function previewPosition(event, imgEle) {
    let imgWidth = 0;
    let imgHeight = 0;
    try {
      imgWidth = imgEle.naturalWidth;
      imgHeight = imgEle.naturalHeight;
    } catch (error) {
      console.log(imgEle);
    }
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const distanceToTop = mouseY;
    const distanceToBottom = viewportHeight - mouseY;
    const distanceToLeft = mouseX;
    const distanceToRight = viewportWidth - mouseX;
    const picSize = {
      width: imgWidth,
      height: imgHeight
    };
    const containerSize = {
      bot: {
        width: viewportWidth,
        height: distanceToBottom
      },
      top: {
        width: viewportWidth,
        height: distanceToTop
      },
      right: {
        width: distanceToRight,
        height: viewportHeight
      },
      left: {
        width: distanceToLeft,
        height: viewportHeight
      }
    };
    let maxRatio = 0;
    let maxPosition = "";
    for (const key in containerSize) {
      if (Object.hasOwnProperty.call(containerSize, key)) {
        const element2 = containerSize[key];
        if (getMinRatio(picSize, element2) > maxRatio) {
          maxRatio = getMinRatio(picSize, element2);
          maxPosition = key;
        }
      }
    }
    const result = {
      top: {
        left: 0,
        top: 0,
        width: viewportWidth + "px",
        height: distanceToTop + "px"
      },
      bot: {
        left: 0,
        top: distanceToTop + "px",
        width: viewportWidth + "px",
        height: distanceToBottom + "px"
      },
      left: {
        left: 0,
        top: 0,
        width: distanceToLeft + "px",
        height: viewportHeight + "px"
      },
      right: {
        left: distanceToLeft + "px",
        top: 0,
        width: distanceToRight + "px",
        height: viewportHeight + "px"
      },
      default: {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      }
    };
    const container = maxPosition != "" ? result[maxPosition] : result["default"];
    return container;
  }
  function createKesaPreview(color) {
    const parent = document.createElement("div");
    parent.id = "kp_container";
    parent.style.backgroundColor = color;
    parent.style.opacity = "1";
    parent.style.position = "Fixed";
    parent.style.zIndex = "20000";
    parent.style.pointerEvents = "none";
    parent.style.transition = "all .3s";
    parent.style.display = "none";
    const img1 = document.createElement("img");
    img1.className = "kp_img";
    img1.style.position = "absolute";
    img1.style.zIndex = "20002";
    img1.style.pointerEvents = "none";
    img1.style.width = "100%";
    img1.style.height = "100%";
    img1.style.objectFit = "contain";
    parent.appendChild(img1);
    const img2 = document.createElement("img");
    img2.className = "kp_img";
    img2.style.position = "absolute";
    img2.style.zIndex = "20001";
    img2.style.pointerEvents = "none";
    img2.style.width = "100%";
    img2.style.height = "100%";
    img2.style.objectFit = "cover";
    img2.style.filter = "blur(8px)";
    parent.appendChild(img2);
    return parent;
  }
  function clearKesaPreview() {
    kesa_preview.childNodes.forEach((kpImg) => {
      kpImg.setAttribute("src", "");
    });
  }
  function handleMouseOver(e, imgEle) {
    buffer = setTimeout(() => {
      if (get_store_value(_show_nexus_pic)) {
        let src = imgEle.getAttribute("src");
        if (src) {
          if (kesa_preview) {
            const kpImgElements = kesa_preview.querySelectorAll(".kp_img");
            kpImgElements.forEach((kpImg) => {
              kpImg.setAttribute("src", src);
            });
          }
        }
        const cssPos = previewPosition(e, imgEle);
        kesa_preview.style.left = cssPos.left;
        kesa_preview.style.top = cssPos.top;
        kesa_preview.style.width = cssPos.width;
        kesa_preview.style.height = cssPos.height;
        kesa_preview.style.display = "block";
      }
    }, get_store_value(_delay_nexus_pic));
  }
  function handleMouseOut() {
    kesa_preview.style.display = "none";
    clearKesaPreview();
    if (buffer)
      clearTimeout(buffer);
  }
  function handleMouseMove(e, imgEle) {
    const cssPos = previewPosition(e, imgEle);
    kesa_preview.style.left = cssPos.left;
    kesa_preview.style.top = cssPos.top;
    kesa_preview.style.width = cssPos.width;
    kesa_preview.style.height = cssPos.height;
  }
  const ls_test_list = {};
  function parseLocalStorage(key) {
    const storage = localStorage.getItem(key);
    if (storage) {
      try {
        if (ls_test_list[key]) {
          if (storage === ls_test_list[key].string) {
            console.log("%c====> 读取 localstorage 缓存成功~", "color: green;");
            return ls_test_list[key].object;
          } else {
            console.log("%c====> 更新 localstorage 缓存~", "color: orange;");
          }
        } else {
          ls_test_list[key] = {};
        }
        const parsedValue = JSON.parse(storage);
        if (typeof parsedValue === "object" && parsedValue !== null) {
          for (const key2 in parsedValue) {
            if (Object.hasOwnProperty.call(parsedValue, key2)) {
              const value = parsedValue[key2];
              if (typeof value === "string") {
                try {
                  const parsedObject = JSON.parse(value);
                  parsedValue[key2] = parsedObject;
                } catch (error) {
                }
              }
            }
          }
          ls_test_list[key].string = storage;
          ls_test_list[key].object = parsedValue;
          ls_test_list[key].timestamp = (/* @__PURE__ */ new Date()).getTime();
          return parsedValue;
        } else {
          console.error("localStorage 中的值不是一个对象");
        }
      } catch (error) {
        console.error("无法解析 localStorage 中的值为 JSON:", error);
      }
    } else {
      console.error(`localStorage 中不存在 key 为 ${key} 的值, 可能是本站 api 改变了`);
    }
  }
  window.parseLocalStorage = parseLocalStorage;
  const persistName = "Kesa:Masonry";
  function persistStore(key, startValue) {
    if (!localStorage.getItem(persistName))
      localStorage.setItem(persistName, "{}");
    const savedValue = JSON.parse(localStorage.getItem(persistName))[key];
    const initialValue = savedValue ?? startValue;
    const store = writable(initialValue);
    store.subscribe((value) => {
      const data = JSON.parse(localStorage.getItem(persistName)) ?? {};
      data[key] = value;
      localStorage.setItem(persistName, JSON.stringify(data));
    });
    if (localStorage.getItem(key))
      localStorage.removeItem(key);
    return store;
  }
  const _Global_Masonry = writable({});
  const _iframe_switch = writable(0);
  const _iframe_url = writable("https://kamept.com/index.php");
  const _current_domain = persistStore("_domain", "");
  const _current_bgColor = persistStore("_bgColor", "");
  const _list_viewMode = persistStore("_listViewMode", 1);
  const _show_configPanel = writable(false);
  const _panelPos = persistStore("_panelPos", { x: 0, y: 0 });
  const _turnPage = persistStore("_turnPage", false);
  const _show_debug_btn = persistStore("_show_debug_btn", 0);
  const _show_nexus_pic = persistStore("_show_nexus_pic", 1);
  const _trigger_nexus_pic = persistStore("_trigger_nexus_pic", 1);
  const _delay_nexus_pic = persistStore("_delay_nexus_pic", 0);
  const _animated = persistStore("_animated", true);
  const _card_layout = persistStore("_card_layout", {
    // 列数
    column: 4,
    // 间距
    gap: 20
  });
  const site_setting = {
    mt: {
      // 隐藏gay卡片: 默认为true
      hide_gay: true,
      // 路径是否在 browse 里
      path_in_browse: false
    }
  };
  const _SITE_SETTING = persistStore("_SITE_SETTING", site_setting);
  let mark1 = false;
  _SITE_SETTING.subscribe((value) => {
    if (!mark1) {
      mark1 = true;
    } else {
      sortMasonry("fast");
      sortMasonry("fast");
      sortMasonry();
      sortMasonry();
    }
  });
  const show_switch = {
    // 全局总开关
    all: false,
    // 显示标题
    title: true,
    // 显示置顶和免费
    free: false,
    // 显示副标题
    sub_title: false,
    // 显示标签
    tags: false,
    // 显示大小&下载&收藏
    size_download_collect: false,
    // 显示上传时间
    upload_time: false,
    // 显示评论/上传/下载/完成
    statistics: false
  };
  const _CARD_SHOW = persistStore("_card_show", show_switch);
  let mark = false;
  _CARD_SHOW.subscribe((value) => {
    if (!mark) {
      mark = true;
    } else {
      sortMasonry("fast");
      sortMasonry("fast");
      sortMasonry();
      sortMasonry();
    }
  });
  function create_fragment$g(ctx) {
    let svg;
    let path;
    let circle;
    return {
      c() {
        svg = svg_element("svg");
        path = svg_element("path");
        circle = svg_element("circle");
        attr(path, "d", "M102.6476822,65.245285l-40.2463036,40.1161652c-3.1256676,3.1155624-8.1839256,3.1114655-11.3045425-0.0091476  l-26.7890854-26.789093c-3.1289177-3.1289139-3.1234951-8.2035599,0.0121021-11.3257828l40.077301-39.9063568  C65.8964539,25.8381672,67.9261017,25,70.0419083,25H97c4.4182816,0,8,3.5817223,8,8v26.5792809  C105,61.7055016,104.1535873,63.7442589,102.6476822,65.245285z");
        attr(path, "fill", "yellow");
        attr(path, "stroke", "#000000");
        attr(path, "stroke-linecap", "round");
        attr(path, "stroke-linejoin", "round");
        attr(path, "stroke-miterlimit", "10");
        attr(path, "stroke-width", "4");
        attr(circle, "cx", "85");
        attr(circle, "cy", "45");
        attr(circle, "fill", "red");
        attr(circle, "r", "8");
        attr(circle, "stroke", "#000000");
        attr(circle, "stroke-linecap", "round");
        attr(circle, "stroke-linejoin", "round");
        attr(circle, "stroke-miterlimit", "10");
        attr(circle, "stroke-width", "4");
        attr(svg, "enable-background", "new 0 0 128 128");
        attr(svg, "id", "Layer_1");
        attr(svg, "version", "1.1");
        attr(svg, "viewBox", "0 0 128 128");
        attr(svg, "xml:space", "preserve");
        attr(svg, "width", "28");
        attr(svg, "height", "28");
        attr(svg, "class", "hint");
      },
      m(target, anchor) {
        insert(target, svg, anchor);
        append(svg, path);
        append(svg, circle);
      },
      p: noop,
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(svg);
      }
    };
  }
  class Icon_label extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, null, create_fragment$g, safe_not_equal, {});
    }
  }
  function create_if_block_6$2(ctx) {
    let iconlabel;
    let t;
    let div;
    let current;
    iconlabel = new Icon_label({});
    return {
      c() {
        create_component(iconlabel.$$.fragment);
        t = space();
        div = element("div");
        attr(div, "class", "_hint svelte-zt6zlx");
      },
      m(target, anchor) {
        mount_component(iconlabel, target, anchor);
        insert(target, t, anchor);
        insert(target, div, anchor);
        div.innerHTML = /*label*/
        ctx[5];
        current = true;
      },
      p(ctx2, dirty) {
        if (!current || dirty & /*label*/
        32)
          div.innerHTML = /*label*/
          ctx2[5];
      },
      i(local) {
        if (current)
          return;
        transition_in(iconlabel.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(iconlabel.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(iconlabel, detaching);
        if (detaching)
          detach(t);
        if (detaching)
          detach(div);
      }
    };
  }
  function create_if_block_2$4(ctx) {
    let t;
    let if_block_anchor;
    function select_block_type(ctx2, dirty) {
      if (
        /*green_state*/
        ctx2[7]
      )
        return create_if_block_3$3;
      if (
        /*checked*/
        ctx2[0]
      )
        return create_if_block_5$2;
      return create_else_block_1$2;
    }
    let current_block_type = select_block_type(ctx);
    let if_block = current_block_type(ctx);
    return {
      c() {
        t = text(": \r\n\r\n      ");
        if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        insert(target, t, anchor);
        if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
      },
      p(ctx2, dirty) {
        if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block.d(1);
          if_block = current_block_type(ctx2);
          if (if_block) {
            if_block.c();
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        }
      },
      d(detaching) {
        if (detaching)
          detach(t);
        if_block.d(detaching);
        if (detaching)
          detach(if_block_anchor);
      }
    };
  }
  function create_else_block_1$2(ctx) {
    let span;
    let t;
    return {
      c() {
        span = element("span");
        t = text(
          /*title_green*/
          ctx[3]
        );
        attr(span, "class", "title_green svelte-zt6zlx");
      },
      m(target, anchor) {
        insert(target, span, anchor);
        append(span, t);
      },
      p(ctx2, dirty) {
        if (dirty & /*title_green*/
        8)
          set_data(
            t,
            /*title_green*/
            ctx2[3]
          );
      },
      d(detaching) {
        if (detaching)
          detach(span);
      }
    };
  }
  function create_if_block_5$2(ctx) {
    let span;
    let t;
    return {
      c() {
        span = element("span");
        t = text(
          /*title_red*/
          ctx[4]
        );
        attr(span, "class", "title_red svelte-zt6zlx");
      },
      m(target, anchor) {
        insert(target, span, anchor);
        append(span, t);
      },
      p(ctx2, dirty) {
        if (dirty & /*title_red*/
        16)
          set_data(
            t,
            /*title_red*/
            ctx2[4]
          );
      },
      d(detaching) {
        if (detaching)
          detach(span);
      }
    };
  }
  function create_if_block_3$3(ctx) {
    let if_block_anchor;
    function select_block_type_1(ctx2, dirty) {
      if (
        /*checked*/
        ctx2[0]
      )
        return create_if_block_4$3;
      return create_else_block$5;
    }
    let current_block_type = select_block_type_1(ctx);
    let if_block = current_block_type(ctx);
    return {
      c() {
        if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
      },
      p(ctx2, dirty) {
        if (current_block_type === (current_block_type = select_block_type_1(ctx2)) && if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block.d(1);
          if_block = current_block_type(ctx2);
          if (if_block) {
            if_block.c();
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        }
      },
      d(detaching) {
        if_block.d(detaching);
        if (detaching)
          detach(if_block_anchor);
      }
    };
  }
  function create_else_block$5(ctx) {
    let span;
    let t;
    return {
      c() {
        span = element("span");
        t = text(
          /*title_red*/
          ctx[4]
        );
        attr(span, "class", "title_red svelte-zt6zlx");
      },
      m(target, anchor) {
        insert(target, span, anchor);
        append(span, t);
      },
      p(ctx2, dirty) {
        if (dirty & /*title_red*/
        16)
          set_data(
            t,
            /*title_red*/
            ctx2[4]
          );
      },
      d(detaching) {
        if (detaching)
          detach(span);
      }
    };
  }
  function create_if_block_4$3(ctx) {
    let span;
    let t;
    return {
      c() {
        span = element("span");
        t = text(
          /*title_green*/
          ctx[3]
        );
        attr(span, "class", "title_green svelte-zt6zlx");
      },
      m(target, anchor) {
        insert(target, span, anchor);
        append(span, t);
      },
      p(ctx2, dirty) {
        if (dirty & /*title_green*/
        8)
          set_data(
            t,
            /*title_green*/
            ctx2[3]
          );
      },
      d(detaching) {
        if (detaching)
          detach(span);
      }
    };
  }
  function create_if_block_1$5(ctx) {
    let div;
    let input;
    let t;
    let label_1;
    let mounted;
    let dispose;
    return {
      c() {
        div = element("div");
        input = element("input");
        t = space();
        label_1 = element("label");
        attr(input, "type", "checkbox");
        attr(input, "id", "_t" + /*id*/
        ctx[8]);
        attr(input, "class", "svelte-zt6zlx");
        attr(label_1, "for", "_t" + /*id*/
        ctx[8]);
        attr(label_1, "class", "svelte-zt6zlx");
        attr(div, "class", "s_switch svelte-zt6zlx");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, input);
        input.checked = /*checked*/
        ctx[0];
        append(div, t);
        append(div, label_1);
        if (!mounted) {
          dispose = [
            listen(
              input,
              "change",
              /*input_change_handler*/
              ctx[11]
            ),
            listen(
              input,
              "change",
              /*change_handler*/
              ctx[12]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty & /*checked*/
        1) {
          input.checked = /*checked*/
          ctx2[0];
        }
      },
      d(detaching) {
        if (detaching)
          detach(div);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_if_block$8(ctx) {
    let current;
    const default_slot_template = (
      /*#slots*/
      ctx[10].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[9],
      null
    );
    return {
      c() {
        if (default_slot)
          default_slot.c();
      },
      m(target, anchor) {
        if (default_slot) {
          default_slot.m(target, anchor);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          512)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[9],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[9]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[9],
                dirty,
                null
              ),
              null
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (default_slot)
          default_slot.d(detaching);
      }
    };
  }
  function create_fragment$f(ctx) {
    let div1;
    let div0;
    let t0;
    let t1;
    let t2;
    let t3;
    let t4;
    let current;
    let if_block0 = (
      /*label*/
      ctx[5] && create_if_block_6$2(ctx)
    );
    let if_block1 = (
      /*title_green*/
      (ctx[3] || /*title_red*/
      ctx[4]) && create_if_block_2$4(ctx)
    );
    let if_block2 = (
      /*type*/
      ctx[1] == "switch" && create_if_block_1$5(ctx)
    );
    let if_block3 = (
      /*type*/
      ctx[1] == "range" && create_if_block$8(ctx)
    );
    return {
      c() {
        div1 = element("div");
        div0 = element("div");
        if (if_block0)
          if_block0.c();
        t0 = space();
        t1 = text(
          /*title_fixed*/
          ctx[2]
        );
        t2 = space();
        if (if_block1)
          if_block1.c();
        t3 = space();
        if (if_block2)
          if_block2.c();
        t4 = space();
        if (if_block3)
          if_block3.c();
        attr(div0, "class", "s_title svelte-zt6zlx");
        attr(
          div0,
          "title",
          /*label*/
          ctx[5]
        );
        attr(div1, "class", "switch svelte-zt6zlx");
      },
      m(target, anchor) {
        insert(target, div1, anchor);
        append(div1, div0);
        if (if_block0)
          if_block0.m(div0, null);
        append(div0, t0);
        append(div0, t1);
        append(div0, t2);
        if (if_block1)
          if_block1.m(div0, null);
        append(div1, t3);
        if (if_block2)
          if_block2.m(div1, null);
        append(div1, t4);
        if (if_block3)
          if_block3.m(div1, null);
        current = true;
      },
      p(ctx2, [dirty]) {
        if (
          /*label*/
          ctx2[5]
        ) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
            if (dirty & /*label*/
            32) {
              transition_in(if_block0, 1);
            }
          } else {
            if_block0 = create_if_block_6$2(ctx2);
            if_block0.c();
            transition_in(if_block0, 1);
            if_block0.m(div0, t0);
          }
        } else if (if_block0) {
          group_outros();
          transition_out(if_block0, 1, 1, () => {
            if_block0 = null;
          });
          check_outros();
        }
        if (!current || dirty & /*title_fixed*/
        4)
          set_data(
            t1,
            /*title_fixed*/
            ctx2[2]
          );
        if (
          /*title_green*/
          ctx2[3] || /*title_red*/
          ctx2[4]
        ) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
          } else {
            if_block1 = create_if_block_2$4(ctx2);
            if_block1.c();
            if_block1.m(div0, null);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
        if (!current || dirty & /*label*/
        32) {
          attr(
            div0,
            "title",
            /*label*/
            ctx2[5]
          );
        }
        if (
          /*type*/
          ctx2[1] == "switch"
        ) {
          if (if_block2) {
            if_block2.p(ctx2, dirty);
          } else {
            if_block2 = create_if_block_1$5(ctx2);
            if_block2.c();
            if_block2.m(div1, t4);
          }
        } else if (if_block2) {
          if_block2.d(1);
          if_block2 = null;
        }
        if (
          /*type*/
          ctx2[1] == "range"
        ) {
          if (if_block3) {
            if_block3.p(ctx2, dirty);
            if (dirty & /*type*/
            2) {
              transition_in(if_block3, 1);
            }
          } else {
            if_block3 = create_if_block$8(ctx2);
            if_block3.c();
            transition_in(if_block3, 1);
            if_block3.m(div1, null);
          }
        } else if (if_block3) {
          group_outros();
          transition_out(if_block3, 1, 1, () => {
            if_block3 = null;
          });
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block0);
        transition_in(if_block3);
        current = true;
      },
      o(local) {
        transition_out(if_block0);
        transition_out(if_block3);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div1);
        if (if_block0)
          if_block0.d();
        if (if_block1)
          if_block1.d();
        if (if_block2)
          if_block2.d();
        if (if_block3)
          if_block3.d();
      }
    };
  }
  function instance$9($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    let { type = "switch" } = $$props;
    let { title_fixed = "" } = $$props;
    let { title_green = "" } = $$props;
    let { title_red = "" } = $$props;
    let { label = "" } = $$props;
    let { func: func2 = null } = $$props;
    const id = Math.random().toFixed(8);
    let { checked = false } = $$props;
    let { green_state = true } = $$props;
    function input_change_handler() {
      checked = this.checked;
      $$invalidate(0, checked);
    }
    const change_handler = () => {
      console.log(title_fixed, checked);
      if (func2 != null)
        func2();
    };
    $$self.$$set = ($$props2) => {
      if ("type" in $$props2)
        $$invalidate(1, type = $$props2.type);
      if ("title_fixed" in $$props2)
        $$invalidate(2, title_fixed = $$props2.title_fixed);
      if ("title_green" in $$props2)
        $$invalidate(3, title_green = $$props2.title_green);
      if ("title_red" in $$props2)
        $$invalidate(4, title_red = $$props2.title_red);
      if ("label" in $$props2)
        $$invalidate(5, label = $$props2.label);
      if ("func" in $$props2)
        $$invalidate(6, func2 = $$props2.func);
      if ("checked" in $$props2)
        $$invalidate(0, checked = $$props2.checked);
      if ("green_state" in $$props2)
        $$invalidate(7, green_state = $$props2.green_state);
      if ("$$scope" in $$props2)
        $$invalidate(9, $$scope = $$props2.$$scope);
    };
    return [
      checked,
      type,
      title_fixed,
      title_green,
      title_red,
      label,
      func2,
      green_state,
      id,
      $$scope,
      slots,
      input_change_handler,
      change_handler
    ];
  }
  class Switch extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$9, create_fragment$f, safe_not_equal, {
        type: 1,
        title_fixed: 2,
        title_green: 3,
        title_red: 4,
        label: 5,
        func: 6,
        checked: 0,
        green_state: 7
      });
    }
  }
  const SVG_CONFIG = "data:image/svg+xml;base64,PHN2Zw0KICB3aWR0aD0iMjAiDQogIGhlaWdodD0iMjAiDQogIHZpZXdCb3g9IjAgMCAzMiAzMiINCiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KPg0KICA8ZGVmcz4NCiAgICA8c3R5bGU+DQogICAgICAuY2xzLTEgew0KICAgICAgICBmaWxsOiBub25lOw0KICAgICAgICBzdHJva2U6ICNmZmY7DQogICAgICAgIHN0cm9rZS1saW5lY2FwOiByb3VuZDsNCiAgICAgICAgc3Ryb2tlLWxpbmVqb2luOiByb3VuZDsNCiAgICAgICAgc3Ryb2tlLXdpZHRoOiAycHg7DQogICAgICB9DQogICAgPC9zdHlsZT4NCiAgPC9kZWZzPg0KICA8dGl0bGUgLz4NCiAgPGcgZGF0YS1uYW1lPSI4MC1zZXR0aW5nIiBpZD0iXzgwLXNldHRpbmciPg0KICAgIDxjaXJjbGUgY2xhc3M9ImNscy0xIiBjeD0iMTAiIGN5PSI2IiByPSIzIiAvPg0KICAgIDxjaXJjbGUgY2xhc3M9ImNscy0xIiBjeD0iMjIiIGN5PSIxNiIgcj0iMyIgLz4NCiAgICA8Y2lyY2xlIGNsYXNzPSJjbHMtMSIgY3g9IjEwIiBjeT0iMjYiIHI9IjMiIC8+DQogICAgPGxpbmUgY2xhc3M9ImNscy0xIiB4MT0iNyIgeDI9IjEiIHkxPSI2IiB5Mj0iNiIgLz4NCiAgICA8bGluZSBjbGFzcz0iY2xzLTEiIHgxPSIxNSIgeDI9IjEiIHkxPSIxNiIgeTI9IjE2IiAvPg0KICAgIDxsaW5lIGNsYXNzPSJjbHMtMSIgeDE9IjciIHgyPSIxIiB5MT0iMjYiIHkyPSIyNiIgLz4NCiAgICA8bGluZSBjbGFzcz0iY2xzLTEiIHgxPSIzMSIgeDI9IjE3IiB5MT0iMjYiIHkyPSIyNiIgLz4NCiAgICA8bGluZSBjbGFzcz0iY2xzLTEiIHgxPSIzMSIgeDI9IjI1IiB5MT0iMTYiIHkyPSIxNiIgLz4NCiAgICA8bGluZSBjbGFzcz0iY2xzLTEiIHgxPSIzMSIgeDI9IjE3IiB5MT0iNiIgeTI9IjYiIC8+DQogIDwvZz4NCjwvc3ZnPg==";
  const SVG_MASONRY = "data:image/svg+xml;base64,PHN2Zw0KICBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA2NCA2NCINCiAgd2lkdGg9IjIwIg0KICBoZWlnaHQ9IjIwIg0KICBpZD0iTGF5ZXJfMSINCiAgdmVyc2lvbj0iMS4xIg0KICB2aWV3Qm94PSIwIDAgNjQgNjQiDQogIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCj4NCiAgPHBhdGgNCiAgICBkPSJNMTksMi44NzVIMy41Yy0wLjgyOSwwLTEuNSwwLjY3MS0xLjUsMS41djE5Ljk3OWMwLDAuODI5LDAuNjcxLDEuNSwxLjUsMS41SDE5YzAuODI5LDAsMS41LTAuNjcxLDEuNS0xLjVWNC4zNzUgIEMyMC41LDMuNTQ2LDE5LjgyOSwyLjg3NSwxOSwyLjg3NXogTTE3LjUsMjIuODU0SDVWNS44NzVoMTIuNVYyMi44NTR6Ig0KICAgIGZpbGw9IndoaXRlIi8+DQogIDxwYXRoDQogICAgZD0iTTE5LDI4Ljc3M0gzLjVjLTAuODI5LDAtMS41LDAuNjcxLTEuNSwxLjV2Ni4xNjZjMCwwLjgyOCwwLjY3MSwxLjUsMS41LDEuNUgxOWMwLjgyOSwwLDEuNS0wLjY3MiwxLjUtMS41di02LjE2NiAgQzIwLjUsMjkuNDQ1LDE5LjgyOSwyOC43NzMsMTksMjguNzczeiBNMTcuNSwzNC45MzlINXYtMy4xNjZoMTIuNVYzNC45Mzl6Ig0KICAgIGZpbGw9IndoaXRlIi8+DQogIDxwYXRoDQogICAgZD0iTTE5LDQwLjg1OUgzLjVjLTAuODI5LDAtMS41LDAuNjcyLTEuNSwxLjV2MTcuMjY2YzAsMC44MjgsMC42NzEsMS41LDEuNSwxLjVIMTljMC44MjksMCwxLjUtMC42NzIsMS41LTEuNVY0Mi4zNTkgIEMyMC41LDQxLjUzMSwxOS44MjksNDAuODU5LDE5LDQwLjg1OXogTTE3LjUsNTguMTI1SDVWNDMuODU5aDEyLjVWNTguMTI1eiINCiAgICBmaWxsPSJ3aGl0ZSIvPg0KICA8cGF0aA0KICAgIGQ9Ik00MCwyLjg3NUgyNC41Yy0wLjgyOSwwLTEuNSwwLjY3MS0xLjUsMS41djE0LjI1YzAsMC44MjksMC42NzEsMS41LDEuNSwxLjVINDBjMC44MjgsMCwxLjUtMC42NzEsMS41LTEuNVY0LjM3NSAgQzQxLjUsMy41NDYsNDAuODI4LDIuODc1LDQwLDIuODc1eiBNMzguNSwxNy4xMjVIMjZWNS44NzVoMTIuNVYxNy4xMjV6Ig0KICAgIGZpbGw9IndoaXRlIi8+DQogIDxwYXRoDQogICAgZD0iTTQwLDIzLjEyNUgyNC41Yy0wLjgyOSwwLTEuNSwwLjY3MS0xLjUsMS41VjQ2LjVjMCwwLjgyOCwwLjY3MSwxLjUsMS41LDEuNUg0MGMwLjgyOCwwLDEuNS0wLjY3MiwxLjUtMS41VjI0LjYyNSAgQzQxLjUsMjMuNzk2LDQwLjgyOCwyMy4xMjUsNDAsMjMuMTI1eiBNMzguNSw0NUgyNlYyNi4xMjVoMTIuNVY0NXoiDQogICAgZmlsbD0id2hpdGUiLz4NCiAgPHBhdGgNCiAgICBkPSJNNDAsNTFIMjQuNWMtMC44MjksMC0xLjUsMC42NzItMS41LDEuNXY3LjEyNWMwLDAuODI4LDAuNjcxLDEuNSwxLjUsMS41SDQwYzAuODI4LDAsMS41LTAuNjcyLDEuNS0xLjVWNTIuNSAgQzQxLjUsNTEuNjcyLDQwLjgyOCw1MSw0MCw1MXogTTM4LjUsNTguMTI1SDI2VjU0aDEyLjVWNTguMTI1eiINCiAgICBmaWxsPSJ3aGl0ZSIvPg0KICA8cGF0aA0KICAgIGQ9Ik02MC41LDIuODc1SDQ1Yy0wLjgyOCwwLTEuNSwwLjY3MS0xLjUsMS41djM1LjE3MWMwLDAuODI4LDAuNjcyLDEuNSwxLjUsMS41aDE1LjVjMC44MjgsMCwxLjUtMC42NzIsMS41LTEuNVY0LjM3NSAgQzYyLDMuNTQ2LDYxLjMyOCwyLjg3NSw2MC41LDIuODc1eiBNNTksMzguMDQ2SDQ2LjVWNS44NzVINTlWMzguMDQ2eiINCiAgICBmaWxsPSJ3aGl0ZSIvPg0KICA8cGF0aA0KICAgIGQ9Ik02MC41LDQ0LjM0Nkg0NWMtMC44MjgsMC0xLjUsMC42NzItMS41LDEuNXYxMy43NzljMCwwLjgyOCwwLjY3MiwxLjUsMS41LDEuNWgxNS41YzAuODI4LDAsMS41LTAuNjcyLDEuNS0xLjVWNDUuODQ2ICBDNjIsNDUuMDE4LDYxLjMyOCw0NC4zNDYsNjAuNSw0NC4zNDZ6IE01OSw1OC4xMjVINDYuNVY0Ny4zNDZINTlWNTguMTI1eiINCiAgICBmaWxsPSJ3aGl0ZSIvPg0KPC9zdmc+";
  const SVG_LIST = "data:image/svg+xml;base64,PHN2Zw0KICB2aWV3Qm94PSIwIDAgMzIgMzIiDQogIHdpZHRoPSIyMCINCiAgaGVpZ2h0PSIyMCINCiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KPg0KICA8ZGVmcz4NCiAgICA8c3R5bGU+DQogICAgICAuY2xzLTEgew0KICAgICAgICBmaWxsOiBub25lOw0KICAgICAgICBzdHJva2U6ICNmZmY7DQogICAgICAgIHN0cm9rZS1saW5lY2FwOiByb3VuZDsNCiAgICAgICAgc3Ryb2tlLWxpbmVqb2luOiByb3VuZDsNCiAgICAgICAgc3Ryb2tlLXdpZHRoOiAycHg7DQogICAgICB9DQogICAgPC9zdHlsZT4NCiAgPC9kZWZzPg0KICA8dGl0bGUgLz4NCiAgPGcgZGF0YS1uYW1lPSI0My1icm93c2VyIiBpZD0iXzQzLWJyb3dzZXIiPg0KICAgIDxyZWN0IGNsYXNzPSJjbHMtMSIgaGVpZ2h0PSIzMCIgd2lkdGg9IjMwIiB4PSIxIiB5PSIxIiAvPg0KICAgIDxsaW5lIGNsYXNzPSJjbHMtMSIgeDE9IjEiIHgyPSIzMSIgeTE9IjkiIHkyPSI5IiAvPg0KICAgIDxsaW5lIGNsYXNzPSJjbHMtMSIgeDE9IjUiIHgyPSI3IiB5MT0iNSIgeTI9IjUiIC8+DQogICAgPGxpbmUgY2xhc3M9ImNscy0xIiB4MT0iMTEiIHgyPSIxMyIgeTE9IjUiIHkyPSI1IiAvPg0KICAgIDxsaW5lIGNsYXNzPSJjbHMtMSIgeDE9IjkiIHgyPSIyNSIgeTE9IjE2IiB5Mj0iMTYiIC8+DQogICAgPGxpbmUgY2xhc3M9ImNscy0xIiB4MT0iNyIgeDI9IjI1IiB5MT0iMjAiIHkyPSIyMCIgLz4NCiAgICA8bGluZSBjbGFzcz0iY2xzLTEiIHgxPSI3IiB4Mj0iMjUiIHkxPSIyNCIgeTI9IjI0IiAvPg0KICA8L2c+DQo8L3N2Zz4=";
  function create_fragment$e(ctx) {
    let svg;
    let line0;
    let line1;
    return {
      c() {
        svg = svg_element("svg");
        line0 = svg_element("line");
        line1 = svg_element("line");
        attr(line0, "x1", "20");
        attr(line0, "x2", "6");
        attr(line0, "y1", "6");
        attr(line0, "y2", "20");
        attr(line1, "x1", "6");
        attr(line1, "x2", "20");
        attr(line1, "y1", "6");
        attr(line1, "y2", "20");
        attr(svg, "class", "feather feather-x");
        attr(svg, "fill", "currentColor");
        attr(svg, "height", "28");
        attr(svg, "width", "28");
        attr(svg, "stroke", "currentColor");
        attr(svg, "stroke-linecap", "round");
        attr(svg, "stroke-linejoin", "round");
        attr(svg, "stroke-width", "2");
        attr(svg, "viewBox", "0 0 24 24");
        set_style(svg, "color", "black");
        attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      },
      m(target, anchor) {
        insert(target, svg, anchor);
        append(svg, line0);
        append(svg, line1);
      },
      p: noop,
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(svg);
      }
    };
  }
  class Icon_cross extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, null, create_fragment$e, safe_not_equal, {});
    }
  }
  function create_fragment$d(ctx) {
    let svg;
    let path0;
    let path1;
    return {
      c() {
        svg = svg_element("svg");
        path0 = svg_element("path");
        path1 = svg_element("path");
        attr(path0, "d", "M19.334,1.298c-0.005-0.037-0.005-0.074-0.013-0.109c-0.01-0.047-0.029-0.092-0.043-0.139  c-0.015-0.046-0.025-0.095-0.044-0.139c-0.016-0.037-0.039-0.071-0.058-0.107c-0.026-0.049-0.049-0.1-0.08-0.146  c-0.023-0.034-0.053-0.063-0.079-0.095c-0.035-0.043-0.068-0.089-0.107-0.128c-0.024-0.024-0.053-0.043-0.079-0.065  c-0.049-0.042-0.099-0.086-0.153-0.122c-0.004-0.002-0.007-0.006-0.011-0.009c-0.027-0.018-0.058-0.028-0.086-0.043  c-0.054-0.03-0.107-0.062-0.166-0.085c-0.043-0.017-0.087-0.027-0.131-0.041c-0.05-0.015-0.099-0.032-0.15-0.042  c-0.055-0.011-0.109-0.013-0.165-0.017C17.931,0.009,17.894,0,17.855,0c-0.006,0-0.011,0.001-0.017,0.002  c-0.054,0-0.106,0.009-0.16,0.016c-0.046,0.006-0.093,0.007-0.138,0.017c-0.027,0.005-0.052,0.017-0.078,0.024  c-0.068,0.018-0.135,0.036-0.199,0.063c-0.007,0.003-0.013,0.008-0.02,0.011c-0.081,0.036-0.159,0.078-0.232,0.127  c-0.023,0.016-0.043,0.037-0.066,0.055c-0.054,0.042-0.109,0.083-0.157,0.131c-0.021,0.022-0.039,0.049-0.06,0.072  c-0.045,0.051-0.089,0.103-0.127,0.159c-0.002,0.004-0.006,0.007-0.009,0.011L0.239,26.081c-0.448,0.696-0.248,1.625,0.449,2.073  c0.251,0.162,0.532,0.239,0.811,0.239c0.493,0,0.976-0.243,1.263-0.688L16.355,6.599v51.067c0,0.828,0.671,1.5,1.5,1.5  s1.5-0.672,1.5-1.5V1.5c0-0.005-0.001-0.01-0.001-0.015C19.353,1.422,19.343,1.36,19.334,1.298z");
        attr(path0, "fill", "white");
        attr(path1, "d", "M58.693,31.013c-0.697-0.449-1.625-0.248-2.073,0.448L43.026,52.567V1.5c0-0.829-0.672-1.5-1.5-1.5s-1.5,0.671-1.5,1.5  v56.166c0,0.005,0.001,0.009,0.001,0.014c0.001,0.067,0.011,0.133,0.021,0.199c0.005,0.032,0.005,0.065,0.012,0.098  c0.012,0.058,0.033,0.112,0.053,0.169c0.012,0.036,0.02,0.073,0.034,0.108c0.025,0.06,0.061,0.116,0.094,0.173  c0.016,0.025,0.026,0.055,0.044,0.079c0.03,0.045,0.068,0.085,0.104,0.126c0.027,0.033,0.052,0.068,0.082,0.098  c0.027,0.027,0.061,0.049,0.09,0.074c0.046,0.039,0.092,0.08,0.143,0.114c0.004,0.002,0.008,0.006,0.012,0.009  c0.011,0.007,0.022,0.009,0.033,0.016c0.098,0.06,0.202,0.105,0.313,0.143c0.03,0.01,0.061,0.021,0.092,0.028  c0.119,0.03,0.242,0.052,0.37,0.053c0.001,0,0.002,0,0.003,0l0,0c0.001,0,0.001,0,0.001,0c0.117,0,0.229-0.017,0.338-0.042  c0.031-0.007,0.061-0.019,0.091-0.027c0.078-0.023,0.154-0.052,0.227-0.088c0.035-0.017,0.068-0.035,0.102-0.055  c0.069-0.041,0.133-0.087,0.194-0.137c0.027-0.022,0.055-0.043,0.081-0.067c0.083-0.079,0.157-0.166,0.221-0.262  c0.002-0.004,0.006-0.006,0.008-0.01l16.354-25.393C59.591,32.39,59.39,31.461,58.693,31.013z");
        attr(path1, "fill", "white");
        attr(svg, "enable-background", "new 0 0 59.381 59.166");
        attr(svg, "height", "20");
        attr(svg, "id", "Layer_1");
        attr(svg, "version", "1.1");
        attr(svg, "viewBox", "0 0 59.381 59.166");
        attr(svg, "width", "20");
        attr(svg, "xml:space", "preserve");
        attr(svg, "xmlns", "http://www.w3.org/2000/svg");
        attr(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
      },
      m(target, anchor) {
        insert(target, svg, anchor);
        append(svg, path0);
        append(svg, path1);
      },
      p: noop,
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(svg);
      }
    };
  }
  class Icon_sort extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, null, create_fragment$d, safe_not_equal, {});
    }
  }
  function create_else_block$4(ctx) {
    let div0;
    let img;
    let img_src_value;
    let t0;
    let div1;
    return {
      c() {
        div0 = element("div");
        img = element("img");
        t0 = space();
        div1 = element("div");
        div1.textContent = "列表";
        if (!src_url_equal(img.src, img_src_value = SVG_LIST))
          attr(img, "src", img_src_value);
        attr(img, "alt", "SVG_LIST");
      },
      m(target, anchor) {
        insert(target, div0, anchor);
        append(div0, img);
        insert(target, t0, anchor);
        insert(target, div1, anchor);
      },
      p: noop,
      d(detaching) {
        if (detaching)
          detach(div0);
        if (detaching)
          detach(t0);
        if (detaching)
          detach(div1);
      }
    };
  }
  function create_if_block_4$2(ctx) {
    let div0;
    let img;
    let img_src_value;
    let t0;
    let div1;
    return {
      c() {
        div0 = element("div");
        img = element("img");
        t0 = space();
        div1 = element("div");
        div1.textContent = "瀑布";
        if (!src_url_equal(img.src, img_src_value = SVG_MASONRY))
          attr(img, "src", img_src_value);
        attr(img, "alt", "SVG_MASONRY");
      },
      m(target, anchor) {
        insert(target, div0, anchor);
        append(div0, img);
        insert(target, t0, anchor);
        insert(target, div1, anchor);
      },
      p: noop,
      d(detaching) {
        if (detaching)
          detach(div0);
        if (detaching)
          detach(t0);
        if (detaching)
          detach(div1);
      }
    };
  }
  function create_if_block_3$2(ctx) {
    let button0;
    let t1;
    let button1;
    let t2;
    let t3;
    let button2;
    let mounted;
    let dispose;
    return {
      c() {
        button0 = element("button");
        button0.textContent = "显示详情";
        t1 = space();
        button1 = element("button");
        t2 = text(
          /*label_switchMode*/
          ctx[1]
        );
        t3 = space();
        button2 = element("button");
        button2.textContent = "iframe";
        attr(button0, "class", "sideP__btn svelte-gqty0r");
        attr(button1, "class", "sideP__btn svelte-gqty0r");
        attr(button2, "class", "sideP__btn svelte-gqty0r");
      },
      m(target, anchor) {
        insert(target, button0, anchor);
        insert(target, t1, anchor);
        insert(target, button1, anchor);
        append(button1, t2);
        insert(target, t3, anchor);
        insert(target, button2, anchor);
        if (!mounted) {
          dispose = [
            listen(
              button0,
              "click",
              /*config_showAllDetails*/
              ctx[20]
            ),
            listen(
              button1,
              "click",
              /*config_switchMode*/
              ctx[21]
            ),
            listen(
              button2,
              "click",
              /*config_changeLoadMode*/
              ctx[22]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*label_switchMode*/
        2)
          set_data(
            t2,
            /*label_switchMode*/
            ctx2[1]
          );
      },
      d(detaching) {
        if (detaching)
          detach(button0);
        if (detaching)
          detach(t1);
        if (detaching)
          detach(button1);
        if (detaching)
          detach(t3);
        if (detaching)
          detach(button2);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_if_block$7(ctx) {
    let div10;
    let div9;
    let div0;
    let p;
    let t1;
    let button;
    let iconcross;
    let t2;
    let show_if = (
      /*$_current_domain*/
      ctx[7].includes("m-team")
    );
    let t3;
    let div2;
    let h10;
    let t5;
    let div1;
    let switch0;
    let updating_checked;
    let t6;
    let br0;
    let t7;
    let switch1;
    let updating_checked_1;
    let t8;
    let br1;
    let t9;
    let switch2;
    let updating_checked_2;
    let t10;
    let br2;
    let t11;
    let switch3;
    let updating_checked_3;
    let t12;
    let switch4;
    let updating_checked_4;
    let t13;
    let t14;
    let br3;
    let t15;
    let switch5;
    let updating_checked_5;
    let t16;
    let div4;
    let h11;
    let t18;
    let div3;
    let switch6;
    let t19;
    let switch7;
    let t20;
    let div8;
    let h12;
    let t22;
    let div5;
    let switch8;
    let updating_checked_6;
    let t23;
    let div7;
    let h3;
    let t25;
    let div6;
    let switch9;
    let updating_checked_7;
    let t26;
    let switch10;
    let updating_checked_8;
    let t27;
    let switch11;
    let updating_checked_9;
    let t28;
    let switch12;
    let updating_checked_10;
    let t29;
    let switch13;
    let updating_checked_11;
    let t30;
    let switch14;
    let updating_checked_12;
    let t31;
    let switch15;
    let updating_checked_13;
    let div10_transition;
    let current;
    let mounted;
    let dispose;
    iconcross = new Icon_cross({});
    let if_block0 = show_if && create_if_block_2$3(ctx);
    function switch0_checked_binding(value) {
      ctx[29](value);
    }
    let switch0_props = {
      title_fixed: "显示模式",
      title_green: "瀑布流",
      title_red: "原始表格",
      label: (
        /*$_current_domain*/
        ctx[7].includes("m-team") ? "" : "原始表格模式仅支持点击图片显示iframe和加载下一页"
      ),
      func: (
        /*func_1*/
        ctx[28]
      )
    };
    if (
      /*$_list_viewMode*/
      ctx[4] !== void 0
    ) {
      switch0_props.checked = /*$_list_viewMode*/
      ctx[4];
    }
    switch0 = new Switch({ props: switch0_props });
    binding_callbacks.push(() => bind(switch0, "checked", switch0_checked_binding));
    function switch1_checked_binding(value) {
      ctx[30](value);
    }
    let switch1_props = {
      title_fixed: "加载下一页方式",
      title_green: "按钮(默认)",
      title_red: "滚动(谨慎使用)",
      label: "滚动模式下 MT 等网站频繁使用可能会导致 120",
      green_state: false
    };
    if (
      /*$_turnPage*/
      ctx[2] !== void 0
    ) {
      switch1_props.checked = /*$_turnPage*/
      ctx[2];
    }
    switch1 = new Switch({ props: switch1_props });
    binding_callbacks.push(() => bind(switch1, "checked", switch1_checked_binding));
    function switch2_checked_binding(value) {
      ctx[31](value);
    }
    let switch2_props = {
      title_fixed: "卡片移动动画",
      title_green: "开启",
      title_red: "关闭",
      label: "开启关闭瀑布流卡片高度变化时的缓动动画",
      green_state: true
    };
    if (
      /*$_animated*/
      ctx[11] !== void 0
    ) {
      switch2_props.checked = /*$_animated*/
      ctx[11];
    }
    switch2 = new Switch({ props: switch2_props });
    binding_callbacks.push(() => bind(switch2, "checked", switch2_checked_binding));
    function switch3_checked_binding(value) {
      ctx[32](value);
    }
    let switch3_props = {
      title_fixed: "悬浮预览大图",
      title_green: "默认开启",
      title_red: "核心功能->确定不用再关"
    };
    if (
      /*$_show_nexus_pic*/
      ctx[12] !== void 0
    ) {
      switch3_props.checked = /*$_show_nexus_pic*/
      ctx[12];
    }
    switch3 = new Switch({ props: switch3_props });
    binding_callbacks.push(() => bind(switch3, "checked", switch3_checked_binding));
    function switch4_checked_binding(value) {
      ctx[33](value);
    }
    let switch4_props = {
      title_fixed: "预览大图方式",
      title_green: "局部悬浮预览区域",
      title_red: "全图悬浮预览",
      label: "开发中 <br> 为优化用户预览大图体验 <br> 鼠标放到图片上就显示大图会遮挡信息 <br> 指定在图片的局部 区域放大"
    };
    if (
      /*$_trigger_nexus_pic*/
      ctx[13] !== void 0
    ) {
      switch4_props.checked = /*$_trigger_nexus_pic*/
      ctx[13];
    }
    switch4 = new Switch({ props: switch4_props });
    binding_callbacks.push(() => bind(switch4, "checked", switch4_checked_binding));
    let if_block1 = (
      /*$_show_nexus_pic*/
      ctx[12] && create_if_block_1$4(ctx)
    );
    function switch5_checked_binding(value) {
      ctx[35](value);
    }
    let switch5_props = {
      title_fixed: "侧边栏debug按钮",
      title_green: "隐藏(默认)",
      title_red: "显示(开发用)",
      green_state: false
    };
    if (
      /*$_show_debug_btn*/
      ctx[10] !== void 0
    ) {
      switch5_props.checked = /*$_show_debug_btn*/
      ctx[10];
    }
    switch5 = new Switch({ props: switch5_props });
    binding_callbacks.push(() => bind(switch5, "checked", switch5_checked_binding));
    switch6 = new Switch({
      props: {
        title_fixed: `卡片列数: ${/*$_card_layout*/
      ctx[15].column}`,
        label: "范围: 2~7 列",
        type: "range",
        $$slots: { default: [create_default_slot_1] },
        $$scope: { ctx }
      }
    });
    switch7 = new Switch({
      props: {
        title_fixed: `卡片间距: ${/*$_card_layout*/
      ctx[15].gap}px`,
        label: "范围: 2~100 px",
        type: "range",
        $$slots: { default: [create_default_slot] },
        $$scope: { ctx }
      }
    });
    function switch8_checked_binding(value) {
      ctx[38](value);
    }
    let switch8_props = {
      title_fixed: "卡片信息",
      title_green: "显示下方所选信息(精简)",
      title_red: "显示所有信息(较乱)",
      green_state: false,
      func: sortMasonry
    };
    if (
      /*$_CARD_SHOW*/
      ctx[3].all !== void 0
    ) {
      switch8_props.checked = /*$_CARD_SHOW*/
      ctx[3].all;
    }
    switch8 = new Switch({ props: switch8_props });
    binding_callbacks.push(() => bind(switch8, "checked", switch8_checked_binding));
    function switch9_checked_binding(value) {
      ctx[39](value);
    }
    let switch9_props = { title_fixed: "显示种子名称", func: sortMasonry };
    if (
      /*$_CARD_SHOW*/
      ctx[3].title !== void 0
    ) {
      switch9_props.checked = /*$_CARD_SHOW*/
      ctx[3].title;
    }
    switch9 = new Switch({ props: switch9_props });
    binding_callbacks.push(() => bind(switch9, "checked", switch9_checked_binding));
    function switch10_checked_binding(value) {
      ctx[40](value);
    }
    let switch10_props = {
      title_fixed: "显示置顶和免费",
      func: sortMasonry
    };
    if (
      /*$_CARD_SHOW*/
      ctx[3].free !== void 0
    ) {
      switch10_props.checked = /*$_CARD_SHOW*/
      ctx[3].free;
    }
    switch10 = new Switch({ props: switch10_props });
    binding_callbacks.push(() => bind(switch10, "checked", switch10_checked_binding));
    function switch11_checked_binding(value) {
      ctx[41](value);
    }
    let switch11_props = { title_fixed: "显示副标题", func: sortMasonry };
    if (
      /*$_CARD_SHOW*/
      ctx[3].sub_title !== void 0
    ) {
      switch11_props.checked = /*$_CARD_SHOW*/
      ctx[3].sub_title;
    }
    switch11 = new Switch({ props: switch11_props });
    binding_callbacks.push(() => bind(switch11, "checked", switch11_checked_binding));
    function switch12_checked_binding(value) {
      ctx[42](value);
    }
    let switch12_props = { title_fixed: "显示标签", func: sortMasonry };
    if (
      /*$_CARD_SHOW*/
      ctx[3].tags !== void 0
    ) {
      switch12_props.checked = /*$_CARD_SHOW*/
      ctx[3].tags;
    }
    switch12 = new Switch({ props: switch12_props });
    binding_callbacks.push(() => bind(switch12, "checked", switch12_checked_binding));
    function switch13_checked_binding(value) {
      ctx[43](value);
    }
    let switch13_props = {
      title_fixed: "显示 [大小/下载/收藏]",
      func: sortMasonry
    };
    if (
      /*$_CARD_SHOW*/
      ctx[3].size_download_collect !== void 0
    ) {
      switch13_props.checked = /*$_CARD_SHOW*/
      ctx[3].size_download_collect;
    }
    switch13 = new Switch({ props: switch13_props });
    binding_callbacks.push(() => bind(switch13, "checked", switch13_checked_binding));
    function switch14_checked_binding(value) {
      ctx[44](value);
    }
    let switch14_props = { title_fixed: "显示上传时间", func: sortMasonry };
    if (
      /*$_CARD_SHOW*/
      ctx[3].upload_time !== void 0
    ) {
      switch14_props.checked = /*$_CARD_SHOW*/
      ctx[3].upload_time;
    }
    switch14 = new Switch({ props: switch14_props });
    binding_callbacks.push(() => bind(switch14, "checked", switch14_checked_binding));
    function switch15_checked_binding(value) {
      ctx[45](value);
    }
    let switch15_props = {
      title_fixed: "显示 [评论/上传/下载/完成]",
      func: sortMasonry
    };
    if (
      /*$_CARD_SHOW*/
      ctx[3].statistics !== void 0
    ) {
      switch15_props.checked = /*$_CARD_SHOW*/
      ctx[3].statistics;
    }
    switch15 = new Switch({ props: switch15_props });
    binding_callbacks.push(() => bind(switch15, "checked", switch15_checked_binding));
    return {
      c() {
        div10 = element("div");
        div9 = element("div");
        div0 = element("div");
        p = element("p");
        p.textContent = "详细配置面板";
        t1 = space();
        button = element("button");
        create_component(iconcross.$$.fragment);
        t2 = space();
        if (if_block0)
          if_block0.c();
        t3 = space();
        div2 = element("div");
        h10 = element("h1");
        h10.textContent = "常用配置";
        t5 = space();
        div1 = element("div");
        create_component(switch0.$$.fragment);
        t6 = space();
        br0 = element("br");
        t7 = space();
        create_component(switch1.$$.fragment);
        t8 = space();
        br1 = element("br");
        t9 = space();
        create_component(switch2.$$.fragment);
        t10 = space();
        br2 = element("br");
        t11 = space();
        create_component(switch3.$$.fragment);
        t12 = space();
        create_component(switch4.$$.fragment);
        t13 = space();
        if (if_block1)
          if_block1.c();
        t14 = space();
        br3 = element("br");
        t15 = space();
        create_component(switch5.$$.fragment);
        t16 = space();
        div4 = element("div");
        h11 = element("h1");
        h11.textContent = "卡片布局";
        t18 = space();
        div3 = element("div");
        create_component(switch6.$$.fragment);
        t19 = space();
        create_component(switch7.$$.fragment);
        t20 = space();
        div8 = element("div");
        h12 = element("h1");
        h12.textContent = "卡片信息";
        t22 = space();
        div5 = element("div");
        create_component(switch8.$$.fragment);
        t23 = space();
        div7 = element("div");
        h3 = element("h3");
        h3.textContent = "配置常驻卡片信息";
        t25 = space();
        div6 = element("div");
        create_component(switch9.$$.fragment);
        t26 = space();
        create_component(switch10.$$.fragment);
        t27 = space();
        create_component(switch11.$$.fragment);
        t28 = space();
        create_component(switch12.$$.fragment);
        t29 = space();
        create_component(switch13.$$.fragment);
        t30 = space();
        create_component(switch14.$$.fragment);
        t31 = space();
        create_component(switch15.$$.fragment);
        set_style(p, "margin", "auto 0");
        attr(div0, "class", "configP_title svelte-gqty0r");
        attr(h10, "class", "s_title");
        attr(div1, "class", "s_panel");
        attr(div2, "class", "section svelte-gqty0r");
        attr(h11, "class", "s_title");
        attr(div3, "class", "s_panel");
        attr(div4, "class", "section svelte-gqty0r");
        attr(h12, "class", "s_title");
        attr(div5, "class", "s_panel");
        attr(h3, "class", "s_title");
        attr(div6, "class", "s_panel");
        attr(div7, "class", "section svelte-gqty0r");
        attr(div8, "class", "section svelte-gqty0r");
        attr(div9, "class", "configP_holder svelte-gqty0r");
        attr(div10, "class", "configP svelte-gqty0r");
      },
      m(target, anchor) {
        insert(target, div10, anchor);
        append(div10, div9);
        append(div9, div0);
        append(div0, p);
        append(div0, t1);
        append(div0, button);
        mount_component(iconcross, button, null);
        append(div9, t2);
        if (if_block0)
          if_block0.m(div9, null);
        append(div9, t3);
        append(div9, div2);
        append(div2, h10);
        append(div2, t5);
        append(div2, div1);
        mount_component(switch0, div1, null);
        append(div1, t6);
        append(div1, br0);
        append(div1, t7);
        mount_component(switch1, div1, null);
        append(div1, t8);
        append(div1, br1);
        append(div1, t9);
        mount_component(switch2, div1, null);
        append(div1, t10);
        append(div1, br2);
        append(div1, t11);
        mount_component(switch3, div1, null);
        append(div1, t12);
        mount_component(switch4, div1, null);
        append(div1, t13);
        if (if_block1)
          if_block1.m(div1, null);
        append(div1, t14);
        append(div1, br3);
        append(div1, t15);
        mount_component(switch5, div1, null);
        append(div9, t16);
        append(div9, div4);
        append(div4, h11);
        append(div4, t18);
        append(div4, div3);
        mount_component(switch6, div3, null);
        append(div3, t19);
        mount_component(switch7, div3, null);
        append(div9, t20);
        append(div9, div8);
        append(div8, h12);
        append(div8, t22);
        append(div8, div5);
        mount_component(switch8, div5, null);
        append(div8, t23);
        append(div8, div7);
        append(div7, h3);
        append(div7, t25);
        append(div7, div6);
        mount_component(switch9, div6, null);
        append(div6, t26);
        mount_component(switch10, div6, null);
        append(div6, t27);
        mount_component(switch11, div6, null);
        append(div6, t28);
        mount_component(switch12, div6, null);
        append(div6, t29);
        mount_component(switch13, div6, null);
        append(div6, t30);
        mount_component(switch14, div6, null);
        append(div6, t31);
        mount_component(switch15, div6, null);
        current = true;
        if (!mounted) {
          dispose = [
            listen(
              button,
              "click",
              /*click_handler_1*/
              ctx[25]
            ),
            listen(div10, "click", self(
              /*click_handler_2*/
              ctx[46]
            ))
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*$_current_domain*/
        128)
          show_if = /*$_current_domain*/
          ctx2[7].includes("m-team");
        if (show_if) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
            if (dirty[0] & /*$_current_domain*/
            128) {
              transition_in(if_block0, 1);
            }
          } else {
            if_block0 = create_if_block_2$3(ctx2);
            if_block0.c();
            transition_in(if_block0, 1);
            if_block0.m(div9, t3);
          }
        } else if (if_block0) {
          group_outros();
          transition_out(if_block0, 1, 1, () => {
            if_block0 = null;
          });
          check_outros();
        }
        const switch0_changes = {};
        if (dirty[0] & /*$_current_domain*/
        128)
          switch0_changes.label = /*$_current_domain*/
          ctx2[7].includes("m-team") ? "" : "原始表格模式仅支持点击图片显示iframe和加载下一页";
        if (!updating_checked && dirty[0] & /*$_list_viewMode*/
        16) {
          updating_checked = true;
          switch0_changes.checked = /*$_list_viewMode*/
          ctx2[4];
          add_flush_callback(() => updating_checked = false);
        }
        switch0.$set(switch0_changes);
        const switch1_changes = {};
        if (!updating_checked_1 && dirty[0] & /*$_turnPage*/
        4) {
          updating_checked_1 = true;
          switch1_changes.checked = /*$_turnPage*/
          ctx2[2];
          add_flush_callback(() => updating_checked_1 = false);
        }
        switch1.$set(switch1_changes);
        const switch2_changes = {};
        if (!updating_checked_2 && dirty[0] & /*$_animated*/
        2048) {
          updating_checked_2 = true;
          switch2_changes.checked = /*$_animated*/
          ctx2[11];
          add_flush_callback(() => updating_checked_2 = false);
        }
        switch2.$set(switch2_changes);
        const switch3_changes = {};
        if (!updating_checked_3 && dirty[0] & /*$_show_nexus_pic*/
        4096) {
          updating_checked_3 = true;
          switch3_changes.checked = /*$_show_nexus_pic*/
          ctx2[12];
          add_flush_callback(() => updating_checked_3 = false);
        }
        switch3.$set(switch3_changes);
        const switch4_changes = {};
        if (!updating_checked_4 && dirty[0] & /*$_trigger_nexus_pic*/
        8192) {
          updating_checked_4 = true;
          switch4_changes.checked = /*$_trigger_nexus_pic*/
          ctx2[13];
          add_flush_callback(() => updating_checked_4 = false);
        }
        switch4.$set(switch4_changes);
        if (
          /*$_show_nexus_pic*/
          ctx2[12]
        ) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
            if (dirty[0] & /*$_show_nexus_pic*/
            4096) {
              transition_in(if_block1, 1);
            }
          } else {
            if_block1 = create_if_block_1$4(ctx2);
            if_block1.c();
            transition_in(if_block1, 1);
            if_block1.m(div1, t14);
          }
        } else if (if_block1) {
          group_outros();
          transition_out(if_block1, 1, 1, () => {
            if_block1 = null;
          });
          check_outros();
        }
        const switch5_changes = {};
        if (!updating_checked_5 && dirty[0] & /*$_show_debug_btn*/
        1024) {
          updating_checked_5 = true;
          switch5_changes.checked = /*$_show_debug_btn*/
          ctx2[10];
          add_flush_callback(() => updating_checked_5 = false);
        }
        switch5.$set(switch5_changes);
        const switch6_changes = {};
        if (dirty[0] & /*$_card_layout*/
        32768)
          switch6_changes.title_fixed = `卡片列数: ${/*$_card_layout*/
        ctx2[15].column}`;
        if (dirty[0] & /*$_card_layout*/
        32768 | dirty[1] & /*$$scope*/
        8388608) {
          switch6_changes.$$scope = { dirty, ctx: ctx2 };
        }
        switch6.$set(switch6_changes);
        const switch7_changes = {};
        if (dirty[0] & /*$_card_layout*/
        32768)
          switch7_changes.title_fixed = `卡片间距: ${/*$_card_layout*/
        ctx2[15].gap}px`;
        if (dirty[0] & /*$_card_layout*/
        32768 | dirty[1] & /*$$scope*/
        8388608) {
          switch7_changes.$$scope = { dirty, ctx: ctx2 };
        }
        switch7.$set(switch7_changes);
        const switch8_changes = {};
        if (!updating_checked_6 && dirty[0] & /*$_CARD_SHOW*/
        8) {
          updating_checked_6 = true;
          switch8_changes.checked = /*$_CARD_SHOW*/
          ctx2[3].all;
          add_flush_callback(() => updating_checked_6 = false);
        }
        switch8.$set(switch8_changes);
        const switch9_changes = {};
        if (!updating_checked_7 && dirty[0] & /*$_CARD_SHOW*/
        8) {
          updating_checked_7 = true;
          switch9_changes.checked = /*$_CARD_SHOW*/
          ctx2[3].title;
          add_flush_callback(() => updating_checked_7 = false);
        }
        switch9.$set(switch9_changes);
        const switch10_changes = {};
        if (!updating_checked_8 && dirty[0] & /*$_CARD_SHOW*/
        8) {
          updating_checked_8 = true;
          switch10_changes.checked = /*$_CARD_SHOW*/
          ctx2[3].free;
          add_flush_callback(() => updating_checked_8 = false);
        }
        switch10.$set(switch10_changes);
        const switch11_changes = {};
        if (!updating_checked_9 && dirty[0] & /*$_CARD_SHOW*/
        8) {
          updating_checked_9 = true;
          switch11_changes.checked = /*$_CARD_SHOW*/
          ctx2[3].sub_title;
          add_flush_callback(() => updating_checked_9 = false);
        }
        switch11.$set(switch11_changes);
        const switch12_changes = {};
        if (!updating_checked_10 && dirty[0] & /*$_CARD_SHOW*/
        8) {
          updating_checked_10 = true;
          switch12_changes.checked = /*$_CARD_SHOW*/
          ctx2[3].tags;
          add_flush_callback(() => updating_checked_10 = false);
        }
        switch12.$set(switch12_changes);
        const switch13_changes = {};
        if (!updating_checked_11 && dirty[0] & /*$_CARD_SHOW*/
        8) {
          updating_checked_11 = true;
          switch13_changes.checked = /*$_CARD_SHOW*/
          ctx2[3].size_download_collect;
          add_flush_callback(() => updating_checked_11 = false);
        }
        switch13.$set(switch13_changes);
        const switch14_changes = {};
        if (!updating_checked_12 && dirty[0] & /*$_CARD_SHOW*/
        8) {
          updating_checked_12 = true;
          switch14_changes.checked = /*$_CARD_SHOW*/
          ctx2[3].upload_time;
          add_flush_callback(() => updating_checked_12 = false);
        }
        switch14.$set(switch14_changes);
        const switch15_changes = {};
        if (!updating_checked_13 && dirty[0] & /*$_CARD_SHOW*/
        8) {
          updating_checked_13 = true;
          switch15_changes.checked = /*$_CARD_SHOW*/
          ctx2[3].statistics;
          add_flush_callback(() => updating_checked_13 = false);
        }
        switch15.$set(switch15_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(iconcross.$$.fragment, local);
        transition_in(if_block0);
        transition_in(switch0.$$.fragment, local);
        transition_in(switch1.$$.fragment, local);
        transition_in(switch2.$$.fragment, local);
        transition_in(switch3.$$.fragment, local);
        transition_in(switch4.$$.fragment, local);
        transition_in(if_block1);
        transition_in(switch5.$$.fragment, local);
        transition_in(switch6.$$.fragment, local);
        transition_in(switch7.$$.fragment, local);
        transition_in(switch8.$$.fragment, local);
        transition_in(switch9.$$.fragment, local);
        transition_in(switch10.$$.fragment, local);
        transition_in(switch11.$$.fragment, local);
        transition_in(switch12.$$.fragment, local);
        transition_in(switch13.$$.fragment, local);
        transition_in(switch14.$$.fragment, local);
        transition_in(switch15.$$.fragment, local);
        add_render_callback(() => {
          if (!current)
            return;
          if (!div10_transition)
            div10_transition = create_bidirectional_transition(div10, fade, { duration: 100 }, true);
          div10_transition.run(1);
        });
        current = true;
      },
      o(local) {
        transition_out(iconcross.$$.fragment, local);
        transition_out(if_block0);
        transition_out(switch0.$$.fragment, local);
        transition_out(switch1.$$.fragment, local);
        transition_out(switch2.$$.fragment, local);
        transition_out(switch3.$$.fragment, local);
        transition_out(switch4.$$.fragment, local);
        transition_out(if_block1);
        transition_out(switch5.$$.fragment, local);
        transition_out(switch6.$$.fragment, local);
        transition_out(switch7.$$.fragment, local);
        transition_out(switch8.$$.fragment, local);
        transition_out(switch9.$$.fragment, local);
        transition_out(switch10.$$.fragment, local);
        transition_out(switch11.$$.fragment, local);
        transition_out(switch12.$$.fragment, local);
        transition_out(switch13.$$.fragment, local);
        transition_out(switch14.$$.fragment, local);
        transition_out(switch15.$$.fragment, local);
        if (!div10_transition)
          div10_transition = create_bidirectional_transition(div10, fade, { duration: 100 }, false);
        div10_transition.run(0);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div10);
        destroy_component(iconcross);
        if (if_block0)
          if_block0.d();
        destroy_component(switch0);
        destroy_component(switch1);
        destroy_component(switch2);
        destroy_component(switch3);
        destroy_component(switch4);
        if (if_block1)
          if_block1.d();
        destroy_component(switch5);
        destroy_component(switch6);
        destroy_component(switch7);
        destroy_component(switch8);
        destroy_component(switch9);
        destroy_component(switch10);
        destroy_component(switch11);
        destroy_component(switch12);
        destroy_component(switch13);
        destroy_component(switch14);
        destroy_component(switch15);
        if (detaching && div10_transition)
          div10_transition.end();
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_if_block_2$3(ctx) {
    let div1;
    let h1;
    let t1;
    let div0;
    let switch_1;
    let updating_checked;
    let current;
    function switch_1_checked_binding(value) {
      ctx[27](value);
    }
    let switch_1_props = {
      title_fixed: "隐藏Gay分区卡片",
      title_green: "隐藏(默认)",
      title_red: "显示(狠人)",
      func: (
        /*func*/
        ctx[26]
      )
    };
    if (
      /*$_SITE_SETTING*/
      ctx[8].mt.hide_gay !== void 0
    ) {
      switch_1_props.checked = /*$_SITE_SETTING*/
      ctx[8].mt.hide_gay;
    }
    switch_1 = new Switch({ props: switch_1_props });
    binding_callbacks.push(() => bind(switch_1, "checked", switch_1_checked_binding));
    return {
      c() {
        div1 = element("div");
        h1 = element("h1");
        h1.textContent = "MT专用配置";
        t1 = space();
        div0 = element("div");
        create_component(switch_1.$$.fragment);
        attr(h1, "class", "s_title");
        attr(div0, "class", "s_panel");
        attr(div1, "class", "section svelte-gqty0r");
      },
      m(target, anchor) {
        insert(target, div1, anchor);
        append(div1, h1);
        append(div1, t1);
        append(div1, div0);
        mount_component(switch_1, div0, null);
        current = true;
      },
      p(ctx2, dirty) {
        const switch_1_changes = {};
        if (!updating_checked && dirty[0] & /*$_SITE_SETTING*/
        256) {
          updating_checked = true;
          switch_1_changes.checked = /*$_SITE_SETTING*/
          ctx2[8].mt.hide_gay;
          add_flush_callback(() => updating_checked = false);
        }
        switch_1.$set(switch_1_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(switch_1.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(switch_1.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div1);
        destroy_component(switch_1);
      }
    };
  }
  function create_if_block_1$4(ctx) {
    let switch_1;
    let current;
    switch_1 = new Switch({
      props: {
        title_fixed: `悬浮预览延迟${/*$_delay_nexus_pic*/
      ctx[14] ? ":" + /*$_delay_nexus_pic*/
      ctx[14] + "ms" : ""}`,
        title_red: `${/*$_delay_nexus_pic*/
      ctx[14] ? "" : "无延迟"}`,
        label: "防止无意滑动时大图打开妨碍预览",
        type: "range",
        $$slots: { default: [create_default_slot_2] },
        $$scope: { ctx }
      }
    });
    return {
      c() {
        create_component(switch_1.$$.fragment);
      },
      m(target, anchor) {
        mount_component(switch_1, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const switch_1_changes = {};
        if (dirty[0] & /*$_delay_nexus_pic*/
        16384)
          switch_1_changes.title_fixed = `悬浮预览延迟${/*$_delay_nexus_pic*/
        ctx2[14] ? ":" + /*$_delay_nexus_pic*/
        ctx2[14] + "ms" : ""}`;
        if (dirty[0] & /*$_delay_nexus_pic*/
        16384)
          switch_1_changes.title_red = `${/*$_delay_nexus_pic*/
        ctx2[14] ? "" : "无延迟"}`;
        if (dirty[0] & /*$_delay_nexus_pic*/
        16384 | dirty[1] & /*$$scope*/
        8388608) {
          switch_1_changes.$$scope = { dirty, ctx: ctx2 };
        }
        switch_1.$set(switch_1_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(switch_1.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(switch_1.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(switch_1, detaching);
      }
    };
  }
  function create_default_slot_2(ctx) {
    let input;
    let mounted;
    let dispose;
    return {
      c() {
        input = element("input");
        attr(input, "type", "range");
        attr(input, "min", "0");
        attr(input, "max", "1500");
        attr(input, "step", "100");
        attr(input, "list", "values");
      },
      m(target, anchor) {
        insert(target, input, anchor);
        set_input_value(
          input,
          /*$_delay_nexus_pic*/
          ctx[14]
        );
        if (!mounted) {
          dispose = [
            listen(
              input,
              "change",
              /*input_change_input_handler*/
              ctx[34]
            ),
            listen(
              input,
              "input",
              /*input_change_input_handler*/
              ctx[34]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*$_delay_nexus_pic*/
        16384) {
          set_input_value(
            input,
            /*$_delay_nexus_pic*/
            ctx2[14]
          );
        }
      },
      d(detaching) {
        if (detaching)
          detach(input);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_default_slot_1(ctx) {
    let input;
    let mounted;
    let dispose;
    return {
      c() {
        input = element("input");
        attr(input, "type", "range");
        attr(input, "min", "2");
        attr(input, "max", "7");
        attr(input, "step", "1");
        attr(input, "list", "values");
      },
      m(target, anchor) {
        insert(target, input, anchor);
        set_input_value(
          input,
          /*$_card_layout*/
          ctx[15].column
        );
        if (!mounted) {
          dispose = [
            listen(
              input,
              "change",
              /*input_change_input_handler_1*/
              ctx[36]
            ),
            listen(
              input,
              "input",
              /*input_change_input_handler_1*/
              ctx[36]
            ),
            listen(input, "change", window.CHANGE_CARD_LAYOUT)
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*$_card_layout*/
        32768) {
          set_input_value(
            input,
            /*$_card_layout*/
            ctx2[15].column
          );
        }
      },
      d(detaching) {
        if (detaching)
          detach(input);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_default_slot(ctx) {
    let input;
    let mounted;
    let dispose;
    return {
      c() {
        input = element("input");
        attr(input, "type", "range");
        attr(input, "min", "2");
        attr(input, "max", "100");
        attr(input, "step", "1");
        attr(input, "list", "values");
      },
      m(target, anchor) {
        insert(target, input, anchor);
        set_input_value(
          input,
          /*$_card_layout*/
          ctx[15].gap
        );
        if (!mounted) {
          dispose = [
            listen(
              input,
              "change",
              /*input_change_input_handler_2*/
              ctx[37]
            ),
            listen(
              input,
              "input",
              /*input_change_input_handler_2*/
              ctx[37]
            ),
            listen(input, "change", window.CHANGE_CARD_LAYOUT)
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*$_card_layout*/
        32768) {
          set_input_value(
            input,
            /*$_card_layout*/
            ctx2[15].gap
          );
        }
      },
      d(detaching) {
        if (detaching)
          detach(input);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_fragment$c(ctx) {
    let div5;
    let div0;
    let t0;
    let div4;
    let button0;
    let t1;
    let button1;
    let iconsort;
    let t2;
    let div1;
    let t4;
    let button2;
    let div2;
    let img;
    let img_src_value;
    let t5;
    let div3;
    let t7;
    let t8;
    let t9;
    let div6;
    let current;
    let mounted;
    let dispose;
    function select_block_type(ctx2, dirty) {
      if (
        /*$_list_viewMode*/
        ctx2[4]
      )
        return create_if_block_4$2;
      return create_else_block$4;
    }
    let current_block_type = select_block_type(ctx);
    let if_block0 = current_block_type(ctx);
    iconsort = new Icon_sort({});
    let if_block1 = (
      /*$_show_debug_btn*/
      ctx[10] && create_if_block_3$2(ctx)
    );
    let if_block2 = (
      /*$_show_configPanel*/
      ctx[9] && create_if_block$7(ctx)
    );
    return {
      c() {
        div5 = element("div");
        div0 = element("div");
        t0 = space();
        div4 = element("div");
        button0 = element("button");
        if_block0.c();
        t1 = space();
        button1 = element("button");
        create_component(iconsort.$$.fragment);
        t2 = space();
        div1 = element("div");
        div1.textContent = "整理";
        t4 = space();
        button2 = element("button");
        div2 = element("div");
        img = element("img");
        t5 = space();
        div3 = element("div");
        div3.textContent = "配置";
        t7 = space();
        if (if_block1)
          if_block1.c();
        t8 = space();
        if (if_block2)
          if_block2.c();
        t9 = space();
        div6 = element("div");
        div6.textContent = "重置瀑布流配置边栏位置";
        attr(div0, "class", "sideP__title svelte-gqty0r");
        attr(button0, "class", "sideP__btn svelte-gqty0r");
        attr(button1, "class", "sideP__btn svelte-gqty0r");
        if (!src_url_equal(img.src, img_src_value = SVG_CONFIG))
          attr(img, "src", img_src_value);
        attr(img, "alt", "SVG_CONFIG");
        attr(button2, "class", "sideP__btn svelte-gqty0r");
        attr(div4, "class", "sideP__out svelte-gqty0r");
        attr(div5, "class", "sideP svelte-gqty0r");
        set_style(
          div5,
          "top",
          /*$_panelPos*/
          ctx[5].y + "px"
        );
        set_style(
          div5,
          "left",
          /*$_panelPos*/
          ctx[5].x + "px"
        );
        set_style(
          div5,
          "background-color",
          /*$_current_bgColor*/
          ctx[6]
        );
        set_style(
          div5,
          "display",
          /*$_current_domain*/
          ctx[7].includes("m-team") ? (
            /*$_SITE_SETTING*/
            ctx[8].mt.path_in_browse ? "block" : "none"
          ) : "block"
        );
        attr(div6, "id", "reset_panel_pos");
        attr(div6, "class", "svelte-gqty0r");
      },
      m(target, anchor) {
        insert(target, div5, anchor);
        append(div5, div0);
        append(div5, t0);
        append(div5, div4);
        append(div4, button0);
        if_block0.m(button0, null);
        append(div4, t1);
        append(div4, button1);
        mount_component(iconsort, button1, null);
        append(button1, t2);
        append(button1, div1);
        append(div4, t4);
        append(div4, button2);
        append(button2, div2);
        append(div2, img);
        append(button2, t5);
        append(button2, div3);
        append(div4, t7);
        if (if_block1)
          if_block1.m(div4, null);
        ctx[24](div5);
        insert(target, t8, anchor);
        if (if_block2)
          if_block2.m(target, anchor);
        insert(target, t9, anchor);
        insert(target, div6, anchor);
        current = true;
        if (!mounted) {
          dispose = [
            listen(
              div0,
              "mousedown",
              /*onMouseDown*/
              ctx[16]
            ),
            listen(
              button0,
              "click",
              /*__show_originTable*/
              ctx[18]
            ),
            listen(
              button1,
              "click",
              /*__sort_masonry*/
              ctx[19]
            ),
            listen(
              button2,
              "click",
              /*click_handler*/
              ctx[23]
            ),
            listen(
              div6,
              "click",
              /*resetPanelPos*/
              ctx[17]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block0) {
          if_block0.p(ctx2, dirty);
        } else {
          if_block0.d(1);
          if_block0 = current_block_type(ctx2);
          if (if_block0) {
            if_block0.c();
            if_block0.m(button0, null);
          }
        }
        if (
          /*$_show_debug_btn*/
          ctx2[10]
        ) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
          } else {
            if_block1 = create_if_block_3$2(ctx2);
            if_block1.c();
            if_block1.m(div4, null);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
        if (!current || dirty[0] & /*$_panelPos*/
        32) {
          set_style(
            div5,
            "top",
            /*$_panelPos*/
            ctx2[5].y + "px"
          );
        }
        if (!current || dirty[0] & /*$_panelPos*/
        32) {
          set_style(
            div5,
            "left",
            /*$_panelPos*/
            ctx2[5].x + "px"
          );
        }
        if (!current || dirty[0] & /*$_current_bgColor*/
        64) {
          set_style(
            div5,
            "background-color",
            /*$_current_bgColor*/
            ctx2[6]
          );
        }
        if (!current || dirty[0] & /*$_current_domain, $_SITE_SETTING*/
        384) {
          set_style(
            div5,
            "display",
            /*$_current_domain*/
            ctx2[7].includes("m-team") ? (
              /*$_SITE_SETTING*/
              ctx2[8].mt.path_in_browse ? "block" : "none"
            ) : "block"
          );
        }
        if (
          /*$_show_configPanel*/
          ctx2[9]
        ) {
          if (if_block2) {
            if_block2.p(ctx2, dirty);
            if (dirty[0] & /*$_show_configPanel*/
            512) {
              transition_in(if_block2, 1);
            }
          } else {
            if_block2 = create_if_block$7(ctx2);
            if_block2.c();
            transition_in(if_block2, 1);
            if_block2.m(t9.parentNode, t9);
          }
        } else if (if_block2) {
          group_outros();
          transition_out(if_block2, 1, 1, () => {
            if_block2 = null;
          });
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(iconsort.$$.fragment, local);
        transition_in(if_block2);
        current = true;
      },
      o(local) {
        transition_out(iconsort.$$.fragment, local);
        transition_out(if_block2);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div5);
        if_block0.d();
        destroy_component(iconsort);
        if (if_block1)
          if_block1.d();
        ctx[24](null);
        if (detaching)
          detach(t8);
        if (if_block2)
          if_block2.d(detaching);
        if (detaching)
          detach(t9);
        if (detaching)
          detach(div6);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function posRangeIn(target, min, max) {
    if (target <= min)
      target = min;
    if (target >= max)
      target = max;
    return target;
  }
  function instance$8($$self, $$props, $$invalidate) {
    let $_iframe_switch;
    let $_turnPage;
    let $_CARD_SHOW;
    let $_Global_Masonry;
    let $_list_viewMode;
    let $_panelPos;
    let $_current_bgColor;
    let $_current_domain;
    let $_SITE_SETTING;
    let $_show_configPanel;
    let $_show_debug_btn;
    let $_animated;
    let $_show_nexus_pic;
    let $_trigger_nexus_pic;
    let $_delay_nexus_pic;
    let $_card_layout;
    component_subscribe($$self, _iframe_switch, ($$value) => $$invalidate(50, $_iframe_switch = $$value));
    component_subscribe($$self, _turnPage, ($$value) => $$invalidate(2, $_turnPage = $$value));
    component_subscribe($$self, _CARD_SHOW, ($$value) => $$invalidate(3, $_CARD_SHOW = $$value));
    component_subscribe($$self, _Global_Masonry, ($$value) => $$invalidate(51, $_Global_Masonry = $$value));
    component_subscribe($$self, _list_viewMode, ($$value) => $$invalidate(4, $_list_viewMode = $$value));
    component_subscribe($$self, _panelPos, ($$value) => $$invalidate(5, $_panelPos = $$value));
    component_subscribe($$self, _current_bgColor, ($$value) => $$invalidate(6, $_current_bgColor = $$value));
    component_subscribe($$self, _current_domain, ($$value) => $$invalidate(7, $_current_domain = $$value));
    component_subscribe($$self, _SITE_SETTING, ($$value) => $$invalidate(8, $_SITE_SETTING = $$value));
    component_subscribe($$self, _show_configPanel, ($$value) => $$invalidate(9, $_show_configPanel = $$value));
    component_subscribe($$self, _show_debug_btn, ($$value) => $$invalidate(10, $_show_debug_btn = $$value));
    component_subscribe($$self, _animated, ($$value) => $$invalidate(11, $_animated = $$value));
    component_subscribe($$self, _show_nexus_pic, ($$value) => $$invalidate(12, $_show_nexus_pic = $$value));
    component_subscribe($$self, _trigger_nexus_pic, ($$value) => $$invalidate(13, $_trigger_nexus_pic = $$value));
    component_subscribe($$self, _delay_nexus_pic, ($$value) => $$invalidate(14, $_delay_nexus_pic = $$value));
    component_subscribe($$self, _card_layout, ($$value) => $$invalidate(15, $_card_layout = $$value));
    let sideDom;
    let isMouseDown = false;
    let offsetX = 0;
    let offsetY = 0;
    const onMouseDown = (e) => {
      e.preventDefault();
      isMouseDown = true;
      offsetX = e.clientX - sideDom.getBoundingClientRect().left;
      offsetY = e.clientY - sideDom.getBoundingClientRect().top;
    };
    const onMouseMove = (e) => {
      if (!isMouseDown)
        return;
      const res_X = posRangeIn(e.clientX - offsetX, 0, window.innerWidth - (sideDom.getBoundingClientRect().width + 5));
      const res_Y = posRangeIn(e.clientY - offsetY, 0, window.innerHeight - (sideDom.getBoundingClientRect().height + 5));
      set_store_value(_panelPos, $_panelPos = { x: res_X, y: res_Y }, $_panelPos);
    };
    const onMouseUp = () => {
      isMouseDown = false;
    };
    function resetPanelPos() {
      if ($_panelPos.x == 0 && $_panelPos.y == 0)
        alert("无需重置瀑布流边栏位置");
      set_store_value(_panelPos, $_panelPos = { x: 0, y: 0 }, $_panelPos);
    }
    function __show_originTable() {
      set_store_value(_list_viewMode, $_list_viewMode = !$_list_viewMode, $_list_viewMode);
      if (window.CHANGE_CARD_LAYOUT)
        window.CHANGE_CARD_LAYOUT();
    }
    function __sort_masonry() {
      $_Global_Masonry.layout();
    }
    function config_showAllDetails() {
      set_store_value(_CARD_SHOW, $_CARD_SHOW.all = !$_CARD_SHOW.all, $_CARD_SHOW);
      setTimeout(
        () => {
          sortMasonry();
        },
        0
      );
    }
    let label_switchMode = $_turnPage ? "滚动加载" : "按钮加载";
    function config_switchMode() {
      set_store_value(_turnPage, $_turnPage = !$_turnPage, $_turnPage);
      $$invalidate(1, label_switchMode = $_turnPage ? "滚动加载" : "按钮加载");
    }
    function config_changeLoadMode() {
      set_store_value(_iframe_switch, $_iframe_switch = $_iframe_switch == 0 ? 1 : 0, $_iframe_switch);
    }
    onMount(() => {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
    });
    const click_handler = () => {
      set_store_value(_show_configPanel, $_show_configPanel = !$_show_configPanel, $_show_configPanel);
    };
    function div5_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        sideDom = $$value;
        $$invalidate(0, sideDom);
      });
    }
    const click_handler_1 = () => set_store_value(_show_configPanel, $_show_configPanel = false, $_show_configPanel);
    const func2 = () => {
      window.NEXUS_TOOLS();
    };
    function switch_1_checked_binding(value) {
      if ($$self.$$.not_equal($_SITE_SETTING.mt.hide_gay, value)) {
        $_SITE_SETTING.mt.hide_gay = value;
        _SITE_SETTING.set($_SITE_SETTING);
      }
    }
    const func_12 = () => {
      window.CHANGE_CARD_LAYOUT();
    };
    function switch0_checked_binding(value) {
      $_list_viewMode = value;
      _list_viewMode.set($_list_viewMode);
    }
    function switch1_checked_binding(value) {
      $_turnPage = value;
      _turnPage.set($_turnPage);
    }
    function switch2_checked_binding(value) {
      $_animated = value;
      _animated.set($_animated);
    }
    function switch3_checked_binding(value) {
      $_show_nexus_pic = value;
      _show_nexus_pic.set($_show_nexus_pic);
    }
    function switch4_checked_binding(value) {
      $_trigger_nexus_pic = value;
      _trigger_nexus_pic.set($_trigger_nexus_pic);
    }
    function input_change_input_handler() {
      $_delay_nexus_pic = to_number(this.value);
      _delay_nexus_pic.set($_delay_nexus_pic);
    }
    function switch5_checked_binding(value) {
      $_show_debug_btn = value;
      _show_debug_btn.set($_show_debug_btn);
    }
    function input_change_input_handler_1() {
      $_card_layout.column = to_number(this.value);
      _card_layout.set($_card_layout);
    }
    function input_change_input_handler_2() {
      $_card_layout.gap = to_number(this.value);
      _card_layout.set($_card_layout);
    }
    function switch8_checked_binding(value) {
      if ($$self.$$.not_equal($_CARD_SHOW.all, value)) {
        $_CARD_SHOW.all = value;
        _CARD_SHOW.set($_CARD_SHOW);
      }
    }
    function switch9_checked_binding(value) {
      if ($$self.$$.not_equal($_CARD_SHOW.title, value)) {
        $_CARD_SHOW.title = value;
        _CARD_SHOW.set($_CARD_SHOW);
      }
    }
    function switch10_checked_binding(value) {
      if ($$self.$$.not_equal($_CARD_SHOW.free, value)) {
        $_CARD_SHOW.free = value;
        _CARD_SHOW.set($_CARD_SHOW);
      }
    }
    function switch11_checked_binding(value) {
      if ($$self.$$.not_equal($_CARD_SHOW.sub_title, value)) {
        $_CARD_SHOW.sub_title = value;
        _CARD_SHOW.set($_CARD_SHOW);
      }
    }
    function switch12_checked_binding(value) {
      if ($$self.$$.not_equal($_CARD_SHOW.tags, value)) {
        $_CARD_SHOW.tags = value;
        _CARD_SHOW.set($_CARD_SHOW);
      }
    }
    function switch13_checked_binding(value) {
      if ($$self.$$.not_equal($_CARD_SHOW.size_download_collect, value)) {
        $_CARD_SHOW.size_download_collect = value;
        _CARD_SHOW.set($_CARD_SHOW);
      }
    }
    function switch14_checked_binding(value) {
      if ($$self.$$.not_equal($_CARD_SHOW.upload_time, value)) {
        $_CARD_SHOW.upload_time = value;
        _CARD_SHOW.set($_CARD_SHOW);
      }
    }
    function switch15_checked_binding(value) {
      if ($$self.$$.not_equal($_CARD_SHOW.statistics, value)) {
        $_CARD_SHOW.statistics = value;
        _CARD_SHOW.set($_CARD_SHOW);
      }
    }
    const click_handler_2 = () => set_store_value(_show_configPanel, $_show_configPanel = false, $_show_configPanel);
    return [
      sideDom,
      label_switchMode,
      $_turnPage,
      $_CARD_SHOW,
      $_list_viewMode,
      $_panelPos,
      $_current_bgColor,
      $_current_domain,
      $_SITE_SETTING,
      $_show_configPanel,
      $_show_debug_btn,
      $_animated,
      $_show_nexus_pic,
      $_trigger_nexus_pic,
      $_delay_nexus_pic,
      $_card_layout,
      onMouseDown,
      resetPanelPos,
      __show_originTable,
      __sort_masonry,
      config_showAllDetails,
      config_switchMode,
      config_changeLoadMode,
      click_handler,
      div5_binding,
      click_handler_1,
      func2,
      switch_1_checked_binding,
      func_12,
      switch0_checked_binding,
      switch1_checked_binding,
      switch2_checked_binding,
      switch3_checked_binding,
      switch4_checked_binding,
      input_change_input_handler,
      switch5_checked_binding,
      input_change_input_handler_1,
      input_change_input_handler_2,
      switch8_checked_binding,
      switch9_checked_binding,
      switch10_checked_binding,
      switch11_checked_binding,
      switch12_checked_binding,
      switch13_checked_binding,
      switch14_checked_binding,
      switch15_checked_binding,
      click_handler_2
    ];
  }
  class Sidepanel extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$8, create_fragment$c, safe_not_equal, {}, null, [-1, -1]);
    }
  }
  const CONFIG$1 = {
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
      410: "#FF66FF",
      413: "#FF66FF",
      414: "#FF66FF",
      // [绿色]图: cos图 画师CG 游戏CG 单行本 同人志
      417: "#59CD90",
      433: "#59CD90",
      434: "#59CD90",
      424: "#59CD90",
      435: "#59CD90",
      // [黄色]动画: 里番 2D 3D
      411: "#FAC05E",
      419: "#FAC05E",
      423: "#FAC05E",
      // [紫色]声音: 外语音声 中文音声 视频音声 音乐
      420: "#3FA7D6",
      421: "#3FA7D6",
      422: "#3FA7D6",
      437: "#3FA7D6",
      // [红色]游戏: 游戏 中文游戏
      415: "#EE6352",
      418: "#EE6352"
    },
    /** 索引 */
    INDEX: 0,
    /** iframe 宽度 */
    Iframe_Width: 1260,
    /**获取背景颜色*/
    get_bg_color: function() {
      const mainOuterDOM = document.querySelector("table.mainouter");
      return window.getComputedStyle(mainOuterDOM)["background-color"];
    },
    /** NOTE: 站点特殊操作 */
    special: function() {
      function legacy$(id) {
        return document.getElementById(id);
      }
      legacy$("ksearchboxmain") ? legacy$("ksearchboxmain").style.display = "none" : null;
      const link = document.querySelector('a[href="?sort=7&type=asc&seeders_begin=1"]');
      link ? link.childNodes[0].style.color = "black" : null;
      let np = document.querySelector("img#nexus-preview");
      if (np)
        np.style.zIndex = 12e3;
      table_Iframe_Set$1();
    },
    /** NOTE: 站点下一页加载后操作 */
    pageLoaded: function() {
      var script = document.createElement("script");
      script.src = "https://kamept.com/js/nexus.js";
      document.head.appendChild(script);
      table_Iframe_Set$1();
    }
  };
  function table_Iframe_Set$1() {
    const lists = Array.from(document.querySelectorAll(".torrentname"));
    lists.forEach((el) => el.addEventListener("click", function(event) {
      event.preventDefault();
      _iframe_switch.set(1);
      _iframe_url.set(el.children[0].children[0].children[1].querySelector("a").href + "#kdescr");
    }));
  }
  function TORRENT_LIST_TO_JSON(torrent_list_Dom) {
    const rows = torrent_list_Dom.querySelectorAll("tbody tr");
    const data = [];
    rows.forEach((row) => {
      const categoryImg = row.querySelector("td:nth-child(1) > a > img");
      const category = categoryImg ? categoryImg.alt : "";
      if (!category)
        return;
      const categoryLinkDOM = categoryImg.parentNode;
      const categoryLink = categoryLinkDOM.href;
      const categoryNumber = categoryLink.slice(-3);
      const _categoryImg = categoryImg.cloneNode(true);
      _categoryImg.className = "card-category-img";
      const torrentIndex = CONFIG$1.INDEX++;
      const torrentNameLink = row.querySelector(".torrentname a");
      const torrentName = torrentNameLink ? torrentNameLink.textContent.trim() : "";
      const torrentLink = torrentNameLink.href;
      const pattern = /id=(\d+)&hit/;
      const match = torrentLink.match(pattern);
      const torrentId = match ? parseInt(match[1]) : null;
      const picLink = row.querySelector(".torrentname img").getAttribute("data-src");
      const desCell = row.querySelector(".torrentname td:nth-child(2)");
      const length = desCell.childNodes.length - 1;
      const desDom = desCell.childNodes[length];
      const description = desDom.nodeName == "#text" ? desDom.textContent.trim() : "";
      const place_at_the_top = row.querySelectorAll(".torrentname img.sticky");
      const pattMsg = place_at_the_top[0] ? place_at_the_top[0].title : "";
      const tempTagDom = Array.from(row.querySelectorAll(".torrentname font"));
      const freeTypeImg = row.querySelector('img[class^="pro_"]');
      const freeType = freeTypeImg ? "_" + freeTypeImg.alt.replace(/\s+/g, "") : "";
      const freeRemainingTimeSpan = freeType ? tempTagDom.pop() : "";
      const freeRemainingTime = freeRemainingTimeSpan ? freeRemainingTimeSpan.innerText : "";
      const tagSpans = row.querySelectorAll(".torrentname span");
      const tagsDOM = Array.from(tagSpans);
      let tags = tagSpans ? tagsDOM.map((span) => span.textContent.trim()) : [];
      if (freeRemainingTime != "") {
        tags.shift();
        tagsDOM.shift();
      }
      const raw_tags = tagsDOM.map((el) => el.outerHTML).join("");
      const downloadLink = `download.php?id=${torrentId}`;
      const collectLink = `javascript: bookmark(${torrentId},${torrentIndex});`;
      const collectDOM = row.querySelector(".torrentname a[id^='bookmark']");
      const collectState = collectDOM.children[0].alt;
      const commentsLink = row.querySelector("td.rowfollow:nth-child(3) a");
      const comments = commentsLink ? parseInt(commentsLink.textContent) : 0;
      const uploadDateSpan = row.querySelector("td:nth-child(4) span");
      const uploadDate = uploadDateSpan ? uploadDateSpan.title : "";
      const sizeCell = row.querySelector("td:nth-child(5)");
      const size = sizeCell ? sizeCell.textContent.trim() : "";
      const seedersLink = row.querySelector("td:nth-child(6) a");
      const seeders = seedersLink ? parseInt(seedersLink.textContent) : 0;
      const leechersCell = row.querySelector("td:nth-child(7)");
      const leechers = leechersCell ? parseInt(leechersCell.textContent) : 0;
      const snatchedLink = row.querySelector("td:nth-child(8) a");
      const snatched = snatchedLink ? parseInt(snatchedLink.textContent) : 0;
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
        snatched
      };
      data.push(rowData);
    });
    return data;
  }
  const SVG_Size = "data:image/svg+xml;base64,PHN2ZyANCiAgc3Ryb2tlPSJjdXJyZW50Q29sb3IiDQogIGZpbGw9ImN1cnJlbnRDb2xvciINCiAgc3Ryb2tlLXdpZHRoPSIwIg0KICB2aWV3Qm94PSIwIDAgMjQgMjQiDQogIGhlaWdodD0iMjUiDQogIHdpZHRoPSIyNSINCiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICBzdHlsZT0iDQogICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTsgDQogICAgLS1kYXJrcmVhZGVyLWlubGluZS1maWxsOiBjdXJyZW50Q29sb3I7IA0KICAgIC0tZGFya3JlYWRlci1pbmxpbmUtc3Ryb2tlOiBjdXJyZW50Q29sb3I7Ig0KPg0KICA8cGF0aCANCiAgICBkPSJNMTIgNWMtMy44NTkgMC03IDMuMTQxLTcgN3MzLjE0MSA3IDcgNyA3LTMuMTQxIDctNy0zLjE0MS03LTctN3ptMCAxMmMtMi43NTcgMC01LTIuMjQzLTUtNXMyLjI0My01IDUtNSA1IDIuMjQzIDUgNS0yLjI0MyA1LTUgNXoiPg0KICA8L3BhdGg+DQogIDxwYXRoIA0KICAgIGQ9Ik0xMiA5Yy0xLjYyNyAwLTMgMS4zNzMtMyAzczEuMzczIDMgMyAzIDMtMS4zNzMgMy0zLTEuMzczLTMtMy0zeiI+DQogIDwvcGF0aD4NCjwvc3ZnPg==";
  const SVG_Seeders = "data:image/svg+xml;base64,PHN2ZyANCiAgdmlld0JveD0iNjQgNjQgODk2IDg5NiIgDQogIGZvY3VzYWJsZT0iZmFsc2UiIA0KICBkYXRhLWljb249ImFycm93LXVwIiANCiAgd2lkdGg9IjFlbSIgDQogIGhlaWdodD0iMWVtIiANCiAgZmlsbD0iZ3JlZW4iIA0KICBhcmlhLWhpZGRlbj0idHJ1ZSINCiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KPg0KICA8cGF0aCBkPSJNODY4IDU0NS41TDUzNi4xIDE2M2EzMS45NiAzMS45NiAwIDAwLTQ4LjMgMEwxNTYgNTQ1LjVhNy45NyA3Ljk3IDAgMDA2IDEzLjJoODFjNC42IDAgOS0yIDEyLjEtNS41TDQ3NCAzMDAuOVY4NjRjMCA0LjQgMy42IDggOCA4aDYwYzQuNCAwIDgtMy42IDgtOFYzMDAuOWwyMTguOSAyNTIuM2MzIDMuNSA3LjQgNS41IDEyLjEgNS41aDgxYzYuOCAwIDEwLjUtOCA2LTEzLjJ6Ij4NCiAgPC9wYXRoPg0KPC9zdmc+";
  const SVG_Leechers = "data:image/svg+xml;base64,PHN2ZyANCiAgdmlld0JveD0iNjQgNjQgODk2IDg5NiIgDQogIGZvY3VzYWJsZT0iZmFsc2UiIA0KICBkYXRhLWljb249ImFycm93LWRvd24iIA0KICB3aWR0aD0iMWVtIiANCiAgaGVpZ2h0PSIxZW0iIA0KICBmaWxsPSJyZWQiIA0KICBhcmlhLWhpZGRlbj0idHJ1ZSINCiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KPg0KICA8cGF0aCBkPSJNODYyIDQ2NS4zaC04MWMtNC42IDAtOSAyLTEyLjEgNS41TDU1MCA3MjMuMVYxNjBjMC00LjQtMy42LTgtOC04aC02MGMtNC40IDAtOCAzLjYtOCA4djU2My4xTDI1NS4xIDQ3MC44Yy0zLTMuNS03LjQtNS41LTEyLjEtNS41aC04MWMtNi44IDAtMTAuNSA4LjEtNiAxMy4yTDQ4Ny45IDg2MWEzMS45NiAzMS45NiAwIDAwNDguMyAwTDg2OCA0NzguNWM0LjUtNS4yLjgtMTMuMi02LTEzLjJ6Ij4NCiAgPC9wYXRoPg0KPC9zdmc+";
  const SVG_Download = "data:image/svg+xml;base64,PHN2ZyANCiAgdmlld0JveD0iNjQgNjQgODk2IDg5NiINCiAgZm9jdXNhYmxlPSJmYWxzZSINCiAgZGF0YS1pY29uPSJkb3dubG9hZCINCiAgd2lkdGg9IjFlbSINCiAgaGVpZ2h0PSIxZW0iDQogIGZpbGw9ImN1cnJlbnRDb2xvciINCiAgYXJpYS1oaWRkZW49InRydWUiDQogIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgDQogID4NCiAgPHBhdGggDQogICAgZD0iTTUwNS43IDY2MWE4IDggMCAwMDEyLjYgMGwxMTItMTQxLjdjNC4xLTUuMi40LTEyLjktNi4zLTEyLjloLTc0LjFWMTY4YzAtNC40LTMuNi04LTgtOGgtNjBjLTQuNCAwLTggMy42LTggOHYzMzguM0g0MDBjLTYuNyAwLTEwLjQgNy43LTYuMyAxMi45bDExMiAxNDEuOHpNODc4IDYyNmgtNjBjLTQuNCAwLTggMy42LTggOHYxNTRIMjE0VjYzNGMwLTQuNC0zLjYtOC04LThoLTYwYy00LjQgMC04IDMuNi04IDh2MTk4YzAgMTcuNyAxNC4zIDMyIDMyIDMyaDY4NGMxNy43IDAgMzItMTQuMyAzMi0zMlY2MzRjMC00LjQtMy42LTgtOC04eiI+DQogIDwvcGF0aD4NCjwvc3ZnPg==";
  const SVG_Collection = "data:image/svg+xml;base64,PHN2ZyANCiAgdmlld0JveD0iNjQgNjQgODk2IDg5NiIgDQogIGZvY3VzYWJsZT0iZmFsc2UiIA0KICBkYXRhLWljb249InN0YXIiIA0KICB3aWR0aD0iMWVtIiANCiAgaGVpZ2h0PSIxZW0iIA0KICBmaWxsPSJjdXJyZW50Q29sb3IiIA0KICBhcmlhLWhpZGRlbj0idHJ1ZSINCiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiANCj4NCiAgPHBhdGggDQogICAgZD0iTTkwOC4xIDM1My4xbC0yNTMuOS0zNi45TDU0MC43IDg2LjFjLTMuMS02LjMtOC4yLTExLjQtMTQuNS0xNC41LTE1LjgtNy44LTM1LTEuMy00Mi45IDE0LjVMMzY5LjggMzE2LjJsLTI1My45IDM2LjljLTcgMS0xMy40IDQuMy0xOC4zIDkuM2EzMi4wNSAzMi4wNSAwIDAwLjYgNDUuM2wxODMuNyAxNzkuMS00My40IDI1Mi45YTMxLjk1IDMxLjk1IDAgMDA0Ni40IDMzLjdMNTEyIDc1NGwyMjcuMSAxMTkuNGM2LjIgMy4zIDEzLjQgNC40IDIwLjMgMy4yIDE3LjQtMyAyOS4xLTE5LjUgMjYuMS0zNi45bC00My40LTI1Mi45IDE4My43LTE3OS4xYzUtNC45IDguMy0xMS4zIDkuMy0xOC4zIDIuNy0xNy41LTkuNS0zMy43LTI3LTM2LjN6Ij4NCiAgPC9wYXRoPg0KPC9zdmc+";
  const SVG_Preview = "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQogIDxkZWZzPg0KICAgIDxzdHlsZT4NCiAgICAgIC5jbHMtMXtmaWxsOiMyZWIxYjc7fQ0KICAgICAgLmNscy0ye2ZpbGw6IzU2YjU0ZTt9DQogICAgICAuY2xzLTN7ZmlsbDojNWRjNmQxO30NCiAgICAgIC5jbHMtNHtmaWxsOiM2MGNjNWE7fQ0KICAgICAgLmNscy01e2ZpbGw6I2ZmY2U2OTt9DQogICAgICAuY2xzLTZ7ZmlsbDojNmMyZTdjO30NCiAgICA8L3N0eWxlPg0KICA8L2RlZnM+DQogIDxnIGlkPSJJY29ucyI+DQogICAgPHJlY3QgY2xhc3M9ImNscy0xIiBoZWlnaHQ9IjIyIiByeD0iNCIgd2lkdGg9IjIyIiB4PSIxIiB5PSIxIi8+DQogICAgPHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMjMsMTh2MWE0LDQsMCwwLDEtNCw0SDVhNCw0LDAsMCwxLTMuOS0zLjFsNy4xOS03LjE5YTEuMDA4LDEuMDA4LDAsMCwxLDEuNDIsMGwxLjgsMS44YTEsMSwwLDAsMCwxLjQ2LS4wNWwyLjMzLTIuNjVhMSwxLDAsMCwxLDEuNDYtLjA1WiIvPg0KICAgIDxwYXRoIGNsYXNzPSJjbHMtMyIgZD0iTTIzLDV2OWE0LjAyNSw0LjAyNSwwLDAsMS0xLjE3LDIuODNsLTUuMDctNS4wN2ExLDEsMCwwLDAtMS40Ni4wNWwtMi4zMywyLjY1YTEsMSwwLDAsMS0xLjQ2LjA1bC0xLjgtMS44YTEuMDA4LDEuMDA4LDAsMCwwLTEuNDIsMEwzLjM2LDE3LjY0QTMuOTg4LDMuOTg4LDAsMCwxLDEsMTRWNUE0LDQsMCwwLDEsNSwxSDE5QTQsNCwwLDAsMSwyMyw1WiIvPg0KICAgIDxwYXRoIGNsYXNzPSJjbHMtNCIgZD0iTTIxLjgzLDE2LjgzQTQuMDI1LDQuMDI1LDAsMCwxLDE5LDE4SDVhMy45MzEsMy45MzEsMCwwLDEtMS42NC0uMzZsNC45My00LjkzYTEuMDA4LDEuMDA4LDAsMCwxLDEuNDIsMGwxLjgsMS44YTEsMSwwLDAsMCwxLjQ2LS4wNWwyLjMzLTIuNjVhMSwxLDAsMCwxLDEuNDYtLjA1WiIvPg0KICAgIDxjaXJjbGUgY2xhc3M9ImNscy01IiBjeD0iNyIgY3k9IjciIHI9IjIiLz4NCiAgPC9nPg0KICA8ZyBkYXRhLW5hbWU9IkxheWVyIDQiIGlkPSJMYXllcl80Ij4NCiAgICA8cGF0aCBjbGFzcz0iY2xzLTYiIGQ9Ik0xOSwwSDVBNS4wMDYsNS4wMDYsMCwwLDAsMCw1VjE5YTUuMDA2LDUuMDA2LDAsMCwwLDUsNUgxOWE1LjAwNiw1LjAwNiwwLDAsMCw1LTVWNUE1LjAwNiw1LjAwNiwwLDAsMCwxOSwwWm0zLDE5YTMsMywwLDAsMS0zLDNINWEzLDMsMCwwLDEtMy0zVjVBMywzLDAsMCwxLDUsMkgxOWEzLDMsMCwwLDEsMywzWiIvPg0KICAgIDxwYXRoIGNsYXNzPSJjbHMtNiIgZD0iTTcsMTBBMywzLDAsMSwwLDQsNywzLDMsMCwwLDAsNywxMFpNNyw2QTEsMSwwLDEsMSw2LDcsMSwxLDAsMCwxLDcsNloiLz4NCiAgICA8cGF0aCBjbGFzcz0iY2xzLTYiIGQ9Ik0xNi43MDcsMTAuMjkzYS45NTYuOTU2LDAsMCwwLS43NC0uMjkzLDEuMDA2LDEuMDA2LDAsMCwwLS43Mi4zNDFMMTIuMjE3LDEzLjhsLTIuNTEtMi41MTFhMSwxLDAsMCwwLTEuNDE0LDBsLTQsNGExLDEsMCwxLDAsMS40MTQsMS40MTRMOSwxMy40MTRsMS45LDEuOUw4LjI0NywxOC4zNDFhMSwxLDAsMCwwLDEuNTA2LDEuMzE4bDMuMjE4LTMuNjc4LjAwNiwwLC4wMDctLjAxMSwzLjA2NS0zLjUsMi4yNDQsMi4yNDRhMSwxLDAsMCwwLDEuNDE0LTEuNDE0WiIvPg0KICA8L2c+DQo8L3N2Zz4=";
  const CONFIG = {
    /** 是否非 NexusPHP 架构 */
    noneNexusPHP: true,
    /** 架构 */
    architecture: "NEW_MT",
    /** 默认的种子表格 dom selector */
    // torrentListTable: "div.ant-table-wrapper",
    torrentListTable: "div.app-content__inner",
    /** 加载图片等待时的默认图片 */
    LOADING_PIC: "/static/media/logo.80b63235eaf702e44a8d.png",
    /** 网站 host*/
    /** FIXME: 没用的字段了*/
    HOST: "https://test2.m-team.cc",
    /** 网站 api */
    API: {
      /** 查询 */
      search: {
        url: "/torrent/search",
        method: "POST"
        // payload 示例
        // payload: {
        //   categories: [],
        //   pageNumber: 7,
        //   pageSize: 100,
        //   sortDirection: "DESC",
        //   sortField: "CREATED_DATE",
        //   visible: 1,
        // }
      },
      genDlToken: {
        url: "/torrent/genDlToken",
        method: "POST"
      },
      collection: {
        url: "/torrent/collection",
        method: "POST"
      }
    },
    /**如果站点有自定义的icon, 可以用自定义的 */
    ICON: {
      /** 大小图标 */
      SIZE: SVG_Size,
      /** 评论图标 */
      // COMMENT: SVG_Comment,
      /** 上传人数图标 */
      SEEDERS: SVG_Seeders,
      /** 下载人数图标 */
      LEECHERS: SVG_Leechers,
      /** 下载图标 */
      DOWNLOAD: SVG_Download,
      /** 收藏图标 */
      COLLECTION: SVG_Collection,
      /** 置顶图标 (没用, 看的是 css URL) */
      PIN: "/static/trans.gif",
      /** 时间图标 */
      // TIME: SVG_Time,
      /** 预览图标 */
      PREVIEW: SVG_Preview
    },
    /**如果站点有必要设置分类颜色, 可以用自定义的 */
    CATEGORY_COLOR: {
      // 成人分类
      115: "#f52bcb",
      // AV(有码) 父
      120: "#f52bcb",
      // AV(无码) 父
      410: "#f52bcb",
      // 有码 HD
      429: "#f52bcb",
      // 无码 HD
      424: "#db55a9",
      // 有码 Xvid
      430: "#db55a9",
      // 无码 Xvid
      437: "#f77afa",
      // 有码 DVD
      426: "#f77afa",
      // 无码 DVD
      431: "#19a7ec",
      // 有码 BluRay
      432: "#19a7ec",
      // 无码 BluRay
      440: "#f52bcb",
      // GAY
      436: "#bb1e9a",
      // 0 day
      425: "#bb1e9a",
      // 写真 video
      433: "#bb1e9a",
      // 写真 pic
      411: "#f49800",
      // H-Game
      412: "#f49800",
      // H-Anime
      413: "#f49800",
      // H-Comic
      // 综合分类
      100: "#c74854",
      // Movie 父
      401: "#c74854",
      // Movie SD
      419: "#c01a20",
      // Movie HD
      420: "#c74854",
      // Movie DVD    
      421: "#00a0e9",
      // Movie BluRay
      439: "#1b2a51",
      // Movie Remux
      105: "#276fb8",
      // TV影剧综艺 父
      403: "#c74854",
      // TV影剧综艺 SD
      402: "#276fb8",
      // TV影剧综艺 HD
      435: "#4dbebd",
      // TV影剧综艺 DVD
      438: "#1897d6",
      // TV影剧综艺 BluRay
      444: "#23ac38",
      // 纪录片 父
      404: "#23ac38",
      // 纪录片
      449: "#996c34",
      // Anime 父
      405: "#996c34",
      // Anime
      443: "#7FC269",
      // 教育 父
      427: "#7FC269",
      // 教育文档
      441: "#7FC269",
      // 教育影片
      442: "#7FC269",
      // 教育音频
      447: "#f39800",
      // Game 父
      423: "#f39800",
      // Game
      448: "#f39800",
      // TV Game
      450: "#996c34",
      // Other 父
      407: "#23ac38",
      // Sport
      422: "#f39800",
      // Software
      409: "#996c34",
      // Other
      // 音乐分类
      110: "#8a57a1",
      // 音乐 父
      406: "#8a57a1",
      // MV
      408: "#8a57a1",
      // Music AAC/ALAC
      434: "#8a57a1"
      // Music 无损
    },
    CATEGORY_NAME: {
      // 成人分类
      115: "AV(有码)",
      // AV(有码)
      120: "AV(无码)",
      // AV(无码)
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
      // 综合分类
      100: "Movie",
      // Movie 父
      401: "Movie SD",
      419: "Movie HD",
      420: "Movie DVD",
      421: "Movie BluRay",
      439: "Movie Remux",
      105: "TV",
      // 影剧综艺 父
      403: "TV SD",
      402: "TV HD",
      435: "TV DVDiSo",
      438: "TV BluRay",
      444: "Documentary",
      // 纪录片 父
      404: "Documentary",
      449: "Anime",
      // 动漫 父
      405: "Anime",
      443: "教育",
      // 父
      427: "教育文档",
      441: "教育影片",
      442: "教育音频",
      447: "Game",
      // 父
      423: "Game",
      448: "TV Game",
      450: "其他",
      // 父
      407: "Sport",
      422: "软件",
      409: "Other",
      // 音乐分类
      110: "Music",
      // 音乐 父
      406: "MV",
      408: "Music AAC/ALAC",
      434: "Music 无损"
    },
    /** 索引 */
    INDEX: 0,
    /** iframe 宽度 */
    Iframe_Width: 1260,
    /**获取背景颜色*/
    get_bg_color: function() {
      return getComputedStyle(document.documentElement).getPropertyValue(
        "--bg-3"
      );
    },
    /** NOTE: 站点特殊操作 */
    special: function() {
      let len1 = table_Iframe_Set();
      let len2 = old_form_show_pic();
      return len1 && len2;
    },
    /** NOTE: 站点下一页加载后操作 */
    pageLoaded: function() {
    }
  };
  function table_Iframe_Set() {
    const lists = Array.from(document.querySelectorAll(".ant-table-row-level-0 .ant-col a[href]"));
    lists.forEach(
      function(el) {
        el.addEventListener("click", function(event) {
          event.preventDefault();
          _iframe_switch.set(1);
          _iframe_url.set(el.href);
        });
      }
    );
    return lists.length;
  }
  function old_form_show_pic() {
    const elementsToRemove = document.querySelectorAll(".ant-image-mask");
    elementsToRemove.forEach((element2) => {
      element2.remove();
    });
    const lists = Array.from(document.querySelectorAll(".torrent-list__thumbnail"));
    lists.forEach((el) => {
      el.classList += " preview_Origin";
    });
    return lists.length;
  }
  const selector = ".preview_Origin";
  document.body.addEventListener("mouseover", function(e) {
    if (e.target.matches(selector)) {
      const event = e;
      const imgEle = e.target;
      handleMouseOver(event, imgEle);
    }
  });
  document.body.addEventListener("mouseout", function(e) {
    if (e.target.matches(selector)) {
      handleMouseOut();
    }
  });
  document.body.addEventListener("mousemove", function(e) {
    if (e.target.matches(selector)) {
      const imgEle = e.target;
      handleMouseMove(e, imgEle);
    }
  });
  const SITE = {
    "kamept.com": CONFIG$1,
    // 旧 M-Team
    // "kp.m-team.cc": config_Mteam,
    // 新 M-Team
    "kp.m-team.cc": CONFIG,
    "xp.m-team.io": CONFIG,
    "xp.m-team.cc": CONFIG,
    "ap.m-team.cc": CONFIG,
    // 新 M-Team 测试站
    "test2.m-team.cc": CONFIG
  };
  function GET_CURRENT_PT_DOMAIN() {
    const domain = window.location.hostname;
    return domain;
  }
  let cache_selector;
  function GET_TORRENT_LIST_SELECTOR() {
    var _a;
    if (cache_selector)
      return cache_selector;
    const domain = GET_CURRENT_PT_DOMAIN();
    console.log("|-> 当前站点: ", domain);
    console.log("|-> 当前页面: ", window.location.pathname);
    const res = ((_a = SITE[domain]) == null ? void 0 : _a.torrentListTable) ?? null;
    console.log("|-> 站点selector:", res);
    cache_selector = res;
    return res;
  }
  function GET_SITE_ARCHITECTURE() {
    var _a, _b;
    const domain = GET_CURRENT_PT_DOMAIN();
    console.log("PT架构:	", (_a = SITE[domain]) == null ? void 0 : _a.architecture);
    return (_b = SITE[domain]) == null ? void 0 : _b.architecture;
  }
  function GET_SITE_BACKGROUND_COLOR() {
    var _a;
    const domain = GET_CURRENT_PT_DOMAIN();
    return (_a = SITE[domain]) == null ? void 0 : _a.get_bg_color();
  }
  const CARD = {
    /** 瀑布流卡片宽度 (废弃) */
    // CARD_WIDTH: get(_card_width),
    /** NOTE: 瀑布流卡片边框宽度 -> 这个2是真值, 但是边框好像是会随着分辨率和缩放变化, 给高有利大分辨率, 给低有利于小分辨率 */
    CARD_BORDER: 0,
    /** 瀑布流卡片索引 */
    CARD_INDEX: 0,
    /** 图片悬浮预览方式
     * 0: 一律放大到全视窗[默认]
     * 1: 最小为原图
     */
    PIC_HOVER_STYLE: 0
  };
  const PAGE = {
    /** 翻页: 底部检测时间间隔 */
    GAP: 3e3,
    /** 翻页: 底部检测视点与底部距离 */
    DISTANCE: 300,
    /** newMT 翻页: 底部检测视点与底部距离 */
    DISTANCE_newMT: 900,
    /** 翻页: 是否为初始跳转页面 */
    IS_ORIGIN: true,
    /** 翻页: 初始页面 */
    PAGE_ORIGIN: 0,
    /** 翻页: 当前页数 */
    PAGE_CURRENT: 0,
    /** 翻页: 下一页数 */
    PAGE_NEXT: 0,
    /** 翻页: 下一页的链接 */
    NEXT_URL: "",
    /** 翻页: 下一页的加载方式: Button | Slip */
    SWITCH_MODE: "Button",
    /**获取当前页*/
    $getCurrentPage: () => {
      PAGE.PAGE_CURRENT = PAGE.PAGE_CURRENT ?? 0;
      PAGE.PAGE_NEXT = PAGE.PAGE_CURRENT + 1;
      return PAGE.PAGE_CURRENT;
    },
    /**获取下一页*/
    $getNextPage: () => PAGE.PAGE_NEXT,
    /**翻页*/
    $turnPage: () => {
      PAGE.PAGE_CURRENT = PAGE.PAGE_NEXT;
      PAGE.PAGE_NEXT = PAGE.PAGE_CURRENT + 1;
    },
    /**设定页*/
    $setPage: (index) => {
      PAGE.PAGE_CURRENT = index;
      PAGE.PAGE_NEXT = PAGE.PAGE_CURRENT + 1;
    }
  };
  const ICON = {
    /** 大小图标 */
    SIZE: '<img class="size" src="pic/trans.gif" style=" transform: translateY(-0.4px);" alt="size" title="大小">',
    /** 评论图标 */
    COMMENT: '<img class="comments" src="pic/trans.gif" alt="comments" title="评论数">',
    /** 上传人数图标 */
    SEEDERS: '<img class="seeders" src="pic/trans.gif" alt="seeders" title="种子数">',
    /** 下载人数图标 */
    LEECHERS: '<img class="leechers" src="pic/trans.gif" alt="leechers" title="下载数">',
    /** 已完成人数图标 */
    SNATCHED: '<img class="snatched" src="pic/trans.gif" alt="snatched" title="完成数">',
    /** 下载图标 */
    DOWNLOAD: '<img class="download" src="pic/trans.gif" style=" transform: translateY(1px);" alt="download" title="下载本种">',
    /** 未收藏图标 */
    COLLET: '<img class="delbookmark" src="pic/trans.gif" alt="Unbookmarked" title="收藏">',
    /** 已收藏图标 */
    COLLETED: '<img class="bookmark" src="pic/trans.gif" alt="Bookmarked">',
    /** 预览图标 */
    PREVIEW: SVG_Preview
  };
  const _PicErrorLOGO = "data:image/svg+xml;base64,PHN2Zw0KICB3aWR0aD0iMjU2cHgiDQogIGhlaWdodD0iMjU2cHgiDQogIHZpZXdCb3g9IjAgMCAyNC4wMCAyNC4wMCINCiAgZmlsbD0ibm9uZSINCiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICB0cmFuc2Zvcm09Im1hdHJpeCgxLCAwLCAwLCAxLCAwLCAwKSINCj4NCiAgPGcNCiAgICBpZD0iU1ZHUmVwb19iZ0NhcnJpZXIiDQogICAgc3Ryb2tlLXdpZHRoPSIwIg0KICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsMCksIHNjYWxlKDEpIg0KICAvPg0KICA8Zw0KICAgIGlkPSJTVkdSZXBvX3RyYWNlckNhcnJpZXIiDQogICAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIg0KICAgIHN0cm9rZS1saW5lam9pbj0icm91bmQiDQogICAgc3Ryb2tlPSIjQ0NDQ0NDIg0KICAgIHN0cm9rZS13aWR0aD0iMC4wNDgiDQogIC8+DQogIDxnIGlkPSJTVkdSZXBvX2ljb25DYXJyaWVyIj4NCiAgICA8cGF0aA0KICAgICAgZD0iTTEzIDNMMTMuNzA3MSAyLjI5Mjg5QzEzLjUxOTYgMi4xMDUzNiAxMy4yNjUyIDIgMTMgMlYzWk0xNCAyMkMxNC41NTIzIDIyIDE1IDIxLjU1MjMgMTUgMjFDMTUgMjAuNDQ3NyAxNC41NTIzIDIwIDE0IDIwVjIyWk0xOSA5SDIwQzIwIDguNzM0NzggMTkuODk0NiA4LjQ4MDQzIDE5LjcwNzEgOC4yOTI4OUwxOSA5Wk0xOCAxMEMxOCAxMC41NTIzIDE4LjQ0NzcgMTEgMTkgMTFDMTkuNTUyMyAxMSAyMCAxMC41NTIzIDIwIDEwSDE4Wk01LjIxNzk5IDE5LjkwOEw0LjMyNjk4IDIwLjM2Mkg0LjMyNjk4TDUuMjE3OTkgMTkuOTA4Wk02LjA5MjAyIDIwLjc4Mkw2LjU0NjAxIDE5Ljg5MUw2LjU0NjAxIDE5Ljg5MUw2LjA5MjAyIDIwLjc4MlpNNi4wOTIwMiAzLjIxNzk5TDUuNjM4MDMgMi4zMjY5OEw1LjYzODAzIDIuMzI2OThMNi4wOTIwMiAzLjIxNzk5Wk01LjIxNzk5IDQuMDkyMDJMNC4zMjY5OCAzLjYzODAzTDQuMzI2OTggMy42MzgwM0w1LjIxNzk5IDQuMDkyMDJaTTEzLjEwOSA4LjQ1Mzk5TDE0IDhWOEwxMy4xMDkgOC40NTM5OVpNMTMuNTQ2IDguODkxMDFMMTQgOEwxMy41NDYgOC44OTEwMVpNMTcuMjI5OSAxNy43OTI5QzE2LjgzOTQgMTguMTgzNCAxNi44Mzk0IDE4LjgxNjYgMTcuMjI5OSAxOS4yMDcxQzE3LjYyMDQgMTkuNTk3NiAxOC4yNTM2IDE5LjU5NzYgMTguNjQ0MSAxOS4yMDcxTDE3LjIyOTkgMTcuNzkyOVpNMTUuMDMxNiAxNS4yNTA3QzE0Ljg5MzkgMTUuNzg1NiAxNS4yMTU5IDE2LjMzMDggMTUuNzUwNyAxNi40Njg0QzE2LjI4NTYgMTYuNjA2MSAxNi44MzA4IDE2LjI4NDEgMTYuOTY4NCAxNS43NDkzTDE1LjAzMTYgMTUuMjUwN1pNMTcuOTM3NSAyMEMxNy4zODUyIDIwIDE2LjkzNzUgMjAuNDQ3NyAxNi45Mzc1IDIxQzE2LjkzNzUgMjEuNTUyMyAxNy4zODUyIDIyIDE3LjkzNzUgMjJWMjBaTTE3Ljk0NzUgMjJDMTguNDk5OCAyMiAxOC45NDc1IDIxLjU1MjMgMTguOTQ3NSAyMUMxOC45NDc1IDIwLjQ0NzcgMTguNDk5OCAyMCAxNy45NDc1IDIwVjIyWk0xMyAySDguMlY0SDEzVjJaTTQgNi4yVjE3LjhINlY2LjJINFpNOC4yIDIySDE0VjIwSDguMlYyMlpNMTkuNzA3MSA4LjI5Mjg5TDEzLjcwNzEgMi4yOTI4OUwxMi4yOTI5IDMuNzA3MTFMMTguMjkyOSA5LjcwNzExTDE5LjcwNzEgOC4yOTI4OVpNMjAgMTBWOUgxOFYxMEgyMFpNNCAxNy44QzQgMTguMzQzNiAzLjk5OTIyIDE4LjgxMTQgNC4wMzA1NyAxOS4xOTVDNC4wNjI4NyAxOS41OTA0IDQuMTM0MTkgMTkuOTgzNiA0LjMyNjk4IDIwLjM2Mkw2LjEwODk5IDE5LjQ1NEM2LjA4MzggMTkuNDA0NSA2LjA0NjEyIDE5LjMwMzggNi4wMjM5MyAxOS4wMzIyQzYuMDAwNzggMTguNzQ4OCA2IDE4LjM3NjYgNiAxNy44SDRaTTguMiAyMEM3LjYyMzQ1IDIwIDcuMjUxMTcgMTkuOTk5MiA2Ljk2Nzg0IDE5Ljk3NjFDNi42OTYxNyAxOS45NTM5IDYuNTk1NDUgMTkuOTE2MiA2LjU0NjAxIDE5Ljg5MUw1LjYzODAzIDIxLjY3M0M2LjAxNjQxIDIxLjg2NTggNi40MDk2MyAyMS45MzcxIDYuODA0OTcgMjEuOTY5NEM3LjE4ODY0IDIyLjAwMDggNy42NTY0NSAyMiA4LjIgMjJWMjBaTTQuMzI2OTggMjAuMzYyQzQuNjE0NiAyMC45MjY1IDUuMDczNTQgMjEuMzg1NCA1LjYzODAzIDIxLjY3M0w2LjU0NjAxIDE5Ljg5MUM2LjM1Nzg1IDE5Ljc5NTEgNi4yMDQ4NyAxOS42NDIyIDYuMTA4OTkgMTkuNDU0TDQuMzI2OTggMjAuMzYyWk04LjIgMkM3LjY1NjQ1IDIgNy4xODg2NCAxLjk5OTIyIDYuODA0OTcgMi4wMzA1N0M2LjQwOTYzIDIuMDYyODcgNi4wMTY0MSAyLjEzNDE5IDUuNjM4MDMgMi4zMjY5OEw2LjU0NjAxIDQuMTA4OTlDNi41OTU0NSA0LjA4MzggNi42OTYxNyA0LjA0NjEyIDYuOTY3ODQgNC4wMjM5M0M3LjI1MTE3IDQuMDAwNzggNy42MjM0NSA0IDguMiA0VjJaTTYgNi4yQzYgNS42MjM0NSA2LjAwMDc4IDUuMjUxMTcgNi4wMjM5MyA0Ljk2Nzg0QzYuMDQ2MTIgNC42OTYxNyA2LjA4MzggNC41OTU0NSA2LjEwODk5IDQuNTQ2MDFMNC4zMjY5OCAzLjYzODAzQzQuMTM0MTkgNC4wMTY0MSA0LjA2Mjg3IDQuNDA5NjMgNC4wMzA1NyA0LjgwNDk3QzMuOTk5MjIgNS4xODg2NCA0IDUuNjU2NDUgNCA2LjJINlpNNS42MzgwMyAyLjMyNjk4QzUuMDczNTQgMi42MTQ2IDQuNjE0NiAzLjA3MzU0IDQuMzI2OTggMy42MzgwM0w2LjEwODk5IDQuNTQ2MDFDNi4yMDQ4NyA0LjM1Nzg1IDYuMzU3ODUgNC4yMDQ4NyA2LjU0NjAxIDQuMTA4OTlMNS42MzgwMyAyLjMyNjk4Wk0xMiAzVjcuNEgxNFYzSDEyWk0xNC42IDEwSDE5VjhIMTQuNlYxMFpNMTIgNy40QzEyIDcuNjYzNTMgMTEuOTk5MiA3LjkyMTMxIDEyLjAxNjkgOC4xMzgyM0MxMi4wMzU2IDguMzY2ODIgMTIuMDc5NyA4LjYzNjU2IDEyLjIxOCA4LjkwNzk4TDE0IDhDMTQuMDI5MyA4LjA1NzUxIDE0LjAxODkgOC4wODAyOCAxNC4wMTAzIDcuOTc1MzdDMTQuMDAwOCA3Ljg1ODc4IDE0IDcuNjk2NTMgMTQgNy40SDEyWk0xNC42IDhDMTQuMzAzNSA4IDE0LjE0MTIgNy45OTkyMiAxNC4wMjQ2IDcuOTg5N0MxMy45MTk3IDcuOTgxMTMgMTMuOTQyNSA3Ljk3MDcgMTQgOEwxMy4wOTIgOS43ODIwMUMxMy4zNjM0IDkuOTIwMzEgMTMuNjMzMiA5Ljk2NDM4IDEzLjg2MTggOS45ODMwNUMxNC4wNzg3IDEwLjAwMDggMTQuMzM2NSAxMCAxNC42IDEwVjhaTTEyLjIxOCA4LjkwNzk4QzEyLjQwOTcgOS4yODQzIDEyLjcxNTcgOS41OTAyNyAxMy4wOTIgOS43ODIwMUwxNCA4VjhMMTIuMjE4IDguOTA3OThaTTE4LjkzNyAxNkMxOC45MzcgMTYuMTczMiAxOC44OTE1IDE2LjMwNTMgMTguNjE3NSAxNi41Njk3QzE4LjQ2MzggMTYuNzE4IDE4LjI4MjggMTYuODY1MyAxOC4wMzE5IDE3LjA3NEMxNy43OTM2IDE3LjI3MjMgMTcuNTE0MSAxNy41MDg3IDE3LjIyOTkgMTcuNzkyOUwxOC42NDQxIDE5LjIwNzFDMTguODYgMTguOTkxMyAxOS4wODA1IDE4LjgwMzMgMTkuMzEwOSAxOC42MTE2QzE5LjUyODcgMTguNDMwNSAxOS43ODUyIDE4LjIyMjMgMjAuMDA2NSAxOC4wMDg3QzIwLjQ4MjUgMTcuNTQ5MyAyMC45MzcgMTYuOTMxNCAyMC45MzcgMTZIMTguOTM3Wk0xNy45MzcgMTVDMTguNDg5MyAxNSAxOC45MzcgMTUuNDQ3NyAxOC45MzcgMTZIMjAuOTM3QzIwLjkzNyAxNC4zNDMxIDE5LjU5MzggMTMgMTcuOTM3IDEzVjE1Wk0xNi45Njg0IDE1Ljc0OTNDMTcuMDc5NSAxNS4zMTc3IDE3LjQ3MjQgMTUgMTcuOTM3IDE1VjEzQzE2LjUzNzcgMTMgMTUuMzY0NSAxMy45NTcgMTUuMDMxNiAxNS4yNTA3TDE2Ljk2ODQgMTUuNzQ5M1pNMTcuOTM3NSAyMkgxNy45NDc1VjIwSDE3LjkzNzVWMjJaIg0KICAgICAgZmlsbD0iI2MwMDAwMCINCiAgICAvPg0KICA8L2c+DQo8L3N2Zz4=";
  function create_if_block_18$1(ctx) {
    let div;
    let a;
    let html_tag;
    let raw_value = (
      /*torrentInfo*/
      (ctx[0].tempTagDom ? (
        /*torrentInfo*/
        ctx[0].tempTagDom.map(func).join("&nbsp;")
      ) : "") + ""
    );
    let t0;
    let b;
    let t1_value = (
      /*torrentInfo*/
      ctx[0].torrent_name + ""
    );
    let t1;
    let a_href_value;
    return {
      c() {
        div = element("div");
        a = element("a");
        html_tag = new HtmlTag(false);
        t0 = space();
        b = element("b");
        t1 = text(t1_value);
        html_tag.a = t0;
        attr(a, "class", "two-lines svelte-1d0ss3t");
        attr(a, "href", a_href_value = /*torrentInfo*/
        ctx[0].torrentLink);
        attr(a, "target", "_blank");
        attr(div, "class", "card-title svelte-1d0ss3t");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, a);
        html_tag.m(raw_value, a);
        append(a, t0);
        append(a, b);
        append(b, t1);
      },
      p(ctx2, dirty) {
        if (dirty & /*torrentInfo*/
        1 && raw_value !== (raw_value = /*torrentInfo*/
        (ctx2[0].tempTagDom ? (
          /*torrentInfo*/
          ctx2[0].tempTagDom.map(func).join("&nbsp;")
        ) : "") + ""))
          html_tag.p(raw_value);
        if (dirty & /*torrentInfo*/
        1 && t1_value !== (t1_value = /*torrentInfo*/
        ctx2[0].torrent_name + ""))
          set_data(t1, t1_value);
        if (dirty & /*torrentInfo*/
        1 && a_href_value !== (a_href_value = /*torrentInfo*/
        ctx2[0].torrentLink)) {
          attr(a, "href", a_href_value);
        }
      },
      d(detaching) {
        if (detaching)
          detach(div);
      }
    };
  }
  function create_else_block$3(ctx) {
    let div2;
    let div0;
    let img;
    let img_src_value;
    let t0;
    let div1;
    let mounted;
    let dispose;
    return {
      c() {
        div2 = element("div");
        div0 = element("div");
        img = element("img");
        t0 = space();
        div1 = element("div");
        div1.textContent = "图片加载失败";
        set_style(img, "height", "100%");
        set_style(img, "width", "100px");
        if (!src_url_equal(img.src, img_src_value = _PicErrorLOGO))
          attr(img, "src", img_src_value);
        attr(img, "alt", "pic error");
        attr(img, "class", "svelte-1d0ss3t");
        attr(div2, "class", "pic_error");
        attr(div2, "style", "");
      },
      m(target, anchor) {
        insert(target, div2, anchor);
        append(div2, div0);
        append(div0, img);
        append(div2, t0);
        append(div2, div1);
        if (!mounted) {
          dispose = listen(
            img,
            "load",
            /*sort_masonry*/
            ctx[8]
          );
          mounted = true;
        }
      },
      p: noop,
      d(detaching) {
        if (detaching)
          detach(div2);
        mounted = false;
        dispose();
      }
    };
  }
  function create_if_block_17$1(ctx) {
    let img;
    let img_src_value;
    let img_data_src_value;
    let img_alt_value;
    let mounted;
    let dispose;
    return {
      c() {
        img = element("img");
        attr(img, "class", "nexus-lazy-load_Kesa svelte-1d0ss3t");
        if (!src_url_equal(img.src, img_src_value = CONFIG$1.LOADING_PIC))
          attr(img, "src", img_src_value);
        attr(img, "data-src", img_data_src_value = /*torrentInfo*/
        ctx[0].picLink);
        attr(img, "alt", img_alt_value = /*torrentInfo*/
        ctx[0].torrentName);
      },
      m(target, anchor) {
        insert(target, img, anchor);
        if (!mounted) {
          dispose = [
            listen(
              img,
              "load",
              /*sort_masonry*/
              ctx[8]
            ),
            listen(
              img,
              "error",
              /*error_handler*/
              ctx[13]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty & /*torrentInfo*/
        1 && img_data_src_value !== (img_data_src_value = /*torrentInfo*/
        ctx2[0].picLink)) {
          attr(img, "data-src", img_data_src_value);
        }
        if (dirty & /*torrentInfo*/
        1 && img_alt_value !== (img_alt_value = /*torrentInfo*/
        ctx2[0].torrentName)) {
          attr(img, "alt", img_alt_value);
        }
      },
      d(detaching) {
        if (detaching)
          detach(img);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_if_block_16$1(ctx) {
    let div;
    let img;
    let img_src_value;
    return {
      c() {
        div = element("div");
        img = element("img");
        set_style(img, "pointer-events", "none");
        if (!src_url_equal(img.src, img_src_value = /*ICON*/
        ctx[2].PREVIEW))
          attr(img, "src", img_src_value);
        attr(img, "alt", "PREVIEW");
        attr(img, "class", "svelte-1d0ss3t");
        attr(div, "class", "hover-trigger svelte-1d0ss3t");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, img);
      },
      p(ctx2, dirty) {
        if (dirty & /*ICON*/
        4 && !src_url_equal(img.src, img_src_value = /*ICON*/
        ctx2[2].PREVIEW)) {
          attr(img, "src", img_src_value);
        }
      },
      d(detaching) {
        if (detaching)
          detach(div);
      }
    };
  }
  function create_if_block_10$1(ctx) {
    let t0;
    let t1;
    let div0;
    let raw0_value = (
      /*torrentInfo*/
      ctx[0].tagsDOM.map(
        /*func_2*/
        ctx[14]
      ).join("") + ""
    );
    let t2;
    let div8;
    let div5;
    let div1;
    let html_tag;
    let raw1_value = (
      /*ICON*/
      ctx[2].SIZE + ""
    );
    let t3;
    let t4_value = (
      /*torrentInfo*/
      ctx[0].size + ""
    );
    let t4;
    let t5;
    let div2;
    let html_tag_1;
    let raw2_value = (
      /*ICON*/
      ctx[2].DOWNLOAD + ""
    );
    let t6;
    let b0;
    let a;
    let t7;
    let a_href_value;
    let t8;
    let div4;
    let div3;
    let html_tag_2;
    let raw3_value = (
      /*torrentInfo*/
      (ctx[0].collectState == "Unbookmarked" ? (
        /*ICON*/
        ctx[2].COLLET
      ) : (
        /*ICON*/
        ctx[2].COLLETED
      )) + ""
    );
    let t9;
    let b1;
    let div3_id_value;
    let t11;
    let div6;
    let b2;
    let t13;
    let t14_value = (
      /*torrentInfo*/
      ctx[0].upload_date + ""
    );
    let t14;
    let t15;
    let div7;
    let html_tag_3;
    let raw4_value = (
      /*ICON*/
      ctx[2].COMMENT + ""
    );
    let t16;
    let b3;
    let t17_value = (
      /*torrentInfo*/
      ctx[0].comments + ""
    );
    let t17;
    let t18;
    let html_tag_4;
    let raw5_value = (
      /*ICON*/
      ctx[2].SEEDERS + ""
    );
    let t19;
    let b4;
    let t20_value = (
      /*torrentInfo*/
      ctx[0].seeders + ""
    );
    let t20;
    let t21;
    let html_tag_5;
    let raw6_value = (
      /*ICON*/
      ctx[2].LEECHERS + ""
    );
    let t22;
    let b5;
    let t23_value = (
      /*torrentInfo*/
      ctx[0].leechers + ""
    );
    let t23;
    let t24;
    let html_tag_6;
    let raw7_value = (
      /*ICON*/
      ctx[2].SNATCHED + ""
    );
    let t25;
    let b6;
    let t26_value = (
      /*torrentInfo*/
      ctx[0].snatched + ""
    );
    let t26;
    let mounted;
    let dispose;
    let if_block0 = (
      /*torrentInfo*/
      (ctx[0].free_type || /*torrentInfo*/
      ctx[0].pattMsg) && create_if_block_12$1(ctx)
    );
    let if_block1 = (
      /*torrentInfo*/
      ctx[0].description && create_if_block_11$1(ctx)
    );
    return {
      c() {
        if (if_block0)
          if_block0.c();
        t0 = space();
        if (if_block1)
          if_block1.c();
        t1 = space();
        div0 = element("div");
        t2 = space();
        div8 = element("div");
        div5 = element("div");
        div1 = element("div");
        html_tag = new HtmlTag(false);
        t3 = text(" ");
        t4 = text(t4_value);
        t5 = text("\r\n\r\n          \r\n            \r\n          ");
        div2 = element("div");
        html_tag_1 = new HtmlTag(false);
        t6 = text(" \r\n            ");
        b0 = element("b");
        a = element("a");
        t7 = text("下载");
        t8 = text("\r\n\r\n          \r\n            \r\n          ");
        div4 = element("div");
        div3 = element("div");
        html_tag_2 = new HtmlTag(false);
        t9 = text("\r\n               ");
        b1 = element("b");
        b1.textContent = "收藏";
        t11 = space();
        div6 = element("div");
        b2 = element("b");
        b2.textContent = "上传时间:";
        t13 = space();
        t14 = text(t14_value);
        t15 = space();
        div7 = element("div");
        html_tag_3 = new HtmlTag(false);
        t16 = text(" ");
        b3 = element("b");
        t17 = text(t17_value);
        t18 = text("  \r\n          ");
        html_tag_4 = new HtmlTag(false);
        t19 = text(" ");
        b4 = element("b");
        t20 = text(t20_value);
        t21 = text("  \r\n          ");
        html_tag_5 = new HtmlTag(false);
        t22 = text(" ");
        b5 = element("b");
        t23 = text(t23_value);
        t24 = text("  \r\n          ");
        html_tag_6 = new HtmlTag(false);
        t25 = text(" ");
        b6 = element("b");
        t26 = text(t26_value);
        attr(div0, "class", "cl-tags svelte-1d0ss3t");
        html_tag.a = t3;
        attr(div1, "class", "cl-center svelte-1d0ss3t");
        html_tag_1.a = t6;
        attr(a, "href", a_href_value = /*torrentInfo*/
        ctx[0].downloadLink);
        attr(div2, "class", "cl-center svelte-1d0ss3t");
        html_tag_2.a = t9;
        attr(div3, "class", "btnCollet cl-center svelte-1d0ss3t");
        attr(div3, "id", div3_id_value = "tI_" + /*torrentInfo*/
        ctx[0].torrentIndex);
        attr(div4, "class", "cl-center svelte-1d0ss3t");
        attr(div5, "class", "card-line svelte-1d0ss3t");
        attr(div6, "class", "card-line svelte-1d0ss3t");
        html_tag_3.a = t16;
        html_tag_4.a = t19;
        html_tag_5.a = t22;
        html_tag_6.a = t25;
        attr(div7, "class", "card-line svelte-1d0ss3t");
        attr(div8, "class", "card-details svelte-1d0ss3t");
      },
      m(target, anchor) {
        if (if_block0)
          if_block0.m(target, anchor);
        insert(target, t0, anchor);
        if (if_block1)
          if_block1.m(target, anchor);
        insert(target, t1, anchor);
        insert(target, div0, anchor);
        div0.innerHTML = raw0_value;
        insert(target, t2, anchor);
        insert(target, div8, anchor);
        append(div8, div5);
        append(div5, div1);
        html_tag.m(raw1_value, div1);
        append(div1, t3);
        append(div1, t4);
        append(div5, t5);
        append(div5, div2);
        html_tag_1.m(raw2_value, div2);
        append(div2, t6);
        append(div2, b0);
        append(b0, a);
        append(a, t7);
        append(div5, t8);
        append(div5, div4);
        append(div4, div3);
        html_tag_2.m(raw3_value, div3);
        append(div3, t9);
        append(div3, b1);
        append(div8, t11);
        append(div8, div6);
        append(div6, b2);
        append(div6, t13);
        append(div6, t14);
        append(div8, t15);
        append(div8, div7);
        html_tag_3.m(raw4_value, div7);
        append(div7, t16);
        append(div7, b3);
        append(b3, t17);
        append(div7, t18);
        html_tag_4.m(raw5_value, div7);
        append(div7, t19);
        append(div7, b4);
        append(b4, t20);
        append(div7, t21);
        html_tag_5.m(raw6_value, div7);
        append(div7, t22);
        append(div7, b5);
        append(b5, t23);
        append(div7, t24);
        html_tag_6.m(raw7_value, div7);
        append(div7, t25);
        append(div7, b6);
        append(b6, t26);
        if (!mounted) {
          dispose = listen(
            div3,
            "click",
            /*click_handler*/
            ctx[15]
          );
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (
          /*torrentInfo*/
          ctx2[0].free_type || /*torrentInfo*/
          ctx2[0].pattMsg
        ) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
          } else {
            if_block0 = create_if_block_12$1(ctx2);
            if_block0.c();
            if_block0.m(t0.parentNode, t0);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (
          /*torrentInfo*/
          ctx2[0].description
        ) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
          } else {
            if_block1 = create_if_block_11$1(ctx2);
            if_block1.c();
            if_block1.m(t1.parentNode, t1);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
        if (dirty & /*torrentInfo*/
        1 && raw0_value !== (raw0_value = /*torrentInfo*/
        ctx2[0].tagsDOM.map(
          /*func_2*/
          ctx2[14]
        ).join("") + ""))
          div0.innerHTML = raw0_value;
        if (dirty & /*ICON*/
        4 && raw1_value !== (raw1_value = /*ICON*/
        ctx2[2].SIZE + ""))
          html_tag.p(raw1_value);
        if (dirty & /*torrentInfo*/
        1 && t4_value !== (t4_value = /*torrentInfo*/
        ctx2[0].size + ""))
          set_data(t4, t4_value);
        if (dirty & /*ICON*/
        4 && raw2_value !== (raw2_value = /*ICON*/
        ctx2[2].DOWNLOAD + ""))
          html_tag_1.p(raw2_value);
        if (dirty & /*torrentInfo*/
        1 && a_href_value !== (a_href_value = /*torrentInfo*/
        ctx2[0].downloadLink)) {
          attr(a, "href", a_href_value);
        }
        if (dirty & /*torrentInfo, ICON*/
        5 && raw3_value !== (raw3_value = /*torrentInfo*/
        (ctx2[0].collectState == "Unbookmarked" ? (
          /*ICON*/
          ctx2[2].COLLET
        ) : (
          /*ICON*/
          ctx2[2].COLLETED
        )) + ""))
          html_tag_2.p(raw3_value);
        if (dirty & /*torrentInfo*/
        1 && div3_id_value !== (div3_id_value = "tI_" + /*torrentInfo*/
        ctx2[0].torrentIndex)) {
          attr(div3, "id", div3_id_value);
        }
        if (dirty & /*torrentInfo*/
        1 && t14_value !== (t14_value = /*torrentInfo*/
        ctx2[0].upload_date + ""))
          set_data(t14, t14_value);
        if (dirty & /*ICON*/
        4 && raw4_value !== (raw4_value = /*ICON*/
        ctx2[2].COMMENT + ""))
          html_tag_3.p(raw4_value);
        if (dirty & /*torrentInfo*/
        1 && t17_value !== (t17_value = /*torrentInfo*/
        ctx2[0].comments + ""))
          set_data(t17, t17_value);
        if (dirty & /*ICON*/
        4 && raw5_value !== (raw5_value = /*ICON*/
        ctx2[2].SEEDERS + ""))
          html_tag_4.p(raw5_value);
        if (dirty & /*torrentInfo*/
        1 && t20_value !== (t20_value = /*torrentInfo*/
        ctx2[0].seeders + ""))
          set_data(t20, t20_value);
        if (dirty & /*ICON*/
        4 && raw6_value !== (raw6_value = /*ICON*/
        ctx2[2].LEECHERS + ""))
          html_tag_5.p(raw6_value);
        if (dirty & /*torrentInfo*/
        1 && t23_value !== (t23_value = /*torrentInfo*/
        ctx2[0].leechers + ""))
          set_data(t23, t23_value);
        if (dirty & /*ICON*/
        4 && raw7_value !== (raw7_value = /*ICON*/
        ctx2[2].SNATCHED + ""))
          html_tag_6.p(raw7_value);
        if (dirty & /*torrentInfo*/
        1 && t26_value !== (t26_value = /*torrentInfo*/
        ctx2[0].snatched + ""))
          set_data(t26, t26_value);
      },
      d(detaching) {
        if (if_block0)
          if_block0.d(detaching);
        if (detaching)
          detach(t0);
        if (if_block1)
          if_block1.d(detaching);
        if (detaching)
          detach(t1);
        if (detaching)
          detach(div0);
        if (detaching)
          detach(t2);
        if (detaching)
          detach(div8);
        mounted = false;
        dispose();
      }
    };
  }
  function create_if_block_12$1(ctx) {
    let div1;
    let div0;
    let t0;
    let t1;
    let div0_class_value;
    let if_block0 = (
      /*torrentInfo*/
      ctx[0].place_at_the_top.length != 0 && create_if_block_15$1(ctx)
    );
    let if_block1 = (
      /*torrentInfo*/
      ctx[0].freeTypeImg && create_if_block_14$1(ctx)
    );
    let if_block2 = (
      /*torrentInfo*/
      ctx[0].free_remaining_time && create_if_block_13$1(ctx)
    );
    return {
      c() {
        div1 = element("div");
        div0 = element("div");
        if (if_block0)
          if_block0.c();
        t0 = space();
        if (if_block1)
          if_block1.c();
        t1 = space();
        if (if_block2)
          if_block2.c();
        attr(div0, "class", div0_class_value = "top_and_free " + /*torrentInfo*/
        ctx[0].free_type + " svelte-1d0ss3t");
        attr(div1, "class", "card-alter svelte-1d0ss3t");
      },
      m(target, anchor) {
        insert(target, div1, anchor);
        append(div1, div0);
        if (if_block0)
          if_block0.m(div0, null);
        append(div0, t0);
        if (if_block1)
          if_block1.m(div0, null);
        append(div0, t1);
        if (if_block2)
          if_block2.m(div0, null);
      },
      p(ctx2, dirty) {
        if (
          /*torrentInfo*/
          ctx2[0].place_at_the_top.length != 0
        ) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
          } else {
            if_block0 = create_if_block_15$1(ctx2);
            if_block0.c();
            if_block0.m(div0, t0);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (
          /*torrentInfo*/
          ctx2[0].freeTypeImg
        ) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
          } else {
            if_block1 = create_if_block_14$1(ctx2);
            if_block1.c();
            if_block1.m(div0, t1);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
        if (
          /*torrentInfo*/
          ctx2[0].free_remaining_time
        ) {
          if (if_block2) {
            if_block2.p(ctx2, dirty);
          } else {
            if_block2 = create_if_block_13$1(ctx2);
            if_block2.c();
            if_block2.m(div0, null);
          }
        } else if (if_block2) {
          if_block2.d(1);
          if_block2 = null;
        }
        if (dirty & /*torrentInfo*/
        1 && div0_class_value !== (div0_class_value = "top_and_free " + /*torrentInfo*/
        ctx2[0].free_type + " svelte-1d0ss3t")) {
          attr(div0, "class", div0_class_value);
        }
      },
      d(detaching) {
        if (detaching)
          detach(div1);
        if (if_block0)
          if_block0.d();
        if (if_block1)
          if_block1.d();
        if (if_block2)
          if_block2.d();
      }
    };
  }
  function create_if_block_15$1(ctx) {
    let html_tag;
    let raw_value = Array.from(
      /*torrentInfo*/
      ctx[0].place_at_the_top
    ).map(func_1) + "&nbsp;";
    let html_anchor;
    return {
      c() {
        html_tag = new HtmlTag(false);
        html_anchor = empty();
        html_tag.a = html_anchor;
      },
      m(target, anchor) {
        html_tag.m(raw_value, target, anchor);
        insert(target, html_anchor, anchor);
      },
      p(ctx2, dirty) {
        if (dirty & /*torrentInfo*/
        1 && raw_value !== (raw_value = Array.from(
          /*torrentInfo*/
          ctx2[0].place_at_the_top
        ).map(func_1) + "&nbsp;"))
          html_tag.p(raw_value);
      },
      d(detaching) {
        if (detaching)
          detach(html_anchor);
        if (detaching)
          html_tag.d();
      }
    };
  }
  function create_if_block_14$1(ctx) {
    let html_tag;
    let raw_value = (
      /*torrentInfo*/
      ctx[0].freeTypeImg.outerHTML + ""
    );
    let html_anchor;
    return {
      c() {
        html_tag = new HtmlTag(false);
        html_anchor = empty();
        html_tag.a = html_anchor;
      },
      m(target, anchor) {
        html_tag.m(raw_value, target, anchor);
        insert(target, html_anchor, anchor);
      },
      p(ctx2, dirty) {
        if (dirty & /*torrentInfo*/
        1 && raw_value !== (raw_value = /*torrentInfo*/
        ctx2[0].freeTypeImg.outerHTML + ""))
          html_tag.p(raw_value);
      },
      d(detaching) {
        if (detaching)
          detach(html_anchor);
        if (detaching)
          html_tag.d();
      }
    };
  }
  function create_if_block_13$1(ctx) {
    let t0;
    let b;
    let t1_value = (
      /*torrentInfo*/
      ctx[0].free_remaining_time + ""
    );
    let t1;
    return {
      c() {
        t0 = text(" ");
        b = element("b");
        t1 = text(t1_value);
      },
      m(target, anchor) {
        insert(target, t0, anchor);
        insert(target, b, anchor);
        append(b, t1);
      },
      p(ctx2, dirty) {
        if (dirty & /*torrentInfo*/
        1 && t1_value !== (t1_value = /*torrentInfo*/
        ctx2[0].free_remaining_time + ""))
          set_data(t1, t1_value);
      },
      d(detaching) {
        if (detaching)
          detach(t0);
        if (detaching)
          detach(b);
      }
    };
  }
  function create_if_block_11$1(ctx) {
    let a;
    let t_value = (
      /*torrentInfo*/
      ctx[0].description + ""
    );
    let t;
    let a_href_value;
    return {
      c() {
        a = element("a");
        t = text(t_value);
        attr(a, "class", "card-description svelte-1d0ss3t");
        attr(a, "href", a_href_value = /*torrentInfo*/
        ctx[0].torrentLink);
      },
      m(target, anchor) {
        insert(target, a, anchor);
        append(a, t);
      },
      p(ctx2, dirty) {
        if (dirty & /*torrentInfo*/
        1 && t_value !== (t_value = /*torrentInfo*/
        ctx2[0].description + ""))
          set_data(t, t_value);
        if (dirty & /*torrentInfo*/
        1 && a_href_value !== (a_href_value = /*torrentInfo*/
        ctx2[0].torrentLink)) {
          attr(a, "href", a_href_value);
        }
      },
      d(detaching) {
        if (detaching)
          detach(a);
      }
    };
  }
  function create_if_block$6(ctx) {
    let t0;
    let t1;
    let t2;
    let div;
    let t3;
    let t4;
    let if_block0 = (
      /*$_CARD_SHOW*/
      ctx[6].free && /*torrentInfo*/
      (ctx[0].free_type || /*torrentInfo*/
      ctx[0].pattMsg) && create_if_block_6$1(ctx)
    );
    let if_block1 = (
      /*$_CARD_SHOW*/
      ctx[6].sub_title && /*torrentInfo*/
      ctx[0].description && create_if_block_5$1(ctx)
    );
    let if_block2 = (
      /*$_CARD_SHOW*/
      ctx[6].tags && create_if_block_4$1(ctx)
    );
    let if_block3 = (
      /*$_CARD_SHOW*/
      ctx[6].size_download_collect && create_if_block_3$1(ctx)
    );
    let if_block4 = (
      /*$_CARD_SHOW*/
      ctx[6].upload_time && create_if_block_2$2(ctx)
    );
    let if_block5 = (
      /*$_CARD_SHOW*/
      ctx[6].statistics && create_if_block_1$3(ctx)
    );
    return {
      c() {
        if (if_block0)
          if_block0.c();
        t0 = space();
        if (if_block1)
          if_block1.c();
        t1 = space();
        if (if_block2)
          if_block2.c();
        t2 = space();
        div = element("div");
        if (if_block3)
          if_block3.c();
        t3 = space();
        if (if_block4)
          if_block4.c();
        t4 = space();
        if (if_block5)
          if_block5.c();
        attr(div, "class", "card-details svelte-1d0ss3t");
      },
      m(target, anchor) {
        if (if_block0)
          if_block0.m(target, anchor);
        insert(target, t0, anchor);
        if (if_block1)
          if_block1.m(target, anchor);
        insert(target, t1, anchor);
        if (if_block2)
          if_block2.m(target, anchor);
        insert(target, t2, anchor);
        insert(target, div, anchor);
        if (if_block3)
          if_block3.m(div, null);
        append(div, t3);
        if (if_block4)
          if_block4.m(div, null);
        append(div, t4);
        if (if_block5)
          if_block5.m(div, null);
      },
      p(ctx2, dirty) {
        if (
          /*$_CARD_SHOW*/
          ctx2[6].free && /*torrentInfo*/
          (ctx2[0].free_type || /*torrentInfo*/
          ctx2[0].pattMsg)
        ) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
          } else {
            if_block0 = create_if_block_6$1(ctx2);
            if_block0.c();
            if_block0.m(t0.parentNode, t0);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (
          /*$_CARD_SHOW*/
          ctx2[6].sub_title && /*torrentInfo*/
          ctx2[0].description
        ) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
          } else {
            if_block1 = create_if_block_5$1(ctx2);
            if_block1.c();
            if_block1.m(t1.parentNode, t1);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
        if (
          /*$_CARD_SHOW*/
          ctx2[6].tags
        ) {
          if (if_block2) {
            if_block2.p(ctx2, dirty);
          } else {
            if_block2 = create_if_block_4$1(ctx2);
            if_block2.c();
            if_block2.m(t2.parentNode, t2);
          }
        } else if (if_block2) {
          if_block2.d(1);
          if_block2 = null;
        }
        if (
          /*$_CARD_SHOW*/
          ctx2[6].size_download_collect
        ) {
          if (if_block3) {
            if_block3.p(ctx2, dirty);
          } else {
            if_block3 = create_if_block_3$1(ctx2);
            if_block3.c();
            if_block3.m(div, t3);
          }
        } else if (if_block3) {
          if_block3.d(1);
          if_block3 = null;
        }
        if (
          /*$_CARD_SHOW*/
          ctx2[6].upload_time
        ) {
          if (if_block4) {
            if_block4.p(ctx2, dirty);
          } else {
            if_block4 = create_if_block_2$2(ctx2);
            if_block4.c();
            if_block4.m(div, t4);
          }
        } else if (if_block4) {
          if_block4.d(1);
          if_block4 = null;
        }
        if (
          /*$_CARD_SHOW*/
          ctx2[6].statistics
        ) {
          if (if_block5) {
            if_block5.p(ctx2, dirty);
          } else {
            if_block5 = create_if_block_1$3(ctx2);
            if_block5.c();
            if_block5.m(div, null);
          }
        } else if (if_block5) {
          if_block5.d(1);
          if_block5 = null;
        }
      },
      d(detaching) {
        if (if_block0)
          if_block0.d(detaching);
        if (detaching)
          detach(t0);
        if (if_block1)
          if_block1.d(detaching);
        if (detaching)
          detach(t1);
        if (if_block2)
          if_block2.d(detaching);
        if (detaching)
          detach(t2);
        if (detaching)
          detach(div);
        if (if_block3)
          if_block3.d();
        if (if_block4)
          if_block4.d();
        if (if_block5)
          if_block5.d();
      }
    };
  }
  function create_if_block_6$1(ctx) {
    let div1;
    let div0;
    let t0;
    let t1;
    let div0_class_value;
    let if_block0 = (
      /*torrentInfo*/
      ctx[0].place_at_the_top.length != 0 && create_if_block_9$1(ctx)
    );
    let if_block1 = (
      /*torrentInfo*/
      ctx[0].freeTypeImg && create_if_block_8$1(ctx)
    );
    let if_block2 = (
      /*torrentInfo*/
      ctx[0].free_remaining_time && create_if_block_7$1(ctx)
    );
    return {
      c() {
        div1 = element("div");
        div0 = element("div");
        if (if_block0)
          if_block0.c();
        t0 = space();
        if (if_block1)
          if_block1.c();
        t1 = space();
        if (if_block2)
          if_block2.c();
        attr(div0, "class", div0_class_value = "top_and_free " + /*torrentInfo*/
        ctx[0].free_type + " svelte-1d0ss3t");
        attr(div1, "class", "card-alter svelte-1d0ss3t");
      },
      m(target, anchor) {
        insert(target, div1, anchor);
        append(div1, div0);
        if (if_block0)
          if_block0.m(div0, null);
        append(div0, t0);
        if (if_block1)
          if_block1.m(div0, null);
        append(div0, t1);
        if (if_block2)
          if_block2.m(div0, null);
      },
      p(ctx2, dirty) {
        if (
          /*torrentInfo*/
          ctx2[0].place_at_the_top.length != 0
        ) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
          } else {
            if_block0 = create_if_block_9$1(ctx2);
            if_block0.c();
            if_block0.m(div0, t0);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (
          /*torrentInfo*/
          ctx2[0].freeTypeImg
        ) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
          } else {
            if_block1 = create_if_block_8$1(ctx2);
            if_block1.c();
            if_block1.m(div0, t1);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
        if (
          /*torrentInfo*/
          ctx2[0].free_remaining_time
        ) {
          if (if_block2) {
            if_block2.p(ctx2, dirty);
          } else {
            if_block2 = create_if_block_7$1(ctx2);
            if_block2.c();
            if_block2.m(div0, null);
          }
        } else if (if_block2) {
          if_block2.d(1);
          if_block2 = null;
        }
        if (dirty & /*torrentInfo*/
        1 && div0_class_value !== (div0_class_value = "top_and_free " + /*torrentInfo*/
        ctx2[0].free_type + " svelte-1d0ss3t")) {
          attr(div0, "class", div0_class_value);
        }
      },
      d(detaching) {
        if (detaching)
          detach(div1);
        if (if_block0)
          if_block0.d();
        if (if_block1)
          if_block1.d();
        if (if_block2)
          if_block2.d();
      }
    };
  }
  function create_if_block_9$1(ctx) {
    let html_tag;
    let raw_value = Array.from(
      /*torrentInfo*/
      ctx[0].place_at_the_top
    ).map(func_3) + "&nbsp;";
    let html_anchor;
    return {
      c() {
        html_tag = new HtmlTag(false);
        html_anchor = empty();
        html_tag.a = html_anchor;
      },
      m(target, anchor) {
        html_tag.m(raw_value, target, anchor);
        insert(target, html_anchor, anchor);
      },
      p(ctx2, dirty) {
        if (dirty & /*torrentInfo*/
        1 && raw_value !== (raw_value = Array.from(
          /*torrentInfo*/
          ctx2[0].place_at_the_top
        ).map(func_3) + "&nbsp;"))
          html_tag.p(raw_value);
      },
      d(detaching) {
        if (detaching)
          detach(html_anchor);
        if (detaching)
          html_tag.d();
      }
    };
  }
  function create_if_block_8$1(ctx) {
    let html_tag;
    let raw_value = (
      /*torrentInfo*/
      ctx[0].freeTypeImg.outerHTML + ""
    );
    let html_anchor;
    return {
      c() {
        html_tag = new HtmlTag(false);
        html_anchor = empty();
        html_tag.a = html_anchor;
      },
      m(target, anchor) {
        html_tag.m(raw_value, target, anchor);
        insert(target, html_anchor, anchor);
      },
      p(ctx2, dirty) {
        if (dirty & /*torrentInfo*/
        1 && raw_value !== (raw_value = /*torrentInfo*/
        ctx2[0].freeTypeImg.outerHTML + ""))
          html_tag.p(raw_value);
      },
      d(detaching) {
        if (detaching)
          detach(html_anchor);
        if (detaching)
          html_tag.d();
      }
    };
  }
  function create_if_block_7$1(ctx) {
    let t0;
    let b;
    let t1_value = (
      /*torrentInfo*/
      ctx[0].free_remaining_time + ""
    );
    let t1;
    return {
      c() {
        t0 = text(" ");
        b = element("b");
        t1 = text(t1_value);
      },
      m(target, anchor) {
        insert(target, t0, anchor);
        insert(target, b, anchor);
        append(b, t1);
      },
      p(ctx2, dirty) {
        if (dirty & /*torrentInfo*/
        1 && t1_value !== (t1_value = /*torrentInfo*/
        ctx2[0].free_remaining_time + ""))
          set_data(t1, t1_value);
      },
      d(detaching) {
        if (detaching)
          detach(t0);
        if (detaching)
          detach(b);
      }
    };
  }
  function create_if_block_5$1(ctx) {
    let a;
    let t_value = (
      /*torrentInfo*/
      ctx[0].description + ""
    );
    let t;
    let a_href_value;
    return {
      c() {
        a = element("a");
        t = text(t_value);
        attr(a, "class", "card-description svelte-1d0ss3t");
        attr(a, "href", a_href_value = /*torrentInfo*/
        ctx[0].torrentLink);
      },
      m(target, anchor) {
        insert(target, a, anchor);
        append(a, t);
      },
      p(ctx2, dirty) {
        if (dirty & /*torrentInfo*/
        1 && t_value !== (t_value = /*torrentInfo*/
        ctx2[0].description + ""))
          set_data(t, t_value);
        if (dirty & /*torrentInfo*/
        1 && a_href_value !== (a_href_value = /*torrentInfo*/
        ctx2[0].torrentLink)) {
          attr(a, "href", a_href_value);
        }
      },
      d(detaching) {
        if (detaching)
          detach(a);
      }
    };
  }
  function create_if_block_4$1(ctx) {
    let div;
    let raw_value = (
      /*torrentInfo*/
      ctx[0].tagsDOM.map(
        /*func_4*/
        ctx[16]
      ).join("") + ""
    );
    return {
      c() {
        div = element("div");
        attr(div, "class", "cl-tags svelte-1d0ss3t");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        div.innerHTML = raw_value;
      },
      p(ctx2, dirty) {
        if (dirty & /*torrentInfo*/
        1 && raw_value !== (raw_value = /*torrentInfo*/
        ctx2[0].tagsDOM.map(
          /*func_4*/
          ctx2[16]
        ).join("") + ""))
          div.innerHTML = raw_value;
      },
      d(detaching) {
        if (detaching)
          detach(div);
      }
    };
  }
  function create_if_block_3$1(ctx) {
    let div4;
    let div0;
    let html_tag;
    let raw0_value = (
      /*ICON*/
      ctx[2].SIZE + ""
    );
    let t0;
    let t1_value = (
      /*torrentInfo*/
      ctx[0].size + ""
    );
    let t1;
    let t2;
    let div1;
    let html_tag_1;
    let raw1_value = (
      /*ICON*/
      ctx[2].DOWNLOAD + ""
    );
    let t3;
    let b0;
    let a;
    let t4;
    let a_href_value;
    let t5;
    let div3;
    let div2;
    let html_tag_2;
    let raw2_value = (
      /*torrentInfo*/
      (ctx[0].collectState == "Unbookmarked" ? (
        /*ICON*/
        ctx[2].COLLET
      ) : (
        /*ICON*/
        ctx[2].COLLETED
      )) + ""
    );
    let t6;
    let b1;
    let div2_id_value;
    let mounted;
    let dispose;
    return {
      c() {
        div4 = element("div");
        div0 = element("div");
        html_tag = new HtmlTag(false);
        t0 = text(" ");
        t1 = text(t1_value);
        t2 = text("\r\n\r\n            \r\n              \r\n            ");
        div1 = element("div");
        html_tag_1 = new HtmlTag(false);
        t3 = text(" \r\n              ");
        b0 = element("b");
        a = element("a");
        t4 = text("下载");
        t5 = text("\r\n\r\n            \r\n              \r\n            ");
        div3 = element("div");
        div2 = element("div");
        html_tag_2 = new HtmlTag(false);
        t6 = text("\r\n                 ");
        b1 = element("b");
        b1.textContent = "收藏";
        html_tag.a = t0;
        attr(div0, "class", "cl-center svelte-1d0ss3t");
        html_tag_1.a = t3;
        attr(a, "href", a_href_value = /*torrentInfo*/
        ctx[0].downloadLink);
        attr(div1, "class", "cl-center svelte-1d0ss3t");
        html_tag_2.a = t6;
        attr(div2, "class", "btnCollet cl-center svelte-1d0ss3t");
        attr(div2, "id", div2_id_value = "tI_" + /*torrentInfo*/
        ctx[0].torrentIndex);
        attr(div3, "class", "cl-center svelte-1d0ss3t");
        attr(div4, "class", "card-line svelte-1d0ss3t");
      },
      m(target, anchor) {
        insert(target, div4, anchor);
        append(div4, div0);
        html_tag.m(raw0_value, div0);
        append(div0, t0);
        append(div0, t1);
        append(div4, t2);
        append(div4, div1);
        html_tag_1.m(raw1_value, div1);
        append(div1, t3);
        append(div1, b0);
        append(b0, a);
        append(a, t4);
        append(div4, t5);
        append(div4, div3);
        append(div3, div2);
        html_tag_2.m(raw2_value, div2);
        append(div2, t6);
        append(div2, b1);
        if (!mounted) {
          dispose = listen(
            div2,
            "click",
            /*click_handler_1*/
            ctx[17]
          );
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty & /*ICON*/
        4 && raw0_value !== (raw0_value = /*ICON*/
        ctx2[2].SIZE + ""))
          html_tag.p(raw0_value);
        if (dirty & /*torrentInfo*/
        1 && t1_value !== (t1_value = /*torrentInfo*/
        ctx2[0].size + ""))
          set_data(t1, t1_value);
        if (dirty & /*ICON*/
        4 && raw1_value !== (raw1_value = /*ICON*/
        ctx2[2].DOWNLOAD + ""))
          html_tag_1.p(raw1_value);
        if (dirty & /*torrentInfo*/
        1 && a_href_value !== (a_href_value = /*torrentInfo*/
        ctx2[0].downloadLink)) {
          attr(a, "href", a_href_value);
        }
        if (dirty & /*torrentInfo, ICON*/
        5 && raw2_value !== (raw2_value = /*torrentInfo*/
        (ctx2[0].collectState == "Unbookmarked" ? (
          /*ICON*/
          ctx2[2].COLLET
        ) : (
          /*ICON*/
          ctx2[2].COLLETED
        )) + ""))
          html_tag_2.p(raw2_value);
        if (dirty & /*torrentInfo*/
        1 && div2_id_value !== (div2_id_value = "tI_" + /*torrentInfo*/
        ctx2[0].torrentIndex)) {
          attr(div2, "id", div2_id_value);
        }
      },
      d(detaching) {
        if (detaching)
          detach(div4);
        mounted = false;
        dispose();
      }
    };
  }
  function create_if_block_2$2(ctx) {
    let div;
    let b;
    let t1;
    let t2_value = (
      /*torrentInfo*/
      ctx[0].upload_date + ""
    );
    let t2;
    return {
      c() {
        div = element("div");
        b = element("b");
        b.textContent = "上传时间:";
        t1 = space();
        t2 = text(t2_value);
        attr(div, "class", "card-line svelte-1d0ss3t");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, b);
        append(div, t1);
        append(div, t2);
      },
      p(ctx2, dirty) {
        if (dirty & /*torrentInfo*/
        1 && t2_value !== (t2_value = /*torrentInfo*/
        ctx2[0].upload_date + ""))
          set_data(t2, t2_value);
      },
      d(detaching) {
        if (detaching)
          detach(div);
      }
    };
  }
  function create_if_block_1$3(ctx) {
    let div;
    let html_tag;
    let raw0_value = (
      /*ICON*/
      ctx[2].COMMENT + ""
    );
    let t0;
    let b0;
    let t1_value = (
      /*torrentInfo*/
      ctx[0].comments + ""
    );
    let t1;
    let t2;
    let html_tag_1;
    let raw1_value = (
      /*ICON*/
      ctx[2].SEEDERS + ""
    );
    let t3;
    let b1;
    let t4_value = (
      /*torrentInfo*/
      ctx[0].seeders + ""
    );
    let t4;
    let t5;
    let html_tag_2;
    let raw2_value = (
      /*ICON*/
      ctx[2].LEECHERS + ""
    );
    let t6;
    let b2;
    let t7_value = (
      /*torrentInfo*/
      ctx[0].leechers + ""
    );
    let t7;
    let t8;
    let html_tag_3;
    let raw3_value = (
      /*ICON*/
      ctx[2].SNATCHED + ""
    );
    let t9;
    let b3;
    let t10_value = (
      /*torrentInfo*/
      ctx[0].snatched + ""
    );
    let t10;
    return {
      c() {
        div = element("div");
        html_tag = new HtmlTag(false);
        t0 = text(" ");
        b0 = element("b");
        t1 = text(t1_value);
        t2 = text("  \r\n            ");
        html_tag_1 = new HtmlTag(false);
        t3 = text(" ");
        b1 = element("b");
        t4 = text(t4_value);
        t5 = text("  \r\n            ");
        html_tag_2 = new HtmlTag(false);
        t6 = text(" ");
        b2 = element("b");
        t7 = text(t7_value);
        t8 = text("  \r\n            ");
        html_tag_3 = new HtmlTag(false);
        t9 = text(" ");
        b3 = element("b");
        t10 = text(t10_value);
        html_tag.a = t0;
        html_tag_1.a = t3;
        html_tag_2.a = t6;
        html_tag_3.a = t9;
        attr(div, "class", "card-line svelte-1d0ss3t");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        html_tag.m(raw0_value, div);
        append(div, t0);
        append(div, b0);
        append(b0, t1);
        append(div, t2);
        html_tag_1.m(raw1_value, div);
        append(div, t3);
        append(div, b1);
        append(b1, t4);
        append(div, t5);
        html_tag_2.m(raw2_value, div);
        append(div, t6);
        append(div, b2);
        append(b2, t7);
        append(div, t8);
        html_tag_3.m(raw3_value, div);
        append(div, t9);
        append(div, b3);
        append(b3, t10);
      },
      p(ctx2, dirty) {
        if (dirty & /*ICON*/
        4 && raw0_value !== (raw0_value = /*ICON*/
        ctx2[2].COMMENT + ""))
          html_tag.p(raw0_value);
        if (dirty & /*torrentInfo*/
        1 && t1_value !== (t1_value = /*torrentInfo*/
        ctx2[0].comments + ""))
          set_data(t1, t1_value);
        if (dirty & /*ICON*/
        4 && raw1_value !== (raw1_value = /*ICON*/
        ctx2[2].SEEDERS + ""))
          html_tag_1.p(raw1_value);
        if (dirty & /*torrentInfo*/
        1 && t4_value !== (t4_value = /*torrentInfo*/
        ctx2[0].seeders + ""))
          set_data(t4, t4_value);
        if (dirty & /*ICON*/
        4 && raw2_value !== (raw2_value = /*ICON*/
        ctx2[2].LEECHERS + ""))
          html_tag_2.p(raw2_value);
        if (dirty & /*torrentInfo*/
        1 && t7_value !== (t7_value = /*torrentInfo*/
        ctx2[0].leechers + ""))
          set_data(t7, t7_value);
        if (dirty & /*ICON*/
        4 && raw3_value !== (raw3_value = /*ICON*/
        ctx2[2].SNATCHED + ""))
          html_tag_3.p(raw3_value);
        if (dirty & /*torrentInfo*/
        1 && t10_value !== (t10_value = /*torrentInfo*/
        ctx2[0].snatched + ""))
          set_data(t10, t10_value);
      },
      d(detaching) {
        if (detaching)
          detach(div);
      }
    };
  }
  function create_fragment$b(ctx) {
    let div4;
    let div3;
    let div0;
    let t0_value = (
      /*torrentInfo*/
      ctx[0].category + ""
    );
    let t0;
    let div0_data_href_value;
    let t1;
    let t2;
    let div2;
    let t3;
    let div1;
    let t4_value = (
      /*torrentInfo*/
      ctx[0].torrentIndex + 1 + ""
    );
    let t4;
    let t5;
    let t6;
    let t7;
    let mounted;
    let dispose;
    let if_block0 = (
      /*$_CARD_SHOW*/
      (ctx[6].title || /*_hover*/
      ctx[3]) && create_if_block_18$1(ctx)
    );
    function select_block_type(ctx2, dirty) {
      if (!/*_picError*/
      ctx2[4])
        return create_if_block_17$1;
      return create_else_block$3;
    }
    let current_block_type = select_block_type(ctx);
    let if_block1 = current_block_type(ctx);
    let if_block2 = (
      /*$_trigger_nexus_pic*/
      ctx[7] && create_if_block_16$1(ctx)
    );
    let if_block3 = (
      /*$_CARD_SHOW*/
      (ctx[6].all || /*_hover*/
      ctx[3]) && create_if_block_10$1(ctx)
    );
    let if_block4 = !/*$_CARD_SHOW*/
    (ctx[6].all || /*_hover*/
    ctx[3]) && create_if_block$6(ctx);
    return {
      c() {
        div4 = element("div");
        div3 = element("div");
        div0 = element("div");
        t0 = text(t0_value);
        t1 = space();
        if (if_block0)
          if_block0.c();
        t2 = space();
        div2 = element("div");
        if_block1.c();
        t3 = space();
        div1 = element("div");
        t4 = text(t4_value);
        t5 = space();
        if (if_block2)
          if_block2.c();
        t6 = space();
        if (if_block3)
          if_block3.c();
        t7 = space();
        if (if_block4)
          if_block4.c();
        attr(div0, "class", "card-category svelte-1d0ss3t");
        attr(div0, "data-href", div0_data_href_value = /*torrentInfo*/
        ctx[0].categoryLink);
        set_style(div0, "background-color", CONFIG$1.CATEGORY[
          /*torrentInfo*/
          ctx[0].categoryNumber
        ] ?? "transparent");
        set_style(div0, "color", CONFIG$1.CATEGORY[
          /*torrentInfo*/
          ctx[0].categoryNumber
        ] ? getTextColor$1(CONFIG$1.CATEGORY[
          /*torrentInfo*/
          ctx[0].categoryNumber
        ]) : "black");
        attr(div1, "class", "card-index svelte-1d0ss3t");
        attr(div2, "class", "card-image svelte-1d0ss3t");
        attr(div3, "class", "card-holder svelte-1d0ss3t");
        attr(div4, "class", "card svelte-1d0ss3t");
        set_style(
          div4,
          "width",
          /*cardWidth*/
          ctx[1] + "px"
        );
        set_style(div4, "z-index", 1e4 - /*torrentInfo*/
        ctx[0].torrentIndex);
        set_style(
          div4,
          "background-color",
          /*$_current_bgColor*/
          ctx[5]
        );
      },
      m(target, anchor) {
        insert(target, div4, anchor);
        append(div4, div3);
        append(div3, div0);
        append(div0, t0);
        append(div3, t1);
        if (if_block0)
          if_block0.m(div3, null);
        append(div3, t2);
        append(div3, div2);
        if_block1.m(div2, null);
        append(div2, t3);
        append(div2, div1);
        append(div1, t4);
        append(div2, t5);
        if (if_block2)
          if_block2.m(div2, null);
        append(div3, t6);
        if (if_block3)
          if_block3.m(div3, null);
        append(div3, t7);
        if (if_block4)
          if_block4.m(div3, null);
        if (!mounted) {
          dispose = [
            listen(
              div2,
              "click",
              /*showDetailIframe*/
              ctx[10]
            ),
            listen(
              div3,
              "mouseenter",
              /*card_show_detail*/
              ctx[11]
            ),
            listen(
              div3,
              "mouseleave",
              /*card_hide_detail*/
              ctx[12]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (dirty & /*torrentInfo*/
        1 && t0_value !== (t0_value = /*torrentInfo*/
        ctx2[0].category + ""))
          set_data(t0, t0_value);
        if (dirty & /*torrentInfo*/
        1 && div0_data_href_value !== (div0_data_href_value = /*torrentInfo*/
        ctx2[0].categoryLink)) {
          attr(div0, "data-href", div0_data_href_value);
        }
        if (dirty & /*torrentInfo*/
        1) {
          set_style(div0, "background-color", CONFIG$1.CATEGORY[
            /*torrentInfo*/
            ctx2[0].categoryNumber
          ] ?? "transparent");
        }
        if (dirty & /*torrentInfo*/
        1) {
          set_style(div0, "color", CONFIG$1.CATEGORY[
            /*torrentInfo*/
            ctx2[0].categoryNumber
          ] ? getTextColor$1(CONFIG$1.CATEGORY[
            /*torrentInfo*/
            ctx2[0].categoryNumber
          ]) : "black");
        }
        if (
          /*$_CARD_SHOW*/
          ctx2[6].title || /*_hover*/
          ctx2[3]
        ) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
          } else {
            if_block0 = create_if_block_18$1(ctx2);
            if_block0.c();
            if_block0.m(div3, t2);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block1) {
          if_block1.p(ctx2, dirty);
        } else {
          if_block1.d(1);
          if_block1 = current_block_type(ctx2);
          if (if_block1) {
            if_block1.c();
            if_block1.m(div2, t3);
          }
        }
        if (dirty & /*torrentInfo*/
        1 && t4_value !== (t4_value = /*torrentInfo*/
        ctx2[0].torrentIndex + 1 + ""))
          set_data(t4, t4_value);
        if (
          /*$_trigger_nexus_pic*/
          ctx2[7]
        ) {
          if (if_block2) {
            if_block2.p(ctx2, dirty);
          } else {
            if_block2 = create_if_block_16$1(ctx2);
            if_block2.c();
            if_block2.m(div2, null);
          }
        } else if (if_block2) {
          if_block2.d(1);
          if_block2 = null;
        }
        if (
          /*$_CARD_SHOW*/
          ctx2[6].all || /*_hover*/
          ctx2[3]
        ) {
          if (if_block3) {
            if_block3.p(ctx2, dirty);
          } else {
            if_block3 = create_if_block_10$1(ctx2);
            if_block3.c();
            if_block3.m(div3, t7);
          }
        } else if (if_block3) {
          if_block3.d(1);
          if_block3 = null;
        }
        if (!/*$_CARD_SHOW*/
        (ctx2[6].all || /*_hover*/
        ctx2[3])) {
          if (if_block4) {
            if_block4.p(ctx2, dirty);
          } else {
            if_block4 = create_if_block$6(ctx2);
            if_block4.c();
            if_block4.m(div3, null);
          }
        } else if (if_block4) {
          if_block4.d(1);
          if_block4 = null;
        }
        if (dirty & /*cardWidth*/
        2) {
          set_style(
            div4,
            "width",
            /*cardWidth*/
            ctx2[1] + "px"
          );
        }
        if (dirty & /*torrentInfo*/
        1) {
          set_style(div4, "z-index", 1e4 - /*torrentInfo*/
          ctx2[0].torrentIndex);
        }
        if (dirty & /*$_current_bgColor*/
        32) {
          set_style(
            div4,
            "background-color",
            /*$_current_bgColor*/
            ctx2[5]
          );
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(div4);
        if (if_block0)
          if_block0.d();
        if_block1.d();
        if (if_block2)
          if_block2.d();
        if (if_block3)
          if_block3.d();
        if (if_block4)
          if_block4.d();
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function getTextColor$1(background) {
    const color = background.replace("#", "");
    const red = parseInt(color.substr(0, 2), 16);
    const green = parseInt(color.substr(2, 2), 16);
    const blue = parseInt(color.substr(4, 2), 16);
    const brightness = (red * 299 + green * 587 + blue * 114) / 1e3;
    return brightness < 128 ? "white" : "black";
  }
  const func = (e) => e.outerHTML;
  const func_1 = (e) => e.outerHTML;
  const func_3 = (e) => e.outerHTML;
  function instance$7($$self, $$props, $$invalidate) {
    let $_iframe_url;
    let $_iframe_switch;
    let $_current_bgColor;
    let $_CARD_SHOW;
    let $_trigger_nexus_pic;
    component_subscribe($$self, _iframe_url, ($$value) => $$invalidate(18, $_iframe_url = $$value));
    component_subscribe($$self, _iframe_switch, ($$value) => $$invalidate(19, $_iframe_switch = $$value));
    component_subscribe($$self, _current_bgColor, ($$value) => $$invalidate(5, $_current_bgColor = $$value));
    component_subscribe($$self, _CARD_SHOW, ($$value) => $$invalidate(6, $_CARD_SHOW = $$value));
    component_subscribe($$self, _trigger_nexus_pic, ($$value) => $$invalidate(7, $_trigger_nexus_pic = $$value));
    function sort_masonry() {
      sortMasonry();
    }
    function COLLET_AND_ICON_CHANGE(jsCodeLink, card_id) {
      try {
        window.location.href = jsCodeLink;
        $$invalidate(
          0,
          torrentInfo.collectState = torrentInfo.collectState == "Unbookmarked" ? "Bookmarked" : "Unbookmarked",
          torrentInfo
        );
        console.log(`执行脚本${jsCodeLink}成功, 已经收藏或者取消~`);
      } catch (error) {
        console.error(error);
      }
    }
    function showDetailIframe() {
      set_store_value(_iframe_switch, $_iframe_switch = 1, $_iframe_switch);
      set_store_value(_iframe_url, $_iframe_url = torrentInfo.torrentLink + "#kdescr", $_iframe_url);
    }
    let { torrentInfo } = $$props;
    let { cardWidth } = $$props;
    let { ICON: ICON2 } = $$props;
    let _hover = false;
    function card_show_detail() {
      $$invalidate(3, _hover = true);
    }
    function card_hide_detail() {
      $$invalidate(3, _hover = false);
    }
    let _picError = false;
    const error_handler = () => {
      $$invalidate(4, _picError = true);
    };
    const func_2 = (el) => {
      const _tag = document.createElement("div");
      _tag.innerHTML = el.outerHTML;
      return _tag.outerHTML;
    };
    const click_handler = () => COLLET_AND_ICON_CHANGE(torrentInfo.collectLink, "tI_" + torrentInfo.torrentIndex);
    const func_4 = (el) => {
      const _tag = document.createElement("div");
      _tag.innerHTML = el.outerHTML;
      return _tag.outerHTML;
    };
    const click_handler_1 = () => COLLET_AND_ICON_CHANGE(torrentInfo.collectLink, "tI_" + torrentInfo.torrentIndex);
    $$self.$$set = ($$props2) => {
      if ("torrentInfo" in $$props2)
        $$invalidate(0, torrentInfo = $$props2.torrentInfo);
      if ("cardWidth" in $$props2)
        $$invalidate(1, cardWidth = $$props2.cardWidth);
      if ("ICON" in $$props2)
        $$invalidate(2, ICON2 = $$props2.ICON);
    };
    return [
      torrentInfo,
      cardWidth,
      ICON2,
      _hover,
      _picError,
      $_current_bgColor,
      $_CARD_SHOW,
      $_trigger_nexus_pic,
      sort_masonry,
      COLLET_AND_ICON_CHANGE,
      showDetailIframe,
      card_show_detail,
      card_hide_detail,
      error_handler,
      func_2,
      click_handler,
      func_4,
      click_handler_1
    ];
  }
  class Kamept extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$7, create_fragment$b, safe_not_equal, { torrentInfo: 0, cardWidth: 1, ICON: 2 });
    }
  }
  function get_each_context$2(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[23] = list[i];
    return child_ctx;
  }
  function create_else_block_1$1(ctx) {
    let div;
    return {
      c() {
        div = element("div");
        div.textContent = "else";
      },
      m(target, anchor) {
        insert(target, div, anchor);
      },
      p: noop,
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(div);
      }
    };
  }
  function create_if_block_2$1(ctx) {
    let each_blocks = [];
    let each_1_lookup = /* @__PURE__ */ new Map();
    let each_1_anchor;
    let current;
    let each_value = (
      /*infoList*/
      ctx[2]
    );
    const get_key = (ctx2) => (
      /*info*/
      ctx2[23].torrentIndex
    );
    for (let i = 0; i < each_value.length; i += 1) {
      let child_ctx = get_each_context$2(ctx, each_value, i);
      let key = get_key(child_ctx);
      each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    }
    return {
      c() {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        each_1_anchor = empty();
      },
      m(target, anchor) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(target, anchor);
          }
        }
        insert(target, each_1_anchor, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        if (dirty & /*infoList, CARD, ICON*/
        5) {
          each_value = /*infoList*/
          ctx2[2];
          group_outros();
          each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$2, each_1_anchor, get_each_context$2);
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        for (let i = 0; i < each_value.length; i += 1) {
          transition_in(each_blocks[i]);
        }
        current = true;
      },
      o(local) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }
        current = false;
      },
      d(detaching) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].d(detaching);
        }
        if (detaching)
          detach(each_1_anchor);
      }
    };
  }
  function create_each_block$2(key_1, ctx) {
    let first;
    let kamept;
    let current;
    kamept = new Kamept({
      props: {
        torrentInfo: (
          /*info*/
          ctx[23]
        ),
        cardWidth: (
          /*CARD*/
          ctx[0].CARD_WIDTH
        ),
        ICON
      }
    });
    return {
      key: key_1,
      first: null,
      c() {
        first = empty();
        create_component(kamept.$$.fragment);
        this.first = first;
      },
      m(target, anchor) {
        insert(target, first, anchor);
        mount_component(kamept, target, anchor);
        current = true;
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        const kamept_changes = {};
        if (dirty & /*infoList*/
        4)
          kamept_changes.torrentInfo = /*info*/
          ctx[23];
        if (dirty & /*CARD*/
        1)
          kamept_changes.cardWidth = /*CARD*/
          ctx[0].CARD_WIDTH;
        kamept.$set(kamept_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(kamept.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(kamept.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(first);
        destroy_component(kamept, detaching);
      }
    };
  }
  function create_else_block$2(ctx) {
    let t_value = (
      /*LOAD_TEXT*/
      ctx[5].normal + ""
    );
    let t;
    return {
      c() {
        t = text(t_value);
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      p: noop,
      d(detaching) {
        if (detaching)
          detach(t);
      }
    };
  }
  function create_if_block_1$2(ctx) {
    let t_value = (
      /*LOAD_TEXT*/
      ctx[5].suspend + ""
    );
    let t;
    return {
      c() {
        t = text(t_value);
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      p: noop,
      d(detaching) {
        if (detaching)
          detach(t);
      }
    };
  }
  function create_if_block$5(ctx) {
    let t_value = (
      /*LOAD_TEXT*/
      ctx[5].disable + ""
    );
    let t;
    return {
      c() {
        t = text(t_value);
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      p: noop,
      d(detaching) {
        if (detaching)
          detach(t);
      }
    };
  }
  function create_fragment$a(ctx) {
    let current_block_type_index;
    let if_block0;
    let t;
    let div;
    let button;
    let button_disabled_value;
    let current;
    let mounted;
    let dispose;
    const if_block_creators = [create_if_block_2$1, create_else_block_1$1];
    const if_blocks = [];
    function select_block_type(ctx2, dirty) {
      if (
        /*$_current_domain*/
        ctx2[3] == "kamept.com"
      )
        return 0;
      return 1;
    }
    current_block_type_index = select_block_type(ctx);
    if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    function select_block_type_1(ctx2, dirty) {
      if (
        /*$_turnPage*/
        ctx2[4]
      )
        return create_if_block$5;
      if (
        /*isButtonDisabled*/
        ctx2[1]
      )
        return create_if_block_1$2;
      return create_else_block$2;
    }
    let current_block_type = select_block_type_1(ctx);
    let if_block1 = current_block_type(ctx);
    return {
      c() {
        if_block0.c();
        t = space();
        div = element("div");
        button = element("button");
        if_block1.c();
        attr(button, "id", "turnPage");
        button.disabled = button_disabled_value = /*$_turnPage*/
        ctx[4] || /*isButtonDisabled*/
        ctx[1];
        attr(button, "class", "svelte-kydsmq");
      },
      m(target, anchor) {
        if_blocks[current_block_type_index].m(target, anchor);
        insert(target, t, anchor);
        insert(target, div, anchor);
        append(div, button);
        if_block1.m(button, null);
        current = true;
        if (!mounted) {
          dispose = listen(
            button,
            "click",
            /*turnPage*/
            ctx[6]
          );
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx2);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
          if_block0 = if_blocks[current_block_type_index];
          if (!if_block0) {
            if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block0.c();
          } else {
            if_block0.p(ctx2, dirty);
          }
          transition_in(if_block0, 1);
          if_block0.m(t.parentNode, t);
        }
        if (current_block_type === (current_block_type = select_block_type_1(ctx2)) && if_block1) {
          if_block1.p(ctx2, dirty);
        } else {
          if_block1.d(1);
          if_block1 = current_block_type(ctx2);
          if (if_block1) {
            if_block1.c();
            if_block1.m(button, null);
          }
        }
        if (!current || dirty & /*$_turnPage, isButtonDisabled*/
        18 && button_disabled_value !== (button_disabled_value = /*$_turnPage*/
        ctx2[4] || /*isButtonDisabled*/
        ctx2[1])) {
          button.disabled = button_disabled_value;
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block0);
        current = true;
      },
      o(local) {
        transition_out(if_block0);
        current = false;
      },
      d(detaching) {
        if_blocks[current_block_type_index].d(detaching);
        if (detaching)
          detach(t);
        if (detaching)
          detach(div);
        if_block1.d();
        mounted = false;
        dispose();
      }
    };
  }
  function instance$6($$self, $$props, $$invalidate) {
    var _a;
    let $_Global_Masonry;
    let $_card_layout;
    let $_animated;
    let $_current_domain;
    let $_turnPage;
    let $_current_bgColor;
    component_subscribe($$self, _Global_Masonry, ($$value) => $$invalidate(15, $_Global_Masonry = $$value));
    component_subscribe($$self, _card_layout, ($$value) => $$invalidate(10, $_card_layout = $$value));
    component_subscribe($$self, _animated, ($$value) => $$invalidate(11, $_animated = $$value));
    component_subscribe($$self, _current_domain, ($$value) => $$invalidate(3, $_current_domain = $$value));
    component_subscribe($$self, _turnPage, ($$value) => $$invalidate(4, $_turnPage = $$value));
    component_subscribe($$self, _current_bgColor, ($$value) => $$invalidate(16, $_current_bgColor = $$value));
    let { originTable } = $$props;
    let { waterfallNode } = $$props;
    window.NEXUS_TOOLS = NEXUS_TOOLS;
    function CHANGE_CARD_LAYOUT() {
      resizeMasonry($_card_layout.column, $_card_layout.gap);
      sortMasonry("fast");
      sortMasonry("fast");
    }
    window.CHANGE_CARD_LAYOUT = CHANGE_CARD_LAYOUT;
    function resizeMasonry(columns, gutter = 10) {
      if (columns <= 1 || gutter <= 1) {
        console.warn("卡片列数或卡片间隔过小, 列数不小于2, 间隔不小于1");
        return;
      }
      const widthContainer = document.querySelector("div.waterfall").clientWidth;
      const widthCard = (widthContainer - (columns - 1) * gutter) / columns;
      Array.from(document.querySelectorAll(".card")).forEach((el) => el.style.width = widthCard + "px");
      if (masonry2) {
        $$invalidate(9, masonry2.options.columnWidth = widthCard, masonry2);
        $$invalidate(9, masonry2.options.gutter = gutter, masonry2);
        masonry2.layout();
      }
      return widthCard;
    }
    let isButtonDisabled = false;
    let onMountSignal = false;
    const LOAD_TEXT = {
      normal: "点击加载下一页",
      suspend: `下一页加载CD: ${PAGE.GAP} ms`,
      disable: "不可用"
    };
    function turnPage(event) {
      if (event)
        event.preventDefault();
      if (!$_turnPage)
        debounceLoad();
      if (!isButtonDisabled) {
        $$invalidate(1, isButtonDisabled = true);
        setTimeout(
          () => {
            $$invalidate(1, isButtonDisabled = false);
          },
          PAGE.GAP
        );
      }
    }
    window.$$$turnPage = turnPage;
    set_store_value(_current_domain, $_current_domain = GET_CURRENT_PT_DOMAIN(), $_current_domain);
    const bgColor = GET_SITE_BACKGROUND_COLOR();
    set_store_value(_current_bgColor, $_current_bgColor = bgColor, $_current_bgColor);
    console.log("背景颜色:", bgColor);
    const config = SITE[$_current_domain];
    let infoList = [];
    infoList = [...infoList, ...config.TORRENT_LIST_TO_JSON(originTable)];
    console.log("---> 环境:	", "production");
    (_a = SITE[$_current_domain]) == null ? void 0 : _a.special();
    let masonry2;
    let debounceLoad;
    function scan_and_launch() {
      const scrollHeight = document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop + clientHeight >= scrollHeight - PAGE.DISTANCE) {
        if ($_turnPage)
          debounceLoad();
        else {
          console.log("加载模式: 按钮");
        }
        sortMasonry();
      }
    }
    debounceLoad = debounceImmediate(loadNextPage, PAGE.GAP);
    function loadNextPage() {
      console.log("到页面底部啦!!! Scrolled to bottom!");
      const urlSearchParams = new URLSearchParams(window.location.search);
      PAGE.PAGE_CURRENT = PAGE.IS_ORIGIN ? Number(urlSearchParams.get("page")) : PAGE.PAGE_CURRENT;
      if (PAGE.IS_ORIGIN)
        PAGE.PAGE_ORIGIN = PAGE.PAGE_CURRENT;
      if (!PAGE.PAGE_CURRENT) {
        console.log(`网页链接没有page参数, 无法跳转下一页, 生成PAGE.PAGE_CURRENT为0`);
        PAGE.PAGE_CURRENT = 0;
      } else {
        console.log("当前页数: " + PAGE.PAGE_CURRENT);
      }
      PAGE.PAGE_NEXT = parseInt(PAGE.PAGE_CURRENT) + 1;
      urlSearchParams.set("page", PAGE.PAGE_NEXT);
      PAGE.NEXT_URL = window.location.origin + window.location.pathname + "?" + urlSearchParams.toString();
      console.log("New URL:", PAGE.NEXT_URL);
      fetch(PAGE.NEXT_URL).then((response) => response.text()).then((html) => {
        var _a2, _b;
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const table = doc.querySelector(GET_TORRENT_LIST_SELECTOR());
        const list = Array.from(table.cloneNode(true).children[0].children);
        list[0].children[1].textContent = `
        ↓ 新加载第${PAGE.PAGE_NEXT - PAGE.PAGE_ORIGIN}页`;
        console.log(PAGE.PAGE_ORIGIN);
        originTable.children[0].append(...list);
        typeof ((_a2 = SITE[$_current_domain]) == null ? void 0 : _a2.pageLoaded) === "function" ? (_b = SITE[$_current_domain]) == null ? void 0 : _b.pageLoaded() : null;
        $$invalidate(2, infoList = [...infoList, ...config.TORRENT_LIST_TO_JSON(table)]);
        PAGE.IS_ORIGIN = false;
        PAGE.PAGE_CURRENT = PAGE.PAGE_NEXT;
        onMountSignal = true;
        setTimeout(
          () => {
            onMountSignal = false;
          },
          1e3
        );
      }).catch((error) => {
        console.warn("获取不到下页信息, 可能到头了");
        console.warn(error);
      });
    }
    onMount(() => {
      $$invalidate(9, masonry2 = new Masonry(
        waterfallNode,
        {
          itemSelector: ".card",
          columnWidth: resizeMasonry($_card_layout.column, $_card_layout.gap),
          gutter: $_card_layout.gap,
          // transitions Duration 默认值为 0.4
          transitionDuration: $_animated ? 0.4 : 0
        }
      ));
      resizeMasonry($_card_layout.column, $_card_layout.gap);
      window.masonry = masonry2;
      set_store_value(_Global_Masonry, $_Global_Masonry = masonry2, $_Global_Masonry);
      masonry2.layout("fast");
      masonry2.layout("fast");
      waterfallNode.addEventListener("click", (event) => {
        if (event.target === event.currentTarget) {
          if (masonry2)
            masonry2.layout();
          console.log("Masonry 已整理~");
        }
      });
      window.addEventListener("scroll", function() {
        scan_and_launch();
      });
      NEXUS_TOOLS();
    });
    afterUpdate(() => {
      if (masonry2 && onMountSignal) {
        masonry2.reloadItems();
        masonry2.layout();
        masonry2.once("layoutComplete", () => {
          NEXUS_TOOLS();
        });
      }
    });
    $$self.$$set = ($$props2) => {
      if ("originTable" in $$props2)
        $$invalidate(7, originTable = $$props2.originTable);
      if ("waterfallNode" in $$props2)
        $$invalidate(8, waterfallNode = $$props2.waterfallNode);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*masonry, $_animated*/
      2560) {
        {
          if (masonry2)
            $$invalidate(9, masonry2.options.transitionDuration = $_animated ? "0.4s" : "0", masonry2);
        }
      }
      if ($$self.$$.dirty & /*masonry, $_card_layout, CARD*/
      1537) {
        if (masonry2) {
          $$invalidate(0, CARD.CARD_WIDTH = resizeMasonry($_card_layout.column, $_card_layout.gap), CARD);
          console.log("卡片宽度:	", CARD.CARD_WIDTH);
          CHANGE_CARD_LAYOUT();
        }
      }
    };
    return [
      CARD,
      isButtonDisabled,
      infoList,
      $_current_domain,
      $_turnPage,
      LOAD_TEXT,
      turnPage,
      originTable,
      waterfallNode,
      masonry2,
      $_card_layout,
      $_animated
    ];
  }
  class Index extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$6, create_fragment$a, safe_not_equal, { originTable: 7, waterfallNode: 8 });
    }
  }
  function create_else_block$1(ctx) {
    let t_value = (
      /*LOAD_TEXT*/
      ctx[2].normal + ""
    );
    let t;
    return {
      c() {
        t = text(t_value);
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      p: noop,
      d(detaching) {
        if (detaching)
          detach(t);
      }
    };
  }
  function create_if_block_1$1(ctx) {
    let t_value = (
      /*LOAD_TEXT*/
      ctx[2].suspend + ""
    );
    let t;
    return {
      c() {
        t = text(t_value);
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      p: noop,
      d(detaching) {
        if (detaching)
          detach(t);
      }
    };
  }
  function create_if_block$4(ctx) {
    let t_value = (
      /*LOAD_TEXT*/
      ctx[2].disable + ""
    );
    let t;
    return {
      c() {
        t = text(t_value);
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      p: noop,
      d(detaching) {
        if (detaching)
          detach(t);
      }
    };
  }
  function create_fragment$9(ctx) {
    let div;
    let button;
    let button_disabled_value;
    let mounted;
    let dispose;
    function select_block_type(ctx2, dirty) {
      if (
        /*$_turnPage*/
        ctx2[1]
      )
        return create_if_block$4;
      if (
        /*isButtonDisabled*/
        ctx2[0]
      )
        return create_if_block_1$1;
      return create_else_block$1;
    }
    let current_block_type = select_block_type(ctx);
    let if_block = current_block_type(ctx);
    return {
      c() {
        div = element("div");
        button = element("button");
        if_block.c();
        attr(button, "id", "_turnPage");
        button.disabled = button_disabled_value = /*$_turnPage*/
        ctx[1] || /*isButtonDisabled*/
        ctx[0];
        attr(button, "class", "svelte-1gtc1kh");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, button);
        if_block.m(button, null);
        if (!mounted) {
          dispose = listen(
            button,
            "click",
            /*func*/
            ctx[3]
          );
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block.d(1);
          if_block = current_block_type(ctx2);
          if (if_block) {
            if_block.c();
            if_block.m(button, null);
          }
        }
        if (dirty & /*$_turnPage, isButtonDisabled*/
        3 && button_disabled_value !== (button_disabled_value = /*$_turnPage*/
        ctx2[1] || /*isButtonDisabled*/
        ctx2[0])) {
          button.disabled = button_disabled_value;
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(div);
        if_block.d();
        mounted = false;
        dispose();
      }
    };
  }
  const GAP = 3e3;
  function instance$5($$self, $$props, $$invalidate) {
    let $_turnPage;
    component_subscribe($$self, _turnPage, ($$value) => $$invalidate(1, $_turnPage = $$value));
    let isButtonDisabled = false;
    const LOAD_TEXT = {
      normal: "点击加载下一页",
      suspend: `下一页加载CD: ${GAP} ms`,
      disable: "不可用"
    };
    function func2(event) {
      event.preventDefault();
      window.$$$turnPage();
      if (!isButtonDisabled) {
        $$invalidate(0, isButtonDisabled = true);
        setTimeout(
          () => {
            $$invalidate(0, isButtonDisabled = false);
          },
          GAP
        );
      }
    }
    return [isButtonDisabled, $_turnPage, LOAD_TEXT, func2];
  }
  class BtnTurnPage extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$5, create_fragment$9, safe_not_equal, {});
    }
  }
  function create_fragment$8(ctx) {
    let svg;
    let g;
    let circle;
    let path;
    return {
      c() {
        svg = svg_element("svg");
        g = svg_element("g");
        circle = svg_element("circle");
        path = svg_element("path");
        attr(circle, "cx", "12");
        attr(circle, "cy", "12");
        attr(circle, "r", "10");
        attr(circle, "stroke", "#1C274C");
        attr(circle, "stroke-width", "1.5");
        attr(path, "d", "M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5");
        attr(path, "stroke", "#1C274C");
        attr(path, "stroke-width", "1.5");
        attr(path, "stroke-linecap", "round");
        attr(g, "id", "SVGRepo_iconCarrier");
        attr(svg, "viewBox", "0 0 24 24");
        attr(svg, "fill", "none");
        attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      },
      m(target, anchor) {
        insert(target, svg, anchor);
        append(svg, g);
        append(g, circle);
        append(g, path);
      },
      p: noop,
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(svg);
      }
    };
  }
  class Icon_roundClose extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, null, create_fragment$8, safe_not_equal, {});
    }
  }
  function create_if_block$3(ctx) {
    let div2;
    let div1;
    let iframe;
    let iframe_src_value;
    let t;
    let div0;
    let iconroundclose;
    let div2_transition;
    let current;
    let mounted;
    let dispose;
    iconroundclose = new Icon_roundClose({});
    return {
      c() {
        div2 = element("div");
        div1 = element("div");
        iframe = element("iframe");
        t = space();
        div0 = element("div");
        create_component(iconroundclose.$$.fragment);
        if (!src_url_equal(iframe.src, iframe_src_value = /*$_iframe_url*/
        ctx[1]))
          attr(iframe, "src", iframe_src_value);
        attr(iframe, "frameborder", "0");
        attr(iframe, "title", "wow");
        set_style(iframe, "width", (SITE[
          /*$_current_domain*/
          ctx[2]
        ] ? SITE[
          /*$_current_domain*/
          ctx[2]
        ].Iframe_Width : 1e3) + "px");
        attr(iframe, "class", "svelte-1exar3b");
        attr(div0, "class", "_iframeCloseBtn svelte-1exar3b");
        attr(div1, "class", "_iframe svelte-1exar3b");
        attr(div2, "id", "_iframe");
        attr(div2, "class", "svelte-1exar3b");
      },
      m(target, anchor) {
        insert(target, div2, anchor);
        append(div2, div1);
        append(div1, iframe);
        append(div1, t);
        append(div1, div0);
        mount_component(iconroundclose, div0, null);
        current = true;
        if (!mounted) {
          dispose = [
            listen(
              div0,
              "click",
              /*toggleIframe*/
              ctx[3]
            ),
            listen(
              div2,
              "click",
              /*toggleIframe*/
              ctx[3]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (!current || dirty & /*$_iframe_url*/
        2 && !src_url_equal(iframe.src, iframe_src_value = /*$_iframe_url*/
        ctx2[1])) {
          attr(iframe, "src", iframe_src_value);
        }
        if (!current || dirty & /*$_current_domain*/
        4) {
          set_style(iframe, "width", (SITE[
            /*$_current_domain*/
            ctx2[2]
          ] ? SITE[
            /*$_current_domain*/
            ctx2[2]
          ].Iframe_Width : 1e3) + "px");
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(iconroundclose.$$.fragment, local);
        add_render_callback(() => {
          if (!current)
            return;
          if (!div2_transition)
            div2_transition = create_bidirectional_transition(div2, fade, { duration: 300 }, true);
          div2_transition.run(1);
        });
        current = true;
      },
      o(local) {
        transition_out(iconroundclose.$$.fragment, local);
        if (!div2_transition)
          div2_transition = create_bidirectional_transition(div2, fade, { duration: 300 }, false);
        div2_transition.run(0);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div2);
        destroy_component(iconroundclose);
        if (detaching && div2_transition)
          div2_transition.end();
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_fragment$7(ctx) {
    let if_block_anchor;
    let current;
    let mounted;
    let dispose;
    let if_block = (
      /*$_iframe_switch*/
      ctx[0] && create_if_block$3(ctx)
    );
    return {
      c() {
        if (if_block)
          if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if (if_block)
          if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;
        if (!mounted) {
          dispose = listen(
            window,
            "keydown",
            /*key_closePanels*/
            ctx[4],
            true
          );
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (
          /*$_iframe_switch*/
          ctx2[0]
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
            if (dirty & /*$_iframe_switch*/
            1) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block$3(ctx2);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          group_outros();
          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (if_block)
          if_block.d(detaching);
        if (detaching)
          detach(if_block_anchor);
        mounted = false;
        dispose();
      }
    };
  }
  function instance$4($$self, $$props, $$invalidate) {
    let $_show_configPanel;
    let $_iframe_switch;
    let $_list_viewMode;
    let $_iframe_url;
    let $_current_domain;
    component_subscribe($$self, _show_configPanel, ($$value) => $$invalidate(9, $_show_configPanel = $$value));
    component_subscribe($$self, _iframe_switch, ($$value) => $$invalidate(0, $_iframe_switch = $$value));
    component_subscribe($$self, _list_viewMode, ($$value) => $$invalidate(5, $_list_viewMode = $$value));
    component_subscribe($$self, _iframe_url, ($$value) => $$invalidate(1, $_iframe_url = $$value));
    component_subscribe($$self, _current_domain, ($$value) => $$invalidate(2, $_current_domain = $$value));
    console.log(`[${( new Date()).toLocaleTimeString()}]<--------------------------HMR-------------------------->`);
    const _ORIGIN_TL_Node = document.querySelector(GET_TORRENT_LIST_SELECTOR());
    while (!Masonry) {
      console.log("等待初始化......");
    }
    const parentNode = _ORIGIN_TL_Node.parentNode;
    const waterfallNode = document.createElement("div");
    waterfallNode.classList.add("waterfall");
    parentNode.insertBefore(waterfallNode, _ORIGIN_TL_Node.nextSibling);
    const nextPageNode = document.createElement("div");
    nextPageNode.classList.add("nextPage");
    parentNode.insertBefore(nextPageNode, _ORIGIN_TL_Node.nextSibling);
    function toggleIframe() {
      set_store_value(_iframe_switch, $_iframe_switch = 0, $_iframe_switch);
    }
    function key_closePanels(event) {
      if (event.key === "Escape") {
        console.log(event);
        set_store_value(_iframe_switch, $_iframe_switch = 0, $_iframe_switch);
        set_store_value(_show_configPanel, $_show_configPanel = false, $_show_configPanel);
      }
    }
    onMount(() => {
      new Sidepanel({ target: document.body });
      new Index({
        target: waterfallNode,
        props: {
          // 传递给组件的属性
          originTable: _ORIGIN_TL_Node,
          waterfallNode
        }
      });
      new BtnTurnPage({ target: nextPageNode });
    });
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*$_list_viewMode*/
      32) {
        {
          _ORIGIN_TL_Node.style.display = $_list_viewMode ? "none" : "block";
          nextPageNode.style.display = $_list_viewMode ? "none" : "block";
          waterfallNode.style.display = $_list_viewMode ? "block" : "none";
        }
      }
    };
    return [
      $_iframe_switch,
      $_iframe_url,
      $_current_domain,
      toggleIframe,
      key_closePanels,
      $_list_viewMode
    ];
  }
  class Main extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$4, create_fragment$7, safe_not_equal, {});
    }
  }
  const _PicNoLOGO = "data:image/svg+xml;base64,PHN2Zw0KICB2aWV3Qm94PSItMi40IC0yLjQgMjguODAgMjguODAiDQogIGZpbGw9Im5vbmUiDQogIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgc3Ryb2tlPSIjMDAwMDAwIg0KPg0KICA8ZyBpZD0iU1ZHUmVwb19iZ0NhcnJpZXIiIHN0cm9rZS13aWR0aD0iMCIgLz4NCiAgPGcgaWQ9IlNWR1JlcG9faWNvbkNhcnJpZXIiPg0KICAgIDxwYXRoDQogICAgICBkPSJNMTUuNiAxNS42QzE1LjYgMTUuNiAxNC4yNSAxMy44IDEyIDEzLjhDOS43NSAxMy44IDguNCAxNS42IDguNCAxNS42TTE0LjcgOS4zSDE0LjcwOU05LjMgOS4zSDkuMzA5TTIxIDEyQzIxIDE2Ljk3MDYgMTYuOTcwNiAyMSAxMiAyMUM3LjAyOTQ0IDIxIDMgMTYuOTcwNiAzIDEyQzMgNy4wMjk0NCA3LjAyOTQ0IDMgMTIgM0MxNi45NzA2IDMgMjEgNy4wMjk0NCAyMSAxMlpNMTUuMTUgOS4zQzE1LjE1IDkuNTQ4NTMgMTQuOTQ4NSA5Ljc1IDE0LjcgOS43NUMxNC40NTE1IDkuNzUgMTQuMjUgOS41NDg1MyAxNC4yNSA5LjNDMTQuMjUgOS4wNTE0NyAxNC40NTE1IDguODUgMTQuNyA4Ljg1QzE0Ljk0ODUgOC44NSAxNS4xNSA5LjA1MTQ3IDE1LjE1IDkuM1pNOS43NSA5LjNDOS43NSA5LjU0ODUzIDkuNTQ4NTMgOS43NSA5LjMgOS43NUM5LjA1MTQ3IDkuNzUgOC44NSA5LjU0ODUzIDguODUgOS4zQzguODUgOS4wNTE0NyA5LjA1MTQ3IDguODUgOS4zIDguODVDOS41NDg1MyA4Ljg1IDkuNzUgOS4wNTE0NyA5Ljc1IDkuM1oiDQogICAgICBzdHJva2U9IiMwMDAwMDAiDQogICAgICBzdHJva2Utd2lkdGg9IjEuOCINCiAgICAgIHN0cm9rZS1saW5lY2FwPSJyb3VuZCINCiAgICAgIHN0cm9rZS1saW5lam9pbj0icm91bmQiDQogICAgLz4NCiAgPC9nPg0KPC9zdmc+";
  function create_fragment$6(ctx) {
    let svg;
    let path0;
    let path1;
    return {
      c() {
        svg = svg_element("svg");
        path0 = svg_element("path");
        path1 = svg_element("path");
        attr(path0, "d", "M7 7h10v2H7zm0 4h7v2H7z");
        attr(path1, "d", "M20 2H4c-1.103 0-2 .897-2 2v18l5.333-4H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm0 14H6.667L4 18V4h16v12z");
        attr(svg, "stroke", "currentColor");
        attr(svg, "fill", "currentColor");
        attr(svg, "stroke-width", "0");
        attr(svg, "viewBox", "0 0 24 24");
        attr(svg, "height", "18");
        attr(svg, "width", "18");
        attr(svg, "xmlns", "http://www.w3.org/2000/svg");
        set_style(svg, "vertical-align", "middle");
      },
      m(target, anchor) {
        insert(target, svg, anchor);
        append(svg, path0);
        append(svg, path1);
      },
      p: noop,
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(svg);
      }
    };
  }
  class Icon_comment extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, null, create_fragment$6, safe_not_equal, {});
    }
  }
  function create_fragment$5(ctx) {
    let svg;
    let path0;
    let path1;
    return {
      c() {
        svg = svg_element("svg");
        path0 = svg_element("path");
        path1 = svg_element("path");
        attr(path0, "d", "M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z");
        attr(path1, "d", "M13 7h-2v6h6v-2h-4z");
        attr(svg, "stroke", "currentColor");
        attr(svg, "fill", "currentColor");
        attr(svg, "stroke-width", "0");
        attr(svg, "viewBox", "0 0 24 24");
        attr(svg, "height", "18");
        attr(svg, "width", "18");
        attr(svg, "xmlns", "http://www.w3.org/2000/svg");
        set_style(svg, "vertical-align", "middle");
      },
      m(target, anchor) {
        insert(target, svg, anchor);
        append(svg, path0);
        append(svg, path1);
      },
      p: noop,
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(svg);
      }
    };
  }
  class Icon_time extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, null, create_fragment$5, safe_not_equal, {});
    }
  }
  function create_fragment$4(ctx) {
    let svg;
    let path0;
    let path1;
    return {
      c() {
        svg = svg_element("svg");
        path0 = svg_element("path");
        path1 = svg_element("path");
        attr(path0, "d", "M12 5c-3.859 0-7 3.141-7 7s3.141 7 7 7 7-3.141 7-7-3.141-7-7-7zm0 12c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z");
        attr(path1, "d", "M12 9c-1.627 0-3 1.373-3 3s1.373 3 3 3 3-1.373 3-3-1.373-3-3-3z");
        attr(svg, "stroke", "currentColor");
        attr(svg, "fill", "currentColor");
        attr(svg, "stroke-width", "0");
        attr(svg, "viewBox", "0 0 24 24");
        attr(svg, "height", "25");
        attr(svg, "width", "25");
        attr(svg, "xmlns", "http://www.w3.org/2000/svg");
        set_style(svg, "vertical-align", "middle");
        set_style(svg, "--darkreader-inline-fill", "currentColor");
        set_style(svg, "--darkreader-inline-stroke", "currentColor");
      },
      m(target, anchor) {
        insert(target, svg, anchor);
        append(svg, path0);
        append(svg, path1);
      },
      p: noop,
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(svg);
      }
    };
  }
  class Icon_size extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, null, create_fragment$4, safe_not_equal, {});
    }
  }
  function create_fragment$3(ctx) {
    let svg;
    let path;
    return {
      c() {
        svg = svg_element("svg");
        path = svg_element("path");
        attr(path, "d", "M505.7 661a8 8 0 0012.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z");
        attr(svg, "viewBox", "64 64 896 896");
        attr(svg, "focusable", "false");
        attr(svg, "data-icon", "download");
        attr(svg, "width", "1em");
        attr(svg, "height", "1em");
        attr(svg, "fill", "currentColor");
        attr(svg, "aria-hidden", "true");
        attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      },
      m(target, anchor) {
        insert(target, svg, anchor);
        append(svg, path);
      },
      p: noop,
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(svg);
      }
    };
  }
  class Icon_download extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, null, create_fragment$3, safe_not_equal, {});
    }
  }
  function get_each_context$1(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[39] = list[i];
    child_ctx[2] = i;
    return child_ctx;
  }
  function get_each_context_1(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[39] = list[i];
    child_ctx[2] = i;
    return child_ctx;
  }
  function create_if_block_25(ctx) {
    let div;
    let a;
    let b;
    let t_value = (
      /*torrentInfo*/
      ctx[0].name + ""
    );
    let t;
    let a_href_value;
    return {
      c() {
        div = element("div");
        a = element("a");
        b = element("b");
        t = text(t_value);
        attr(a, "class", "two-lines svelte-rhfb99");
        attr(a, "href", a_href_value = "/detail/" + /*torrentInfo*/
        ctx[0].id);
        attr(a, "target", "_blank");
        attr(div, "class", "card-title svelte-rhfb99");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, a);
        append(a, b);
        append(b, t);
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*torrentInfo*/
        1 && t_value !== (t_value = /*torrentInfo*/
        ctx2[0].name + ""))
          set_data(t, t_value);
        if (dirty[0] & /*torrentInfo*/
        1 && a_href_value !== (a_href_value = "/detail/" + /*torrentInfo*/
        ctx2[0].id)) {
          attr(a, "href", a_href_value);
        }
      },
      d(detaching) {
        if (detaching)
          detach(div);
      }
    };
  }
  function create_else_block_2(ctx) {
    let div2;
    let div0;
    let img;
    let img_src_value;
    let t0;
    let div1;
    let mounted;
    let dispose;
    return {
      c() {
        div2 = element("div");
        div0 = element("div");
        img = element("img");
        t0 = space();
        div1 = element("div");
        div1.textContent = "图片加载失败";
        set_style(img, "height", "100%");
        set_style(img, "width", "100px");
        if (!src_url_equal(img.src, img_src_value = _PicErrorLOGO))
          attr(img, "src", img_src_value);
        attr(img, "alt", "pic error");
        attr(img, "class", "svelte-rhfb99");
        attr(div2, "class", "pic_error");
        attr(div2, "style", "");
      },
      m(target, anchor) {
        insert(target, div2, anchor);
        append(div2, div0);
        append(div0, img);
        append(div2, t0);
        append(div2, div1);
        if (!mounted) {
          dispose = listen(
            img,
            "load",
            /*sort_masonry*/
            ctx[13]
          );
          mounted = true;
        }
      },
      p: noop,
      d(detaching) {
        if (detaching)
          detach(div2);
        mounted = false;
        dispose();
      }
    };
  }
  function create_if_block_22(ctx) {
    let if_block_anchor;
    function select_block_type_1(ctx2, dirty) {
      if (
        /*torrentInfo*/
        ctx2[0].category == "440" && /*$_SITE_SETTING*/
        ctx2[11].mt.hide_gay == true
      )
        return create_if_block_23;
      return create_else_block;
    }
    let current_block_type = select_block_type_1(ctx);
    let if_block = current_block_type(ctx);
    return {
      c() {
        if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
      },
      p(ctx2, dirty) {
        if (current_block_type === (current_block_type = select_block_type_1(ctx2)) && if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block.d(1);
          if_block = current_block_type(ctx2);
          if (if_block) {
            if_block.c();
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        }
      },
      d(detaching) {
        if_block.d(detaching);
        if (detaching)
          detach(if_block_anchor);
      }
    };
  }
  function create_else_block(ctx) {
    let if_block_anchor;
    function select_block_type_2(ctx2, dirty) {
      if (
        /*torrentInfo*/
        ctx2[0].imageList[0]
      )
        return create_if_block_24;
      return create_else_block_1;
    }
    let current_block_type = select_block_type_2(ctx);
    let if_block = current_block_type(ctx);
    return {
      c() {
        if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
      },
      p(ctx2, dirty) {
        if (current_block_type === (current_block_type = select_block_type_2(ctx2)) && if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block.d(1);
          if_block = current_block_type(ctx2);
          if (if_block) {
            if_block.c();
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        }
      },
      d(detaching) {
        if_block.d(detaching);
        if (detaching)
          detach(if_block_anchor);
      }
    };
  }
  function create_if_block_23(ctx) {
    let div2;
    let div0;
    let img;
    let img_src_value;
    let t0;
    let div1;
    let mounted;
    let dispose;
    return {
      c() {
        div2 = element("div");
        div0 = element("div");
        img = element("img");
        t0 = space();
        div1 = element("div");
        div1.innerHTML = `GAY WARNING<br/>同志警告`;
        set_style(img, "height", "100%");
        set_style(img, "width", "60px");
        set_style(img, "border-radius", "20px");
        if (!src_url_equal(img.src, img_src_value = static_gay_warn))
          attr(img, "src", img_src_value);
        attr(img, "alt", "pic error");
        attr(img, "class", "svelte-rhfb99");
        set_style(div1, "color", "white");
        set_style(div1, "font-weight", "600");
        set_style(div1, "font-size", "16px");
        attr(div2, "class", "pic_error");
        set_style(div2, "height", "auto");
        set_style(div2, "padding", "10px");
        set_style(div2, "gap", "10px");
        set_style(div2, "line-height", "24px");
        set_style(
          div2,
          "background-color",
          /*_categoryColor*/
          ctx[24]
        );
      },
      m(target, anchor) {
        insert(target, div2, anchor);
        append(div2, div0);
        append(div0, img);
        append(div2, t0);
        append(div2, div1);
        if (!mounted) {
          dispose = listen(
            img,
            "load",
            /*sort_masonry*/
            ctx[13]
          );
          mounted = true;
        }
      },
      p: noop,
      d(detaching) {
        if (detaching)
          detach(div2);
        mounted = false;
        dispose();
      }
    };
  }
  function create_else_block_1(ctx) {
    let div2;
    let div0;
    let img;
    let img_src_value;
    let t0;
    let div1;
    let mounted;
    let dispose;
    return {
      c() {
        div2 = element("div");
        div0 = element("div");
        img = element("img");
        t0 = space();
        div1 = element("div");
        div1.textContent = "本种没有图片";
        set_style(img, "height", "100%");
        set_style(img, "width", "100px");
        if (!src_url_equal(img.src, img_src_value = _PicNoLOGO))
          attr(img, "src", img_src_value);
        attr(img, "alt", "no pic");
        attr(img, "class", "svelte-rhfb99");
        attr(div2, "class", "pic_error");
        attr(div2, "style", "");
      },
      m(target, anchor) {
        insert(target, div2, anchor);
        append(div2, div0);
        append(div0, img);
        append(div2, t0);
        append(div2, div1);
        if (!mounted) {
          dispose = listen(
            img,
            "load",
            /*sort_masonry*/
            ctx[13]
          );
          mounted = true;
        }
      },
      p: noop,
      d(detaching) {
        if (detaching)
          detach(div2);
        mounted = false;
        dispose();
      }
    };
  }
  function create_if_block_24(ctx) {
    let img;
    let img_src_value;
    let img_alt_value;
    let mounted;
    let dispose;
    return {
      c() {
        img = element("img");
        attr(img, "class", "nexus-lazy-load_Kesa svelte-rhfb99");
        if (!src_url_equal(img.src, img_src_value = CONFIG.LOADING_PIC))
          attr(img, "src", img_src_value);
        attr(
          img,
          "data-src",
          /*real_pic_normal*/
          ctx[25]
        );
        attr(img, "alt", img_alt_value = /*torrentInfo*/
        ctx[0].name);
      },
      m(target, anchor) {
        insert(target, img, anchor);
        if (!mounted) {
          dispose = [
            listen(
              img,
              "load",
              /*sort_masonry*/
              ctx[13]
            ),
            listen(
              img,
              "error",
              /*error_handler*/
              ctx[26]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*torrentInfo*/
        1 && img_alt_value !== (img_alt_value = /*torrentInfo*/
        ctx2[0].name)) {
          attr(img, "alt", img_alt_value);
        }
      },
      d(detaching) {
        if (detaching)
          detach(img);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_if_block_21(ctx) {
    let div;
    let img;
    let img_src_value;
    return {
      c() {
        div = element("div");
        img = element("img");
        set_style(img, "pointer-events", "none");
        if (!src_url_equal(img.src, img_src_value = CONFIG.ICON.PREVIEW))
          attr(img, "src", img_src_value);
        attr(img, "alt", "PREVIEW");
        attr(img, "class", "svelte-rhfb99");
        attr(div, "class", "hover-trigger svelte-rhfb99");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, img);
      },
      p: noop,
      d(detaching) {
        if (detaching)
          detach(div);
      }
    };
  }
  function create_if_block_12(ctx) {
    let t0;
    let t1;
    let t2;
    let div7;
    let div4;
    let div3;
    let div0;
    let span0;
    let iconsize;
    let t3;
    let t4_value = (Number(
      /*torrentInfo*/
      ctx[0].size
    ) / 1024 / 1024 / 1024).toFixed(2) + "G";
    let t4;
    let t5;
    let div1;
    let span1;
    let icondownload;
    let t6;
    let div2;
    let span2;
    let promise_1;
    let t7;
    let div5;
    let icontime;
    let t8;
    let t9_value = `${/*_CT*/
  ctx[19].day} 日`;
    let t9;
    let t10;
    let t11_value = (
      /*_CT*/
      ctx[19].hour ? `${/*_CT*/
    ctx[19].hour} 时` : ""
    );
    let t11;
    let t12;
    let div6;
    let iconcomment;
    let t13;
    let b0;
    let t14_value = (
      /*torrentInfo*/
      ctx[0].status.comments + ""
    );
    let t14;
    let t15;
    let img0;
    let img0_src_value;
    let t16;
    let b1;
    let t17_value = (
      /*torrentInfo*/
      ctx[0].status.seeders + ""
    );
    let t17;
    let t18;
    let img1;
    let img1_src_value;
    let t19;
    let b2;
    let t20_value = (
      /*torrentInfo*/
      ctx[0].status.leechers + ""
    );
    let t20;
    let current;
    let mounted;
    let dispose;
    let if_block0 = (
      /*torrentInfo*/
      ctx[0].smallDescr && create_if_block_20(ctx)
    );
    let if_block1 = (
      /*torrentInfo*/
      (ctx[0].status.discount || /*torrentInfo*/
      ctx[0].status.toppingLevel) && create_if_block_17(ctx)
    );
    let if_block2 = (
      /*torrentInfo*/
      ctx[0].labels != 0 && create_if_block_13(ctx)
    );
    iconsize = new Icon_size({});
    icondownload = new Icon_download({});
    let info = {
      ctx,
      current: null,
      token: null,
      hasCatch: true,
      pending: create_pending_block_1,
      then: create_then_block_1,
      catch: create_catch_block_1,
      value: 37,
      error: 38
    };
    handle_promise(promise_1 = /*promise*/
    ctx[5], info);
    icontime = new Icon_time({});
    iconcomment = new Icon_comment({});
    return {
      c() {
        if (if_block0)
          if_block0.c();
        t0 = space();
        if (if_block1)
          if_block1.c();
        t1 = space();
        if (if_block2)
          if_block2.c();
        t2 = space();
        div7 = element("div");
        div4 = element("div");
        div3 = element("div");
        div0 = element("div");
        span0 = element("span");
        create_component(iconsize.$$.fragment);
        t3 = text("\r\n               ");
        t4 = text(t4_value);
        t5 = text("\r\n\r\n            \r\n              \r\n            \r\n            ");
        div1 = element("div");
        span1 = element("span");
        create_component(icondownload.$$.fragment);
        t6 = text("\r\n\r\n            \r\n              \r\n            \r\n            ");
        div2 = element("div");
        span2 = element("span");
        info.block.c();
        t7 = space();
        div5 = element("div");
        create_component(icontime.$$.fragment);
        t8 = text("\r\n           ");
        t9 = text(t9_value);
        t10 = space();
        t11 = text(t11_value);
        t12 = space();
        div6 = element("div");
        create_component(iconcomment.$$.fragment);
        t13 = text("\r\n           \r\n          ");
        b0 = element("b");
        t14 = text(t14_value);
        t15 = text("\r\n            \r\n          ");
        img0 = element("img");
        t16 = text("\r\n           \r\n          ");
        b1 = element("b");
        t17 = text(t17_value);
        t18 = text("\r\n            \r\n          ");
        img1 = element("img");
        t19 = text("\r\n           \r\n          ");
        b2 = element("b");
        t20 = text(t20_value);
        attr(span0, "class", "icon_holder svelte-rhfb99");
        attr(div0, "class", "cl-btn svelte-rhfb99");
        attr(span1, "class", "icon_holder svelte-rhfb99");
        attr(div1, "class", "cl-btn svelte-rhfb99");
        set_style(div1, "cursor", "pointer");
        attr(span2, "class", "icon_holder svelte-rhfb99");
        attr(div2, "class", "cl-btn svelte-rhfb99");
        set_style(div2, "cursor", "pointer");
        attr(div3, "class", "cl-center svelte-rhfb99");
        attr(div4, "class", "card-line svelte-rhfb99");
        attr(div5, "class", "card-line cl-btn svelte-rhfb99");
        if (!src_url_equal(img0.src, img0_src_value = CONFIG.ICON.SEEDERS))
          attr(img0, "src", img0_src_value);
        attr(img0, "alt", "SVG_Seeders");
        if (!src_url_equal(img1.src, img1_src_value = CONFIG.ICON.LEECHERS))
          attr(img1, "src", img1_src_value);
        attr(img1, "alt", "SVG_Leechers");
        attr(div6, "class", "card-line svelte-rhfb99");
        attr(div7, "class", "card-details svelte-rhfb99");
      },
      m(target, anchor) {
        if (if_block0)
          if_block0.m(target, anchor);
        insert(target, t0, anchor);
        if (if_block1)
          if_block1.m(target, anchor);
        insert(target, t1, anchor);
        if (if_block2)
          if_block2.m(target, anchor);
        insert(target, t2, anchor);
        insert(target, div7, anchor);
        append(div7, div4);
        append(div4, div3);
        append(div3, div0);
        append(div0, span0);
        mount_component(iconsize, span0, null);
        append(div0, t3);
        append(div0, t4);
        append(div3, t5);
        append(div3, div1);
        append(div1, span1);
        mount_component(icondownload, span1, null);
        append(div3, t6);
        append(div3, div2);
        append(div2, span2);
        info.block.m(span2, info.anchor = null);
        info.mount = () => span2;
        info.anchor = null;
        append(div7, t7);
        append(div7, div5);
        mount_component(icontime, div5, null);
        append(div5, t8);
        append(div5, t9);
        append(div5, t10);
        append(div5, t11);
        append(div7, t12);
        append(div7, div6);
        mount_component(iconcomment, div6, null);
        append(div6, t13);
        append(div6, b0);
        append(b0, t14);
        append(div6, t15);
        append(div6, img0);
        append(div6, t16);
        append(div6, b1);
        append(b1, t17);
        append(div6, t18);
        append(div6, img1);
        append(div6, t19);
        append(div6, b2);
        append(b2, t20);
        current = true;
        if (!mounted) {
          dispose = [
            listen(
              div1,
              "click",
              /*torrent_download*/
              ctx[20]
            ),
            listen(
              div2,
              "click",
              /*handleCollection*/
              ctx[21]
            )
          ];
          mounted = true;
        }
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        if (
          /*torrentInfo*/
          ctx[0].smallDescr
        ) {
          if (if_block0) {
            if_block0.p(ctx, dirty);
          } else {
            if_block0 = create_if_block_20(ctx);
            if_block0.c();
            if_block0.m(t0.parentNode, t0);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (
          /*torrentInfo*/
          ctx[0].status.discount || /*torrentInfo*/
          ctx[0].status.toppingLevel
        ) {
          if (if_block1) {
            if_block1.p(ctx, dirty);
          } else {
            if_block1 = create_if_block_17(ctx);
            if_block1.c();
            if_block1.m(t1.parentNode, t1);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
        if (
          /*torrentInfo*/
          ctx[0].labels != 0
        ) {
          if (if_block2) {
            if_block2.p(ctx, dirty);
          } else {
            if_block2 = create_if_block_13(ctx);
            if_block2.c();
            if_block2.m(t2.parentNode, t2);
          }
        } else if (if_block2) {
          if_block2.d(1);
          if_block2 = null;
        }
        if ((!current || dirty[0] & /*torrentInfo*/
        1) && t4_value !== (t4_value = (Number(
          /*torrentInfo*/
          ctx[0].size
        ) / 1024 / 1024 / 1024).toFixed(2) + "G"))
          set_data(t4, t4_value);
        info.ctx = ctx;
        if (dirty[0] & /*promise*/
        32 && promise_1 !== (promise_1 = /*promise*/
        ctx[5]) && handle_promise(promise_1, info))
          ;
        else {
          update_await_block_branch(info, ctx, dirty);
        }
        if ((!current || dirty[0] & /*torrentInfo*/
        1) && t14_value !== (t14_value = /*torrentInfo*/
        ctx[0].status.comments + ""))
          set_data(t14, t14_value);
        if ((!current || dirty[0] & /*torrentInfo*/
        1) && t17_value !== (t17_value = /*torrentInfo*/
        ctx[0].status.seeders + ""))
          set_data(t17, t17_value);
        if ((!current || dirty[0] & /*torrentInfo*/
        1) && t20_value !== (t20_value = /*torrentInfo*/
        ctx[0].status.leechers + ""))
          set_data(t20, t20_value);
      },
      i(local) {
        if (current)
          return;
        transition_in(iconsize.$$.fragment, local);
        transition_in(icondownload.$$.fragment, local);
        transition_in(icontime.$$.fragment, local);
        transition_in(iconcomment.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(iconsize.$$.fragment, local);
        transition_out(icondownload.$$.fragment, local);
        transition_out(icontime.$$.fragment, local);
        transition_out(iconcomment.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (if_block0)
          if_block0.d(detaching);
        if (detaching)
          detach(t0);
        if (if_block1)
          if_block1.d(detaching);
        if (detaching)
          detach(t1);
        if (if_block2)
          if_block2.d(detaching);
        if (detaching)
          detach(t2);
        if (detaching)
          detach(div7);
        destroy_component(iconsize);
        destroy_component(icondownload);
        info.block.d();
        info.token = null;
        info = null;
        destroy_component(icontime);
        destroy_component(iconcomment);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_if_block_20(ctx) {
    let div;
    let a;
    let t_value = (
      /*torrentInfo*/
      ctx[0].smallDescr + ""
    );
    let t;
    let a_href_value;
    return {
      c() {
        div = element("div");
        a = element("a");
        t = text(t_value);
        attr(a, "href", a_href_value = /*torrentInfo*/
        ctx[0].torrentLink);
        attr(a, "class", "svelte-rhfb99");
        attr(div, "class", "card-description svelte-rhfb99");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, a);
        append(a, t);
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*torrentInfo*/
        1 && t_value !== (t_value = /*torrentInfo*/
        ctx2[0].smallDescr + ""))
          set_data(t, t_value);
        if (dirty[0] & /*torrentInfo*/
        1 && a_href_value !== (a_href_value = /*torrentInfo*/
        ctx2[0].torrentLink)) {
          attr(a, "href", a_href_value);
        }
      },
      d(detaching) {
        if (detaching)
          detach(div);
      }
    };
  }
  function create_if_block_17(ctx) {
    let div;
    let t;
    let if_block0 = (
      /*torrentInfo*/
      ctx[0].status.toppingLevel && create_if_block_19(ctx)
    );
    let if_block1 = (
      /*_discount*/
      ctx[15] != "NORMAL" && create_if_block_18(ctx)
    );
    return {
      c() {
        div = element("div");
        if (if_block0)
          if_block0.c();
        t = space();
        if (if_block1)
          if_block1.c();
        attr(div, "class", "cl-tags svelte-rhfb99");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if (if_block0)
          if_block0.m(div, null);
        append(div, t);
        if (if_block1)
          if_block1.m(div, null);
      },
      p(ctx2, dirty) {
        if (
          /*torrentInfo*/
          ctx2[0].status.toppingLevel
        ) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
          } else {
            if_block0 = create_if_block_19(ctx2);
            if_block0.c();
            if_block0.m(div, t);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (
          /*_discount*/
          ctx2[15] != "NORMAL"
        )
          if_block1.p(ctx2, dirty);
      },
      d(detaching) {
        if (detaching)
          detach(div);
        if (if_block0)
          if_block0.d();
        if (if_block1)
          if_block1.d();
      }
    };
  }
  function create_if_block_19(ctx) {
    let t;
    let each_value_1 = (
      /*toppingLevelArray*/
      ctx[3]
    );
    let each_blocks = [];
    for (let i = 0; i < each_value_1.length; i += 1) {
      each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    }
    return {
      c() {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        t = text("\r\n             ");
      },
      m(target, anchor) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(target, anchor);
          }
        }
        insert(target, t, anchor);
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*toppingLevelArray*/
        8) {
          each_value_1 = /*toppingLevelArray*/
          ctx2[3];
          let i;
          for (i = 0; i < each_value_1.length; i += 1) {
            const child_ctx = get_each_context_1(ctx2, each_value_1, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block_1();
              each_blocks[i].c();
              each_blocks[i].m(t.parentNode, t);
            }
          }
          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }
          each_blocks.length = each_value_1.length;
        }
      },
      d(detaching) {
        destroy_each(each_blocks, detaching);
        if (detaching)
          detach(t);
      }
    };
  }
  function create_each_block_1(ctx) {
    let img;
    let img_src_value;
    return {
      c() {
        img = element("img");
        set_style(img, "background", "url(/static/media/icons.8bb5446ebbbd07050285.gif) 0 -202px");
        set_style(img, "height", "14px");
        set_style(img, "width", "14px");
        if (!src_url_equal(img.src, img_src_value = CONFIG.ICON.PIN))
          attr(img, "src", img_src_value);
        attr(img, "alt", "PIN");
      },
      m(target, anchor) {
        insert(target, img, anchor);
      },
      p: noop,
      d(detaching) {
        if (detaching)
          detach(img);
      }
    };
  }
  function create_if_block_18(ctx) {
    let div;
    return {
      c() {
        div = element("div");
        div.textContent = `${/*_discountText*/
      ctx[17][
        /*_discount*/
        ctx[15]
      ]}${/*_discountEndTime*/
      ctx[16] ? " : " + /*_discountCalcTime*/
      ctx[18]() + " 小时" : ""}`;
        attr(div, "class", "_tag svelte-rhfb99");
        toggle_class(
          div,
          "_tag_discount_free",
          /*_discount*/
          ctx[15] == "FREE"
        );
        toggle_class(
          div,
          "_tag_discount_50",
          /*_discount*/
          ctx[15] == "PERCENT_50"
        );
      },
      m(target, anchor) {
        insert(target, div, anchor);
      },
      p: noop,
      d(detaching) {
        if (detaching)
          detach(div);
      }
    };
  }
  function create_if_block_13(ctx) {
    let div;
    let t0;
    let t1;
    let if_block0 = (
      /*torrentInfo*/
      (ctx[0].labels & 1) === 1 && create_if_block_16()
    );
    let if_block1 = (
      /*torrentInfo*/
      (ctx[0].labels & 2) === 2 && create_if_block_15()
    );
    let if_block2 = (
      /*torrentInfo*/
      (ctx[0].labels & 4) === 4 && create_if_block_14()
    );
    return {
      c() {
        div = element("div");
        if (if_block0)
          if_block0.c();
        t0 = space();
        if (if_block1)
          if_block1.c();
        t1 = space();
        if (if_block2)
          if_block2.c();
        attr(div, "class", "cl-tags svelte-rhfb99");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if (if_block0)
          if_block0.m(div, null);
        append(div, t0);
        if (if_block1)
          if_block1.m(div, null);
        append(div, t1);
        if (if_block2)
          if_block2.m(div, null);
      },
      p(ctx2, dirty) {
        if (
          /*torrentInfo*/
          (ctx2[0].labels & 1) === 1
        ) {
          if (if_block0)
            ;
          else {
            if_block0 = create_if_block_16();
            if_block0.c();
            if_block0.m(div, t0);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (
          /*torrentInfo*/
          (ctx2[0].labels & 2) === 2
        ) {
          if (if_block1)
            ;
          else {
            if_block1 = create_if_block_15();
            if_block1.c();
            if_block1.m(div, t1);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
        if (
          /*torrentInfo*/
          (ctx2[0].labels & 4) === 4
        ) {
          if (if_block2)
            ;
          else {
            if_block2 = create_if_block_14();
            if_block2.c();
            if_block2.m(div, null);
          }
        } else if (if_block2) {
          if_block2.d(1);
          if_block2 = null;
        }
      },
      d(detaching) {
        if (detaching)
          detach(div);
        if (if_block0)
          if_block0.d();
        if (if_block1)
          if_block1.d();
        if (if_block2)
          if_block2.d();
      }
    };
  }
  function create_if_block_16(ctx) {
    let div;
    return {
      c() {
        div = element("div");
        div.textContent = "DIY";
        attr(div, "class", "_tag _tag_diy svelte-rhfb99");
      },
      m(target, anchor) {
        insert(target, div, anchor);
      },
      d(detaching) {
        if (detaching)
          detach(div);
      }
    };
  }
  function create_if_block_15(ctx) {
    let div;
    return {
      c() {
        div = element("div");
        div.textContent = "国配";
        attr(div, "class", "_tag _tag_dub svelte-rhfb99");
      },
      m(target, anchor) {
        insert(target, div, anchor);
      },
      d(detaching) {
        if (detaching)
          detach(div);
      }
    };
  }
  function create_if_block_14(ctx) {
    let div;
    return {
      c() {
        div = element("div");
        div.textContent = "中字";
        attr(div, "class", "_tag _tag_sub svelte-rhfb99");
      },
      m(target, anchor) {
        insert(target, div, anchor);
      },
      d(detaching) {
        if (detaching)
          detach(div);
      }
    };
  }
  function create_catch_block_1(ctx) {
    let p;
    let t_value = (
      /*error*/
      ctx[38].message + ""
    );
    let t;
    return {
      c() {
        p = element("p");
        t = text(t_value);
        set_style(p, "color", "red");
      },
      m(target, anchor) {
        insert(target, p, anchor);
        append(p, t);
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*promise*/
        32 && t_value !== (t_value = /*error*/
        ctx2[38].message + ""))
          set_data(t, t_value);
      },
      d(detaching) {
        if (detaching)
          detach(p);
      }
    };
  }
  function create_then_block_1(ctx) {
    let svg;
    let path;
    let svg_style_value;
    return {
      c() {
        svg = svg_element("svg");
        path = svg_element("path");
        attr(path, "d", "M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 00.6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0046.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z");
        attr(svg, "viewBox", "64 64 896 896");
        attr(svg, "focusable", "false");
        attr(svg, "data-icon", "star");
        attr(svg, "width", "1em");
        attr(svg, "height", "1em");
        attr(svg, "fill", "currentColor");
        attr(svg, "aria-hidden", "true");
        attr(svg, "style", svg_style_value = /*collectionMark*/
        ctx[4] ? "color:orange" : "");
        attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      },
      m(target, anchor) {
        insert(target, svg, anchor);
        append(svg, path);
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*collectionMark*/
        16 && svg_style_value !== (svg_style_value = /*collectionMark*/
        ctx2[4] ? "color:orange" : "")) {
          attr(svg, "style", svg_style_value);
        }
      },
      d(detaching) {
        if (detaching)
          detach(svg);
      }
    };
  }
  function create_pending_block_1(ctx) {
    let span;
    return {
      c() {
        span = element("span");
        span.textContent = "···";
        set_style(span, "display", "flex");
        set_style(span, "align-items", "center");
      },
      m(target, anchor) {
        insert(target, span, anchor);
      },
      p: noop,
      d(detaching) {
        if (detaching)
          detach(span);
      }
    };
  }
  function create_if_block$2(ctx) {
    let t0;
    let t1;
    let t2;
    let div;
    let t3;
    let t4;
    let current;
    let if_block0 = (
      /*$_CARD_SHOW*/
      ctx[10].free && /*torrentInfo*/
      (ctx[0].status.discount || /*torrentInfo*/
      ctx[0].status.toppingLevel) && create_if_block_9(ctx)
    );
    let if_block1 = (
      /*$_CARD_SHOW*/
      ctx[10].sub_title && /*torrentInfo*/
      ctx[0].smallDescr && create_if_block_8(ctx)
    );
    let if_block2 = (
      /*$_CARD_SHOW*/
      ctx[10].tags && /*torrentInfo*/
      ctx[0].labels != 0 && create_if_block_4(ctx)
    );
    let if_block3 = (
      /*$_CARD_SHOW*/
      ctx[10].size_download_collect && create_if_block_3(ctx)
    );
    let if_block4 = (
      /*$_CARD_SHOW*/
      ctx[10].upload_time && create_if_block_2(ctx)
    );
    let if_block5 = (
      /*$_CARD_SHOW*/
      ctx[10].statistics && create_if_block_1(ctx)
    );
    return {
      c() {
        if (if_block0)
          if_block0.c();
        t0 = space();
        if (if_block1)
          if_block1.c();
        t1 = space();
        if (if_block2)
          if_block2.c();
        t2 = space();
        div = element("div");
        if (if_block3)
          if_block3.c();
        t3 = space();
        if (if_block4)
          if_block4.c();
        t4 = space();
        if (if_block5)
          if_block5.c();
        attr(div, "class", "card-details svelte-rhfb99");
      },
      m(target, anchor) {
        if (if_block0)
          if_block0.m(target, anchor);
        insert(target, t0, anchor);
        if (if_block1)
          if_block1.m(target, anchor);
        insert(target, t1, anchor);
        if (if_block2)
          if_block2.m(target, anchor);
        insert(target, t2, anchor);
        insert(target, div, anchor);
        if (if_block3)
          if_block3.m(div, null);
        append(div, t3);
        if (if_block4)
          if_block4.m(div, null);
        append(div, t4);
        if (if_block5)
          if_block5.m(div, null);
        current = true;
      },
      p(ctx2, dirty) {
        if (
          /*$_CARD_SHOW*/
          ctx2[10].free && /*torrentInfo*/
          (ctx2[0].status.discount || /*torrentInfo*/
          ctx2[0].status.toppingLevel)
        ) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
          } else {
            if_block0 = create_if_block_9(ctx2);
            if_block0.c();
            if_block0.m(t0.parentNode, t0);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (
          /*$_CARD_SHOW*/
          ctx2[10].sub_title && /*torrentInfo*/
          ctx2[0].smallDescr
        ) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
          } else {
            if_block1 = create_if_block_8(ctx2);
            if_block1.c();
            if_block1.m(t1.parentNode, t1);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
        if (
          /*$_CARD_SHOW*/
          ctx2[10].tags && /*torrentInfo*/
          ctx2[0].labels != 0
        ) {
          if (if_block2) {
            if_block2.p(ctx2, dirty);
          } else {
            if_block2 = create_if_block_4(ctx2);
            if_block2.c();
            if_block2.m(t2.parentNode, t2);
          }
        } else if (if_block2) {
          if_block2.d(1);
          if_block2 = null;
        }
        if (
          /*$_CARD_SHOW*/
          ctx2[10].size_download_collect
        ) {
          if (if_block3) {
            if_block3.p(ctx2, dirty);
            if (dirty[0] & /*$_CARD_SHOW*/
            1024) {
              transition_in(if_block3, 1);
            }
          } else {
            if_block3 = create_if_block_3(ctx2);
            if_block3.c();
            transition_in(if_block3, 1);
            if_block3.m(div, t3);
          }
        } else if (if_block3) {
          group_outros();
          transition_out(if_block3, 1, 1, () => {
            if_block3 = null;
          });
          check_outros();
        }
        if (
          /*$_CARD_SHOW*/
          ctx2[10].upload_time
        ) {
          if (if_block4) {
            if_block4.p(ctx2, dirty);
            if (dirty[0] & /*$_CARD_SHOW*/
            1024) {
              transition_in(if_block4, 1);
            }
          } else {
            if_block4 = create_if_block_2(ctx2);
            if_block4.c();
            transition_in(if_block4, 1);
            if_block4.m(div, t4);
          }
        } else if (if_block4) {
          group_outros();
          transition_out(if_block4, 1, 1, () => {
            if_block4 = null;
          });
          check_outros();
        }
        if (
          /*$_CARD_SHOW*/
          ctx2[10].statistics
        ) {
          if (if_block5) {
            if_block5.p(ctx2, dirty);
            if (dirty[0] & /*$_CARD_SHOW*/
            1024) {
              transition_in(if_block5, 1);
            }
          } else {
            if_block5 = create_if_block_1(ctx2);
            if_block5.c();
            transition_in(if_block5, 1);
            if_block5.m(div, null);
          }
        } else if (if_block5) {
          group_outros();
          transition_out(if_block5, 1, 1, () => {
            if_block5 = null;
          });
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block3);
        transition_in(if_block4);
        transition_in(if_block5);
        current = true;
      },
      o(local) {
        transition_out(if_block3);
        transition_out(if_block4);
        transition_out(if_block5);
        current = false;
      },
      d(detaching) {
        if (if_block0)
          if_block0.d(detaching);
        if (detaching)
          detach(t0);
        if (if_block1)
          if_block1.d(detaching);
        if (detaching)
          detach(t1);
        if (if_block2)
          if_block2.d(detaching);
        if (detaching)
          detach(t2);
        if (detaching)
          detach(div);
        if (if_block3)
          if_block3.d();
        if (if_block4)
          if_block4.d();
        if (if_block5)
          if_block5.d();
      }
    };
  }
  function create_if_block_9(ctx) {
    let div;
    let t;
    let if_block0 = (
      /*torrentInfo*/
      ctx[0].status.toppingLevel && create_if_block_11(ctx)
    );
    let if_block1 = (
      /*_discount*/
      ctx[15] != "NORMAL" && create_if_block_10(ctx)
    );
    return {
      c() {
        div = element("div");
        if (if_block0)
          if_block0.c();
        t = space();
        if (if_block1)
          if_block1.c();
        attr(div, "class", "cl-tags svelte-rhfb99");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if (if_block0)
          if_block0.m(div, null);
        append(div, t);
        if (if_block1)
          if_block1.m(div, null);
      },
      p(ctx2, dirty) {
        if (
          /*torrentInfo*/
          ctx2[0].status.toppingLevel
        ) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
          } else {
            if_block0 = create_if_block_11(ctx2);
            if_block0.c();
            if_block0.m(div, t);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (
          /*_discount*/
          ctx2[15] != "NORMAL"
        )
          if_block1.p(ctx2, dirty);
      },
      d(detaching) {
        if (detaching)
          detach(div);
        if (if_block0)
          if_block0.d();
        if (if_block1)
          if_block1.d();
      }
    };
  }
  function create_if_block_11(ctx) {
    let t;
    let each_value = (
      /*toppingLevelArray*/
      ctx[3]
    );
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    }
    return {
      c() {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        t = text("\r\n             ");
      },
      m(target, anchor) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(target, anchor);
          }
        }
        insert(target, t, anchor);
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*toppingLevelArray*/
        8) {
          each_value = /*toppingLevelArray*/
          ctx2[3];
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context$1(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block$1();
              each_blocks[i].c();
              each_blocks[i].m(t.parentNode, t);
            }
          }
          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }
          each_blocks.length = each_value.length;
        }
      },
      d(detaching) {
        destroy_each(each_blocks, detaching);
        if (detaching)
          detach(t);
      }
    };
  }
  function create_each_block$1(ctx) {
    let img;
    let img_src_value;
    return {
      c() {
        img = element("img");
        set_style(img, "background", "url(/static/media/icons.8bb5446ebbbd07050285.gif) 0 -202px");
        set_style(img, "height", "14px");
        set_style(img, "width", "14px");
        if (!src_url_equal(img.src, img_src_value = CONFIG.ICON.PIN))
          attr(img, "src", img_src_value);
        attr(img, "alt", "PIN");
      },
      m(target, anchor) {
        insert(target, img, anchor);
      },
      p: noop,
      d(detaching) {
        if (detaching)
          detach(img);
      }
    };
  }
  function create_if_block_10(ctx) {
    let div;
    return {
      c() {
        div = element("div");
        div.textContent = `${/*_discountText*/
      ctx[17][
        /*_discount*/
        ctx[15]
      ]}${/*_discountEndTime*/
      ctx[16] ? " : " + /*_discountCalcTime*/
      ctx[18]() + " 小时" : ""}`;
        attr(div, "class", "_tag svelte-rhfb99");
        toggle_class(
          div,
          "_tag_discount_free",
          /*_discount*/
          ctx[15] == "FREE"
        );
        toggle_class(
          div,
          "_tag_discount_50",
          /*_discount*/
          ctx[15] == "PERCENT_50"
        );
      },
      m(target, anchor) {
        insert(target, div, anchor);
      },
      p: noop,
      d(detaching) {
        if (detaching)
          detach(div);
      }
    };
  }
  function create_if_block_8(ctx) {
    let div;
    let a;
    let t_value = (
      /*torrentInfo*/
      ctx[0].smallDescr + ""
    );
    let t;
    let a_href_value;
    return {
      c() {
        div = element("div");
        a = element("a");
        t = text(t_value);
        attr(a, "href", a_href_value = /*torrentInfo*/
        ctx[0].torrentLink);
        attr(a, "class", "svelte-rhfb99");
        attr(div, "class", "card-description svelte-rhfb99");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, a);
        append(a, t);
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*torrentInfo*/
        1 && t_value !== (t_value = /*torrentInfo*/
        ctx2[0].smallDescr + ""))
          set_data(t, t_value);
        if (dirty[0] & /*torrentInfo*/
        1 && a_href_value !== (a_href_value = /*torrentInfo*/
        ctx2[0].torrentLink)) {
          attr(a, "href", a_href_value);
        }
      },
      d(detaching) {
        if (detaching)
          detach(div);
      }
    };
  }
  function create_if_block_4(ctx) {
    let div;
    let t0;
    let t1;
    let if_block0 = (
      /*torrentInfo*/
      (ctx[0].labels & 1) === 1 && create_if_block_7()
    );
    let if_block1 = (
      /*torrentInfo*/
      (ctx[0].labels & 2) === 2 && create_if_block_6()
    );
    let if_block2 = (
      /*torrentInfo*/
      (ctx[0].labels & 4) === 4 && create_if_block_5()
    );
    return {
      c() {
        div = element("div");
        if (if_block0)
          if_block0.c();
        t0 = space();
        if (if_block1)
          if_block1.c();
        t1 = space();
        if (if_block2)
          if_block2.c();
        attr(div, "class", "cl-tags svelte-rhfb99");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if (if_block0)
          if_block0.m(div, null);
        append(div, t0);
        if (if_block1)
          if_block1.m(div, null);
        append(div, t1);
        if (if_block2)
          if_block2.m(div, null);
      },
      p(ctx2, dirty) {
        if (
          /*torrentInfo*/
          (ctx2[0].labels & 1) === 1
        ) {
          if (if_block0)
            ;
          else {
            if_block0 = create_if_block_7();
            if_block0.c();
            if_block0.m(div, t0);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (
          /*torrentInfo*/
          (ctx2[0].labels & 2) === 2
        ) {
          if (if_block1)
            ;
          else {
            if_block1 = create_if_block_6();
            if_block1.c();
            if_block1.m(div, t1);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
        if (
          /*torrentInfo*/
          (ctx2[0].labels & 4) === 4
        ) {
          if (if_block2)
            ;
          else {
            if_block2 = create_if_block_5();
            if_block2.c();
            if_block2.m(div, null);
          }
        } else if (if_block2) {
          if_block2.d(1);
          if_block2 = null;
        }
      },
      d(detaching) {
        if (detaching)
          detach(div);
        if (if_block0)
          if_block0.d();
        if (if_block1)
          if_block1.d();
        if (if_block2)
          if_block2.d();
      }
    };
  }
  function create_if_block_7(ctx) {
    let div;
    return {
      c() {
        div = element("div");
        div.textContent = "DIY";
        attr(div, "class", "_tag _tag_diy svelte-rhfb99");
      },
      m(target, anchor) {
        insert(target, div, anchor);
      },
      d(detaching) {
        if (detaching)
          detach(div);
      }
    };
  }
  function create_if_block_6(ctx) {
    let div;
    return {
      c() {
        div = element("div");
        div.textContent = "国配";
        attr(div, "class", "_tag _tag_dub svelte-rhfb99");
      },
      m(target, anchor) {
        insert(target, div, anchor);
      },
      d(detaching) {
        if (detaching)
          detach(div);
      }
    };
  }
  function create_if_block_5(ctx) {
    let div;
    return {
      c() {
        div = element("div");
        div.textContent = "中字";
        attr(div, "class", "_tag _tag_sub svelte-rhfb99");
      },
      m(target, anchor) {
        insert(target, div, anchor);
      },
      d(detaching) {
        if (detaching)
          detach(div);
      }
    };
  }
  function create_if_block_3(ctx) {
    let div4;
    let div3;
    let div0;
    let span0;
    let iconsize;
    let t0;
    let t1_value = (Number(
      /*torrentInfo*/
      ctx[0].size
    ) / 1024 / 1024 / 1024).toFixed(2) + "G";
    let t1;
    let t2;
    let div1;
    let span1;
    let icondownload;
    let t3;
    let div2;
    let span2;
    let promise_1;
    let current;
    let mounted;
    let dispose;
    iconsize = new Icon_size({});
    icondownload = new Icon_download({});
    let info = {
      ctx,
      current: null,
      token: null,
      hasCatch: true,
      pending: create_pending_block,
      then: create_then_block,
      catch: create_catch_block,
      value: 37,
      error: 38
    };
    handle_promise(promise_1 = /*promise*/
    ctx[5], info);
    return {
      c() {
        div4 = element("div");
        div3 = element("div");
        div0 = element("div");
        span0 = element("span");
        create_component(iconsize.$$.fragment);
        t0 = text("\r\n                 ");
        t1 = text(t1_value);
        t2 = text("\r\n\r\n              \r\n                \r\n              \r\n              ");
        div1 = element("div");
        span1 = element("span");
        create_component(icondownload.$$.fragment);
        t3 = text("\r\n\r\n              \r\n                \r\n              \r\n              ");
        div2 = element("div");
        span2 = element("span");
        info.block.c();
        attr(span0, "class", "icon_holder svelte-rhfb99");
        attr(div0, "class", "cl-btn svelte-rhfb99");
        attr(span1, "class", "icon_holder svelte-rhfb99");
        attr(div1, "class", "cl-btn svelte-rhfb99");
        set_style(div1, "cursor", "pointer");
        attr(span2, "class", "icon_holder svelte-rhfb99");
        attr(div2, "class", "cl-btn svelte-rhfb99");
        set_style(div2, "cursor", "pointer");
        attr(div3, "class", "cl-center svelte-rhfb99");
        attr(div4, "class", "card-line svelte-rhfb99");
      },
      m(target, anchor) {
        insert(target, div4, anchor);
        append(div4, div3);
        append(div3, div0);
        append(div0, span0);
        mount_component(iconsize, span0, null);
        append(div0, t0);
        append(div0, t1);
        append(div3, t2);
        append(div3, div1);
        append(div1, span1);
        mount_component(icondownload, span1, null);
        append(div3, t3);
        append(div3, div2);
        append(div2, span2);
        info.block.m(span2, info.anchor = null);
        info.mount = () => span2;
        info.anchor = null;
        current = true;
        if (!mounted) {
          dispose = [
            listen(
              div1,
              "click",
              /*torrent_download*/
              ctx[20]
            ),
            listen(
              div2,
              "click",
              /*handleCollection*/
              ctx[21]
            )
          ];
          mounted = true;
        }
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        if ((!current || dirty[0] & /*torrentInfo*/
        1) && t1_value !== (t1_value = (Number(
          /*torrentInfo*/
          ctx[0].size
        ) / 1024 / 1024 / 1024).toFixed(2) + "G"))
          set_data(t1, t1_value);
        info.ctx = ctx;
        if (dirty[0] & /*promise*/
        32 && promise_1 !== (promise_1 = /*promise*/
        ctx[5]) && handle_promise(promise_1, info))
          ;
        else {
          update_await_block_branch(info, ctx, dirty);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(iconsize.$$.fragment, local);
        transition_in(icondownload.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(iconsize.$$.fragment, local);
        transition_out(icondownload.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div4);
        destroy_component(iconsize);
        destroy_component(icondownload);
        info.block.d();
        info.token = null;
        info = null;
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_catch_block(ctx) {
    let p;
    let t_value = (
      /*error*/
      ctx[38].message + ""
    );
    let t;
    return {
      c() {
        p = element("p");
        t = text(t_value);
        set_style(p, "color", "red");
      },
      m(target, anchor) {
        insert(target, p, anchor);
        append(p, t);
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*promise*/
        32 && t_value !== (t_value = /*error*/
        ctx2[38].message + ""))
          set_data(t, t_value);
      },
      d(detaching) {
        if (detaching)
          detach(p);
      }
    };
  }
  function create_then_block(ctx) {
    let svg;
    let path;
    return {
      c() {
        svg = svg_element("svg");
        path = svg_element("path");
        attr(path, "d", "M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 00.6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0046.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z");
        attr(svg, "viewBox", "64 64 896 896");
        attr(svg, "focusable", "false");
        attr(svg, "data-icon", "star");
        attr(svg, "width", "1em");
        attr(svg, "height", "1em");
        attr(svg, "fill", "currentColor");
        attr(svg, "aria-hidden", "true");
        set_style(
          svg,
          "color",
          /*collectionMark*/
          ctx[4] ? "orange" : "black"
        );
        attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      },
      m(target, anchor) {
        insert(target, svg, anchor);
        append(svg, path);
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*collectionMark*/
        16) {
          set_style(
            svg,
            "color",
            /*collectionMark*/
            ctx2[4] ? "orange" : "black"
          );
        }
      },
      d(detaching) {
        if (detaching)
          detach(svg);
      }
    };
  }
  function create_pending_block(ctx) {
    let span;
    return {
      c() {
        span = element("span");
        span.textContent = "···";
        set_style(span, "display", "flex");
        set_style(span, "align-items", "center");
      },
      m(target, anchor) {
        insert(target, span, anchor);
      },
      p: noop,
      d(detaching) {
        if (detaching)
          detach(span);
      }
    };
  }
  function create_if_block_2(ctx) {
    let div;
    let icontime;
    let t0;
    let t1_value = `${/*_CT*/
  ctx[19].day} 日`;
    let t1;
    let t2;
    let t3_value = (
      /*_CT*/
      ctx[19].hour ? `${/*_CT*/
    ctx[19].hour} 时` : ""
    );
    let t3;
    let current;
    icontime = new Icon_time({});
    return {
      c() {
        div = element("div");
        create_component(icontime.$$.fragment);
        t0 = text("\r\n             ");
        t1 = text(t1_value);
        t2 = space();
        t3 = text(t3_value);
        attr(div, "class", "card-line cl-btn svelte-rhfb99");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        mount_component(icontime, div, null);
        append(div, t0);
        append(div, t1);
        append(div, t2);
        append(div, t3);
        current = true;
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(icontime.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(icontime.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div);
        destroy_component(icontime);
      }
    };
  }
  function create_if_block_1(ctx) {
    let div;
    let iconcomment;
    let t0;
    let b0;
    let t1_value = (
      /*torrentInfo*/
      ctx[0].status.comments + ""
    );
    let t1;
    let t2;
    let img0;
    let img0_src_value;
    let t3;
    let b1;
    let t4_value = (
      /*torrentInfo*/
      ctx[0].status.seeders + ""
    );
    let t4;
    let t5;
    let img1;
    let img1_src_value;
    let t6;
    let b2;
    let t7_value = (
      /*torrentInfo*/
      ctx[0].status.leechers + ""
    );
    let t7;
    let current;
    iconcomment = new Icon_comment({});
    return {
      c() {
        div = element("div");
        create_component(iconcomment.$$.fragment);
        t0 = text("\r\n             \r\n            ");
        b0 = element("b");
        t1 = text(t1_value);
        t2 = text("\r\n              \r\n            ");
        img0 = element("img");
        t3 = text("\r\n             \r\n            ");
        b1 = element("b");
        t4 = text(t4_value);
        t5 = text("\r\n              \r\n            ");
        img1 = element("img");
        t6 = text("\r\n             \r\n            ");
        b2 = element("b");
        t7 = text(t7_value);
        if (!src_url_equal(img0.src, img0_src_value = CONFIG.ICON.SEEDERS))
          attr(img0, "src", img0_src_value);
        attr(img0, "alt", "SVG_Seeders");
        if (!src_url_equal(img1.src, img1_src_value = CONFIG.ICON.LEECHERS))
          attr(img1, "src", img1_src_value);
        attr(img1, "alt", "SVG_Leechers");
        attr(div, "class", "card-line svelte-rhfb99");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        mount_component(iconcomment, div, null);
        append(div, t0);
        append(div, b0);
        append(b0, t1);
        append(div, t2);
        append(div, img0);
        append(div, t3);
        append(div, b1);
        append(b1, t4);
        append(div, t5);
        append(div, img1);
        append(div, t6);
        append(div, b2);
        append(b2, t7);
        current = true;
      },
      p(ctx2, dirty) {
        if ((!current || dirty[0] & /*torrentInfo*/
        1) && t1_value !== (t1_value = /*torrentInfo*/
        ctx2[0].status.comments + ""))
          set_data(t1, t1_value);
        if ((!current || dirty[0] & /*torrentInfo*/
        1) && t4_value !== (t4_value = /*torrentInfo*/
        ctx2[0].status.seeders + ""))
          set_data(t4, t4_value);
        if ((!current || dirty[0] & /*torrentInfo*/
        1) && t7_value !== (t7_value = /*torrentInfo*/
        ctx2[0].status.leechers + ""))
          set_data(t7, t7_value);
      },
      i(local) {
        if (current)
          return;
        transition_in(iconcomment.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(iconcomment.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div);
        destroy_component(iconcomment);
      }
    };
  }
  function create_fragment$2(ctx) {
    let div4;
    let div3;
    let div0;
    let img;
    let img_src_value;
    let t0;
    let t1_value = CONFIG.CATEGORY_NAME[
      /*torrentInfo*/
      ctx[0].category
    ] + "";
    let t1;
    let div0_data_href_value;
    let t2;
    let t3;
    let div2;
    let t4;
    let div1;
    let t5_value = (
      /*index*/
      ctx[2] + 1 + ""
    );
    let t5;
    let t6;
    let t7;
    let t8;
    let current;
    let mounted;
    let dispose;
    let if_block0 = (
      /*$_CARD_SHOW*/
      (ctx[10].title || /*_hover*/
      ctx[6]) && create_if_block_25(ctx)
    );
    function select_block_type(ctx2, dirty) {
      if (!/*_picError*/
      ctx2[7])
        return create_if_block_22;
      return create_else_block_2;
    }
    let current_block_type = select_block_type(ctx);
    let if_block1 = current_block_type(ctx);
    let if_block2 = (
      /*$_trigger_nexus_pic*/
      ctx[12] && !/*_picError*/
      ctx[7] && !/*torrentInfo*/
      (ctx[0].category == "440" && /*$_SITE_SETTING*/
      ctx[11].mt.hide_gay == true) && /*torrentInfo*/
      ctx[0].imageList[0] && create_if_block_21()
    );
    let if_block3 = (
      /*$_CARD_SHOW*/
      (ctx[10].all || /*_hover*/
      ctx[6]) && create_if_block_12(ctx)
    );
    let if_block4 = !/*$_CARD_SHOW*/
    (ctx[10].all || /*_hover*/
    ctx[6]) && !/*torrentInfo*/
    (ctx[0].category == "440" && /*$_SITE_SETTING*/
    ctx[11].mt.hide_gay == true) && create_if_block$2(ctx);
    return {
      c() {
        div4 = element("div");
        div3 = element("div");
        div0 = element("div");
        img = element("img");
        t0 = space();
        t1 = text(t1_value);
        t2 = space();
        if (if_block0)
          if_block0.c();
        t3 = space();
        div2 = element("div");
        if_block1.c();
        t4 = space();
        div1 = element("div");
        t5 = text(t5_value);
        t6 = space();
        if (if_block2)
          if_block2.c();
        t7 = space();
        if (if_block3)
          if_block3.c();
        t8 = space();
        if (if_block4)
          if_block4.c();
        attr(img, "class", "card_category-img svelte-rhfb99");
        if (!src_url_equal(img.src, img_src_value = /*torrentInfo*/
        ctx[0]._categoryImg))
          attr(img, "src", img_src_value);
        attr(img, "alt", "");
        attr(div0, "class", "card-category svelte-rhfb99");
        attr(div0, "data-href", div0_data_href_value = `https://${location.host}/browse?cat=` + /*torrentInfo*/
        ctx[0].category);
        set_style(
          div0,
          "background-color",
          /*_categoryColor*/
          ctx[24] ?? "transparent"
        );
        set_style(
          div0,
          "color",
          /*_categoryColor*/
          ctx[24] ? getTextColor(
            /*_categoryColor*/
            ctx[24]
          ) : "black"
        );
        attr(div1, "class", "card-index svelte-rhfb99");
        attr(div2, "class", "card-image svelte-rhfb99");
        attr(div3, "class", "card-holder svelte-rhfb99");
        set_style(div3, "background", "linear-gradient (to bottom, " + /*_categoryColor*/
        (ctx[24] ?? _defaultColor) + " 18px, rgba(255, 255, 255, 0.4) 18px, rgba(255, 255, 255, 0))");
        attr(div4, "class", "card svelte-rhfb99");
        set_style(
          div4,
          "width",
          /*cardWidth*/
          ctx[1] + "px"
        );
        set_style(div4, "z-index", 1e4 - /*index*/
        ctx[2]);
        set_style(
          div4,
          "border-color",
          /*_categoryColor*/
          ctx[24] ?? _defaultColor
        );
        set_style(
          div4,
          "background-color",
          /*$_current_bgColor*/
          ctx[9]
        );
        set_style(div4, "background", "linear-gradient( to bottom, " + /*_categoryColor*/
        (ctx[24] ?? _defaultColor) + " 18px, " + /*$_current_bgColor*/
        ctx[9] + " 18px)");
      },
      m(target, anchor) {
        insert(target, div4, anchor);
        append(div4, div3);
        append(div3, div0);
        append(div0, img);
        append(div0, t0);
        append(div0, t1);
        append(div3, t2);
        if (if_block0)
          if_block0.m(div3, null);
        append(div3, t3);
        append(div3, div2);
        if_block1.m(div2, null);
        append(div2, t4);
        append(div2, div1);
        append(div1, t5);
        append(div2, t6);
        if (if_block2)
          if_block2.m(div2, null);
        append(div3, t7);
        if (if_block3)
          if_block3.m(div3, null);
        append(div3, t8);
        if (if_block4)
          if_block4.m(div3, null);
        ctx[27](div4);
        current = true;
        if (!mounted) {
          dispose = [
            listen(
              div2,
              "click",
              /*showDetailIframe*/
              ctx[14]
            ),
            listen(
              div3,
              "mouseenter",
              /*card_show_detail*/
              ctx[22]
            ),
            listen(
              div3,
              "mouseleave",
              /*card_hide_detail*/
              ctx[23]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (!current || dirty[0] & /*torrentInfo*/
        1 && !src_url_equal(img.src, img_src_value = /*torrentInfo*/
        ctx2[0]._categoryImg)) {
          attr(img, "src", img_src_value);
        }
        if ((!current || dirty[0] & /*torrentInfo*/
        1) && t1_value !== (t1_value = CONFIG.CATEGORY_NAME[
          /*torrentInfo*/
          ctx2[0].category
        ] + ""))
          set_data(t1, t1_value);
        if (!current || dirty[0] & /*torrentInfo*/
        1 && div0_data_href_value !== (div0_data_href_value = `https://${location.host}/browse?cat=` + /*torrentInfo*/
        ctx2[0].category)) {
          attr(div0, "data-href", div0_data_href_value);
        }
        if (
          /*$_CARD_SHOW*/
          ctx2[10].title || /*_hover*/
          ctx2[6]
        ) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
          } else {
            if_block0 = create_if_block_25(ctx2);
            if_block0.c();
            if_block0.m(div3, t3);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block1) {
          if_block1.p(ctx2, dirty);
        } else {
          if_block1.d(1);
          if_block1 = current_block_type(ctx2);
          if (if_block1) {
            if_block1.c();
            if_block1.m(div2, t4);
          }
        }
        if ((!current || dirty[0] & /*index*/
        4) && t5_value !== (t5_value = /*index*/
        ctx2[2] + 1 + ""))
          set_data(t5, t5_value);
        if (
          /*$_trigger_nexus_pic*/
          ctx2[12] && !/*_picError*/
          ctx2[7] && !/*torrentInfo*/
          (ctx2[0].category == "440" && /*$_SITE_SETTING*/
          ctx2[11].mt.hide_gay == true) && /*torrentInfo*/
          ctx2[0].imageList[0]
        ) {
          if (if_block2) {
            if_block2.p(ctx2, dirty);
          } else {
            if_block2 = create_if_block_21();
            if_block2.c();
            if_block2.m(div2, null);
          }
        } else if (if_block2) {
          if_block2.d(1);
          if_block2 = null;
        }
        if (
          /*$_CARD_SHOW*/
          ctx2[10].all || /*_hover*/
          ctx2[6]
        ) {
          if (if_block3) {
            if_block3.p(ctx2, dirty);
            if (dirty[0] & /*$_CARD_SHOW, _hover*/
            1088) {
              transition_in(if_block3, 1);
            }
          } else {
            if_block3 = create_if_block_12(ctx2);
            if_block3.c();
            transition_in(if_block3, 1);
            if_block3.m(div3, t8);
          }
        } else if (if_block3) {
          group_outros();
          transition_out(if_block3, 1, 1, () => {
            if_block3 = null;
          });
          check_outros();
        }
        if (!/*$_CARD_SHOW*/
        (ctx2[10].all || /*_hover*/
        ctx2[6]) && !/*torrentInfo*/
        (ctx2[0].category == "440" && /*$_SITE_SETTING*/
        ctx2[11].mt.hide_gay == true)) {
          if (if_block4) {
            if_block4.p(ctx2, dirty);
            if (dirty[0] & /*$_CARD_SHOW, _hover, torrentInfo, $_SITE_SETTING*/
            3137) {
              transition_in(if_block4, 1);
            }
          } else {
            if_block4 = create_if_block$2(ctx2);
            if_block4.c();
            transition_in(if_block4, 1);
            if_block4.m(div3, null);
          }
        } else if (if_block4) {
          group_outros();
          transition_out(if_block4, 1, 1, () => {
            if_block4 = null;
          });
          check_outros();
        }
        if (!current || dirty[0] & /*cardWidth*/
        2) {
          set_style(
            div4,
            "width",
            /*cardWidth*/
            ctx2[1] + "px"
          );
        }
        if (!current || dirty[0] & /*index*/
        4) {
          set_style(div4, "z-index", 1e4 - /*index*/
          ctx2[2]);
        }
        if (!current || dirty[0] & /*$_current_bgColor*/
        512) {
          set_style(
            div4,
            "background-color",
            /*$_current_bgColor*/
            ctx2[9]
          );
        }
        if (!current || dirty[0] & /*$_current_bgColor*/
        512) {
          set_style(div4, "background", "linear-gradient( to bottom, " + /*_categoryColor*/
          (ctx2[24] ?? _defaultColor) + " 18px, " + /*$_current_bgColor*/
          ctx2[9] + " 18px)");
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block3);
        transition_in(if_block4);
        current = true;
      },
      o(local) {
        transition_out(if_block3);
        transition_out(if_block4);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div4);
        if (if_block0)
          if_block0.d();
        if_block1.d();
        if (if_block2)
          if_block2.d();
        if (if_block3)
          if_block3.d();
        if (if_block4)
          if_block4.d();
        ctx[27](null);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  const _defaultColor = "rgba(255, 255, 255, 0.5)";
  const static_gay_warn = "/static/cate/gayhd.gif";
  function getTextColor(background) {
    const color = background.replace("#", "");
    const red = parseInt(color.substr(0, 2), 16);
    const green = parseInt(color.substr(2, 2), 16);
    const blue = parseInt(color.substr(4, 2), 16);
    const brightness = (red * 299 + green * 587 + blue * 114) / 1e3;
    return brightness < 128 ? "white" : "black";
  }
  function instance$3($$self, $$props, $$invalidate) {
    let $_iframe_url;
    let $_iframe_switch;
    let $_current_bgColor;
    let $_CARD_SHOW;
    let $_SITE_SETTING;
    let $_trigger_nexus_pic;
    component_subscribe($$self, _iframe_url, ($$value) => $$invalidate(28, $_iframe_url = $$value));
    component_subscribe($$self, _iframe_switch, ($$value) => $$invalidate(29, $_iframe_switch = $$value));
    component_subscribe($$self, _current_bgColor, ($$value) => $$invalidate(9, $_current_bgColor = $$value));
    component_subscribe($$self, _CARD_SHOW, ($$value) => $$invalidate(10, $_CARD_SHOW = $$value));
    component_subscribe($$self, _SITE_SETTING, ($$value) => $$invalidate(11, $_SITE_SETTING = $$value));
    component_subscribe($$self, _trigger_nexus_pic, ($$value) => $$invalidate(12, $_trigger_nexus_pic = $$value));
    const auth = localStorage.getItem("auth") || "";
    const headers = {
      // Formdata 这里不能用下面这个 content-type
      // "Content-Type": "application/json;charset=UTF-8",
      // 这个才是 Formdata 该用的, 但是不如不加
      // 'Content-Type': 'multipart/form-data; charset=UTF-8',
      Authorization: auth
    };
    function fetchData(api, payload, func2) {
      if (!CONFIG.API[api]) {
        console.warn(`没有名为 ${api} 的 API 接口.`);
        return;
      }
      const url = location.origin + CONFIG.API[api].url;
      const method = CONFIG.API[api].method;
      fetch(url, { method, headers, body: payload }).then((response) => response.json()).then((data) => {
        func2(data);
      }).catch((error) => console.error(error));
    }
    window.fetchData = fetchData;
    function sort_masonry() {
      sortMasonry();
    }
    function showDetailIframe() {
      set_store_value(_iframe_switch, $_iframe_switch = 1, $_iframe_switch);
      set_store_value(_iframe_url, $_iframe_url = torrentInfo.torrentLink + "#kdescr", $_iframe_url);
      set_store_value(_iframe_url, $_iframe_url = `https://${location.host}/detail/` + torrentInfo.id, $_iframe_url);
    }
    let { index } = $$props;
    let { torrentInfo } = $$props;
    let { cardWidth } = $$props;
    const _discount = torrentInfo.status.discount;
    const _discountEndTime = torrentInfo.status.discountEndTime;
    const _discountText = { FREE: "免费", PERCENT_50: "50%" };
    const _discountCalcTime = () => {
      const now2 = /* @__PURE__ */ new Date();
      const end = new Date(_discountEndTime);
      const res = Math.floor((end.getTime() - now2.getTime()) / (1e3 * 3600));
      return res;
    };
    const _createdDate = torrentInfo.status.createdDate;
    const _createdCalcTime = () => {
      const now2 = /* @__PURE__ */ new Date();
      const then = new Date(_createdDate);
      const gap = now2.getTime() - then.getTime();
      const day = Math.floor(gap / (1e3 * 3600 * 24));
      const hour = Math.floor(gap % (1e3 * 3600 * 24) / (1e3 * 3600));
      return { day, hour };
    };
    const _CT = _createdCalcTime();
    function torrent_download() {
      const formdata2 = new FormData();
      formdata2.append("id", torrentInfo.id);
      fetchData("genDlToken", formdata2, (data) => {
        console.log(data);
        if (data.data)
          window.open(data.data, "_blank");
      });
    }
    let toppingLevelArray;
    if (torrentInfo.status.toppingLevel) {
      toppingLevelArray = Array(torrentInfo.status.toppingLevel).fill();
    }
    let collectionMark = Boolean(torrentInfo.collection);
    const formdata = new FormData();
    formdata.append("id", torrentInfo.id);
    formdata.append("make", !collectionMark);
    let promise2;
    function handleCollection() {
      $$invalidate(5, promise2 = fetchData("collection", formdata, collectionCallBack));
    }
    function collectionCallBack(data) {
      console.log(data);
      $$invalidate(4, collectionMark = !collectionMark);
    }
    let _hover = false;
    function card_show_detail() {
      $$invalidate(6, _hover = true);
      $$invalidate(
        8,
        thisDom.style.boxShadow = `
    ${_categoryColor ?? _defaultColor} 5px 5px 0px, 
    rgba(0, 0, 0, 0.1) -1px -1px 0px`,
        thisDom
      );
    }
    function card_hide_detail() {
      $$invalidate(6, _hover = false);
      $$invalidate(8, thisDom.style.boxShadow = "", thisDom);
    }
    let _picError = false;
    const _categoryColor = CONFIG.CATEGORY_COLOR[torrentInfo.category];
    let thisDom;
    const real_pic_normal = torrentInfo.imageList[0] ? torrentInfo.imageList[0] : "";
    const error_handler = () => {
      $$invalidate(7, _picError = true);
    };
    function div4_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        thisDom = $$value;
        $$invalidate(8, thisDom);
      });
    }
    $$self.$$set = ($$props2) => {
      if ("index" in $$props2)
        $$invalidate(2, index = $$props2.index);
      if ("torrentInfo" in $$props2)
        $$invalidate(0, torrentInfo = $$props2.torrentInfo);
      if ("cardWidth" in $$props2)
        $$invalidate(1, cardWidth = $$props2.cardWidth);
    };
    return [
      torrentInfo,
      cardWidth,
      index,
      toppingLevelArray,
      collectionMark,
      promise2,
      _hover,
      _picError,
      thisDom,
      $_current_bgColor,
      $_CARD_SHOW,
      $_SITE_SETTING,
      $_trigger_nexus_pic,
      sort_masonry,
      showDetailIframe,
      _discount,
      _discountEndTime,
      _discountText,
      _discountCalcTime,
      _CT,
      torrent_download,
      handleCollection,
      card_show_detail,
      card_hide_detail,
      _categoryColor,
      real_pic_normal,
      error_handler,
      div4_binding
    ];
  }
  class NewMteam extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$3, create_fragment$2, safe_not_equal, { index: 2, torrentInfo: 0, cardWidth: 1 }, null, [-1, -1]);
    }
  }
  function get_each_context(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[40] = list[i];
    child_ctx[42] = i;
    return child_ctx;
  }
  function create_if_block$1(ctx) {
    let div2;
    let div2_transition;
    let current;
    return {
      c() {
        div2 = element("div");
        div2.innerHTML = `<div class="loading_SubHolder svelte-11rmzun"><div class="loading_Text svelte-11rmzun">页面切换加载中...</div></div>`;
        attr(div2, "class", "loading_Holder svelte-11rmzun");
      },
      m(target, anchor) {
        insert(target, div2, anchor);
        current = true;
      },
      i(local) {
        if (current)
          return;
        add_render_callback(() => {
          if (!current)
            return;
          if (!div2_transition)
            div2_transition = create_bidirectional_transition(div2, fade, { duration: 600 }, true);
          div2_transition.run(1);
        });
        current = true;
      },
      o(local) {
        if (!div2_transition)
          div2_transition = create_bidirectional_transition(div2, fade, { duration: 600 }, false);
        div2_transition.run(0);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div2);
        if (detaching && div2_transition)
          div2_transition.end();
      }
    };
  }
  function create_each_block(key_1, ctx) {
    let first;
    let testmteam;
    let current;
    testmteam = new NewMteam({
      props: {
        index: (
          /*index*/
          ctx[42]
        ),
        torrentInfo: (
          /*info*/
          ctx[40]
        ),
        cardWidth: (
          /*CARD*/
          ctx[0].CARD_WIDTH
        )
      }
    });
    return {
      key: key_1,
      first: null,
      c() {
        first = empty();
        create_component(testmteam.$$.fragment);
        this.first = first;
      },
      m(target, anchor) {
        insert(target, first, anchor);
        mount_component(testmteam, target, anchor);
        current = true;
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        const testmteam_changes = {};
        if (dirty[0] & /*infoList*/
        8)
          testmteam_changes.index = /*index*/
          ctx[42];
        if (dirty[0] & /*infoList*/
        8)
          testmteam_changes.torrentInfo = /*info*/
          ctx[40];
        if (dirty[0] & /*CARD*/
        1)
          testmteam_changes.cardWidth = /*CARD*/
          ctx[0].CARD_WIDTH;
        testmteam.$set(testmteam_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(testmteam.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(testmteam.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(first);
        destroy_component(testmteam, detaching);
      }
    };
  }
  function create_fragment$1(ctx) {
    let div;
    let t;
    let each_blocks = [];
    let each_1_lookup = /* @__PURE__ */ new Map();
    let current;
    let if_block = !/*loading_hide*/
    ctx[1] && create_if_block$1();
    let each_value = (
      /*infoList*/
      ctx[3]
    );
    const get_key = (ctx2) => (
      /*info*/
      ctx2[40].id + /*index*/
      ctx2[42]
    );
    for (let i = 0; i < each_value.length; i += 1) {
      let child_ctx = get_each_context(ctx, each_value, i);
      let key = get_key(child_ctx);
      each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    }
    return {
      c() {
        div = element("div");
        if (if_block)
          if_block.c();
        t = space();
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        attr(div, "class", "svelte-11rmzun");
        toggle_class(div, "masonry_Holder_unload_1st", !/*loading_hide*/
        ctx[1] && /*loading_first*/
        ctx[2]);
        toggle_class(
          div,
          "masonry_Holder_loaded_1st",
          /*loading_hide*/
          ctx[1] && /*loading_first*/
          ctx[2]
        );
        toggle_class(div, "masonry_Holder_unloaded", !/*loading_hide*/
        ctx[1] && !/*loading_first*/
        ctx[2]);
        toggle_class(
          div,
          "masonry_Holder_loaded",
          /*loading_hide*/
          ctx[1] && !/*loading_first*/
          ctx[2]
        );
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if (if_block)
          if_block.m(div, null);
        append(div, t);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(div, null);
          }
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (!/*loading_hide*/
        ctx2[1]) {
          if (if_block) {
            if (dirty[0] & /*loading_hide*/
            2) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block$1();
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(div, t);
          }
        } else if (if_block) {
          group_outros();
          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });
          check_outros();
        }
        if (dirty[0] & /*infoList, CARD*/
        9) {
          each_value = /*infoList*/
          ctx2[3];
          group_outros();
          each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block, null, get_each_context);
          check_outros();
        }
        if (!current || dirty[0] & /*loading_hide, loading_first*/
        6) {
          toggle_class(div, "masonry_Holder_unload_1st", !/*loading_hide*/
          ctx2[1] && /*loading_first*/
          ctx2[2]);
        }
        if (!current || dirty[0] & /*loading_hide, loading_first*/
        6) {
          toggle_class(
            div,
            "masonry_Holder_loaded_1st",
            /*loading_hide*/
            ctx2[1] && /*loading_first*/
            ctx2[2]
          );
        }
        if (!current || dirty[0] & /*loading_hide, loading_first*/
        6) {
          toggle_class(div, "masonry_Holder_unloaded", !/*loading_hide*/
          ctx2[1] && !/*loading_first*/
          ctx2[2]);
        }
        if (!current || dirty[0] & /*loading_hide, loading_first*/
        6) {
          toggle_class(
            div,
            "masonry_Holder_loaded",
            /*loading_hide*/
            ctx2[1] && !/*loading_first*/
            ctx2[2]
          );
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        for (let i = 0; i < each_value.length; i += 1) {
          transition_in(each_blocks[i]);
        }
        current = true;
      },
      o(local) {
        transition_out(if_block);
        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div);
        if (if_block)
          if_block.d();
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].d();
        }
      }
    };
  }
  function instance$2($$self, $$props, $$invalidate) {
    let $_list_viewMode;
    let $_Global_Masonry;
    let $_card_layout;
    let $_animated;
    let $_current_domain;
    let $_turnPage;
    let $_current_bgColor;
    component_subscribe($$self, _list_viewMode, ($$value) => $$invalidate(12, $_list_viewMode = $$value));
    component_subscribe($$self, _Global_Masonry, ($$value) => $$invalidate(13, $_Global_Masonry = $$value));
    component_subscribe($$self, _card_layout, ($$value) => $$invalidate(8, $_card_layout = $$value));
    component_subscribe($$self, _animated, ($$value) => $$invalidate(9, $_animated = $$value));
    component_subscribe($$self, _current_domain, ($$value) => $$invalidate(14, $_current_domain = $$value));
    component_subscribe($$self, _turnPage, ($$value) => $$invalidate(15, $_turnPage = $$value));
    component_subscribe($$self, _current_bgColor, ($$value) => $$invalidate(16, $_current_bgColor = $$value));
    let { waterfallNode } = $$props;
    let { waterfallParentNode } = $$props;
    let { update_ORIGIN_TL_Node } = $$props;
    const affix = location.origin.match(/\.([^.]+)$/)[0];
    const _searchApiURL_generate = "https://api.m-team" + affix + "/api" + CONFIG.API.search.url;
    const _searchApiURL_localStorage = localStorage.getItem("apiHost") + CONFIG.API.search.url;
    const searchApiURL = _searchApiURL_localStorage || _searchApiURL_generate;
    window.NEXUS_TOOLS = NEXUS_TOOLS;
    let masonry2;
    let loading_hide = false;
    let loading_first = true;
    waterfallParentNode.style.height = "116px";
    set_store_value(_current_domain, $_current_domain = GET_CURRENT_PT_DOMAIN(), $_current_domain);
    const bgColor = GET_SITE_BACKGROUND_COLOR();
    set_store_value(_current_bgColor, $_current_bgColor = bgColor, $_current_bgColor);
    console.log("背景颜色:", bgColor);
    const originSelector = GET_TORRENT_LIST_SELECTOR();
    function ChangeShowMode() {
      const _$_ORIGIN_TL_Node = document.querySelector(originSelector);
      const _$nextPageNode = document.querySelector(".nextPage");
      const _$waterfallNode = document.querySelector(".waterfall.waterfall_newMT");
      if (_$_ORIGIN_TL_Node)
        _$_ORIGIN_TL_Node.style.display = $_list_viewMode ? "none" : "block";
      _$nextPageNode.style.display = $_list_viewMode ? "block" : "none";
      _$waterfallNode.style.display = $_list_viewMode ? "block" : "none";
    }
    function CHANGE_CARD_LAYOUT() {
      ChangeShowMode();
      resizeMasonry($_card_layout.column, $_card_layout.gap);
      sortMasonry("fast");
      sortMasonry("fast");
    }
    window.CHANGE_CARD_LAYOUT = CHANGE_CARD_LAYOUT;
    function resizeMasonry(columns, gutter = 10) {
      if (columns <= 1 || gutter <= 1) {
        console.warn("卡片列数或卡片间隔过小, 列数不小于2, 间隔不小于1");
        return;
      }
      const widthContainer = document.querySelector("div.waterfall").clientWidth;
      const widthCard = (widthContainer - (columns - 1) * gutter) / columns;
      Array.from(document.querySelectorAll(".card")).forEach((el) => el.style.width = widthCard + "px");
      if (masonry2) {
        $$invalidate(7, masonry2.options.columnWidth = widthCard, masonry2);
        $$invalidate(7, masonry2.options.gutter = gutter, masonry2);
        masonry2.layout();
      }
      return widthCard;
    }
    let infoList = [];
    const auth = localStorage.getItem("auth") || "";
    const headers = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: auth
    };
    function RequestExample() {
      console.log("当前页面 path:	", location.pathname);
      let pageSize = getPageSize();
      const payload = { pageNumber: 1, pageSize, visible: 1 };
      Object.assign(payload, UrlPath_2_ParamList());
      console.log(payload);
      fetch(searchApiURL, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      }).then((response) => response.json()).then((data) => {
        console.log(data);
        const list = data.data.data;
        $$invalidate(3, infoList = [...list]);
      }).then(() => {
        var _a;
        PAGE.$setPage(payload.pageNumber);
        masonry2.reloadItems();
        $$invalidate(2, loading_first = false);
        $$invalidate(1, loading_hide = true);
        $$invalidate(4, waterfallParentNode.style.height = "auto", waterfallParentNode);
        masonry2.once("layoutComplete", () => {
          NEXUS_TOOLS();
        });
        (_a = SITE[$_current_domain]) == null ? void 0 : _a.special();
      }).catch((error) => {
        console.error("网络请求错误:", error);
      });
    }
    function Request(payload, successCallback = null) {
      console.log("当前页面 path:	", location.pathname);
      fetch(searchApiURL, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      }).then((response) => response.json()).then((data) => {
        console.log(data);
        const list = data.data.data;
        $$invalidate(3, infoList = [...list]);
      }).then(() => {
        masonry2.reloadItems();
        $$invalidate(1, loading_hide = true);
        masonry2.once("layoutComplete", () => {
          NEXUS_TOOLS();
        });
        if (successCallback)
          successCallback();
      }).catch((error) => {
        console.error("网络请求错误:", error);
      });
    }
    function getPageSize(defaultNum = 100) {
      const sysinfo = parseLocalStorage("persist:persist").sysinfo;
      if (!sysinfo.pageSize)
        return defaultNum;
      if (!sysinfo.pageSize.torrent)
        return defaultNum;
      return Number(sysinfo.pageSize.torrent);
    }
    function UrlPath_2_ParamList(path = location.href) {
      let url = path;
      if (path.indexOf("/browse") == 0) {
        url = location.origin + path;
      }
      console.log(`url 补全: ${url}`);
      let urlObject = new URL(url);
      let mode = urlObject.pathname.split("/")[2];
      let categories = urlObject.searchParams.getAll("cat");
      let standards = urlObject.searchParams.getAll("stand");
      let pageNumber = Number(urlObject.searchParams.get("pageNumber")) || 1;
      let pageSize = getPageSize(100);
      let sortParam = urlObject.searchParams.get("sort");
      let onlyFav = Number(urlObject.searchParams.get("onlyFav"));
      let output = {};
      if (mode)
        output.mode = mode;
      else
        output.mode = "normal";
      if (categories)
        output.categories = categories;
      if (standards.length)
        output.standards = standards;
      if (pageNumber)
        output.pageNumber = pageNumber;
      if (pageSize)
        output.pageSize = pageSize;
      if (onlyFav)
        output.onlyFav = onlyFav;
      if (sortParam) {
        let field = sortParam.split(":")[0].toUpperCase();
        if (field.includes("DATE"))
          output.sortField = "CREATED_DATE";
        if (field.includes("SIZE"))
          output.sortField = "SIZE";
        if (field.includes("SEEDER"))
          output.sortField = "SEEDERS";
        if (field.includes("LEECHER"))
          output.sortField = "LEECHERS";
        if (field.includes("TIME"))
          output.sortField = "TIMES_COMPLETED";
        let direction = sortParam.split(":")[1].toUpperCase();
        if (direction.includes("ASC"))
          output.sortDirection = "ASC";
        if (direction.includes("DESC"))
          output.sortDirection = "DESC";
      }
      return output;
    }
    const originalPushState = history.pushState;
    function OverWritePushState() {
      history.pushState = function(state, title, path) {
        $$invalidate(1, loading_hide = false);
        console.log(`%c ====> URL跳转劫持: %c${path}`, "color: cyan", "color: white");
        if (path.includes("/browse") || path == "/browse") {
          console.log("--->属于 browse 范围, search 启动");
          $$invalidate(4, waterfallParentNode.style.display = "block", waterfallParentNode);
          const searchApiList = UrlPath_2_ParamList(path);
          const pageSizeParam = getPageSize();
          const payload = {
            pageNumber: 1,
            pageSize: pageSizeParam,
            visible: 1
          };
          Object.assign(payload, searchApiList);
          console.log(payload);
          Request(payload, () => {
            var _a;
            PAGE.$setPage(payload.pageNumber);
            update_ORIGIN_TL_Node();
            let res = (_a = SITE[$_current_domain]) == null ? void 0 : _a.special();
            let count = 0;
            intervalID = setInterval(
              () => {
                var _a2;
                if (res) {
                  clearInterval(intervalID);
                  console.log(`触发特殊次数: [${count}]`);
                }
                count += 1;
                res = (_a2 = SITE[$_current_domain]) == null ? void 0 : _a2.special();
                if (res) {
                  clearInterval(intervalID);
                  console.log(`触发特殊次数: [${count}]`);
                }
                if (count >= 5) {
                  clearInterval(intervalID);
                  console.log("======> 触发特殊次数: [${count}] setInterval 已取消. <======");
                }
              },
              1e3
            );
          });
          ChangeShowMode();
        } else {
          $$invalidate(4, waterfallParentNode.style.display = "none", waterfallParentNode);
          document.querySelector(originSelector).style.display = "block";
        }
        originalPushState.apply(history, arguments);
      };
    }
    PAGE.$setPage(1);
    let debounceLoad;
    debounceLoad = debounceImmediate(loadNextPage, PAGE.GAP);
    const scrollDOM = document.querySelector(".ant-layout");
    function scan_and_launch() {
      const scrollHeight = scrollDOM.scrollHeight;
      const clientHeight = scrollDOM.clientHeight;
      const scrollTop = scrollDOM.scrollTop || scrollDOM.scrollTop;
      if (scrollTop + clientHeight >= scrollHeight - PAGE.DISTANCE_newMT) {
        if ($_turnPage) {
          debounceLoad();
        } else {
          console.log("加载模式: 按钮");
        }
        sortMasonry();
      }
    }
    function loadNextPage() {
      const payload = {
        pageNumber: PAGE.$getCurrentPage() + 1,
        pageSize: getPageSize(),
        visible: 1
      };
      Object.assign(payload, UrlPath_2_ParamList());
      Object.assign(payload, { pageNumber: PAGE.$getCurrentPage() + 1 });
      console.log(payload);
      fetch(searchApiURL, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      }).then((response) => response.json()).then((data) => {
        console.log(data);
        const list = data.data.data;
        $$invalidate(3, infoList = [...infoList, ...list]);
      }).then(() => {
        masonry2.reloadItems();
        masonry2.once("layoutComplete", () => {
          NEXUS_TOOLS();
        });
        PAGE.$turnPage();
      }).catch((error) => {
        console.error("网络请求错误:", error);
      });
    }
    function turnPage() {
      if (!$_turnPage)
        debounceLoad();
    }
    window.$$$turnPage = turnPage;
    let intervalID;
    function observerDomChange() {
      console.log("------------------OB START------------------");
      let attempts = 0;
      const maxAttempts = 10;
      const interval = 2e3;
      const findTargetElement = () => {
        attempts++;
        const targetElement = document.querySelector(".ant-spin-container");
        if (targetElement) {
          console.log(`<special> 第 ${attempts} 次找到目标元素，开始监视...`);
          startObserving(targetElement);
        } else if (attempts < maxAttempts) {
          console.log(`<special> 第 ${attempts} 次未找到目标元素，继续尝试...`);
          setTimeout(findTargetElement, interval);
        } else {
          console.warn("<special> 未找到 .ant-spin-container, M-Team 特殊函数失效");
        }
      };
      const startObserving = (targetElement) => {
        const observer = new MutationObserver((mutationsList, observer2) => {
          mutationsList.forEach((mutation) => {
            var _a;
            if (mutation.type === "childList" || mutation.type === "attributes") {
              console.log("<special> <-- 原表格 DOM 发生了变化 -->");
              (_a = SITE[$_current_domain]) == null ? void 0 : _a.special();
            }
          });
        });
        const config = {
          attributes: true,
          childList: true,
          subtree: false
        };
        observer.observe(targetElement, config);
      };
      findTargetElement();
    }
    onMount(() => {
      $$invalidate(7, masonry2 = new Masonry(
        waterfallNode,
        {
          itemSelector: ".card",
          columnWidth: resizeMasonry($_card_layout.column, $_card_layout.gap),
          gutter: $_card_layout.gap,
          // transitions Duration 默认值为 0.4
          transitionDuration: $_animated ? 0.4 : 0
        }
      ));
      resizeMasonry($_card_layout.column, $_card_layout.gap);
      window.masonry = masonry2;
      set_store_value(_Global_Masonry, $_Global_Masonry = masonry2, $_Global_Masonry);
      masonry2.layout("fast");
      masonry2.layout("fast");
      waterfallNode.addEventListener("click", (event) => {
        if (event.target === event.currentTarget) {
          if (masonry2)
            masonry2.layout();
          console.log("Masonry 已整理~");
        }
      });
      scrollDOM.addEventListener("scroll", function() {
        if ($_list_viewMode)
          scan_and_launch();
      });
      RequestExample();
      OverWritePushState();
      observerDomChange();
    });
    onDestroy(() => {
      if (intervalID)
        clearInterval(intervalID);
    });
    $$self.$$set = ($$props2) => {
      if ("waterfallNode" in $$props2)
        $$invalidate(5, waterfallNode = $$props2.waterfallNode);
      if ("waterfallParentNode" in $$props2)
        $$invalidate(4, waterfallParentNode = $$props2.waterfallParentNode);
      if ("update_ORIGIN_TL_Node" in $$props2)
        $$invalidate(6, update_ORIGIN_TL_Node = $$props2.update_ORIGIN_TL_Node);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty[0] & /*masonry, $_animated*/
      640) {
        {
          if (masonry2)
            $$invalidate(7, masonry2.options.transitionDuration = $_animated ? "0.4s" : "0", masonry2);
        }
      }
      if ($$self.$$.dirty[0] & /*masonry, $_card_layout, CARD*/
      385) {
        if (masonry2) {
          $$invalidate(0, CARD.CARD_WIDTH = resizeMasonry($_card_layout.column, $_card_layout.gap), CARD);
          console.log("卡片宽度:	", CARD.CARD_WIDTH);
          CHANGE_CARD_LAYOUT();
        }
      }
    };
    return [
      CARD,
      loading_hide,
      loading_first,
      infoList,
      waterfallParentNode,
      waterfallNode,
      update_ORIGIN_TL_Node,
      masonry2,
      $_card_layout,
      $_animated
    ];
  }
  class Index_newMT extends SvelteComponent {
    constructor(options) {
      super();
      init(
        this,
        options,
        instance$2,
        create_fragment$1,
        safe_not_equal,
        {
          waterfallNode: 5,
          waterfallParentNode: 4,
          update_ORIGIN_TL_Node: 6
        },
        null,
        [-1, -1]
      );
    }
  }
  const { window: window_1 } = globals;
  function create_if_block(ctx) {
    let div2;
    let div1;
    let iframe;
    let iframe_src_value;
    let t;
    let div0;
    let iconroundclose;
    let div2_transition;
    let current;
    let mounted;
    let dispose;
    iconroundclose = new Icon_roundClose({});
    return {
      c() {
        div2 = element("div");
        div1 = element("div");
        iframe = element("iframe");
        t = space();
        div0 = element("div");
        create_component(iconroundclose.$$.fragment);
        if (!src_url_equal(iframe.src, iframe_src_value = /*$_iframe_url*/
        ctx[2]))
          attr(iframe, "src", iframe_src_value);
        attr(iframe, "frameborder", "0");
        attr(iframe, "title", "wow");
        set_style(iframe, "width", (SITE[
          /*$_current_domain*/
          ctx[3]
        ] ? SITE[
          /*$_current_domain*/
          ctx[3]
        ].Iframe_Width : 1e3) + "px");
        attr(iframe, "class", "svelte-1exar3b");
        attr(div0, "class", "_iframeCloseBtn svelte-1exar3b");
        attr(div1, "class", "_iframe svelte-1exar3b");
        attr(div2, "id", "_iframe");
        attr(div2, "class", "svelte-1exar3b");
      },
      m(target, anchor) {
        insert(target, div2, anchor);
        append(div2, div1);
        append(div1, iframe);
        ctx[7](iframe);
        append(div1, t);
        append(div1, div0);
        mount_component(iconroundclose, div0, null);
        current = true;
        if (!mounted) {
          dispose = [
            listen(
              iframe,
              "load",
              /*iframeJump2Info*/
              ctx[5]
            ),
            listen(
              div0,
              "click",
              /*toggleIframe*/
              ctx[4]
            ),
            listen(
              div2,
              "click",
              /*toggleIframe*/
              ctx[4]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (!current || dirty & /*$_iframe_url*/
        4 && !src_url_equal(iframe.src, iframe_src_value = /*$_iframe_url*/
        ctx2[2])) {
          attr(iframe, "src", iframe_src_value);
        }
        if (!current || dirty & /*$_current_domain*/
        8) {
          set_style(iframe, "width", (SITE[
            /*$_current_domain*/
            ctx2[3]
          ] ? SITE[
            /*$_current_domain*/
            ctx2[3]
          ].Iframe_Width : 1e3) + "px");
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(iconroundclose.$$.fragment, local);
        add_render_callback(() => {
          if (!current)
            return;
          if (!div2_transition)
            div2_transition = create_bidirectional_transition(div2, fade, { duration: 300 }, true);
          div2_transition.run(1);
        });
        current = true;
      },
      o(local) {
        transition_out(iconroundclose.$$.fragment, local);
        if (!div2_transition)
          div2_transition = create_bidirectional_transition(div2, fade, { duration: 300 }, false);
        div2_transition.run(0);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div2);
        ctx[7](null);
        destroy_component(iconroundclose);
        if (detaching && div2_transition)
          div2_transition.end();
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_fragment(ctx) {
    let if_block_anchor;
    let current;
    let mounted;
    let dispose;
    let if_block = (
      /*$_iframe_switch*/
      ctx[1] && create_if_block(ctx)
    );
    return {
      c() {
        if (if_block)
          if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if (if_block)
          if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;
        if (!mounted) {
          dispose = listen(
            window_1,
            "keydown",
            /*key_closePanels*/
            ctx[6],
            true
          );
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (
          /*$_iframe_switch*/
          ctx2[1]
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
            if (dirty & /*$_iframe_switch*/
            2) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block(ctx2);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          group_outros();
          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (if_block)
          if_block.d(detaching);
        if (detaching)
          detach(if_block_anchor);
        mounted = false;
        dispose();
      }
    };
  }
  function getDOMElement(selector2, maxRetries = 5, interval = 200, func2 = (el) => {
  }) {
    const element2 = document.querySelector(selector2);
    if (element2) {
      func2(element2);
      return element2;
    }
    if (maxRetries > 0) {
      setTimeout(
        () => {
          getDOMElement(selector2, maxRetries - 1, interval, func2);
        },
        interval
      );
    } else {
      console.log(`无法找到元素: ${selector2}`);
    }
  }
  function instance$1($$self, $$props, $$invalidate) {
    let $_show_configPanel;
    let $_iframe_switch;
    let $_list_viewMode;
    let $_iframe_url;
    let $_current_domain;
    component_subscribe($$self, _show_configPanel, ($$value) => $$invalidate(13, $_show_configPanel = $$value));
    component_subscribe($$self, _iframe_switch, ($$value) => $$invalidate(1, $_iframe_switch = $$value));
    component_subscribe($$self, _list_viewMode, ($$value) => $$invalidate(14, $_list_viewMode = $$value));
    component_subscribe($$self, _iframe_url, ($$value) => $$invalidate(2, $_iframe_url = $$value));
    component_subscribe($$self, _current_domain, ($$value) => $$invalidate(3, $_current_domain = $$value));
    console.log(`[${( new Date()).toLocaleTimeString()}]<----------------------HMR_NewMT---------------------->`);
    let _ORIGIN_TL_Node = document.querySelector(GET_TORRENT_LIST_SELECTOR());
    window._ORIGIN_TL_Node = _ORIGIN_TL_Node;
    function update_ORIGIN_TL_Node() {
      console.log("--------> 更新 _ORIGIN_TL_Node");
      if (document.querySelector(GET_TORRENT_LIST_SELECTOR()) != _ORIGIN_TL_Node) {
        console.log("--------> 已替换 _ORIGIN_TL_Node");
        _ORIGIN_TL_Node = document.querySelector(GET_TORRENT_LIST_SELECTOR());
        _ORIGIN_TL_Node.style.display = $_list_viewMode ? "none" : "block";
      }
    }
    let iframeDom;
    function toggleIframe() {
      set_store_value(_iframe_switch, $_iframe_switch = 0, $_iframe_switch);
    }
    function iframeJump2Info() {
      let count = 0;
      let error_count = 0;
      let dom_trigger;
      intervalID = setInterval(
        () => {
          var _a;
          try {
            const dom = (_a = iframeDom == null ? void 0 : iframeDom.contentDocument) == null ? void 0 : _a.querySelector(".app-content__inner");
            count += 1;
            dom_trigger = iframeDom.contentDocument.querySelector(".ant-descriptions-view .ant-descriptions-item-label span");
            if (dom) {
              dom.scrollIntoView();
            }
            console.log(` iframeJump2Info ==> 轮询次数: [${count}] 轮询文本: [${dom_trigger.textContent}] 轮询长度: [${dom_trigger.textContent.length}] -----`);
          } catch (error) {
            error_count++;
            console.warn(`DOM丢失: ${error_count}`);
            if (error_count >= 5) {
              clearInterval(intervalID);
              console.log("------> setInterval 已取消, 请忽略 DOM 丢失的 Errors & Warns. <------");
            }
          }
          if (dom_trigger.textContent.length)
            clearInterval(intervalID);
        },
        500
      );
    }
    let intervalID;
    onDestroy(() => {
      clearInterval(intervalID);
    });
    function key_closePanels(event) {
      if (event.key === "Escape") {
        console.log(event);
        set_store_value(_iframe_switch, $_iframe_switch = 0, $_iframe_switch);
        set_store_value(_show_configPanel, $_show_configPanel = false, $_show_configPanel);
      }
    }
    while (!Masonry) {
      console.log("等待初始化......");
    }
    let waterfallNode;
    let waterfallParentNode;
    let nextPageNode;
    getDOMElement(".ant-card.ant-card-small", 5, 200, (_stateBar) => {
      const parentNode = _stateBar.parentNode;
      waterfallNode = document.createElement("div");
      waterfallNode.classList.add("waterfall");
      waterfallNode.classList.add("waterfall_newMT");
      waterfallParentNode = document.createElement("div");
      waterfallParentNode.classList.add("waterfallParent");
      waterfallParentNode.append(waterfallNode);
      parentNode.insertBefore(waterfallParentNode, _stateBar.nextSibling);
      nextPageNode = document.createElement("div");
      nextPageNode.classList.add("nextPage");
      waterfallParentNode.append(nextPageNode);
      new Sidepanel({ target: document.body });
      new Index_newMT({
        target: waterfallNode,
        props: {
          // 传递给组件的属性
          // 瀑布流DOM & 瀑布流父DOM
          waterfallNode,
          waterfallParentNode,
          // 原列表DOM
          // _ORIGIN_TL_Node,
          // 重置原列表节点DOM函数
          update_ORIGIN_TL_Node
        }
      });
      new BtnTurnPage({ target: nextPageNode });
    });
    function iframe_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        iframeDom = $$value;
        $$invalidate(0, iframeDom);
      });
    }
    return [
      iframeDom,
      $_iframe_switch,
      $_iframe_url,
      $_current_domain,
      toggleIframe,
      iframeJump2Info,
      key_closePanels,
      iframe_binding
    ];
  }
  class Main_newMT extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$1, create_fragment, safe_not_equal, {});
    }
  }
  function instance($$self, $$props, $$invalidate) {
    let $_SITE_SETTING;
    component_subscribe($$self, _SITE_SETTING, ($$value) => $$invalidate(3, $_SITE_SETTING = $$value));
    function showSideBar() {
      set_store_value(_SITE_SETTING, $_SITE_SETTING.mt.path_in_browse = true, $_SITE_SETTING);
    }
    function hideSideBar() {
      set_store_value(_SITE_SETTING, $_SITE_SETTING.mt.path_in_browse = false, $_SITE_SETTING);
    }
    let app2;
    if (location.pathname.includes("/browse") || location.pathname == "/browse") {
      get_store_value(_SITE_SETTING).mt.path_in_browse = true;
    }
    if (location.pathname.includes("/browse")) {
      if (!app2) {
        app2 = new Main_newMT({
          target: (() => {
            const app3 = document.createElement("div");
            document.body.append(app3);
            return app3;
          })()
        });
      }
    }
    const originalPushState = history.pushState;
    history.pushState = hijackPushState;
    function hijackPushState(state, title, path) {
      console.log(`%c [main] ====> URL跳转劫持: %c${path}`, "color: green", "color: white");
      if (path.includes("/browse") || path == "/browse") {
        let tmp = get_store_value(_SITE_SETTING);
        tmp.mt.path_in_browse = true;
        _SITE_SETTING.set(tmp);
        console.log("侧边栏: ", get_store_value(_SITE_SETTING).mt.path_in_browse);
        if (!app2) {
          app2 = new Main_newMT({
            target: (() => {
              const app3 = document.createElement("div");
              document.body.append(app3);
              return app3;
            })()
          });
        }
      } else {
        let tmp = get_store_value(_SITE_SETTING);
        tmp.mt.path_in_browse = false;
        _SITE_SETTING.set(tmp);
        console.log("侧边栏: ", get_store_value(_SITE_SETTING).mt.path_in_browse);
      }
      originalPushState.apply(history, arguments);
    }
    return [showSideBar, hideSideBar];
  }
  class AfterMain_newMT extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance, null, safe_not_equal, { showSideBar: 0, hideSideBar: 1 });
    }
    get showSideBar() {
      return this.$$.ctx[0];
    }
    get hideSideBar() {
      return this.$$.ctx[1];
    }
  }
  console.log("________PT-TorrentList-Masonry________");
  if (GET_SITE_ARCHITECTURE() == "NEW_MT") {
    new AfterMain_newMT({
      target: (() => {
        const app2 = document.createElement("div");
        document.body.append(app2);
        return app2;
      })()
    });
  } else {
    const list_selector = GET_TORRENT_LIST_SELECTOR();
    const _ORIGIN_TL_Node = document.querySelector(list_selector);
    if (list_selector && !!_ORIGIN_TL_Node) {
      new Main({
        target: (() => {
          const app2 = document.createElement("div");
          document.body.append(app2);
          return app2;
        })()
      });
    } else {
      console.log("未识别到种子列表捏~");
    }
  }

})();
