// ==UserScript==
// @name            PT种子列表瀑布流视图(Svelte重构)
// @name:en         PT_Masonry_View_Svelte
// @namespace       https://github.com/KesaubeEire/PT_Masonry_View_Svelte
// @version         1.2.9b
// @author          Kesa
// @description     PT种子列表无限下拉瀑布流视图(Svelte重构) [M-Team数据源: 劫持站点自身请求(原作者逻辑)]
// @description:en  PT Masonry View by Svelte.
// @license         MIT
// @icon            https://avatars.githubusercontent.com/u/23617963
// @match           https://kamept.com/*
// @match           https://www.pttime.org/*
// @match           https://pttime.org/*
// @match           https://www.nicept.net/*
// @match           https://www.ptfans.cc/*
// @match           https://ptfans.cc/*
// @match           https://kp.m-team.cc/*
// @match           https://xp.m-team.cc/*
// @match           https://ap.m-team.cc/*
// @match           https://test2.m-team.cc/*
// @match           https://mua.xloli.cc/*
// @exclude         */offers.php*
// @exclude         */index.php*
// @exclude         */forums.php*
// @exclude         */viewrequests.php*
// @exclude         */seek.php*
// @exclude         *m-team*/detail/*
// @exclude         */detail/*
// @exclude         *details.php*
// @exclude         *preview.php*
// @exclude         *torrent-details*
// @grant           GM_addStyle
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_xmlhttpRequest
// @run-at          document-start
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const t=document.createElement("style");t.textContent=e,document.head.append(t)})(' div.waterfall{width:100%;padding-top:20px;padding-bottom:60px;border-radius:20px;height:100%;margin:20px auto;transition:height .3s}button.debug{position:fixed;top:10px;right:10px;padding:4px;background-color:#333;color:#fff;border:none;border-radius:5px;cursor:pointer}button#toggle_oldTable{top:10px}button#btnReLayout{top:40px}button#btnSwitchMode{top:70px}button#sort_masonry{top:100px}.switch.svelte-2vaqag.svelte-2vaqag{width:100%;height:30px;display:flex;align-items:center;justify-content:space-between}.s_title.svelte-2vaqag.svelte-2vaqag{display:flex;align-items:center;font-size:14px;position:relative}.title_green.svelte-2vaqag.svelte-2vaqag{color:green;font-weight:800}.title_red.svelte-2vaqag.svelte-2vaqag{color:red;font-weight:800}.s_title.svelte-2vaqag:has(.hint):hover ._hint.svelte-2vaqag{display:block}._hint.svelte-2vaqag.svelte-2vaqag{display:none;position:absolute;bottom:28px;left:0;width:max-content;height:auto;background-color:#fff;border:1px solid black;border-radius:8px;padding:4px 8px;box-sizing:content-box;z-index:1}input[type=checkbox].svelte-2vaqag.svelte-2vaqag{width:0px;height:0px;display:none;visibility:hidden}label.svelte-2vaqag.svelte-2vaqag{width:48px;height:12px;display:inline-block;position:relative;background-color:#777;border:2px solid #555;border-radius:30px;transition:all .2s}label.svelte-2vaqag.svelte-2vaqag:after{content:"";display:block;width:24px;height:24px;background-color:#555;position:absolute;border-radius:50%;left:-2px;top:-6px;transition:transform .2s}input[type=checkbox].svelte-2vaqag:checked~label.svelte-2vaqag{background-color:#00a0fc;border-color:#006dc9}input[type=checkbox].svelte-2vaqag:checked~label.svelte-2vaqag:after{background-color:#0054b0;transform:translate(28px)}.sideP.svelte-mdsgbd.svelte-mdsgbd{position:fixed;opacity:.4;margin:4px 2px;border-radius:8px;overflow:hidden;z-index:40000;border:2px solid transparent}.sideP.svelte-mdsgbd.svelte-mdsgbd:hover{opacity:1;border:2px solid yellow}.sideP__title.svelte-mdsgbd.svelte-mdsgbd{width:100%;height:8px;background-color:#ff0}.sideP__title.svelte-mdsgbd.svelte-mdsgbd:hover{cursor:move}.sideP__out.svelte-mdsgbd.svelte-mdsgbd{display:flex;flex-direction:column}.sideP__btn.svelte-mdsgbd.svelte-mdsgbd{background-color:gray;color:#fff;padding:4px 8px;margin:4px;border-radius:8px;cursor:pointer;border:none}.sideP__btn.svelte-mdsgbd.svelte-mdsgbd:hover{background-color:#6531ff}.configP.svelte-mdsgbd.svelte-mdsgbd{position:fixed;left:0;top:0;width:100vw;height:100vh;padding:0;margin:0;z-index:50000;background-color:#0003}.configP_holder.svelte-mdsgbd.svelte-mdsgbd{position:absolute;right:20px;top:20px;overflow-y:scroll;width:360px;max-height:calc(100vh - 40px);padding:0;margin:0;border-radius:24px;border:2px solid black;background-color:#d4e7ff}.configP_holder.svelte-mdsgbd.svelte-mdsgbd::-webkit-scrollbar{display:none}.configP_title.svelte-mdsgbd.svelte-mdsgbd{position:fixed;box-sizing:border-box;width:inherit;display:flex;justify-content:space-between;align-items:center;height:40px;padding:0 10px;border-top-left-radius:24px;border-top-right-radius:24px;border-bottom:2px solid black;background-color:#9ac6ff;z-index:2}.configP_title.svelte-mdsgbd.svelte-mdsgbd p{font-size:18px;font-weight:500}.configP_title.svelte-mdsgbd.svelte-mdsgbd button{border:none;padding:0;margin:0;background-color:transparent}.section.svelte-mdsgbd.svelte-mdsgbd{margin:16px 18px}.section.svelte-mdsgbd.svelte-mdsgbd button{border-radius:10px;margin:4px;padding:12px 16px}.section.svelte-mdsgbd.svelte-mdsgbd .s_title{text-align:center}.section.svelte-mdsgbd.svelte-mdsgbd .s_panel{display:flex;flex-direction:column;justify-content:space-evenly;align-items:center}.section.svelte-mdsgbd.svelte-mdsgbd .s_checkbox{padding:12px;margin:4px;border-radius:10px;border:1px solid black;font-size:14px;display:flex;align-items:center}.configP_holder.svelte-mdsgbd .section.svelte-mdsgbd:nth-child(2){margin-top:48px}#reset_panel_pos.svelte-mdsgbd.svelte-mdsgbd{width:100%;text-align:center;border:1px solid black;border-radius:16px}.card.svelte-xrdclb.svelte-xrdclb{border:1px solid rgba(255,255,255,.5);border-radius:16px;margin:6px 0;overflow:hidden;cursor:pointer;box-shadow:#0000004d 3px 3px,#0000001a -1px -1px;transition:box-shadow .2s}.card.svelte-xrdclb.svelte-xrdclb:hover{box-shadow:#7300ff4d 5px 5px,#0000001a -1px -1px}.card-title.svelte-xrdclb.svelte-xrdclb{padding:2px 0}.card-holder.svelte-xrdclb.svelte-xrdclb{background-color:#ffffff80;background:linear-gradient(to bottom,rgba(255,255,255,.4),rgba(255,255,255,0))}.card-category.svelte-xrdclb.svelte-xrdclb{text-align:center;letter-spacing:2px;font-weight:700;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.card-line.svelte-xrdclb.svelte-xrdclb{margin-top:1px;margin-bottom:1px;display:flex;justify-content:space-evenly;align-items:center;height:20px}.two-lines.svelte-xrdclb.svelte-xrdclb{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;transition:color .3s}.two-lines.svelte-xrdclb.svelte-xrdclb:hover{-webkit-line-clamp:100}.cl-tags.svelte-xrdclb.svelte-xrdclb{display:flex;justify-content:left;align-items:center;flex-wrap:wrap;gap:2px;transform:translate(4px);padding-top:2px}._tag.svelte-xrdclb.svelte-xrdclb{height:1.3em;line-height:1.3em;padding:0 .5em;border-radius:6px;font-size:12px;color:#fff}._tag_diy.svelte-xrdclb.svelte-xrdclb{background-color:#5abd48}._tag_dub.svelte-xrdclb.svelte-xrdclb{background-color:#5a3b14}._tag_sub.svelte-xrdclb.svelte-xrdclb{background-color:#3b4a7f}.card-details.svelte-xrdclb.svelte-xrdclb{display:flex;justify-content:center;align-items:center;flex-direction:column}.card-image.svelte-xrdclb.svelte-xrdclb{height:100%;position:relative}.card-image.svelte-xrdclb img.svelte-xrdclb{width:100%;object-fit:cover}.pic_error.svelte-xrdclb.svelte-xrdclb{width:100%;height:100%;min-height:140px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:13px;color:#999;background-color:#0000000f;padding:8px;box-sizing:border-box}.card-discount.svelte-xrdclb.svelte-xrdclb{position:absolute;top:4px;right:4px;z-index:2;padding:0 6px;border-radius:6px;font-size:12px;color:#fff;pointer-events:none}.hover-trigger.svelte-xrdclb.svelte-xrdclb{position:absolute;right:4px;bottom:4px;z-index:3;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:6px;background-color:#0000008c;color:#fff;cursor:pointer;pointer-events:auto}.hover-trigger.svelte-xrdclb.svelte-xrdclb:hover{background-color:#000c}.card-discount.isFree.svelte-xrdclb.svelte-xrdclb{background-color:#108ee9}.card-discount.is50.svelte-xrdclb.svelte-xrdclb{background-color:#f50}.card-description.svelte-xrdclb.svelte-xrdclb{padding-left:4px;padding-right:4px;display:block;overflow:hidden;text-overflow:ellipsis}#turnPage.svelte-kydsmq{width:100%;height:32px;border-radius:16px;line-height:20px;font-size:14px;position:absolute;bottom:0}#_turnPage.svelte-2j14uu{width:100%;height:32px;border-radius:16px;line-height:20px;font-size:14px;margin:10px 0;padding:0 10px}div#_iframe.svelte-zv560o.svelte-zv560o{position:fixed;top:0;left:0;width:100vw;height:100vh;background-color:#0026269b;z-index:30000;display:flex}._iframe.svelte-zv560o.svelte-zv560o{width:min(var(--pw, 1600px),94vw);height:var(--ph, 96%);margin:auto}._iframe.svelte-zv560o iframe.svelte-zv560o{width:100%;height:100%;border:0;margin:auto} ');

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
      define("jquery-bridget/jquery-bridget", ["jquery"], function(jQuery2) {
        return factory8(window2, jQuery2);
      });
    } else {
      window2.jQueryBridget = factory8(
        window2,
        window2.jQuery
      );
    }
  })(window, function factory(window2, jQuery2) {
    var arraySlice = Array.prototype.slice;
    var console2 = window2.console;
    var logError = typeof console2 == "undefined" ? function() {
    } : function(message) {
      console2.error(message);
    };
    function jQueryBridget(namespace, PluginClass, $2) {
      $2 = $2 || jQuery2 || window2.jQuery;
      if (!$2) {
        return;
      }
      if (!PluginClass.prototype.option) {
        PluginClass.prototype.option = function(opts) {
          if (!$2.isPlainObject(opts)) {
            return;
          }
          this.options = $2.extend(true, this.options, opts);
        };
      }
      $2.fn[namespace] = function(arg0) {
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
          var instance2 = $2.data(elem, namespace);
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
          var instance2 = $2.data(elem, namespace);
          if (instance2) {
            instance2.option(options);
            instance2._init();
          } else {
            instance2 = new PluginClass(elem, options);
            $2.data(elem, namespace, instance2);
          }
        });
      }
      updateJQuery($2);
    }
    function updateJQuery($2) {
      if (!$2 || $2 && $2.bridget) {
        return;
      }
      $2.bridget = jQueryBridget;
    }
    updateJQuery(jQuery2 || window2.jQuery);
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
    return function matchesSelector(elem, selector) {
      return elem[matchesMethod](selector);
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
    utils.getParent = function(elem, selector) {
      while (elem.parentNode && elem != document.body) {
        elem = elem.parentNode;
        if (matchesSelector(elem, selector)) {
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
    utils.filterFindElements = function(elems, selector) {
      elems = utils.makeArray(elems);
      var ffElems = [];
      elems.forEach(function(elem) {
        if (!(elem instanceof HTMLElement)) {
          return;
        }
        if (!selector) {
          ffElems.push(elem);
          return;
        }
        if (matchesSelector(elem, selector)) {
          ffElems.push(elem);
        }
        var childElems = elem.querySelectorAll(selector);
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
        var jQuery2 = window2.jQuery;
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
          if (jQuery2) {
            jQuery2.data(elem, namespace, instance2);
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
    var jQuery2 = window2.jQuery;
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
      if (jQuery2) {
        this.$element = jQuery2(this.element);
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
      if (jQuery2) {
        this.$element = this.$element || jQuery2(this.element);
        if (event) {
          var $event = jQuery2.Event(event);
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
      if (jQuery2) {
        jQuery2.removeData(this.element, this.constructor.namespace);
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
      if (jQuery2 && jQuery2.bridget) {
        jQuery2.bridget(namespace, Layout);
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
  let timer = null;
  function debounce(func, delay) {
    return function() {
      if (timer) {
        console.warn("debounce dupe!!!!!!");
        clearTimeout(timer);
      }
      timer = setTimeout(function() {
        func.apply(this, arguments);
        timer = null;
      }, delay);
    };
  }
  function throttle(func, delay) {
    let timerId;
    let lastExecTime = 0;
    return function(...args) {
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
  const throttleSort = throttle(doSortMasonry, 1500);
  const throttleSort_fast = throttle(doSortMasonry, 30);
  function doSortMasonry() {
    _SORT_COUNT.Run++;
    console.log(`呼叫整理次数: ${_SORT_COUNT.Call}   实际整理次数: ${_SORT_COUNT.Run}`);
    masonry.layout();
  }
  function sortMasonry(speed = "normal") {
    _SORT_COUNT.Call++;
    if (masonry) {
      if (speed === "fast") {
        throttleSort_fast();
      } else {
        throttleSort();
      }
    }
    if (typeof __kesaWatchLazy === "function")
      __kesaWatchLazy();
  }
  let __kesaQ = [];
  let __kesaBusy = 0;
  let __kesaDone = {};
  const __kesaLimit = 4;
  function __kesaWatchLazy() {
    document.querySelectorAll('img[loading="lazy"]').forEach((im) => {
      const src = im.getAttribute("src") || im.getAttribute("data-src") || "";
      if (!src || /emptyImg|trans\.gif|spinner|^data:/i.test(src))
        return;
      if (im.loading !== "eager")
        im.loading = "eager";
      if (!im.__warmed) {
        im.__warmed = 1;
        const w = new Image();
        w.src = src;
      }
    });
    document.querySelectorAll(".nexus-lazy-load_Kesa:not(.preview_Kesa)").forEach((l) => {
      if (l.dataset.src && !l.__kesaQueued && !l.__kesaFail)
        __kesaQueue(l);
    });
  }
  function __kesaQueue(l) {
    if (l.__kesaQueued || l.classList.contains("preview_Kesa") || l.__kesaFail)
      return;
    const o = l.dataset.src;
    if (!o)
      return;
    if (__kesaDone[o] === 1) {
      l.__kesaQueued = 1, l.referrerPolicy = "no-referrer", l.src = o, l.classList.add("preview_Kesa"), sortMasonry();
      return;
    }
    if (__kesaDone[o] === -1) {
      l.__kesaQueued = 1, l.__kesaFail = 1, l.src = o, l.classList.add("preview_Kesa"), sortMasonry();
      return;
    }
    l.__kesaQueued = 1, __kesaQ.push(l), __kesaPump();
  }
  function __kesaPump() {
    while (__kesaBusy < __kesaLimit && __kesaQ.length) {
      const l = __kesaQ.shift();
      l.__kesaQueued = 0, __kesaStart(l);
    }
  }
  function __kesaFindLoaded(o) {
    try {
      const all = document.querySelectorAll("img");
      for (let i = 0; i < all.length; i++) {
        const im = all[i];
        const src = im.currentSrc || im.getAttribute("src") || "";
        if (src === o && im.complete && im.naturalWidth > 0)
          return im;
      }
    } catch (e) {
    }
    return null;
  }
  function __kesaFailSvg() {
    return "data:image/svg+xml;utf8," + encodeURIComponent(
      "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='560'><text x='50%' y='50%' font-size='24' fill='#aaa' text-anchor='middle' dominant-baseline='middle'>暂时无法加载出图片</text></svg>"
    );
  }
  function __kesaStart(l) {
    if (l.__kesaBusy || l.classList.contains("preview_Kesa"))
      return;
    const o = l.dataset.src;
    if (!o) {
      l.__kesaFail = 1;
      return;
    }
    const __re = __kesaFindLoaded(o);
    if (__re) {
      l.referrerPolicy = __re.referrerPolicy || "", l.src = o, l.classList.add("preview_Kesa"), __kesaDone[o] = 1, sortMasonry();
      return;
    }
    l.__kesaBusy = 1, __kesaBusy++;
    const p = new Image();
    const a = l.__kesaTry | 0;
    let __to = null;
    a >= 1 && (p.referrerPolicy = "no-referrer");
    p.onload = () => {
      __to && clearTimeout(__to);
      if (l.__kesaTimedOut) {
        __kesaDone[o] = 1, l.referrerPolicy = p.referrerPolicy, l.src = o, l.classList.add("preview_Kesa"), sortMasonry();
        return;
      }
      __kesaDone[o] = 1, l.__kesaBusy = 0, __kesaBusy--, __kesaPump(), l.referrerPolicy = p.referrerPolicy, l.src = o, l.classList.add("preview_Kesa"), sortMasonry();
    };
    p.onerror = () => {
      __to && clearTimeout(__to);
      if (l.__kesaTimedOut) {
        __kesaDone[o] = -1, l.__kesaFail = 1, l.src = __kesaFailSvg(), l.classList.add("preview_Kesa"), sortMasonry();
        return;
      }
      l.__kesaTry = a + 1;
      if (a === 0) {
        l.__kesaBusy = 0, __kesaBusy--, setTimeout(() => {
          __kesaQ.unshift(l), __kesaPump();
        }, 500);
        return;
      }
      if (a === 1 && !/ptfans\.cc/i.test(location.hostname) && !o.includes("image_proxy.php") && !l.__kesaProxy) {
        l.__kesaProxy = 1, l.dataset.src = location.origin + "/image_proxy.php?url=" + encodeURIComponent(o), l.__kesaBusy = 0, __kesaBusy--, setTimeout(() => {
          __kesaQ.unshift(l), __kesaPump();
        }, 500);
        return;
      }
      __kesaDone[o] = -1, l.__kesaFail = 1, l.__kesaBusy = 0, __kesaBusy--, __kesaPump(), l.src = o, l.classList.add("preview_Kesa"), sortMasonry();
    };
    p.src = o;
    __to = setTimeout(function() {
      if (l.__kesaTimedOut)
        return;
      l.__kesaTimedOut = 1, l.__kesaBusy = 0, __kesaBusy--, __kesaPump();
    }, 4e3);
  }
  function NEXUS_TOOLS() {
    console.log("------------------------NEXUS TOOLS------------------------");
    jQuery(document).ready(function() {
      function getImgPosition(event, imgEle2) {
        let imgWidth = imgEle2.prop("naturalWidth");
        let imgHeight = imgEle2.prop("naturalHeight");
        let ratio = imgWidth / imgHeight;
        let offsetX = 0;
        let offsetY = 0;
        let width = window.innerWidth - event.clientX;
        let height = window.innerHeight - event.clientY;
        let changeOffsetY = 0;
        let changeOffsetX = false;
        if (event.clientX > window.innerWidth / 2 && event.clientX + imgWidth > window.innerWidth) {
          changeOffsetX = true;
          width = event.clientX;
        }
        if (event.clientY > window.innerHeight / 2) {
          if (event.clientY + imgHeight / 2 > window.innerHeight) {
            changeOffsetY = 1;
            height = event.clientY;
          } else if (event.clientY + imgHeight > window.innerHeight) {
            changeOffsetY = 2;
            height = event.clientY;
          }
        }
        if (imgWidth > width) {
          imgWidth = width;
          imgHeight = imgWidth / ratio;
        }
        if (imgHeight > height) {
          imgHeight = height;
          imgWidth = imgHeight * ratio;
        }
        if (changeOffsetX) {
          offsetX = -imgWidth;
        }
        if (changeOffsetY == 1) {
          offsetY = -(imgHeight - (window.innerHeight - event.clientY));
        } else if (changeOffsetY == 2) {
          offsetY = -imgHeight / 2;
        }
        return { imgWidth, imgHeight, offsetX, offsetY };
      }
      function getMinRatio(pic, container) {
        return Math.min(container.width / pic.width, container.height / pic.height);
      }
      function previewPosition_Kesa(event, imgEle2) {
        let imgWidth = imgEle2.prop("naturalWidth") ?? 0;
        let imgHeight = imgEle2.prop("naturalHeight") ?? 0;
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
            width: viewportWidth,
            height: distanceToTop
          },
          bot: {
            left: 0,
            top: distanceToTop,
            width: viewportWidth,
            height: distanceToBottom
          },
          left: {
            left: 0,
            top: 0,
            width: distanceToLeft,
            height: viewportHeight
          },
          right: {
            left: distanceToLeft,
            top: 0,
            width: distanceToRight,
            height: viewportHeight
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
      function getPosition(event, position) {
        return {
          left: event.pageX + position.offsetX,
          top: event.pageY + position.offsetY,
          width: position.imgWidth,
          height: position.imgHeight
        };
      }
      const selector = "img.preview_Kesa";
      let imgEle;
      let imgPosition;
      if (!jQuery("#nexus-preview").length) {
        const _previewDom = document.body.appendChild(document.createElement("img"));
        _previewDom.id = "nexus-preview";
      }
      jQuery("#nexus-preview");
      function createKesaPreview(color) {
        const parent = jQuery("<div>", {
          id: "kp_container",
          css: {
            backgroundColor: color,
            opacity: 1,
            position: "fixed",
            zIndex: 2e4,
            pointerEvents: "none",
            transition: "all .3s"
          }
        });
        parent.append(jQuery("<img>", {
          class: "kp_img",
          css: {
            position: "absolute",
            zIndex: 20002,
            pointerEvents: "none",
            width: "100%",
            height: "100%",
            // 预览大图默认状态: 开启=铺满(contain) 关闭=尽量原图大小(scale-down)
            objectFit: get_store_value(_state_hover_pic) ? "contain" : "scale-down"
          }
        }));
        parent.append(jQuery("<img>", {
          class: "kp_img",
          css: {
            position: "absolute",
            zIndex: 20001,
            pointerEvents: "none",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: `blur(8px)`
          }
        }));
        return parent;
      }
      const kesa_preview = jQuery("#kp_container").length > 0 ? jQuery("#kp_container") : createKesaPreview("");
      jQuery("body").append(kesa_preview);
      _state_hover_pic.subscribe((v) => {
        const __im = document.querySelectorAll("#kp_container .kp_img")[0];
        if (__im)
          __im.style.objectFit = v ? "contain" : "scale-down";
      });
      let buffer = null;
      const triggerSel = "div.hover-trigger";
      function resolvePreviewImg(el) {
        const card = el && el.closest ? el.closest(".card") : null;
        const img = card ? card.querySelector("img.preview_Kesa, img.card-image--img.nexus-lazy-load_Kesa") : null;
        return jQuery(img || el);
      }
      jQuery("body").on("mouseover", selector + "," + triggerSel, function(e) {
        const isTrigger = jQuery(this).is(triggerSel);
        if (get_store_value(_preview_style) && !isTrigger)
          return;
        if (!get_store_value(_preview_style) && isTrigger)
          return;
        imgEle = resolvePreviewImg(this);
        buffer = setTimeout(() => {
          if (get_store_value(_show_nexus_pic)) {
            imgPosition = getImgPosition(e, imgEle);
            getPosition(e, imgPosition);
            let src = imgEle.attr("src");
            if (src) {
              if (kesa_preview)
                kesa_preview.find(".kp_img").attr("src", src);
            }
            kesa_preview.css(previewPosition_Kesa(e, imgEle)).show();
          }
        }, get_store_value(_delay_nexus_pic));
      }).on("mouseout", selector + "," + triggerSel, function(e) {
        kesa_preview.hide();
        if (buffer)
          clearTimeout(buffer);
      }).on("mousemove", selector + "," + triggerSel, function(e) {
        if (!imgEle || !imgEle.length)
          return;
        imgPosition = getImgPosition(e, imgEle);
        getPosition(e, imgPosition);
        kesa_preview.css(previewPosition_Kesa(e, imgEle));
      });
      if ("IntersectionObserver" in window) {
        __kesaWatchLazy();
      }
    });
  }
  function persistStore(key, startValue) {
    const savedValue = localStorage.getItem(key);
    const initialValue = savedValue ? JSON.parse(savedValue) : startValue;
    const store = writable(initialValue);
    store.subscribe((value) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
    return store;
  }
  const _Global_Masonry = writable({});
  const _show_mode = persistStore("_showMode", 1);
  const _iframe_switch = writable(0);
  const _iframe_url = writable("https://kamept.com/index.php");
  const _current_domain = persistStore("_domain", "");
  const _current_bgColor = persistStore("_bgColor", "");
  const _show_configPanel = writable(false);
  const _panelPos = persistStore("_panelPos", { x: 0, y: 0 });
  const _turnPage = persistStore("_turnPage", false);
  const _show_debug_btn = persistStore("_show_debug_btn", 0);
  const _show_nexus_pic = persistStore("_show_nexus_pic", 1);
  const _delay_nexus_pic = persistStore("_delay_nexus_pic", 600);
  const _pic_failed_showInfo = persistStore("_pic_failed_showInfo", 1);
  const _state_hover_pic = persistStore("_state_hover_pic", false);
  const _preview_style = persistStore("_preview_style", true);
  const _card_width = persistStore("_card_width", 200);
  const _animated = persistStore("_animated", true);
  const default_card_layout = { column: 4, gap: 20, margin: 20 };
  const _card_layout = persistStore("_card_layout", default_card_layout);
  const _previewWidth = persistStore("_previewWidth", 0);
  const _previewHeight = persistStore("_previewHeight", 0);
  let mark_layout = false;
  _card_layout.subscribe((value) => {
    if (!mark_layout) {
      mark_layout = true;
    } else {
      if (typeof window !== "undefined" && window.CHANGE_CARD_LAYOUT) {
        window.CHANGE_CARD_LAYOUT();
      }
    }
  });
  const site_setting = {
    mt: {
      // 隐藏gay卡片: 默认为true
      hide_gay: true
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
  function create_if_block_6$1(ctx) {
    let svg;
    let path;
    let circle;
    let t0;
    let div;
    let t1;
    return {
      c() {
        svg = svg_element("svg");
        path = svg_element("path");
        circle = svg_element("circle");
        t0 = space();
        div = element("div");
        t1 = text(
          /*label*/
          ctx[5]
        );
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
        attr(div, "class", "_hint svelte-2vaqag");
      },
      m(target, anchor) {
        insert(target, svg, anchor);
        append(svg, path);
        append(svg, circle);
        insert(target, t0, anchor);
        insert(target, div, anchor);
        append(div, t1);
      },
      p(ctx2, dirty) {
        if (dirty & /*label*/
        32)
          set_data(
            t1,
            /*label*/
            ctx2[5]
          );
      },
      d(detaching) {
        if (detaching)
          detach(svg);
        if (detaching)
          detach(t0);
        if (detaching)
          detach(div);
      }
    };
  }
  function create_if_block_2$1(ctx) {
    let t;
    let if_block_anchor;
    function select_block_type(ctx2, dirty) {
      if (
        /*green_state*/
        ctx2[7]
      )
        return create_if_block_3$1;
      if (
        /*checked*/
        ctx2[0]
      )
        return create_if_block_5$1;
      return create_else_block_1;
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
  function create_else_block_1(ctx) {
    let span;
    let t;
    return {
      c() {
        span = element("span");
        t = text(
          /*title_green*/
          ctx[3]
        );
        attr(span, "class", "title_green svelte-2vaqag");
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
  function create_if_block_5$1(ctx) {
    let span;
    let t;
    return {
      c() {
        span = element("span");
        t = text(
          /*title_red*/
          ctx[4]
        );
        attr(span, "class", "title_red svelte-2vaqag");
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
  function create_if_block_3$1(ctx) {
    let if_block_anchor;
    function select_block_type_1(ctx2, dirty) {
      if (
        /*checked*/
        ctx2[0]
      )
        return create_if_block_4$1;
      return create_else_block$3;
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
  function create_else_block$3(ctx) {
    let span;
    let t;
    return {
      c() {
        span = element("span");
        t = text(
          /*title_red*/
          ctx[4]
        );
        attr(span, "class", "title_red svelte-2vaqag");
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
  function create_if_block_4$1(ctx) {
    let span;
    let t;
    return {
      c() {
        span = element("span");
        t = text(
          /*title_green*/
          ctx[3]
        );
        attr(span, "class", "title_green svelte-2vaqag");
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
  function create_if_block_1$3(ctx) {
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
        attr(input, "class", "svelte-2vaqag");
        attr(label_1, "for", "_t" + /*id*/
        ctx[8]);
        attr(label_1, "class", "svelte-2vaqag");
        attr(div, "class", "s_switch");
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
  function create_if_block$5(ctx) {
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
  function create_fragment$5(ctx) {
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
      ctx[5] && create_if_block_6$1(ctx)
    );
    let if_block1 = (
      /*title_green*/
      (ctx[3] || /*title_red*/
      ctx[4]) && create_if_block_2$1(ctx)
    );
    let if_block2 = (
      /*type*/
      ctx[1] == "switch" && create_if_block_1$3(ctx)
    );
    let if_block3 = (
      /*type*/
      ctx[1] == "range" && create_if_block$5(ctx)
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
        attr(div0, "class", "s_title svelte-2vaqag");
        attr(
          div0,
          "title",
          /*label*/
          ctx[5]
        );
        attr(div1, "class", "switch svelte-2vaqag");
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
          } else {
            if_block0 = create_if_block_6$1(ctx2);
            if_block0.c();
            if_block0.m(div0, t0);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
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
            if_block1 = create_if_block_2$1(ctx2);
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
            if_block2 = create_if_block_1$3(ctx2);
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
            if_block3 = create_if_block$5(ctx2);
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
        transition_in(if_block3);
        current = true;
      },
      o(local) {
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
  function instance$5($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    let { type = "switch" } = $$props;
    let { title_fixed = "" } = $$props;
    let { title_green = "" } = $$props;
    let { title_red = "" } = $$props;
    let { label = "" } = $$props;
    let { func = null } = $$props;
    const id = Math.random().toFixed(8);
    let { checked = false } = $$props;
    let { green_state = true } = $$props;
    function input_change_handler() {
      checked = this.checked;
      $$invalidate(0, checked);
    }
    const change_handler = () => {
      console.log(title_fixed, checked);
      if (func != null)
        func();
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
        $$invalidate(6, func = $$props2.func);
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
      func,
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
      init(this, options, instance$5, create_fragment$5, safe_not_equal, {
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
  const __STORE_NS = "Kesa:Masonry";
  function __mkLocalStore(key, defaultValue) {
    let value = defaultValue;
    try {
      const obj = JSON.parse(localStorage.getItem(__STORE_NS) || "{}") || {};
      if (obj[key] !== void 0)
        value = obj[key];
    } catch (e) {
    }
    const subs = /* @__PURE__ */ new Set();
    const store = {
      get() {
        return value;
      },
      set(v) {
        const changed = v !== value;
        value = v;
        try {
          const obj = JSON.parse(localStorage.getItem(__STORE_NS) || "{}") || {};
          obj[key] = v;
          localStorage.setItem(__STORE_NS, JSON.stringify(obj));
        } catch (e) {
        }
        if (changed) {
          for (const cb of [...subs]) {
            try {
              cb(value);
            } catch (e) {
            }
          }
        }
        return v;
      },
      subscribe(cb) {
        subs.add(cb);
        return function() {
          subs.delete(cb);
        };
      },
      update(fn) {
        return store.set(fn(value));
      }
    };
    return store;
  }
  function __storeVal(s) {
    return s.get();
  }
  const __readIds = __mkLocalStore("_read_ids", []);
  const __hideReadCards = __mkLocalStore("_hide_read_cards", false);
  const __hideHistoryRead = __mkLocalStore("_hide_history_read", false);
  const __showInfoOnPicFail = __mkLocalStore("_showInfoOnPicFail", 1);
  const __stateHoverPic = __mkLocalStore("_state_hover_pic", false);
  const __bTags = __mkLocalStore("_blocked_tags", []);
  const __aTags = __mkLocalStore("_all_tags", []);
  const __nameFilter = __mkLocalStore("_name_filter_keywords", []);
  {
    const _old = __storeVal(__nameFilter);
    if (!Array.isArray(_old)) {
      __nameFilter.set(
        typeof _old === "string" ? _old.trim().split(/\s+/).filter(Boolean) : []
      );
    }
  }
  let __historyReadSnapshot = [];
  let __wdvCfgInit = null;
  try {
    const __s = GM_getValue("pt_wdv_cfg", null);
    __wdvCfgInit = __s ? JSON.parse(__s) : null;
  } catch (e) {
  }
  if (!__wdvCfgInit || typeof __wdvCfgInit !== "object") {
    try {
      const __raw = JSON.parse(localStorage.getItem("Kesa:Masonry") || "{}");
      __wdvCfgInit = __raw._webdav_config || null;
    } catch (e) {
    }
  }
  let __wdvCfgValue = Object.assign({ url: "", user: "", pass: "", path: "PT_Masonry_ReadIds.json" }, __wdvCfgInit || {});
  const __wdvCfgSubs = /* @__PURE__ */ new Set();
  const __wdvCfg = {
    get() {
      return __wdvCfgValue;
    },
    set(v) {
      const changed = v !== __wdvCfgValue;
      __wdvCfgValue = v;
      try {
        GM_setValue("pt_wdv_cfg", JSON.stringify(v));
      } catch (e) {
      }
      if (changed) {
        for (const cb of [...__wdvCfgSubs]) {
          try {
            cb(__wdvCfgValue);
          } catch (e) {
          }
        }
      }
      return v;
    },
    subscribe(cb) {
      __wdvCfgSubs.add(cb);
      return function() {
        __wdvCfgSubs.delete(cb);
      };
    },
    update(fn) {
      return __wdvCfg.set(fn(__wdvCfgValue));
    }
  };
  function __markRead(id) {
    const cur = __storeVal(__readIds);
    if (!cur.includes(id)) {
      __readIds.set([...cur, id]);
    }
  }
  function __applyHideReadCards() {
    const hide = __storeVal(__hideReadCards), hideHist = __storeVal(__hideHistoryRead);
    document.querySelectorAll(".card.pt-read").forEach((el) => {
      const id = __extractId(el);
      const isHist = hideHist && id && __historyReadSnapshot.includes(id);
      el.style.display = hide || isHist ? "none" : "";
    });
    if (hide || hideHist) {
      document.querySelectorAll(".card:not(.pt-read)").forEach((el) => {
        if (el.style.display === "none")
          el.style.display = "";
      });
    }
  }
  function __cardName(el) {
    const a = el.querySelector(".card-title a.two-lines");
    if (a)
      return (a.textContent || "").trim();
    const t = el.querySelector(".card-title");
    if (t)
      return (t.textContent || "").trim();
    return "";
  }
  function __applyHideNameFilter() {
    const kws = (__storeVal(__nameFilter) || []).filter((k) => (k || "").trim());
    document.querySelectorAll(".card").forEach((el) => {
      if (!kws.length) {
        if (el.__nameFiltered) {
          el.style.display = "";
          el.__nameFiltered = false;
        }
        return;
      }
      const name = __cardName(el).toLowerCase();
      const hit = kws.some((k) => name.indexOf(String(k).toLowerCase()) !== -1);
      el.style.display = hit ? "none" : "";
      el.__nameFiltered = hit;
    });
  }
  function __extractId(card) {
    const link = card.querySelector('a[href*="details.php"],a[href*="/detail/"]');
    if (!link)
      return null;
    var m = link.href.match(/[?&]id=(\d+)/);
    if (m)
      return m[1];
    m = link.href.match(/\/detail\/(\d+)/);
    if (m)
      return m[1];
    return null;
  }
  function __applyReadClasses() {
    const readSet = __storeVal(__readIds);
    document.querySelectorAll(".card").forEach((el) => {
      const id = __extractId(el);
      el.classList.toggle("pt-read", !!(id && readSet.includes(id)));
    });
    __applyHideReadCards();
  }
  function __initReadTracking() {
    if (document.getElementById("pt-read-style"))
      return;
    __historyReadSnapshot = [...__storeVal(__readIds)];
    const s = document.createElement("style");
    s.id = "pt-read-style";
    s.textContent = ".card.pt-read{opacity:0.55!important;filter:grayscale(0.6)!important;transition:opacity .3s ease,filter .3s ease!important}.card.pt-read:hover{opacity:0.75!important;filter:grayscale(0.3)!important}";
    document.head.appendChild(s);
    __applyReadClasses();
    function markRead(e) {
      const card = e.target.closest(".card");
      if (!card)
        return;
      const id = __extractId(card);
      if (!id)
        return;
      const cur = __storeVal(__readIds);
      if (cur.includes(id))
        return;
      __readIds.set([...cur, id]);
    }
    document.addEventListener("click", markRead, true);
    document.addEventListener(
      "auxclick",
      function(e) {
        if (e.button === 1)
          markRead(e);
      },
      true
    );
    let timer2;
    const obs = new MutationObserver(function(muts) {
      const hasCard = muts.some(
        (mu) => Array.from(mu.addedNodes).concat(Array.from(mu.removedNodes)).some((n) => {
          if (!n || n.nodeType !== 1)
            return false;
          return n.classList && n.classList.contains("card") || n.querySelector && n.querySelector(".card");
        })
      );
      if (!hasCard)
        return;
      clearTimeout(timer2);
      timer2 = setTimeout(function() {
        __applyReadClasses();
        __applyHideNameFilter();
      }, 200);
    });
    obs.observe(document.body, { childList: true, subtree: true });
    const url = window.location.href;
    var m = url.match(/[?&]id=(\d+)/);
    if (m) {
      const cur = __storeVal(__readIds);
      if (!cur.includes(m[1]))
        __readIds.set([...cur, m[1]]);
    }
  }
  function __mkSwitch(checked, onChange) {
    const w = document.createElement("div");
    w.className = "s_switch svelte-zt6zlx svelte-zt6zlx";
    const inp = document.createElement("input");
    inp.type = "checkbox";
    inp.className = "svelte-zt6zlx svelte-zt6zlx";
    inp.checked = !!checked;
    const id = "_kesa_sw_" + Math.random().toString(36).slice(2, 10);
    inp.id = id;
    const lb = document.createElement("label");
    lb.className = "svelte-zt6zlx svelte-zt6zlx";
    lb.setAttribute("for", id);
    inp.addEventListener("change", function() {
      onChange(inp.checked);
    });
    w.appendChild(inp);
    w.appendChild(lb);
    return w;
  }
  function __mkSwitchRow(labelText, checked, onChange, desc) {
    const row = document.createElement("div");
    row.className = "switch svelte-zt6zlx svelte-zt6zlx";
    const lb = document.createElement("div");
    lb.className = "s_title svelte-zt6zlx";
    lb.textContent = labelText;
    if (desc)
      lb.title = desc;
    const sw = __mkSwitch(checked, function(v) {
      onChange(v);
    });
    row.appendChild(lb);
    row.appendChild(sw);
    return row;
  }
  function __fillReadSection(container) {
    const h1 = document.createElement("h1");
    h1.className = "s_title";
    h1.textContent = "已读标记";
    container.appendChild(h1);
    const hint = document.createElement("div");
    hint.style.cssText = "color:#999;font-size:11px;margin:0 0 6px 0;padding:0 10px;";
    hint.textContent = "点击卡片标记已读，再次点击取消";
    container.appendChild(hint);
    const panel = document.createElement("div");
    panel.className = "s_panel";
    panel.style.cssText = "display:flex;flex-wrap:wrap;gap:4px;";
    container.appendChild(panel);
    const row = document.createElement("div");
    row.style.cssText = "display:flex;gap:4px;padding:8px 10px 0;";
    const clearBtn = document.createElement("button");
    clearBtn.textContent = "清除所有已读标记";
    clearBtn.style.cssText = "border:none;background:#e55;color:#fff;border-radius:4px;cursor:pointer;padding:4px 12px;font-size:12px;";
    row.appendChild(clearBtn);
    container.appendChild(row);
    const countLabel = document.createElement("div");
    countLabel.style.cssText = "color:#999;font-size:11px;padding:4px 10px 0;";
    container.appendChild(countLabel);
    clearBtn.onclick = () => {
      __readIds.set([]);
    };
    const ua = __readIds.subscribe((v) => {
      countLabel.textContent = `已标记 ${v.length} 个种子`;
      __applyReadClasses();
    });
    return () => {
      ua();
    };
  }
  function __fillTagSection(container) {
    const h1 = document.createElement("h1");
    h1.className = "s_title";
    h1.textContent = "TAG 过滤";
    container.appendChild(h1);
    const hint = document.createElement("div");
    hint.style.cssText = "color:#999;font-size:11px;margin:0 0 6px 0;padding:0 10px;";
    hint.textContent = "点击标签切换屏蔽(红=已屏蔽)，改后刷新页面生效";
    container.appendChild(hint);
    const panel = document.createElement("div");
    panel.className = "s_panel";
    panel.style.cssText = "display:flex;flex-direction:row;flex-wrap:wrap;justify-content:flex-start;align-items:flex-start;align-content:flex-start;gap:6px;width:100%;";
    container.appendChild(panel);
    const row = document.createElement("div");
    row.style.cssText = "display:flex;gap:4px;padding:8px 10px 0;";
    const inp = document.createElement("input");
    inp.placeholder = "手动添加屏蔽TAG";
    inp.style.cssText = "flex:1;border:1px solid #ccc;border-radius:4px;padding:3px 6px;font-size:12px;";
    const addBtn = document.createElement("button");
    addBtn.textContent = "+";
    addBtn.style.cssText = "border:none;background:#3fa7d6;color:#fff;border-radius:4px;cursor:pointer;padding:0 10px;";
    row.appendChild(inp);
    row.appendChild(addBtn);
    container.appendChild(row);
    let _a = [], _b = [];
    function render() {
      panel.innerHTML = "";
      if (_a.length === 0 && _b.length === 0) {
        const e = document.createElement("span");
        e.style.cssText = "color:#bbb;font-size:11px;";
        e.textContent = "暂无标签，加载种子后显示";
        panel.appendChild(e);
        return;
      }
      const merged = [.../* @__PURE__ */ new Set([..._a, ..._b])];
      merged.forEach((tg) => {
        const on = _b.includes(tg);
        const c = document.createElement("span");
        c.textContent = tg;
        c.style.cssText = "display:inline-block;padding:3px 10px;border-radius:8px;cursor:pointer;font-size:12px;line-height:1.4;white-space:nowrap;border:1px solid " + (on ? "#e55" : "#9ac6ff") + ";background:" + (on ? "#fde8e8" : "#eef4ff") + ";color:" + (on ? "#c00" : "#1a4b8f") + ";";
        c.title = on ? "点击取消屏蔽" : "点击屏蔽此TAG";
        c.onclick = () => {
          const cur = __storeVal(__bTags);
          if (cur.includes(tg))
            __bTags.set(cur.filter((x) => x !== tg));
          else
            __bTags.set([...cur, tg]);
        };
        panel.appendChild(c);
      });
    }
    addBtn.onclick = () => {
      const v = inp.value.trim();
      if (!v)
        return;
      const cur = __storeVal(__bTags);
      if (!cur.includes(v))
        __bTags.set([...cur, v]);
      inp.value = "";
    };
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter")
        addBtn.click();
    });
    const ua = __aTags.subscribe((v) => {
      _a = v;
      render();
    });
    const ub = __bTags.subscribe((v) => {
      _b = v;
      render();
    });
    return () => {
      ua();
      ub();
    };
  }
  function __fillCardInfoSectionObserver() {
    let swReadInp = null, swHistInp = null;
    function build() {
      const panel = function() {
        const holder = document.querySelector(".configP_holder");
        if (!holder)
          return null;
        const sections = holder.querySelectorAll(".section");
        for (let i = 0; i < sections.length; i++) {
          const h1 = sections[i].querySelector("h1.s_title");
          if (h1 && h1.textContent === "卡片信息") {
            const sub = sections[i].querySelector("h3.s_title");
            const subSec = sub && sub.parentElement;
            if (subSec && subSec.textContent.indexOf("配置常驻卡片信息") !== -1) {
              const p = subSec.querySelector(":scope > .s_panel");
              if (p)
                return p;
            }
          }
        }
        return null;
      }();
      if (!panel || panel.querySelector(".kesaHideReadRows"))
        return null;
      const wrap = document.createElement("div");
      wrap.className = "kesaHideReadRows";
      wrap.style.cssText = "border-top:1px solid #eee;margin-top:4px;padding-top:2px;";
      const swRead = __mkSwitchRow(
        "隐藏已读卡片",
        __storeVal(__hideReadCards),
        function(v) {
          if (v)
            __hideHistoryRead.set(false);
          __hideReadCards.set(v);
        },
        "隐藏所有已读卡片(与隐藏历史观看互斥)"
      );
      const swHist = __mkSwitchRow(
        "隐藏历史观看",
        __storeVal(__hideHistoryRead),
        function(v) {
          if (v)
            __hideReadCards.set(false);
          __hideHistoryRead.set(v);
        },
        "隐藏刷新前已观看的卡片, 刷新后新看的只变灰(与隐藏已读卡片互斥)"
      );
      swReadInp = swRead.querySelector("input");
      swHistInp = swHist.querySelector("input");
      wrap.appendChild(swRead);
      wrap.appendChild(swHist);
      panel.appendChild(wrap);
      return wrap;
    }
    function tryFill() {
      if (!build())
        return;
      const u1 = __hideReadCards.subscribe((v) => {
        if (swReadInp)
          swReadInp.checked = v;
        __applyHideReadCards();
      });
      const u2 = __hideHistoryRead.subscribe((v) => {
        if (swHistInp)
          swHistInp.checked = v;
        __applyHideReadCards();
      });
      window.__kesaHideReadCleanup = function() {
        u1();
        u2();
      };
    }
    try {
      tryFill();
    } catch (e) {
    }
    const mo = new MutationObserver(function() {
      try {
        tryFill();
      } catch (e) {
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }
  function __fillNameFilterSection(container) {
    const h1 = document.createElement("h1");
    h1.className = "s_title";
    h1.textContent = "名称过滤";
    container.appendChild(h1);
    const hint = document.createElement("div");
    hint.style.cssText = "color:#999;font-size:11px;margin:0 0 6px 0;padding:0 10px;";
    hint.textContent = "输入文字后回车(或点添加)生成气泡，命中任一气泡即隐藏卡片；气泡可删除，空格作为匹配字符";
    container.appendChild(hint);
    const chipBox = document.createElement("div");
    chipBox.className = "s_panel";
    chipBox.style.cssText = "display:flex;flex-wrap:wrap;gap:6px;width:100%;box-sizing:border-box;";
    container.appendChild(chipBox);
    const row = document.createElement("div");
    row.style.cssText = "display:flex;gap:4px;padding:8px 10px 0;width:100%;box-sizing:border-box;";
    const inp = document.createElement("input");
    inp.type = "text";
    inp.placeholder = "输入关键词后回车添加";
    inp.style.cssText = "flex:1;min-width:0;border:1px solid #ccc;border-radius:4px;padding:5px 8px;font-size:12px;box-sizing:border-box;";
    const addBtn = document.createElement("button");
    addBtn.textContent = "添加";
    addBtn.style.cssText = "border:none;background:#5b9cf6;color:#fff;border-radius:4px;cursor:pointer;padding:4px 12px;font-size:12px;flex:none;";
    const clearBtn = document.createElement("button");
    clearBtn.textContent = "清空";
    clearBtn.style.cssText = "border:none;background:#e55;color:#fff;border-radius:4px;cursor:pointer;padding:4px 12px;font-size:12px;flex:none;";
    row.appendChild(inp);
    row.appendChild(addBtn);
    row.appendChild(clearBtn);
    container.appendChild(row);
    const countLabel = document.createElement("div");
    countLabel.style.cssText = "color:#999;font-size:11px;padding:4px 10px 0;";
    container.appendChild(countLabel);
    function renderChips() {
      chipBox.textContent = "";
      const kws = __storeVal(__nameFilter) || [];
      kws.forEach((kw, idx) => {
        if (!(kw || "").trim())
          return;
        const chip = document.createElement("span");
        chip.style.cssText = "display:inline-flex;align-items:center;gap:4px;background:#e8f1ff;border:1px solid #b9d5ff;color:#2b5bb0;border-radius:12px;padding:2px 8px;font-size:12px;max-width:100%;";
        const label = document.createElement("span");
        label.textContent = kw;
        label.style.cssText = "overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:180px;";
        const x = document.createElement("button");
        x.textContent = "×";
        x.title = "移除该关键词";
        x.style.cssText = "border:none;background:none;color:#2b5bb0;cursor:pointer;font-size:14px;line-height:1;padding:0 2px;";
        x.onclick = () => {
          const cur = __storeVal(__nameFilter) || [];
          cur.splice(idx, 1);
          __nameFilter.set(cur.slice());
        };
        chip.appendChild(label);
        chip.appendChild(x);
        chipBox.appendChild(chip);
      });
      if (!chipBox.childNodes.length) {
        const empty2 = document.createElement("span");
        empty2.style.cssText = "color:#bbb;font-size:11px;padding:2px 4px;";
        empty2.textContent = "暂无过滤关键词";
        chipBox.appendChild(empty2);
      }
    }
    function addKeyword() {
      const v = inp.value.trim();
      if (!v)
        return;
      const cur = __storeVal(__nameFilter) || [];
      if (!cur.includes(v))
        cur.push(v);
      __nameFilter.set(cur.slice());
      inp.value = "";
      inp.focus();
    }
    function apply() {
      __applyHideNameFilter();
      renderChips();
      const kws = (__storeVal(__nameFilter) || []).filter((k) => (k || "").trim());
      const total = document.querySelectorAll(".card").length;
      const hidden = document.querySelectorAll(".card[style*='display: none']").length;
      countLabel.textContent = kws.length ? `已隐藏 ${hidden} / 共 ${total} 个卡片(命中任一关键词)` : `共 ${total} 个卡片`;
    }
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addKeyword();
      }
    });
    addBtn.onclick = addKeyword;
    clearBtn.onclick = () => {
      __nameFilter.set([]);
      inp.value = "";
      inp.focus();
    };
    const un = __nameFilter.subscribe(() => apply());
    return () => {
      un();
    };
  }
  function __fillWebDAVSection(container) {
    const h1 = document.createElement("h1");
    h1.className = "s_title";
    h1.textContent = "同步 (WebDAV)";
    container.appendChild(h1);
    const hint = document.createElement("div");
    hint.style.cssText = "color:#999;font-size:11px;margin:0 0 6px 0;padding:0 10px;";
    hint.textContent = "配置全局共用(换站不丢); 已读标记/设置按站点、页码全部站点, 均存入同一个统一文件并整体同步(自动合并)。打开站点自动下载、关闭页面自动上传, 已做流量优化; 也可手动点击下方按钮。侧边栏黄色'最大N页'按钮一键跳转到历史最大页码";
    container.appendChild(hint);
    const panel = document.createElement("div");
    panel.className = "s_panel";
    panel.style.cssText = "display:flex;flex-direction:column;gap:6px;width:100%;";
    container.appendChild(panel);
    function mkRow(label, key, type) {
      const c = __storeVal(__wdvCfg);
      const w = document.createElement("div");
      w.style.cssText = "display:flex;align-items:center;gap:6px;width:100%;";
      const lb = document.createElement("span");
      lb.style.cssText = "width:64px;font-size:12px;color:#333;flex-shrink:0;";
      lb.textContent = label;
      const inp = document.createElement("input");
      inp.type = type || "text";
      inp.value = c[key] || "";
      inp.style.cssText = "flex:1;min-width:0;border:1px solid #ccc;border-radius:4px;padding:3px 6px;font-size:12px;";
      inp.onchange = () => {
        const cur = __storeVal(__wdvCfg);
        cur[key] = inp.value.trim();
        __wdvCfg.set(cur);
      };
      w.appendChild(lb);
      w.appendChild(inp);
      panel.appendChild(w);
      return inp;
    }
    mkRow("服务器地址", "url", "text");
    mkRow("账号", "user", "text");
    mkRow("密码", "pass", "password");
    mkRow("文件路径", "path", "text");
    const status = document.createElement("div");
    status.style.cssText = "color:#3a7;font-size:12px;padding:2px 10px;min-height:16px;word-break:break-all;";
    status.textContent = "";
    container.appendChild(status);
    const btnRow = document.createElement("div");
    btnRow.style.cssText = "display:flex;gap:8px;padding:4px 10px;";
    function mkBtn(text2, fn) {
      const b = document.createElement("button");
      b.textContent = text2;
      b.style.cssText = "flex:1;border:none;border-radius:8px;background:#3fa7d6;color:#fff;cursor:pointer;padding:6px 0;font-size:12px;";
      b.onclick = async () => {
        status.style.color = "#d90";
        status.textContent = text2 + "中...";
        try {
          status.textContent = await fn();
          status.style.color = "#3a7";
        } catch (e) {
          status.style.color = "#c00";
          status.textContent = e.message;
        }
      };
      btnRow.appendChild(b);
      return b;
    }
    mkBtn("上传到服务器", function() {
      return __wdvUpload(true);
    });
    mkBtn("下载并合并", __wdvDownload);
    container.appendChild(btnRow);
    const clearRow = document.createElement("div");
    clearRow.style.cssText = "display:flex;gap:8px;padding:4px 10px;";
    const clearBtn = document.createElement("button");
    clearBtn.textContent = "清除历史页码记录";
    clearBtn.style.cssText = "flex:1;border:none;border-radius:8px;background:#e55;color:#fff;cursor:pointer;padding:6px 0;font-size:12px;";
    clearBtn.onclick = async () => {
      status.style.color = "#d90";
      status.textContent = "清除中...";
      try {
        if (typeof window.__kesaPageSync === "function")
          window.__kesaPageSync("clearLocal");
        await __wdvUpload(true);
        status.style.color = "#3a7";
        status.textContent = "已清空页码并上传(本地+服务器)";
      } catch (e) {
        status.style.color = "#c00";
        status.textContent = e.message;
      }
    };
    clearRow.appendChild(clearBtn);
    container.appendChild(clearRow);
  }
  function __wdvUrl() {
    const c = __storeVal(__wdvCfg);
    let p = (c.path || "").trim().replace(/^\/+|\/+$/g, "");
    if (!p)
      p = "PT_Masonry_Sync.json";
    if (!/\.[^/]+$/.test(p))
      p += "/PT_Masonry_Sync.json";
    else
      p = p.replace(/[^/]+$/, "PT_Masonry_Sync.json");
    return (c.url || "").replace(/\/+$/, "") + "/" + p;
  }
  async function __wdvReadFull() {
    const c = __storeVal(__wdvCfg);
    if (!c.url)
      return { version: 2, sites: {}, pages: {} };
    const r = await __wdvFetch(__wdvUrl(), "GET", null);
    if (r.status === 404) {
      const legacy = { sites: {}, pages: {} };
      const base = (c.url || "").replace(/\/+$/, "");
      async function fetchLegacy(name, parse) {
        try {
          const gr = await __wdvFetch(base + "/" + name, "GET", null);
          if (gr.status >= 200 && gr.status < 300)
            return parse(JSON.parse(gr.responseText || "{}"));
        } catch (e) {
        }
        return null;
      }
      const host = location.hostname;
      const gj = await fetchLegacy(host + ".json", function(j) {
        const so = {};
        if (Array.isArray(j.ids))
          so.readIds = j.ids;
        if (j.config && typeof j.config.masonry === "string")
          so.config = j.config;
        return so.readIds || so.config ? so : null;
      });
      if (gj)
        legacy.sites[host] = gj;
      const pj = await fetchLegacy("PT_Masonry_PageMax.json", function(j) {
        return j && typeof j === "object" ? j : {};
      });
      if (pj)
        legacy.pages = pj;
      return Object.assign({ version: 2, sites: {}, pages: {} }, legacy);
    }
    if (r.status >= 200 && r.status < 300) {
      let j = {};
      try {
        j = JSON.parse(r.responseText || "{}") || {};
      } catch (e) {
        j = {};
      }
      if (!j.sites || typeof j.sites !== "object")
        j.sites = {};
      if (!j.pages || typeof j.pages !== "object")
        j.pages = {};
      return j;
    }
    throw new Error("读取同步文件失败 HTTP " + r.status);
  }
  async function __wdvWriteFull(full) {
    const r = await __wdvFetch(__wdvUrl(), "PUT", JSON.stringify(full));
    if (r.status < 200 || r.status >= 300)
      throw new Error("上传失败 HTTP " + r.status);
  }
  function __wdvAuth() {
    const c = __storeVal(__wdvCfg);
    return "Basic " + btoa(unescape(encodeURIComponent((c.user || "") + ":" + (c.pass || ""))));
  }
  function __wdvFetch(url, method, body) {
    const auth = __wdvAuth();
    return new Promise(function(resolve, reject) {
      if (typeof GM_xmlhttpRequest === "function") {
        GM_xmlhttpRequest({
          method,
          url,
          headers: { Authorization: auth, "Content-Type": "application/json" },
          data: body || void 0,
          timeout: 3e4,
          onload: function(r) {
            resolve(r);
          },
          onerror: function() {
            reject(new Error("网络错误(目标服务器不可达或未开跨域)"));
          },
          ontimeout: function() {
            reject(new Error("请求超时(30s)"));
          }
        });
      } else {
        fetch(url, {
          method,
          headers: { Authorization: auth, "Content-Type": "application/json" },
          body
        }).then(
          function(r) {
            r.text().then(function(t) {
              resolve({ status: r.status, responseText: t });
            });
          },
          function(e) {
            reject(e);
          }
        );
      }
    });
  }
  async function __wdvUpload(force) {
    const c = __storeVal(__wdvCfg);
    if (!c.url || !c.pass)
      throw new Error("请先填写 WebDAV 配置");
    const host = location.hostname;
    const ids = [...__storeVal(__readIds)];
    const cfgStr = localStorage.getItem("Kesa:Masonry") || "{}";
    const fallStr = localStorage.getItem("Kesa:Fall") || "{}";
    const idsLocalKey = ids.join(",");
    const snapIds = GM_getValue("pt_sync_idsSnap", "");
    const snapCfg = GM_getValue("pt_sync_cfgSnap", "");
    const snapFall = GM_getValue("pt_sync_cfgFallSnap", "");
    if (!force && idsLocalKey === snapIds && cfgStr === snapCfg && fallStr === snapFall) {
      const pagesDirty = typeof window.__kesaPageSync === "function" && window.__kesaPageSync("isDirty");
      if (!pagesDirty)
        return "无变化, 跳过上传(节省流量)";
    }
    const full = await __wdvReadFull();
    const sites = full.sites || {};
    const st = sites[host] || {};
    const stIds = Array.isArray(st.readIds) ? st.readIds : [];
    const merged = [.../* @__PURE__ */ new Set([...stIds, ...ids])];
    sites[host] = {
      readIds: merged,
      config: { masonry: cfgStr, fall: fallStr }
    };
    full.sites = sites;
    if (typeof window.__kesaPageSync === "function") {
      const pg = window.__kesaPageSync("get");
      if (pg && typeof pg === "object")
        full.pages = pg;
    }
    full.updated = Date.now();
    await __wdvWriteFull(full);
    if (merged.length !== __storeVal(__readIds).length) {
      __readIds.set(merged);
      __applyReadClasses();
    }
    GM_setValue("pt_sync_idsSnap", merged.join(","));
    GM_setValue("pt_sync_cfgSnap", cfgStr);
    GM_setValue("pt_sync_cfgFallSnap", fallStr);
    if (typeof window.__kesaPageSync === "function")
      window.__kesaPageSync("setDirty", false);
    return "已上传 " + merged.length + " 条已读标记 + 页码";
  }
  async function __wdvDownload(updateHistSnapshot) {
    const c = __storeVal(__wdvCfg);
    if (!c.url || !c.pass)
      throw new Error("请先填写 WebDAV 配置");
    const host = location.hostname;
    const full = await __wdvReadFull();
    const st = (full.sites || {})[host] || {};
    const remote = Array.isArray(st.readIds) ? st.readIds : [];
    const merged = [.../* @__PURE__ */ new Set([...__storeVal(__readIds), ...remote])];
    if (updateHistSnapshot)
      __historyReadSnapshot = [...merged];
    __readIds.set(merged);
    __applyReadClasses();
    let cfgMsg = "";
    if (st.config && typeof st.config.masonry === "string") {
      try {
        const far = JSON.parse(st.config.masonry);
        const local = JSON.parse(localStorage.getItem("Kesa:Masonry") || "{}");
        let changed = false;
        for (const k in far) {
          if (local[k] === void 0) {
            local[k] = far[k];
            changed = true;
          }
        }
        if (changed) {
          localStorage.setItem("Kesa:Masonry", JSON.stringify(local));
          cfgMsg = "，配置已同步(刷新后生效)";
        }
      } catch (e) {
      }
    }
    let pageMsg = "";
    if (typeof window.__kesaPageSync === "function" && full.pages && typeof full.pages === "object") {
      pageMsg = window.__kesaPageSync("merge", full.pages) || "";
    }
    return "已下载并合并, 共 " + merged.length + " 条已读标记" + cfgMsg + (pageMsg ? "，" + pageMsg : "");
  }
  function __wdvAutoRun(fn, tag) {
    try {
      const c = __storeVal(__wdvCfg);
      if (!c.url || !c.pass)
        return;
      fn().then(function(m) {
        console.log("[WebDAV] " + tag + ":", m);
      }).catch(function(e) {
        console.warn("[WebDAV] " + tag + "失败:", e.message);
      });
    } catch (e) {
    }
  }
  function __wdvAutoSync() {
    const last = parseInt(GM_getValue("pt_sync_lastGetIds", "0"), 10) || 0;
    if (Date.now() - last < 10 * 6e4)
      return;
    GM_setValue("pt_sync_lastGetIds", String(Date.now()));
    __wdvAutoRun(function() {
      return __wdvDownload(true);
    }, "打开页面自动同步");
  }
  function __wdvAutoPush() {
    __wdvAutoRun(function() {
      return __wdvUpload(false);
    }, "关闭页面自动上传");
  }
  window.__kesaWdSync = function(action) {
    try {
      if (action === "upload")
        return __wdvUpload(true);
      if (action === "autopush")
        return __wdvUpload(false);
      if (action === "download")
        return __wdvDownload();
    } catch (e) {
      return Promise.reject(e);
    }
    return Promise.resolve("未操作");
  };
  function __kesaStateKey() {
    return "__kesaState_" + location.hostname;
  }
  function __kesaSavePageState(n) {
    try {
      if (window.__kesaRestoring)
        return;
      const key = __kesaStateKey();
      const st = JSON.parse(localStorage.getItem(key) || "null") || {};
      st.page = n || 1;
      const u = new URL(location.href);
      u.searchParams.delete("page");
      u.searchParams.delete("pageNumber");
      st.url = u.toString();
      st.ts = Date.now();
      localStorage.setItem(key, JSON.stringify(st));
      try {
        sessionStorage.setItem("__kesa_lastUrl", location.href);
      } catch (e2) {
      }
    } catch (e) {
    }
  }
  function __kesaRestorePage() {
    try {
      let navType = "";
      try {
        const nav = performance.getEntriesByType("navigation")[0];
        navType = nav ? nav.type : "";
      } catch (e) {
      }
      if (navType && navType !== "reload") {
        try {
          sessionStorage.setItem("__kesa_lastUrl", location.href);
        } catch (e2) {
        }
        return;
      }
      const st = JSON.parse(localStorage.getItem(__kesaStateKey()) || "null");
      if (!st || !st.page || st.page < 1)
        return;
      const last = sessionStorage.getItem("__kesa_lastUrl");
      if (!last) {
        try {
          sessionStorage.setItem("__kesa_lastUrl", location.href);
        } catch (e2) {
        }
        return;
      }
      const base = (u2) => {
        const x = new URL(u2);
        x.searchParams.delete("page");
        x.searchParams.delete("pageNumber");
        return x.toString();
      };
      if (base(location.href) !== base(last)) {
        try {
          sessionStorage.setItem("__kesa_lastUrl", location.href);
        } catch (e2) {
        }
        return;
      }
      const isNX = __kesaIsNX();
      const u = new URL(location.href);
      const cur = Number(u.searchParams.get(isNX ? "page" : "pageNumber")) || 1;
      if (cur === st.page)
        return;
      const target = new URL(st.url || location.href);
      target.searchParams.set(isNX ? "page" : "pageNumber", st.page);
      console.log("[恢复页码] 刷新后跳转:", target.toString(), "saved=", st.page, "cur=", cur);
      window.__kesaRestoring = true;
      location.replace(target.toString());
    } catch (e) {
    }
  }
  function __kesaIsNX() {
    return /\.php/i.test(location.pathname);
  }
  function __kesaCurPage() {
    try {
      const sp = new URLSearchParams(location.search);
      const v = parseInt(sp.get("page") || sp.get("pageNumber") || sp.get("p") || "", 10);
      return isNaN(v) || v < 1 ? 1 : v;
    } catch (e) {
      return 1;
    }
  }
  function __kesaPageUrl(n) {
    try {
      const u = new URL(location.href);
      u.searchParams.delete("page");
      u.searchParams.delete("pageNumber");
      u.searchParams.set(__kesaIsNX() ? "page" : "pageNumber", n);
      return u.toString();
    } catch (e) {
      return location.href;
    }
  }
  function __kesaPageInd(n) {
    try {
      if (!document.getElementById("__kesaPageCss")) {
        const st = document.createElement("style");
        st.id = "__kesaPageCss";
        st.textContent = ".kesaPageGo{display:block;text-align:center;font-size:11px;font-weight:600;color:#fff;background:rgba(64,64,64,.85);border-radius:8px;padding:3px 6px;margin:4px 6px;line-height:1.5;cursor:pointer}.kesaPageGo:hover{background:#0054b0}";
        (document.head || document.documentElement).appendChild(st);
      }
      const cur = n || __kesaCurPage();
      __kesaSavePageState(cur);
      const sb = document.querySelector(".sideP");
      if (!sb)
        return;
      let el = document.querySelector(".kesaPageGo");
      if (!el) {
        el = document.createElement("div");
        el.className = "kesaPageGo";
        el.addEventListener("click", () => {
          const pg = parseInt(el.dataset.page, 10) || 1;
          __kesaSavePageState(pg);
          location.href = __kesaPageUrl(pg);
        });
        sb.appendChild(el);
      }
      el.dataset.page = String(cur);
      el.textContent = "第 " + cur + " 页";
    } catch (e) {
    }
  }
  (function() {
    function __pmGet() {
      try {
        return JSON.parse(GM_getValue("pt_pagemax", "null")) || {};
      } catch (e) {
        return {};
      }
    }
    function __pmSet(st) {
      try {
        GM_setValue("pt_pagemax", JSON.stringify(st));
      } catch (e) {
      }
    }
    function __pmNormKey(u) {
      try {
        const x = new URL(u);
        x.searchParams.delete("page");
        x.searchParams.delete("pageNumber");
        if (x.searchParams.get("inclbookmarked") === "0")
          x.searchParams.delete("inclbookmarked");
        if (x.searchParams.get("spstate") === "0")
          x.searchParams.delete("spstate");
        if (x.searchParams.get("incldead") === "1")
          x.searchParams.delete("incldead");
        return x.toString();
      } catch (e) {
        return u;
      }
    }
    function __pmKey() {
      return __pmNormKey(location.href);
    }
    function __pmMigrate() {
      try {
        const st = __pmGet();
        let changed = false;
        for (const k in st) {
          const nk = __pmNormKey(k);
          if (nk !== k) {
            if (!st[nk] || st[k].max > st[nk].max)
              st[nk] = st[k];
            delete st[k];
            changed = true;
          }
        }
        if (changed)
          __pmSet(st);
      } catch (e) {
      }
    }
    function __pmMaxFor(key) {
      const e = __pmGet()[key];
      return e && e.max ? e.max : 0;
    }
    let __pmDirty = false;
    function __pmRecord(pg) {
      try {
        const host = __pmKey();
        const st = __pmGet();
        const cur = st[host];
        if (!cur || pg > (cur.max || 0)) {
          st[host] = { max: pg };
          __pmSet(st);
          __pmDirty = true;
        }
      } catch (e) {
      }
    }
    window.__kesaPageSync = function(action, data) {
      try {
        if (action === "get")
          return __pmGet();
        if (action === "merge" && data && typeof data === "object") {
          const st = __pmGet();
          let changed = false;
          let maxCur = 0;
          for (const h in data) {
            const rv = data[h] && data[h].max || 0;
            const lv = st[h] && st[h].max || 0;
            if (rv > lv) {
              st[h] = { max: rv };
              changed = true;
            }
            if (rv > maxCur)
              maxCur = rv;
          }
          if (changed)
            __pmSet(st);
          return changed ? "已合并页码(当前站最大 " + maxCur + " 页)" : "";
        }
        if (action === "isDirty")
          return !!__pmDirty;
        if (action === "setDirty") {
          __pmDirty = !!data;
          return;
        }
        if (action === "clearLocal") {
          __pmSet({});
          __pmDirty = true;
          return;
        }
      } catch (e) {
      }
      return void 0;
    };
    function __pmCurrentPage() {
      try {
        const go = document.querySelector(".kesaPageGo");
        if (go) {
          const n = parseInt(go.dataset.page, 10);
          if (!isNaN(n) && n >= 1)
            return n;
        }
      } catch (e) {
      }
      try {
        const u = new URL(location.href);
        const isNX = /\.php/i.test(location.pathname);
        const n = parseInt(u.searchParams.get(isNX ? "page" : "pageNumber"), 10);
        return isNaN(n) ? 1 : n;
      } catch (e) {
        return 1;
      }
    }
    function __pmUrlForPage(pg) {
      try {
        const u = new URL(location.href);
        u.searchParams.delete("page");
        u.searchParams.delete("pageNumber");
        u.searchParams.set(/\.php/i.test(location.pathname) ? "page" : "pageNumber", String(Math.max(1, pg)));
        return u.toString();
      } catch (e) {
        return location.href;
      }
    }
    function __pmBtn() {
      try {
        const sb = document.querySelector(".sideP");
        if (!sb)
          return;
        let el = document.querySelector(".kesaPageMaxGo");
        if (!el) {
          el = document.createElement("div");
          el.className = "kesaPageMaxGo";
          el.title = "打开本PT站历史最大页码(多设备WebDAV同步)";
          el.addEventListener("click", function() {
            const m2 = __pmMaxFor(__pmKey());
            if (m2 < 1) {
              el.textContent = "暂无页码记录";
              setTimeout(function() {
                if (el.isConnected)
                  el.textContent = "最大页码: -";
              }, 1500);
              return;
            }
            el.textContent = "正在打开第 " + m2 + " 页...";
            location.href = __pmUrlForPage(m2);
          });
          sb.appendChild(el);
        }
        const m = __pmMaxFor(__pmKey());
        el.textContent = m >= 1 ? "最大 " + m + " 页" : "最大页码: -";
      } catch (e) {
      }
    }
    let __pmSelLog = 0;
    function __pmPageSel() {
      try {
        const old = document.getElementById("kesaMtPageSel");
        if (old) {
          const c = __pmCurrentPage();
          const curEl = document.getElementById("kesaMtPageSelCur");
          if (curEl)
            curEl.textContent = "第 " + c + " 页";
          const prevBtn = document.getElementById("kesaMtPageSelPrev");
          if (prevBtn)
            prevBtn.disabled = c <= 1;
          return;
        }
        let btn = document.getElementById("turnPage");
        if (!btn) {
          const all = document.querySelectorAll("button");
          for (let i = 0; i < all.length; i++) {
            if (all[i].textContent.indexOf("加载下一页") >= 0) {
              btn = all[i];
              break;
            }
          }
        }
        let wrap = null;
        let afterWf = false;
        if (btn) {
          wrap = btn.parentElement || btn.parentNode;
        } else {
          const wf = document.querySelector("div.waterfall");
          if (wf && wf.parentNode) {
            afterWf = true;
            wrap = wf;
          }
          if (!wrap) {
            if (__pmSelLog++ < 3)
              console.log("[kesa] 页码选择器: 未找到可注入位置");
            return;
          }
        }
        if (!wrap)
          return;
        const box = document.createElement("div");
        box.id = "kesaMtPageSel";
        box.style.cssText = "display:flex;align-items:center;gap:6px;justify-content:center;margin-top:8px;flex-wrap:wrap;";
        const btnStyle = "border:none;background:#3fa7d6;color:#fff;border-radius:4px;padding:4px 12px;font-size:12px;cursor:pointer;";
        const prev = document.createElement("button");
        prev.id = "kesaMtPageSelPrev";
        prev.textContent = "◀ 上一页";
        prev.style.cssText = btnStyle;
        prev.onclick = function() {
          location.href = __pmUrlForPage(__pmCurrentPage() - 1);
        };
        const cur = document.createElement("span");
        cur.id = "kesaMtPageSelCur";
        cur.style.cssText = "color:#333;font-size:12px;font-weight:600;min-width:52px;text-align:center;";
        cur.textContent = "第 " + __pmCurrentPage() + " 页";
        const next = document.createElement("button");
        next.textContent = "下一页 ▶";
        next.style.cssText = btnStyle;
        next.onclick = function() {
          location.href = __pmUrlForPage(__pmCurrentPage() + 1);
        };
        const inp = document.createElement("input");
        inp.type = "number";
        inp.min = "1";
        inp.placeholder = "N";
        inp.style.cssText = "width:56px;border:1px solid #ccc;border-radius:4px;padding:2px 6px;font-size:12px;text-align:center;";
        const go = document.createElement("button");
        go.textContent = "跳转";
        go.style.cssText = btnStyle;
        go.onclick = function() {
          const n = parseInt(inp.value, 10);
          if (!n || n < 1)
            return;
          location.href = __pmUrlForPage(n);
        };
        inp.addEventListener("keydown", function(e) {
          if (e.key === "Enter")
            go.onclick();
        });
        box.appendChild(prev);
        box.appendChild(cur);
        box.appendChild(next);
        box.appendChild(inp);
        box.appendChild(go);
        if (afterWf)
          wrap.insertAdjacentElement("afterend", box);
        else
          wrap.appendChild(box);
        prev.disabled = __pmCurrentPage() <= 1;
        console.log("[kesa] 页码选择器已注入");
      } catch (e) {
      }
    }
    try {
      if (!document.getElementById("__kesaPageMaxCss")) {
        const st = document.createElement("style");
        st.id = "__kesaPageMaxCss";
        st.textContent = ".kesaPageMaxGo{display:block;text-align:center;font-size:11px;font-weight:600;color:#ff0;background:rgba(64,64,64,.85);border-radius:8px;padding:3px 6px;margin:4px 6px;line-height:1.5;cursor:pointer}.kesaPageMaxGo:hover{background:#6531ff}";
        (document.head || document.documentElement).appendChild(st);
      }
    } catch (e) {
    }
    let __pmLastPage = 0;
    __pmMigrate();
    setTimeout(function() {
      __pmPageSel();
      __pmBtn();
    }, 1e3);
    setInterval(function() {
      try {
        const pg = __pmCurrentPage();
        if (pg !== __pmLastPage) {
          __pmLastPage = pg;
          __pmRecord(pg);
        }
        __pmMigrate();
        __pmBtn();
        __pmPageSel();
      } catch (e) {
      }
    }, 2e3);
  })();
  window.__kesaRead = {
    readIds: __readIds,
    hideReadCards: __hideReadCards,
    hideHistoryRead: __hideHistoryRead,
    historyReadSnapshot: __historyReadSnapshot,
    markRead: __markRead,
    applyReadClasses: __applyReadClasses,
    applyHideReadCards: __applyHideReadCards,
    applyHideNameFilter: __applyHideNameFilter,
    initReadTracking: __initReadTracking,
    extractId: __extractId
  };
  window.__kesaWd = {
    cfg: __wdvCfg,
    nameFilter: __nameFilter,
    bTags: __bTags,
    aTags: __aTags,
    showInfoOnPicFail: __showInfoOnPicFail,
    stateHoverPic: __stateHoverPic,
    upload: __wdvUpload,
    download: __wdvDownload,
    autoSync: __wdvAutoSync,
    autoPush: __wdvAutoPush
  };
  window.__kesaPage = {
    stateKey: __kesaStateKey,
    savePageState: __kesaSavePageState,
    restorePage: __kesaRestorePage,
    isNX: __kesaIsNX,
    curPage: __kesaCurPage,
    pageUrl: __kesaPageUrl,
    pageInd: __kesaPageInd,
    mkSwitchRow: __mkSwitchRow,
    fillWebDAVSection: __fillWebDAVSection,
    fillReadSection: __fillReadSection,
    fillNameFilterSection: __fillNameFilterSection,
    fillTagSection: __fillTagSection,
    fillCardInfoSectionObserver: __fillCardInfoSectionObserver
  };
  const CONFIG$1 = {
    /** 默认的种子表格 dom selector */
    torrentListTable: "table.torrents",
    /** 将 种子列表dom 的信息变为 json对象列表 */
    TORRENT_LIST_TO_JSON: TORRENT_LIST_TO_JSON$1,
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
    /** NOTE: 站点特殊操作 */
    special: function() {
      $("ksearchboxmain") ? $("ksearchboxmain").style.display = "none" : null;
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
  function TORRENT_LIST_TO_JSON$1(torrent_list_Dom) {
    const rows = torrent_list_Dom.querySelectorAll("tbody tr");
    const data = [];
    rows.forEach((row) => {
      const categoryImg = row.querySelector("td:nth-child(1) > a > img");
      const category = categoryImg ? categoryImg.alt : "";
      if (!category)
        return;
      const _all = get_store_value(__aTags);
      if (!_all.includes(category))
        __aTags.set([..._all, category]);
      if (get_store_value(__bTags).includes(category))
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
      403: "#c74854",
      // TV SD
      402: "#276fb8",
      // TV HD
      435: "#4dbebd ",
      // TV DVD
      438: "#1897d6",
      // TV BluRay
      404: "#23ac38",
      // 纪录教育
      405: "#996c34",
      // Anime
      407: "#23ac38",
      // Sport
      422: "#f39800",
      // Software
      423: "#f39800",
      // Game
      427: "#f39800",
      // EBook
      409: "#996c34",
      // Other
      // 音乐分类
      406: "#8a57a1",
      // MV
      408: "#8a57a1",
      // Music AAC/ALAC
      434: "#8a57a1"
      // Music 无损
    },
    /** 索引 */
    INDEX: 0,
    /** iframe 宽度 */
    Iframe_Width: 1260,
    /** NOTE: 站点特殊操作 */
    special: function() {
      table_Iframe_Set();
    },
    /** NOTE: 站点下一页加载后操作 */
    pageLoaded: function() {
      table_Iframe_Set();
    }
  };
  function table_Iframe_Set() {
    const lists = Array.from(document.querySelectorAll("td.torrentimg a"));
    lists.forEach((el) => el.addEventListener("click", function(event) {
      event.preventDefault();
      _iframe_switch.set(1);
      _iframe_url.set(el.href + "#kdescr");
    }));
  }
  function TORRENT_LIST_TO_JSON(torrent_list_Dom) {
    const rows = torrent_list_Dom.querySelectorAll("tbody tr");
    const data = [];
    rows.forEach((row) => {
      const categoryImg = row.querySelector("td:nth-child(1) > a > img");
      const category = categoryImg ? categoryImg.title : "";
      if (!category)
        return;
      const categoryLinkDOM = categoryImg.parentNode;
      const categoryLink = categoryLinkDOM.href;
      const categoryNumber = categoryLink.slice(-3);
      const str = categoryImg.style.backgroundImage;
      const regex = /url\("(.*)"\)/;
      const result = str.match(regex);
      const _categoryImg = result && result.length > 1 ? result[1] : null;
      const torrentIndex = CONFIG.INDEX++;
      const torrentNameLink = row.querySelector(".torrentname a");
      const torrentName = torrentNameLink ? torrentNameLink.title.trim() : "";
      const torrentLink = torrentNameLink.href;
      const pattern = /id=(\d+)&hit/;
      const match = torrentLink.match(pattern);
      const torrentId = match ? parseInt(match[1]) : null;
      const imgDom = row.querySelector(".torrentname img");
      const _mouseOver = imgDom.getAttribute("onmouseover");
      const raw1 = _mouseOver ? _mouseOver.split(",")[2].toString() : "";
      const picLink = raw1 ? raw1.slice(raw1.indexOf("'") + 1, raw1.lastIndexOf("'")) : "/pic/nopic.jpg";
      const desCell = row.querySelector(".torrentname td:nth-child(2)");
      const length = desCell.childNodes.length - 1;
      const desDom = desCell.childNodes[length];
      const description = desDom.nodeName == "#text" ? desDom.textContent.trim() : "";
      const place_at_the_top = row.querySelectorAll(".torrentname img.sticky");
      const pattMsg = place_at_the_top[0] ? place_at_the_top[0].title : "";
      const tempTagDom = row.querySelectorAll(".torrentname font");
      const freeTypeImg = row.querySelector('img[class^="pro_"]');
      const freeType = freeTypeImg ? "_" + freeTypeImg.alt.replace(/\s+/g, "") : "";
      const freeRemainingTimeSpan = row.querySelector(".torrentname td:nth-child(2) span");
      const freeRemainingTime = freeRemainingTimeSpan ? freeRemainingTimeSpan.innerText : "";
      const tagSpans = row.querySelectorAll(".torrentname img[class^='label_']");
      const tagsDOM = Array.from(tagSpans);
      let tags = tagSpans ? tagsDOM.map((el) => el.title.trim()) : [];
      const raw_tags = tagsDOM.map((el) => el.outerHTML).join("&nbsp;");
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
        comments,
        upload_date: uploadDate,
        size,
        seeders,
        leechers,
        snatched
      };
      data.push(rowData);
    });
    return data;
  }
  const __isPTT = /pttime\.org|nicept\.net|ptfans\.cc/i.test(location.hostname);
  function __ksDetailUrl(it) {
    if (__isPTT)
      return it && it.torrentLink || "/details.php?id=" + it.id + "&hit=1";
    return "/detail/" + it.id;
  }
  const __PTT_CAT_MAP = {
    "100": "100",
    "401": "401",
    "402": "402",
    "403": "407",
    "404": "408",
    "405": "450",
    "406": "404",
    "407": "405",
    "408": "405",
    "409": "423",
    "411": "406",
    "412": "449",
    "420": "443",
    "421": "450",
    "422": "422",
    "423": "450",
    "430": "450"
  };
  function __pttParseSize(s) {
    s = (s || "").trim().toUpperCase();
    const m = s.match(/([\d.]+)\s*(B|KB|MB|GB|TB)/);
    if (!m)
      return 0;
    const mult = { B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 }[m[2]] || 1;
    return Math.round(parseFloat(m[1]) * mult);
  }
  function __pttParseCreated(s) {
    s = (s || "").trim();
    let d = /* @__PURE__ */ new Date();
    let yr = s.match(/(\d+)\s*年/), mo = s.match(/(\d+)\s*月/), wk = s.match(/(\d+)\s*周/), dy = s.match(/(\d+)\s*天/), hr = s.match(/(\d+)\s*时/);
    if (yr)
      d.setFullYear(d.getFullYear() - parseInt(yr[1]));
    if (mo)
      d.setMonth(d.getMonth() - parseInt(mo[1]));
    if (wk)
      d.setDate(d.getDate() - parseInt(wk[1]) * 7);
    if (dy)
      d.setDate(d.getDate() - parseInt(dy[1]));
    if (hr)
      d.setHours(d.getHours() - parseInt(hr[1]));
    return d.toISOString();
  }
  const __NX_CFG = {
    "pttime.org": { table: "#torrenttable", cSize: 10, cSeeders: 11, cLeechers: 12, cCompleted: 13, cComments: 7, cCreated: 9, discFont: true },
    "nicept.net": { table: "table.torrents", cSize: 7, cSeeders: 8, cLeechers: 9, cCompleted: 10, cComments: 5, cCreated: 6, discFont: false },
    "ptfans.cc": { table: "table.torrents", cSize: 8, cSeeders: 9, cLeechers: 10, cCompleted: 11, cComments: 6, cCreated: 7, discFont: false }
  };
  function __nxHost() {
    return location.hostname.replace(/^www\./, "");
  }
  function __pttParse(doc) {
    const d = doc || document;
    const cfg = __NX_CFG[__nxHost()] || { table: "#torrenttable", cSize: 10, cSeeders: 11, cLeechers: 12, cCompleted: 13, cComments: 7, cCreated: 9, discFont: true };
    const table = d.querySelector(cfg.table) || d.getElementById("torrenttable") || d.querySelector("table.torrents");
    if (!table)
      return [];
    const rows = Array.from(table.querySelectorAll("tr"));
    const out = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const cells = Array.from(row.querySelectorAll("td"));
      if (cells.length < 12)
        continue;
      const detailLink = Array.from(row.querySelectorAll('a[href*="details.php"]')).find(
        (a) => !/userdetails/i.test(a.href) && /details\.php\?id=/.test(a.href)
      );
      if (!detailLink)
        continue;
      try {
        const href = detailLink.href;
        const idM = href.match(/id=(\d+)/);
        const id = idM ? idM[1] : "";
        const name = (detailLink.textContent || "").trim();
        let category = "";
        const catA = cells[0] && cells[0].querySelector('a[href*="cat="]');
        if (catA) {
          const cm = catA.href.match(/cat=(\d+)/);
          if (cm)
            category = __PTT_CAT_MAP[cm[1]] || cm[1];
        }
        let imageList = [];
        try {
          const imgs = row.querySelectorAll("td.torrentimg img, img.nexus-lazy-load, img.lazy-image, td.torrentimg a img");
          for (let k = 0; k < imgs.length; k++) {
            const im = imgs[k];
            let s = im.getAttribute("data-src") || im.getAttribute("src") || im.getAttribute("data-original") || "";
            if (!s)
              continue;
            if (/pic\/|trans\.gif|spacer|noimage|noposter|blank\.|loading\.gif/i.test(s))
              continue;
            if (s.startsWith("//"))
              s = location.protocol + s;
            else if (s.startsWith("/"))
              s = location.origin + s;
            else if (!/^https?:/i.test(s))
              s = location.origin + "/" + s;
            if (s) {
              imageList = [s];
              break;
            }
          }
        } catch (e) {
        }
        if (!imageList.length && /ptfans\.cc/i.test(location.hostname)) {
          try {
            if ((window.__kesaImgDiag = (window.__kesaImgDiag || 0) + 1) <= 3) {
              console.log("[封面诊断] ptfans 无图行HTML:", (row.outerHTML || "").slice(0, 400));
            }
          } catch (e2) {
          }
        }
        const size = __pttParseSize(cells[cfg.cSize] ? cells[cfg.cSize].textContent : "");
        const seeders = parseInt((cells[cfg.cSeeders] ? cells[cfg.cSeeders].textContent : "") || "0") || 0;
        const leechers = parseInt((cells[cfg.cLeechers] ? cells[cfg.cLeechers].textContent : "") || "0") || 0;
        const completed = parseInt((cells[cfg.cCompleted] ? cells[cfg.cCompleted].textContent : "") || "0") || 0;
        const comments = parseInt((cells[cfg.cComments] ? cells[cfg.cComments].textContent : "") || "0") || 0;
        let discount = "NORMAL";
        if (cfg.discFont) {
          const pEl = row.querySelector("font.promotion");
          const pTxt = pEl ? pEl.textContent.trim() : "";
          discount = pTxt.includes("免费") ? "FREE" : pTxt.includes("50") || pTxt.includes("半") ? "PERCENT_50" : "NORMAL";
        } else {
          if (row.querySelector("img.pro_free, img.pro_free2up"))
            discount = "FREE";
          else if (row.querySelector("img.pro_2xfree"))
            discount = "2XFree";
          else if (row.querySelector("img.pro_50pctdown, img.pro_50pctup"))
            discount = "PERCENT_50";
        }
        let smallDescr = "";
        const subEl = detailLink.parentElement ? detailLink.parentElement.querySelector("font:not(.promotion)") : null;
        if (subEl)
          smallDescr = subEl.textContent.trim();
        let labels = 0;
        row.querySelectorAll("span.tags").forEach((t) => {
          const txt = t.textContent;
          if (txt.includes("DIY"))
            labels |= 1;
          if (txt.includes("国配"))
            labels |= 2;
          if (txt.includes("中字"))
            labels |= 4;
        });
        const createdDate = __pttParseCreated(cells[cfg.cCreated] ? cells[cfg.cCreated].textContent : "");
        out.push({
          name,
          id,
          size,
          smallDescr,
          labels,
          category,
          torrentLink: href,
          imageList,
          collection: false,
          status: { seeders, leechers, comments, discount, toppingLevel: 0, createdDate, discountEndTime: null }
        });
      } catch (e) {
      }
    }
    return out;
  }
  const SITE = {
    // ---- M-Team NEW_MT 站 (mteamHijack.js 劫持路由) ----
    "kp.m-team.cc": CONFIG,
    "xp.m-team.cc": CONFIG,
    "ap.m-team.cc": CONFIG,
    "test2.m-team.cc": CONFIG,
    // ---- NexusPHP DOM 站 (ptt.js 的 __pttParse 逻辑) ----
    "kamept.com": CONFIG$1,
    "pttime.org": { ...CONFIG$1, torrentListTable: "#torrenttable" },
    "www.pttime.org": { ...CONFIG$1, torrentListTable: "#torrenttable" },
    "nicept.net": { ...CONFIG$1, torrentListTable: "table.torrents" },
    "ptfans.cc": { ...CONFIG$1, torrentListTable: "table.torrents" },
    // mua.xloli.cc 为 NexusPHP(torrents.php), 列结构与 kamept 一致
    "mua.xloli.cc": CONFIG$1
  };
  function IS_MT(domain) {
    return /(?:kp|xp|ap|test2)\.m-team\.cc/i.test(domain || "");
  }
  function GET_CURRENT_PT_DOMAIN() {
    const domain = window.location.hostname;
    return domain;
  }
  function GET_TORRENT_LIST_SELECTOR() {
    var _a;
    const domain = GET_CURRENT_PT_DOMAIN();
    console.log("|-> 当前站点: ", domain);
    console.log("|-> 当前页面: ", window.location.pathname);
    const res = ((_a = SITE[domain]) == null ? void 0 : _a.torrentListTable) ?? null;
    console.log("|-> 站点selector:", res);
    return res;
  }
  function create_else_block_4(ctx) {
    let div0;
    let t1;
    let div1;
    return {
      c() {
        div0 = element("div");
        div0.innerHTML = `<svg viewBox="0 0 32 32" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1 {
                  fill: none;
                  stroke: #000;
                  stroke-linecap: round;
                  stroke-linejoin: round;
                  stroke-width: 2px;
                }
              </style></defs><title></title><g data-name="43-browser" id="_43-browser"><rect class="cls-1" height="30" width="30" x="1" y="1"></rect><line class="cls-1" x1="1" x2="31" y1="9" y2="9"></line><line class="cls-1" x1="5" x2="7" y1="5" y2="5"></line><line class="cls-1" x1="11" x2="13" y1="5" y2="5"></line><line class="cls-1" x1="9" x2="25" y1="16" y2="16"></line><line class="cls-1" x1="7" x2="25" y1="20" y2="20"></line><line class="cls-1" x1="7" x2="25" y1="24" y2="24"></line></g></svg>`;
        t1 = space();
        div1 = element("div");
        div1.textContent = "原有列表";
      },
      m(target, anchor) {
        insert(target, div0, anchor);
        insert(target, t1, anchor);
        insert(target, div1, anchor);
      },
      d(detaching) {
        if (detaching)
          detach(div0);
        if (detaching)
          detach(t1);
        if (detaching)
          detach(div1);
      }
    };
  }
  function create_if_block_10(ctx) {
    let div0;
    let t0;
    let div1;
    return {
      c() {
        div0 = element("div");
        div0.innerHTML = `<svg enable-background="new 0 0 64 64" width="24" height="24" id="Layer_1" version="1.1" viewBox="0 0 64 64"><path d="M19,2.875H3.5c-0.829,0-1.5,0.671-1.5,1.5v19.979c0,0.829,0.671,1.5,1.5,1.5H19c0.829,0,1.5-0.671,1.5-1.5V4.375  C20.5,3.546,19.829,2.875,19,2.875z M17.5,22.854H5V5.875h12.5V22.854z" fill="white"></path><path d="M19,28.773H3.5c-0.829,0-1.5,0.671-1.5,1.5v6.166c0,0.828,0.671,1.5,1.5,1.5H19c0.829,0,1.5-0.672,1.5-1.5v-6.166  C20.5,29.445,19.829,28.773,19,28.773z M17.5,34.939H5v-3.166h12.5V34.939z" fill="white"></path><path d="M19,40.859H3.5c-0.829,0-1.5,0.672-1.5,1.5v17.266c0,0.828,0.671,1.5,1.5,1.5H19c0.829,0,1.5-0.672,1.5-1.5V42.359  C20.5,41.531,19.829,40.859,19,40.859z M17.5,58.125H5V43.859h12.5V58.125z" fill="white"></path><path d="M40,2.875H24.5c-0.829,0-1.5,0.671-1.5,1.5v14.25c0,0.829,0.671,1.5,1.5,1.5H40c0.828,0,1.5-0.671,1.5-1.5V4.375  C41.5,3.546,40.828,2.875,40,2.875z M38.5,17.125H26V5.875h12.5V17.125z" fill="white"></path><path d="M40,23.125H24.5c-0.829,0-1.5,0.671-1.5,1.5V46.5c0,0.828,0.671,1.5,1.5,1.5H40c0.828,0,1.5-0.672,1.5-1.5V24.625  C41.5,23.796,40.828,23.125,40,23.125z M38.5,45H26V26.125h12.5V45z" fill="white"></path><path d="M40,51H24.5c-0.829,0-1.5,0.672-1.5,1.5v7.125c0,0.828,0.671,1.5,1.5,1.5H40c0.828,0,1.5-0.672,1.5-1.5V52.5  C41.5,51.672,40.828,51,40,51z M38.5,58.125H26V54h12.5V58.125z" fill="white"></path><path d="M60.5,2.875H45c-0.828,0-1.5,0.671-1.5,1.5v35.171c0,0.828,0.672,1.5,1.5,1.5h15.5c0.828,0,1.5-0.672,1.5-1.5V4.375  C62,3.546,61.328,2.875,60.5,2.875z M59,38.046H46.5V5.875H59V38.046z" fill="white"></path><path d="M60.5,44.346H45c-0.828,0-1.5,0.672-1.5,1.5v13.779c0,0.828,0.672,1.5,1.5,1.5h15.5c0.828,0,1.5-0.672,1.5-1.5V45.846  C62,45.018,61.328,44.346,60.5,44.346z M59,58.125H46.5V47.346H59V58.125z" fill="white"></path></svg>`;
        t0 = space();
        div1 = element("div");
        div1.textContent = "瀑布流";
      },
      m(target, anchor) {
        insert(target, div0, anchor);
        insert(target, t0, anchor);
        insert(target, div1, anchor);
      },
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
  function create_if_block_9$1(ctx) {
    let button0;
    let t1;
    let button1;
    let t3;
    let button2;
    let t4;
    let t5;
    let t6;
    let button3;
    let mounted;
    let dispose;
    return {
      c() {
        button0 = element("button");
        button0.textContent = "[d]切换宽度";
        t1 = space();
        button1 = element("button");
        button1.textContent = "[d]显示详情";
        t3 = space();
        button2 = element("button");
        t4 = text("[d]");
        t5 = text(
          /*label_switchMode*/
          ctx[1]
        );
        t6 = space();
        button3 = element("button");
        button3.textContent = "[d]iframe";
        attr(button0, "class", "sideP__btn svelte-mdsgbd");
        attr(button1, "class", "sideP__btn svelte-mdsgbd");
        attr(button2, "class", "sideP__btn svelte-mdsgbd");
        attr(button3, "class", "sideP__btn svelte-mdsgbd");
      },
      m(target, anchor) {
        insert(target, button0, anchor);
        insert(target, t1, anchor);
        insert(target, button1, anchor);
        insert(target, t3, anchor);
        insert(target, button2, anchor);
        append(button2, t4);
        append(button2, t5);
        insert(target, t6, anchor);
        insert(target, button3, anchor);
        if (!mounted) {
          dispose = [
            listen(
              button0,
              "click",
              /*config_changeWidth*/
              ctx[23]
            ),
            listen(
              button1,
              "click",
              /*config_showAllDetails*/
              ctx[24]
            ),
            listen(
              button2,
              "click",
              /*config_switchMode*/
              ctx[25]
            ),
            listen(
              button3,
              "click",
              /*config_changeLoadMode*/
              ctx[26]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*label_switchMode*/
        2)
          set_data(
            t5,
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
        if (detaching)
          detach(t6);
        if (detaching)
          detach(button3);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_if_block$4(ctx) {
    let div14;
    let div13;
    let div0;
    let p;
    let t1;
    let button0;
    let t2;
    let show_if = /m-team\.cc/i.test(
      /*$_current_domain*/
      ctx[9]
    );
    let t3;
    let div2;
    let h10;
    let t5;
    let div1;
    let switch0;
    let updating_checked;
    let t6;
    let switch1;
    let updating_checked_1;
    let t7;
    let switch2;
    let updating_checked_2;
    let t8;
    let switch3;
    let updating_checked_3;
    let t9;
    let switch4;
    let updating_checked_4;
    let t10;
    let t11;
    let switch5;
    let t12;
    let switch6;
    let updating_checked_5;
    let t13;
    let switch7;
    let updating_checked_6;
    let t14;
    let button1;
    let t16;
    let t17;
    let div4;
    let h11;
    let t19;
    let div3;
    let switch8;
    let t20;
    let switch9;
    let t21;
    let switch10;
    let t22;
    let switch11;
    let t23;
    let switch12;
    let t24;
    let div8;
    let h12;
    let t26;
    let div5;
    let switch13;
    let updating_checked_7;
    let t27;
    let div7;
    let h3;
    let t29;
    let div6;
    let switch14;
    let updating_checked_8;
    let t30;
    let switch15;
    let updating_checked_9;
    let t31;
    let switch16;
    let updating_checked_10;
    let t32;
    let switch17;
    let updating_checked_11;
    let t33;
    let switch18;
    let updating_checked_12;
    let t34;
    let switch19;
    let updating_checked_13;
    let t35;
    let switch20;
    let updating_checked_14;
    let t36;
    let t37;
    let div9;
    let t38;
    let div10;
    let t39;
    let div11;
    let t40;
    let div12;
    let div14_transition;
    let current;
    let mounted;
    let dispose;
    let if_block0 = show_if && create_if_block_8$1(ctx);
    function switch0_checked_binding(value) {
      ctx[34](value);
    }
    let switch0_props = {
      title_fixed: "显示模式",
      title_green: "瀑布流",
      title_red: "原始表格",
      label: "原始表格模式仅支持点击图片显示iframe和加载下一页",
      func: (
        /*func*/
        ctx[33]
      )
    };
    if (
      /*$_show_mode*/
      ctx[4] !== void 0
    ) {
      switch0_props.checked = /*$_show_mode*/
      ctx[4];
    }
    switch0 = new Switch({ props: switch0_props });
    binding_callbacks.push(() => bind(switch0, "checked", switch0_checked_binding));
    function switch1_checked_binding(value) {
      ctx[35](value);
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
      ctx[36](value);
    }
    let switch2_props = {
      title_fixed: "卡片移动动画",
      title_green: "开启",
      title_red: "关闭",
      label: "开启关闭瀑布流卡片高度变化时的缓动动画"
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
      ctx[37](value);
    }
    let switch3_props = {
      title_fixed: "侧边栏debug按钮",
      title_green: "隐藏(默认)",
      title_red: "显示(开发用)",
      green_state: false
    };
    if (
      /*$_show_debug_btn*/
      ctx[8] !== void 0
    ) {
      switch3_props.checked = /*$_show_debug_btn*/
      ctx[8];
    }
    switch3 = new Switch({ props: switch3_props });
    binding_callbacks.push(() => bind(switch3, "checked", switch3_checked_binding));
    function switch4_checked_binding(value) {
      ctx[38](value);
    }
    let switch4_props = {
      title_fixed: "悬浮预览大图",
      title_green: "默认开启",
      title_red: "核心功能->确定不用再关"
    };
    if (
      /*$_show_nexus_pic*/
      ctx[12] !== void 0
    ) {
      switch4_props.checked = /*$_show_nexus_pic*/
      ctx[12];
    }
    switch4 = new Switch({ props: switch4_props });
    binding_callbacks.push(() => bind(switch4, "checked", switch4_checked_binding));
    let if_block1 = (
      /*$_show_nexus_pic*/
      ctx[12] && create_if_block_7$1(ctx)
    );
    switch5 = new Switch({
      props: {
        title_fixed: `悬浮预览延迟${/*$_delay_nexus_pic*/
      ctx[14] ? ":" + /*$_delay_nexus_pic*/
      ctx[14] + "ms" : ""}`,
        title_red: `${/*$_delay_nexus_pic*/
      ctx[14] ? "" : "无延迟"}`,
        label: "防止无意滑动时大图打开妨碍预览",
        type: "range",
        $$slots: { default: [create_default_slot_5] },
        $$scope: { ctx }
      }
    });
    function switch6_checked_binding(value) {
      ctx[41](value);
    }
    let switch6_props = {
      title_fixed: "图片加载失败时显示标题",
      title_green: "显示标题",
      title_red: "仅提示加载失败",
      green_state: false
    };
    if (
      /*$_pic_failed_showInfo*/
      ctx[15] !== void 0
    ) {
      switch6_props.checked = /*$_pic_failed_showInfo*/
      ctx[15];
    }
    switch6 = new Switch({ props: switch6_props });
    binding_callbacks.push(() => bind(switch6, "checked", switch6_checked_binding));
    function switch7_checked_binding(value) {
      ctx[42](value);
    }
    let switch7_props = {
      title_fixed: "预览大图默认状态",
      title_green: "铺满(contain)",
      title_red: "尽量原图大小",
      label: "开启=铺满(contain); 关闭=尽量原图大小(scale-down)",
      green_state: false
    };
    if (
      /*$_state_hover_pic*/
      ctx[16] !== void 0
    ) {
      switch7_props.checked = /*$_state_hover_pic*/
      ctx[16];
    }
    switch7 = new Switch({ props: switch7_props });
    binding_callbacks.push(() => bind(switch7, "checked", switch7_checked_binding));
    switch8 = new Switch({
      props: {
        title_fixed: `卡片列数: {$_card_layout.column}`,
        label: "范围: 2~7 列",
        type: "range",
        $$slots: { default: [create_default_slot_4] },
        $$scope: { ctx }
      }
    });
    switch9 = new Switch({
      props: {
        title_fixed: `卡片间距: {$_card_layout.gap}px`,
        label: "范围: 2~100 px",
        type: "range",
        $$slots: { default: [create_default_slot_3] },
        $$scope: { ctx }
      }
    });
    switch10 = new Switch({
      props: {
        title_fixed: `浏览器边距: {$_card_layout.margin ?? 20}px`,
        label: "范围: 0~500 px(可输入)",
        type: "range",
        $$slots: { default: [create_default_slot_2] },
        $$scope: { ctx }
      }
    });
    switch11 = new Switch({
      props: {
        title_fixed: `预览窗口宽度: {$_previewWidth > 0 ? $_previewWidth : (GLOBAL_SITE[$_current_domain] ? GLOBAL_SITE[$_current_domain].Iframe_Width : 1000)}px`,
        label: "范围: 400~2000 px(0=站点默认)",
        type: "range",
        $$slots: { default: [create_default_slot_1] },
        $$scope: { ctx }
      }
    });
    switch12 = new Switch({
      props: {
        title_fixed: `预览窗口高度: {$_previewHeight > 0 ? $_previewHeight : 96}%`,
        label: "范围: 40~100 %(0=默认)",
        type: "range",
        $$slots: { default: [create_default_slot] },
        $$scope: { ctx }
      }
    });
    function switch13_checked_binding(value) {
      ctx[56](value);
    }
    let switch13_props = {
      title_fixed: "卡片信息",
      title_green: "显示下方所选信息(精简)",
      title_red: "显示所有信息(较乱)",
      green_state: false
    };
    if (
      /*$_CARD_SHOW*/
      ctx[3].all !== void 0
    ) {
      switch13_props.checked = /*$_CARD_SHOW*/
      ctx[3].all;
    }
    switch13 = new Switch({ props: switch13_props });
    binding_callbacks.push(() => bind(switch13, "checked", switch13_checked_binding));
    switch13.$on(
      "click",
      /*sortMasonryBundle*/
      ctx[27]
    );
    function switch14_checked_binding(value) {
      ctx[57](value);
    }
    let switch14_props = { title_fixed: "显示种子名称" };
    if (
      /*$_CARD_SHOW*/
      ctx[3].title !== void 0
    ) {
      switch14_props.checked = /*$_CARD_SHOW*/
      ctx[3].title;
    }
    switch14 = new Switch({ props: switch14_props });
    binding_callbacks.push(() => bind(switch14, "checked", switch14_checked_binding));
    function switch15_checked_binding(value) {
      ctx[58](value);
    }
    let switch15_props = { title_fixed: "显示置顶和免费" };
    if (
      /*$_CARD_SHOW*/
      ctx[3].free !== void 0
    ) {
      switch15_props.checked = /*$_CARD_SHOW*/
      ctx[3].free;
    }
    switch15 = new Switch({ props: switch15_props });
    binding_callbacks.push(() => bind(switch15, "checked", switch15_checked_binding));
    function switch16_checked_binding(value) {
      ctx[59](value);
    }
    let switch16_props = { title_fixed: "显示副标题" };
    if (
      /*$_CARD_SHOW*/
      ctx[3].sub_title !== void 0
    ) {
      switch16_props.checked = /*$_CARD_SHOW*/
      ctx[3].sub_title;
    }
    switch16 = new Switch({ props: switch16_props });
    binding_callbacks.push(() => bind(switch16, "checked", switch16_checked_binding));
    function switch17_checked_binding(value) {
      ctx[60](value);
    }
    let switch17_props = { title_fixed: "显示标签" };
    if (
      /*$_CARD_SHOW*/
      ctx[3].tags !== void 0
    ) {
      switch17_props.checked = /*$_CARD_SHOW*/
      ctx[3].tags;
    }
    switch17 = new Switch({ props: switch17_props });
    binding_callbacks.push(() => bind(switch17, "checked", switch17_checked_binding));
    function switch18_checked_binding(value) {
      ctx[61](value);
    }
    let switch18_props = { title_fixed: "显示 [大小/下载/收藏]" };
    if (
      /*$_CARD_SHOW*/
      ctx[3].size_download_collect !== void 0
    ) {
      switch18_props.checked = /*$_CARD_SHOW*/
      ctx[3].size_download_collect;
    }
    switch18 = new Switch({ props: switch18_props });
    binding_callbacks.push(() => bind(switch18, "checked", switch18_checked_binding));
    function switch19_checked_binding(value) {
      ctx[62](value);
    }
    let switch19_props = { title_fixed: "显示上传时间" };
    if (
      /*$_CARD_SHOW*/
      ctx[3].upload_time !== void 0
    ) {
      switch19_props.checked = /*$_CARD_SHOW*/
      ctx[3].upload_time;
    }
    switch19 = new Switch({ props: switch19_props });
    binding_callbacks.push(() => bind(switch19, "checked", switch19_checked_binding));
    function switch20_checked_binding(value) {
      ctx[63](value);
    }
    let switch20_props = { title_fixed: "显示 [评论/上传/下载/完成]" };
    if (
      /*$_CARD_SHOW*/
      ctx[3].statistics !== void 0
    ) {
      switch20_props.checked = /*$_CARD_SHOW*/
      ctx[3].statistics;
    }
    switch20 = new Switch({ props: switch20_props });
    binding_callbacks.push(() => bind(switch20, "checked", switch20_checked_binding));
    return {
      c() {
        div14 = element("div");
        div13 = element("div");
        div0 = element("div");
        p = element("p");
        p.textContent = "详细配置面板";
        t1 = space();
        button0 = element("button");
        button0.innerHTML = `<svg class="feather feather-x" fill="none" height="28" width="28" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><line x1="20" x2="6" y1="6" y2="20"></line><line x1="6" x2="20" y1="6" y2="20"></line></svg>`;
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
        create_component(switch1.$$.fragment);
        t7 = space();
        create_component(switch2.$$.fragment);
        t8 = space();
        create_component(switch3.$$.fragment);
        t9 = space();
        create_component(switch4.$$.fragment);
        t10 = space();
        if (if_block1)
          if_block1.c();
        t11 = space();
        create_component(switch5.$$.fragment);
        t12 = space();
        create_component(switch6.$$.fragment);
        t13 = space();
        create_component(switch7.$$.fragment);
        t14 = space();
        button1 = element("button");
        button1.textContent = "切换宽度(开发中)";
        t16 = space();
        t17 = space();
        div4 = element("div");
        h11 = element("h1");
        h11.textContent = "卡片布局";
        t19 = space();
        div3 = element("div");
        create_component(switch8.$$.fragment);
        t20 = space();
        create_component(switch9.$$.fragment);
        t21 = space();
        create_component(switch10.$$.fragment);
        t22 = space();
        create_component(switch11.$$.fragment);
        t23 = space();
        create_component(switch12.$$.fragment);
        t24 = space();
        div8 = element("div");
        h12 = element("h1");
        h12.textContent = "卡片信息";
        t26 = space();
        div5 = element("div");
        create_component(switch13.$$.fragment);
        t27 = space();
        div7 = element("div");
        h3 = element("h3");
        h3.textContent = "配置常驻卡片信息";
        t29 = space();
        div6 = element("div");
        create_component(switch14.$$.fragment);
        t30 = space();
        create_component(switch15.$$.fragment);
        t31 = space();
        create_component(switch16.$$.fragment);
        t32 = space();
        create_component(switch17.$$.fragment);
        t33 = space();
        create_component(switch18.$$.fragment);
        t34 = space();
        create_component(switch19.$$.fragment);
        t35 = space();
        create_component(switch20.$$.fragment);
        t36 = space();
        t37 = space();
        div9 = element("div");
        t38 = space();
        div10 = element("div");
        t39 = space();
        div11 = element("div");
        t40 = space();
        div12 = element("div");
        attr(div0, "class", "configP_title svelte-mdsgbd");
        attr(h10, "class", "s_title");
        attr(button1, "class", "sideP__btn svelte-mdsgbd");
        attr(div1, "class", "s_panel");
        attr(div2, "class", "section svelte-mdsgbd");
        attr(h11, "class", "s_title");
        attr(div3, "class", "s_panel");
        attr(div4, "class", "section svelte-mdsgbd");
        attr(h12, "class", "s_title");
        attr(div5, "class", "s_panel");
        attr(h3, "class", "s_title");
        attr(div6, "class", "s_panel");
        attr(div7, "class", "section svelte-mdsgbd");
        attr(div8, "class", "section svelte-mdsgbd");
        attr(div9, "class", "section svelte-mdsgbd");
        attr(div9, "id", "kesaPanelWebdav");
        attr(div10, "class", "section svelte-mdsgbd");
        attr(div10, "id", "kesaPanelRead");
        attr(div11, "class", "section svelte-mdsgbd");
        attr(div11, "id", "kesaPanelTag");
        attr(div12, "class", "section svelte-mdsgbd");
        attr(div12, "id", "kesaPanelName");
        attr(div13, "class", "configP_holder svelte-mdsgbd");
        attr(div14, "class", "configP svelte-mdsgbd");
      },
      m(target, anchor) {
        insert(target, div14, anchor);
        append(div14, div13);
        append(div13, div0);
        append(div0, p);
        append(div0, t1);
        append(div0, button0);
        append(div13, t2);
        if (if_block0)
          if_block0.m(div13, null);
        append(div13, t3);
        append(div13, div2);
        append(div2, h10);
        append(div2, t5);
        append(div2, div1);
        mount_component(switch0, div1, null);
        append(div1, t6);
        mount_component(switch1, div1, null);
        append(div1, t7);
        mount_component(switch2, div1, null);
        append(div1, t8);
        mount_component(switch3, div1, null);
        append(div1, t9);
        mount_component(switch4, div1, null);
        append(div1, t10);
        if (if_block1)
          if_block1.m(div1, null);
        append(div1, t11);
        mount_component(switch5, div1, null);
        append(div1, t12);
        mount_component(switch6, div1, null);
        append(div1, t13);
        mount_component(switch7, div1, null);
        append(div1, t14);
        append(div1, button1);
        append(div1, t16);
        append(div13, t17);
        append(div13, div4);
        append(div4, h11);
        append(div4, t19);
        append(div4, div3);
        mount_component(switch8, div3, null);
        append(div3, t20);
        mount_component(switch9, div3, null);
        append(div3, t21);
        mount_component(switch10, div3, null);
        append(div3, t22);
        mount_component(switch11, div3, null);
        append(div3, t23);
        mount_component(switch12, div3, null);
        append(div13, t24);
        append(div13, div8);
        append(div8, h12);
        append(div8, t26);
        append(div8, div5);
        mount_component(switch13, div5, null);
        append(div8, t27);
        append(div8, div7);
        append(div7, h3);
        append(div7, t29);
        append(div7, div6);
        mount_component(switch14, div6, null);
        append(div6, t30);
        mount_component(switch15, div6, null);
        append(div6, t31);
        mount_component(switch16, div6, null);
        append(div6, t32);
        mount_component(switch17, div6, null);
        append(div6, t33);
        mount_component(switch18, div6, null);
        append(div6, t34);
        mount_component(switch19, div6, null);
        append(div6, t35);
        mount_component(switch20, div6, null);
        append(div6, t36);
        append(div13, t37);
        append(div13, div9);
        append(div13, t38);
        append(div13, div10);
        append(div13, t39);
        append(div13, div11);
        append(div13, t40);
        append(div13, div12);
        current = true;
        if (!mounted) {
          dispose = [
            listen(
              button0,
              "click",
              /*click_handler_1*/
              ctx[31]
            ),
            listen(
              button1,
              "click",
              /*config_changeWidth*/
              ctx[23]
            ),
            listen(div14, "click", self(
              /*click_handler_5*/
              ctx[78]
            ))
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*$_current_domain*/
        512)
          show_if = /m-team\.cc/i.test(
            /*$_current_domain*/
            ctx2[9]
          );
        if (show_if) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
            if (dirty[0] & /*$_current_domain*/
            512) {
              transition_in(if_block0, 1);
            }
          } else {
            if_block0 = create_if_block_8$1(ctx2);
            if_block0.c();
            transition_in(if_block0, 1);
            if_block0.m(div13, t3);
          }
        } else if (if_block0) {
          group_outros();
          transition_out(if_block0, 1, 1, () => {
            if_block0 = null;
          });
          check_outros();
        }
        const switch0_changes = {};
        if (!updating_checked && dirty[0] & /*$_show_mode*/
        16) {
          updating_checked = true;
          switch0_changes.checked = /*$_show_mode*/
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
        if (!updating_checked_3 && dirty[0] & /*$_show_debug_btn*/
        256) {
          updating_checked_3 = true;
          switch3_changes.checked = /*$_show_debug_btn*/
          ctx2[8];
          add_flush_callback(() => updating_checked_3 = false);
        }
        switch3.$set(switch3_changes);
        const switch4_changes = {};
        if (!updating_checked_4 && dirty[0] & /*$_show_nexus_pic*/
        4096) {
          updating_checked_4 = true;
          switch4_changes.checked = /*$_show_nexus_pic*/
          ctx2[12];
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
            if_block1 = create_if_block_7$1(ctx2);
            if_block1.c();
            transition_in(if_block1, 1);
            if_block1.m(div1, t11);
          }
        } else if (if_block1) {
          group_outros();
          transition_out(if_block1, 1, 1, () => {
            if_block1 = null;
          });
          check_outros();
        }
        const switch5_changes = {};
        if (dirty[0] & /*$_delay_nexus_pic*/
        16384)
          switch5_changes.title_fixed = `悬浮预览延迟${/*$_delay_nexus_pic*/
        ctx2[14] ? ":" + /*$_delay_nexus_pic*/
        ctx2[14] + "ms" : ""}`;
        if (dirty[0] & /*$_delay_nexus_pic*/
        16384)
          switch5_changes.title_red = `${/*$_delay_nexus_pic*/
        ctx2[14] ? "" : "无延迟"}`;
        if (dirty[0] & /*$_delay_nexus_pic*/
        16384 | dirty[2] & /*$$scope*/
        67108864) {
          switch5_changes.$$scope = { dirty, ctx: ctx2 };
        }
        switch5.$set(switch5_changes);
        const switch6_changes = {};
        if (!updating_checked_5 && dirty[0] & /*$_pic_failed_showInfo*/
        32768) {
          updating_checked_5 = true;
          switch6_changes.checked = /*$_pic_failed_showInfo*/
          ctx2[15];
          add_flush_callback(() => updating_checked_5 = false);
        }
        switch6.$set(switch6_changes);
        const switch7_changes = {};
        if (!updating_checked_6 && dirty[0] & /*$_state_hover_pic*/
        65536) {
          updating_checked_6 = true;
          switch7_changes.checked = /*$_state_hover_pic*/
          ctx2[16];
          add_flush_callback(() => updating_checked_6 = false);
        }
        switch7.$set(switch7_changes);
        const switch8_changes = {};
        if (dirty[0] & /*$_card_layout*/
        131072 | dirty[2] & /*$$scope*/
        67108864) {
          switch8_changes.$$scope = { dirty, ctx: ctx2 };
        }
        switch8.$set(switch8_changes);
        const switch9_changes = {};
        if (dirty[0] & /*$_card_layout*/
        131072 | dirty[2] & /*$$scope*/
        67108864) {
          switch9_changes.$$scope = { dirty, ctx: ctx2 };
        }
        switch9.$set(switch9_changes);
        const switch10_changes = {};
        if (dirty[0] & /*$_card_layout*/
        131072 | dirty[2] & /*$$scope*/
        67108864) {
          switch10_changes.$$scope = { dirty, ctx: ctx2 };
        }
        switch10.$set(switch10_changes);
        const switch11_changes = {};
        if (dirty[0] & /*$_previewWidth, $_current_domain*/
        262656 | dirty[2] & /*$$scope*/
        67108864) {
          switch11_changes.$$scope = { dirty, ctx: ctx2 };
        }
        switch11.$set(switch11_changes);
        const switch12_changes = {};
        if (dirty[0] & /*$_previewHeight*/
        524288 | dirty[2] & /*$$scope*/
        67108864) {
          switch12_changes.$$scope = { dirty, ctx: ctx2 };
        }
        switch12.$set(switch12_changes);
        const switch13_changes = {};
        if (!updating_checked_7 && dirty[0] & /*$_CARD_SHOW*/
        8) {
          updating_checked_7 = true;
          switch13_changes.checked = /*$_CARD_SHOW*/
          ctx2[3].all;
          add_flush_callback(() => updating_checked_7 = false);
        }
        switch13.$set(switch13_changes);
        const switch14_changes = {};
        if (!updating_checked_8 && dirty[0] & /*$_CARD_SHOW*/
        8) {
          updating_checked_8 = true;
          switch14_changes.checked = /*$_CARD_SHOW*/
          ctx2[3].title;
          add_flush_callback(() => updating_checked_8 = false);
        }
        switch14.$set(switch14_changes);
        const switch15_changes = {};
        if (!updating_checked_9 && dirty[0] & /*$_CARD_SHOW*/
        8) {
          updating_checked_9 = true;
          switch15_changes.checked = /*$_CARD_SHOW*/
          ctx2[3].free;
          add_flush_callback(() => updating_checked_9 = false);
        }
        switch15.$set(switch15_changes);
        const switch16_changes = {};
        if (!updating_checked_10 && dirty[0] & /*$_CARD_SHOW*/
        8) {
          updating_checked_10 = true;
          switch16_changes.checked = /*$_CARD_SHOW*/
          ctx2[3].sub_title;
          add_flush_callback(() => updating_checked_10 = false);
        }
        switch16.$set(switch16_changes);
        const switch17_changes = {};
        if (!updating_checked_11 && dirty[0] & /*$_CARD_SHOW*/
        8) {
          updating_checked_11 = true;
          switch17_changes.checked = /*$_CARD_SHOW*/
          ctx2[3].tags;
          add_flush_callback(() => updating_checked_11 = false);
        }
        switch17.$set(switch17_changes);
        const switch18_changes = {};
        if (!updating_checked_12 && dirty[0] & /*$_CARD_SHOW*/
        8) {
          updating_checked_12 = true;
          switch18_changes.checked = /*$_CARD_SHOW*/
          ctx2[3].size_download_collect;
          add_flush_callback(() => updating_checked_12 = false);
        }
        switch18.$set(switch18_changes);
        const switch19_changes = {};
        if (!updating_checked_13 && dirty[0] & /*$_CARD_SHOW*/
        8) {
          updating_checked_13 = true;
          switch19_changes.checked = /*$_CARD_SHOW*/
          ctx2[3].upload_time;
          add_flush_callback(() => updating_checked_13 = false);
        }
        switch19.$set(switch19_changes);
        const switch20_changes = {};
        if (!updating_checked_14 && dirty[0] & /*$_CARD_SHOW*/
        8) {
          updating_checked_14 = true;
          switch20_changes.checked = /*$_CARD_SHOW*/
          ctx2[3].statistics;
          add_flush_callback(() => updating_checked_14 = false);
        }
        switch20.$set(switch20_changes);
      },
      i(local) {
        if (current)
          return;
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
        transition_in(switch16.$$.fragment, local);
        transition_in(switch17.$$.fragment, local);
        transition_in(switch18.$$.fragment, local);
        transition_in(switch19.$$.fragment, local);
        transition_in(switch20.$$.fragment, local);
        add_render_callback(() => {
          if (!current)
            return;
          if (!div14_transition)
            div14_transition = create_bidirectional_transition(div14, fade, { duration: 100 }, true);
          div14_transition.run(1);
        });
        current = true;
      },
      o(local) {
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
        transition_out(switch16.$$.fragment, local);
        transition_out(switch17.$$.fragment, local);
        transition_out(switch18.$$.fragment, local);
        transition_out(switch19.$$.fragment, local);
        transition_out(switch20.$$.fragment, local);
        if (!div14_transition)
          div14_transition = create_bidirectional_transition(div14, fade, { duration: 100 }, false);
        div14_transition.run(0);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div14);
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
        destroy_component(switch16);
        destroy_component(switch17);
        destroy_component(switch18);
        destroy_component(switch19);
        destroy_component(switch20);
        if (detaching && div14_transition)
          div14_transition.end();
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_if_block_8$1(ctx) {
    let div1;
    let h1;
    let t1;
    let div0;
    let switch_1;
    let updating_checked;
    let current;
    function switch_1_checked_binding(value) {
      ctx[32](value);
    }
    let switch_1_props = {
      title_fixed: "隐藏Gay分区卡片",
      title_green: "隐藏(默认)",
      title_red: "显示(狠人)"
    };
    if (
      /*$_SITE_SETTING*/
      ctx[10].mt.hide_gay !== void 0
    ) {
      switch_1_props.checked = /*$_SITE_SETTING*/
      ctx[10].mt.hide_gay;
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
        attr(div1, "class", "section svelte-mdsgbd");
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
        1024) {
          updating_checked = true;
          switch_1_changes.checked = /*$_SITE_SETTING*/
          ctx2[10].mt.hide_gay;
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
  function create_if_block_7$1(ctx) {
    let switch_1;
    let updating_checked;
    let current;
    function switch_1_checked_binding_1(value) {
      ctx[39](value);
    }
    let switch_1_props = {
      title_fixed: "预览大图方式",
      title_green: "局部悬浮预览区域",
      title_red: "全图悬浮预览",
      label: "开发中 <br> 为优化用户预览大图体验 <br> 鼠标放到图片上就显示大图会遮挡信息 <br> 指定在图片的局部 区域放大"
    };
    if (
      /*$_preview_style*/
      ctx[13] !== void 0
    ) {
      switch_1_props.checked = /*$_preview_style*/
      ctx[13];
    }
    switch_1 = new Switch({ props: switch_1_props });
    binding_callbacks.push(() => bind(switch_1, "checked", switch_1_checked_binding_1));
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
        if (!updating_checked && dirty[0] & /*$_preview_style*/
        8192) {
          updating_checked = true;
          switch_1_changes.checked = /*$_preview_style*/
          ctx2[13];
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
        destroy_component(switch_1, detaching);
      }
    };
  }
  function create_default_slot_5(ctx) {
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
              ctx[40]
            ),
            listen(
              input,
              "input",
              /*input_change_input_handler*/
              ctx[40]
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
  function create_default_slot_4(ctx) {
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
          ctx[17].column
        );
        if (!mounted) {
          dispose = [
            listen(
              input,
              "change",
              /*input_change_input_handler_1*/
              ctx[46]
            ),
            listen(
              input,
              "input",
              /*input_change_input_handler_1*/
              ctx[46]
            ),
            listen(
              input,
              "change",
              /*change_handler*/
              ctx[47]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*$_card_layout*/
        131072) {
          set_input_value(
            input,
            /*$_card_layout*/
            ctx2[17].column
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
  function create_default_slot_3(ctx) {
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
          ctx[17].gap
        );
        if (!mounted) {
          dispose = [
            listen(
              input,
              "change",
              /*input_change_input_handler_2*/
              ctx[48]
            ),
            listen(
              input,
              "input",
              /*input_change_input_handler_2*/
              ctx[48]
            ),
            listen(
              input,
              "change",
              /*change_handler_1*/
              ctx[49]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*$_card_layout*/
        131072) {
          set_input_value(
            input,
            /*$_card_layout*/
            ctx2[17].gap
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
  function create_default_slot_2(ctx) {
    let input;
    let mounted;
    let dispose;
    return {
      c() {
        input = element("input");
        attr(input, "type", "range");
        attr(input, "min", "0");
        attr(input, "max", "500");
        attr(input, "step", "1");
        attr(input, "list", "values");
      },
      m(target, anchor) {
        insert(target, input, anchor);
        set_input_value(
          input,
          /*$_card_layout*/
          ctx[17].margin
        );
        if (!mounted) {
          dispose = [
            listen(
              input,
              "change",
              /*input_change_input_handler_3*/
              ctx[50]
            ),
            listen(
              input,
              "input",
              /*input_change_input_handler_3*/
              ctx[50]
            ),
            listen(
              input,
              "change",
              /*change_handler_2*/
              ctx[51]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*$_card_layout*/
        131072) {
          set_input_value(
            input,
            /*$_card_layout*/
            ctx2[17].margin
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
    let input_value_value;
    let mounted;
    let dispose;
    return {
      c() {
        input = element("input");
        attr(input, "type", "range");
        attr(input, "min", "400");
        attr(input, "max", "2000");
        attr(input, "step", "10");
        attr(input, "list", "values");
        input.value = input_value_value = /*$_previewWidth*/
        ctx[18] > 0 ? (
          /*$_previewWidth*/
          ctx[18]
        ) : SITE[
          /*$_current_domain*/
          ctx[9]
        ] ? SITE[
          /*$_current_domain*/
          ctx[9]
        ].Iframe_Width : 1e3;
      },
      m(target, anchor) {
        insert(target, input, anchor);
        if (!mounted) {
          dispose = [
            listen(
              input,
              "input",
              /*input_handler*/
              ctx[52]
            ),
            listen(
              input,
              "change",
              /*change_handler_3*/
              ctx[53]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*$_previewWidth, $_current_domain*/
        262656 && input_value_value !== (input_value_value = /*$_previewWidth*/
        ctx2[18] > 0 ? (
          /*$_previewWidth*/
          ctx2[18]
        ) : SITE[
          /*$_current_domain*/
          ctx2[9]
        ] ? SITE[
          /*$_current_domain*/
          ctx2[9]
        ].Iframe_Width : 1e3)) {
          input.value = input_value_value;
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
    let input_value_value;
    let mounted;
    let dispose;
    return {
      c() {
        input = element("input");
        attr(input, "type", "range");
        attr(input, "min", "40");
        attr(input, "max", "100");
        attr(input, "step", "1");
        attr(input, "list", "values");
        input.value = input_value_value = /*$_previewHeight*/
        ctx[19] > 0 ? (
          /*$_previewHeight*/
          ctx[19]
        ) : 96;
      },
      m(target, anchor) {
        insert(target, input, anchor);
        if (!mounted) {
          dispose = [
            listen(
              input,
              "input",
              /*input_handler_1*/
              ctx[54]
            ),
            listen(
              input,
              "change",
              /*change_handler_4*/
              ctx[55]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*$_previewHeight*/
        524288 && input_value_value !== (input_value_value = /*$_previewHeight*/
        ctx2[19] > 0 ? (
          /*$_previewHeight*/
          ctx2[19]
        ) : 96)) {
          input.value = input_value_value;
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
  function create_fragment$4(ctx) {
    let div4;
    let div0;
    let t0;
    let div3;
    let button0;
    let t1;
    let button1;
    let t5;
    let t6;
    let t7;
    let div5;
    let current;
    let mounted;
    let dispose;
    function select_block_type(ctx2, dirty) {
      if (
        /*$_show_mode*/
        ctx2[4]
      )
        return create_if_block_10;
      return create_else_block_4;
    }
    let current_block_type = select_block_type(ctx);
    let if_block0 = current_block_type(ctx);
    let if_block1 = (
      /*$_show_debug_btn*/
      ctx[8] && create_if_block_9$1(ctx)
    );
    let if_block2 = (
      /*$_show_configPanel*/
      ctx[7] && create_if_block$4(ctx)
    );
    return {
      c() {
        div4 = element("div");
        div0 = element("div");
        t0 = space();
        div3 = element("div");
        button0 = element("button");
        if_block0.c();
        t1 = space();
        button1 = element("button");
        button1.innerHTML = `<div><svg width="24" height="24" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1 {
                fill: none;
                stroke: #fff;
                stroke-linecap: round;
                stroke-linejoin: round;
                stroke-width: 2px;
              }
            </style></defs><title></title><g data-name="80-setting" id="_80-setting"><circle class="cls-1" cx="10" cy="6" r="3"></circle><circle class="cls-1" cx="22" cy="16" r="3"></circle><circle class="cls-1" cx="10" cy="26" r="3"></circle><line class="cls-1" x1="7" x2="1" y1="6" y2="6"></line><line class="cls-1" x1="15" x2="1" y1="16" y2="16"></line><line class="cls-1" x1="7" x2="1" y1="26" y2="26"></line><line class="cls-1" x1="31" x2="17" y1="26" y2="26"></line><line class="cls-1" x1="31" x2="25" y1="16" y2="16"></line><line class="cls-1" x1="31" x2="17" y1="6" y2="6"></line></g></svg></div> 
      <div>详细配置</div>`;
        t5 = space();
        if (if_block1)
          if_block1.c();
        t6 = space();
        if (if_block2)
          if_block2.c();
        t7 = space();
        div5 = element("div");
        div5.textContent = "重置瀑布流配置边栏位置";
        attr(div0, "class", "sideP__title svelte-mdsgbd");
        attr(button0, "class", "sideP__btn svelte-mdsgbd");
        attr(button1, "class", "sideP__btn svelte-mdsgbd");
        attr(div3, "class", "sideP__out svelte-mdsgbd");
        attr(div4, "class", "sideP svelte-mdsgbd");
        set_style(
          div4,
          "top",
          /*$_panelPos*/
          ctx[5].y + "px"
        );
        set_style(
          div4,
          "left",
          /*$_panelPos*/
          ctx[5].x + "px"
        );
        set_style(
          div4,
          "background-color",
          /*$_current_bgColor*/
          ctx[6]
        );
        attr(div5, "id", "reset_panel_pos");
        attr(div5, "class", "svelte-mdsgbd");
      },
      m(target, anchor) {
        insert(target, div4, anchor);
        append(div4, div0);
        append(div4, t0);
        append(div4, div3);
        append(div3, button0);
        if_block0.m(button0, null);
        append(div3, t1);
        append(div3, button1);
        append(div3, t5);
        if (if_block1)
          if_block1.m(div3, null);
        ctx[30](div4);
        insert(target, t6, anchor);
        if (if_block2)
          if_block2.m(target, anchor);
        insert(target, t7, anchor);
        insert(target, div5, anchor);
        current = true;
        if (!mounted) {
          dispose = [
            listen(
              div0,
              "mousedown",
              /*onMouseDown*/
              ctx[20]
            ),
            listen(
              button0,
              "click",
              /*__show_originTable*/
              ctx[22]
            ),
            listen(
              button1,
              "click",
              /*click_handler*/
              ctx[29]
            ),
            listen(
              div5,
              "click",
              /*resetPanelPos*/
              ctx[21]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (current_block_type !== (current_block_type = select_block_type(ctx2))) {
          if_block0.d(1);
          if_block0 = current_block_type(ctx2);
          if (if_block0) {
            if_block0.c();
            if_block0.m(button0, null);
          }
        }
        if (
          /*$_show_debug_btn*/
          ctx2[8]
        ) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
          } else {
            if_block1 = create_if_block_9$1(ctx2);
            if_block1.c();
            if_block1.m(div3, null);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
        if (!current || dirty[0] & /*$_panelPos*/
        32) {
          set_style(
            div4,
            "top",
            /*$_panelPos*/
            ctx2[5].y + "px"
          );
        }
        if (!current || dirty[0] & /*$_panelPos*/
        32) {
          set_style(
            div4,
            "left",
            /*$_panelPos*/
            ctx2[5].x + "px"
          );
        }
        if (!current || dirty[0] & /*$_current_bgColor*/
        64) {
          set_style(
            div4,
            "background-color",
            /*$_current_bgColor*/
            ctx2[6]
          );
        }
        if (
          /*$_show_configPanel*/
          ctx2[7]
        ) {
          if (if_block2) {
            if_block2.p(ctx2, dirty);
            if (dirty[0] & /*$_show_configPanel*/
            128) {
              transition_in(if_block2, 1);
            }
          } else {
            if_block2 = create_if_block$4(ctx2);
            if_block2.c();
            transition_in(if_block2, 1);
            if_block2.m(t7.parentNode, t7);
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
        transition_in(if_block2);
        current = true;
      },
      o(local) {
        transition_out(if_block2);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div4);
        if_block0.d();
        if (if_block1)
          if_block1.d();
        ctx[30](null);
        if (detaching)
          detach(t6);
        if (if_block2)
          if_block2.d(detaching);
        if (detaching)
          detach(t7);
        if (detaching)
          detach(div5);
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
  function instance$4($$self, $$props, $$invalidate) {
    let $_iframe_switch;
    let $_turnPage;
    let $_CARD_SHOW;
    let $_card_width;
    let $_show_mode;
    let $_panelPos;
    let $_current_bgColor;
    let $_show_configPanel;
    let $_show_debug_btn;
    let $_current_domain;
    let $_SITE_SETTING;
    let $_animated;
    let $_show_nexus_pic;
    let $_preview_style;
    let $_delay_nexus_pic;
    let $_pic_failed_showInfo;
    let $_state_hover_pic;
    let $_card_layout;
    let $_previewWidth;
    let $_previewHeight;
    component_subscribe($$self, _iframe_switch, ($$value) => $$invalidate(82, $_iframe_switch = $$value));
    component_subscribe($$self, _turnPage, ($$value) => $$invalidate(2, $_turnPage = $$value));
    component_subscribe($$self, _CARD_SHOW, ($$value) => $$invalidate(3, $_CARD_SHOW = $$value));
    component_subscribe($$self, _card_width, ($$value) => $$invalidate(83, $_card_width = $$value));
    component_subscribe($$self, _Global_Masonry, ($$value) => $$invalidate(84, $$value));
    component_subscribe($$self, _show_mode, ($$value) => $$invalidate(4, $_show_mode = $$value));
    component_subscribe($$self, _panelPos, ($$value) => $$invalidate(5, $_panelPos = $$value));
    component_subscribe($$self, _current_bgColor, ($$value) => $$invalidate(6, $_current_bgColor = $$value));
    component_subscribe($$self, _show_configPanel, ($$value) => $$invalidate(7, $_show_configPanel = $$value));
    component_subscribe($$self, _show_debug_btn, ($$value) => $$invalidate(8, $_show_debug_btn = $$value));
    component_subscribe($$self, _current_domain, ($$value) => $$invalidate(9, $_current_domain = $$value));
    component_subscribe($$self, _SITE_SETTING, ($$value) => $$invalidate(10, $_SITE_SETTING = $$value));
    component_subscribe($$self, _animated, ($$value) => $$invalidate(11, $_animated = $$value));
    component_subscribe($$self, _show_nexus_pic, ($$value) => $$invalidate(12, $_show_nexus_pic = $$value));
    component_subscribe($$self, _preview_style, ($$value) => $$invalidate(13, $_preview_style = $$value));
    component_subscribe($$self, _delay_nexus_pic, ($$value) => $$invalidate(14, $_delay_nexus_pic = $$value));
    component_subscribe($$self, _pic_failed_showInfo, ($$value) => $$invalidate(15, $_pic_failed_showInfo = $$value));
    component_subscribe($$self, _state_hover_pic, ($$value) => $$invalidate(16, $_state_hover_pic = $$value));
    component_subscribe($$self, _card_layout, ($$value) => $$invalidate(17, $_card_layout = $$value));
    component_subscribe($$self, _previewWidth, ($$value) => $$invalidate(18, $_previewWidth = $$value));
    component_subscribe($$self, _previewHeight, ($$value) => $$invalidate(19, $_previewHeight = $$value));
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
    let { originTable } = $$props;
    function __show_originTable() {
      set_store_value(_show_mode, $_show_mode = !$_show_mode, $_show_mode);
      window.CHANGE_CARD_LAYOUT();
    }
    function config_changeWidth() {
      set_store_value(_card_width, $_card_width = $_card_width == 300 ? 200 : 300, $_card_width);
      console.log(`[debug]$card_width: ${$_card_width}`);
      sortMasonryBundle();
    }
    function config_showAllDetails() {
      set_store_value(_CARD_SHOW, $_CARD_SHOW.all = !$_CARD_SHOW.all, $_CARD_SHOW);
      sortMasonryBundle();
    }
    let label_switchMode = $_turnPage ? "滚动加载" : "按钮加载";
    function config_switchMode() {
      set_store_value(_turnPage, $_turnPage = !$_turnPage, $_turnPage);
      $$invalidate(1, label_switchMode = $_turnPage ? "滚动加载" : "按钮加载");
    }
    function config_changeLoadMode() {
      set_store_value(_iframe_switch, $_iframe_switch = $_iframe_switch == 0 ? 1 : 0, $_iframe_switch);
    }
    function sortMasonryBundle() {
      sortMasonry("fast");
      sortMasonry("fast");
      sortMasonry();
      sortMasonry();
    }
    onMount(() => {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      __initReadTracking();
      __fillCardInfoSectionObserver();
      const secMount = () => {
        const webdav = document.getElementById("kesaPanelWebdav");
        const read = document.getElementById("kesaPanelRead");
        const tag = document.getElementById("kesaPanelTag");
        const name = document.getElementById("kesaPanelName");
        if (webdav && !webdav.dataset.filled) {
          webdav.dataset.filled = "1";
          __fillWebDAVSection(webdav);
        }
        if (read && !read.dataset.filled) {
          read.dataset.filled = "1";
          __fillReadSection(read);
        }
        if (tag && !tag.dataset.filled) {
          tag.dataset.filled = "1";
          __fillTagSection(tag);
        }
        if (name && !name.dataset.filled) {
          name.dataset.filled = "1";
          __fillNameFilterSection(name);
        }
      };
      secMount();
      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
    });
    const click_handler = () => {
      set_store_value(_show_configPanel, $_show_configPanel = !$_show_configPanel, $_show_configPanel);
    };
    function div4_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        sideDom = $$value;
        $$invalidate(0, sideDom);
      });
    }
    const click_handler_1 = () => set_store_value(_show_configPanel, $_show_configPanel = false, $_show_configPanel);
    function switch_1_checked_binding(value) {
      if ($$self.$$.not_equal($_SITE_SETTING.mt.hide_gay, value)) {
        $_SITE_SETTING.mt.hide_gay = value;
        _SITE_SETTING.set($_SITE_SETTING);
      }
    }
    const func = () => {
      window.CHANGE_CARD_LAYOUT();
    };
    function switch0_checked_binding(value) {
      $_show_mode = value;
      _show_mode.set($_show_mode);
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
      $_show_debug_btn = value;
      _show_debug_btn.set($_show_debug_btn);
    }
    function switch4_checked_binding(value) {
      $_show_nexus_pic = value;
      _show_nexus_pic.set($_show_nexus_pic);
    }
    function switch_1_checked_binding_1(value) {
      $_preview_style = value;
      _preview_style.set($_preview_style);
    }
    function input_change_input_handler() {
      $_delay_nexus_pic = to_number(this.value);
      _delay_nexus_pic.set($_delay_nexus_pic);
    }
    function switch6_checked_binding(value) {
      $_pic_failed_showInfo = value;
      _pic_failed_showInfo.set($_pic_failed_showInfo);
    }
    function switch7_checked_binding(value) {
      $_state_hover_pic = value;
      _state_hover_pic.set($_state_hover_pic);
    }
    const click_handler_2 = () => {
      set_store_value(_show_debug_btn, $_show_debug_btn = !$_show_debug_btn, $_show_debug_btn);
    };
    const click_handler_3 = () => {
      set_store_value(_show_nexus_pic, $_show_nexus_pic = !$_show_nexus_pic, $_show_nexus_pic);
    };
    const click_handler_4 = () => {
      set_store_value(_delay_nexus_pic, $_delay_nexus_pic = $_delay_nexus_pic == 0 ? 600 : 0, $_delay_nexus_pic);
    };
    function input_change_input_handler_1() {
      $_card_layout.column = to_number(this.value);
      _card_layout.set($_card_layout);
    }
    const change_handler = () => {
      set_store_value(_card_layout, $_card_layout = { ...$_card_layout }, $_card_layout);
    };
    function input_change_input_handler_2() {
      $_card_layout.gap = to_number(this.value);
      _card_layout.set($_card_layout);
    }
    const change_handler_1 = () => {
      set_store_value(_card_layout, $_card_layout = { ...$_card_layout }, $_card_layout);
    };
    function input_change_input_handler_3() {
      $_card_layout.margin = to_number(this.value);
      _card_layout.set($_card_layout);
    }
    const change_handler_2 = () => {
      set_store_value(_card_layout, $_card_layout = { ...$_card_layout }, $_card_layout);
    };
    const input_handler = (e) => {
      set_store_value(_previewWidth, $_previewWidth = Number(e.target.value), $_previewWidth);
    };
    const change_handler_3 = (e) => {
      set_store_value(_previewWidth, $_previewWidth = Number(e.target.value), $_previewWidth);
    };
    const input_handler_1 = (e) => {
      set_store_value(_previewHeight, $_previewHeight = Number(e.target.value), $_previewHeight);
    };
    const change_handler_4 = (e) => {
      set_store_value(_previewHeight, $_previewHeight = Number(e.target.value), $_previewHeight);
    };
    function switch13_checked_binding(value) {
      if ($$self.$$.not_equal($_CARD_SHOW.all, value)) {
        $_CARD_SHOW.all = value;
        _CARD_SHOW.set($_CARD_SHOW);
      }
    }
    function switch14_checked_binding(value) {
      if ($$self.$$.not_equal($_CARD_SHOW.title, value)) {
        $_CARD_SHOW.title = value;
        _CARD_SHOW.set($_CARD_SHOW);
      }
    }
    function switch15_checked_binding(value) {
      if ($$self.$$.not_equal($_CARD_SHOW.free, value)) {
        $_CARD_SHOW.free = value;
        _CARD_SHOW.set($_CARD_SHOW);
      }
    }
    function switch16_checked_binding(value) {
      if ($$self.$$.not_equal($_CARD_SHOW.sub_title, value)) {
        $_CARD_SHOW.sub_title = value;
        _CARD_SHOW.set($_CARD_SHOW);
      }
    }
    function switch17_checked_binding(value) {
      if ($$self.$$.not_equal($_CARD_SHOW.tags, value)) {
        $_CARD_SHOW.tags = value;
        _CARD_SHOW.set($_CARD_SHOW);
      }
    }
    function switch18_checked_binding(value) {
      if ($$self.$$.not_equal($_CARD_SHOW.size_download_collect, value)) {
        $_CARD_SHOW.size_download_collect = value;
        _CARD_SHOW.set($_CARD_SHOW);
      }
    }
    function switch19_checked_binding(value) {
      if ($$self.$$.not_equal($_CARD_SHOW.upload_time, value)) {
        $_CARD_SHOW.upload_time = value;
        _CARD_SHOW.set($_CARD_SHOW);
      }
    }
    function switch20_checked_binding(value) {
      if ($$self.$$.not_equal($_CARD_SHOW.statistics, value)) {
        $_CARD_SHOW.statistics = value;
        _CARD_SHOW.set($_CARD_SHOW);
      }
    }
    function input0_change_handler() {
      $_CARD_SHOW.title = this.checked;
      _CARD_SHOW.set($_CARD_SHOW);
    }
    const change_handler_5 = () => {
      sortMasonry();
    };
    function input1_change_handler() {
      $_CARD_SHOW.free = this.checked;
      _CARD_SHOW.set($_CARD_SHOW);
    }
    const change_handler_6 = () => {
      sortMasonry();
    };
    function input2_change_handler() {
      $_CARD_SHOW.sub_title = this.checked;
      _CARD_SHOW.set($_CARD_SHOW);
    }
    const change_handler_7 = () => {
      sortMasonry();
    };
    function input3_change_handler() {
      $_CARD_SHOW.tags = this.checked;
      _CARD_SHOW.set($_CARD_SHOW);
    }
    const change_handler_8 = () => {
      sortMasonry();
    };
    function input4_change_handler() {
      $_CARD_SHOW.size_download_collect = this.checked;
      _CARD_SHOW.set($_CARD_SHOW);
    }
    const change_handler_9 = () => {
      sortMasonry();
    };
    function input5_change_handler() {
      $_CARD_SHOW.upload_time = this.checked;
      _CARD_SHOW.set($_CARD_SHOW);
    }
    const change_handler_10 = () => {
      sortMasonry();
    };
    function input6_change_handler() {
      $_CARD_SHOW.statistics = this.checked;
      _CARD_SHOW.set($_CARD_SHOW);
    }
    const change_handler_11 = () => {
      sortMasonry();
    };
    const click_handler_5 = () => set_store_value(_show_configPanel, $_show_configPanel = false, $_show_configPanel);
    $$self.$$set = ($$props2) => {
      if ("originTable" in $$props2)
        $$invalidate(28, originTable = $$props2.originTable);
    };
    return [
      sideDom,
      label_switchMode,
      $_turnPage,
      $_CARD_SHOW,
      $_show_mode,
      $_panelPos,
      $_current_bgColor,
      $_show_configPanel,
      $_show_debug_btn,
      $_current_domain,
      $_SITE_SETTING,
      $_animated,
      $_show_nexus_pic,
      $_preview_style,
      $_delay_nexus_pic,
      $_pic_failed_showInfo,
      $_state_hover_pic,
      $_card_layout,
      $_previewWidth,
      $_previewHeight,
      onMouseDown,
      resetPanelPos,
      __show_originTable,
      config_changeWidth,
      config_showAllDetails,
      config_switchMode,
      config_changeLoadMode,
      sortMasonryBundle,
      originTable,
      click_handler,
      div4_binding,
      click_handler_1,
      switch_1_checked_binding,
      func,
      switch0_checked_binding,
      switch1_checked_binding,
      switch2_checked_binding,
      switch3_checked_binding,
      switch4_checked_binding,
      switch_1_checked_binding_1,
      input_change_input_handler,
      switch6_checked_binding,
      switch7_checked_binding,
      click_handler_2,
      click_handler_3,
      click_handler_4,
      input_change_input_handler_1,
      change_handler,
      input_change_input_handler_2,
      change_handler_1,
      input_change_input_handler_3,
      change_handler_2,
      input_handler,
      change_handler_3,
      input_handler_1,
      change_handler_4,
      switch13_checked_binding,
      switch14_checked_binding,
      switch15_checked_binding,
      switch16_checked_binding,
      switch17_checked_binding,
      switch18_checked_binding,
      switch19_checked_binding,
      switch20_checked_binding,
      input0_change_handler,
      change_handler_5,
      input1_change_handler,
      change_handler_6,
      input2_change_handler,
      change_handler_7,
      input3_change_handler,
      change_handler_8,
      input4_change_handler,
      change_handler_9,
      input5_change_handler,
      change_handler_10,
      input6_change_handler,
      change_handler_11,
      click_handler_5
    ];
  }
  class Sidepanel extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$4, create_fragment$4, safe_not_equal, { originTable: 28 }, null, [-1, -1, -1]);
    }
  }
  const CARD = {
    /** 瀑布流卡片宽度 */
    CARD_WIDTH: get_store_value(_card_width),
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
    SWITCH_MODE: "Button"
  };
  function Launch_Hijack(param = { path: "/search", method: "POST" }) {
    const path = param.path || "/search";
    const method = param.method || "POST";
    if (typeof XMLHttpRequest === "undefined") {
      console.warn("[mteamHijack] XMLHttpRequest not available, skipping hijack");
      return () => {
      };
    }
    const nativeOpen = XMLHttpRequest.prototype.open;
    const nativeSend = XMLHttpRequest.prototype.send;
    const nativeFetch = window.fetch;
    const requestMetadataMap = /* @__PURE__ */ new WeakMap();
    const capturedFlags = /* @__PURE__ */ new WeakSet();
    function isTargetRequest(url, requestMethod) {
      if (!url.includes(path))
        return false;
      if (requestMethod.toUpperCase() !== method.toUpperCase())
        return false;
      return true;
    }
    function parseResponse(xhr) {
      var _a;
      try {
        switch (xhr.responseType) {
          case "json":
            return xhr.response;
          case "document":
            return ((_a = xhr.responseXML) == null ? void 0 : _a.documentElement.textContent) || null;
          case "arraybuffer":
            return new Uint8Array(xhr.response);
          case "blob":
            return URL.createObjectURL(xhr.response);
          default:
            return xhr.responseText;
        }
      } catch {
        return xhr.responseText;
      }
    }
    function captureResponseData(xhr) {
      const metadata = requestMetadataMap.get(xhr);
      if (!metadata || !metadata.isTarget || capturedFlags.has(xhr)) {
        return;
      }
      try {
        const responseData = {
          status: xhr.status,
          headers: xhr.getAllResponseHeaders(),
          data: parseResponse(xhr)
        };
        const event = new CustomEvent(`res>${method}->${path}`, { detail: responseData });
        window.dispatchEvent(event);
        capturedFlags.add(xhr);
      } catch (e) {
        console.error("<mteamHijack> Capture failed:", e);
      }
    }
    XMLHttpRequest.prototype.open = function(method2, url) {
      const metadata = {
        method: method2.toUpperCase(),
        url,
        isTarget: isTargetRequest(url, method2)
      };
      requestMetadataMap.set(this, metadata);
      return nativeOpen.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function(body) {
      const metadata = requestMetadataMap.get(this);
      if (metadata == null ? void 0 : metadata.isTarget) {
        const originalOnReadyStateChange = this.onreadystatechange;
        const originalOnLoad = this.onload;
        this.addEventListener("readystatechange", function() {
          if (this.readyState === 4) {
            captureResponseData(this);
          }
          originalOnReadyStateChange == null ? void 0 : originalOnReadyStateChange.call(this);
        });
        this.onload = function(e) {
          captureResponseData(this);
          originalOnLoad == null ? void 0 : originalOnLoad.call(this, e);
        };
        const reqBody = {
          url: metadata.url,
          body: body instanceof Document ? body.documentElement.textContent || "[Document]" : body
        };
        const event = new CustomEvent(`req>${method}->${path}`, { detail: reqBody });
        window.dispatchEvent(event);
      }
      return nativeSend.apply(this, arguments);
    };
    if (nativeFetch) {
      window.fetch = async function(...args) {
        const [input, init2 = {}] = args;
        const url = typeof input === "string" ? input : input instanceof Request ? input.url : String(input);
        const requestMethod = (init2.method || "GET").toUpperCase();
        const requestBody = init2.body;
        const isTarget = isTargetRequest(url, requestMethod);
        if (isTarget) {
          const reqBody = {
            url,
            body: requestBody instanceof Document ? requestBody.documentElement.textContent || "[Document]" : requestBody
          };
          const event = new CustomEvent(`req>${method}->${path}`, { detail: reqBody });
          window.dispatchEvent(event);
        }
        return nativeFetch.apply(this, args).then((response) => {
          if (isTarget) {
            const responseClone = response.clone();
            const contentType = response.headers.get("content-type") || "";
            const isJson = contentType.includes("application/json");
            return responseClone[isJson ? "json" : "text"]().then((data) => {
              const responseData = {
                status: response.status,
                headers: Array.from(response.headers.entries()).reduce(
                  (obj, [key, value]) => {
                    obj[key] = value;
                    return obj;
                  },
                  /** @type {Record<string, string>} */
                  {}
                ),
                data: isJson ? JSON.stringify(data) : data
              };
              const event = new CustomEvent(`res>${method}->${path}`, { detail: responseData });
              window.dispatchEvent(event);
              return response;
            }).catch((error) => {
              console.error("<mteamHijack> Failed to parse fetch response:", error);
              return response;
            });
          }
          return response;
        });
      };
    } else {
      console.warn("[mteamHijack] fetch API not available, skipping fetch hijack");
    }
    return function cleanup() {
      XMLHttpRequest.prototype.open = nativeOpen;
      XMLHttpRequest.prototype.send = nativeSend;
      if (nativeFetch) {
        window.fetch = nativeFetch;
      }
    };
  }
  const __kesaHijack = {
    handler: null
  };
  if (typeof window !== "undefined") {
    window.__kesaHijack = __kesaHijack;
    window.__kesaHijackInject = function(data) {
      if (window.__kesaHijack && typeof window.__kesaHijack.handler === "function") {
        window.__kesaHijack.handler({
          type: "res",
          data: JSON.stringify({ data: { data, pageNumber: 1 } })
        });
        return true;
      }
      return false;
    };
  }
  function create_if_block_9(ctx) {
    let div;
    let a;
    let b;
    let t_value = (
      /*it*/
      ctx[1].name + ""
    );
    let t;
    let mounted;
    let dispose;
    return {
      c() {
        div = element("div");
        a = element("a");
        b = element("b");
        t = text(t_value);
        attr(a, "class", "two-lines svelte-xrdclb");
        attr(
          a,
          "href",
          /*detailLink*/
          ctx[10]()
        );
        attr(a, "target", "_blank");
        attr(div, "class", "card-title svelte-xrdclb");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, a);
        append(a, b);
        append(b, t);
        if (!mounted) {
          dispose = listen(
            a,
            "click",
            /*onClickCard*/
            ctx[11]
          );
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty & /*it*/
        2 && t_value !== (t_value = /*it*/
        ctx2[1].name + ""))
          set_data(t, t_value);
      },
      d(detaching) {
        if (detaching)
          detach(div);
        mounted = false;
        dispose();
      }
    };
  }
  function create_else_block$2(ctx) {
    let img;
    let img_src_value;
    let img_alt_value;
    let mounted;
    let dispose;
    return {
      c() {
        img = element("img");
        attr(img, "class", "card-image--img nexus-lazy-load_Kesa svelte-xrdclb");
        if (!src_url_equal(img.src, img_src_value = CONFIG.LOADING_PIC))
          attr(img, "src", img_src_value);
        attr(
          img,
          "data-src",
          /*picSrc*/
          ctx[3]
        );
        attr(img, "alt", img_alt_value = /*it*/
        ctx[1].name);
      },
      m(target, anchor) {
        insert(target, img, anchor);
        if (!mounted) {
          dispose = [
            listen(
              img,
              "load",
              /*sort_masonry*/
              ctx[14]
            ),
            listen(
              img,
              "error",
              /*onPicError*/
              ctx[12]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty & /*picSrc*/
        8) {
          attr(
            img,
            "data-src",
            /*picSrc*/
            ctx2[3]
          );
        }
        if (dirty & /*it*/
        2 && img_alt_value !== (img_alt_value = /*it*/
        ctx2[1].name)) {
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
  function create_if_block_8(ctx) {
    let div;
    let t_value = (
      /*$_pic_failed_showInfo*/
      (ctx[9] ? (
        /*it*/
        ctx[1].name || "图片加载失败"
      ) : "图片加载失败") + ""
    );
    let t;
    return {
      c() {
        div = element("div");
        t = text(t_value);
        attr(div, "class", "pic_error svelte-xrdclb");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, t);
      },
      p(ctx2, dirty) {
        if (dirty & /*$_pic_failed_showInfo, it*/
        514 && t_value !== (t_value = /*$_pic_failed_showInfo*/
        (ctx2[9] ? (
          /*it*/
          ctx2[1].name || "图片加载失败"
        ) : "图片加载失败") + ""))
          set_data(t, t_value);
      },
      d(detaching) {
        if (detaching)
          detach(div);
      }
    };
  }
  function create_if_block_7(ctx) {
    let div;
    let t_value = (
      /*_discountText*/
      (ctx[13][
        /*it*/
        ctx[1].status.discount
      ] || /*it*/
      ctx[1].status.discount) + ""
    );
    let t;
    return {
      c() {
        div = element("div");
        t = text(t_value);
        attr(div, "class", "card-discount svelte-xrdclb");
        toggle_class(
          div,
          "isFree",
          /*it*/
          ctx[1].status.discount == "FREE"
        );
        toggle_class(
          div,
          "is50",
          /*it*/
          ctx[1].status.discount == "PERCENT_50"
        );
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, t);
      },
      p(ctx2, dirty) {
        if (dirty & /*it*/
        2 && t_value !== (t_value = /*_discountText*/
        (ctx2[13][
          /*it*/
          ctx2[1].status.discount
        ] || /*it*/
        ctx2[1].status.discount) + ""))
          set_data(t, t_value);
        if (dirty & /*it*/
        2) {
          toggle_class(
            div,
            "isFree",
            /*it*/
            ctx2[1].status.discount == "FREE"
          );
        }
        if (dirty & /*it*/
        2) {
          toggle_class(
            div,
            "is50",
            /*it*/
            ctx2[1].status.discount == "PERCENT_50"
          );
        }
      },
      d(detaching) {
        if (detaching)
          detach(div);
      }
    };
  }
  function create_if_block_6(ctx) {
    let div;
    let b;
    let t1;
    let t2_value = getFileSize(
      /*it*/
      ctx[1].size
    ) + "";
    let t2;
    return {
      c() {
        div = element("div");
        b = element("b");
        b.textContent = "大小:";
        t1 = space();
        t2 = text(t2_value);
        attr(div, "class", "card-line svelte-xrdclb");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, b);
        append(div, t1);
        append(div, t2);
      },
      p(ctx2, dirty) {
        if (dirty & /*it*/
        2 && t2_value !== (t2_value = getFileSize(
          /*it*/
          ctx2[1].size
        ) + ""))
          set_data(t2, t2_value);
      },
      d(detaching) {
        if (detaching)
          detach(div);
      }
    };
  }
  function create_if_block_5(ctx) {
    let div;
    let t0;
    let b0;
    let t1_value = (
      /*it*/
      (ctx[1].status.comments ?? 0) + ""
    );
    let t1;
    let t2;
    let b1;
    let t3_value = (
      /*it*/
      (ctx[1].status.seeders ?? 0) + ""
    );
    let t3;
    let t4;
    let b2;
    let t5_value = (
      /*it*/
      (ctx[1].status.leechers ?? 0) + ""
    );
    let t5;
    return {
      c() {
        div = element("div");
        t0 = text("评论:");
        b0 = element("b");
        t1 = text(t1_value);
        t2 = text("  \n          做种:");
        b1 = element("b");
        t3 = text(t3_value);
        t4 = text("  \n          下载:");
        b2 = element("b");
        t5 = text(t5_value);
        attr(div, "class", "card-line svelte-xrdclb");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, t0);
        append(div, b0);
        append(b0, t1);
        append(div, t2);
        append(div, b1);
        append(b1, t3);
        append(div, t4);
        append(div, b2);
        append(b2, t5);
      },
      p(ctx2, dirty) {
        if (dirty & /*it*/
        2 && t1_value !== (t1_value = /*it*/
        (ctx2[1].status.comments ?? 0) + ""))
          set_data(t1, t1_value);
        if (dirty & /*it*/
        2 && t3_value !== (t3_value = /*it*/
        (ctx2[1].status.seeders ?? 0) + ""))
          set_data(t3, t3_value);
        if (dirty & /*it*/
        2 && t5_value !== (t5_value = /*it*/
        (ctx2[1].status.leechers ?? 0) + ""))
          set_data(t5, t5_value);
      },
      d(detaching) {
        if (detaching)
          detach(div);
      }
    };
  }
  function create_if_block_4(ctx) {
    let a;
    let t_value = (
      /*it*/
      ctx[1].smallDescr + ""
    );
    let t;
    return {
      c() {
        a = element("a");
        t = text(t_value);
        attr(a, "class", "card-description svelte-xrdclb");
        attr(
          a,
          "href",
          /*detailLink*/
          ctx[10]()
        );
      },
      m(target, anchor) {
        insert(target, a, anchor);
        append(a, t);
      },
      p(ctx2, dirty) {
        if (dirty & /*it*/
        2 && t_value !== (t_value = /*it*/
        ctx2[1].smallDescr + ""))
          set_data(t, t_value);
      },
      d(detaching) {
        if (detaching)
          detach(a);
      }
    };
  }
  function create_if_block$3(ctx) {
    let div;
    let show_if_2 = (Number(
      /*it*/
      ctx[1].labels
    ) & 1) === 1;
    let t0;
    let show_if_1 = (Number(
      /*it*/
      ctx[1].labels
    ) & 2) === 2;
    let t1;
    let show_if = (Number(
      /*it*/
      ctx[1].labels
    ) & 4) === 4;
    let if_block0 = show_if_2 && create_if_block_3();
    let if_block1 = show_if_1 && create_if_block_2();
    let if_block2 = show_if && create_if_block_1$2();
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
        attr(div, "class", "cl-tags svelte-xrdclb");
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
        if (dirty & /*it*/
        2)
          show_if_2 = (Number(
            /*it*/
            ctx2[1].labels
          ) & 1) === 1;
        if (show_if_2) {
          if (if_block0)
            ;
          else {
            if_block0 = create_if_block_3();
            if_block0.c();
            if_block0.m(div, t0);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (dirty & /*it*/
        2)
          show_if_1 = (Number(
            /*it*/
            ctx2[1].labels
          ) & 2) === 2;
        if (show_if_1) {
          if (if_block1)
            ;
          else {
            if_block1 = create_if_block_2();
            if_block1.c();
            if_block1.m(div, t1);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
        if (dirty & /*it*/
        2)
          show_if = (Number(
            /*it*/
            ctx2[1].labels
          ) & 4) === 4;
        if (show_if) {
          if (if_block2)
            ;
          else {
            if_block2 = create_if_block_1$2();
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
  function create_if_block_3(ctx) {
    let span;
    return {
      c() {
        span = element("span");
        span.textContent = "DIY";
        attr(span, "class", "_tag _tag_diy svelte-xrdclb");
      },
      m(target, anchor) {
        insert(target, span, anchor);
      },
      d(detaching) {
        if (detaching)
          detach(span);
      }
    };
  }
  function create_if_block_2(ctx) {
    let span;
    return {
      c() {
        span = element("span");
        span.textContent = "国配";
        attr(span, "class", "_tag _tag_dub svelte-xrdclb");
      },
      m(target, anchor) {
        insert(target, span, anchor);
      },
      d(detaching) {
        if (detaching)
          detach(span);
      }
    };
  }
  function create_if_block_1$2(ctx) {
    let span;
    return {
      c() {
        span = element("span");
        span.textContent = "中字";
        attr(span, "class", "_tag _tag_sub svelte-xrdclb");
      },
      m(target, anchor) {
        insert(target, span, anchor);
      },
      d(detaching) {
        if (detaching)
          detach(span);
      }
    };
  }
  function create_fragment$3(ctx) {
    let div5;
    let div4;
    let div0;
    let t0_value = (
      /*it*/
      ctx[1].category + ""
    );
    let t0;
    let t1;
    let t2;
    let div2;
    let t3;
    let div1;
    let t4;
    let t5;
    let div3;
    let t6;
    let t7;
    let t8;
    let show_if = (
      /*$_CARD_SHOW*/
      ctx[8].tags && (Number(
        /*it*/
        ctx[1].labels
      ) || 0)
    );
    let mounted;
    let dispose;
    let if_block0 = (
      /*$_CARD_SHOW*/
      ctx[8].title && create_if_block_9(ctx)
    );
    function select_block_type(ctx2, dirty) {
      if (
        /*picError*/
        ctx2[4]
      )
        return create_if_block_8;
      return create_else_block$2;
    }
    let current_block_type = select_block_type(ctx);
    let if_block1 = current_block_type(ctx);
    let if_block2 = (
      /*it*/
      ctx[1].status.discount && /*it*/
      ctx[1].status.discount != "NORMAL" && create_if_block_7(ctx)
    );
    let if_block3 = (
      /*$_CARD_SHOW*/
      ctx[8].size_download_collect && create_if_block_6(ctx)
    );
    let if_block4 = (
      /*$_CARD_SHOW*/
      ctx[8].statistics && create_if_block_5(ctx)
    );
    let if_block5 = (
      /*$_CARD_SHOW*/
      ctx[8].sub_title && /*it*/
      ctx[1].smallDescr && create_if_block_4(ctx)
    );
    let if_block6 = show_if && create_if_block$3(ctx);
    return {
      c() {
        div5 = element("div");
        div4 = element("div");
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
        div1.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
        t4 = space();
        if (if_block2)
          if_block2.c();
        t5 = space();
        div3 = element("div");
        if (if_block3)
          if_block3.c();
        t6 = space();
        if (if_block4)
          if_block4.c();
        t7 = space();
        if (if_block5)
          if_block5.c();
        t8 = space();
        if (if_block6)
          if_block6.c();
        attr(div0, "class", "card-category svelte-xrdclb");
        set_style(
          div0,
          "background-color",
          /*cateColor*/
          ctx[2]
        );
        set_style(
          div0,
          "color",
          /*cateFontColor*/
          ctx[5]
        );
        attr(div1, "class", "hover-trigger svelte-xrdclb");
        attr(div2, "class", "card-image svelte-xrdclb");
        attr(div3, "class", "card-details svelte-xrdclb");
        attr(div4, "class", "card-holder svelte-xrdclb");
        attr(div5, "class", "card svelte-xrdclb");
        set_style(
          div5,
          "width",
          /*cardWidth*/
          ctx[0] + "px"
        );
        set_style(
          div5,
          "background-color",
          /*$_current_bgColor*/
          ctx[7]
        );
        set_style(
          div5,
          "display",
          /*gayHidden*/
          ctx[6] ? "none" : ""
        );
      },
      m(target, anchor) {
        insert(target, div5, anchor);
        append(div5, div4);
        append(div4, div0);
        append(div0, t0);
        append(div4, t1);
        if (if_block0)
          if_block0.m(div4, null);
        append(div4, t2);
        append(div4, div2);
        if_block1.m(div2, null);
        append(div2, t3);
        append(div2, div1);
        append(div2, t4);
        if (if_block2)
          if_block2.m(div2, null);
        append(div4, t5);
        append(div4, div3);
        if (if_block3)
          if_block3.m(div3, null);
        append(div3, t6);
        if (if_block4)
          if_block4.m(div3, null);
        append(div4, t7);
        if (if_block5)
          if_block5.m(div4, null);
        append(div4, t8);
        if (if_block6)
          if_block6.m(div4, null);
        if (!mounted) {
          dispose = listen(
            div2,
            "click",
            /*onClickCard*/
            ctx[11]
          );
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (dirty & /*it*/
        2 && t0_value !== (t0_value = /*it*/
        ctx2[1].category + ""))
          set_data(t0, t0_value);
        if (dirty & /*cateColor*/
        4) {
          set_style(
            div0,
            "background-color",
            /*cateColor*/
            ctx2[2]
          );
        }
        if (dirty & /*cateFontColor*/
        32) {
          set_style(
            div0,
            "color",
            /*cateFontColor*/
            ctx2[5]
          );
        }
        if (
          /*$_CARD_SHOW*/
          ctx2[8].title
        ) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
          } else {
            if_block0 = create_if_block_9(ctx2);
            if_block0.c();
            if_block0.m(div4, t2);
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
        if (
          /*it*/
          ctx2[1].status.discount && /*it*/
          ctx2[1].status.discount != "NORMAL"
        ) {
          if (if_block2) {
            if_block2.p(ctx2, dirty);
          } else {
            if_block2 = create_if_block_7(ctx2);
            if_block2.c();
            if_block2.m(div2, null);
          }
        } else if (if_block2) {
          if_block2.d(1);
          if_block2 = null;
        }
        if (
          /*$_CARD_SHOW*/
          ctx2[8].size_download_collect
        ) {
          if (if_block3) {
            if_block3.p(ctx2, dirty);
          } else {
            if_block3 = create_if_block_6(ctx2);
            if_block3.c();
            if_block3.m(div3, t6);
          }
        } else if (if_block3) {
          if_block3.d(1);
          if_block3 = null;
        }
        if (
          /*$_CARD_SHOW*/
          ctx2[8].statistics
        ) {
          if (if_block4) {
            if_block4.p(ctx2, dirty);
          } else {
            if_block4 = create_if_block_5(ctx2);
            if_block4.c();
            if_block4.m(div3, null);
          }
        } else if (if_block4) {
          if_block4.d(1);
          if_block4 = null;
        }
        if (
          /*$_CARD_SHOW*/
          ctx2[8].sub_title && /*it*/
          ctx2[1].smallDescr
        ) {
          if (if_block5) {
            if_block5.p(ctx2, dirty);
          } else {
            if_block5 = create_if_block_4(ctx2);
            if_block5.c();
            if_block5.m(div4, t8);
          }
        } else if (if_block5) {
          if_block5.d(1);
          if_block5 = null;
        }
        if (dirty & /*$_CARD_SHOW, it*/
        258)
          show_if = /*$_CARD_SHOW*/
          ctx2[8].tags && (Number(
            /*it*/
            ctx2[1].labels
          ) || 0);
        if (show_if) {
          if (if_block6) {
            if_block6.p(ctx2, dirty);
          } else {
            if_block6 = create_if_block$3(ctx2);
            if_block6.c();
            if_block6.m(div4, null);
          }
        } else if (if_block6) {
          if_block6.d(1);
          if_block6 = null;
        }
        if (dirty & /*cardWidth*/
        1) {
          set_style(
            div5,
            "width",
            /*cardWidth*/
            ctx2[0] + "px"
          );
        }
        if (dirty & /*$_current_bgColor*/
        128) {
          set_style(
            div5,
            "background-color",
            /*$_current_bgColor*/
            ctx2[7]
          );
        }
        if (dirty & /*gayHidden*/
        64) {
          set_style(
            div5,
            "display",
            /*gayHidden*/
            ctx2[6] ? "none" : ""
          );
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(div5);
        if (if_block0)
          if_block0.d();
        if_block1.d();
        if (if_block2)
          if_block2.d();
        if (if_block3)
          if_block3.d();
        if (if_block4)
          if_block4.d();
        if (if_block5)
          if_block5.d();
        if (if_block6)
          if_block6.d();
        mounted = false;
        dispose();
      }
    };
  }
  function getTextColor(background) {
    const color = (background || "").replace("#", "");
    if (!/^[0-9a-fA-F]{6}$/.test(color))
      return "black";
    const red = parseInt(color.substr(0, 2), 16);
    const green = parseInt(color.substr(2, 2), 16);
    const blue = parseInt(color.substr(4, 2), 16);
    const brightness = (red * 299 + green * 587 + blue * 114) / 1e3;
    return brightness < 128 ? "white" : "black";
  }
  function getFileSize(size) {
    size = Number(size) || 0;
    if (size === 0)
      return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    let i = 0;
    let sizeCopy = size;
    while (sizeCopy >= 1024 && i < units.length - 1) {
      sizeCopy /= 1024;
      i++;
    }
    const formattedSize = sizeCopy.toFixed(2).replace(/\.?0+$/, "");
    return `${formattedSize} ${units[i]}`;
  }
  function instance$3($$self, $$props, $$invalidate) {
    let gayHidden;
    let $_SITE_SETTING;
    let $_iframe_url;
    let $_iframe_switch;
    let $_current_bgColor;
    let $_CARD_SHOW;
    let $_pic_failed_showInfo;
    component_subscribe($$self, _SITE_SETTING, ($$value) => $$invalidate(16, $_SITE_SETTING = $$value));
    component_subscribe($$self, _iframe_url, ($$value) => $$invalidate(17, $_iframe_url = $$value));
    component_subscribe($$self, _iframe_switch, ($$value) => $$invalidate(18, $_iframe_switch = $$value));
    component_subscribe($$self, _current_bgColor, ($$value) => $$invalidate(7, $_current_bgColor = $$value));
    component_subscribe($$self, _CARD_SHOW, ($$value) => $$invalidate(8, $_CARD_SHOW = $$value));
    component_subscribe($$self, _pic_failed_showInfo, ($$value) => $$invalidate(9, $_pic_failed_showInfo = $$value));
    let { torrentInfo } = $$props;
    let { cardWidth } = $$props;
    let it;
    function detailLink() {
      if (__isPTT)
        return __ksDetailUrl(it);
      if (it.id)
        return "/detail/" + it.id;
      return it.torrentLink || "#";
    }
    function onClickCard(e) {
      if (__isPTT)
        return;
      const link = detailLink();
      if (!link || link === "#")
        return;
      if (e && e.preventDefault)
        e.preventDefault();
      set_store_value(_iframe_switch, $_iframe_switch = 1, $_iframe_switch);
      set_store_value(_iframe_url, $_iframe_url = /^https?:/.test(link) ? link : location.origin + link, $_iframe_url);
    }
    let picSrc = "";
    let picError = false;
    const onPicError = () => {
      $$invalidate(4, picError = true);
      sort_masonry();
    };
    let cateColor = "transparent";
    let cateFontColor = "black";
    const _discountText = { FREE: "免费", PERCENT_50: "50%" };
    function sort_masonry() {
      sortMasonry();
    }
    $$self.$$set = ($$props2) => {
      if ("torrentInfo" in $$props2)
        $$invalidate(15, torrentInfo = $$props2.torrentInfo);
      if ("cardWidth" in $$props2)
        $$invalidate(0, cardWidth = $$props2.cardWidth);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*torrentInfo*/
      32768) {
        {
          $$invalidate(1, it = torrentInfo || {});
          $$invalidate(1, it.status = torrentInfo.status || {}, it);
        }
      }
      if ($$self.$$.dirty & /*it, $_SITE_SETTING*/
      65538) {
        $$invalidate(6, gayHidden = !__isPTT && it.category === 440 && $_SITE_SETTING.mt.hide_gay);
      }
      if ($$self.$$.dirty & /*it*/
      2) {
        $$invalidate(3, picSrc = it.imageList && it.imageList[0] || "");
      }
      if ($$self.$$.dirty & /*it, cateColor*/
      6) {
        {
          $$invalidate(2, cateColor = CONFIG.CATEGORY[it.category] ?? "transparent");
          $$invalidate(5, cateFontColor = cateColor && cateColor !== "transparent" ? getTextColor(cateColor) : "black");
        }
      }
    };
    return [
      cardWidth,
      it,
      cateColor,
      picSrc,
      picError,
      cateFontColor,
      gayHidden,
      $_current_bgColor,
      $_CARD_SHOW,
      $_pic_failed_showInfo,
      detailLink,
      onClickCard,
      onPicError,
      _discountText,
      sort_masonry,
      torrentInfo,
      $_SITE_SETTING
    ];
  }
  class TorrentCard extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$3, create_fragment$3, safe_not_equal, { torrentInfo: 15, cardWidth: 0 });
    }
  }
  function get_each_context(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[30] = list[i];
    return child_ctx;
  }
  function create_each_block(key_1, ctx) {
    let first;
    let torrentcard;
    let current;
    torrentcard = new TorrentCard({
      props: {
        torrentInfo: (
          /*info*/
          ctx[30]
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
        create_component(torrentcard.$$.fragment);
        this.first = first;
      },
      m(target, anchor) {
        insert(target, first, anchor);
        mount_component(torrentcard, target, anchor);
        current = true;
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        const torrentcard_changes = {};
        if (dirty[0] & /*infoList*/
        4)
          torrentcard_changes.torrentInfo = /*info*/
          ctx[30];
        if (dirty[0] & /*CARD*/
        1)
          torrentcard_changes.cardWidth = /*CARD*/
          ctx[0].CARD_WIDTH;
        torrentcard.$set(torrentcard_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(torrentcard.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(torrentcard.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(first);
        destroy_component(torrentcard, detaching);
      }
    };
  }
  function create_else_block$1(ctx) {
    let t_value = (
      /*LOAD_TEXT*/
      ctx[4].normal + ""
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
      ctx[4].suspend + ""
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
  function create_if_block$2(ctx) {
    let t_value = (
      /*LOAD_TEXT*/
      ctx[4].disable + ""
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
  function create_fragment$2(ctx) {
    let each_blocks = [];
    let each_1_lookup = /* @__PURE__ */ new Map();
    let t;
    let div;
    let button;
    let button_disabled_value;
    let current;
    let mounted;
    let dispose;
    let each_value = (
      /*infoList*/
      ctx[2]
    );
    const get_key = (ctx2) => (
      /*info*/
      ctx2[30].id
    );
    for (let i = 0; i < each_value.length; i += 1) {
      let child_ctx = get_each_context(ctx, each_value, i);
      let key = get_key(child_ctx);
      each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    }
    function select_block_type(ctx2, dirty) {
      if (
        /*$_turnPage*/
        ctx2[3]
      )
        return create_if_block$2;
      if (
        /*isButtonDisabled*/
        ctx2[1]
      )
        return create_if_block_1$1;
      return create_else_block$1;
    }
    let current_block_type = select_block_type(ctx);
    let if_block = current_block_type(ctx);
    return {
      c() {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        t = space();
        div = element("div");
        button = element("button");
        if_block.c();
        attr(button, "id", "turnPage");
        button.disabled = button_disabled_value = /*$_turnPage*/
        ctx[3] || /*isButtonDisabled*/
        ctx[1];
        attr(button, "class", "svelte-kydsmq");
      },
      m(target, anchor) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(target, anchor);
          }
        }
        insert(target, t, anchor);
        insert(target, div, anchor);
        append(div, button);
        if_block.m(button, null);
        current = true;
        if (!mounted) {
          dispose = listen(
            button,
            "click",
            /*turnPage*/
            ctx[5]
          );
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*infoList, CARD*/
        5) {
          each_value = /*infoList*/
          ctx2[2];
          group_outros();
          each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, t.parentNode, outro_and_destroy_block, create_each_block, t, get_each_context);
          check_outros();
        }
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
        if (!current || dirty[0] & /*$_turnPage, isButtonDisabled*/
        10 && button_disabled_value !== (button_disabled_value = /*$_turnPage*/
        ctx2[3] || /*isButtonDisabled*/
        ctx2[1])) {
          button.disabled = button_disabled_value;
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
          detach(t);
        if (detaching)
          detach(div);
        if_block.d();
        mounted = false;
        dispose();
      }
    };
  }
  function __normalizeTorrent(it) {
    if (!it)
      return it;
    if (it.imageList || it.status)
      return it;
    const status = it.status || {};
    return {
      name: it.torrent_name || it.name || "",
      id: it.torrentId != null ? it.torrentId : it.id,
      size: typeof it.size === "number" ? it.size : __parseSize(it.size),
      smallDescr: it.description || "",
      labels: it.tags ? 0 : it.labels || 0,
      category: it.categoryNumber != null ? it.categoryNumber : it.category,
      imageList: it.picLink ? [it.picLink] : [],
      status: {
        seeders: it.seeders || 0,
        leechers: it.leechers || 0,
        comments: it.comments || 0,
        discount: status.discount || __mapDiscount(it.free_type),
        toppingLevel: 0,
        createdDate: it.upload_date || "",
        discountEndTime: null
      },
      torrentLink: it.torrentLink || "",
      collection: it.collectState === "Bookmarked"
    };
  }
  function __parseSize(s) {
    if (s == null)
      return 0;
    if (typeof s === "number")
      return s;
    const m = String(s).trim().toUpperCase().match(/([\d.]+)\s*(B|KB|MB|GB|TB)/);
    if (!m)
      return 0;
    const mult = {
      B: 1,
      KB: 1024,
      MB: 1048576,
      GB: 1073741824,
      TB: 1099511627776
    }[m[2]] || 1;
    return Math.round(parseFloat(m[1]) * mult);
  }
  function __mapDiscount(free_type) {
    const t = String(free_type || "").toUpperCase();
    if (t.indexOf("FREE") !== -1)
      return "FREE";
    if (t.indexOf("50") !== -1 || t.indexOf("2X") !== -1)
      return "PERCENT_50";
    return "NORMAL";
  }
  function currentPageFromUrl() {
    try {
      const sp = new URLSearchParams(window.location.search);
      const v = parseInt(sp.get("page") || sp.get("pageNumber") || sp.get("p") || "", 10);
      return isNaN(v) || v < 1 ? 1 : v;
    } catch (e) {
      return 1;
    }
  }
  function instance$2($$self, $$props, $$invalidate) {
    var _a;
    let $_Global_Masonry;
    let $_animated;
    let $_card_layout;
    let $_current_domain;
    let $_turnPage;
    let $_current_bgColor;
    component_subscribe($$self, _Global_Masonry, ($$value) => $$invalidate(17, $_Global_Masonry = $$value));
    component_subscribe($$self, _animated, ($$value) => $$invalidate(9, $_animated = $$value));
    component_subscribe($$self, _card_layout, ($$value) => $$invalidate(10, $_card_layout = $$value));
    component_subscribe($$self, _current_domain, ($$value) => $$invalidate(18, $_current_domain = $$value));
    component_subscribe($$self, _turnPage, ($$value) => $$invalidate(3, $_turnPage = $$value));
    component_subscribe($$self, _current_bgColor, ($$value) => $$invalidate(19, $_current_bgColor = $$value));
    let { originTable } = $$props;
    let { waterfallNode } = $$props;
    function computeCardWidth(column, gap) {
      if (!waterfallNode)
        return 0;
      const _wf = waterfallNode;
      const _margin = $_card_layout.margin ?? 20;
      _wf.style.width = "calc(100vw - " + 2 * _margin + "px)";
      _wf.style.marginLeft = _margin - _wf.getBoundingClientRect().left + "px";
      _wf.style.marginRight = "0px";
      if (column <= 1 || gap <= 1) {
        console.warn("卡片列数或卡片间隔过小, 列数不小于2, 间隔不小于1");
        return 0;
      }
      const U = (_wf.clientWidth - (column - 1) * gap) / column;
      if (waterfallNode) {
        Array.from(waterfallNode.querySelectorAll(".card")).forEach((W) => {
          W.style.width = U + "px";
        });
      }
      return U;
    }
    function CHANGE_CARD_LAYOUT() {
      const { column, gap } = $_card_layout;
      const U = computeCardWidth(column, gap);
      if (U <= 0)
        return;
      $$invalidate(0, CARD.CARD_WIDTH = U, CARD);
      if (masonry2) {
        $$invalidate(8, masonry2.options.columnWidth = U, masonry2);
        $$invalidate(8, masonry2.options.gutter = gap, masonry2);
        $$invalidate(8, masonry2.options.transitionDuration = $_animated ? 0.4 : 0, masonry2);
        masonry2.layout();
      }
      sortMasonry("fast");
      sortMasonry("fast");
    }
    window.CHANGE_CARD_LAYOUT = CHANGE_CARD_LAYOUT;
    let isButtonDisabled = false;
    let onMountSignal = false;
    const LOAD_TEXT = {
      normal: "点击加载下一页",
      suspend: `下一页加载CD: ${PAGE.GAP} ms`,
      disable: "不可用"
    };
    function turnPage(event) {
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
    window.turnPage = turnPage;
    set_store_value(_current_domain, $_current_domain = GET_CURRENT_PT_DOMAIN(), $_current_domain);
    const mainOuterDOM = document.querySelector("table.mainouter");
    const themeColor = mainOuterDOM ? window.getComputedStyle(mainOuterDOM)["background-color"] : "#1a1a1a";
    set_store_value(_current_bgColor, $_current_bgColor = themeColor, $_current_bgColor);
    console.log("背景颜色:", themeColor);
    const config = SITE[$_current_domain];
    let infoList = [];
    const isMT2 = IS_MT($_current_domain);
    if (isMT2) {
      console.log("M-Team NEW_MT 站: 走劫持 /search 数据源路由");
    } else {
      infoList = [
        ...infoList,
        ...__isPTT ? __pttParse(originTable) : config.TORRENT_LIST_TO_JSON(originTable).map(__normalizeTorrent)
      ];
    }
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
    debounceLoad = debounce(loadNextPage, PAGE.GAP);
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
        if (__isPTT) {
          const objs = __pttParse(doc);
          if (objs.length) {
            $$invalidate(2, infoList = [...infoList, ...objs]);
            PAGE.IS_ORIGIN = false;
            PAGE.PAGE_CURRENT = PAGE.PAGE_NEXT;
            onMountSignal = true;
            setTimeout(
              () => {
                onMountSignal = false;
              },
              1e3
            );
          } else {
            console.log("获取不到下页信息, 可能到头了");
          }
          __kesaSavePageState(PAGE.PAGE_NEXT);
          __kesaPageInd(PAGE.PAGE_NEXT);
          return;
        }
        const list = Array.from(table.cloneNode(true).children[0].children);
        list[0].children[1].textContent = `
        ↓ 新加载第${PAGE.PAGE_NEXT - PAGE.PAGE_ORIGIN}页`;
        console.log(PAGE.PAGE_ORIGIN);
        originTable.children[0].append(...list);
        typeof ((_a2 = SITE[$_current_domain]) == null ? void 0 : _a2.pageLoaded) === "function" ? (_b = SITE[$_current_domain]) == null ? void 0 : _b.pageLoaded() : null;
        $$invalidate(2, infoList = [...infoList, ...config.TORRENT_LIST_TO_JSON(table).map(__normalizeTorrent)]);
        PAGE.IS_ORIGIN = false;
        PAGE.PAGE_CURRENT = PAGE.PAGE_NEXT;
        __kesaSavePageState(PAGE.PAGE_NEXT);
        __kesaPageInd(PAGE.PAGE_NEXT);
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
      $$invalidate(8, masonry2 = new Masonry(
        waterfallNode,
        {
          itemSelector: ".card",
          columnWidth: computeCardWidth($_card_layout.column, $_card_layout.gap),
          gutter: $_card_layout.gap,
          transitionDuration: $_animated ? 0.4 : 0
        }
      ));
      window.masonry = masonry2;
      set_store_value(_Global_Masonry, $_Global_Masonry = masonry2, $_Global_Masonry);
      masonry2.layout("fast");
      masonry2.layout("fast");
      __kesaRestorePage();
      __kesaSavePageState(currentPageFromUrl());
      __kesaPageInd(currentPageFromUrl());
      if (!window.__kesaResizeBound) {
        window.__kesaResizeBound = true;
        let rTimer = null;
        window.addEventListener("resize", function() {
          clearTimeout(rTimer);
          rTimer = setTimeout(
            function() {
              window.CHANGE_CARD_LAYOUT && window.CHANGE_CARD_LAYOUT();
            },
            120
          );
        });
      }
      if (isMT2) {
        __mteamBoot();
      }
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
      window.NEXUS_TOOLS = NEXUS_TOOLS;
    });
    let __mteamReqListener = null;
    let __mteamResListener = null;
    let __mteamIsAccept = false;
    function __mteamBoot() {
      Launch_Hijack({ path: "/search", method: "POST" });
      __mteamReqListener = (e) => {
        const url = e.detail && e.detail.url || "";
        const body = e.detail && e.detail.body || "";
        if (url.includes("api/torrent/search") && !String(body).includes('"mode":"waterfall"')) {
          __mteamIsAccept = true;
        } else {
          __mteamIsAccept = false;
        }
      };
      window.addEventListener("req>POST->/search", __mteamReqListener);
      __mteamResListener = (e) => {
        if (!__mteamIsAccept)
          return;
        try {
          const rawObject = JSON.parse(e.detail.data);
          const list = rawObject && rawObject.data ? rawObject.data : [];
          if (!Array.isArray(list))
            return;
          $$invalidate(2, infoList = list.map(__normalizeTorrent));
          if (masonry2) {
            masonry2.reloadItems();
            masonry2.layout("fast");
            masonry2.layout("fast");
          }
          setTimeout(NEXUS_TOOLS, 600);
        } catch (err) {
          console.warn("M-Team 响应解析失败:", err);
        }
      };
      window.addEventListener("res>POST->/search", __mteamResListener);
    }
    afterUpdate(() => {
      console.log("afterUpdate-------------------->");
      if (masonry2 && onMountSignal) {
        console.log("reload Items-------------------->");
        masonry2.reloadItems();
        masonry2.layout();
        setTimeout(NEXUS_TOOLS, 600);
      }
    });
    $$self.$$set = ($$props2) => {
      if ("originTable" in $$props2)
        $$invalidate(6, originTable = $$props2.originTable);
      if ("waterfallNode" in $$props2)
        $$invalidate(7, waterfallNode = $$props2.waterfallNode);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty[0] & /*masonry, $_animated*/
      768) {
        if (masonry2) {
          $$invalidate(8, masonry2.options.transitionDuration = $_animated ? 0.4 : 0, masonry2);
        }
      }
      if ($$self.$$.dirty[0] & /*masonry, $_card_layout, CARD*/
      1281) {
        if (masonry2) {
          $$invalidate(0, CARD.CARD_WIDTH = computeCardWidth($_card_layout.column, $_card_layout.gap), CARD);
          console.log("卡片宽度:	", CARD.CARD_WIDTH);
          CHANGE_CARD_LAYOUT();
        }
      }
    };
    return [
      CARD,
      isButtonDisabled,
      infoList,
      $_turnPage,
      LOAD_TEXT,
      turnPage,
      originTable,
      waterfallNode,
      masonry2,
      $_animated,
      $_card_layout
    ];
  }
  class Index extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$2, create_fragment$2, safe_not_equal, { originTable: 6, waterfallNode: 7 }, null, [-1, -1]);
    }
  }
  function create_else_block(ctx) {
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
  function create_if_block_1(ctx) {
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
  function create_if_block$1(ctx) {
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
  function create_fragment$1(ctx) {
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
        return create_if_block$1;
      if (
        /*isButtonDisabled*/
        ctx2[0]
      )
        return create_if_block_1;
      return create_else_block;
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
        attr(button, "class", "svelte-2j14uu");
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
  function instance$1($$self, $$props, $$invalidate) {
    let $_turnPage;
    component_subscribe($$self, _turnPage, ($$value) => $$invalidate(1, $_turnPage = $$value));
    let isButtonDisabled = false;
    const LOAD_TEXT = {
      normal: "点击加载下一页",
      suspend: `下一页加载CD: ${GAP} ms`,
      disable: "不可用"
    };
    function func(event) {
      event.preventDefault();
      window.turnPage(event);
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
    return [isButtonDisabled, $_turnPage, LOAD_TEXT, func];
  }
  class BtnTurnPage extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$1, create_fragment$1, safe_not_equal, {});
    }
  }
  const { window: window_1 } = globals;
  function create_if_block(ctx) {
    let div1;
    let div0;
    let iframe;
    let iframe_src_value;
    let div1_transition;
    let current;
    let mounted;
    let dispose;
    return {
      c() {
        div1 = element("div");
        div0 = element("div");
        iframe = element("iframe");
        if (!src_url_equal(iframe.src, iframe_src_value = /*$_iframe_url*/
        ctx[2]))
          attr(iframe, "src", iframe_src_value);
        attr(iframe, "frameborder", "0");
        attr(iframe, "title", "wow");
        set_style(iframe, "width", (SITE[
          /*$_current_domain*/
          ctx[0]
        ] ? SITE[
          /*$_current_domain*/
          ctx[0]
        ].Iframe_Width : 1e3) + "px");
        attr(iframe, "class", "svelte-zv560o");
        attr(div0, "class", "_iframe svelte-zv560o");
        attr(div1, "id", "_iframe");
        attr(div1, "class", "svelte-zv560o");
      },
      m(target, anchor) {
        insert(target, div1, anchor);
        append(div1, div0);
        append(div0, iframe);
        current = true;
        if (!mounted) {
          dispose = listen(
            div1,
            "click",
            /*toggleIframe*/
            ctx[3]
          );
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
        1) {
          set_style(iframe, "width", (SITE[
            /*$_current_domain*/
            ctx2[0]
          ] ? SITE[
            /*$_current_domain*/
            ctx2[0]
          ].Iframe_Width : 1e3) + "px");
        }
      },
      i(local) {
        if (current)
          return;
        add_render_callback(() => {
          if (!current)
            return;
          if (!div1_transition)
            div1_transition = create_bidirectional_transition(div1, fade, { duration: 300 }, true);
          div1_transition.run(1);
        });
        current = true;
      },
      o(local) {
        if (!div1_transition)
          div1_transition = create_bidirectional_transition(div1, fade, { duration: 300 }, false);
        div1_transition.run(0);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div1);
        if (detaching && div1_transition)
          div1_transition.end();
        mounted = false;
        dispose();
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
            ctx[4],
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
  function instance($$self, $$props, $$invalidate) {
    let $_current_domain;
    let $_show_configPanel;
    let $_iframe_switch;
    let $_show_mode;
    let $_iframe_url;
    component_subscribe($$self, _current_domain, ($$value) => $$invalidate(0, $_current_domain = $$value));
    component_subscribe($$self, _show_configPanel, ($$value) => $$invalidate(9, $_show_configPanel = $$value));
    component_subscribe($$self, _iframe_switch, ($$value) => $$invalidate(1, $_iframe_switch = $$value));
    component_subscribe($$self, _show_mode, ($$value) => $$invalidate(6, $_show_mode = $$value));
    component_subscribe($$self, _iframe_url, ($$value) => $$invalidate(2, $_iframe_url = $$value));
    console.log(`[${( new Date()).toLocaleTimeString()}]<--------------------------HMR-------------------------->`);
    let _ORIGIN_TL_Node2 = document.querySelector(GET_TORRENT_LIST_SELECTOR());
    if (!_ORIGIN_TL_Node2 && IS_MT(window.location.hostname)) {
      _ORIGIN_TL_Node2 = document.querySelector("#__kesaMTPlaceholder");
    }
    while (!Masonry) {
      console.log("等待初始化......");
    }
    const parentNode = _ORIGIN_TL_Node2.parentNode;
    const waterfallNode = document.createElement("div");
    waterfallNode.classList.add("waterfall");
    parentNode.insertBefore(waterfallNode, _ORIGIN_TL_Node2.nextSibling);
    const nextPageNode = document.createElement("div");
    nextPageNode.classList.add("nextPage");
    parentNode.insertBefore(nextPageNode, _ORIGIN_TL_Node2.nextSibling);
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
    _previewWidth.subscribe((__pwV) => {
      try {
        const __site = SITE[$_current_domain];
        if (__site && __pwV > 0)
          __site.Iframe_Width = __pwV;
        const __def = __site && __site.Iframe_Width || 1e3;
        document.documentElement.style.setProperty("--pw", (__pwV > 0 ? __pwV : __def) + "px");
      } catch (e) {
      }
    });
    _previewHeight.subscribe((__phV) => {
      try {
        document.documentElement.style.setProperty("--ph", (__phV > 0 ? __phV : 96) + "%");
      } catch (e) {
      }
    });
    if (!document.getElementById("__pwSizeCss")) {
      const __pwStyle = document.createElement("style");
      __pwStyle.id = "__pwSizeCss";
      __pwStyle.textContent = "div#_iframe ._iframe{width:min(var(--pw,1600px),94vw)!important;height:var(--ph,96%)!important}div#_iframe ._iframe iframe{width:100%!important;height:100%}";
      (document.head || document.documentElement).appendChild(__pwStyle);
    }
    onMount(() => {
      new Sidepanel({
        target: document.body,
        props: {
          // 传递给组件的属性
          originTable: _ORIGIN_TL_Node2
        }
      });
      new Index({
        target: waterfallNode,
        props: {
          // 传递给组件的属性
          originTable: _ORIGIN_TL_Node2,
          waterfallNode
        }
      });
      new BtnTurnPage({ target: nextPageNode });
      __wdvAutoSync();
      window.addEventListener("pagehide", __wdvAutoPush);
    });
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*_ORIGIN_TL_Node, $_show_mode*/
      96) {
        {
          if (_ORIGIN_TL_Node2) {
            $$invalidate(5, _ORIGIN_TL_Node2.style.display = $_show_mode ? "none" : "block", _ORIGIN_TL_Node2);
          }
          nextPageNode.style.display = $_show_mode ? "none" : "block";
          waterfallNode.style.display = $_show_mode ? "block" : "none";
        }
      }
    };
    return [
      $_current_domain,
      $_iframe_switch,
      $_iframe_url,
      toggleIframe,
      key_closePanels,
      _ORIGIN_TL_Node2,
      $_show_mode
    ];
  }
  class Main extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance, create_fragment, safe_not_equal, {});
    }
  }
  console.log("________PT-TorrentList-Masonry________");
  const list_selector = GET_TORRENT_LIST_SELECTOR();
  let _ORIGIN_TL_Node = null;
  const isMT = IS_MT(window.location.hostname);
  function mountApp() {
    new Main({
      target: (() => {
        const div = document.createElement("div");
        document.body.append(div);
        return div;
      })()
    });
  }
  if (!list_selector) {
    console.log("未识别到种子列表 selector 捏~");
  } else if (isMT) {
    _ORIGIN_TL_Node = document.createElement("div");
    _ORIGIN_TL_Node.id = "__kesaMTPlaceholder";
    _ORIGIN_TL_Node.style.display = "none";
    document.body.append(_ORIGIN_TL_Node);
    console.log("M-Team NEW_MT 站: 已创建瀑布流挂载占位节点");
    mountApp();
  } else {
    let tries = 0;
    const MAX_TRIES = 100;
    const waitTimer = setInterval(() => {
      tries++;
      _ORIGIN_TL_Node = document.querySelector(list_selector);
      if (_ORIGIN_TL_Node || tries > MAX_TRIES) {
        clearInterval(waitTimer);
        if (_ORIGIN_TL_Node) {
          mountApp();
        } else {
          console.log("等待超时: 未识别到种子列表 DOM 捏~");
        }
      }
    }, 100);
  }

})();