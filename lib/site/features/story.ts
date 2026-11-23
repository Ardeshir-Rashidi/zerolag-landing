// @ts-nocheck — ported 1:1 from the original site script; type it file by file.
import { BASE_PATH } from '@/lib/paths';
import { $, $$, N, RM, clamp, esc, isFa, t } from '../core/util';
import { icon, logo, logoDark } from '../core/icons';
import { C, HOME, RELAYS, city, cname, code, coname, game, sig } from '../core/data';
import { setInterval, requestAnimationFrame, ResizeObserver } from '../scope';

// Phase 1 (before the yield) shares this feature's functions on the shared site context;
// phase 2 runs its setup code, in the same order as the original single script.
export default function* story(site: any) {
  Object.assign(site, { setStep, renderDb, renderTree, renderTrace });
  yield;
  /* ================= DESKTOP STORY ================= */
  let stepT0, stepPause, storyVis, stepProg;
  try { site.step = 0; stepT0 = performance.now(); stepPause = false; storyVis = false; stepProg = 0; } catch (e) { site.report(e, 'story') }
  const STEP_MS = 7000;

  function setStep(i) {
    site.step = i;
    stepT0 = performance.now();
    stepProg = 0;
    $$('#steps li').forEach((li, k) => {
      li.classList.toggle('on', k === i);
      li.classList.toggle('done', k < i);
      li.style.setProperty('--p', '0')
    });
    $$('#panes .pane').forEach((p, k) => {
      p.classList.toggle('on', k === i);
      p.setAttribute('aria-hidden', String(k !== i))
    });
    if (i === 0) buildDb();
    if (i === 1) requestAnimationFrame(drawTree);
    if (i === 2) runTrace()
  }
  try { $('#steps').addEventListener('click', e => {
    const b = e.target.closest('button');
    if (b) setStep(+b.dataset.step)
  }); } catch (e) { site.report(e, 'story') }
  try { $('#panes').addEventListener('pointerenter', () => stepPause = true); } catch (e) { site.report(e, 'story') }
  try { $('#panes').addEventListener('pointerleave', () => {
    stepPause = false;
    stepT0 = performance.now() - stepProg * STEP_MS
  }); } catch (e) { site.report(e, 'story') }
  /* every time the section comes into view the story starts again from step 1 */
  try { site.onView($('#desktop'), v => {
    const was = storyVis;
    storyVis = v;
    if (v && !was) {
      stepPause = false;
      setStep(0)
    }
  }, '-18% 0px -18% 0px'); } catch (e) { site.report(e, 'story') }
  try { site.live.add(() => {
    if (!storyVis || stepPause || RM) return;
    const k = (performance.now() - stepT0) / STEP_MS;
    stepProg = k;
    const li = $('#steps li.on');
    if (li) li.style.setProperty('--p', clamp(k, 0, 1).toFixed(3));
    if (k >= 1) setStep((site.step + 1) % 3)
  }); } catch (e) { site.report(e, 'story') }
  /* pane 1 · the ZeroLag dashboard, assembled piece by piece */
  const DBL = ['QA', 'AE', 'DE', 'TR', 'SA'];
  let dbI = 0,
    dbT = 0;
  let DBW = 300,
    DBH = 190;
  const dbXY = (lon, lat) => [22 + (lon - 2) / 66 * (DBW - 44), 26 + (58 - lat) / 38 * (DBH - 52)];

  function renderDb() {
    const rows = DBL.map((cc, i) => {
      const b = site.bestOf(site.srvOf(cc));
      return '<div class="db-row" data-i="' + i + '" style="--k:' + (i + 4) + '">' + code(cc) + '<span class="grow"><b>' + esc(coname(b)) + '</b><small>' + esc(cname(b)) + '</small></span>' + sig(b.p) + '</div>'
    }).join('');
    $('#db').innerHTML = '<div class="db-side" style="--k:0"><span class="logo sm">' + logo() + '</span>' + ['home', 'globe', 'gamepad', 'chart'].map((n, i) => '<i class="db-ni' + (i === 1 ? ' on' : '') + '">' + icon(n) + '</i>').join('') + '</div>' +
      '<div class="db-main"><div class="db-top" style="--k:1"><span class="crumb"><b>ZeroLag</b><span>/</span><span>' + esc(t('phLocs')) + '</span></span><span class="db-av">AR</span></div><div class="db-body">' +
      '<div class="db-col"><div class="sxd db-search" style="--k:2" data-tag="' + esc('<Search>') + '">' + icon('search') + '<span>' + esc(t('wSearch2', {
        n: C.length
      })) + '</span></div>' +
      '<div class="sxd db-list" style="--k:3" data-tag="' + esc('<Recommended>') + '"><p class="db-h">' + esc(t('wRec')) + '</p>' + rows + '</div></div>' +
      '<div class="db-col"><div class="sxd db-map" style="--k:9" data-tag="' + esc('<RouteMap>') + '"><svg aria-hidden="true"><g class="dots" id="dbDots"></g><path class="rt" id="dbPath" pathLength="1"/><g id="dbPts"></g></svg></div>' +
      '<div class="sxd db-conn" style="--k:10" data-tag="' + esc('<Connect>') + '"><span class="db-pw">' + icon('power') + '</span><span class="grow"><small>' + esc(t('dbTo')) + '</small><b id="dbTo"></b></span><span class="db-ms" id="dbMs"></span></div></div></div></div>';
    dbPick(dbI)
  }

  function dbPick(i) {
    dbI = i;
    const box = $('#db');
    if (!box || !$('#dbPath')) return;
    const sv = $('.db-map svg', box);
    const w = Math.round(sv.clientWidth) || 300,
      h = Math.round(sv.clientHeight) || 190;
    if (w !== DBW || h !== DBH || !$('#dbDots').childElementCount) {
      DBW = w;
      DBH = h;
      sv.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      let d = '';
      for (let x = 8; x < w; x += 14)
        for (let y = 8; y < h; y += 14) d += '<circle cx="' + x + '" cy="' + y + '" r=".9"/>';
      $('#dbDots').innerHTML = d
    }
    $$('.db-row', box).forEach(r => r.classList.toggle('on', +r.dataset.i === i));
    const b = site.bestOf(site.srvOf(DBL[i]));
    const [hx, hy] = dbXY(HOME.lon, HOME.lat), [tx, ty] = dbXY(b.lon, b.lat);
    const mx = (hx + tx) / 2,
      my = Math.min(hy, ty) - Math.max(30, Math.abs(hx - tx) * .25);
    const p = $('#dbPath');
    p.setAttribute('d', 'M' + hx.toFixed(1) + ' ' + hy.toFixed(1) + 'Q' + mx.toFixed(1) + ' ' + my.toFixed(1) + ' ' + tx.toFixed(1) + ' ' + ty.toFixed(1));
    p.classList.remove('draw');
    void p.getBBox();
    p.classList.add('draw');
    const others = DBL.map(cc => site.bestOf(site.srvOf(cc))).filter(x => x !== b).map(x => {
      const [x1, y1] = dbXY(x.lon, x.lat);
      return '<circle class="o" cx="' + x1.toFixed(1) + '" cy="' + y1.toFixed(1) + '" r="2.4"/>'
    }).join('');
    const lab = (x, y, txt, cls, up) => {
      const w = txt.length * 6.2 + 16;
      const lx = clamp(x - w / 2, 4, DBW - 4 - w);
      const ly = up ? y - 30 : y + 12;
      return '<g class="lb ' + cls + '"><rect x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" width="' + w.toFixed(1) + '" height="19" rx="5"/><text x="' + (lx + w / 2).toFixed(1) + '" y="' + (ly + 13).toFixed(1) + '" text-anchor="middle">' + esc(txt) + '</text></g>'
    };
    $('#dbPts').innerHTML = others + '<circle class="h" cx="' + hx.toFixed(1) + '" cy="' + hy.toFixed(1) + '" r="4"/><circle class="t" cx="' + tx.toFixed(1) + '" cy="' + ty.toFixed(1) + '" r="4"/>' + lab(hx, hy, 'Tehran', '', ty > hy) + lab(tx, ty, cname(b) + ' · ' + N(b.p) + ' ms', 'hot', ty <= hy);
    $('#dbTo').textContent = cname(b) + (', ') + coname(b);
    $('#dbMs').textContent = N(b.p) + ' ms'
  }

  function buildDb() {
    const d = $('#db');
    if (!d) return;
    d.classList.remove('build');
    void d.offsetWidth;
    d.classList.add('build');
    dbPick(0);
    clearInterval(dbT);
    dbT = setInterval(() => {
      if (site.step !== 0 || !storyVis || document.hidden) return;
      dbPick((dbI + 1) % DBL.length)
    }, 2000)
  }
  /* pane 2 · route tree (vercel.com teams → projects → domains style) */
  const TREE = [
    ['val', 'ist'],
    ['cs2', 'fra'],
    ['fn', 'dxb']
  ];

  function renderTree() {
    const Z = window.ZeroLagMap;
    const used = new Set();
    const rows = TREE.map(([id, cid]) => {
      const g = game(id),
        c = city(cid);
      let via = t('backbone'),
        ms = c.p;
      if (Z && Z.routesFor) {
        const rs = Z.routesFor({
          lon: HOME.lon,
          lat: HOME.lat
        }, {
          lon: c.lon,
          lat: c.lat
        }, RELAYS);
        const r = rs.find(x => !used.has(x.via ? x.via.id : 'bb')) || rs[0];
        used.add(r.via ? r.via.id : 'bb');
        via = r.via ? (isFa() ? r.via.name.fa : r.via.name.en) : t('backbone');
        ms = Z.msr(r.total)
      }
      return {
        g,
        c,
        via,
        ms
      }
    });
    $('#tree').innerHTML = '<div class="tr-c c0"><small>ZeroLag</small><span class="tr-tile">' + logoDark() + '</span></div>' +
      '<div class="tr-c c1"><small>' + esc(t('trYou')) + '</small><div class="tr-node" data-n="isp">' + code('IR') + '<div><b>' + esc(t('trTehran')) + '</b><small>' + esc(t('trIsp')) + '</small></div></div></div>' +
      '<span class="tr-pill">' + esc(t('smart')) + '</span>' +
      '<div class="tr-c c2"><small>' + esc(t('trRoutes')) + '</small>' + rows.map((r, i) => '<div class="tr-box' + (i === 0 ? ' win' : '') + '" data-n="b' + i + '"><div class="tr-bh"><b>' + esc(r.via) + '</b> · ' + N(r.ms) + ' ms</div><div class="tr-bi"><span class="tr-ic">' + icon('server') + '</span><div><small>' + esc(t('trServer')) + '</small><b>' + esc(cname(r.c)) + ' · ' + r.g.id + '-' + r.c.id + '</b></div></div></div>').join('') + '</div>' +
      '<div class="tr-c c3"><small>' + esc(t('nGames')) + '</small>' + rows.map((r, i) => '<span class="tr-dom' + (i === 0 ? ' win' : '') + '" data-n="d' + i + '"><img src="' + BASE_PATH + '/img/g/' + r.g.id + '.webp" alt="">' + esc(r.g.n) + '</span>').join('') + '</div><svg class="tr-svg" aria-hidden="true"></svg>';
    drawTree()
  }
  let treeWin = 0;

  function drawTree() {
    const box = $('#tree');
    if (!box || !box.offsetParent) return;
    const R = box.getBoundingClientRect();
    const c3 = $('.c3', box),
      c2 = $('.c2', box);
    if (c3 && c2) {
      c3.style.height = c2.offsetHeight + 'px';
      const c3r = c3.getBoundingClientRect();
      $$('.tr-dom', box).forEach((el, i) => {
        const bb = $('[data-n=b' + i + ']', box).getBoundingClientRect();
        el.style.top = (bb.top + bb.height / 2 - c3r.top - el.offsetHeight / 2) + 'px'
      })
    }
    const rr = el => {
      const r = el.getBoundingClientRect();
      return {
        l: r.left - R.left,
        r: r.right - R.left,
        t: r.top - R.top,
        b: r.bottom - R.top,
        cy: (r.top + r.bottom) / 2 - R.top,
        cx: (r.left + r.right) / 2 - R.left
      }
    };
    const tile = rr($('.tr-tile', box)),
      isp = rr($('[data-n=isp]', box)),
      pill = rr($('.tr-pill', box));
    const bx = [0, 1, 2].map(i => rr($('[data-n=b' + i + ']', box))),
      dm = [0, 1, 2].map(i => rr($('[data-n=d' + i + ']', box)));
    const tx = (pill.r + bx[0].l) / 2,
      rad = 10;
    let d = '',
      hot = '';
    d += 'M' + tile.r + ' ' + tile.cy + 'H' + isp.l;
    d += 'M' + isp.r + ' ' + isp.cy + 'H' + pill.l + 'M' + pill.r + ' ' + pill.cy + 'H' + tx;
    bx.forEach((b, i) => {
      const dy = b.cy - pill.cy;
      const sgn = Math.sign(dy);
      const path = Math.abs(dy) < 1 ? 'M' + tx + ' ' + pill.cy + 'H' + b.l : 'M' + tx + ' ' + pill.cy + 'V' + (b.cy - sgn * rad) + 'Q' + tx + ' ' + b.cy + ' ' + (tx + rad) + ' ' + b.cy + 'H' + b.l;
      const p2 = 'M' + b.r + ' ' + b.cy + 'H' + dm[i].l;
      if (i === treeWin) hot = path + p2;
      else d += path + p2
    });
    const full = 'M' + tile.r + ' ' + tile.cy + 'H' + isp.l + 'M' + isp.r + ' ' + isp.cy + 'H' + pill.l + 'M' + pill.r + ' ' + pill.cy + 'H' + tx;
    const b = bx[treeWin],
      dy = b.cy - pill.cy,
      sgn = Math.sign(dy) || 1;
    const mpath = 'M' + tile.r + ' ' + tile.cy + 'H' + isp.l + 'M' + isp.r + ' ' + isp.cy + 'H' + pill.l;
    const route = 'M' + isp.r + ' ' + isp.cy + 'H' + tx + (Math.abs(dy) < 1 ? '' : 'V' + (b.cy - sgn * rad) + 'Q' + tx + ' ' + b.cy + ' ' + (tx + rad) + ' ' + b.cy) + 'H' + b.l;
    const svg = $('.tr-svg', box);
    svg.setAttribute('viewBox', '0 0 ' + R.width + ' ' + R.height);
    svg.innerHTML = '<path d="' + d + '" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="1"/><path d="' + full + hot + '" fill="none" stroke="#3291ff" stroke-width="1.2"/>' + (RM ? '' : '<circle r="3" fill="#fff"><animateMotion dur="2.2s" repeatCount="indefinite" path="' + route + '"/></circle>')
  }
  try { new ResizeObserver(() => {
    if (site.step === 1) drawTree()
  }).observe($('#panes')); } catch (e) { site.report(e, 'story') }
  /* pane 3 · live trace (vercel.com/workflows style) */
  const SPANS = [
    ['session', 0, 64, 'blue'],
    ['dns.resolve', 0, 3],
    ['route.race', 3, 21, 'green'],
    ['edge.connect', 21, 30],
    ['game.server', 30, 52],
    ['stream', 52, 64, 'live']
  ];

  function renderTrace() {
    const ax = [0, 15, 30, 45, 60];
    $('#trace').innerHTML = '<div class="tc-h"><span class="tc-ic">' + icon('route') + '</span><b>match-session</b><span class="mono dim">zl_01KC7XRJ</span><span class="tc-live"><i class="dot blue"></i>' + esc(t('tcLive')) + '</span></div>' +
      '<div class="tc-meta"><div><small>' + esc(t('tcStart')) + '</small><b>' + esc(t('tc2m')) + '</b></div><div><small>' + esc(t('tcRoute')) + '</small><b>' + esc('Yerevan edge') + '</b></div><div><small>' + esc(t('sPing')) + '</small><b>' + N(22) + ' ms</b></div></div>' +
      '<div class="tc-g" dir="ltr"><div class="tc-n"><div class="tc-s">' + icon('search') + '<span>' + esc(t('tcSearch')) + '</span></div>' + SPANS.map((s, i) => '<div class="tc-r"><span class="ico">' + (i ? '&lt;&gt;' : icon('route')) + '</span><span class="mono">' + s[0] + '</span><span class="mono dim">' + (s[3] === 'live' ? 'live' : (s[2] - s[1]) + 'ms') + '</span></div>').join('') + '</div>' +
      '<div class="tc-t"><div class="tc-ax">' + ax.map(v => '<span style="left:' + (v / 64 * 100) + '%">' + v + 'ms</span>').join('') + '</div>' + SPANS.map((s, i) => '<div class="tc-r"><i class="tc-b ' + (s[3] || '') + '" style="--l:' + (s[1] / 64 * 100) + '%;--w:' + ((s[2] - s[1]) / 64 * 100) + '%;--d:' + (i * .22) + 's">' + (s[3] === 'blue' || s[3] === 'green' ? (s[2] - s[1]) + 'ms' : '') + '</i></div>').join('') + '</div></div>'
  }

  function runTrace() {
    const t0 = $('#trace .tc-g');
    if (!t0) return;
    t0.classList.remove('go');
    void t0.offsetWidth;
    t0.classList.add('go')
  }
}
