import { assetPath } from '@/lib/paths';
/* Flag images for the globe engine, keyed by country code (files in public/img/f). */
const CODES = ["AE", "AR", "AT", "AU", "BE", "CA", "CH", "CL", "CN", "DE", "DK", "EE", "ES", "FI", "FR", "GB", "IN", "IR", "IT", "JP", "KR", "MX", "NL", "NO", "PL", "QA", "RU", "SA", "SE", "TR", "UA", "US"];
(window as any).ZL_FLAGS = Object.fromEntries(CODES.map(cc => [cc, assetPath(`/img/f/${cc}.webp`)]));
export {};
