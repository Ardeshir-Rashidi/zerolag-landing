'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { BASE_PATH } from '@/lib/paths';

const ICON = (d: string) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
const MENU = ICON('M4 7h16M4 12h16M4 17h16'), CLOSE = ICON('M18 6 6 18M6 6l12 12');

/** Mobile menu (open/close, Escape, closes on wide screens and on link click) + the active nav link. */
export default function MenuToggle() {
  const pathname = usePathname();

  useEffect(() => {
    const btn = document.querySelector<HTMLButtonElement>('.menu-btn');
    const sheet = document.getElementById('sheet');
    if (!btn || !sheet) return;
    let lockedY: number | null = null;
    let closeTimer: ReturnType<typeof setTimeout> | undefined;
    let openFrame = 0;
    const unlock = () => {
      document.documentElement.classList.remove('menu-open');
      if (lockedY === null) return;
      const y = lockedY;
      lockedY = null;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, y);
    };
    const isOpen = () => sheet.classList.contains('open');
    const set = (o: boolean) => {
      clearTimeout(closeTimer);
      cancelAnimationFrame(openFrame);
      sheet.inert = !o;
      if (o) {
        sheet.hidden = false;
        if (lockedY === null) {
          lockedY = window.scrollY;
          document.body.style.position = 'fixed';
          document.body.style.top = `-${lockedY}px`;
          document.body.style.width = '100%';
        }
        document.documentElement.classList.add('menu-open');
        openFrame = requestAnimationFrame(() => {
          sheet.classList.add('open');
        });
      } else {
        sheet.classList.remove('open');
        unlock();
        closeTimer = setTimeout(() => { if (!isOpen()) sheet.hidden = true; }, 420);
      }
      btn.setAttribute('aria-expanded', String(o));
      btn.innerHTML = o ? CLOSE : MENU;
    };
    const onBtn = () => set(btn.getAttribute('aria-expanded') !== 'true');
    const onKey = (e: KeyboardEvent) => {
      if (!isOpen()) return;
      if (e.key === 'Escape') {
        set(false);
        btn.focus({ preventScroll: true });
      }
      if (e.key === 'Tab') {
        const items = Array.from(btn.closest('header')!.querySelectorAll<HTMLElement>('a[href],button'))
          .filter(el => el.offsetParent !== null && !el.closest('[inert]'));
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    const onResize = () => { if (innerWidth > 1060 && isOpen()) set(false); };
    const onSheet = (e: MouseEvent) => { if ((e.target as Element).closest('a')) set(false); };
    btn.addEventListener('click', onBtn);
    sheet.addEventListener('click', onSheet);
    addEventListener('keydown', onKey);
    addEventListener('resize', onResize);
    return () => {
      clearTimeout(closeTimer);
      cancelAnimationFrame(openFrame);
      unlock();
      btn.removeEventListener('click', onBtn);
      sheet.removeEventListener('click', onSheet);
      removeEventListener('keydown', onKey);
      removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    const route = (path: string) => {
      const local = BASE_PATH && (path === BASE_PATH || path.startsWith(BASE_PATH + '/'))
        ? path.slice(BASE_PATH.length) : path;
      return local.replace(/\/+$/, '') || '/';
    };
    document.querySelectorAll('.links a, .sheet a').forEach(a => {
      const active = route(new URL((a as HTMLAnchorElement).href).pathname) === route(pathname);
      a.classList.toggle('on', active);
      if (active) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    const btn = document.querySelector<HTMLButtonElement>('.menu-btn');
    if (btn?.getAttribute('aria-expanded') === 'true') btn.click();
  }, [pathname]);

  return null;
}
