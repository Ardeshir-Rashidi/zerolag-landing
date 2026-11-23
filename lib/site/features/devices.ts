// @ts-nocheck — ported 1:1 from the original site script; type it file by file.
import { BASE_PATH } from '@/lib/paths';
import { $, $$, N, RM, esc, hms, rnd, t } from '../core/util';
import { icon, logo } from '../core/icons';
import { SERVERS, city, cname, code, coname } from '../core/data';
import { setTimeout, requestAnimationFrame, addEventListener, onDocument } from '../scope';

// Phase 1 (before the yield) shares this feature's functions on the shared site context;
// phase 2 runs its setup code, in the same order as the original single script.
export default function* devices(site: any) {
  Object.assign(site, { setDev, devDefault, deskGlobes, fitAx, renderPhone, phWake, phPower });
  yield;
  /* ---------- Apps: one app on every screen — the tabs switch the device, its version and download sit under it ---------- */
  const DEVS = {
    and: ['Android', 'android', 'ZeroLag for Android', ['Google Play', 'APK'], 'Download for Android', 'osAnd'],
    ios: ['iOS', 'apple', 'ZeroLag for iPhone and iPad', ['App Store', 'iPhone · iPad'], 'Download for iOS', 'osIos'],
    mac: ['Mac', 'laptop', 'ZeroLag for macOS', ['.dmg', 'Apple silicon · Intel'], 'Download for Mac', 'osMac'],
    win: ['Windows', 'windows', 'ZeroLag for Windows', ['.exe', 'x64 · ARM64'], 'Download for Windows', 'osWin']
  };
  const DEV_ORDER = ['win', 'mac', 'and', 'ios'];
  site.APP_P = null;

  function devDefault() {
    return DEVS[site.myOS] ? site.myOS : 'win'
  }
  /* the desktop dashboard — the same window the home hero shows, live globe included */
  function dshHTML(win) {
    const S = site.H.since;
    const bar = win ? '<div class="win-bar wb-win"><span class="crumb"><span class="logo sm">' + logo() + '</span><b>ZeroLag</b><span>/</span><span>' + esc(t('wCrumb')) + '</span></span><span></span><span class="wctl"><i></i><i></i><i></i></span></div>' :
      '<div class="win-bar"><span class="dots"><i></i><i></i><i></i></span><span class="crumb"><b>ZeroLag</b><span>/</span><span>' + esc(t('wCrumb')) + '</span></span><span class="win-tag"><span class="logo sm">' + logo() + '</span><span>' + esc(t('wDesktop')) + '</span></span></div>';
    const side = '<aside class="w-side"><span class="logo md">' + logo() + '</span>' + icon('home', 'on') + icon('gamepad') + icon('grid') + icon('globe') + '<span class="sp"></span>' + icon('settings') + icon('chat') + '</aside>';
    const conn = '<div class="w-conn"><div class="wc-h"><span class="wc-t"><i class="sk" style="width:122px"></i><i class="sk" style="width:86px"></i></span><button class="w-shield" type="button" tabindex="-1">' + icon('shield') + '</button></div>' +
      '<div class="pw-wrap"><button class="power" type="button" tabindex="-1" aria-pressed="true"><span class="ring"></span><span class="ring r2"></span>' + icon('power') + '</button><p class="pw-state"><i class="dot"></i><i class="sk" style="width:104px"></i></p></div>' +
      '<div class="w-time"><i class="sk wc-l"></i><b class="num dsh-time">' + hms((Date.now() - S) / 1000) + '</b><div class="w-stats"><div><i class="sk"></i><b><span class="num">' + N(14) + '</span><em>ms</em></b></div><div><i class="sk"></i><b><span class="num">' + N(1) + '</span><em>ms</em></b></div><div><i class="sk"></i><b><span class="num">' + N(51) + '</span><em>%</em></b></div></div></div>' +
      '<div class="w-cur"><img class="flag" src="' + BASE_PATH + '/img/f/QA.webp" alt=""><span class="grow"><i class="sk" style="width:64%"></i><i class="sk s2" style="width:42%"></i></span><span class="wc-ch">' + icon('chevron-down') + '</span></div></div>';
    return '<div class="appwin dsh on-state' + (win ? ' dsh-win' : '') + '">' + bar + '<div class="win-body">' + side + '<div class="w-locs"><div class="w-scroll wr">' + site.wlistHTML('QA') + '</div></div><div class="w-map"><div class="map"></div></div>' + conn + '</div></div>'
  }

  function devScreen(k) {
    const win = k === 'win',
      W = win ? 1600 : 1440;
    const scene = '<div class="dv-scr ax-fit dv-desk" data-w="' + W + '" data-h="900"><div class="ax-stage" style="width:' + W + 'px;height:900px">' + dshHTML(win) + (win ? '<div class="ax-task"><i></i><i class="on"></i><i></i><i></i><span class="sp"></span><span>9:41</span></div>' : '') + '</div></div>';
    return win ? '<div class="dv-mon"><div class="dv-bez">' + scene + '<span class="dv-chin"></span></div><div class="dv-neck"></div><div class="dv-foot"></div></div>' : '<div class="dv-mac"><div class="dv-lid"><span class="dv-notch"></span>' + scene + '</div><div class="dv-base"></div></div>'
  }
  const DVOS = {
    win: 'Windows',
    mac: 'macOS',
    and: 'Android',
    ios: 'iOS'
  };

  function dlCard(k, on) {
    const m = site.DLM[k],
      mine = k === site.myOS;
    return '<div class="dlc' + (on ? ' on' : '') + (mine ? ' mine' : '') + '" data-dv="' + k + '" role="tab" tabindex="0" aria-selected="' + on + '"><div class="dlc-t"><span class="dlc-ic">' + icon(m[0]) + '</span>' + (mine ? '<span class="you"><i class="dot blue"></i>' + esc(t('dlYou')) + '</span>' : '') + '</div><b class="dlc-n">' + DVOS[k] + '</b><p class="dlc-r">' + esc(t(DEVS[k][5])) + '</p><div class="dlc-m">' + m[1].map(x => '<span>' + x + '</span>').join('') + '</div><button type="button" class="btn ' + (on ? 'white' : 'line') + ' sm dlc-b" data-dl>' + icon('download') + '<span>' + esc(t('dlFor', {
      os: DVOS[k]
    })) + '</span></button></div>'
  }

  function devHTML(P, phones) {
    return '<div class="dlx-top"><span class="dlx-cap mono">On screen · <b>' + DVOS[P.dev] + '</b></span><div class="dev-stage">' + DEV_ORDER.map(k => '<div class="dev-v" data-dev="' + k + '"' + (k === P.dev ? '' : ' hidden') + '>' + (phones[k] || devScreen(k)) + '</div>').join('') + '</div></div>' +
      '<div class="dl4 dlx-cards" role="tablist" aria-label="Devices">' + DEV_ORDER.map(k => dlCard(k, k === P.dev)).join('') + '</div>'
  }
  const DSH_GLOBE = {
    servers: SERVERS,
    selected: 'qa',
    city: 'doh',
    status: 'on',
    insets: {
      top: 125,
      bottom: 95,
      left: 40,
      right: 40
    }
  };

  function deskGlobes() {
    if (!window.ZeroLagMap || site.curPage !== 'download') return;
    $$('[data-page=download] .dev-v:not([hidden]) .dsh .map:not([data-m])').forEach(el => {
      if (!el.clientWidth) return;
      el.dataset.m = '1';
      site.mountGlobe(el, Object.assign({}, DSH_GLOBE))
    })
  }
  try { site.GJOBS.push(deskGlobes); } catch (e) { site.report(e, 'devices') }
  try { site.secs.add(() => {
    const s = hms((Date.now() - site.H.since) / 1000);
    $$('.dsh-time').forEach(el => el.textContent = s)
  }); } catch (e) { site.report(e, 'devices') }

  function fitAx(root) {
    $$('.ax-fit', root || document).forEach(f => {
      const w = +f.dataset.w,
        k = f.clientWidth / w;
      if (k > 0) f.style.setProperty('--k', k.toFixed(4))
    })
  }

  function setDev(P, k, scroll) {
    if (!DEVS[k]) return;
    const same = k === P.dev;
    P.dev = k;
    const r = P.root;
    $$('.dev-v', r).forEach(v => v.hidden = v.dataset.dev !== k);
    $$('.dlc[data-dv]', r).forEach(b => {
      const on = b.dataset.dv === k;
      b.classList.toggle('on', on);
      b.setAttribute('aria-selected', on);
      const bt = $('.dlc-b', b);
      if (bt) bt.className = 'btn ' + (on ? 'white' : 'line') + ' sm dlc-b'
    });
    const cap = $('.dlx-cap b', r);
    if (cap) cap.textContent = DVOS[k];
    requestAnimationFrame(() => {
      fitAx(r);
      deskGlobes()
    });
    if (scroll) {
      const st = $('.dlx-top', r);
      if (st) {
        const q = st.getBoundingClientRect();
        if (q.top < 40 || q.bottom > innerHeight + 40) site.goTo(st, !RM)
      }
    }
  }
  try { onDocument('click', e => {
    const b = e.target.closest('[data-page=download] [data-dv]');
    if (!b || !site.APP_P) return;
    setDev(site.APP_P, b.dataset.dv, !e.target.closest('[data-dl]'))
  }); } catch (e) { site.report(e, 'devices') }
  try { onDocument('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const b = e.target.closest && e.target.closest('[data-page=download] .dlc[data-dv]');
    if (!b || !site.APP_P || e.target.closest('button')) return;
    e.preventDefault();
    setDev(site.APP_P, b.dataset.dv, true)
  }); } catch (e) { site.report(e, 'devices') }
  /* footer links open the Download page on that system */
  try { onDocument('click', e => {
    const a = e.target.closest('a[data-pick]');
    if (!a || !site.APP_P) return;
    const k = a.dataset.pick;
    setTimeout(() => setDev(site.APP_P, k, false), 60)
  }); } catch (e) { site.report(e, 'devices') }
  try { addEventListener('resize', () => fitAx()); } catch (e) { site.report(e, 'devices') }
  const SB = {
    sig: '<svg class="sb-sig" viewBox="0 0 18 12" aria-hidden="true"><rect x="0" y="8" width="3" height="4" rx=".7"/><rect x="5" y="5.5" width="3" height="6.5" rx=".7"/><rect x="10" y="3" width="3" height="9" rx=".7"/><rect x="15" y="0" width="3" height="12" rx=".7"/></svg>',
    wifi: '<svg class="sb-wifi" viewBox="0 0 16 12" aria-hidden="true"><path d="M8 11.6 5.7 9.2a3.3 3.3 0 0 1 4.6 0z"/><path d="M8 5.4c1.9 0 3.6.7 4.9 2l-1.5 1.5A5 5 0 0 0 8 7.5a5 5 0 0 0-3.4 1.4L3.1 7.4a7 7 0 0 1 4.9-2z"/><path d="M8 1.2c3 0 5.8 1.2 7.8 3.2l-1.5 1.5A8.8 8.8 0 0 0 8 3.3a8.8 8.8 0 0 0-6.3 2.6L.2 4.4A11 11 0 0 1 8 1.2z"/></svg>',
    bati: '<svg class="sb-bat" viewBox="0 0 27 12" aria-hidden="true"><rect x=".5" y=".5" width="23" height="11" rx="3.4" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="17" height="8" rx="2"/><path d="M25 4v4c.8-.3 1.4-1 1.4-2s-.6-1.7-1.4-2z" opacity=".45"/></svg>',
    tri: '<svg class="sb-tri" viewBox="0 0 12 12" aria-hidden="true"><path d="M12 .5V12H.5z"/></svg>',
    bata: '<svg class="sb-bata" viewBox="0 0 8 13" aria-hidden="true"><rect x="2.5" y="0" width="3" height="1.6" rx=".5"/><rect x="0" y="1.3" width="8" height="11.7" rx="1.6" opacity=".35"/><rect x="0" y="3.6" width="8" height="9.4" rx="1.4"/></svg>'
  };

  function renderPhone(P) {
    const q = city('doh');
    const mk = v => '<div class="mob-r"><div class="pp' + (v ? ' pp-' + v : '') + (P.awake ? ' awake' : '') + '">' + (v ? '' : '<span class="pp-vol" aria-hidden="true"><i></i><i></i></span><button type="button" class="pp-side" aria-label="' + esc(t('phWakeA')) + '" aria-pressed="' + P.awake + '"></button><span class="pp-hint" aria-hidden="true">' + icon('arrow-right') + '<span>' + esc(t('phWake')) + '</span></span>') +
      '<div class="pp-scr"><div class="pp-off"><b class="num">9:41</b><small>' + esc(t('phLock')) + '</small></div><div class="pp-app">' +
      (v === 'and' ? '<div class="pp-status sb-and"><b>12:30</b><span class="island"></span><span class="sb-r">' + SB.wifi + SB.tri + SB.bata + '<em>87%</em></span></div>' +
        '<div class="pp-top ab-and" style="--k:1">' + icon('menu') + '<b>ZeroLag</b><span class="sp"></span><span class="ab-chip"><i class="dot blue"></i>Smart</span><span class="pp-av">AR</span></div>' :
        v === 'ios' ? '<div class="pp-status sb-ios"><b>9:41</b><span class="island"></span><span class="sb-r">' + SB.sig + SB.wifi + SB.bati + '</span></div>' +
        '<div class="pp-top ab-ios" style="--k:1"><span class="pp-av">AR</span><span class="sp"></span><span class="logo sm">' + logo() + '</span><b>ZeroLag</b><span class="sp"></span><span class="ab-btn">' + icon('shield') + '</span></div>' :
        '<div class="pp-status"><b>9:41</b><span class="island"></span><span class="pp-ic"><i></i><i></i><i></i></span></div>' +
        '<div class="pp-top" style="--k:1"><span class="logo sm">' + logo() + '</span><b>ZeroLag</b><span class="sp"></span><span class="pp-av">AR</span></div>') +
      '<h3 class="pp-h" style="--k:2">' + esc(t('homeA')) + '<br>' + esc(t('homeB')) + '</h3>' +
      '<button type="button" class="power pp-pw" style="--k:3" aria-label="' + esc(t('power')) + '"><span class="ring"></span><span class="ring r2"></span>' + icon('power') + '</button>' +
      '<p class="pp-state" style="--k:4"><i class="dot"></i><span class="phs"></span></p>' +
      '<div class="pp-card pp-time" style="--k:5"><small>' + esc(t('connTime')) + '</small><b class="num pht">00:00:00</b><div class="pp-st"><div><small>' + esc(t('sPing')) + '</small><b class="php">—</b></div><div><small>' + esc(t('sJitter')) + '</small><b class="phj">—</b></div><div><small>' + esc(t('sLoad')) + '</small><b>' + N(51) + '%</b></div></div></div>' +
      '<div class="pp-card pp-loc" style="--k:6">' + code('QA') + '<span class="grow"><b>' + esc(coname(q)) + '</b><small>' + esc(cname(q)) + ' · ' + esc(t('smart')) + '</small></span>' + icon('chevron-down', 'pp-chev') + '</div>' +
      (v ? '<nav class="pp-tabs tb-' + v + '" style="--k:7">' + [
          ['home', 'Home'],
          ['globe', 'Locations'],
          ['gamepad', 'Games'],
          ['settings', 'Settings']
        ].map(([ic, l], n) => '<span class="' + (n ? '' : 'on') + '"><i class="tb-i">' + icon(ic) + '</i><small>' + l + '</small></span>').join('') + '</nav>' :
        '<nav class="pp-nav" style="--k:7"><span class="on">' + icon('home') + '</span><span>' + icon('globe') + '</span><button type="button" class="pp-npw" aria-label="' + esc(t('power')) + '">' + icon('power') + '</button><span>' + icon('gamepad') + '</span><span>' + icon('chat') + '</span></nav>') +
      '</div><span class="pp-home"></span></div></div></div>';
    if (P.dev) {
      P.root.innerHTML = devHTML(P, {
        and: mk('and'),
        ios: mk('ios')
      });
      phoneUI(P);
      return
    }
    const phone = mk('');
    P.root.innerHTML = '<div class="mob-side"><div class="head"><span class="eyebrow">' + esc(t('mE')) + '</span><div><h2 class="h2">' + t('mT') + '</h2></div><a class="btn line" href="' + BASE_PATH + '/download">' + esc(t('mBtn')) + '</a></div><div class="mob-pts"><ul>' + ['mL1', 'mL2', 'mL3'].map((k, i) => '<li><span class="n">0' + (i + 1) + '</span><span class="mp"><b>' + esc(t(k)) + '</b><small>' + esc(t('mD' + (i + 1))) + '</small></span></li>').join('') + '</ul></div></div>' + '<div class="mob">' + phone + '</div>';
    phoneUI(P)
  }

  function phWake(P, v) {
    P.awake = v;
    const pp = $('.pp', P.root);
    pp.classList.toggle('awake', v);
    $('.pp-side', P.root).setAttribute('aria-pressed', String(v));
    if (v) {
      pp.classList.add('woke');
    }
    phoneUI(P)
  }

  function phoneUI(P) {
    $$('.pp-pw', P.root).forEach(pw => {
      pw.setAttribute('aria-pressed', String(P.on && !P.busy));
      pw.classList.toggle('busy', P.busy)
    });
    $$('.pp-npw', P.root).forEach(b => b.classList.toggle('on', P.on));
    $$('.phs', P.root).forEach(e => e.textContent = P.busy ? t('pwBusy') : P.on ? t('pwTap') : t('pwTapOn'));
    $$('.pp-state .dot', P.root).forEach(d => d.className = 'dot ' + (P.on && !P.busy ? 'blue' : ''));
    phoneTick(P)
  }

  function phoneTick(P) {
    if (!$('.pht', P.root)) return;
    const on = P.on && !P.busy,
      tm = on ? hms((Date.now() - P.since) / 1000) : N('00:00:00'),
      pg = on ? N(14 + Math.round(rnd() * 3 - 1)) + ' ms' : '—',
      jt = on ? N(1 + Math.round(rnd() * 1)) + ' ms' : '—';
    $$('.pht', P.root).forEach(e => e.textContent = tm);
    $$('.php', P.root).forEach(e => e.textContent = pg);
    $$('.phj', P.root).forEach(e => e.textContent = jt)
  }
  try { site.secs.add(() => site.PHONES.forEach(phoneTick)); } catch (e) { site.report(e, 'devices') }

  function phPower(P, v) {
    if (P.busy) return;
    if (v) {
      P.busy = true;
      phoneUI(P);
      setTimeout(() => {
        P.busy = false;
        P.on = true;
        P.since = Date.now();
        phoneUI(P)
      }, RM ? 0 : 900)
    } else {
      P.on = false;
      phoneUI(P)
    }
  }
}
