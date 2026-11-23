// @ts-nocheck — ported 1:1 from the original site script; type it file by file.
// Timers, listeners and observers created while a site instance runs are tied to it,
// so stop() can tear everything down (needed when a page is left in an SPA / Next.js).
let bag = null;
let onError = null;
/** Errors thrown inside scheduled callbacks go here when set (otherwise they are thrown as usual). */
export function setErrorHandler(fn) { onError = fn }
const safe = fn => function (...args) { if (!onError) return fn.apply(this, args); try { return fn.apply(this, args) } catch (e) { onError(e, 'callback') } };

export function openScope() {
  bag = { alive: true, cleanups: [] };
  return bag;
}

export function closeScope(b) {
  b.alive = false;
  b.cleanups.splice(0).reverse().forEach(fn => { try { fn() } catch (e) { /* already gone */ } });
  if (bag === b) bag = null;
}

const track = fn => { if (bag) bag.cleanups.push(fn) };

export function setTimeout(fn, ms, ...args) {
  const b = bag;
  const f = safe(fn);
  return window.setTimeout(() => { if (!b || b.alive) f(...args) }, ms);
}

export function setInterval(fn, ms) {
  const b = bag;
  const f = safe(fn);
  const id = window.setInterval(() => { if (!b || b.alive) f() }, ms);
  track(() => window.clearInterval(id));
  return id;
}

export function requestAnimationFrame(fn) {
  const b = bag;
  const f = safe(fn);
  return window.requestAnimationFrame(t => { if (!b || b.alive) f(t) });
}

export function requestIdleCallback(fn, opts) {
  const b = bag;
  const f = safe(fn);
  return window.requestIdleCallback(d => { if (!b || b.alive) f(d) }, opts);
}

export function addEventListener(type, fn, opts) {
  const f = safe(fn);
  window.addEventListener(type, f, opts);
  track(() => window.removeEventListener(type, f, opts));
}

export function onDocument(type, fn, opts) {
  const f = safe(fn);
  document.addEventListener(type, f, opts);
  track(() => document.removeEventListener(type, f, opts));
}

export class IntersectionObserver extends window.IntersectionObserver {
  constructor(cb, opts) { super(safe(cb), opts); track(() => this.disconnect()) }
}

export class ResizeObserver extends window.ResizeObserver {
  constructor(cb) { super(safe(cb)); track(() => this.disconnect()) }
}
