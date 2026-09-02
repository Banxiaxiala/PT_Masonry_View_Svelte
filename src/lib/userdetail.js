// lib/userdetail.js — 用户详情页专用功能
// 在用户详情页注入"记录完成/未完成种子为已读"按钮，点击后提取
// 完成种子(completed) 与 未完成种子(incomplete) 的全部 torrent_id，
// 合并写入瀑布流已读记录 localStorage["Kesa:Masonry"]._read_ids.<host>。
// 支持三类用户详情页：
//   ① NexusPHP(userdetails.php?id=N): kamept/pttime/nicept/ptfans
//      接口 getusertorrentlistajax.php?page=N&userid=UID&type=TYPE (page 从 0)
//   ② mua.xloli.cc(userdetails.php?uuid=...): 同为 NexusPHP 结构但**参数名是 `useruuid`**(实测确认)
//      接口 getusertorrentlistajax.php?useruuid=UUID&type=TYPE&page=N (**page 从 0**, 跟其他 NexusPHP 一致)
//   ③ M-Team(kp.m-team.cc/profile/detail/N): mTorrent/antd SPA **优先走官方接口**
//      POST /member/getUserTorrentList {userid, type:COMPLETED|INCOMPLETE, pageNumber, pageSize}
//      (HMAC 签名与 _index.svelte 同套), 失败才回退点击"察看"展开 ant-modal 翻页收集。
// 仅在这些页面生效，不干扰种子列表页/种子详情页的瀑布流主逻辑。

const __READ_NS = 'Kesa:Masonry';     // 与 sync.js 的 __STORE_NS 保持一致
const __READ_KEY = '_read_ids';        // 已读 id 数组子键(不带 host 后缀，见 __readKey)
const __PAGE_SIZE = 100;               // KamePT 用户详情分类每页条数
const __FETCH_INTERVAL = 300;          // 抓取分页间隔(ms)
const __MT_PAGE_INTERVAL = 4000;       // M-Team 翻页间隔(ms)，避免触发"请求频繁"限流(4s 保守)

/** 站点域名 → 用户详情页分类的标题文字(做种行第一格)，用于定位区块 */
const __UD_SITE_ROW = {
  'kamept.com': { completed: /完成种子/, incomplete: /未完成种子/ },
  'www.pttime.org': { completed: /完成种子/, incomplete: /未完成种子/ },
  'pttime.org': { completed: /完成种子/, incomplete: /未完成种子/ },
  'nicept.net': { completed: /完成种子/, incomplete: /未完成种子/ },
  'www.nicept.net': { completed: /完成种子/, incomplete: /未完成种子/ },
  'ptfans.cc': { completed: /完成种子/, incomplete: /未完成种子/ },
  'www.ptfans.cc': { completed: /完成种子/, incomplete: /未完成种子/ },
  'mua.xloli.cc': { completed: /完成种子/, incomplete: /未完成种子/ },
};

/** M-Team 域名匹配(任意 *.m-team.cc 子域), 用于 mTorrent profile 页 */
const __UD_IS_MT = /(?:^|\.)m-team\.cc$/i;

const __HOST = location.hostname;
const __IS_MT = __UD_IS_MT.test(__HOST);

// ---- 各站点用户标识提取 ----
// ① NexusPHP: userdetails.php?id=N
const __USERID = (location.search.match(/[?&]id=(\d+)/) || [])[1] || '';
// ② mua: userdetails.php?uuid=...
const __USERUUID = (location.search.match(/[?&]uuid=([^&]+)/) || [])[1] || '';
// ③ M-Team profile: /profile/detail/<id>
const __MT_PROFILE_ID = (location.pathname.match(/\/profile\/detail\/(\d+)/) || [])[1] || '';

