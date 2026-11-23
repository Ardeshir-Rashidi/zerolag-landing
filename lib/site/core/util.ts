// @ts-nocheck — ported 1:1 from the original site script; type it file by file.
import { T } from '../i18n';
import D from '@/data/site';
export { D };

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
export const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
export let L = 'en';
try {
  localStorage.removeItem('zl-lang')
} catch (e) {}
export const isFa = () => false;
export const N = x => String(x);

export function t(k, p) {
  const v = T[k];
  let s = v ? v[0] : k;
  if (p)
    for (const q in p) {
      const val = typeof p[q] === 'number' ? N(p[q]) : p[q];
      s = s.split('{' + q + '}').join(val)
    }
  return s
}
export const esc = s => String(s).replace(/[&<>"]/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
} [c]));
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, k) => a + (b - a) * k;
export let seed = 11;
export const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
export const pad2 = n => String(n).padStart(2, '0');
export const hms = s => N(pad2(Math.floor(s / 3600)) + ':' + pad2(Math.floor(s / 60) % 60) + ':' + pad2(Math.floor(s) % 60));
export const ease = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
