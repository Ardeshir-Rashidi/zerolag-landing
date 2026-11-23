// @ts-nocheck — ported 1:1 from the original site script; type it file by file.
import { BASE_PATH } from '@/lib/paths';
import { $, $$, N, RM, clamp, ease, esc, isFa, lerp, pad2, rnd, t } from '../core/util';
import { icon } from '../core/icons';
import { HOME, RELAYS, SERVERS, city, cname, code, coname, game, svCity } from '../core/data';
import { setTimeout, requestAnimationFrame, ResizeObserver } from '../scope';

// Phase 1 (before the yield) shares this feature's functions on the shared site context;
// phase 2 runs its setup code, in the same order as the original single script.
export default function* cells(site: any) {
  Object.assign(site, { bRouteText, renderPick, bHead, bRender, unbFoot, renderBars, profRun, renderShield, renderRace });
  yield;
  /* ================= FEATURE CELLS ================= */
  /* 01 · smart routing: the globe races routes, then locks the fastest, city after city */
  const BCY = ['fra', 'ist', 'doh', 'lon', 'dxb', 'ams'];
  let bI = 0;
  site.bOn = false;
  let bT = 0;
  site.bPhase = 'off';
  site.bGlobe = null;
  try { site.GJOBS.push(() => {
    site.bGlobe = site.mountGlobe($('#bMap'), {
      servers: SERVERS.filter(s => BCY.some(id => city(id).cc === s.cc)),
      selected: 'de',
      city: 'fra',
      status: 'off',
      insets: innerWidth < 760 ? {
        top: 60,
        bottom: 56,
        left: 40,
        right: 60
      } : {
        top: 70,
        bottom: 80,
        left: 70,
        right: 110
      }
    });
    if (site.bOn) {
      clearTimeout(bT);
      bStep()
    }
  }); } catch (e) { site.report(e, 'cells') }

  function bRouteText() {
    const c = city(BCY[bI % BCY.length]);
    $('#bRoute').textContent = ('tehran → ') + cname(c).toLowerCase() + ' · ' + N(c.p) + ' ms'
  }

  function bRoutes(c) {
    const Z = window.ZeroLagMap;
    let r = [];
    if (Z && Z.routesFor) r = Z.routesFor({
      lon: HOME.lon,
      lat: HOME.lat
    }, {
      lon: c.lon,
      lat: c.lat
    }, RELAYS).map(x => ({
      n: x.via ? (isFa() ? x.via.name.fa : x.via.name.en) : t('backbone'),
      ms: Z.msr(x.total)
    }));
    if (!r.length) r = [{
      n: t('backbone'),
      ms: c.p
    }];
    r = r.slice(0, 3);
    const isp = Math.round(Math.max(...r.map(x => x.ms)) * 2.2 + 28);
    r.push({
      n: t('rtDirect'),
      ms: isp,
      isp: 1
    });
    return r
  }

  function renderPick() {
    $('#bPick').innerHTML = BCY.map((id, i) => {
      const c = city(id);
      return '<button type="button" role="tab" class="' + (i === bI % BCY.length ? 'on' : '') + '" data-i="' + i + '">' + code(c.cc, 'xs') + '<span>' + esc(cname(c)) + '</span></button>'
    }).join('')
  }

  function bHead() {
    const c = city(BCY[bI % BCY.length]);
    $('#bFlag').src = BASE_PATH + '/img/f/' + c.cc + '.webp';
    $('#bCity').textContent = cname(c);
    $('#bCo').textContent = coname(c);
    $$('#bPick button').forEach((b, i) => b.classList.toggle('on', i === bI % BCY.length))
  }

  function bRender(phase) {
    site.bPhase = phase;
    const c = city(BCY[bI % BCY.length]);
    const R = bRoutes(c);
    const mx = Math.max(...R.map(r => r.ms));
    let w = 0;
    R.forEach((r, i) => {
      if (!r.isp && r.ms < R[w].ms) w = i
    });
    $('#bRows').innerHTML = R.map((r, i) => {
      const win2 = phase === 'on' && i === w;
      return '<div class="rr' + (r.isp ? ' isp' : '') + (win2 ? ' win' : '') + '"><span class="nm">' + esc(r.n) + (win2 ? ' <span class="badge">' + esc(t('fastest2')) + '</span>' : '') + '</span><span class="tr"><i style="width:' + (phase === 'off' ? 0 : (r.ms / mx * 100).toFixed(1)) + '%;transition-duration:' + (phase === 'connecting' ? (500 + r.ms * 12) : 0) + 'ms"></i></span><span class="v">' + (phase === 'off' ? '—' : N(r.ms)) + ' ms</span></div>'
    }).join('');
    const isp = R[R.length - 1].ms,
      best = R[w].ms;
    $('#bSum').innerHTML = '<div><small>' + esc(t('rtDirect')) + '</small><b class="num dim">' + (phase === 'off' ? '—' : N(isp)) + '<em>ms</em></b></div><div><small>ZeroLag</small><b class="num">' + (phase === 'on' ? N(best) : '—') + '<em>ms</em></b></div><span class="pct' + (phase === 'on' ? ' on' : '') + '">−' + N(Math.round((1 - best / isp) * 100)) + '%</span>';
    const st = $('#bSt');
    st.className = 'rp-st ' + phase;
    st.innerHTML = (phase === 'on' ? '<i class="dot blue"></i>' : phase === 'connecting' ? '<i class="spin"></i>' : '<i class="dot"></i>') + '<span>' + esc(t(phase === 'on' ? 'rtLocked' : phase === 'connecting' ? 'rtTesting' : 'rtIdle')) + '</span>'
  }

  function bStep() {
    if (!site.bOn || !site.bGlobe) return;
    const c = city(BCY[bI % BCY.length]);
    bRouteText();
    bHead();
    site.bGlobe.select(c.cc.toLowerCase(), c.id);
    site.bGlobe.setStatus('off');
    bRender('off');
    bT = setTimeout(() => {
      if (!site.bOn) return;
      site.bGlobe.setStatus('connecting');
      requestAnimationFrame(() => requestAnimationFrame(() => bRender('connecting')));
      bT = setTimeout(() => {
        if (!site.bOn) return;
        site.bGlobe.setStatus('on');
        bRender('on');
        bT = setTimeout(() => {
          bI++;
          bStep()
        }, 4200)
      }, 2600)
    }, 700)
  }
  try { $('#bPick').addEventListener('click', e => {
    const b = e.target.closest('[data-i]');
    if (!b) return;
    clearTimeout(bT);
    bI = +b.dataset.i;
    bStep()
  }); } catch (e) { site.report(e, 'cells') }
  try { site.onView($('#bMap'), v => {
    if (v && !site.bOn) {
      site.bOn = true;
      bStep()
    } else if (!v && site.bOn) {
      site.bOn = false;
      clearTimeout(bT)
    }
  }); } catch (e) { site.report(e, 'cells') }
  /* 02 · sanctions bypass terminal */
  const UNB = ['api.riotgames.com', 'launcher.store.epicgames.com', 'registry-1.docker.io', 'www.figma.com', 'dl.google.com/android/studio', 'store.playstation.com', 'gemini.google.com', 'gitlab.com', 'us.battle.net/login', 'console.cloud.google.com'];
  let unbI = 0,
    unbN = 0,
    unbOn = false,
    unbTimer = 0;
  let term;
  try { term = $('#unblockTerm'); } catch (e) { site.report(e, 'cells') }

  function unbFoot() {
    let f = $('.foot', term);
    if (!f) {
      f = document.createElement('div');
      f.className = 'foot';
      term.appendChild(f)
    }
    f.innerHTML = '<span>edge · tehran</span><b dir="auto">' + N(unbN) + ' ' + esc(t('unblocked')) + '</b>'
  }

  function unbStep() {
    if (!unbOn) return;
    const host = UNB[unbI % UNB.length];
    unbI++;
    const row = document.createElement('div');
    row.className = 'tl';
    row.innerHTML = '<span class="m">GET</span><span class="h">' + esc(host) + '</span><span class="st">···</span>';
    term.insertBefore(row, $('.foot', term));
    requestAnimationFrame(() => row.classList.add('show'));
    const rows = $$('.tl', term);
    if (rows.length > 4) {
      const old = rows[0];
      old.classList.remove('show');
      setTimeout(() => old.remove(), 380)
    }
    const st = $('.st', row);
    setTimeout(() => {
      st.className = 'st bad';
      st.textContent = '403'
    }, 420);
    setTimeout(() => {
      st.className = 'st ok';
      st.innerHTML = '<i class="dot"></i>200';
      unbN++;
      unbFoot()
    }, 1250);
    unbTimer = setTimeout(unbStep, 1700)
  }
  try { unbFoot(); } catch (e) { site.report(e, 'cells') }
  try { site.onView(term, v => {
    if (v && !unbOn) {
      unbOn = true;
      unbStep()
    } else if (!v) {
      unbOn = false;
      clearTimeout(unbTimer)
    }
  }); } catch (e) { site.report(e, 'cells') }
  /* 03 · live ping */
  const spark = [];
  try { for (let i = 0; i < 30; i++) spark.push(14 + Math.round(rnd() * 4 - 2)); } catch (e) { site.report(e, 'cells') }
  let perfShown = false;

  function drawSpark() {
    const s = $('#spark');
    const W = s.clientWidth || 160,
      Hh = s.clientHeight || 70;
    s.setAttribute('viewBox', '0 0 ' + W + ' ' + Hh);
    const mn = 8,
      mx = 22;
    const pts = spark.map((v, i) => [i / (spark.length - 1) * W, Hh - (v - mn) / (mx - mn) * Hh]);
    const d = pts.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join('');
    const l = pts[pts.length - 1];
    s.innerHTML = '<path d="' + d + '" fill="none" stroke="#ededed" stroke-width="1.5" stroke-linejoin="round"/><circle cx="' + l[0] + '" cy="' + l[1] + '" r="3" fill="#3291ff"/>'
  }
  try { new ResizeObserver(drawSpark).observe($('#spark')); } catch (e) { site.report(e, 'cells') }
  try { site.onView($('#cPerf'), v => {
    if (!v || perfShown) return;
    perfShown = true;
    const el = $('#perfN');
    const t0 = performance.now();
    const run = now => {
      const k = clamp((now - t0) / 1400, 0, 1);
      el.textContent = N(Math.round(lerp(96, 14, ease(k))));
      if (k < 1) requestAnimationFrame(run)
    };
    RM ? el.textContent = N(14) : requestAnimationFrame(run)
  }); } catch (e) { site.report(e, 'cells') }
  try { site.secs.add(() => {
    if (!perfShown) return;
    const v = 14 + Math.round(rnd() * 4 - 2);
    spark.push(v);
    spark.shift();
    $('#perfN').textContent = N(v);
    drawSpark()
  }); } catch (e) { site.report(e, 'cells') }
  /* 04 · 24h bars with the peak in blue */
  const BD = [];
  try { for (let h = 0; h < 24; h++) {
    const pk = Math.sin((h - 6) / 24 * Math.PI * 2);
    BD.push(Math.round(38 + pk * 22 + rnd() * 10))
  } } catch (e) { site.report(e, 'cells') }
  let PK;
  try { PK = BD.indexOf(Math.max(...BD)); } catch (e) { site.report(e, 'cells') }

  function renderBars() {
    const mx = Math.max(...BD) * 1.15;
    $('#bars').innerHTML = BD.map((v, i) => '<button type="button" class="' + (i === PK ? 'pk' : '') + '" style="--i:' + i + ';--h:' + (v / mx * 100).toFixed(1) + '%" aria-label="' + pad2(i) + ':00 ' + v + '%"></button>').join('') + '<span class="lbl" style="left:' + ((PK + .5) / 24 * 100).toFixed(1) + '%;--h:' + (BD[PK] / mx * 100).toFixed(1) + '%">' + esc(t('peak')) + ' · ' + N(pad2(PK) + ':00') + '</span>'
  }
  try { site.onView($('#cBars'), v => {
    if (v) $('#cBars').classList.add('go')
  }); } catch (e) { site.report(e, 'cells') }
  /* 05 · game profile typing */
  const PROF = ['val', 'cs2', 'fn', 'lol', 'apex', 'dota'];
  let profI = 0;
  site.profOn = false;
  site.profTimer = 0;

  function profLines(g) {
    const c = svCity(g);
    return [
      ['', '// ' + t('pfLabel')],
      ['g', g.n.toUpperCase()],
      ['lk', t('pfRoute') + ' → ' + cname(c).toLowerCase() + ' · ' + N(g.a) + ' ms'],
      ['ok', '✓ ' + t('pfReady')]
    ]
  }

  function profRun() {
    if (!site.profOn) return;
    const g = game(PROF[profI % PROF.length]);
    profI++;
    const img = $('#profImg');
    img.style.opacity = 0;
    setTimeout(() => {
      img.src = BASE_PATH + '/img/g/' + g.id + '.webp';
      img.style.opacity = 1
    }, 250);
    const lines = profLines(g);
    const box = $('#profT');
    let li = 0,
      ci = 0;
    const step = () => {
      if (!site.profOn) return;
      let html = '';
      for (let i = 0; i < lines.length; i++) {
        if (i < li) html += '<div class="' + lines[i][0] + '">' + esc(lines[i][1]) + '</div>';
        else if (i === li) html += '<div class="' + lines[i][0] + '">' + esc(lines[i][1].slice(0, ci)) + '<span class="caret"></span></div>'
      }
      box.innerHTML = html;
      if (li >= lines.length) {
        site.profTimer = setTimeout(profRun, 2600);
        return
      }
      ci += 2;
      if (ci > lines[li].length) {
        li++;
        ci = 0;
        site.profTimer = setTimeout(step, 160)
      } else site.profTimer = setTimeout(step, 22)
    };
    if (RM) {
      box.innerHTML = lines.map(l => '<div class="' + l[0] + '">' + esc(l[1]) + '</div>').join('');
      return
    }
    step()
  }
  try { site.onView($('#profT'), v => {
    if (v && !site.profOn) {
      site.profOn = true;
      profRun()
    } else if (!v) {
      site.profOn = false;
      clearTimeout(site.profTimer)
    }
  }); } catch (e) { site.report(e, 'cells') }
  /* 06 · shield */
  const SH = [
    ['shield', 'sh1', true],
    ['lock', 'sh2', true],
    ['settings', 'sh3', false]
  ];

  function renderShield() {
    $('#shieldOpts').innerHTML = SH.map((o, i) => '<button type="button" class="opt" role="switch" aria-checked="' + o[2] + '" data-i="' + i + '">' + icon(o[0]) + '<span class="grow">' + esc(t(o[1])) + '</span><span class="tg"></span></button>').join('')
  }
  try { $('#shieldOpts').addEventListener('click', e => {
    const b = e.target.closest('.opt');
    if (!b) return;
    const o = SH[+b.dataset.i];
    o[2] = !o[2];
    b.setAttribute('aria-checked', String(o[2]))
  }); } catch (e) { site.report(e, 'cells') }
  /* 07 · ping test race */
  const RACE = ['doh', 'ruh', 'fra', 'mow', 'ams', 'lon', 'dxb', 'ist'];
  let raceVals = {},
    raceRunning = false,
    raceDone = false;

  function renderRace() {
    $('#race').innerHTML = RACE.map(id => {
      const c = city(id);
      return '<div class="rr" data-id="' + id + '"><span class="nm">' + code(c.cc, 'sm') + esc(cname(c)) + ' <span class="badge">' + esc(t('fastest')) + '</span></span><span class="tr"><i></i></span><span class="v">— ms</span></div>'
    }).join('');
    if (raceDone) paintRace(true)
  }

  function paintRace(instant) {
    const mx = Math.max(...Object.values(raceVals));
    let w = null;
    Object.entries(raceVals).forEach(([id, v]) => {
      if (!w || v < raceVals[w]) w = id
    });
    $$('#race .rr').forEach(r => {
      const v = raceVals[r.dataset.id];
      const bar = $('.tr i', r);
      if (instant) bar.style.transition = 'none';
      bar.style.width = (v / mx * 100).toFixed(1) + '%';
      $('.v', r).textContent = N(v) + ' ms';
      r.classList.toggle('win', r.dataset.id === w);
      if (instant) requestAnimationFrame(() => bar.style.transition = '')
    })
  }

  function runRace() {
    if (raceRunning) return;
    raceRunning = true;
    raceDone = false;
    RACE.forEach(id => {
      raceVals[id] = Math.max(6, Math.round(city(id).p * (.85 + rnd() * .3)))
    });
    const mx = Math.max(...Object.values(raceVals));
    $$('#race .rr').forEach(r => {
      r.classList.remove('win');
      const bar = $('.tr i', r);
      bar.style.transition = 'none';
      bar.style.width = '0';
      $('.v', r).textContent = '— ms'
    });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      let left = RACE.length;
      $$('#race .rr').forEach(r => {
        const v = raceVals[r.dataset.id];
        const dur = RM ? 0 : 300 + v * 26;
        const bar = $('.tr i', r);
        bar.style.transition = 'width ' + dur + 'ms cubic-bezier(.2,.7,.1,1)';
        bar.style.width = (v / mx * 100).toFixed(1) + '%';
        const t0 = performance.now();
        const vEl = $('.v', r);
        const cnt = now => {
          const k = clamp((now - t0) / Math.max(1, dur), 0, 1);
          vEl.textContent = N(Math.round(v * k)) + ' ms';
          if (k < 1) requestAnimationFrame(cnt);
          else if (--left === 0) {
            raceRunning = false;
            raceDone = true;
            paintRace(false)
          }
        };
        requestAnimationFrame(cnt)
      })
    }))
  }
  try { $('#testBtn').addEventListener('click', runRace); } catch (e) { site.report(e, 'cells') }
  try { site.onView($('#race'), v => {
    if (v && !raceDone && !raceRunning) runRace()
  }); } catch (e) { site.report(e, 'cells') }
  try { site.onView($('#cDns'), v => {
    if (v) $('#cDns').classList.add('go')
  }); } catch (e) { site.report(e, 'cells') }
}