/** 是否为用户详情页(三类都识别) */
function __isUserDetailsPage() {
  if (/userdetails\.php/i.test(location.pathname)) return true;      // ① NexusPHP / ② mua
  if (__IS_MT && /\/profile\/detail\//i.test(location.pathname)) return true; // ③ M-Team
  return false;
}

/** 读取某站已读 id 数组 */
function __readIds() {
  try {
    const obj = JSON.parse(localStorage.getItem(__READ_NS) || '{}') || {};
    const arr = obj[__READ_KEY + '.' + __HOST];
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}

/** 合并写入已读 id(去重)，返回新增条数 */
function __writeReadIds(newIds) {
  const cur = __readIds();
  const set = new Set(cur);
  let added = 0;
  for (const id of newIds) {
    if (!set.has(id)) {
      set.add(id);
      added++;
    }
  }
  try {
    const obj = JSON.parse(localStorage.getItem(__READ_NS) || '{}') || {};
    obj[__READ_KEY + '.' + __HOST] = Array.from(set);
    localStorage.setItem(__READ_NS, JSON.stringify(obj));
  } catch (e) { /* 忽略存储失败 */ }
  return added;
}

function __sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * M-Team API 通用调用：在 MAIN_WORLD 注入脚本读取 localStorage(auth/did/visitorId),
 * 构造 HMAC-SHA1 签名请求调用官方接口，结果通过 document 自定义事件回传沙盒。
 * 与 _index.svelte 的 __mtFetchFallback(劫持 sandbox)同一套签名机制。
 * @param {string} path 接口路径(如 "/member/getUserTorrentList")
 * @param {object} body 业务参数字典(不含 _timestamp/_sgin)
 * @param {number} [timeout] 超时 ms，默认 12000
 * @returns {Promise<object|null>} 接口 JSON 响应(含 code/message/data)；出错或超时返回 null
 */
function __mteamApiPost(path, body, timeout) {
  return new Promise((resolve) => {
    const __token = 'm' + Date.now() + Math.random().toString(36).slice(2);
    const __done = (v) => { clearTimeout(tid); window.removeEventListener('__kesaMtApi', __on); resolve(v); };
    const __on = (e) => {
      const d = e && e.detail;
      if (!d || d.token !== __token) return;
      if (d.error) { __done(null); return; }
      __done(d.result || null);
    };
    const tid = setTimeout(() => __done(null), timeout || 12000);
    window.addEventListener('__kesaMtApi', __on);
    const script = document.createElement('script');
    script.textContent =
      '(function(){' +
      'try{' +
      '__kesaMtReq(' + JSON.stringify(path) + ',' + JSON.stringify(body) + ',' + JSON.stringify(__token) + ');' +
      '}catch(e){document.dispatchEvent(new CustomEvent("__kesaMtApi",{detail:{token:' + JSON.stringify(__token) + ',error:String(e)}}));}' +
      '})();';
    (document.head || document.documentElement).appendChild(script);
    script.remove();
  });
}

/**
 * M-Team API 收集器：分页调用官方接口 /member/getUserTorrentList 提取完成/未完成种子 id。
 * 相比 DOM 点击"察看"展开 ant-modal 翻页，走官方接口更稳定，且不受分页条省略号折叠影响。
 * 返回 { completed, incomplete } 两个 Set；任一组失败返回对应空 Set(由主流程决定是否回退 DOM)。
 */
async function __collectMTeamViaApi() {
  const result = { completed: new Set(), incomplete: new Set() };
  const map = { completed: 'COMPLETED', incomplete: 'INCOMPLETE' };
  const userId = __MT_PROFILE_ID; // 抓包实测: userid 传字符串(如 "349701")
  if (!userId) return result;
  // 注: 不再预热 /system/getConf——抓包确认它是 multipart(form-data items=...),
  // 用 JSON 空体调用会挂起/无意义, 且实测不带它也能正常调 getUserTorrentList。
  const pageSize = 100; // 抓包实测: 页面用 pageSize=100(分页条每页 100)
  for (const type of ['completed', 'incomplete']) {
    const set = result[type];
    let page = 1;
    for (; page <= 1000; page++) { // swagger: pageNumber 最大 1000
      let resp;
      try {
        resp = await __mteamApiPost('/member/getUserTorrentList', {
          userid: userId, type: map[type], pageNumber: page, pageSize: pageSize,
        });
      } catch (e) {
        console.warn('[kesa-userdetail][mt-api] ' + type + ' 第' + page + '页请求异常:', e);
        break;
      }
      // 响应结构 Result{code,message,data}；成功 code=0, data 键为
      // {pageNumber,pageSize,total,totalPages,data}, data.data 每条为
      // {torrent,snatched,peer,seek}, 种子 id 在 item.torrent.id
      if (!resp) { console.warn('[kesa-userdetail][mt-api] ' + type + ' 第' + page + '页超时/失败'); break; }
      if (resp.code != null && resp.code !== 0 && resp.code !== 200) {
        console.warn('[kesa-userdetail][mt-api] ' + type + ' code=' + resp.code, resp.message);
        // 一次性打印响应结构便于定位字段差异
        if (!window.__kesaMtApiDiag && resp.data != null) { window.__kesaMtApiDiag = true; console.log('[kesa-userdetail][mt-api] 原始 data 键=', Object.keys(resp.data)); }
        break;
      }
      const dataObj = resp.data || {};
      // 种子数组: data.data; 每页与总页数信息在 data.total/data.totalPages
      const list = Array.isArray(dataObj.data) ? dataObj.data : [];
      const totalPages = parseInt(dataObj.totalPages, 10);
      if (!list.length) {
        // 首次失败时打印结构, 便于对实际 JSON 调整
        if (!window.__kesaMtApiDiag && resp.data != null) {
          window.__kesaMtApiDiag = true;
          console.log('[kesa-userdetail][mt-api] 响应无种子数组, data=', JSON.stringify(resp.data).slice(0, 500));
        }
        break;
      }
      // 首次成功时打印条目结构, 便于确认 id 字段路径
      if (!window.__kesaMtApiDiag) {
        window.__kesaMtApiDiag = true;
        console.log('[kesa-userdetail][mt-api] 首个条目键=', Object.keys(list[0]), '| torrent.id=', list[0].torrent && list[0].torrent.id);
      }
      list.forEach((it) => {
        // 实测: id 在 it.torrent.id(种子对象), 兼容 torrentId/id 兜底
        const t = it && (it.torrent || it);
        const tid = t != null && t.torrentId != null ? t.torrentId
          : (t != null && t.id != null ? t.id : null);
        if (tid != null) set.add(String(tid));
      });
      if (page % 5 === 0) { console.log('[kesa-userdetail][mt-api] ' + type + ' 已抓取 ' + page + ' 页, 累计 ' + set.size); }
      // 精准分页终止: data.totalPages 已知时用它; 否则按"返回数<pageSize"兜底
      if (totalPages > 0) { if (page >= totalPages) break; }
      else if (list.length < pageSize) break;
    }
    console.log('[kesa-userdetail][mt-api] ' + type + ' 遍历 ' + (page - 1) + ' 页, 累计 ' + set.size + ' 条');
  }
  return result;
}

/** ③ M-Team：先用官方 API 收集，失败再回退 DOM 点击遍历(见下方 __collectMTeamTorrentIds) */
async function __collectMTeam() {
  // 注入 M-Team 签名辅助函数(幂等)：在 MAIN_WORLD 定义 __kesaMtApiInit/__kesaMtReq，
  // 读取 localStorage(auth/did/visitorId/apiHost) 构造 HMAC-SHA1 签名请求官方接口，
  // 结果经 __kesaMtApi 自定义事件回传沙盒。签名算法与 _index.svelte 完全一致。
  const mw =
    'window.__kesaMtReq || (window.__kesaMtApiInit=function(){' +
    'var __secret="HLkPcWmycL57mfJt";' +
    'window.__kesaMtReq=function(path,body,token){' +
    'try{' +
    'var __apiHost=localStorage.getItem("apiHost")||"";' +
    // M-Team 真实 API 域名(localStorage apiHost, 抓包确认 api2.m-team.cc/api; api.m-team.io 亦可用)。
    // 无 localStorage apiHost 时对 m-team.cc 子域直接用 api2.m-team.cc/api。
    'if(!__apiHost && /m-team\\.cc/i.test(location.hostname)) __apiHost="https://api2.m-team.cc/api";' +
    'var __u=(__apiHost||("https://api2.m-team"+location.origin.match(/\\.([^.]+)$/)[0]+"/api"))+path;' +
    'var __o={};for(var k in body)__o[k]=body[k];__o._timestamp=Date.now();' +
    'if(!window.crypto||!window.crypto.subtle){document.dispatchEvent(new CustomEvent("__kesaMtApi",{detail:{token:token,error:"no-crypto"}}));return;}' +
    'window.crypto.subtle.importKey("raw",new TextEncoder().encode(__secret),{name:"HMAC",hash:"SHA-1"},false,["sign"])' +
    '.then(function(k){return window.crypto.subtle.sign("HMAC",k,new TextEncoder().encode("POST&"+new URL(__u).pathname+"&"+__o._timestamp));})' +
    '.then(function(sig){__o._sgin=btoa(String.fromCharCode.apply(null,new Uint8Array(sig)));' +
    'var __h={"Content-Type":"application/json",version:"1.1.7",webVersion:"1170",visitorId:localStorage.getItem("visitorId")||"",did:localStorage.getItem("did")||"",authorization:localStorage.getItem("auth")||"",ts:Math.floor(Date.now()/1e3)};' +
    'return fetch(__u,{method:"POST",headers:__h,body:JSON.stringify(__o)});})' +
    '.then(function(r){return r.json();})' +
    '.then(function(j){document.dispatchEvent(new CustomEvent("__kesaMtApi",{detail:{token:token,result:j}}));})' +
    '.catch(function(e){document.dispatchEvent(new CustomEvent("__kesaMtApi",{detail:{token:token,error:String(e)}}));});' +
    '}catch(e){document.dispatchEvent(new CustomEvent("__kesaMtApi",{detail:{token:token,error:String(e)}}));}' +
    '};' +
    'return true;' +
    '}())';
  try {
    const s = document.createElement('script');
    s.textContent = mw;
    (document.head || document.documentElement).appendChild(s);
    s.remove();
  } catch (e) { /* 忽略 */ }
  const api = await __collectMTeamViaApi();
  const apiOk = api.completed.size > 0 || api.incomplete.size > 0;
  if (apiOk) {
    console.log('[kesa-userdetail][mt] 优先采用官方 API 收集: 完成' + api.completed.size + ' 未完成' + api.incomplete.size);
    return api;
  }
  console.warn('[kesa-userdetail][mt] API 收集为空, 回退 DOM 点击遍历');
  return __collectMTeamTorrentIds();
}

/**
 * ① 遍历 NexusPHP/mua 某分类(completed/incomplete)全部分页，提取所有 torrent_id。
 * - mua 参数为 useruuid、page 从 0 起；其余 NexusPHP 为 userid、page 从 0 起。
 * - **PTT(pttime.org)特殊**：实测其 getusertorrentlistajax.php **忽略 page 参数**，
 *   无论 page=0/1/2... 都只返回固定前 10 条(无分页条) → 分页循环只抓到 10 条。
 *   PTT 需改用非 ajax 的 getusertorrentlist.php?type=X&userid=N (服务端渲染完整列表,
 *   一次性返回全部完成/未完成种子, 不分页)。用 page 循环在此站会永远漏抓(38→10)。
 */
async function __collectNexusTorrentIds(type) {
  const ids = new Set();
  const isMua = /mua\.xloli\.cc/i.test(__HOST);
  const isPttime = /pttime\.org/i.test(__HOST);
  const uidParam = isMua ? ('useruuid=' + encodeURIComponent(__USERUUID)) : ('userid=' + __USERID);

  // PTT: 直接抓非 ajax 完整列表页 getusertorrentlist.php(type 小写), 一次性拿全不分页
  if (isPttime) {
    const url = location.origin + '/getusertorrentlist.php?' + uidParam + '&type=' + type;
    console.log('[kesa-userdetail][ptt] 一次性抓取完整列表 type=' + type, url);
    let html = '';
    try {
      const resp = await fetch(url);
      html = await resp.text();
    } catch (e) {
      console.error('[kesa-userdetail][ptt] 抓取 ' + type + ' 失败', e);
      return ids;
    }
    const doc = new DOMParser().parseFromString(html, 'text/html');
    doc.querySelectorAll('a[href*="details.php?id="]').forEach((a) => {
      const href = a.getAttribute('href') || '';
      if (href.indexOf('userdetails.php') !== -1) return; // 排除 userdetails 链接
      const m = href.match(/details\.php\?id=(\d+)/);
      if (m) ids.add(m[1]);
    });
    console.log('[kesa-userdetail][ptt] type=' + type + ' 完成, 累计id=' + ids.size);
    return ids;
  }

  // 截图证据(完成种子 101 条, 1-100/101-101)表明 mua 跟其他 NexusPHP 一样 page 从 0 起;
  // 1.2.70b 误猜 page=1 导致只抓到第二页 1 条。统一从 0 起。
  let page = 0;
  let pageCount = 0;
  if (isMua) console.log('[kesa-userdetail][mua] 开始收集 type=' + type, 'uid=' + uidParam, '起始page=' + page);
  while (true) {
    const url = location.origin + '/getusertorrentlistajax.php?' + uidParam + '&type=' + type + '&page=' + page;
    let html = '';
    try {
      const resp = await fetch(url);
      html = await resp.text();
    } catch (e) {
      console.error('[kesa-userdetail] 抓取 ' + type + ' 第 ' + page + ' 页失败', e);
      break;
    }
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const pageIds = new Set();
    doc.querySelectorAll('a[href*="details.php?id="]').forEach((a) => {
      const m = (a.getAttribute('href') || '').match(/details\.php\?id=(\d+)/);
      if (m) pageIds.add(m[1]);
    });
    pageCount++;
    if (isMua) {
      console.log('[kesa-userdetail][mua] 第' + page + '页(type=' + type + '): htmlLen=' + html.length,
        '本页id数=' + pageIds.size, '样本=' + Array.from(pageIds).slice(0, 5).join(','));
    }
    pageIds.forEach((id) => ids.add(id));
    // 判断是否还有下一页：分页条中"下一页"是带 href 的 <a> 即为有下一页；
    // mua 分页条可能用其他写法, 同时也接受 href 含 type=&page= 的页码 a
    const pagLinks = Array.from(doc.querySelectorAll('.nexus-pagination a'));
    const next = pagLinks.find((el) => /下一页|next/i.test(el.textContent || ''))
      || pagLinks.find((el) => /page=\d+/i.test(el.getAttribute('href') || '') && !/(?:^|\W)page=0(?:$|&|\W)/i.test(el.getAttribute('href') || ''));
    if (isMua) console.log('[kesa-userdetail][mua] 第' + page + '页 有下一页?', !!next, 'nexus-pagination a 数=', pagLinks.length, 'hrefs=', pagLinks.map((a) => a.getAttribute('href')).join('|'));
    if (!next) break;
    page++;
    await __sleep(__FETCH_INTERVAL);
  }
  if (isMua) console.log('[kesa-userdetail][mua] type=' + type + ' 完成, 遍历页数=' + pageCount, '累计id=' + ids.size);
  return ids;
}

/**
 * ③ M-Team mTorrent profile 页：点击"完成種子/未完成種子"行的"察看"按钮展开，
 * 展开后的种子表格渲染在一个 **ant-modal 对话框**(ant-modal-root)里(独立 overlay)，
 * 并非该行表格的子元素。因此必须按 modal 标题定位到对应对话框，在 modal 内部
 * 收集 /detail/<id> 链接与 data-row-key，并在 modal 内部翻页。
 * 返回 { completed, incomplete } 两组的 id Set。
 */
async function __collectMTeamTorrentIds() {
  const result = { completed: new Set(), incomplete: new Set() };
  const rowRegex = { completed: /完成種子/, incomplete: /未完成種子/ };
  const modalTitleRe = { completed: /完成種子/, incomplete: /未完成種子/ };
  const rowKeyPrefix = { completed: 'COMPLETED_', incomplete: 'INCOMPLETED_' };

  // 找到"完成種子/未完成種子"区块行(表格行，第一格标题含关键词)
  const findRowCell = (re) => {
    const rows = Array.from(document.querySelectorAll('tr'));
    for (const tr of rows) {
      const tds = Array.from(tr.children);
      if (tds.length >= 2 && re.test(tds[0].innerText || '')) return tds;
    }
    return null;
  };

  /**
   * 判断元素是否真正可见：沿祖先链向上冒泡，任何一层 getComputedStyle.display 为
   * none 即视为隐藏。antd 隐藏的 modal 是通过外层 .ant-modal-wrap 的 CSS 设为
   * display:none，而 dialog 自身内联 style.display 为空字符串，所以不能用
   * `el.style.display` 判断(会误判空 modal 为可见)。必须用 getComputedStyle 冒泡。
   */
  const isModalVisible = (el) => {
    let n = el;
    while (n) {
      try {
        if (getComputedStyle(n).display === 'none') return false;
      } catch (e) { /* 忽略个别祖先报错 */ }
      n = n.parentElement;
    }
    return true;
  };

  /**
   * 等待"标题匹配 + 真正可见 + 表格已渲染(.ant-table 存在)"的 modal 对话框；超时返回 null。
   * 就绪条件不能只看标题/可见——antd 打开 modal 时先渲染容器后异步回填数据，且
   * 未完成种子可能为空(无 .ant-pagination、无行)。用 .ant-table 兜底：只要 ant-table
   * 结构渲染出来就认为该 modal 可收集(空则收集到 0 条，符合实际)。
   */
  const waitForModal = (titleRe) =>
    new Promise((resolve) => {
      let attempts = 0;
      const timer = setInterval(() => {
        const hit = Array.from(document.querySelectorAll('[role="dialog"]')).find((d) => {
          const t = d.querySelector('.ant-modal-title');
          if (!t || !titleRe.test(t.innerText || '')) return false;
          if (!isModalVisible(d)) return false;
          // 表格已渲染出至少一行结构("t" 行或 antd 空态 placeholder 行)才算就绪，
          // 避免 loading 骨架期误判就绪导致漏抓第一页。
          if (!d.querySelector('.ant-table-tbody tr')) return false;
          return true;
        });
        if (hit) { clearInterval(timer); resolve(hit); return; }
        if (++attempts > 120) { clearInterval(timer); resolve(null); }
      }, 150);
    });

  for (const type of ['completed', 'incomplete']) {
    const tds = findRowCell(rowRegex[type]);
    if (!tds) {
      console.warn('[kesa-userdetail] M-Team 未找到 ' + type + ' 区块行');
      continue;
    }
    // 找到该行"察看"按钮(antd 按钮含 eye 图标 / title=察看/隱藏)
    const rowEl = tds[0].closest('tr') || tds[0].parentElement;
    const viewBtn = rowEl && Array.from(rowEl.querySelectorAll('.ant-btn')).find(
      (b) => /察看|隱藏/.test(b.getAttribute('title') || '') || b.querySelector('svg')
    );
    if (!viewBtn) {
      console.warn('[kesa-userdetail] M-Team ' + type + ' 行未找到"察看"按钮');
      continue;
    }
    console.log('[kesa-userdetail][mt] ' + type + ' 按钮 text=', (viewBtn.textContent || '').trim());
    // 关键: 该按钮 title 固定为"察看/隱藏"(tooltip, 开闭都一样), 不能用 title 判断;
    // 真实状态在 textContent:"察看"=未开(点击打开), "隱藏"=已开(直接使用, 别点否则会关闭)。
    const btnText = (viewBtn.textContent || '').trim();
    const alreadyOpen = /隱藏/.test(btnText);
    let modal = null;
    if (alreadyOpen) {
      // 已展开(显示"隱藏")：直接用当前 modal
      modal = await waitForModal(modalTitleRe[type]);
    } else {
      // 未展开(显示"察看")：点击打开后再等待就绪
      viewBtn.click();
      modal = await waitForModal(modalTitleRe[type]);
    }
    if (!modal) {
      console.warn('[kesa-userdetail] M-Team ' + type + ' 打开种子列表 modal 超时');
      if (!alreadyOpen) { viewBtn.click(); modal = await waitForModal(modalTitleRe[type]); }
      if (!modal) { console.warn('[kesa-userdetail] M-Team ' + type + ' 重试打开仍超时'); continue; }
    }
    // 在 modal 内部遍历分页收集 torrent_id
    let guard = 0;
    while (guard < 300) { // 最多约 20s/页
      // ① 种子名链接 a[href*="/detail/<id>"] (绝对地址)
      Array.from(modal.querySelectorAll('a[href*="/detail/"]')).forEach((a) => {
        const m = (a.getAttribute('href') || '').match(/\/detail\/(\d+)/);
        if (m) result[type].add(m[1]);
      });
      // ② 行 data-row-key="COMPLETED_<id>" / "INCOMPLETED_<id>" (更可靠的兜底)
      Array.from(modal.querySelectorAll('[data-row-key]')).forEach((el) => {
        const k = el.getAttribute('data-row-key') || '';
        if (k.indexOf(rowKeyPrefix[type]) === 0) result[type].add(k.slice(rowKeyPrefix[type].length));
      });
      // ③ 翻页：优先点 antd 的"下一页"按钮(.ant-pagination-next)。
      //    不要用"找 cur+1 页码项"——页数多时(如 17 页)中间页码被省略号折叠，
      //    cur+1 项不存在会导致提前 break、收集不全。next 按钮始终存在，
      //    且到最后一页时带 ant-pagination-disabled，正好作终止条件。
      const pag = modal.querySelector('.ant-pagination');
      const nextBtn = pag && pag.querySelector('.ant-pagination-next');
      const isLast = nextBtn && /ant-pagination-disabled/.test(nextBtn.className || '');
      if (nextBtn && !isLast) {
        nextBtn.click();
        // 较长间隔避免触发 M-Team "请求频繁"限流
        await __sleep(__MT_PAGE_INTERVAL);
        continue;
      }
      break;
    }
    // 关闭该 modal，避免影响另一类型的 modal(完成/未完成各一个)
    const closeBtn = modal.querySelector('.ant-modal-close');
    if (closeBtn) { closeBtn.click(); await __sleep(600); }
  }
  return result;
}

/**
 * 主流程：提取完成/未完成种子并写入已读，返回统计。
 */
async function __recordCompletedIncompleteRead() {
  // 三类页面各自校验用户标识
  const hasIdentity = __IS_MT ? !!__MT_PROFILE_ID : (!!__USERID || !!__USERUUID);
  if (!hasIdentity) {
    alert('未识别到用户详情页，请在用户详情页(userdetails.php 或 /profile/detail/N)使用');
    return;
  }
  const msg = '将提取"完成种子"与"未完成种子"的全部 torrent_id，合并写入瀑布流已读记录。\n\n' +
    '完成种子约可含上千条，未完成种子视情况，提取需遍历所有分页，请耐心等待。\n\n继续吗？';
  if (!confirm(msg)) return;

  const stat = { completed: 0, incomplete: 0, added: 0 };
  let btn = document.getElementById('kesaUdReadBtn');
  if (btn) btn.textContent = '提取中…';

  if (__IS_MT) {
    // M-Team profile 页：优先官方 API 收集，失败回退 DOM 点击遍历
    const map = await __collectMTeam();
    stat.completed = map.completed.size;
    stat.incomplete = map.incomplete.size;
    stat.added += __writeReadIds(Array.from(map.completed));
    stat.added += __writeReadIds(Array.from(map.incomplete));
  } else {
    // NexusPHP / mua：逐个分类提取
    for (const type of ['completed', 'incomplete']) {
      const ids = await __collectNexusTorrentIds(type);
      stat[type] = ids.size;
      stat.added += __writeReadIds(Array.from(ids));
    }
  }

  if (btn) btn.textContent = '记录完成/未完成种子为已读';
  alert(
    '完成种子 ' + stat.completed + ' 条，未完成种子 ' + stat.incomplete + ' 条，\n' +
    '合并后新增已读 ' + stat.added + ' 条。\n' +
    '在瀑布流列表页可看到这些种子已标记为已读。'
  );
}

/** 定位"完成种子"区块行第二格作为按钮挂载点(M-Team 用"完成種子") */
function __findCompletedCell() {
  const rowMap = __UD_SITE_ROW[__HOST];
  const completedRe = __IS_MT ? /完成種子/ : (rowMap && rowMap.completed) || /完成种子/;
  const rows = Array.from(document.querySelectorAll('tr'));
  for (const tr of rows) {
    if (tr.childElementCount !== 2) continue;
    const tds = Array.from(tr.children);
    if (completedRe.test(tds[0].innerText || '')) return tds[1];
  }
  return null;
}

/**
 * 在用户详情页注入"记录完成/未完成种子为已读"按钮。
 * 按钮注入到"完成种子"区块行第二格末尾，避免影响"一键认领"(PT_Seed_Claim)相关区域。
 */
function __injectReadButton() {
  if (!__isUserDetailsPage()) return;
  if (document.getElementById('kesaUdReadBtn')) return;

  const cell = __findCompletedCell();
  if (!cell) return;

  const wrap = document.createElement('div');
  wrap.style.cssText = 'margin:6px 0';
  wrap.innerHTML =
    '<a id="kesaUdReadBtn" href="javascript:void(0);" ' +
    'style="font-weight:bold;color:#c00;cursor:pointer" ' +
    'title="提取完成种子与未完成种子的全部 torrent_id，合并写入瀑布流已读记录">记录完成/未完成种子为已读</a>';
  const a = wrap.firstChild;
  a.addEventListener('click', __recordCompletedIncompleteRead);
  cell.appendChild(wrap);
}

/** 入口：document-start 后多次尝试注入(等待用户详情页区块渲染) */
function __initUserDetail() {
  if (!__isUserDetailsPage()) return;
  __injectReadButton();
  setTimeout(__injectReadButton, 1000);
  setTimeout(__injectReadButton, 3000);
  // M-Team 是 SPA，区块可能更晚渲染，增加 6s/10s 兜底
  if (__IS_MT) {
    setTimeout(__injectReadButton, 6000);
    setTimeout(__injectReadButton, 10000);
  }
}

export { __initUserDetail };
