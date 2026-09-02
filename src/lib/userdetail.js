// lib/userdetail.js — 用户详情页(userdetails.php)专用功能
// 在用户详情页注入"记录完成/未完成种子为已读"按钮，点击后提取
// 完成种子(completed) 与 未完成种子(incomplete) 的全部 torrent_id，
// 合并写入瀑布流已读记录 localStorage["Kesa:Masonry"]._read_ids.<host>。
// 仅在 userdetails.php 页面生效，不干扰种子列表页/种子详情页的瀑布流主逻辑。

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
};

const __USERID = (location.search.match(/[?&]id=(\d+)/) || [])[1] || '';
const __HOST = location.hostname;

/** 是否为用户详情页 */
function __isUserDetailsPage() {
  return /userdetails\.php/i.test(location.pathname);
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
 * 遍历某分类(completed/incomplete)全部分页，提取所有 torrent_id。
 * 接口: getusertorrentlistajax.php?page=N&userid=UID&type=TYPE，page 从 0 开始。
 */
async function __collectTorrentIds(type) {
  const ids = new Set();
  let page = 0;
  while (true) {
    const url = location.origin + '/getusertorrentlistajax.php?page=' + page + '&userid=' + __USERID + '&type=' + type;
    let html = '';
    try {
      const resp = await fetch(url);
      html = await resp.text();
    } catch (e) {
      console.error('[kesa-userdetail] 抓取 ' + type + ' 第 ' + page + ' 页失败', e);
      break;
    }
    const doc = new DOMParser().parseFromString(html, 'text/html');
    doc.querySelectorAll('a[href*="details.php?id="]').forEach((a) => {
      const m = (a.getAttribute('href') || '').match(/details\.php\?id=(\d+)/);
      if (m) ids.add(m[1]);
    });
    // 判断是否还有下一页：分页条中"下一页 >>"是带 href 的 <a> 即为有下一页
    const next = Array.from(doc.querySelectorAll('.nexus-pagination a'))
      .find((el) => /下一页/.test(el.textContent));
    if (!next) break;
    page++;
    await __sleep(__FETCH_INTERVAL);
  }
  return ids;
}

/**
 * 主流程：提取完成/未完成种子并写入已读，返回统计。
 */
async function __recordCompletedIncompleteRead() {
  if (!__USERID) {
    alert('未识别到用户 ID，请在用户详情页(userdetails.php?id=N)使用');
    return;
  }
  const msg = '将提取"完成种子"与"未完成种子"的全部 torrent_id，合并写入瀑布流已读记录。\n\n' +
    '完成种子约可含上千条，未完成种子视情况，提取需遍历所有分页，请耐心等待。\n\n继续吗？';
  if (!confirm(msg)) return;

  const stat = { completed: 0, incomplete: 0, added: 0 };
  let btn = document.getElementById('kesaUdReadBtn');
  if (btn) btn.textContent = '提取中…';

  // 逐个分类提取
  for (const type of ['completed', 'incomplete']) {
    const ids = await __collectTorrentIds(type);
    stat[type] = ids.size;
    stat.added += __writeReadIds(Array.from(ids));
  }

  if (btn) btn.textContent = '记录完成/未完成种子为已读';
  alert(
    '完成种子 ' + stat.completed + ' 条，未完成种子 ' + stat.incomplete + ' 条，\n' +
    '合并后新增已读 ' + stat.added + ' 条。\n' +
    '在瀑布流列表页可看到这些种子已标记为已读。'
  );
}

/**
 * 在用户详情页注入"记录完成/未完成种子为已读"按钮。
 * 按钮注入到"完成种子"区块行第二格末尾，避免影响"一键认领"(PT_Seed_Claim)相关区域。
 */
function __injectReadButton() {
  if (!__isUserDetailsPage() || !__USERID) return;
  if (document.getElementById('kesaUdReadBtn')) return;

  // 定位"完成种子"行第二格作为挂载点
  const row = Array.from(document.querySelectorAll('tr')).find(
    (tr) => tr.childElementCount === 2 &&
      __UD_SITE_ROW[__HOST] && __UD_SITE_ROW[__HOST].completed.test(tr.cells[0].innerText)
  );
  const cell = row && row.cells[1];
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
}

export { __initUserDetail };
