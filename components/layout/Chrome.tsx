import s from './Chrome.module.css';

/* Skip link + scroll progress bar (top), toast (bottom). */
export function SkipLink() {
  return <a className={`skip ${s.root}`} href="#main" data-t="skip">Skip to content</a>;
}

export function Progress() {
  return (
    <div className={`progress ${s.root}`} aria-hidden="true">
      <i id="prog" />
    </div>
  );
}

export function Toast() {
  return <div className={`toast ${s.root}`} id="toast" role="status" aria-live="polite" />;
}
