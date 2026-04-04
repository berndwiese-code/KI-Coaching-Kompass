"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Startseite, Tool, Artikel, Testimonial } from "@/sanity/lib/queries";

type Theme = "light" | "dark";

type Props = {
  startseite: Startseite | null;
  tools: Tool[];
  artikel: Artikel[];
  testimonials: Testimonial[];
};

export default function HomeClient({ startseite, tools, artikel, testimonials }: Props) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("kck-theme") as Theme | null;
    if (stored) {
      setTheme(stored);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("kck-theme", next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .kck-root {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          line-height: 1.72;
          overflow-x: hidden;
          transition: background 0.35s, color 0.35s;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        .kck-root.light {
          font-weight: 400;
          line-height: 1.75;
          --bg:      #f6f3ee;
          --bg2:     #ede9e0;
          --bg3:     #e2dbd0;
          --surface: #fdfcf9;
          --text:    #1c1916;
          --text2:   #2d2924;
          --muted:   #6b5f54;
          --gold:    #8c6820;
          --gold2:   #a87e28;
          --border:  rgba(140,104,32,0.20);
          --border2: rgba(140,104,32,0.10);
          --shadow:  0 2px 16px rgba(28,22,14,0.07), 0 1px 4px rgba(28,22,14,0.04);
        }

        .kck-root.dark {
          --bg:      #141210;
          --bg2:     #1b1815;
          --bg3:     #232019;
          --surface: #1e1b17;
          --text:    #ece7db;
          --text2:   #c8bfad;
          --muted:   #8c8274;
          --gold:    #c2a03c;
          --gold2:   #d4b24a;
          --border:  rgba(194,160,60,0.14);
          --border2: rgba(194,160,60,0.07);
          --shadow:  0 4px 24px rgba(0,0,0,0.40), 0 1px 6px rgba(0,0,0,0.20);
        }

        /* ── NAV ── */
        .kck-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.1rem 2.5rem;
          border-bottom: 1px solid var(--border2);
          background: var(--bg);
          backdrop-filter: blur(16px);
          transition: background 0.35s, border-color 0.35s;
        }

        .nav-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 400;
          letter-spacing: 0.06em;
          color: var(--gold2);
          text-decoration: none;
        }
        .nav-logo span { color: var(--text2); font-weight: 300; }

        .nav-center { display: flex; gap: 2.25rem; list-style: none; }
        .nav-center a {
          font-size: 0.76rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.2s;
        }
        .nav-center a:hover { color: var(--gold); }

        .nav-right { display: flex; align-items: center; gap: 1rem; }

        .theme-toggle {
          position: relative;
          width: 44px; height: 24px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--bg3);
          cursor: pointer;
          transition: background 0.3s;
          flex-shrink: 0;
        }
        .theme-toggle::after {
          content: '';
          position: absolute;
          top: 3px;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: var(--gold);
          transition: left 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .kck-root.light .theme-toggle::after { left: 3px; }
        .kck-root.dark  .theme-toggle::after { left: 23px; }

        .theme-label {
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          user-select: none;
        }

        .nav-cta {
          font-size: 0.73rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--bg);
          background: var(--gold);
          padding: 0.5rem 1.2rem;
          text-decoration: none;
          font-weight: 500;
          transition: background 0.2s;
          white-space: nowrap;
          border-radius: 6px;
        }
        .nav-cta:hover { background: var(--gold2); }

        /* ── HERO ── */
        .hero {
          background: var(--bg);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 9rem 2rem 5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          transition: background 0.35s;
        }
        .hero-orb {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -60%);
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(200,160,70,0.1) 0%, transparent 68%);
          pointer-events: none;
        }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 0.6rem;
          font-size: 0.68rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--gold); border: 1px solid var(--border);
          padding: 0.38rem 1rem; margin-bottom: 2.25rem;
          animation: fadeUp 0.7s ease both;
        }
        .hero-eyebrow::before { content: ''; width: 16px; height: 1px; background: var(--gold); }
        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.8rem, 6.5vw, 5.5rem);
          font-weight: 300; line-height: 1.1; color: var(--text);
          max-width: 800px;
          animation: fadeUp 0.7s 0.08s ease both;
        }
        .hero-title em { font-style: italic; color: var(--gold2); }
        .hero-sub {
          margin-top: 1.75rem;
          font-size: 1.12rem; font-weight: 400; color: var(--text2);
          max-width: 520px; line-height: 1.8;
          animation: fadeUp 0.7s 0.16s ease both;
        }
        .hero-sub strong { color: var(--text2); font-weight: 400; }

        .hero-form {
          margin-top: 2.5rem;
          display: flex; max-width: 400px; width: 100%;
          box-shadow: var(--shadow);
          animation: fadeUp 0.7s 0.24s ease both;
        }
        .hero-form input {
          flex: 1;
          background: var(--surface); border: 1px solid var(--border); border-right: none;
          color: var(--text); padding: 0.82rem 1rem;
          font-family: 'DM Sans', sans-serif; font-size: 0.87rem;
          outline: none; transition: border-color 0.2s, background 0.35s;
        }
        .hero-form input::placeholder { color: var(--muted); }
        .hero-form input:focus { border-color: var(--gold); }
        .hero-form button {
          background: var(--gold); color: var(--bg); border: none;
          padding: 0.82rem 1.4rem;
          font-family: 'DM Sans', sans-serif; font-size: 0.75rem;
          font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
          cursor: pointer; white-space: nowrap; transition: background 0.2s;
        }
        .hero-form button:hover { background: var(--gold2); }

        .hero-note {
          margin-top: 0.8rem; font-size: 0.7rem; color: var(--muted);
          letter-spacing: 0.04em;
          animation: fadeUp 0.7s 0.3s ease both;
        }
        .success-msg {
          margin-top: 2rem;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.15rem; font-style: italic; color: var(--gold2);
        }
        .hero-scroll {
          position: absolute; bottom: 2.25rem; left: 50%;
          transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
          color: var(--muted); opacity: 0.45;
          animation: bob 2.5s ease infinite;
        }
        .hero-scroll span { font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; }
        .scroll-line { width: 1px; height: 36px; background: linear-gradient(to bottom, var(--gold), transparent); }

        /* ── SHARED ── */
        .divider { border: none; border-top: 1px solid var(--border2); margin: 0; }

        .sec { background: var(--bg); transition: background 0.35s; }
        .sec.alt { background: var(--bg2); }
        .sec-in { max-width: 1100px; margin: 0 auto; padding: 5.5rem 2rem; }

        .eyebrow {
          display: inline-flex; align-items: center; gap: 0.6rem;
          font-size: 0.66rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 1.25rem;
        }
        .eyebrow::before { content: ''; width: 16px; height: 1px; background: var(--gold); }

        .sec-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.9rem, 3.5vw, 3rem);
          font-weight: 300; line-height: 1.15; color: var(--text);
          margin-bottom: 0.9rem;
        }
        .sec-title em { font-style: italic; color: var(--gold2); }

        .sec-lead { font-size: 1.05rem; font-weight: 400; color: var(--text2); max-width: 520px; line-height: 1.8; }

        .btn-primary {
          display: inline-block; background: var(--gold); color: var(--bg);
          padding: 0.65rem 1.6rem; font-size: 0.75rem; font-weight: 500;
          letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none;
          transition: background 0.2s; border-radius: 6px;
        }
        .btn-primary:hover { background: var(--gold2); }

        .btn-outline {
          display: inline-block; border: 1px solid var(--border); color: var(--gold);
          padding: 0.65rem 1.6rem; font-size: 0.75rem; letter-spacing: 0.1em;
          text-transform: uppercase; text-decoration: none;
          transition: border-color 0.2s, color 0.2s; border-radius: 6px;
        }
        .btn-outline:hover { border-color: var(--gold2); color: var(--gold2); }

        /* ── STAFFELSTAB ── */
        .staffel-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          margin-top: 3rem; border: 1px solid var(--border);
          background: var(--border); gap: 1px;
        }
        .staffel-step {
          background: var(--surface); padding: 2rem 1.6rem;
          transition: background 0.25s;
        }
        .staffel-step:hover { background: var(--bg2); }
        .step-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.8rem; font-weight: 300;
          color: var(--border); line-height: 1; margin-bottom: 1rem;
        }
        .step-icon { font-size: 1.25rem; margin-bottom: 0.65rem; }
        .step-ttl {
          font-size: 0.8rem; font-weight: 500; letter-spacing: 0.09em;
          text-transform: uppercase; color: var(--gold); margin-bottom: 0.55rem;
        }
        .step-desc { font-size: 0.86rem; color: var(--muted); line-height: 1.7; }

        .staffel-foot {
          padding: 1.4rem 1.8rem;
          border: 1px solid var(--border); border-top: none;
          display: flex; align-items: center; justify-content: space-between;
          background: var(--bg2); transition: background 0.35s;
        }
        .price-amt {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem; font-weight: 300; color: var(--gold2);
        }
        .price-lbl { font-size: 0.75rem; color: var(--muted); margin-left: 0.5rem; }

        /* ── TOOLS ── */
        .tool-hdr {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;
        }
        .filters { display: flex; gap: 0.4rem; flex-wrap: wrap; }
        .filter-btn {
          font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase;
          padding: 0.38rem 0.85rem; border: 1px solid var(--border);
          background: transparent; color: var(--muted); cursor: pointer;
          transition: all 0.2s; font-family: 'DM Sans', sans-serif; border-radius: 6px;
        }
        .filter-btn.on, .filter-btn:hover { border-color: var(--gold); color: var(--gold); }

        .tool-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: var(--border);
        }
        .tool-card {
          background: var(--surface); padding: 1.6rem; transition: background 0.2s; border-radius: 8px;
        }
        .tool-card:hover { background: var(--bg3); }
        .tool-card-hdr {
          display: flex; align-items: flex-start; justify-content: space-between;
          margin-bottom: 0.7rem;
        }
        .tool-name { font-size: 0.9rem; font-weight: 500; color: var(--text); }
        .tool-badge {
          font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase;
          padding: 0.18rem 0.45rem; border: 1px solid var(--border); color: var(--muted);
        }
        .tool-badge.star { border-color: var(--gold); color: var(--gold); }
        .tool-desc { font-size: 0.82rem; color: var(--muted); line-height: 1.65; margin-bottom: 1.1rem; }
        .tool-tags { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .tool-tag {
          font-size: 0.62rem; letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--muted); border-left: 1px solid var(--border); padding-left: 0.5rem;
        }
        .tool-foot {
          margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;
        }

        /* ── ARTIKEL ── */
        .artikel-grid {
          display: grid; grid-template-columns: 2fr 1fr 1fr;
          gap: 1px; background: var(--border); margin-top: 2.75rem;
        }
        .artikel-card {
          background: var(--surface); padding: 2rem; transition: background 0.2s;
          text-decoration: none; color: inherit; display: flex; flex-direction: column;
          border-radius: 8px;
        }
        .artikel-card:hover { background: var(--bg3); }
        .artikel-card.feat { grid-row: span 2; }
        .art-cat {
          font-size: 0.63rem; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 0.85rem;
        }
        .art-ttl {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.35rem; font-weight: 300; line-height: 1.3; color: var(--text);
          margin-bottom: 0.7rem;
        }
        .artikel-card.feat .art-ttl { font-size: 1.8rem; }
        .art-exc { font-size: 0.82rem; color: var(--muted); line-height: 1.7; flex: 1; }
        .art-foot {
          margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center;
          font-size: 0.68rem; color: var(--muted); letter-spacing: 0.05em;
        }
        .art-persp { color: var(--gold); font-size: 0.63rem; letter-spacing: 0.1em; text-transform: uppercase; }

        /* ── TESTIMONIALS ── */
        .trust-row {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: var(--border); margin-top: 2.75rem;
        }
        .trust-card { background: var(--surface); padding: 2rem; transition: background 0.35s; border-radius: 8px; }
        .trust-q {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.08rem; font-weight: 300; font-style: italic;
          line-height: 1.7; color: var(--text2); margin-bottom: 1.4rem;
        }
        .trust-q::before {
          content: '\u201e'; font-size: 3.5rem; line-height: 0;
          vertical-align: -0.55rem; color: var(--gold); opacity: 0.5;
          margin-right: 0.05rem; font-style: normal;
        }
        .trust-auth { font-size: 0.74rem; color: var(--muted); }
        .trust-auth strong { display: block; color: var(--text2); font-weight: 400; margin-bottom: 0.15rem; }

        .trust-logos {
          display: flex; align-items: center; justify-content: center;
          gap: 2.5rem; margin-top: 2.75rem; flex-wrap: wrap; opacity: 0.3;
        }
        .trust-logo { font-size: 0.68rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--text); }

        /* ── ANIMATIONS ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bob {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(6px); }
        }

        /* ── RESPONSIVE ── */
        /* HAMBURGER + MOBILE-MENU */
        .hamburger {
          display: none; flex-direction: column; gap: 5px;
          background: none; border: none; cursor: pointer; padding: 6px;
        }
        .hamburger span {
          display: block; width: 22px; height: 2px;
          background: var(--text2); border-radius: 1px;
          transition: transform 0.25s, opacity 0.25s;
        }
        .mobile-menu {
          display: none; position: absolute; top: 100%; left: 0; right: 0;
          background: var(--surface); border-bottom: 1px solid var(--border);
          flex-direction: column; padding: 0.5rem 1.5rem 1rem;
          box-shadow: var(--shadow); z-index: 99;
          transition: background 0.35s;
        }
        .mobile-menu.open { display: flex; }
        .mobile-menu a {
          font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--text2); text-decoration: none;
          padding: 0.85rem 0; border-bottom: 1px solid var(--border2);
          transition: color 0.2s;
        }
        .mobile-menu a:last-child { border-bottom: none; }
        .mobile-menu a:hover { color: var(--gold); }

        @media (max-width: 900px) {
          .kck-nav { padding: 1rem 1.5rem; }
          .nav-center { display: none; }
          .hamburger { display: flex; }
          .nav-logo { font-size: 0.88rem; white-space: nowrap; }
          .staffel-grid { grid-template-columns: repeat(2, 1fr); }
          .tool-grid { grid-template-columns: 1fr 1fr; }
          .artikel-grid { grid-template-columns: 1fr; }
          .artikel-card.feat { grid-row: unset; }
          .trust-row { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .staffel-grid { grid-template-columns: 1fr; }
          .tool-grid { grid-template-columns: 1fr; }
          .hero-form { flex-direction: column; }
          .hero-form input { border-right: 1px solid var(--border); border-bottom: none; }
          .staffel-foot { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .theme-label { display: none; }
        }
      `}</style>

      <div className={`kck-root ${theme}`}>

        {/* NAV */}
        <nav className="kck-nav">
          <Link href="/" className="nav-logo">KI-Coaching<span> Kompass</span></Link>
          <ul className="nav-center">
            <li><a href="#">Beratung</a></li>
            <li><Link href="/workshop">Workshop</Link></li>
            <li><a href="https://isha.de" target="_blank" rel="noopener noreferrer">Zuhören</a></li>
            <li><Link href="/kompass">Kompass</Link></li>
            <li><a href="#">Kontakt</a></li>
          </ul>
          <div className="nav-right">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Farbschema wechseln" />
            <a href="#newsletter" className="nav-cta">Warteliste</a>
            <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menü öffnen">
              <span /><span /><span />
            </button>
          </div>
          <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
            <a href="#" onClick={() => setMenuOpen(false)}>Beratung</a>
            <Link href="/workshop" onClick={() => setMenuOpen(false)}>Workshop</Link>
            <a href="https://isha.de" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>Zuhören ↗</a>
            <Link href="/kompass" onClick={() => setMenuOpen(false)}>Kompass</Link>
            <a href="#" onClick={() => setMenuOpen(false)}>Kontakt</a>
          </div>
        </nav>

        {/* HERO */}
        <div className="hero">
          <div className="hero-orb" />
          <p className="hero-eyebrow">{startseite?.heroEyebrow ?? "KI-Coaching Orientierungsplattform"}</p>
          <h1 className="hero-title">
            {startseite?.heroTitel ?? <>KI hat kein Ego.<br />Aber es braucht <em>Präsenz.</em></>}
          </h1>
          <p className="hero-sub">
            {startseite?.heroUntertitel ?? <>Orientierung für Menschen, die <strong>KI zur persönlichen Reflexion</strong> nutzen —
            oder es vorhaben. Kein Tool-Hype. Kein Selbstoptimierungsversprechen. Nur ehrliche Begleitung.</>}
          </p>
          {!submitted ? (
            <>
              <form className="hero-form" onSubmit={handleSubmit} id="newsletter">
                <input
                  type="email" placeholder="Deine E-Mail-Adresse"
                  value={email} onChange={e => setEmail(e.target.value)} required
                />
                <button type="submit">{startseite?.ctaText ?? "Auf die Warteliste"}</button>
              </form>
              <p className="hero-note">{startseite?.heroNote ?? "Kein Spam. Kein Algorithmus. Nur echte Impulse."}</p>
            </>
          ) : (
            <p className="success-msg">{startseite?.heroSuccessMsg ?? "Willkommen im Kompass-Kreis. Wir melden uns."}</p>
          )}
          <div className="hero-scroll">
            <span>Weiter</span>
            <div className="scroll-line" />
          </div>
        </div>

        <hr className="divider" />

        {/* STAFFELSTAB */}
        <section id="methode" className="sec">
          <div className="sec-in">
            <p className="eyebrow">{startseite?.staffelEyebrow ?? "Das Staffelstab-Modell"}</p>
            <h2 className="sec-title">{startseite?.staffelTitel ?? <>Vom Gespräch zur KI —<br /><em>und zurück zum Menschen.</em></>}</h2>
            <p className="sec-lead">{startseite?.staffelLead ?? "Ein hybrides Begleitformat in vier Phasen: echte menschliche Tiefenarbeit, nahtlos übergeben an einen personalisierten KI-Begleiter — und zurück."}</p>
            <div className="staffel-grid">
              {(startseite?.staffelSchritte?.length
                ? startseite.staffelSchritte.map(s => ({ n: s.nummer, icon: s.icon, t: s.titel, d: s.beschreibung }))
                : [
                  { n: "01", icon: "◎", t: "Tiefenhören", d: "1,5–2 Stunden Einzelsitzung. Kein Ratschlag, keine Agenda. Nur der Raum, der entsteht, wenn jemand wirklich zuhört." },
                  { n: "02", icon: "⟶", t: "Staffelübergabe", d: "Das Transkript der Session wird zur Basis deines persönlichen CoachBots — kontextualisiert, anonymisiert, übergeben." },
                  { n: "03", icon: "◈", t: "KI-Begleitung", d: "Ein Monat strukturierte Bot-Begleitung: tägliche Reflexionsfragen, Anker-Calls, eigenem Tempo folgen." },
                  { n: "04", icon: "◯", t: "Integration", d: "Abschlusssitzung mit dem Coach: Was hat sich bewegt? Was bleibt? Was trägt dich weiter?" },
                ]
              ).map(s => (
                <div key={s.n} className="staffel-step">
                  <div className="step-num">{s.n}</div>
                  <div className="step-icon">{s.icon}</div>
                  <p className="step-ttl">{s.t}</p>
                  <p className="step-desc">{s.d}</p>
                </div>
              ))}
            </div>
            <div className="staffel-foot">
              <div>
                <span className="price-amt">{startseite?.staffelPreis ?? "490 €"}</span>
                <span className="price-lbl">{startseite?.staffelPreisLabel ?? "Einstiegsangebot · inkl. MwSt."}</span>
              </div>
              <a href="#newsletter" className="btn-primary">{startseite?.staffelCtaText ?? "Platz sichern"}</a>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* TOOLS */}
        <section id="tools" className="sec alt">
          <div className="sec-in">
            <div className="tool-hdr">
              <div>
                <p className="eyebrow">{startseite?.toolsEyebrow ?? "KI-Tool-Kompass"}</p>
                <h2 className="sec-title" style={{marginBottom: 0}}>{startseite?.toolsTitel ?? <>Welches Tool passt<br /><em>zu dir?</em></>}</h2>
              </div>
              <div className="filters">
                {["Alle", "Reflexion", "Journaling", "Therapienah", "Gesprächs-KI"].map(f => (
                  <button key={f} className={`filter-btn${f === "Alle" ? " on" : ""}`}>{f}</button>
                ))}
              </div>
            </div>
            <div className="tool-grid">
              {(tools.length > 0 ? tools.map(t => ({
                name: t.name, badge: t.badge ?? "", star: t.featured,
                desc: t.beschreibung ?? "", tags: t.tags ?? [],
              })) : [
                { name: "CoachBot.ai", badge: "Empfohlen", star: true, desc: "Personalisierte KI-Begleitung auf Basis eigener Session-Transkripte. Versteht Kontext — nicht nur Prompts.", tags: ["Coaching", "Hybrid", "Deutsch"] },
                { name: "Reflectly", badge: "Journaling", star: false, desc: "Geführte Tagebuch-KI mit emotionaler Intelligenz. Einfacher Einstieg für Selbstreflexion im Alltag.", tags: ["Journaling", "Mobil", "EN/DE"] },
                { name: "Woebot", badge: "Therapienah", star: false, desc: "CBT-basierter Gesprächsbot. Gut erforscht, klar strukturiert — kein Ersatz für Therapie, aber ein Begleiter.", tags: ["CBT", "Mental Health", "EN"] },
                { name: "Pi (Inflection)", badge: "Gesprächs-KI", star: false, desc: "Warme, neugierige KI-Präsenz für offene Gespräche. Kein Task-Tool — ein Denk-Gesprächspartner.", tags: ["Gespräch", "Empathisch", "EN"] },
                { name: "ChatGPT", badge: "Vielseitig", star: false, desc: "Bekannt, flexibel, kontextfähig. Mit den richtigen Prompts ein starkes Reflexionswerkzeug.", tags: ["Allzweck", "Prompts", "DE/EN"] },
                { name: "Claude", badge: "Nuanciert", star: false, desc: "Langer Kontext, philosophische Tiefe, nuancierte Sprache. Besonders stark in reflektiven Gesprächsformaten.", tags: ["Reflexion", "Longform", "DE/EN"] },
              ]).map(t => (
                <div key={t.name} className="tool-card">
                  <div className="tool-card-hdr">
                    <span className="tool-name">{t.name}</span>
                    <span className={`tool-badge${t.star ? " star" : ""}`}>{t.badge}</span>
                  </div>
                  <p className="tool-desc">{t.desc}</p>
                  <div className="tool-tags">
                    {t.tags.map(tag => <span key={tag} className="tool-tag">{tag}</span>)}
                  </div>
                </div>
              ))}
            </div>
            <div className="tool-foot">
              <span style={{fontSize: "0.79rem", color: "var(--muted)"}}>{startseite?.toolsFooterText ?? "12 Tools im Vergleich — gefiltert nach deinem Kontext."}</span>
              <a href="/tools" className="btn-outline">{startseite?.toolsFooterCta ?? "Alle Tools entdecken"}</a>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* ARTIKEL */}
        <section id="artikel" className="sec">
          <div className="sec-in">
            <p className="eyebrow">{startseite?.artikelEyebrow ?? "Meine Sicht · Artikel"}</p>
            <h2 className="sec-title">{startseite?.artikelTitel ?? <>Denken über KI —<br /><em>ohne Euphorie, ohne Angst.</em></>}</h2>
            <div className="artikel-grid">
              {(artikel.length > 0 ? artikel.map((a, i) => (
                <a key={a._id} href={`/artikel/${a._id}`} className={`artikel-card${i === 0 ? " feat" : ""}`}>
                  <p className="art-cat">{a.kategorie ?? "Artikel"}</p>
                  <h3 className="art-ttl">{a.titel}</h3>
                  {a.excerpt && <p className="art-exc">{a.excerpt}</p>}
                  <div className="art-foot">
                    <span>{a.datum ?? ""}{a.autor ? ` · ${a.autor}` : ""}</span>
                  </div>
                </a>
              )) : [
                { href: "/artikel/ki-hat-kein-ego", cat: "Meine Sicht", ttl: "KI hat kein Ego — aber sie braucht jemanden, der präsent ist", exc: "Was passiert, wenn ein Werkzeug ohne Ego auf einen Menschen trifft, der seins vergessen hat? Über Projektion, Stille und die seltsame Gnade einer Maschine, die niemals urteilt.", foot: "März 2025 · 8 Min.", auth: "Bernd Schmid · Meine Sicht", feat: true },
                { href: "/artikel/theory-u-und-ki", cat: "Coach-Perspektive", ttl: "Theory U trifft KI: Presencing im Chatfenster?", exc: "Otto Scharmers Tiefenbewegung als Reflexionsrahmen — und was davon im Dialog mit einem Sprachmodell tatsächlich möglich ist.", foot: "Feb. 2025 · 6 Min.", auth: "Coach", feat: false },
                { href: "/artikel/ki-tools-vergleich-2025", cat: "Unternehmen", ttl: "KI-Coaching-Tools 2025: Was Führungskräfte wirklich brauchen", exc: "Marktüberblick ohne Affiliate-Brille: Welche Tools halten, was sie versprechen — und welche vor allem Hype sind.", foot: "Jan. 2025 · 5 Min.", auth: "Unternehmen", feat: false },
              ].map(a => (
                <a key={a.href} href={a.href} className={`artikel-card${a.feat ? " feat" : ""}`}>
                  <p className="art-cat">{a.cat}</p>
                  <h3 className="art-ttl">{a.ttl}</h3>
                  <p className="art-exc">{a.exc}</p>
                  <div className="art-foot">
                    <span>{a.foot}</span>
                    <span className="art-persp">{a.auth}</span>
                  </div>
                </a>
              )))}
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* TESTIMONIALS */}
        <section className="sec alt">
          <div className="sec-in">
            <p className="eyebrow">{startseite?.testimonialsEyebrow ?? "Stimmen"}</p>
            <h2 className="sec-title">{startseite?.testimonialsTitel ?? <>Was Menschen sagen,<br /><em>die dabei waren.</em></>}</h2>
            <div className="trust-row">
              {(testimonials.length > 0 ? testimonials.map(t => ({
                q: t.zitat, name: t.name, role: t.rolle ?? "", id: t._id,
              })) : [
                { id: "1", q: "Das Gespräch mit Bernd hat etwas in mir aufgebrochen, das ich nicht benennen konnte. Der CoachBot hat mir geholfen, es zu halten.", name: "M. K.", role: "Führungskraft, Freiburg" },
                { id: "2", q: "Ich war skeptisch, ob KI in einem Coaching-Kontext Sinn ergibt. Nach dem Staffelstab-Format weiß ich: Es kommt auf den Rahmen an.", name: "S. R.", role: "Unternehmensberaterin, München" },
                { id: "3", q: "Keine App ersetzt echtes Zuhören. Aber dieser Ansatz kombiniert beides — und das macht den Unterschied.", name: "T. B.", role: "Coach i.A., Hamburg" },
              ]).map(t => (
                <div key={t.id} className="trust-card">
                  <p className="trust-q">{t.q}</p>
                  <p className="trust-auth"><strong>{t.name}</strong>{t.role}</p>
                </div>
              ))}
            </div>
            <div className="trust-logos">
              {(startseite?.trustLogos ?? ["ICF Member", "Nancy Kline · Thinking Environment", "Theory U · Otto Scharmer", "Viktor Frankl Institut"]).map(l => (
                <span key={l} className="trust-logo">{l}</span>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER CTA */}
        <section className="sec" id="newsletter-footer">
          <div className="sec-in" style={{textAlign: "center"}}>
            <p className="eyebrow" style={{justifyContent: "center"}}>{startseite?.newsletterEyebrow ?? "Warteliste"}</p>
            <h2 className="sec-title" style={{textAlign: "center"}}>{startseite?.newsletterTitel ?? <>Bereit, wenn du es bist.<br /><em>Kein Druck.</em></>}</h2>
            <p className="sec-lead" style={{margin: "0 auto", textAlign: "center"}}>
              {startseite?.newsletterLead ?? "Trag dich ein und erfahre als Erste/r, wenn das Staffelstab-Bundle und der vollständige Tool-Kompass live gehen."}
            </p>
            {!submitted ? (
              <form className="hero-form" onSubmit={handleSubmit} style={{margin: "2.25rem auto 0"}}>
                <input type="email" placeholder="Deine E-Mail-Adresse" value={email} onChange={e => setEmail(e.target.value)} required />
                <button type="submit">{startseite?.newsletterCtaText ?? "Eintragen"}</button>
              </form>
            ) : (
              <p className="success-msg" style={{marginTop: "2rem"}}>{startseite?.newsletterSuccessMsg ?? "Du bist dabei. Bis bald."}</p>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{
          background: "var(--bg)", borderTop: "1px solid var(--border)",
          padding: "1.75rem 2.5rem", display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap" as const, gap: "1rem",
          transition: "background 0.35s",
        }}>
          <span style={{fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.04em"}}>
            {startseite?.footerCopyright ?? "© 2025 KI-Coaching Kompass · Bernd Schmid · Freiburg"}
          </span>
          <ul style={{display: "flex", gap: "2rem", listStyle: "none"}}>
            {["Impressum", "Datenschutz", "Kontakt"].map(l => (
              <li key={l}>
                <a href={`/${l.toLowerCase()}`} style={{fontSize: "0.7rem", color: "var(--muted)", textDecoration: "none", letterSpacing: "0.04em"}}>
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </footer>

      </div>
    </>
  );
}
