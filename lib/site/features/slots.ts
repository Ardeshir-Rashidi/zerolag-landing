// @ts-nocheck — ported 1:1 from the original site script; type it file by file.
import { BASE_PATH } from '@/lib/paths';
import { $$, N, esc, pad2, t } from '../core/util';
import { icon } from '../core/icons';

// Phase 1 (before the yield) shares this feature's functions on the shared site context;
// phase 2 runs its setup code, in the same order as the original single script.
export default function* slots(site: any) {
  Object.assign(site, { renderSlots });
  yield;
  /* ================= shared slots: steps, talk ================= */
  function renderSlots() {
    $$('[data-slot=steps]').forEach(s => s.innerHTML = '<div class="head"><span class="eyebrow">' + esc(t('stepsE')) + '</span><div><h2 class="h2">' + esc(t('stepsT')) + '</h2><p class="sub">' + esc(t('stepsS')) + '</p></div></div><div class="fbw"><div class="flist fb cg">' + [
      ['s1t', 's1p', 'search'],
      ['s2t', 's2p', 'route'],
      ['s3t', 's3p', 'check']
    ].map((k, i) => '<div class="mk stp" style="--i:' + i + '"><div class="top"><span class="lg">' + icon(k[2]) + '</span><span class="tag gray">Step ' + N(pad2(i + 1)) + '</span></div><b>' + esc(t(k[0])) + '</b><p>' + esc(t(k[1])) + '</p></div>').join('') + '</div></div>');
    $$('[data-slot=talk]').forEach(s => s.innerHTML = '<div class="talk2"><div><h2 class="h2">' + esc(t('cT')) + '</h2><p>' + esc(t('cP')) + '</p></div><div class="cta" style="margin:0"><button type="button" class="btn line" data-support>' + esc(t('cBtn2')) + '</button><a class="btn white" href="' + BASE_PATH + '/contact">' + esc(t('cBtn')) + '</a></div></div>')
  }
}
