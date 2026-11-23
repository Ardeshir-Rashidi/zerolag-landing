// @ts-nocheck — ported 1:1 from the original site script; type it file by file.
import { $, esc, t } from '../core/util';
import { ResizeObserver } from '../scope';

// Phase 1 (before the yield) shares this feature's functions on the shared site context;
// phase 2 runs its setup code, in the same order as the original single script.
export default function* about(site: any) {
  Object.assign(site, { drawFlow, renderFigs });
  yield;
  /* ================= ABOUT ================= */
  function drawFlow() {
    const f = $('#flow');
    const W = f.clientWidth,
      Hh = f.clientHeight;
    if (!W) return;
    const svg = $('svg', f);
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + Hh);
    const l = $('.fbox.l', f),
      c = $('.fbox.c', f),
      r = $('.fbox.r', f);
    const y = Hh / 2;
    const x1 = l.offsetLeft + l.offsetWidth,
      x2 = c.offsetLeft - c.offsetWidth / 2,
      x3 = c.offsetLeft + c.offsetWidth / 2,
      x4 = r.offsetLeft;
    svg.innerHTML = '<path d="M0 ' + (y - 56) + 'H' + W + 'M0 ' + (y + 56) + 'H' + W + '" stroke="rgba(255,255,255,.06)"/><path d="M' + (W / 2) + ' 0V' + Hh + '" stroke="rgba(255,255,255,.06)" stroke-dasharray="3 4"/><path id="fl1" d="M' + x1 + ' ' + y + 'H' + x2 + '" stroke="rgba(255,255,255,.3)"/><path id="fl2" d="M' + x3 + ' ' + y + 'H' + x4 + '" stroke="rgba(255,255,255,.3)"/><circle r="3.5" fill="#fff"><animateMotion dur="1.6s" repeatCount="indefinite" path="M' + x1 + ' ' + y + 'H' + x2 + '"/></circle><circle r="3.5" fill="#3291ff"><animateMotion dur="1.6s" begin=".8s" repeatCount="indefinite" path="M' + x3 + ' ' + y + 'H' + x4 + '"/></circle>'
  }
  try { new ResizeObserver(drawFlow).observe($('#flow')); } catch (e) { site.report(e, 'about') }
  /* isometric line figures (Linear's FIG 0.x style) */
  function isoFig(kind) {
    const P = (x, y, z) => [150 + (x - y) * .866, 150 + (x + y) * .5 - z];
    const pt = a => a.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
    const box = (x, y, z, w, d, h, cls) => {
      const t = [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)],
        r = [P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)],
        f = [P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)];
      return '<g class="' + (cls || '') + '"><polygon points="' + pt(r) + '"/><polygon points="' + pt(f) + '"/><polygon points="' + pt(t) + '"/></g>'
    };
    let s = '<svg viewBox="0 0 300 260" fill="#0a0a0a" stroke="rgba(255,255,255,.62)" stroke-width="1" stroke-linejoin="round" aria-hidden="true">';
    if (kind === 0) {
      for (let i = 0; i < 5; i++) s += '<g class="iso" style="--k:' + i + '">' + box(-62, -62, i * 20, 124, 124, 9) + '</g>';
      const zt = 4 * 20 + 9;
      let el = '';
      const rx = 34 * 1.2247,
        ry = 34 * .707;
      const c = P(0, 0, zt);
      el += '<ellipse cx="' + c[0] + '" cy="' + c[1] + '" rx="' + rx.toFixed(1) + '" ry="' + ry.toFixed(1) + '" fill="#0a0a0a"/>';
      for (let k = -3; k <= 3; k++) {
        const yy = c[1] + k * ry / 4;
        const hw = rx * Math.sqrt(Math.max(0, 1 - Math.pow((yy - c[1]) / ry, 2)));
        if (hw > 2) el += '<line x1="' + (c[0] - hw).toFixed(1) + '" y1="' + yy.toFixed(1) + '" x2="' + (c[0] + hw).toFixed(1) + '" y2="' + yy.toFixed(1) + '" stroke="rgba(255,255,255,.4)"/>'
      }
      s += '<g class="iso" style="--k:4">' + el + '</g>'
    } else if (kind === 1) {
      [
        [-70, -20, 0],
        [-20, -75, 26],
        [30, -30, 0],
        [-25, 25, -4],
        [25, 30, 40]
      ].sort((a, b) => (a[0] + a[1]) - (b[0] + b[1])).forEach((c, i) => {
        s += '<g class="iso bob" style="--k:' + i + '">' + box(c[0], c[1], c[2], 46, 46, 40) + '<polygon points="' + pt([P(c[0] + 16, c[1] + 16, c[2] + 40), P(c[0] + 30, c[1] + 16, c[2] + 40), P(c[0] + 30, c[1] + 30, c[2] + 40), P(c[0] + 16, c[1] + 30, c[2] + 40)]) + '" stroke="rgba(255,255,255,.3)"/></g>'
      })
    } else {
      for (let i = 0; i < 10; i++) s += '<g class="iso rise" style="--k:' + i + '">' + box(-95 + i * 19, -45, 0, 4, 92, 128 - i * 11) + '</g>'
    }
    return s + '</svg>'
  }

  function renderFigs() {
    $('#figs').innerHTML = [
      ['fg1', 'fg1p'],
      ['fg2', 'fg2p'],
      ['fg3', 'fg3p']
    ].map((f, i) => '<div class="rv" style="--d:' + (i * .1) + 's"><span class="fk">FIG 0.' + (i + 1) + '</span>' + isoFig(i) + '<h4>' + esc(t(f[0])) + '</h4><p>' + esc(t(f[1])) + '</p></div>').join('')
  }
}
