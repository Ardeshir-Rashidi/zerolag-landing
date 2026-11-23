'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { BASE_PATH } from '@/lib/paths';
import type { Page } from '@/lib/site';

/**
 * Runs the site's interactive layer (lib/site) for the page on screen and stops it on navigation.
 * It is loaded only in the browser, after the server-rendered page is hydrated.
 */
export default function SiteRuntime() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let stop: (() => void) | undefined;
    let cancelled = false;
    const routePath = pathname.replace(/\/+$/, '') || '/';
    const page = (routePath === '/' ? 'home' : routePath.slice(1)) as Page;
    import('@/lib/site').then(m => {
      if (!cancelled) stop = m.start(page, { navigate: href => router.push(href) });
    });
    return () => {
      cancelled = true;
      stop?.();
    };
  }, [pathname, router]);

  // links built by the runtime (game cards, chips…) are plain <a href="/…">: route them client-side
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.('a[href^="/"]') as HTMLAnchorElement | null;
      if (!a || a.target || a.hasAttribute('download')) return;
      const href = a.getAttribute('href')!;
      if (href.startsWith('//')) return;
      e.preventDefault();
      const route = BASE_PATH && (href === BASE_PATH || href.startsWith(BASE_PATH + '/'))
        ? href.slice(BASE_PATH.length) || '/'
        : href;
      router.push(route);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [router]);

  return null;
}
