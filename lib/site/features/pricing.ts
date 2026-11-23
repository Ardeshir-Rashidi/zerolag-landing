// @ts-nocheck — ported 1:1 from the original site script; type it file by file.
import { $, $$, N, RM, esc, t } from '../core/util';
import { icon } from '../core/icons';
import { setInterval } from '../scope';
import { T } from '../i18n';

// Phase 1 (before the yield) shares this feature's functions on the shared site context;
// phase 2 runs its setup code, in the same order as the original single script.
export default function* pricing(site: any) {
  Object.assign(site, { renderPlans, renderBill, renderTwins, renderCmp });
  yield;
  /* ================= PLANS / PRICING ================= */
  let cyc = 'm';
  const PLANS = [{
    n: 'Starter',
    d: 'pd1',
    m: 0,
    y: 0,
    inc: 'pInc0',
    l: [
      ['zap', 'pf1a'],
      ['monitor', 'pf1b'],
      ['lock', 'pf1c'],
      ['globe', 'pf1d'],
      ['users', 'pf1e']
    ],
    c: 'getStarted',
    s: 'line'
  }, {
    n: 'Pro',
    d: 'pd2',
    m: 5,
    y: 4,
    inc: 'inc2',
    l: [
      ['phone', 'pf2b'],
      ['gamepad', 'pf2c'],
      ['globe', 'pf2d'],
      ['zap', 'pf2e']
    ],
    c: 'choosePro',
    s: 'white',
    pop: 1
  }, {
    n: 'Team',
    d: 'pd3',
    m: 15,
    y: 12,
    inc: 'inc3',
    l: [
      ['users', 'pf3b'],
      ['key', 'pf3c'],
      ['chart', 'pf3d'],
      ['chat', 'pf3e']
    ],
    c: 'chooseTeam',
    s: 'line'
  }];
  const billed = p => p.m === 0 ? t('free4ever') : cyc === 'y' ? t('billedY', {
    n: p.y * 12
  }) : t('billedM');

  function plansHTML() {
    return '<div class="pgrid">' + PLANS.map(p => '<div class="pc' + (p.pop ? ' pop' : '') + '"><h3>' + p.n + (p.pop ? '<span class="pt">' + esc(t('popular')) + '</span>' : '') + '</h3><div class="price"><span class="n"><span>$' + (cyc === 'y' ? p.y : p.m) + '</span></span><span class="per">' + esc(t('perMo')) + '</span></div><p class="billed">' + esc(billed(p)) + '</p><p class="desc">' + esc(t(p.d)) + '</p><hr>' + (p.inc ? '<p class="inc">' + esc(t(p.inc)) + '</p>' : '') + '<ul>' + p.l.map(f => '<li>' + icon(f[0]) + '<span>' + esc(t(f[1])) + '</span></li>').join('') + '</ul><span class="gap"></span><button type="button" class="btn ' + p.s + '" data-plan>' + esc(t(p.c)) + '</button></div>').join('') + '</div>'
  }

  function renderPlans() {
    $$('[data-slot=plans]').forEach(s => s.innerHTML = plansHTML())
  }

  function renderBill() {
    $('#bill').innerHTML = '<button type="button" class="' + (cyc === 'm' ? 'on' : '') + '" data-cyc="m">' + esc(t('monthly')) + '</button><button type="button" class="' + (cyc === 'y' ? 'on' : '') + '" data-cyc="y">' + esc(t('yearly')) + ' <span class="save">' + esc(t('save20')) + '</span></button>'
  }

  function setCyc(c) {
    if (c === cyc) return;
    cyc = c;
    renderBill();
    cmpPrices();
    $$('.pgrid').forEach(g => $$('.pc', g).forEach((el, i) => {
      const p = PLANS[i];
      const sp = $('.n span', el);
      const nv = '$' + (c === 'y' ? p.y : p.m);
      if (sp.textContent !== nv) {
        if (!RM && sp.animate) {
          sp.animate([{
            transform: 'none',
            opacity: 1
          }, {
            transform: 'translateY(-100%)',
            opacity: 0
          }], {
            duration: 180,
            easing: 'ease-in'
          }).onfinish = () => {
            sp.textContent = nv;
            sp.animate([{
              transform: 'translateY(100%)',
              opacity: 0
            }, {
              transform: 'none',
              opacity: 1
            }], {
              duration: 320,
              easing: 'cubic-bezier(.2,.7,.1,1)'
            })
          }
        } else sp.textContent = nv
      }
      $('.billed', el).textContent = billed(p)
    }))
  }
  try { $('#bill').addEventListener('click', e => {
    const b = e.target.closest('[data-cyc]');
    if (b) setCyc(b.dataset.cyc)
  }); } catch (e) { site.report(e, 'pricing') }
  const ENC = ['DNS over HTTPS', 'DNS over TLS', 'DNSSEC', 'IPv6'];
  let encI = 0;

  function renderTwins() {
    $('#twEnc').innerHTML = '<div class="encvz">' + ENC.map((e, i) => '<div class="' + (i <= encI ? 'on' : '') + '">' + icon('lock') + '<span>' + e + '</span><span>' + (i <= encI ? 'on' : '—') + '</span></div>').join('') + '</div>';
    $('#twDev').innerHTML = '<div class="devvz">' + [
      ['Starter', 1],
      ['Pro', 5],
      ['Team', 15]
    ].map((p, k) => '<div class="col' + (k === 1 ? ' pop' : '') + '"><div class="stk">' + Array.from({
      length: 15
    }, (_, i) => '<i style="--i:' + i + '" class="' + (i < p[1] ? 'on' : '') + '"></i>').join('') + '</div><small>' + p[0] + ' · ' + N(p[1]) + '</small></div>').join('') + '</div>'
  }
  try { setInterval(() => {
    if (document.hidden || !$('#twEnc').offsetParent) return;
    encI = (encI + 1) % (ENC.length + 2);
    $$('#twEnc .encvz div').forEach((d, i) => {
      const on = i <= encI && encI < ENC.length + 1;
      d.classList.toggle('on', on || encI >= ENC.length);
      $('span:last-child', d).textContent = (on || encI >= ENC.length) ? 'on' : '—'
    })
  }, 900); } catch (e) { site.report(e, 'pricing') }
  try { site.onView($('#twDev'), v => {
    if (v) $('#twDev').classList.add('go')
  }); } catch (e) { site.report(e, 'pricing') }
  const CMP = [
    ['globe', 'cg1', 'cg1p', [
      ['c1', ['1', '5', '15']],
      ['c2', ['y', 'y', 'y']],
      ['c4', ['v_std', 'v_allr', 'v_allr']]
    ]],
    ['gamepad', 'cg2', 'cg2p', [
      ['c3', ['v_ess', 'v_allp', 'v_allp']],
      ['q4x', ['y', 'y', 'y']]
    ]],
    ['chart', 'cg3', 'cg3p', [
      ['c5', ['—', 'v_pers', 'v_team']],
      ['c6', ['v_comm', 'v_prio', 'v_team']]
    ]]
  ];
  try { T.q4x = ['Sanctions bypass']; } catch (e) { site.report(e, 'pricing') }
  const cv = v => v === 'y' ? icon('check') : v === '—' ? '<span class="no">—</span>' : v.startsWith('v_') ? esc(t(v)) : N(v);

  function cmpPrices() {
    $$('.cmp-head [data-pp]').forEach(e => {
      const p = PLANS[+e.dataset.pp];
      e.textContent = '$' + (cyc === 'y' ? p.y : p.m) + ' / mo'
    })
  }

  function renderCmp() {
    cmpPrices();
    const q = '';
    let any = false;
    $('#cmpBody').innerHTML = CMP.map(g => {
      const rows = g[3].filter(r => !q || t(r[0]).toLowerCase().includes(q) || T[r[0]].join(' ').toLowerCase().includes(q));
      if (!rows.length) return '';
      any = true;
      return '<div class="cgroup"><h3>' + icon(g[0]) + esc(t(g[1])) + '</h3><p>' + esc(t(g[2])) + '</p>' + rows.map(r => '<div class="crow"><span>' + esc(t(r[0])) + '</span>' + r[1].map(v => '<span>' + cv(v) + '</span>').join('') + '</div>').join('') + '</div>'
    }).join('') + (any ? '' : '<p class="cempty">' + esc(t('noFeat', {
      q
    })) + '</p>')
  }
}
