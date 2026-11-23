'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const ICON = (d: string) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
const MENU = ICON('M4 7h16M4 12h16M4 17h16'), CLOSE = ICON('M18 6 6 18M6 6l12 12');

/** Mobile menu (open/close, Escape, closes on wide screens and on link click) + the active nav link. */
export default function MenuToggle() {
  const pathname = usePathname();

  useEffect(() => {
    const btn = document.querySelector<HTMLButtonElement>('.menu-btn');
    const sheet = document.getElementById('sheet');
    if (!btn || !sheet) return;
    const isOpen = () => sheet.classList.contains('open');
    const set = (o: boolean) => {
      if (o) {
        sheet.hidden = false;
        document.documentElement.classList.add('lock');
        requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add('open')));
      } else {
        sheet.classList.remove('open');
        document.documentElement.classList.remove('lock');
        setTimeout(() => { if (!isOpen()) sheet.hidden = true; }, 420);
      }
      btn.setAttribute('aria-expanded', String(o));
      btn.innerHTML = o ? CLOSE : MENU;
    };
    const onBtn = () => set(!isOpen());
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen()) set(false); };
    const onResize = () => { if (innerWidth > 1060 && isOpen()) set(false); };
    const onSheet = (e: MouseEvent) => { if ((e.target as Element).closest('a')) set(false); };
    btn.addEventListener('click', onBtn);
    sheet.addEventListener('click', onSheet);
    addEventListener('keydown', onKey);
    addEventListener('resize', onResize);
    return () => {
      btn.removeEventListener('click', onBtn);
      sheet.removeEventListener('click', onSheet);
      removeEventListener('keydown', onKey);
      removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    document.querySelectorAll('.links a, .sheet a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === pathname));
  }, [pathname]);

  return null;
}
