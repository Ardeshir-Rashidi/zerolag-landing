// @ts-nocheck — ported 1:1 from the original site script; type it file by file.
import { BASE_PATH } from '@/lib/paths';
import { $, $$, N, RM, esc, isFa, t } from '../core/util';
import { ARW } from '../core/icons';
import { geName, plName } from '../core/data';
import { setTimeout } from '../scope';

// Phase 1 (before the yield) shares this feature's functions on the shared site context;
// phase 2 runs its setup code, in the same order as the original single script.
export default function* cards(site: any) {
  Object.assign(site, { flipCards });
  yield;
  /* ================= marketplace-style cards ================= */
  site.gameCard = (g, i) => '<a class="mk" href="' + BASE_PATH + '/games" style="--i:' + i + '"><span class="cover"><img src="' + BASE_PATH + '/img/g/' + g.id + '.webp" alt="" loading="lazy"></span><div class="top"><span class="lg"><img src="' + BASE_PATH + '/img/g/' + g.id + '.webp" alt="" loading="lazy"></span><span class="tag gray">' + esc(geName(g.ge)) + '</span></div><b>' + esc(g.n) + '</b><p>' + esc(plName(g.pl)) + ' · ' + esc(g.pub) + '</p><span class="ms"><s>' + N(g.b) + '</s>' + ARW + '<i>' + N(g.a) + ' ms</i></span></a>';
  site.appIcon = a => '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="' + a.p + '"/></svg>';
  site.appCard = (a, i, ok) => '<div class="mk" style="--i:' + i + '"><div class="top"><span class="lg" style="color:#ededed">' + site.appIcon(a) + '</span><span class="tag gray">' + esc(t('cat_' + a.cat)) + '</span></div><b>' + esc(isFa() ? a.fa : a.n) + '</b><span class="ms"><span class="st bad"' + (ok ? ' hidden' : '') + '>403</span><span class="st ok"' + (ok ? '' : ' hidden') + '><i class="dot"></i>200 · ' + esc(t('unblocked')) + '</span></span></div>';

  function flipCards(root) {
    $$('.mk', root).forEach((el, i) => setTimeout(() => {
      const b = $('.st.bad', el),
        o = $('.st.ok', el);
      if (b) b.hidden = true;
      if (o) o.hidden = false
    }, RM ? 0 : 600 + i * 110))
  }
}
