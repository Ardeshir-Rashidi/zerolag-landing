# Architecture and implementation notes

Next.js 16 (App Router) · React 19 · TypeScript · CSS Modules. English only.
The project separates route markup, scoped styling, typed content, and a browser-side interaction layer.

## Run

```bash
npm ci
npm run dev        # http://localhost:3000
npm run build
# Serve the generated out/ directory with a static web server.
npm run typecheck
```

Node 20+ recommended. Fonts (Geist, Geist Mono) load from Google Fonts in `app/layout.tsx`.

## Routes

| URL | Page |
|---|---|
| `/` | Home |
| `/games` · `/apps` · `/locations` · `/pricing` · `/about` · `/contact` · `/download` | One route each, statically prerendered |

Query hand-offs: `/download?os=win|mac|and|ios` opens that system; `/locations?city=<id>` opens that city.

## Structure

```
app/
  layout.tsx            html shell: nav, main, footer, toast, runtime
  page.tsx              home (15 section components)
  <route>/page.tsx      one per page, + <route>.module.css (that page's styles)
  styles/               global layers, imported in this order:
    zerolag-map.css       globe engine
    tokens.css            colours, lines, type, spacing (CSS variables)
    base.css              reset + type scale
    components.css        buttons, chips, logo, nav bar, reveal motion
    shared.css            styles used by several sections
    frame.css             frame system: rails, corner marks, block rhythm
components/
  layout/               Nav (+ MenuToggle client component), Footer, Chrome (skip link, progress, toast)
  home/                 Hero, Why, Routing, Stats, Insights, Features, Desktop, Mobile, …  (+ .module.css)
  games/ apps/ locations/ pricing/ about/ contact/ download/   page sections
  shared/               Steps, Talk (used on several pages)
  SiteRuntime.tsx       starts / stops the interactive layer per route
lib/
  site/                 the interactive layer (client only, loaded after hydration)
    index.ts            start(page) → stop()
    scope.ts            timers, listeners and observers tied to the running page (torn down on navigation)
    core/               pure helpers, icons, data lookups
    features/           one module per feature: hero, story, phone, devices, rings, pricing, locations, …
    i18n.ts             UI strings
  map/                  globe engine (canvas + WebGL) + flag image map
data/
  site.ts, types.ts     cities, games, apps, launchers (typed)
public/
  img/f (flags), img/g (game covers), geo.js / geo.json (country outlines for the globes)
```

## How it fits together

- **Markup** is server components (static HTML, no client JS per section).
- **Behaviour** (globes, the desktop story, the phone, filters, pricing toggle, FAQ, forms, scroll motion)
  lives in `lib/site`. `SiteRuntime` imports it in the browser, runs it for the current route and calls
  `stop()` when you leave, which clears its timers, listeners, observers and WebGL globes.
- Each `features/*.ts` exports a generator `function* name(site)`: before its `yield` it shares the functions
  other features call on `site`; after it, it runs its setup. `index.ts` runs all "before" parts, then all setups
  in order. Steps whose section is not on the current page fail quietly (logged with `console.debug`).
- **CSS Modules:** every section's own rules sit in its `.module.css`, limited to that component with
  `:global(:is(<original selector>)):where(.root, .root *)`. `:is()` keeps the original specificity and `:where()`
  adds none, so the cascade is exactly the same as the single stylesheet it came from. Class names stay
  global inside the selector because the interactive layer renders markup with those names.

## Known limits / next steps

- `lib/site` and `lib/map` are a 1:1 port of the original script and carry `// @ts-nocheck`. Type them file by file,
  and move features into React components where state is local (FAQ, pricing toggle, filters are good first candidates).
- Some content (game cards, plan tables, phone screens, charts) is rendered by `lib/site` in the browser,
  not by the server, as in the original.
