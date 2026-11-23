// @ts-nocheck — ported 1:1 from the original site script; type it file by file.
import { $, $$, D, N, RM, clamp, ease, esc, t } from '../core/util';
import { C, G } from '../core/data';
import { requestAnimationFrame } from '../scope';

// Phase 1 (before the yield) shares this feature's functions on the shared site context;
// phase 2 runs its setup code, in the same order as the original single script.
export default function* stats(site: any) {
  Object.assign(site, { renderStats });
  yield;
  /* ================= STATS ================= */
  let STATS;
  try { STATS = [
    [new Set(C.map(c => c.cc)).size, 'stA', 'stAp'],
    [C.length, 'stB', 'stBp'],
    [G.length, 'stC', 'stCp'],
    [D.apps.length, 'stD', 'stDp']
  ]; } catch (e) { site.report(e, 'stats') }
  let statsDone = false;

  function renderStats() {
    $('#statsRow').innerHTML = STATS.map((s, i) => '<div class="stat rv in" style="--d:' + (i * .08) + 's"><b class="num" data-n="' + s[0] + '">' + N(statsDone ? s[0] : 0) + '</b><strong>' + esc(t(s[1])) + '</strong><p>' + esc(t(s[2])) + '</p></div>').join('')
  }
  try { site.onView($('#statsRow'), v => {
    if (!v || statsDone) return;
    statsDone = true;
    const els = $$('#statsRow b');
    const t0 = performance.now();
    const run = now => {
      const k = clamp((now - t0) / 1200, 0, 1);
      els.forEach(el => el.textContent = N(Math.round(+el.dataset.n * ease(k))));
      if (k < 1) requestAnimationFrame(run)
    };
    RM ? els.forEach(el => el.textContent = N(el.dataset.n)) : requestAnimationFrame(run)
  }); } catch (e) { site.report(e, 'stats') }
}
