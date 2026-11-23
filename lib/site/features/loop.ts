// @ts-nocheck — ported 1:1 from the original site script; type it file by file.
import { L } from '../core/util';
import { RELAYS, SERVERS } from '../core/data';
import { setInterval, requestAnimationFrame, IntersectionObserver } from '../scope';

// Phase 1 (before the yield) shares this feature's functions on the shared site context;
// phase 2 runs its setup code, in the same order as the original single script.
export default function* loop(site: any) {
  Object.assign(site, { mountGlobe, onView });
  yield;
  site.GLOBES = [];
  site.GJOBS = [];

  function mountGlobe(el, opts) {
    if (!el || !window.ZeroLagMap) return null;
    const m = window.ZeroLagMap.mount(el, Object.assign({
      servers: SERVERS,
      relays: RELAYS,
      lang: L,
      controls: false,
      interactive: false
    }, opts));
    site.GLOBES.push(m);
    return m
  }
  /* ---------------- frame loop + visibility ---------------- */
  try { site.live = new Set(); } catch (e) { site.report(e, 'loop') }
  let lastT;
  try { lastT = performance.now(); } catch (e) { site.report(e, 'loop') }

  function frame(now) {
    const dt = Math.min(80, now - lastT);
    lastT = now;
    site.live.forEach(f => {
      try {
        f(dt, now)
      } catch (e) {
        site.report(e, 'frame');
        site.live.delete(f)
      }
    });
    requestAnimationFrame(frame)
  }
  try { requestAnimationFrame(frame); } catch (e) { site.report(e, 'loop') }

  function onView(el, fn, margin) {
    if (!el) return;
    const io = new IntersectionObserver(es => es.forEach(e => fn(e.isIntersecting)), {
      rootMargin: margin || '60px'
    });
    io.observe(el);
    return io
  }
  try { site.secs = new Set(); } catch (e) { site.report(e, 'loop') }
  try { setInterval(() => site.secs.forEach(f => {
    try {
      f()
    } catch (e) {
      site.report(e, 'tick');
      site.secs.delete(f)
    }
  }), 1000); } catch (e) { site.report(e, 'loop') }
}
