// @ts-nocheck — ported 1:1 from the original site script; type it file by file.
import { assetPath } from '@/lib/paths';
import { $$ } from '../core/util';

import { setTimeout, requestIdleCallback } from '../scope';

// Phase 1 (before the yield) shares this feature's functions on the shared site context;
// phase 2 runs its setup code, in the same order as the original single script.
export default function* boot(site: any) {
  yield;
  /* ================= boot ================= */
  /* logos and icons are already in the server-rendered markup */
  try { $$('[data-slot=mobile]').forEach(site.mountPhone); } catch (e) { site.report(e, 'boot') }
  try { site.applyLang(); } catch (e) { site.report(e, 'boot') }
  try { site.frameUp(); } catch (e) { site.report(e, 'boot') }
  try { site.blockReveal(); } catch (e) { site.report(e, 'boot') }
  try { site.route(); } catch (e) { site.report(e, 'boot') }
  try { site.frameDraw(); } catch (e) { site.report(e, 'boot') }
  try { site.onScroll(); } catch (e) { site.report(e, 'boot') }
  try { setTimeout(site.sfx, 50); } catch (e) { site.report(e, 'boot') }
  /* globes: the country outlines are a separate file, fetched after the page is up */
  function geoData() {
    if (window.ZL_GEO) return Promise.resolve(window.ZL_GEO);
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = assetPath('/geo.js');
      s.async = true;
      s.onload = () => window.ZL_GEO ? res(window.ZL_GEO) : rej(new Error('geo.js empty'));
      s.onerror = () => fetch(assetPath('/geo.json')).then(r => {
        if (!r.ok) throw new Error('geo ' + r.status);
        return r.json()
      }).then(res, rej);
      document.head.appendChild(s)
    })
  }

  function loadGlobes() {
    geoData().then(g => {
      if (!site.alive) return;
      window.ZL_GEO = g;
      if (window.ZLBOOT && !window.ZeroLagMap) window.ZLBOOT();
      site.GJOBS.splice(0).forEach(f => {
        try {
          f()
        } catch (e) {
          console.error(e)
        }
      });
      try { site.renderTree(); if (!site.bOn) site.bRender('off') } catch (e) { site.report(e, 'globes') }
    }).catch(e => {
      console.error(e);
      document.documentElement.classList.add('no-globe')
    })
  }
  try { if ('requestIdleCallback' in window) requestIdleCallback(loadGlobes, {
    timeout: 600
  });
  else setTimeout(loadGlobes, 120); } catch (e) { site.report(e, 'boot') }
  try { if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => {
    if (!site.alive) return;
    for (const draw of [site.drawLine, site.drawFlow, site.drawRings]) try { draw() } catch (e) { site.report(e, 'fonts') }
  }); } catch (e) { site.report(e, 'boot') }
}
