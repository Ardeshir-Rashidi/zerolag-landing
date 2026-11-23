import Link from 'next/link';
import type { CSSProperties } from 'react';

export default function ContactForm() {
  return (
    <section className="wrap ct vs">
      {" "}
      <div className="ct-l rv">
        {" "}
        <div className="ct-hd">
          <h2 data-th="ctT" data-split="">
            Let's make your
            <br />
            connection work.
          </h2>
          {" "}
          <p data-t="ctP">A setup question, a plan change, or a game that won't connect. We'd love to hear it.</p>
        </div>
        {" "}
        <div className="ct-links">
          {" "}
          <div>
            <h4 data-t="ct1">Product support</h4>
            <Link href="/games">
              <span data-t="ct1a">Setup guides and troubleshooting</span>
              <svg className="ic flip" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
          {" "}
          <div>
            <h4 data-t="ct2">{"Plans & teams"}</h4>
            <Link href="/pricing">
              <span data-t="ct2a">Find the right plan for your needs</span>
              <svg className="ic flip" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
          {" "}
          <div>
            <h4 data-t="ct3">Service status</h4>
            <Link href="/locations">
              <span data-t="ct3a">Check network availability</span>
              <svg className="ic flip" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
          {" "}
        </div>
        {" "}
      </div>
      {" "}
      <form className="form rv" id="ctForm" noValidate style={{ "--d": ".1s" } as CSSProperties}>
        {" "}
        <h3 data-t="fmT">Send us a message</h3>
        {" "}
        <div className="field">
          <label htmlFor="fName" data-t="fmName">Your name</label>
          <input id="fName" name="name" autoComplete="name" data-tp="fmNameP" placeholder="Alex Morgan" />
          <span className="e" />
        </div>
        {" "}
        <div className="field">
          <label htmlFor="fEmail" data-t="fmEmail">Email address</label>
          <input id="fEmail" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
          <span className="e" />
        </div>
        {" "}
        <div className="field">
          <label htmlFor="fTopic" data-t="fmTopic">Topic</label>
          <select id="fTopic" name="topic" />
        </div>
        {" "}
        <div className="field">
          <label htmlFor="fMsg" data-t="fmMsg">How can we help?</label>
          <textarea id="fMsg" name="msg" data-tp="fmMsgP" placeholder="Tell us a little about what you need…" />
          <span className="e" />
        </div>
        {" "}
        <div>
          <button className="btn white" type="submit" data-t="fmSend">Send message</button>
        </div>
        {" "}
        <div className="msg" id="fmMsgBox" hidden />
        {" "}
        <p className="note" data-t="fmNote">We'll use your email only to reply to your request.</p>
        {" "}
      </form>
      {" "}
    </section>
  );
}
