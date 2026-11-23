// @ts-nocheck — ported 1:1 from the original site script; type it file by file.
// Starts the site's behaviour (globes, story, phone, pricing, filters…) on the page that is on screen,
// and returns stop() so the route can tear it down when you navigate away.
import '../map/flags';
import '../map/zerolag-map';
import { openScope, closeScope, setErrorHandler } from './scope';
import loop from './features/loop';
import hero from './features/hero';
import cells from './features/cells';
import stats from './features/stats';
import chart from './features/chart';
import story from './features/story';
import phone from './features/phone';
import devices from './features/devices';
import cards from './features/cards';
import marquees from './features/marquees';
import rings from './features/rings';
import netglobe from './features/netglobe';
import pricing from './features/pricing';
import faq from './features/faq';
import slots from './features/slots';
import games from './features/games';
import apps from './features/apps';
import locations from './features/locations';
import about from './features/about';
import contact from './features/contact';
import router from './features/router';
import chrome from './features/chrome';
import render from './features/render';
import boot from './features/boot';

const FEATURES = { loop, hero, cells, stats, chart, story, phone, devices, cards, marquees, rings, netglobe, pricing, faq, slots, games, apps, locations, about, contact, router, chrome, render, boot };

export type Page = 'home' | 'games' | 'apps' | 'locations' | 'pricing' | 'about' | 'contact' | 'download';

export function start(page: Page, opts: { navigate: (href: string) => void }): () => void {
  const site: any = { alive: true, page, params: new URLSearchParams(location.search), navigate: opts.navigate };
  // a feature whose section is not on this page fails on a missing element: that is expected, so it stays quiet
  site.report = (e: unknown, where = '') =>
    ((e instanceof TypeError && /null|undefined|not of type/.test(e.message)) || (e instanceof ReferenceError && /before initialization/.test(e.message)) ? console.debug : console.error)('[ZeroLag] ' + where, e);
  setErrorHandler(site.report);
  const scope = openScope();
  const runs = Object.entries(FEATURES).map(([name, feature]) => [name, feature(site)] as const);
  runs.forEach(([, run]) => run.next());            // phase 1: share functions
  for (const [name, run] of runs) {                 // phase 2: set up, in order
    try { run.next() } catch (e) { site.report(e, name) }
  }
  return function stop() {
    site.alive = false;
    (site.GLOBES || []).forEach((m: any) => m && m.destroy && m.destroy());
    closeScope(scope);
  };
}
