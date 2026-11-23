// @ts-nocheck — ported 1:1 from the original site script; type it file by file.
import { requestAnimationFrame, ResizeObserver } from '../scope';

// Phase 1 (before the yield) shares this feature's functions on the shared site context;
// phase 2 runs its setup code, in the same order as the original single script.
export default function* phone(site: any) {
  Object.assign(site, { mountPhone });
  yield;
  /* ================= PHONE (wake it with the side button) ================= */
  site.PHONES = [];

  function mountPhone(slot) {
    const P = {
      on: true,
      busy: false,
      awake: false,
      since: Date.now() - (5 * 60 + 24) * 1000,
      root: slot,
      dev: slot.closest('[data-page=download]') ? site.devDefault() : null
    };
    if (P.dev) {
      P.awake = true;
      site.APP_P = P;
      requestAnimationFrame(() => {
        site.fitAx(slot);
        site.deskGlobes()
      });
      if (window.ResizeObserver) new ResizeObserver(() => site.fitAx(slot)).observe(slot)
    }
    site.PHONES.push(P);
    site.renderPhone(P);
    slot.addEventListener('click', e => {
      if (e.target.closest('.pp-side')) {
        site.phWake(P, !P.awake);
        return
      }
      if (!P.awake) return;
      if (e.target.closest('.pp-pw,.pp-npw')) site.phPower(P, !P.on)
    })
  }
}
