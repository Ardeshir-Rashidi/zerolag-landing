// @ts-nocheck — ported 1:1 from the original site script; type it file by file.
import { BASE_PATH } from '@/lib/paths';
import { $, $$, N, RM, clamp, esc, hms, isFa, rnd, t } from '../core/util';
import { icon } from '../core/icons';
import { SERVERS, city, cname, code, coname, sig } from '../core/data';
import { setTimeout, onDocument } from '../scope';

// Phase 1 (before the yield) shares this feature's functions on the shared site context;
// phase 2 runs its setup code, in the same order as the original single script.
export default function* hero(site: any) {
  Object.assign(site, { heroList, wlistHTML, heroUI });
  yield;
  /* ================= HERO (desktop app schematic) ================= */
  try { site.H = {
    on: true,
    busy: false,
    cid: 'doh',
    since: Date.now() - (24 * 60 + 23) * 1000,
    shield: false
  }; } catch (e) { site.report(e, 'hero') }
  const REC = ['doh', 'ruh', 'dxb', 'ist', 'fra', 'ams'];
  let win;
  try { win = $('#appwin'); } catch (e) { site.report(e, 'hero') }
  let heroGlobe = null;
  try { site.GJOBS.push(() => heroGlobe = site.mountGlobe($('#globe'), {
    servers: SERVERS,
    selected: city(site.H.cid).cc.toLowerCase(),
    city: site.H.cid,
    status: site.H.busy ? 'connecting' : site.H.on ? 'on' : 'off',
    insets: innerWidth < 760 ? {
      top: 84,
      bottom: 30,
      left: 28,
      right: 28
    } : {
      top: 125,
      bottom: 95,
      left: 40,
      right: 40
    },
    onSelect: (sid, cid) => {
      if (cid && cid !== site.H.cid) {
        site.H.cid = cid;
        heroList();
        heroUI();
        if (site.H.on && !site.H.busy) heroConnect()
      }
    }
  })); } catch (e) { site.report(e, 'hero') }
  site.srvOf = cc => SERVERS.find(x => x.cc === cc);
  site.bestOf = sv => sv.cities.map(x => city(x.id)).sort((p, q) => p.p - q.p)[0];
  const nCit = sv => t(sv.cities.length === 1 ? 'nCity' : 'nCities', {
    n: sv.cities.length
  });
  const setTx = (sel, v) => {
    const e = $(sel);
    if (e) e.textContent = v
  };

  function ctryRow(sv) {
    const b = site.bestOf(sv),
      on = city(site.H.cid).cc === sv.cc;
    return '<button type="button" class="loc' + (on ? ' on' : '') + '" data-cid="' + b.id + '">' + code(sv.cc) + '<span class="grow"><b>' + esc(isFa() ? sv.name.fa : sv.name.en) + '</b><small>' + esc(cname(b)) + '</small></span>' + sig(b.p) + '</button>'
  }

  function recCard(cc, sub) {
    const sv = site.srvOf(cc),
      b = site.bestOf(sv),
      cur = city(site.H.cid).cc === cc && site.H.on && !site.H.busy;
    return '<div class="rc' + (cur ? ' on' : '') + '"><div class="rc-t">' + code(cc) + sig(b.p) + '</div><b>' + esc(isFa() ? sv.name.fa : sv.name.en) + '</b><small>' + esc(t(sub)) + '</small><button type="button" class="btn ' + (cur ? 'line' : 'white') + ' xs" data-cid="' + b.id + '">' + (cur ? '<i class="dot blue"></i>' + esc(t('connected')) : icon('power') + esc(t('phConnect'))) + '</button></div>'
  }
  const recsHTML = () => recCard('QA', 'fastestConn') + recCard('AE', 'nearestSrv');

  function heroList() {
    const box = $('#wlist');
    if (!box) return;
    box.innerHTML = wlistHTML(city(site.H.cid).cc)
  }

  function wlistHTML(cur) {
    const rec = ['QA', 'AE'].map((cc, i) => {
      const b = site.bestOf(site.srvOf(cc));
      return '<button type="button" class="wr-card' + (cur === cc ? ' on' : '') + '" data-cid="' + b.id + '">' + code(cc) + '<i class="sk" style="width:' + (i ? 58 : 72) + '%"></i><i class="sk s2" style="width:' + (i ? 40 : 48) + '%"></i><span class="wr-b">' + icon('power') + '<span class="num">' + N(b.p) + '</span></span></button>'
    }).join('');
    const W1 = [62, 48, 70, 55, 66, 50],
      W2 = [38, 30, 44, 34, 40, 28];
    const rows = SERVERS.filter(x => x.cc !== 'QA' && x.cc !== 'AE').sort((x, y) => site.bestOf(x).p - site.bestOf(y).p).slice(0, 6).map((sv, i) => {
      const b = site.bestOf(sv);
      return '<button type="button" class="wr-row' + (cur === sv.cc ? ' on' : '') + '" data-cid="' + b.id + '">' + code(sv.cc) + '<span class="grow"><i class="sk" style="width:' + W1[i] + '%"></i><i class="sk s2" style="width:' + W2[i] + '%"></i></span><span class="wr-ms num">' + N(b.p) + '</span></button>'
    }).join('');
    return '<div class="wr-search">' + icon('search') + '<i class="sk" style="width:52%"></i></div><i class="sk wr-h" style="width:46%"></i><div class="wr-recs">' + rec + '</div><i class="sk wr-h" style="width:34%"></i>' + rows
  }

  function heroUI() {
    const c = city(site.H.cid),
      sv = site.srvOf(c.cc),
      live = site.H.on && !site.H.busy;
    win.classList.toggle('on-state', site.H.on);
    win.classList.toggle('off-state', !site.H.on);
    const pw = $('#power');
    pw.setAttribute('aria-pressed', String(live));
    pw.classList.toggle('busy', site.H.busy);
    setTx('#pwState', site.H.busy ? t('pwBusy') : site.H.on ? t('pwOn') : t('pwOff'));
    if ($('#flocFlag')) $('#flocFlag').src = BASE_PATH + '/img/f/' + c.cc + '.webp';
    setTx('#flocName', cname(c) + (', ') + coname(c));
    setTx('#flocSub', site.H.busy ? t('rtTesting') : site.H.on ? t('wFastest') : t('wChosen'));
    setTx('#flocMs', live ? N(c.p) + ' ms' : '—');
    $('#curFlag').src = BASE_PATH + '/img/f/' + c.cc + '.webp';
    setTx('#curCo', coname(c));
    setTx('#curSub', cname(c) + ' · ' + (live ? t('smart') : t('wChosen')));
    $$('#wlist [data-cid]').forEach(b => b.classList.toggle('on', city(b.dataset.cid).cc === c.cc));
    heroStats()
  }

  function heroStats() {
    const c = city(site.H.cid);
    if (site.H.on && !site.H.busy) {
      $('#ctime').textContent = hms((Date.now() - site.H.since) / 1000);
      $('#sPing').textContent = N(c.p + Math.round(rnd() * 3 - 1));
      $('#sJit').textContent = N(1 + Math.round(rnd() * 2));
      $('#sLoad').textContent = N(clamp(c.l + Math.round(rnd() * 4 - 2), 1, 99))
    } else {
      $('#ctime').textContent = N('00:00:00');
      $('#sPing').textContent = '—';
      $('#sJit').textContent = '—';
      $('#sLoad').textContent = N(c.l)
    }
  }
  try { site.secs.add(heroStats); } catch (e) { site.report(e, 'hero') }

  function heroConnect() {
    site.H.busy = true;
    heroUI();
    heroGlobe && heroGlobe.setStatus('connecting');
    setTimeout(() => {
      site.H.busy = false;
      site.H.on = true;
      site.H.since = Date.now();
      heroUI();
      heroGlobe && heroGlobe.setStatus('on')
    }, RM ? 0 : 1600)
  }

  function setPower(v) {
    if (site.H.busy) return;
    if (v) heroConnect();
    else {
      site.H.on = false;
      heroUI();
      heroGlobe && heroGlobe.setStatus('off')
    }
  }

  function selectCity(id) {
    const c = city(id);
    if (!c) return;
    site.H.cid = id;
    heroList();
    heroUI();
    heroGlobe && heroGlobe.select(c.cc.toLowerCase(), id);
    if (site.H.on && !site.H.busy) heroConnect()
  }
  try { $('#power').addEventListener('click', () => setPower(!site.H.on)); } catch (e) { site.report(e, 'hero') }
  try { $$('[data-pw]').forEach(b => b.addEventListener('click', () => setPower(!site.H.on))); } catch (e) { site.report(e, 'hero') }
  try { $('#wlist') && $('#wlist').addEventListener('click', e => {
    const b = e.target.closest('[data-cid]');
    if (!b) return;
    const id = b.dataset.cid;
    if (id === site.H.cid) {
      if (!site.H.on) setPower(true);
      return
    }
    if (!site.H.on) {
      site.H.cid = id;
      heroList();
      heroGlobe && heroGlobe.select(city(id).cc.toLowerCase(), id);
      heroConnect();
      return
    }
    selectCity(id)
  }); } catch (e) { site.report(e, 'hero') }
  try { $('#wq') && $('#wq').addEventListener('input', heroList); } catch (e) { site.report(e, 'hero') }

  function setFocus(z) {
    $$('.hero-tabs button').forEach(b => {
      const on = b.dataset.focus === z;
      b.classList.toggle('on', on);
      b.setAttribute('aria-selected', String(on))
    });
    win.classList.toggle('focus', !!z);
    $$('[data-zone]', win).forEach(x => x.classList.toggle('zf', !!z && x.dataset.zone === z));
    $$('.zcall', win).forEach(c => c.classList.toggle('on', c.dataset.for === z))
  }
  try { $$('.hero-tabs button').forEach(b => b.addEventListener('click', () => setFocus(b.classList.contains('on') ? null : b.dataset.focus))); } catch (e) { site.report(e, 'hero') }
  try { onDocument('click', e => {
    if (win.classList.contains('focus') && !e.target.closest('.hero-tabs') && !e.target.closest('#appwin')) setFocus(null)
  }); } catch (e) { site.report(e, 'hero') }

  function setShield(v) {
    site.H.shield = v;
    $('#shieldBtn2').classList.toggle('on', v);
    $('#shieldBtn2').setAttribute('aria-pressed', String(v))
  }
  try { $('#shieldBtn2').addEventListener('click', () => setShield(!site.H.shield)); } catch (e) { site.report(e, 'hero') }
}
