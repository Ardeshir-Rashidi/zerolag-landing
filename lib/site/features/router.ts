// @ts-nocheck — ported from the original hash router; in Next.js the page comes from the URL path.
import { $ } from '../core/util';
import { setTimeout, requestAnimationFrame } from '../scope';

// Phase 1 (before the yield) shares this feature's functions on the shared site context;
// phase 2 runs its setup code, in the same order as the original single script.
export default function* router(site: any) {
  Object.assign(site, { route });
  yield;
  /* ================= router (one page per route) ================= */
  site.curPage = null;

  function route() {
    const pg = site.page;
    const changed = pg !== site.curPage;
    if (changed) {
      site.curPage = pg;
      site.watchReveal();
      site.words();
      setTimeout(site.sfx, 40);
    }
    const h = decodeURIComponent((location.hash || '').slice(1));
    if (pg === 'home' && h && document.getElementById(h)) {
      requestAnimationFrame(() => site.goTo(document.getElementById(h), false));
    }
    if (pg === 'locations') {
      if (changed) {
        site.replayWp();
        if (site.locGlobe && !site.pendingLoc) {
          site.lsel = null;
          site.markRow();
          const wp = $('[data-page=locations] .world.wp');
          if (wp) wp.classList.remove('live');
          site.locGlobe.setNet && site.locGlobe.setNet(true);
        }
      }
      // a city picked on the home page arrives as /locations?city=<id>
      const city = site.params.get('city');
      if (city) setTimeout(() => site.pickLoc(city), 60);
    }
    if (pg === 'download') {
      requestAnimationFrame(() => {
        site.fitAx();
        site.deskGlobes();
      });
      // footer links arrive as /download?os=win|mac|and|ios
      const os = site.params.get('os');
      if (os && site.APP_P) setTimeout(() => site.setDev(site.APP_P, os, false), 60);
    }
    if (pg === 'home' && window.__fdKick) setTimeout(window.__fdKick, 30);
    if (pg === 'apps' && !site.appsSeen) setTimeout(() => {
      const grid = $('#appGrid');
      if (grid && grid.offsetParent && !site.appsSeen) {
        site.appsSeen = true;
        site.renderAppsPage(true);
      }
    }, 300);
  }
}
