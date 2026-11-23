// @ts-nocheck — ported 1:1 from the original site script; type it file by file.
import { $, $$, clamp, esc, t } from '../core/util';
import { icon } from '../core/icons';
import { toast } from '../core/data';
import { setInterval, ResizeObserver, onDocument } from '../scope';

// Phase 1 (before the yield) shares this feature's functions on the shared site context;
// phase 2 runs its setup code, in the same order as the original single script.
export default function* rings(site: any) {
  Object.assign(site, { drawRings, renderDl });
  yield;
  /* ================= DEVICES (rings) ================= */
  const NODES = [
    ['windows', 'Windows', 0, -28],
    ['apple', 'macOS', 1, 200],
    ['android', 'Android', 1, 28],
    ['phone', 'iPhone', 0, 155],
    ['console', 'PlayStation 5', 2, -12],
    ['console', 'Xbox', 2, 192],
    ['console', 'Nintendo Switch', 3, -4],
    ['router', 'router', 3, 176]
  ];
  let ua;
  try { ua = navigator.userAgent || ''; } catch (e) { site.report(e, 'rings') }
  try { site.myOS = /android/i.test(ua) ? 'and' : /iphone|ipad|ipod/i.test(ua) ? 'ios' : /mac/i.test(ua) ? 'mac' : 'win'; } catch (e) { site.report(e, 'rings') }

  function drawRings() {
    const box = $('#rings');
    const W = box.clientWidth,
      Hh = box.clientHeight;
    if (!W || !Hh) return;
    const cx = W / 2,
      cy = Hh / 2;
    const narrow = W < 640;
    const R = narrow ? [70, 120, 170, 230] : [110, 210, 320, 440].map(r => r * Math.min(1, W / 1100));
    let s = '';
    R.forEach((r, i) => {
      s += '<circle class="ring-c" cx="' + cx + '" cy="' + cy + '" r="' + r.toFixed(1) + '" style="animation:spinr ' + (60 + i * 25) + 's linear infinite' + (i % 2 ? ' reverse' : '') + '"/>'
    });
    const OW = [
        [0, -70],
        [1, -118],
        [1, 40],
        [0, 110],
        [2, -24],
        [2, 204],
        [3, 18],
        [3, 162]
      ],
      ON = [
        [1, 0],
        [2, -120],
        [2, 60],
        [1, 180],
        [2, -60],
        [2, 120],
        [3, 90],
        [3, -90]
      ];
    const pos = NODES.map((n, i) => {
      const o = (narrow ? ON : OW)[i];
      const a = o[1] * Math.PI / 180;
      return [cx + Math.cos(a) * R[o[0]], cy + Math.sin(a) * R[o[0]]]
    });
    pos.forEach((p, i) => {
      const d = 'M' + cx + ' ' + cy + 'L' + p[0].toFixed(1) + ' ' + p[1].toFixed(1);
      s += '<path class="beam" data-b="' + i + '" d="' + d + '" pathLength="1"/><circle class="pk" data-b="' + i + '" r="3"><animateMotion dur="1.4s" repeatCount="indefinite" path="' + d + '"/></circle>'
    });
    $('svg', box).innerHTML = s;
    $$('.nd', box).forEach(e => e.remove());
    NODES.forEach((n, i) => {
      const e = document.createElement('span');
      e.className = 'nd';
      e.dataset.i = i;
      e.style.left = clamp(pos[i][0], 60, W - 60) + 'px';
      e.style.top = clamp(pos[i][1], 24, Hh - 24) + 'px';
      e.innerHTML = icon(n[0]) + '<span>' + esc(n[1] === 'router' ? t('router') : n[1]) + '</span>';
      box.appendChild(e)
    })
  }
  try { new ResizeObserver(drawRings).observe($('#rings')); } catch (e) { site.report(e, 'rings') }
  try { $('#rings').addEventListener('pointerover', e => {
    const n = e.target.closest('.nd');
    $$('#rings .beam,#rings .pk').forEach(b => b.classList.toggle('on', !!n && b.dataset.b === n.dataset.i));
    $$('#rings .nd').forEach(x => x.classList.toggle('hot', x === n))
  }); } catch (e) { site.report(e, 'rings') }
  try { $('#rings').addEventListener('pointerleave', () => {
    $$('#rings .beam,#rings .pk').forEach(b => b.classList.remove('on'));
    $$('#rings .nd').forEach(x => x.classList.remove('hot'))
  }); } catch (e) { site.report(e, 'rings') }
  let ringI = 0,
    ringOn = false;

  function ringStep() {
    if (!ringOn || document.hidden || $('#rings').matches(':hover')) return;
    ringI = (ringI + 1) % NODES.length;
    $$('#rings .beam,#rings .pk').forEach(b => {
      const on = +b.dataset.b === ringI;
      b.classList.remove('on');
      if (on) {
        void b.getBoundingClientRect();
        b.classList.add('on')
      }
    });
    $$('#rings .nd').forEach(x => x.classList.toggle('hot', +x.dataset.i === ringI))
  }
  try { setInterval(ringStep, 2200); } catch (e) { site.report(e, 'rings') }
  try { site.onView($('#rings'), v => {
    ringOn = v;
    if (v) ringStep()
  }); } catch (e) { site.report(e, 'rings') }
  const OS = [
    ['win', 'Windows', 'osWin'],
    ['mac', 'macOS', 'osMac'],
    ['and', 'Android', 'osAnd'],
    ['ios', 'iOS', 'osIos']
  ];
  site.DLM = {
    win: ['windows', ['.exe', 'x64 · ARM64']],
    mac: ['apple', ['.dmg', 'Apple silicon · Intel']],
    and: ['android', ['Google Play', 'APK']],
    ios: ['apple', ['App Store', 'iPhone · iPad']]
  };

  function renderDl() {
    $('#dl4').innerHTML = OS.map((o, i) => {
      const mine = o[0] === site.myOS,
        m = site.DLM[o[0]];
      return '<div class="dlc' + (mine ? ' mine' : '') + '" style="--i:' + i + '"><div class="dlc-t"><span class="dlc-ic">' + icon(m[0]) + '</span>' + (mine ? '<span class="you"><i class="dot blue"></i>' + esc(t('dlYou')) + '</span>' : '') + '</div><b class="dlc-n">' + o[1] + '</b><p class="dlc-r">' + esc(t(o[2])) + '</p><div class="dlc-m">' + m[1].map(x => '<span>' + x + '</span>').join('') + '</div><button type="button" class="btn ' + (mine ? 'white' : 'line') + ' sm dlc-b" data-dl>' + icon('download') + '<span>' + esc(t('dlFor', {
        os: o[1]
      })) + '</span></button></div>'
    }).join('')
  }
  try { onDocument('click', e => {
    if (e.target.closest('[data-dl]')) toast(t('dlToast'));
    else if (e.target.closest('[data-plan]')) toast(t('planToast'));
    else if (e.target.closest('[data-support]')) toast(t('supportToast'))
  }); } catch (e) { site.report(e, 'rings') }
}
