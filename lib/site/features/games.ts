// @ts-nocheck — ported 1:1 from the original site script; type it file by file.
import { BASE_PATH } from '@/lib/paths';
import { $, D, N, esc, t } from '../core/util';
import { ARW } from '../core/icons';
import { G } from '../core/data';

// Phase 1 (before the yield) shares this feature's functions on the shared site context;
// phase 2 runs its setup code, in the same order as the original single script.
export default function* games(site: any) {
  Object.assign(site, { renderGamesPage });
  yield;
  /* ================= GAMES PAGE ================= */
  const platCard = (p, i) => '<a class="mk" href="' + BASE_PATH + '/games" style="--i:' + i + '"><div class="top"><span class="lg pl" style="background:' + p.c + ';color:' + p.fg + '">' + (p.p ? '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="' + p.p + '"/></svg>' : '<b>' + esc(p.m) + '</b>') + '</span><span class="tag gray">' + esc(t(p.g === 'con' ? 'plConNet' : 'plLauncher')) + '</span></div><b>' + esc(p.n) + '</b><p>' + p.svc.map(x => esc(t('svc_' + x))).join(' · ') + '</p><span class="ms"><s>' + N(p.b) + '</s>' + ARW + '<i>' + N(p.a) + ' ms</i></span></a>';
  let gp = 'all',
    gq = '',
    gall = false;
  const GP = [
    ['all', 'plAll'],
    ['PC', 'plPC'],
    ['Console', 'plCon'],
    ['Mobile', 'plMob']
  ];

  function renderGamesPage() {
    $('#gPlat').innerHTML = GP.map(p => '<button type="button" class="' + (p[0] === gp ? 'on' : '') + '" data-gp="' + p[0] + '">' + esc(t(p[1])) + '</button>').join('');
    const q = gq.trim().toLowerCase();
    const list = G.filter(g => (gp === 'all' || (g.pl || '').includes(gp)) && (!q || (g.n + ' ' + g.pub + ' ' + g.ge).toLowerCase().includes(q)));
    const filtered = q || gp !== 'all';
    const show = gall || filtered ? list : list.slice(0, 16);
    $('#gGrid').innerHTML = show.length ? show.map((g, i) => site.gameCard(g, i % 16)).join('') : '<p class="muted">' + esc(t('gNone', {
      q: gq
    })) + '</p>';
    const more = $('#gMore');
    more.parentElement.hidden = filtered || list.length <= 16;
    more.textContent = gall ? t('gShowLess') : t('gShowAll', {
      n: G.length
    });
    $('#plGrid').innerHTML = D.plats.map((p, i) => platCard(p, i)).join('');
    if (0) $('#plGrid').innerHTML = D.plats.map((p, i) => '<div class="mk row" style="--i:' + i + '"><span class="lg">' + esc(p.m) + '</span><span class="t"><b>' + esc(p.n) + '</b><small>' + p.svc.map(s => esc(t('svc_' + s))).join(' · ') + '</small></span><span class="ms"><s>' + N(p.b) + '</s>' + ARW + '<i>' + N(p.a) + ' ms</i></span></div>').join('')
  }
  try { $('#gPlat').addEventListener('click', e => {
    const b = e.target.closest('[data-gp]');
    if (!b) return;
    gp = b.dataset.gp;
    renderGamesPage()
  }); } catch (e) { site.report(e, 'games') }
  try { $('#gq').addEventListener('input', e => {
    gq = e.target.value;
    renderGamesPage()
  }); } catch (e) { site.report(e, 'games') }
  try { $('#gMore').addEventListener('click', () => {
    gall = !gall;
    renderGamesPage()
  }); } catch (e) { site.report(e, 'games') }
}
