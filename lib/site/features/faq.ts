// @ts-nocheck — ported 1:1 from the original site script; type it file by file.
import { $$, N, esc, pad2, t } from '../core/util';
import { icon } from '../core/icons';
import { onDocument } from '../scope';

// Phase 1 (before the yield) shares this feature's functions on the shared site context;
// phase 2 runs its setup code, in the same order as the original single script.
export default function* faq(site: any) {
  Object.assign(site, { renderFaq });
  yield;
  /* ================= FAQ (numbered, vercel.com/pricing) ================= */
  let FAQS;
  try { FAQS = {
    home: [1, 2, 3, 4, 5, 6].map(n => ['q' + n, 'a' + n]),
    pricing: [1, 2, 3, 4, 5].map(n => ['pq' + n, 'pa' + n]).concat([
      ['q2', 'a2'],
      ['q6', 'a6']
    ])
  }; } catch (e) { site.report(e, 'faq') }
  const faqOpen = {};

  function renderFaq() {
    $$('[data-slot=faq]').forEach(sl => {
      const set = sl.dataset.set;
      const op = faqOpen[set] || (faqOpen[set] = new Set([0]));
      sl.innerHTML = FAQS[set].map((q, i) => '<div class="q' + (op.has(i) ? ' open' : '') + '"><h3 style="margin:0"><button type="button" aria-expanded="' + op.has(i) + '" data-q="' + i + '"><span class="n">' + N(pad2(i + 1)) + '</span><span>' + esc(t(q[0])) + '</span>' + icon('chevron-down') + '</button></h3><div class="ans" role="region"><div><p>' + esc(t(q[1])) + '</p></div></div></div>').join('')
    })
  }
  try { onDocument('click', e => {
    const b = e.target.closest('[data-slot=faq] [data-q]');
    if (!b) return;
    const sl = b.closest('[data-slot=faq]');
    const op = faqOpen[sl.dataset.set];
    const i = +b.dataset.q;
    if (op.has(i)) op.delete(i);
    else op.add(i);
    const q = b.closest('.q');
    q.classList.toggle('open', op.has(i));
    b.setAttribute('aria-expanded', String(op.has(i)))
  }); } catch (e) { site.report(e, 'faq') }
}
