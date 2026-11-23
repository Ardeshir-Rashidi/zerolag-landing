// @ts-nocheck — ported 1:1 from the original site script; type it file by file.
import { $, N, esc } from '../core/util';
import { city, cname, coname } from '../core/data';

// Phase 1 (before the yield) shares this feature's functions on the shared site context;
// phase 2 runs its setup code, in the same order as the original single script.
export default function* netglobe(site: any) {
  Object.assign(site, { renderCodes });
  yield;
  /* ================= GLOBAL PERSPECTIVE (login-style network globe) ================= */
  try { site.GJOBS.push(() => site.mountGlobe($('#netMap'), {
    net: true,
    netTop: .1,
    netScale: 1.35,
    selected: null,
    status: 'off'
  })); } catch (e) { site.report(e, 'netglobe') }
  const FEAT = ['doh', 'fra', 'ist', 'dxb'];

  function renderCodes() {
    $('#codes').innerHTML = FEAT.map(id => {
      const c = city(id);
      return '<button type="button" data-cid="' + id + '"><span class="mono">' + id.toUpperCase() + '</span><b>' + esc(cname(c)) + '</b><small>' + N(c.p) + ' ms · ' + esc(coname(c)) + '</small></button>'
    }).join('')
  }
  try { $('#codes').addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    site.pendingLoc = b.dataset.cid;
    site.navigate('/locations?city=' + encodeURIComponent(site.pendingLoc))
  }); } catch (e) { site.report(e, 'netglobe') }
}
