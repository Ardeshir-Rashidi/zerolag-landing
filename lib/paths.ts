/** Build-time prefix for public assets on GitHub Pages. Next Link handles route prefixes. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const assetPath = (pathname: string) => BASE_PATH + '/' + pathname.replace(/^\/+/, '');
