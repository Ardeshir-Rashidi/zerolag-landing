// @ts-nocheck — ported 1:1 from the original site script; type it file by file.
import { $$ } from './util';

/* ---------------- icons ---------------- */
export const IP = {
  tablet: '<rect x="5" y="2.5" width="14" height="19" rx="2.2"/><path d="M11 18.5h2"/>',
  laptop: '<rect x="4" y="5" width="16" height="10.5" rx="1.6"/><path d="M2 19h20"/>',
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  gamepad: '<path d="M6 11h4M8 9v4M15 12h.01M18 10h.01"/><path d="M17.3 5H6.7a4 4 0 0 0-4 3.6l-.9 8.1a2.5 2.5 0 0 0 2.5 2.8c1 0 1.9-.6 2.3-1.4L8 15h8l1.4 3.1c.4.9 1.3 1.4 2.3 1.4a2.5 2.5 0 0 0 2.5-2.8l-.9-8.1a4 4 0 0 0-4-3.6z"/>',
  grid: '<circle cx="5" cy="5" r="1.7"/><circle cx="12" cy="5" r="1.7"/><circle cx="19" cy="5" r="1.7"/><circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/><circle cx="5" cy="19" r="1.7"/><circle cx="12" cy="19" r="1.7"/><circle cx="19" cy="19" r="1.7"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  settings: '<path d="M20 7h-9M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',
  chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  power: '<path d="M12 3v9"/><path d="M18.4 6.6a9 9 0 1 1-12.8 0"/>',
  'arrow-up-right': '<path d="M7 17 17 7M7 7h10v10"/>',
  'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'chevron-left': '<path d="m15 18-6-6 6-6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
  shield: '<path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-2.6-6.4L21 8"/><path d="M21 3v5h-5"/>',
  route: '<circle cx="6" cy="19" r="3"/><circle cx="18" cy="5" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  pin: '<path d="M12 17v5M9 3h6l-1 6 3 3v2H7v-2l3-3z"/>',
  console: '<rect x="2" y="6" width="20" height="12" rx="5"/><path d="M6 12h4M8 10v4M15 13h.01M18 11h.01"/>',
  router: '<rect x="2" y="13" width="20" height="8" rx="2"/><path d="M6 17h.01M10 17h.01M15 13V9M12.5 6.5a4 4 0 0 1 5 0M10 4a7.5 7.5 0 0 1 10 0"/>',
  monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  phone: '<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/>',
  zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l3 3"/>',
  windows: '<path d="M3 5.6 10.4 4.6v7H3zM11.4 4.4 21 3v8.6h-9.6zM3 12.4h7.4v7L3 18.4zM11.4 12.4H21V21l-9.6-1.4z"/>',
  apple: '<path d="M12.15 6.9c-.95 0-2.42-1.08-3.96-1.04-2.04.03-3.91 1.18-4.96 3.01-2.12 3.68-.55 9.1 1.52 12.09 1.01 1.45 2.21 3.09 3.79 3.04 1.52-.07 2.09-.99 3.94-.99 1.83 0 2.35.99 3.96.95 1.64-.03 2.68-1.48 3.68-2.95 1.16-1.69 1.64-3.33 1.66-3.42-.04-.01-3.18-1.22-3.22-4.86-.03-3.04 2.48-4.49 2.6-4.56-1.43-2.09-3.62-2.32-4.39-2.38-2-.16-3.68 1.09-4.61 1.09zm3.38-3.07c.84-1.01 1.4-2.43 1.25-3.83-1.21.05-2.66.8-3.53 1.82-.78.9-1.46 2.34-1.27 3.71 1.34.1 2.71-.69 3.55-1.7"/>',
  android: '<path d="M6 18c0 .55.45 1 1 1h1v3.5a1.5 1.5 0 0 0 3 0V19h2v3.5a1.5 1.5 0 0 0 3 0V19h1c.55 0 1-.45 1-1V8H6zM3.5 8A1.5 1.5 0 0 0 2 9.5v7a1.5 1.5 0 0 0 3 0v-7A1.5 1.5 0 0 0 3.5 8zm17 0A1.5 1.5 0 0 0 19 9.5v7a1.5 1.5 0 0 0 3 0v-7A1.5 1.5 0 0 0 20.5 8zm-4.97-5.84 1.3-1.3a.5.5 0 0 0-.7-.7l-1.48 1.48A6 6 0 0 0 12 1c-.96 0-1.86.23-2.66.63L7.85.15a.5.5 0 0 0-.7.7l1.31 1.31A6 6 0 0 0 6 7h12a6 6 0 0 0-2.47-4.84zM10 5H9V4h1zm5 0h-1V4h1z"/>',
  crown: '<path d="m2 6 4 12h12l4-12-6 4-4-6-4 6z"/>',
  panel: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M15 4v16"/>',
  'arrow-down': '<path d="M12 5v14M6 13l6 6 6-6"/>',
  pulse: '<path d="M3 12h4l3-7 4 14 3-7h4"/>',
  server: '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>'
};
export const FILL = {
  grid: 1,
  windows: 1,
  apple: 1,
  android: 1,
  crown: 1
};

