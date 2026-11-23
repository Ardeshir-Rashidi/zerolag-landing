// @ts-nocheck — ported 1:1 from the original site script; type it file by file.
import { BASE_PATH } from '@/lib/paths';
import { $, D, N, t } from './util';
import { SIG } from './icons';

/* ---------------- data ---------------- */
export const C = D.cities,
  G = D.games,
  HOME = D.home;
export const city = id => C.find(c => c.id === id);
export const game = id => G.find(g => g.id === id);
export const cname = c => c.n[0];
export const coname = c => c.co[0];
export const code = (cc, cls) => '<img class="flag' + (cls ? ' ' + cls : '') + '" src="' + BASE_PATH + '/img/f/' + cc + '.webp" alt="" loading="lazy">';
export const sigCls = ms => ms <= 35 ? 'good' : ms <= 90 ? 'mid' : 'bad';
export const sig = ms => '<span class="sig ' + sigCls(ms) + '">' + SIG + N(ms) + '<small>ms</small></span>';
export const svCity = g => {
  const cs = C.filter(c => c.cc.toLowerCase() === g.sv);
  return cs.find(c => c.cap) || cs[0] || C[0]
};
export const geName = ge => t('ge_' + ge);
export const plName = pl => (pl || '').split(' · ').map(x => t('pl_' + x)).join(' · ');
export let tt;

export function toast(m) {
  const el = $('#toast');
  el.textContent = m;
  el.classList.add('show');
  clearTimeout(tt);
  tt = setTimeout(() => el.classList.remove('show'), 2800)
}
/* servers for the globe, grouped by country the way the app does */
export const SERVERS = [];
C.forEach(c => {
  const id = c.cc.toLowerCase();
  let s = SERVERS.find(x => x.id === id);
  if (!s) {
    s = {
      id,
      cc: c.cc,
      cap: null,
      name: {
        en: c.co[0],
        fa: c.co[1]
      },
      cities: []
    };
    SERVERS.push(s)
  }
  if (c.cap) s.cap = c.id;
  s.cities.push({
    id: c.id,
    name: {
      en: c.n[0],
      fa: c.n[1]
    },
    lon: c.lon,
    lat: c.lat,
    ping: c.p
  })
});
SERVERS.forEach(s => {
  if (!s.cap) s.cap = s.cities[0].id
});
export const RELAYS = [{
  "id": "r_ist",
  "name": {
    "en": "Istanbul edge"
  },
  "lon": 28.98,
  "lat": 41.01
}, {
  "id": "r_dxb",
  "name": {
    "en": "Dubai edge"
  },
  "lon": 55.27,
  "lat": 25.2
}, {
  "id": "r_evn",
  "name": {
    "en": "Yerevan edge"
  },
  "lon": 44.51,
  "lat": 40.18
}, {
  "id": "r_gyd",
  "name": {
    "en": "Baku edge"
  },
  "lon": 49.87,
  "lat": 40.41
}, {
  "id": "r_tbs",
  "name": {
    "en": "Tbilisi edge"
  },
  "lon": 44.79,
  "lat": 41.72
}, {
  "id": "r_doh",
  "name": {
    "en": "Doha edge"
  },
  "lon": 51.53,
  "lat": 25.29
}, {
  "id": "r_mct",
  "name": {
    "en": "Muscat edge"
  },
  "lon": 58.41,
  "lat": 23.59
}, {
  "id": "r_fra",
  "name": {
    "en": "Frankfurt core"
  },
  "lon": 8.68,
  "lat": 50.11
}, {
  "id": "r_vie",
  "name": {
    "en": "Vienna core"
  },
  "lon": 16.37,
  "lat": 48.21
}, {
  "id": "r_mow",
  "name": {
    "en": "Moscow core"
  },
  "lon": 37.62,
  "lat": 55.76
}, {
  "id": "r_bom",
  "name": {
    "en": "Mumbai core"
  },
  "lon": 72.88,
  "lat": 19.08
}, {
  "id": "r_sin",
  "name": {
    "en": "Singapore core"
  },
  "lon": 103.82,
  "lat": 1.35
}, {
  "id": "r_lon",
  "name": {
    "en": "London core"
  },
  "lon": -0.13,
  "lat": 51.5
}];
