// @ts-nocheck — ported 1:1 from the original site script; type it file by file.
import { BASE_PATH } from '@/lib/paths';
import { $, D, N, esc, isFa, t } from '../core/util';
import { ARW } from '../core/icons';
import { G, geName, plName } from '../core/data';

// Phase 1 (before the yield) shares this feature's functions on the shared site context;
// phase 2 runs its setup code, in the same order as the original single script.
export default function* marquees(site: any) {
  Object.assign(site, { renderMarquees });
  yield;
  /* ================= marquees: games + tools, two rows each, opposite directions ================= */
  const gChip = g => '<a class="mq-g" href="' + BASE_PATH + '/games"><img src="' + BASE_PATH + '/img/g/' + g.id + '.webp" alt="" draggable="false"><span class="mq-gv"><span class="tag">' + esc(geName(g.ge)) + '</span><b>' + esc(g.n) + '</b><small>' + esc(plName(g.pl)) + '</small><span class="ms"><s>' + N(g.b) + '</s>' + ARW + '<i>' + N(g.a) + ' ms</i><em>−' + N(Math.round((1 - g.a / g.b) * 100)) + '%</em></span></span></a>';
  const aChip = a => '<a class="mq-a" href="' + BASE_PATH + '/apps"><span class="mq-at"><span class="lg" style="background:' + a.c + '">' + site.appIcon(a) + '</span><span class="tag">' + esc(t('cat_' + a.cat)) + '</span></span><b>' + esc(isFa() ? a.fa : a.n) + '</b><span class="st2"><s>403</s>' + ARW + '<i><i class="dot"></i>200 OK</i><small>' + esc(t('viaDns')) + '</small></span></a>';
  const mqRow = (html, dir, sec) => '<div class="mq-row ' + dir + '" style="--t:' + sec + 's"><div class="mq-track">' + html + html + '</div></div>';
  site.mqSeen = false;

  function renderMarquees() {
    if (!site.mqSeen) return;
    const h = Math.ceil(G.length / 2);
    $('#gMq').innerHTML = mqRow(G.slice(0, h).map(gChip).join(''), 'l', 70) + mqRow(G.slice(h).map(gChip).join(''), 'r', 76);
    const A = D.apps,
      ha = Math.ceil(A.length / 2);
    $('#aMq').innerHTML = mqRow(A.slice(0, ha).map(aChip).join(''), 'r', 52) + mqRow(A.slice(ha).map(aChip).join(''), 'l', 56)
  }
}
