// @ts-nocheck — ported 1:1 from the original site script; type it file by file.
import { $, $$, N, RM, clamp, esc, rnd, t } from '../core/util';
import { requestAnimationFrame, ResizeObserver } from '../scope';

// Phase 1 (before the yield) shares this feature's functions on the shared site context;
// phase 2 runs its setup code, in the same order as the original single script.
export default function* chart(site: any) {
  Object.assign(site, { drawLine });
  yield;
  /* ================= CHART (Vercel analytics) ================= */
  const LC = {
    isp: [],
    zl: [],
    j: []
  };
  try { for (let i = 0; i <= 60; i++) {
    let v = 96 + Math.sin(i / 5) * 10 + (rnd() - .5) * 30;
    if (i % 17 === 9) v += 48;
    if (i % 23 === 14) v += 30;
    LC.isp.push(Math.round(clamp(v, 62, 170)));
    LC.zl.push(Math.round(42 + (rnd() - .5) * 5));
    LC.j.push(+(1.2 + Math.abs(Math.sin(i / 3)) * .9 + rnd() * .6).toFixed(1))
  } } catch (e) { site.report(e, 'chart') }
  const mean = a => a.reduce((s, v) => s + v, 0) / a.length;
  try { site.LCd = Math.round(mean(LC.isp) - mean(LC.zl)); } catch (e) { site.report(e, 'chart') }
  let lineDrawn = false;
  let lineSvg;
  try { lineSvg = $('#lineSvg'); } catch (e) { site.report(e, 'chart') }

  function drawLine() {
    const W = lineSvg.clientWidth,
      Hh = lineSvg.clientHeight;
    if (!W || !Hh) return;
    lineSvg.setAttribute('viewBox', '0 0 ' + W + ' ' + Hh);
    const ml = W < 520 ? 30 : 44,
      mr = W < 520 ? 8 : 150,
      mt = 16,
      mb = 28;
    const iw = W - ml - mr,
      ih = Hh - mt - mb;
    const ymax = 180;
    const x = i => ml + i / 60 * iw,
      y = v => mt + ih - v / ymax * ih;
    const jy = v => mt + ih - (v * 8) / ymax * ih;
    let s = '<defs><linearGradient id="fadeL" x1="0" x2="1"><stop offset="0" stop-color="#0a0a0a" stop-opacity="1"/><stop offset=".12" stop-color="#0a0a0a" stop-opacity="0"/></linearGradient></defs>';
    [0, 50, 100, 150].forEach(v => {
      s += '<line x1="' + ml + '" x2="' + (ml + iw) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="rgba(255,255,255,' + (v ? '.06' : '.12') + ')"/><text x="' + (ml - 10) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + v + '</text>'
    });
    (W < 520 ? [0, 30, 60] : [0, 15, 30, 45, 60]).forEach(v => {
      s += '<text x="' + x(v) + '" y="' + (Hh - 6) + '" text-anchor="middle">' + v + 's</text>'
    });
    const path = (a, fy) => a.map((v, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + fy(v).toFixed(1)).join('');
    s += '<path class="ln" d="' + path(LC.isp, y) + '" fill="none" stroke="#555" stroke-width="1.5" stroke-linejoin="round" pathLength="1000"/>';
    s += '<path class="ln" d="' + path(LC.j, jy) + '" fill="none" stroke="#0fa695" stroke-width="1.5" stroke-linejoin="round" pathLength="1000"/>';
    s += '<path class="ln" d="' + path(LC.zl, y) + '" fill="none" stroke="#3291ff" stroke-width="2" stroke-linejoin="round" pathLength="1000"/>';
    s += '<rect x="' + ml + '" y="0" width="' + (iw * .3) + '" height="' + Hh + '" fill="url(#fadeL)" pointer-events="none"/>';
    s += '<circle cx="' + x(60) + '" cy="' + y(LC.zl[60]) + '" r="4" fill="#3291ff" stroke="#0a0a0a" stroke-width="2"/><circle cx="' + x(60) + '" cy="' + jy(LC.j[60]) + '" r="4" fill="#0fa695" stroke="#0a0a0a" stroke-width="2"/>';
    s += '<g id="cross" style="display:none"><line id="cx" y1="' + mt + '" y2="' + (mt + ih) + '" stroke="rgba(255,255,255,.25)"/><circle id="ci" r="3.5" fill="#777" stroke="#0a0a0a" stroke-width="2"/><circle id="cz" r="4.5" fill="#3291ff" stroke="#0a0a0a" stroke-width="2"/></g>';
    lineSvg.innerHTML = s;
    lineSvg._g = {
      x,
      y,
      jy,
      ml,
      iw
    };
    const fig = $('#lineFig');
    $$('.chip2,.end-pill', fig).forEach(e => e.remove());
    const imax = LC.isp.indexOf(Math.max(...LC.isp));
    const chips = [
      [x(imax), y(LC.isp[imax]) - 22, 'MAX', LC.isp[imax] + ' ms'],
      [x(8), y(LC.isp[8]) - 30, 'WHERE', "isp='direct'"],
      [x(24), y(LC.zl[24]) + 26, 'AVG', Math.round(mean(LC.zl)) + ' ms'],
      [x(40), jy(LC.j[40]) - 22, 'GROUP BY', 'route']
    ];
    if (W >= 640) chips.forEach(c => {
      const el = document.createElement('span');
      el.className = 'chip2';
      el.style.left = c[0] + 'px';
      el.style.top = c[1] + 'px';
      el.innerHTML = '<span>' + c[2] + '</span><span>' + esc(c[3]) + '</span>';
      fig.appendChild(el)
    });
    if (W >= 640) {
      const p = document.createElement('div');
      p.className = 'end-pill';
      p.style.top = (y(LC.zl[60]) - 58) + 'px';
      p.innerHTML = '<span>' + esc(t('lgZ')) + '</span><b>' + N(LC.zl[60]) + ' ms</b><span class="pct blue">−' + N(Math.round((1 - LC.zl[60] / LC.isp[60]) * 100)) + '%</span>';
      fig.appendChild(p);
      const q = document.createElement('div');
      q.className = 'end-pill';
      q.style.top = (jy(LC.j[60]) - 20) + 'px';
      q.innerHTML = '<span>' + esc(t('lgJ')) + '</span><b>' + N(LC.j[60]) + ' ms</b><span class="pct teal">' + N('±0.4') + '</span>';
      fig.appendChild(q)
    }
    if (!lineDrawn && !RM) $$('.ln', lineSvg).forEach(p => {
      p.style.strokeDasharray = '1000';
      p.style.strokeDashoffset = '1000'
    })
  }
  try { new ResizeObserver(drawLine).observe($('#lineFig')); } catch (e) { site.report(e, 'chart') }
  try { site.onView($('#lineFig'), v => {
    if (!v || lineDrawn) return;
    lineDrawn = true;
    $$('.ln', lineSvg).forEach((p, i) => {
      p.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(.2,.7,.1,1) ' + (i * .2) + 's';
      requestAnimationFrame(() => p.style.strokeDashoffset = '0')
    })
  }); } catch (e) { site.report(e, 'chart') }

  function lineHover(e) {
    const g = lineSvg._g;
    if (!g) return;
    const r = lineSvg.getBoundingClientRect();
    const i = clamp(Math.round((e.clientX - r.left - g.ml) / g.iw * 60), 0, 60);
    const cx = g.x(i);
    $('#cross').style.display = '';
    $('#cx').setAttribute('x1', cx);
    $('#cx').setAttribute('x2', cx);
    $('#ci').setAttribute('cx', cx);
    $('#ci').setAttribute('cy', g.y(LC.isp[i]));
    $('#cz').setAttribute('cx', cx);
    $('#cz').setAttribute('cy', g.y(LC.zl[i]));
    const tip = $('#lineTip');
    tip.hidden = false;
    tip.innerHTML = '<div class="t"><i class="dot blue"></i>' + esc(t('tipH')) + ' · ' + N(i) + t('sec') + '</div><div class="r"><span>' + esc(t('lgZ')) + '</span><b>' + N(LC.zl[i]) + ' ms</b></div><div class="r"><span>' + esc(t('lgI')) + '</span><b>' + N(LC.isp[i]) + ' ms</b></div><div class="r"><span>' + esc(t('lgJ')) + '</span><b>' + N(LC.j[i]) + ' ms</b></div><div class="r"><span>' + esc(t('saved')) + '</span><b style="color:var(--blue2)">−' + N(LC.isp[i] - LC.zl[i]) + ' ms</b></div>';
    const tw = tip.offsetWidth;
    tip.style.left = clamp(cx + (cx > r.width / 2 ? -tw - 16 : 16), 0, r.width - tw) + 'px';
    tip.style.top = '8px'
  }
  try { $('#lineFig').addEventListener('pointermove', lineHover); } catch (e) { site.report(e, 'chart') }
  try { $('#lineFig').addEventListener('pointerdown', lineHover); } catch (e) { site.report(e, 'chart') }
  try { $('#lineFig').addEventListener('pointerleave', () => {
    $('#lineTip').hidden = true;
    const c = $('#cross');
    if (c) c.style.display = 'none'
  }); } catch (e) { site.report(e, 'chart') }
}
