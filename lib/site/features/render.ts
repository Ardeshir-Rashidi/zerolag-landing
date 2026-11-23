// @ts-nocheck — ported 1:1 from the original site script; type it file by file.
import { $, $$, L, RM, clamp, isFa, t } from '../core/util';
import { C } from '../core/data';
import { requestAnimationFrame, IntersectionObserver, ResizeObserver, addEventListener } from '../scope';

// Phase 1 (before the yield) shares this feature's functions on the shared site context;
// phase 2 runs its setup code, in the same order as the original single script.
export default function* render(site: any) {
  Object.assign(site, { applyLang, frameUp, goTo, blockReveal, frameDraw });
  yield;
  /* ================= language + render all ================= */
  try { site.onView($('#gMq'), v => {
    if (v && !site.mqSeen) {
      site.mqSeen = true;
      site.renderMarquees()
    }
  }, '500px'); } catch (e) { site.report(e, 'render') }

  function renderAll() {
    try { site.heroList(); } catch (e) { site.report(e, 'renderAll') }
    try { site.heroUI(); } catch (e) { site.report(e, 'renderAll') }
    try { site.bRouteText(); } catch (e) { site.report(e, 'renderAll') }
    try { site.renderPick(); } catch (e) { site.report(e, 'renderAll') }
    try { site.bHead(); } catch (e) { site.report(e, 'renderAll') }
    try { site.bRender(site.bGlobe ? (site.bPhase === 'connecting' ? 'on' : site.bPhase) : 'off'); } catch (e) { site.report(e, 'renderAll') }
    try { site.unbFoot(); } catch (e) { site.report(e, 'renderAll') }
    try { site.renderBars(); } catch (e) { site.report(e, 'renderAll') }
    try { site.renderShield(); } catch (e) { site.report(e, 'renderAll') }
    try { site.renderRace(); } catch (e) { site.report(e, 'renderAll') }
    try { site.renderStats(); } catch (e) { site.report(e, 'renderAll') }
    try { site.renderDb(); } catch (e) { site.report(e, 'renderAll') }
    try { site.renderTree(); } catch (e) { site.report(e, 'renderAll') }
    try { site.renderTrace(); } catch (e) { site.report(e, 'renderAll') }
    try { site.setStep(site.step); } catch (e) { site.report(e, 'renderAll') }
    try { site.PHONES.forEach(site.renderPhone); } catch (e) { site.report(e, 'renderAll') }
    try { site.renderMarquees(); } catch (e) { site.report(e, 'renderAll') }
    try { site.drawRings(); } catch (e) { site.report(e, 'renderAll') }
    try { site.renderDl(); } catch (e) { site.report(e, 'renderAll') }
    try { site.renderCodes(); } catch (e) { site.report(e, 'renderAll') }
    try { site.renderPlans(); } catch (e) { site.report(e, 'renderAll') }
    try { site.renderBill(); } catch (e) { site.report(e, 'renderAll') }
    try { site.renderTwins(); } catch (e) { site.report(e, 'renderAll') }
    try { site.renderCmp(); } catch (e) { site.report(e, 'renderAll') }
    try { site.renderFaq(); } catch (e) { site.report(e, 'renderAll') }
    try { site.renderSlots(); } catch (e) { site.report(e, 'renderAll') }
    try { site.renderGamesPage(); } catch (e) { site.report(e, 'renderAll') }
    try { site.renderAppsPage(false); } catch (e) { site.report(e, 'renderAll') }
    try { site.renderLocPage(); } catch (e) { site.report(e, 'renderAll') }
    try { site.renderFigs(); } catch (e) { site.report(e, 'renderAll') }
    try { site.renderTopics(); } catch (e) { site.report(e, 'renderAll') }
    try { $('#chartT').textContent = t('chartT', {
      d: site.LCd
    }); } catch (e) { site.report(e, 'renderAll') }
    try { site.drawLine(); } catch (e) { site.report(e, 'renderAll') }
    try { site.drawFlow(); } catch (e) { site.report(e, 'renderAll') }
    try { site.GLOBES.forEach(g => g && g.setLang(L)); } catch (e) { site.report(e, 'renderAll') }
    try { if (site.profOn) {
      clearTimeout(site.profTimer);
      site.profRun()
    } } catch (e) { site.report(e, 'renderAll') }
  }

  function applyLang() {
    const h = document.documentElement;
    try { h.lang = L; } catch (e) { site.report(e, 'applyLang') }
    try { h.dir = isFa() ? 'rtl' : 'ltr'; } catch (e) { site.report(e, 'applyLang') }
    try { $$('[data-t]').forEach(el => {
      const text = t(el.dataset.t, { n: C.length });
      // Keep the server-rendered headline spans instead of rebuilding them at hydration.
      if (el.textContent !== text) {
        el.textContent = text;
        const heading = el.closest('[data-words]');
        if (heading) heading.dataset.split = '';
      }
    }); } catch (e) { site.report(e, 'applyLang') }
    try { $$('[data-th]').forEach(el => {
      el.innerHTML = t(el.dataset.th);
      el.dataset.split = ''
    }); } catch (e) { site.report(e, 'applyLang') }
    try { $$('[data-tp]').forEach(el => el.placeholder = t(el.dataset.tp, {
      n: C.length
    })); } catch (e) { site.report(e, 'applyLang') }
    try { $$('[data-ta]').forEach(el => el.setAttribute('aria-label', t(el.dataset.ta))); } catch (e) { site.report(e, 'applyLang') }
    try { renderAll(); } catch (e) { site.report(e, 'applyLang') }
    try { site.words(); } catch (e) { site.report(e, 'applyLang') }
    try { $$('[data-words]').forEach(el => {
      if (!el.closest('.hero-head') && el.classList.contains('in')) {
        el.classList.remove('in');
        requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')))
      }
    }); } catch (e) { site.report(e, 'applyLang') }
    try { site.watchReveal() } catch (e) { site.report(e, 'applyLang') }
  }

  function frameUp() {
    /* frame system: loose heads → .head, boxes/grids → .fbw, split sections → .vs */
    $$('.page .wrap').forEach(w => {
      const a = w.firstElementChild;
      if (!a || !a.matches('.eyebrow') || !a.nextElementSibling || !a.nextElementSibling.matches('h2')) return;
      const h = document.createElement('div');
      h.className = 'head';
      const d = document.createElement('div');
      w.insertBefore(h, a);
      h.appendChild(a);
      h.appendChild(d);
      let n = h.nextElementSibling;
      while (n && n.matches('h2,p.sub')) {
        const x = n.nextElementSibling;
        d.appendChild(n);
        n = x
      }
    });
    $$('.page .head').forEach(h => {
      const ds = [...h.children].filter(c => c.tagName === 'DIV');
      if (ds.length > 1) ds[ds.length - 1].classList.add('head-r')
    });
    const CG = ['.mk-grid', '.stats', '.codes', '.flist', '.figs', '.cells', '.pgrid', '.dl4', '.twin'];
    $$(['[data-slot=plans]', '.std', '.rpanel', '.rings', '.dlx-top', '.netmap', '.rtable', '.cmpv', ...CG].map(c => '.page ' + c).join(',')).forEach(b => {
      if (b.closest('.fbw')) return;
      let t = b;
      while (t.parentElement && !t.parentElement.matches('.wrap,section') && t.parentElement.children.length === 1) t = t.parentElement;
      if (!t.parentElement || !t.parentElement.matches('.wrap,section')) return;
      b.classList.add('fb');
      if (b.matches(CG.join(','))) b.classList.add('cg');
      const w = document.createElement('div');
      w.className = 'fbw';
      t.parentNode.insertBefore(w, t);
      w.appendChild(t)
    });
    $$('.page>section').forEach(s => {
      if (s.classList.contains('chap')) return;
      if (s.matches('.phero,.prhero,.story2,.ct') || s.querySelector(':scope>.wrap>.why')) s.classList.add('vs')
    });
  }
  /* sticky-safe scrolling helpers */
  function staticTop(el) {
    return el.getBoundingClientRect().top + scrollY
  }

  function goTo(el, smooth, center) {
    const nav = $('.nav'),
      nh = nav ? nav.offsetHeight : 0;
    let y = staticTop(el) - nh;
    if (center) y -= Math.max(0, (innerHeight - nh - el.offsetHeight) / 2);
    scrollTo({
      top: Math.max(0, y),
      behavior: smooth ? 'smooth' : 'auto'
    })
  }
  /* block reveal (Linear / Jimo): the section's frame fades in, its eyebrow, headline (word by word) and lead come out of a soft blur,
     then each box rises into place as it reaches the screen; boxes arriving together are staggered. One shot, never scroll-linked. */
  function blockReveal() {
    if (RM || !window.IntersectionObserver) return;
    const S = $$('.page>section:not(.hero):not(.phero):not(.prhero):not(.devhero)'),
      TX = '.head,.eyebrow,h2,h3,.lead';
    S.forEach(s => {
      s.classList.add('rvl');
      const root = s.querySelector(':scope>.wrap') || s;
      const box = el => el.classList.add('ru', 'rb');
      const walk = (par, deep) => [...par.children].forEach(c => {
        if (c.matches(TX)) return;
        if (c.classList.contains('fbw')) {
          [...c.children].forEach(b => b.classList.contains('cg') ? [...b.children].forEach(box) : box(b));
          return
        }
        if (!deep && c.querySelector(TX)) {
          walk(c, true);
          return
        }
        box(c)
      });
      walk(root, false);
      let ti = 0;
      root.querySelectorAll('.eyebrow,h2,.lead,.head-r>*').forEach(el => {
        if (el.closest('.rb,.ru')) return;
        if (el.tagName === 'H2' && el.id !== 'chartT') {
          el.classList.add('wd');
          el.setAttribute('data-words', '');
          el.style.setProperty('--wd0', (ti * 80 + 40) + 'ms');
          ti += 2;
          return
        }
        el.classList.add('ru', 'rt');
        el.style.setProperty('--ri', ti++)
      })
    });
    site.words();
    const io = new IntersectionObserver(es => {
      const now = new Set();
      let k = 0;
      es.forEach(e => {
        const t = e.target;
        if (e.isIntersecting && t.classList.contains('rvl')) {
          t.classList.add('in');
          now.add(t);
          io.unobserve(t)
        }
      });
      es.forEach(e => {
        const t = e.target;
        if (!e.isIntersecting || !t.classList.contains('rb')) return;
        const fresh = now.has(t.closest('.rvl'));
        t.style.setProperty('--rd', ((fresh ? .3 : 0) + Math.min(k++, 7) * .075).toFixed(3) + 's');
        t.classList.add('in');
        io.unobserve(t)
      })
    }, {
      rootMargin: '0px 0px -6% 0px',
      threshold: 0
    });
    S.forEach(s => {
      io.observe(s);
      s.querySelectorAll('.rb').forEach(b => io.observe(b))
    });
    addEventListener('scroll', () => {
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) S.forEach(s => {
        if (s.offsetParent === null) return;
        s.classList.add('in');
        s.querySelectorAll('.rb').forEach(b => b.classList.add('in'))
      })
    }, {
      passive: true
    })
  }
  /* home: each block's frame is drawn by the scroll. Two strokes leave the top centre, run round the corners and down the sides and meet
     at the bottom centre; as the block leaves, the same strokes are wiped in the same direction, while the next block draws in. */
  function frameDraw() {
    const home = $('.page[data-page=home]');
    if (!home) return;
    const NS = 'http://www.w3.org/2000/svg';
    const S = $$(':scope>section:not(.hero)', home).filter(s => getComputedStyle(s, '::before').display !== 'none' && getComputedStyle(s, '::before').backgroundImage !== 'none');
    if (!S.length) return;
    if (!$('#fdDefs')) {
      const d = document.createElementNS(NS, 'svg');
      d.id = 'fdDefs';
      d.setAttribute('width', '0');
      d.setAttribute('height', '0');
      d.style.position = 'absolute';
      d.innerHTML = '<defs><linearGradient id="fdExtL" x1="1" x2="0" y1="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><linearGradient id="fdExtR" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>';
      document.body.appendChild(d)
    }
    const F = S.map(s => {
      s.classList.add('fdh');
      const w = document.createElement('div');
      w.className = 'fdraw';
      w.setAttribute('aria-hidden', 'true');
      w.innerHTML = '<svg><rect class="fdx" height="1"/><rect class="fdx fdxr" height="1"/><rect class="fdx" height="1"/><rect class="fdx fdxr" height="1"/><path class="fdl" pathLength="1"/><path class="fdl" pathLength="1"/><rect class="fdq" width="7" height="7"/><rect class="fdq" width="7" height="7"/><rect class="fdq" width="7" height="7"/><rect class="fdq" width="7" height="7"/></svg>';
      s.appendChild(w);
      return {
        s,
        w,
        ln: $$('.fdl', w),
        ext: $$('.fdx', w),
        q: $$('.fdq', w),
        W: 0,
        H: 0,
        a: 0,
        b: 0,
        ta: 0,
        tb: 0,
        k: [0, 0],
        lit: false
      }
    });
    F[F.length - 1].last = true;
    const geo = f => {
      const W = f.w.clientWidth,
        H = f.w.clientHeight;
      if (!W || !H) return;
      f.W = W;
      f.H = H;
      const x0 = .5,
        x1 = W - .5,
        y0 = .5,
        y1 = H - .5,
        cx = W / 2;
      f.ln[0].setAttribute('d', 'M' + cx + ' ' + y0 + 'H' + x0 + 'V' + y1 + 'H' + cx);
      f.ln[1].setAttribute('d', 'M' + cx + ' ' + y0 + 'H' + x1 + 'V' + y1 + 'H' + cx);
      const e = Math.min(240, Math.max(0, f.w.getBoundingClientRect().left));
      const ex = (r, x, y) => {
        r.setAttribute('x', x);
        r.setAttribute('y', y - .5);
        r.setAttribute('width', Math.max(1, e))
      };
      ex(f.ext[0], x0 - e, y0);
      ex(f.ext[1], x1, y0);
      ex(f.ext[2], x0 - e, y1);
      ex(f.ext[3], x1, y1);
      [
        [x0, y0],
        [x1, y0],
        [x0, y1],
        [x1, y1]
      ].forEach(([x, y], i) => {
        f.q[i].setAttribute('x', x - 3.5);
        f.q[i].setAttribute('y', y - 3.5)
      });
      const L = W / 2 + H + W / 2;
      f.k = [(W / 2) / L, (W / 2 + H) / L]
    };
    F.forEach(geo);
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(es => es.forEach(e => {
        const f = F.find(x => x.w === e.target);
        if (f) {
          geo(f);
          paint(f, true)
        }
      }));
      F.forEach(f => ro.observe(f.w))
    }
    const paint = (f, force) => {
      const a = f.a,
        b = f.b,
        len = Math.max(0, b - a);
      const da = len < .0005 ? '0 2' : len.toFixed(4) + ' 2',
        off = (-a).toFixed(4);
      if (force || f._da !== da || f._off !== off) {
        f._da = da;
        f._off = off;
        f.ln.forEach(l => {
          l.style.strokeDasharray = da;
          l.style.strokeDashoffset = off
        })
      }
      const top = a < .002 && b > f.k[0] - .0001,
        bot = b >= f.k[1] - .0001 && a < f.k[1] + .02 && len > .0005;
      if (f._t !== top) {
        f._t = top;
        f.q[0].classList.toggle('fon', top);
        f.q[1].classList.toggle('fon', top);
        f.ext[0].classList.toggle('fon', top);
        f.ext[1].classList.toggle('fon', top)
      }
      if (f._bt !== bot) {
        f._bt = bot;
        f.q[2].classList.toggle('fon', bot);
        f.q[3].classList.toggle('fon', bot);
        f.ext[2].classList.toggle('fon', bot);
        f.ext[3].classList.toggle('fon', bot)
      }
    };
    let run = 0;
    const target = () => {
      const vh = innerHeight;
      F.forEach(f => {
        if (!f.s.offsetParent) {
          f.ta = f.tb = 0;
          return
        }
        const r = f.s.getBoundingClientRect();
        if (RM) {
          f.tb = r.top < vh && r.bottom > 0 ? 1 : 0;
          f.ta = 0;
          if (!f.lit) {
            f.lit = true;
            f.s.classList.add('lit')
          }
          return
        }
        f.tb = clamp((vh * .95 - r.top) / (vh * .6), 0, 1);
        f.ta = f.last ? 0 : Math.min(f.tb, clamp((vh * .55 - r.bottom) / (vh * .5), 0, 1));
        const lit = f.lit ? (f.tb > .18 && f.ta < .14) : (f.tb > .3 && f.ta < .04);
        if (lit !== f.lit) {
          f.lit = lit;
          f.s.classList.toggle('lit', lit)
        }
      })
    };
    const step = () => {
      run = 0;
      let more = false;
      F.forEach(f => {
        const db = f.tb - f.b,
          da = f.ta - f.a;
        if (Math.abs(db) < .001 && Math.abs(da) < .001) {
          if (f.b !== f.tb || f.a !== f.ta) {
            f.b = f.tb;
            f.a = f.ta;
            paint(f)
          }
          return
        }
        f.b += db * .075;
        f.a += da * .075;
        more = true;
        paint(f)
      });
      if (more) run = requestAnimationFrame(step)
    };
    const kick = () => {
      target();
      if (!run) run = requestAnimationFrame(step)
    };
    addEventListener('scroll', kick, {
      passive: true
    });
    addEventListener('resize', kick);
    window.__fdKick = kick;
    kick()
  }
}
