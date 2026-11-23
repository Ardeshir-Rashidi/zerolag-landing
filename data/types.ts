/** A server city. `co` / `n` hold [country name, …] and [city name, …]. */
export interface City { id: string; cc: string; co: string[]; n: string[]; lon: number; lat: number; p: number; l: number; t: string; r: string; cap: boolean }
/** A game: `b` / `a` are ping before / after ZeroLag, `sv` the server country, `pl` platforms, `ge` genre. */
export interface Game { id: string; n: string; pub: string; b: number; a: number; sv: string; pl: string; ge: string }
/** A tool or app that ZeroLag unblocks; `c` is its brand colour, `p` its icon path. */
export interface App { id: string; n: string; cat: string; c: string; p: string }
/** A launcher / platform (Steam, Epic, PlayStation…). */
export interface Platform { id: string; g: string; n: string; m: string; c: string; fg: string; p: string | null; svc: string[]; b: number; a: number }
export interface SiteData { cities: City[]; games: Game[]; apps: App[]; plats: Platform[]; home: { lon: number; lat: number } }