export function icon(n, cls) {
  const f = FILL[n];
  return '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" ' + (f ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"') + ' aria-hidden="true">' + (IP[n] || '') + '</svg>'
}

export function hydrateIcons(root) {
  $$('i[data-ic]', root || document).forEach(el => {
    const w = document.createElement('span');
    w.innerHTML = icon(el.dataset.ic, el.className);
    el.replaceWith(w.firstChild)
  })
}
export let gid = 0;
/* the Figma shield mark (Delag / Original app / Shield mark), white → grey */
export function logoDark() {
  return '<svg viewBox="0 0 38 38" fill="none" aria-hidden="true"><path d="M19 3.5625L32.0625 8.3125V17.8125C32.0625 26.7188 26.125 32.0625 19 34.4375C11.875 32.0625 5.9375 26.7188 5.9375 17.8125V8.3125L19 3.5625Z" stroke="#0a0a0a" stroke-width="2.6" stroke-linejoin="round"/><path d="M21.0781 8.90625L12.4688 20.7812H18.4062L16.625 29.6875L25.5312 17.2188H19.5938L21.0781 8.90625Z" fill="#0a0a0a"/></svg>'
}

export function logo() {
  const a = 'zs' + (++gid),
    b = 'zs' + (++gid);
  return '<svg viewBox="0 0 38 38" fill="none" aria-hidden="true"><path d="M19 3.5625L32.0625 8.3125V17.8125C32.0625 26.7188 26.125 32.0625 19 34.4375C11.875 32.0625 5.9375 26.7188 5.9375 17.8125V8.3125L19 3.5625Z" stroke-width="2.375" stroke-linejoin="round" stroke="url(#' + a + ')"/><path d="M21.0781 8.90625L12.4688 20.7812H18.4062L16.625 29.6875L25.5312 17.2188H19.5938L21.0781 8.90625Z" fill="url(#' + b + ')"/><defs><linearGradient id="' + a + '" x1="5.9375" y1="3.5625" x2="36.3866" y2="29.3272" gradientUnits="userSpaceOnUse"><stop stop-color="white"/><stop offset="1" stop-color="#A1A1A1"/></linearGradient><linearGradient id="' + b + '" x1="12.4688" y1="8.90625" x2="31.195" y2="20.677" gradientUnits="userSpaceOnUse"><stop stop-color="white"/><stop offset="1" stop-color="#A1A1A1"/></linearGradient></defs></svg>'
}
export const SIG = '<svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><rect x="0" y="8" width="2" height="4" rx=".5"/><rect x="3.3" y="6" width="2" height="6" rx=".5"/><rect x="6.6" y="3.5" width="2" height="8.5" rx=".5"/><rect x="9.9" y="1" width="2" height="11" rx=".5"/></svg>';
export const ARW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
