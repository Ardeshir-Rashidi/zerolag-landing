// @ts-nocheck — ported 1:1 from the original site script; type it file by file.
import { $, $$, N, RM, clamp, esc, t } from '../core/util';
import { C, city, cname, code, coname } from '../core/data';

// Phase 1 (before the yield) shares this feature's functions on the shared site context;
// phase 2 runs its setup code, in the same order as the original single script.
export default function* locations(site: any) {
  Object.assign(site, { replayWp, renderLocPage, markRow, pickLoc });
  yield;
  /* ================= LOCATIONS PAGE ================= */
  const RGS = ['all', 'me', 'eu', 'as', 'am'];
  const rgLabel = r => t('rg' + r[0].toUpperCase() + r.slice(1));
  let lrg = 'all';
  let lq = '';
  site.lsel = null;
  site.pendingLoc = null;
  site.locGlobe = null;

  function replayWp() {
    const w = $('.world.wp');
    if (!w || RM) return;
    w.classList.remove('wp-in');
    void w.offsetWidth;
    w.classList.add('wp-in')
  }
  try { site.GJOBS.push(() => {
    site.locGlobe = site.mountGlobe($('#wMap'), {
      interactive: true,
      wheel: true,
      net: true,
      netTop: .095,
      netScale: 1.28,
      netLat: 20,
      insets: {
        top: Math.round(clamp(innerWidth * .56, 460, 800) * .15),
        bottom: 0,
        left: 0,
        right: 0
      },
      selected: 'qa',
      city: 'doh',
      status: 'on',
      onSelect: (sid, cid) => {
        site.lsel = cid;
        markRow()
      }
    });
    if (site.curPage === 'locations') {
      replayWp();
      if (site.lsel) pickLoc(site.lsel)
    }
  }); } catch (e) { site.report(e, 'locations') }

  function renderLocPage() {
    $('#lRg').innerHTML = RGS.map(r => '<button type="button" class="' + (r === lrg ? 'on' : '') + '" data-rg="' + r + '">' + esc(rgLabel(r)) + '</button>').join('');
    const q = lq.trim().toLowerCase();
    const list = C.filter(c => (lrg === 'all' || c.r === lrg) && (!q || (c.n.join(' ') + ' ' + c.co.join(' ') + ' ' + c.cc).toLowerCase().includes(q))).sort((a, b) => a.p - b.p);
    $('#rtable').innerHTML = list.length ? '<div class="rrow rhead" aria-hidden="true"><span class="cd">Code</span><span class="rct">Location</span><span class="rg">Country · Region</span><span class="pr">Protocols</span><span class="ms">Ping</span><span class="av">Plan</span></div>' + list.map(c => '<button type="button" class="rrow' + (c.id === site.lsel ? ' hot' : '') + '" data-cid="' + c.id + '"><span class="cd">' + code(c.cc, 'sm') + '<span>' + c.cc + '</span></span><span class="rct">' + esc(cname(c)) + '</span><span class="rg">' + esc(coname(c)) + ' · ' + esc(rgLabel(c.r)) + '</span><span class="pr">DoH · DoT · IPv6</span><span class="ms">' + N(c.p) + ' ms</span><span class="av"><i class="dot ' + (c.t === 'free' ? 'ok' : 'blue') + '"></i>' + esc(c.t === 'free' ? t('avail') : t('proOnly')) + '</span></button>').join('') : '<p class="rempty">' + esc(t('noLoc', {
      q: lq
    })) + '</p>'
  }

  function markRow() {
    $$('#rtable .rrow').forEach(r => r.classList.toggle('hot', r.dataset.cid === site.lsel))
  }

  function pickLoc(id) {
    const c = city(id);
    if (!c) return;
    site.lsel = id;
    markRow();
    if (site.locGlobe) {
      const wp = $('[data-page=locations] .world.wp');
      if (wp) wp.classList.add('live');
      if (site.locGlobe.setNet) site.locGlobe.setNet(false);
      site.locGlobe.select(c.cc.toLowerCase(), id);
      if (site.locGlobe.view) site.locGlobe.view('fit', 10)
    }
  }
  try { $('#lRg').addEventListener('click', e => {
    const b = e.target.closest('[data-rg]');
    if (!b) return;
    lrg = b.dataset.rg;
    renderLocPage()
  }); } catch (e) { site.report(e, 'locations') }
  try { $('#lq').addEventListener('input', e => {
    lq = e.target.value;
    renderLocPage()
  }); } catch (e) { site.report(e, 'locations') }
  try { $('#rtable').addEventListener('click', e => {
    const b = e.target.closest('.rrow');
    if (!b || !b.dataset.cid) return;
    pickLoc(b.dataset.cid);
    site.goTo($('[data-page=locations] .phero'), !RM)
  }); } catch (e) { site.report(e, 'locations') }
}
