// @ts-nocheck — ported 1:1 from the original site script; type it file by file.
import { $, D, esc, t } from '../core/util';

// Phase 1 (before the yield) shares this feature's functions on the shared site context;
// phase 2 runs its setup code, in the same order as the original single script.
export default function* apps(site: any) {
  Object.assign(site, { renderAppsPage });
  yield;
  /* ================= APPS PAGE ================= */
  const CATS = ['all', 'dev', 'design', 'ai', 'work', 'media'];
  let cat = 'all';
  let aq = '';
  site.appsSeen = false;

  function renderAppsPage(flip) {
    $('#appCats').innerHTML = CATS.map(c => '<button type="button" class="' + (c === cat ? 'on' : '') + '" data-cat="' + c + '">' + esc(t('cat_' + c)) + '</button>').join('');
    const q = aq.trim().toLowerCase();
    const list = D.apps.filter(a => (cat === 'all' || a.cat === cat) && (!q || (a.n + ' ' + a.fa).toLowerCase().includes(q)));
    $('#appGrid').innerHTML = list.length ? list.map((a, i) => site.appCard(a, i, site.appsSeen && !flip)).join('') : '<p class="muted">' + esc(t('aNone', {
      q: aq
    })) + '</p>';
    if (flip) site.flipCards($('#appGrid'))
  }
  try { $('#appCats').addEventListener('click', e => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    cat = b.dataset.cat;
    renderAppsPage(true)
  }); } catch (e) { site.report(e, 'apps') }
  try { $('#aq').addEventListener('input', e => {
    aq = e.target.value;
    renderAppsPage(false)
  }); } catch (e) { site.report(e, 'apps') }
  try { site.onView($('#appGrid'), v => {
    if (v && !site.appsSeen && $('#appGrid').offsetParent) {
      site.appsSeen = true;
      renderAppsPage(true)
    }
  }); } catch (e) { site.report(e, 'apps') }
}
