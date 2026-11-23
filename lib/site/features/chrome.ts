// @ts-nocheck — ported 1:1 from the original site script; type it file by file.
import { $, $$, L, RM, clamp } from '../core/util';
import { icon } from '../core/icons';
import { setTimeout, requestAnimationFrame, IntersectionObserver, addEventListener } from '../scope';

// Phase 1 (before the yield) shares this feature's functions on the shared site context;
// phase 2 runs its setup code, in the same order as the original single script.
export default function* chrome(site: any) {
  Object.assign(site, { sfx, onScroll, watchReveal, words });
  yield;
  /* ================= nav, progress, reveal ================= */
  let SFX;
  try { SFX = $$('[data-sfx=tilt],[data-sfx=drift]'); } catch (e) { site.report(e, 'chrome') }

  function sfx() {
    if (RM) return;
    const vh = innerHeight,
      R = [];
    SFX.forEach(el => {
      if (!el.offsetParent) {
        R.push(null);
        return
      }
      R.push(el.getBoundingClientRect())
    });
    SFX.forEach((el, n) => {
      const r = R[n];
      if (!r || r.bottom < -200 || r.top > vh + 200) return;
      const k = el.dataset.sfx;
      if (k === 'tilt') {
        const p = clamp(scrollY / 420, 0, 1),
          v = p.toFixed(3);
        if (el._p === v) return;
        el._p = v;
        el.style.transform = p >= 1 ? 'none' : 'perspective(1800px) rotateX(' + ((1 - p) * 14).toFixed(2) + 'deg) scale(' + (.95 + p * .05).toFixed(4) + ')'
      } else {
        const p = clamp((vh - r.top) / (vh + r.height), 0, 1),
          d = ((p - .5) * 240).toFixed(1);
        if (el._p === d) return;
        el._p = d;
        $$('.mq-track', el).forEach(t => {
          t.style.translate = (t.parentElement.classList.contains('l') ? -d : d) + 'px 0'
        })
      }
    })
  }
  /* while the page scrolls, the globes drop to a lower frame rate */
  let busyT = 0;
  try { addEventListener('scroll', () => {
    window.__zlBusy = true;
    clearTimeout(busyT);
    busyT = setTimeout(() => {
      window.__zlBusy = false
    }, 180)
  }, {
    passive: true
  }); } catch (e) { site.report(e, 'chrome') }
  /* sections far off screen pause their looping CSS animations */
  try { (() => {
    if (!window.IntersectionObserver) return;
    const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('zz', !e.isIntersecting)), {
      rootMargin: '200px 0px'
    });
    $$('.page>section').forEach(s => io.observe(s))
  })(); } catch (e) { site.report(e, 'chrome') }
  try { addEventListener('resize', sfx); } catch (e) { site.report(e, 'chrome') }
  let scrollQ = false;

  function onScroll() {
    scrollQ = false;
    sfx();
    const h = document.documentElement.scrollHeight - innerHeight;
    $('#prog').style.transform = 'scaleX(' + (h > 0 ? clamp(scrollY / h, 0, 1) : 0).toFixed(4) + ')'
  }
  try { addEventListener('scroll', () => {
    if (!scrollQ) {
      scrollQ = true;
      requestAnimationFrame(onScroll)
    }
  }, {
    passive: true
  }); } catch (e) { site.report(e, 'chrome') }
  /* the mobile menu is handled by components/layout/MenuToggle.tsx */






  let revIO;
  try { revIO = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revIO.unobserve(e.target)
    }
  }), {
    rootMargin: '0px 0px -6% 0px',
    threshold: .06
  }); } catch (e) { site.report(e, 'chrome') }

  function watchReveal() {
    $$('.rv:not(.in),.wd:not(.in)').forEach(el => {
      if (el.offsetParent !== null || el.closest('.page:not([hidden])')) revIO.observe(el)
    })
  }

  function words() {
    $$('[data-words]').forEach(h => {
      if (h.dataset.split === L) return;
      h.dataset.split = L;
      let i = 0;
      const walk = n => {
        [...n.childNodes].forEach(c => {
          if (c.nodeType === 3) {
            const parts = c.textContent.split(/(\s+)/);
            const fr = document.createDocumentFragment();
            parts.forEach(p => {
              if (!p) return;
              if (/^\s+$/.test(p)) {
                fr.appendChild(document.createTextNode(p));
                return
              }
              const s = document.createElement('span');
              s.className = 'w';
              s.style.setProperty('--i', i++);
              s.textContent = p;
              fr.appendChild(s)
            });
            c.replaceWith(fr)
          } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c)
        })
      };
      walk(h)
    })
  }
}
