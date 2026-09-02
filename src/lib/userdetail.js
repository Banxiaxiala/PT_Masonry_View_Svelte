// lib/userdetail.js — 用户详情页专用功能
// 在用户详情页注入"记录完成/未完成种子为已读"按钮，点击后提取
// 完成种子(completed) 与 未完成种子(incomplete) 的全部 torrent_id，
// 合并写入瀑布流已读记录 localStorage["Kesa:Masonry"]._read_ids.<host>。
// 支持三类用户详情页：
//   ① NexusPHP(userdetails.php?id=N): kamept/pttime/nicept/ptfans
//      接口 getusertorrentlistajax.php?page=N&userid=UID&type=TYPE (page 从 0)
//   ② mua.xloli.cc(userdetails.php?uuid=...): 同为 NexusPHP 结构但**参数名是 `useruuid`**(实测确认)
//      接口 getusertorrentlistajax.php?useruuid=UUID&type=TYPE&page=N (**page 从 0**, 跟其他 NexusPHP 一致)
//   ③ M-Team(kp.m-team.cc/profile/detail/N): mTorrent/antd SPA
//      点击"察看"按钮展开, POST api.m-team.io/api/member/getUserTorrentList,
//      antd 分页翻页收集 /detail/<id> 的 torrent_id
// 仅在这些页面生效，不干扰种子列表页/种子详情页的瀑布流主逻辑。

const __READ_NS = 'Kesa:Masonry';     // 与 sync.js 的 __STORE_NS 保持一致
const __READ_KEY = '_read_ids';        // 已读 id 数组子键(不带 host 后缀，见 __readKey)
const __PAGE_SIZE = 100;               // KamePT 用户详情分类每页条数
const __FETCH_INTERVAL = 300;          // 抓取分页间隔(ms)

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
 * ① 遍历 NexusPHP/mua 某分类(completed/incomplete)全部分页，提取所有 torrent_id。
 * mua 参数为 useruuid、page 从 1 起；其余 NexusPHP 为 userid、page 从 0 起。
 */
async function __collectNexusTorrentIds(type) {
  const ids = new Set();
  const isMua = /mua\.xloli\.cc/i.test(__HOST);
  const uidParam = isMua ? ('useruuid=' + encodeURIComponent(__USERUUID)) : ('userid=' + __USERID);
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
 * 遍历 antd 分页收集 /detail/<id> 的 torrent_id。
 * 返回 { completed, incomplete } 两组的 id Set。
 */
async function __collectMTeamTorrentIds() {
  const result = { completed: new Set(), incomplete: new Set() };
  const rowRegex = { completed: /完成種子/, incomplete: /未完成種子/ };

  // 找到"完成種子/未完成種子"区块行(表格行，第一格标题含关键词)
  const findRowCell = (re) => {
    const rows = Array.from(document.querySelectorAll('tr'));
    for (const tr of rows) {
      const tds = Array.from(tr.children);
      if (tds.length >= 2 && re.test(tds[0].innerText || '')) return tds;
    }
    return null;
  };

  for (const type of ['completed', 'incomplete']) {
    const tds = findRowCell(rowRegex[type]);
    if (!tds) {
      console.warn('[kesa-userdetail] M-Team 未找到 ' + type + ' 区块行');
      continue;
    }
    // 点击该行"察看"按钮展开(antd 按钮含 eye 图标 / title=察看/隱藏)
    const rowEl = tds[0].closest('tr') || tds[0].parentElement;
    const viewBtn = rowEl && Array.from(rowEl.querySelectorAll('.ant-btn')).find(
      (b) => /察看|隱藏/.test(b.getAttribute('title') || '') || b.querySelector('svg')
    );
    if (!viewBtn) {
      console.warn('[kesa-userdetail] M-Team ' + type + ' 行未找到"察看"按钮');
      continue;
    }
    const viewParent = viewBtn.closest('tr') || rowEl;
    viewBtn.click();
    // 等待列表展开(网络请求+渲染)
    await __sleep(800);
    let guard = 0;
    while (guard < 200) { // 最多约 20s
      const pageEls = Array.from(document.querySelectorAll('.ant-pagination-item'));
      if (pageEls.length > 0) {
        // 收集当前页种子链接 /detail/<id>
        const links = Array.from(viewParent.parentElement.querySelectorAll('a[href*="/detail/"]'));
        links.forEach((a) => {
          const m = (a.getAttribute('href') || '').match(/\/detail\/(\d+)/);
          if (m) result[type].add(m[1]);
        });
        // 若已有"下一页"(页码按钮存在且当前页非末页)，点击翻页继续
        const active = Array.from(document.querySelectorAll('.ant-pagination-item-active'))[0];
        const cur = active ? parseInt(active.innerText, 10) : 1;
        const nextBtn = Array.from(document.querySelectorAll('.ant-pagination-item'))
          .map((el) => parseInt(el.innerText, 10))
          .filter((n) => !isNaN(n))
          .find((n) => n === cur + 1);
        if (nextBtn) {
          const target = Array.from(document.querySelectorAll('.ant-pagination-item'))
            .find((el) => parseInt(el.innerText, 10) === nextBtn);
          target.click();
          await __sleep(__FETCH_INTERVAL);
          continue;
        }
        break;
      }
      await __sleep(100);
      guard++;
    }
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
    // M-Team profile 页：一次遍历两组
    const map = await __collectMTeamTorrentIds();
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
