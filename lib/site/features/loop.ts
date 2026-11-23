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
    const options = Object.assign({
      servers: SERVERS,
      relays: RELAYS,
      lang: L,
      controls: false,
      interactive: false
    }, opts);
    const bounds = el.getBoundingClientRect();
    if (bounds.width && bounds.height && bounds.top < innerHeight + 160 && bounds.bottom > -160) {
      const map = window.ZeroLagMap.mount(el, options);
      site.GLOBES.push(map);
      return map;
    }
    // Keep offscreen WebGL contexts and textures out of the hero's startup frame.
    // Retain the latest requested state until the map approaches the viewport.
    let map = null;
    let destroyed = false;
    const pending = new Map();
    const deferred = {};
    for (const name of ['select', 'setStatus', 'setLang', 'fit', 'view', 'intro', 'setNet', 'world', 'zoom', '_flagDirty']) {
      deferred[name] = (...args) => {
        if (destroyed) return;
        if (map) return map[name](...args);
        pending.delete(name);
        pending.set(name, args);
      };
    }
    const observer = new IntersectionObserver(entries => {
      if (map || destroyed || !site.alive || !entries.some(e => e.isIntersecting)) return;
      observer.disconnect();
      map = window.ZeroLagMap.mount(el, options);
      pending.forEach((args, name) => map[name](...args));
      pending.clear();
    }, { rootMargin: '160px' });
    observer.observe(el);
    deferred.destroy = () => {
      destroyed = true;
      observer.disconnect();
      pending.clear();
      map?.destroy();
    };
    site.GLOBES.push(deferred);
    return deferred;
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
