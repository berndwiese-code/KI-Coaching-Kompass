"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zuhoeren } from "@/sanity/lib/queries";

type Theme = "light" | "dark";

type ZuhoerenClientProps = {
  zuhoeren?: Zuhoeren | null;
};

export default function ZuhoerenClient({ zuhoeren }: ZuhoerenClientProps) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
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

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .zh-root {
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          line-height: 1.75;
          overflow-x: hidden;
          transition: background 0.35s, color 0.35s;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        .zh-root.light {
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
          background: #f6f3ee;
          color: #1c1916;
        }

        .zh-root.dark {
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
          background: #141210;
          color: #ece7db;
        }

        /* ── NAV ── */
        .zh-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.1rem 2.5rem;
          border-bottom: 1px solid var(--border2);
          background: var(--bg);
          backdrop-filter: blur(16px);
          transition: background 0.35s, border-color 0.35s;
        }
        .nav-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem; font-weight: 400; letter-spacing: 0.06em;
          color: var(--gold2); text-decoration: none;
        }
        .nav-logo span { color: var(--text2); font-weight: 300; }
        .nav-center { display: none; }
        .nav-right { display: flex; align-items: center; gap: 1rem; }
        .theme-toggle {
          position: relative; width: 44px; height: 24px; border-radius: 12px;
          border: 1px solid var(--border); background: var(--bg3);
          cursor: pointer; transition: background 0.3s; flex-shrink: 0;
        }
        .theme-toggle::after {
          content: ''; position: absolute; top: 3px;
          width: 16px; height: 16px; border-radius: 50%;
          background: var(--gold); transition: left 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .zh-root.light .theme-toggle::after { left: 3px; }
        .zh-root.dark  .theme-toggle::after { left: 23px; }
        .nav-cta {
          font-size: 0.73rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--bg); background: var(--gold); padding: 0.5rem 1.2rem;
          text-decoration: none; font-weight: 500; transition: background 0.2s;
          white-space: nowrap; border-radius: 6px;
        }
        .nav-cta:hover { background: var(--gold2); }

        /* ── HAMBURGER ── */
        .hamburger {
          display: flex; flex-direction: column; justify-content: center;
          gap: 5px; width: 36px; height: 36px; cursor: pointer;
          background: none; border: none; padding: 4px; flex-shrink: 0;
        }
        .hamburger span {
          display: block; height: 1.5px; background: var(--text2);
          border-radius: 2px; transition: all 0.25s;
        }
        .hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* ── MOBILE MENU ── */
        .mobile-menu {
          display: none; flex-direction: column;
          position: absolute; top: 100%; right: 0; left: auto;
          width: 240px;
          background: var(--surface); border: 1px solid var(--border);
          border-top: none; border-radius: 0 0 8px 8px;
          box-shadow: var(--shadow); padding: 0.5rem 0; z-index: 99;
        }
        .mobile-menu.open { display: flex; }
        .mobile-menu a {
          font-size: 0.82rem; letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--text2); text-decoration: none;
          padding: 0.85rem 1.5rem; border-bottom: 1px solid var(--border2);
          transition: color 0.2s;
        }
        .mobile-menu a:last-child { border-bottom: none; }
        .mobile-menu a:hover, .mobile-menu a.active { color: var(--gold); }
        .mobile-menu a.sub-item {
          padding-left: 2.5rem; font-size: 0.68rem;
          color: var(--muted);
        }
        .mobile-menu a.sub-item::before { content: '→ '; color: var(--gold); }
        @media (max-width: 600px) {
          .nav-cta { display: none; }
          .mobile-menu { left: auto; right: 0; width: min(88vw, 300px); }
        }

        /* ── HERO ── */
        .zh-hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 312px;
          gap: 0;
          align-items: center;
          padding: 0;
          background: var(--bg);
          position: relative;
          overflow: hidden;
        }
        .zh-hero-orb {
          position: absolute; top: 0; right: 0;
          width: 60%; height: 100%;
          background: var(--bg2);
          clip-path: polygon(18% 0%, 100% 0%, 100% 100%, 0% 100%);
          pointer-events: none;
          transition: background 0.35s;
        }
        .zh-hero-text {
          padding: 10rem 3rem 6rem 10vw;
          position: relative; z-index: 2;
        }
        .eyebrow {
          display: inline-flex; align-items: center; gap: 0.6rem;
          font-size: 0.65rem; letter-spacing: 0.24em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 2.5rem;
        }
        .eyebrow::before { content: '—'; color: var(--gold); }
        .zh-hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.4rem, 4.5vw, 4rem);
          font-weight: 300; line-height: 1.15; color: var(--text);
          margin-bottom: 2rem;
        }
        .zh-hero-title em { font-style: italic; color: var(--gold2); }
        .zh-hero-subtitle {
          font-size: 1.05rem; color: var(--muted);
          line-height: 1.8; max-width: 440px;
          margin-bottom: 3rem;
        }
        .zh-hero-cta {
          display: inline-block;
          font-size: 0.74rem; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--bg); background: var(--gold);
          padding: 0.85rem 2.2rem; border-radius: 6px;
          text-decoration: none; font-weight: 500;
          transition: background 0.2s;
        }
        .zh-hero-cta:hover { background: var(--gold2); }
        .zh-hero-image {
          position: relative; z-index: 2;
          height: min(70vh, 576px);
          align-self: center;
          overflow: hidden;
          border-radius: 0 0 0 8px;
        }
        .zh-hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
        }

        /* ── SECTIONS ── */
        .zh-section {
          max-width: 820px;
          margin: 0 auto;
          padding: 7rem 2rem;
        }
        .zh-section.wide {
          max-width: 1100px;
        }
        .zh-section-label {
          font-size: 0.63rem; letter-spacing: 0.26em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 2rem;
        }

        /* ── PROSE BLOCKS ── */
        .zh-prose {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.45rem, 2.2vw, 1.85rem);
          font-weight: 300; line-height: 1.65;
          color: var(--text2);
        }
        .zh-prose p { margin-bottom: 1.4em; }
        .zh-prose p:last-child { margin-bottom: 0; }
        .zh-prose em { font-style: italic; color: var(--text); }
        .zh-prose strong { font-weight: 400; color: var(--text); }

        /* ── STANDING QUOTE ── */
        .zh-standing {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          font-weight: 300; font-style: italic;
          color: var(--text); line-height: 1.3;
          border-left: 2px solid var(--gold);
          padding-left: 2rem;
          margin: 5rem 0;
        }

        /* ── DIVIDER ── */
        .zh-divider {
          border: none;
          border-top: 1px solid var(--border);
          max-width: 120px; margin: 0 auto;
        }

        /* ── FOR WHOM LIST ── */
        .zh-list {
          list-style: none; padding: 0;
          display: flex; flex-direction: column; gap: 0;
          margin: 2.5rem 0 3rem;
        }
        .zh-list li {
          font-size: 1.05rem; color: var(--text2);
          padding: 1.1rem 0;
          border-bottom: 1px solid var(--border2);
          display: flex; align-items: baseline; gap: 1rem;
          line-height: 1.6;
        }
        .zh-list li:first-child { border-top: 1px solid var(--border2); }
        .zh-list li::before {
          content: '—';
          color: var(--gold); font-size: 0.85rem;
          flex-shrink: 0;
        }

        /* ── DISTINCTION BOX ── */
        .zh-distinction {
          background: var(--bg2);
          border-radius: 12px;
          padding: 3.5rem 4rem;
          margin: 4rem 0;
        }
        .zh-distinction-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.4rem, 2.2vw, 1.9rem);
          font-weight: 300; color: var(--text);
          margin-bottom: 2rem;
        }
        .zh-distinction p {
          font-size: 1rem; color: var(--text2);
          line-height: 1.8; margin-bottom: 1.2em;
        }
        .zh-distinction p:last-child { margin-bottom: 0; }

        /* ── WIRKUNG ── */
        .zh-wirkung-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
          margin: 3rem 0;
        }
        .zh-wirkung-item {
          background: var(--surface);
          padding: 2.5rem 2rem;
        }
        .zh-wirkung-item p {
          font-size: 1rem; color: var(--text2); line-height: 1.7;
        }
        .zh-wirkung-item p::before {
          content: '— ';
          color: var(--gold);
        }

        /* ── BANNER IMAGE ── */
        .zh-banner {
          width: 100%;
          margin: 0;
          overflow: hidden;
          position: relative;
          max-height: 520px;
        }
        .zh-banner img {
          width: 100%;
          height: 100%;
          max-height: 520px;
          object-fit: cover;
          object-position: center;
          display: block;
        }
        .zh-banner-caption {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 3rem;
          background: linear-gradient(to top, rgba(20,18,16,0.75) 0%, transparent 100%);
        }
        .zh-banner-caption p {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem; font-style: italic;
          color: rgba(255,255,255,0.85);
        }

        /* ── KI SECTION ── */
        .zh-ki-section {
          background: var(--bg2);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 6rem 2rem;
        }
        .zh-ki-inner {
          max-width: 820px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }
        .zh-ki-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.7rem, 2.5vw, 2.4rem);
          font-weight: 300; line-height: 1.25;
          color: var(--text); margin-bottom: 1.5rem;
        }
        .zh-ki-title em { font-style: italic; color: var(--gold2); }
        .zh-ki-body {
          font-size: 1rem; color: var(--text2); line-height: 1.8;
          margin-bottom: 1rem;
        }
        .zh-ki-list {
          list-style: none; padding: 0; margin: 1.5rem 0;
        }
        .zh-ki-list li {
          font-size: 0.95rem; color: var(--text2);
          padding: 0.5rem 0;
          display: flex; gap: 0.75rem; align-items: baseline;
        }
        .zh-ki-list li::before {
          content: '›';
          color: var(--gold); font-size: 1.1rem;
          flex-shrink: 0;
        }
        .zh-ki-note {
          font-size: 0.83rem; color: var(--muted);
          font-style: italic; line-height: 1.6;
        }

        /* ── CTA SECTION ── */
        .zh-cta-section {
          padding: 9rem 2rem;
          text-align: center;
          background: var(--bg);
        }
        .zh-cta-eyebrow {
          font-size: 0.63rem; letter-spacing: 0.26em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 2rem; display: block;
        }
        .zh-cta-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 3.5vw, 3.2rem);
          font-weight: 300; line-height: 1.2;
          color: var(--text); max-width: 680px;
          margin: 0 auto 2rem;
        }
        .zh-cta-title em { font-style: italic; color: var(--gold2); }
        .zh-cta-body {
          font-size: 1.05rem; color: var(--muted);
          max-width: 480px; margin: 0 auto 3rem;
          line-height: 1.8;
        }
        .zh-cta-btn {
          display: inline-block;
          font-size: 0.74rem; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--bg); background: var(--gold);
          padding: 1rem 2.6rem; border-radius: 6px;
          text-decoration: none; font-weight: 500;
          transition: background 0.2s;
        }
        .zh-cta-btn:hover { background: var(--gold2); }
        .zh-cta-note {
          font-size: 0.82rem; color: var(--muted);
          margin-top: 1.5rem; font-style: italic;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .zh-nav { padding: 0.9rem 1.5rem; }
          .nav-logo { font-size: 0.88rem; white-space: nowrap; }
          .zh-hero {
            grid-template-columns: 1fr;
            min-height: auto;
          }
          .zh-hero-orb { display: none; }
          .zh-hero-text {
            padding: 9rem 2rem 4rem;
            text-align: center;
          }
          .zh-hero-subtitle { max-width: 100%; margin-left: auto; margin-right: auto; }
          .zh-hero-image {
            height: 55vw;
            min-height: 280px;
          }
          .zh-ki-inner { grid-template-columns: 1fr; gap: 2.5rem; }
          .zh-wirkung-grid { grid-template-columns: 1fr; }
          .zh-distinction { padding: 2.5rem 2rem; }
          .zh-section { padding: 5rem 2rem; }
        }
        @media (max-width: 600px) {
          .nav-cta { display: none; }
          .mobile-menu { left: auto; right: 0; width: min(88vw, 300px); }
          .zh-hero-text { padding: 8rem 1.5rem 3rem; }
          .zh-section { padding: 4rem 1.5rem; }
          .zh-standing { padding-left: 1.25rem; margin: 3rem 0; }
          .zh-distinction { padding: 2rem 1.5rem; }
          .zh-ki-section { padding: 4rem 1.5rem; }
          .zh-cta-section { padding: 6rem 1.5rem; }
        }
      `}</style>

      <div className={`zh-root ${theme}`}>
        {/* NAV */}
        <nav className="zh-nav" style={{ position: "relative" }}>
          <Link href="/" className="nav-logo">
            KI<span>·</span>Coaching<span>·</span>Kompass
          </Link>
          <div className="nav-center" />
          <div className="nav-right">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Theme wechseln" />
            <a href="mailto:bernd.wiese@googlemail.com" className="nav-cta">Termin anfragen</a>
            <button
              className={`hamburger ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menü"
            >
              <span /><span /><span />
            </button>
          </div>
          <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
            <Link href="/" onClick={() => setMenuOpen(false)}>Coaching und KI</Link>
            <Link href="/ki-coaching" onClick={() => setMenuOpen(false)}>KI-Coaching</Link>
            <Link href="/ki-coaching/beratung" className="sub-item" onClick={() => setMenuOpen(false)}>Beratung</Link>
            <Link href="/ki-coaching/workshop" className="sub-item" onClick={() => setMenuOpen(false)}>Einführung von KI-Coaching</Link>
            <Link href="/ki-coaching/kompass" className="sub-item" onClick={() => setMenuOpen(false)}>KI-Tools entdecken</Link>
            <Link href="/zuhoeren" className="active" onClick={() => setMenuOpen(false)}>Tiefes Zuhören (und KI)</Link>
            <Link href="/ueber-mich" onClick={() => setMenuOpen(false)}>Über mich</Link>
          </div>
        </nav>

        {/* HERO */}
        <section className="zh-hero">
          <div className="zh-hero-orb" />
          <div className="zh-hero-text">
            <div className="eyebrow">Zuhören</div>
            <h1 className="zh-hero-title" style={{ whiteSpace: "pre-line" }}>
              {zuhoeren?.heroTitel ?? <>Die meisten Menschen<br />werden gehört.<br />Aber nur selten<br /><em>wirklich.</em></>}
            </h1>
            <p className="zh-hero-subtitle" style={{ whiteSpace: "pre-line" }}>
              {zuhoeren?.heroSubtitel ?? "Hier geht es nicht um Antworten.\nSondern darum, dass du dich selbst wieder hörst."}
            </p>
            <a href={`mailto:${zuhoeren?.kontaktEmail ?? "bernd.wiese@googlemail.com"}`} className="zh-hero-cta">
              {zuhoeren?.heroCta ?? "Gespräch anfragen"}
            </a>
          </div>
          <div className="zh-hero-image" style={{ position: "relative" }}>
            <img
              src="/bernd-wiese.jpg"
              alt="Bernd Wiese – im Gespräch"
              loading="eager"
            />
            <Link href="/ueber-mich" style={{
              position: "absolute",
              bottom: "1.5rem",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "0.7rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.85)",
              background: "rgba(0,0,0,0.35)",
              backdropFilter: "blur(6px)",
              padding: "0.4rem 1rem",
              borderRadius: "20px",
              textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "background 0.2s",
            }}>
              Über mich →
            </Link>
          </div>
        </section>

        {/* WAS ZUHÖREN BEDEUTET */}
        <section className="zh-section">
          <div className="zh-section-label">Was hier anders ist</div>
          <div className="zh-prose">
            <p>
              Zuhören, wie ich es verstehe, ist kein Technik-Tool.<br />
              Kein Coaching-Format.
            </p>
            <p>
              Es ist ein <em>Raum.</em>
            </p>
            <p>
              Ein Raum, in dem nichts bewertet wird.<br />
              Nichts optimiert werden muss.
            </p>
            <p>
              In dem du sagen kannst, was da ist —<br />
              auch das, was noch unfertig ist.
            </p>
          </div>
          <div className="zh-standing">
            {zuhoeren?.zitatKlarheit ?? `\u201eKlarheit entsteht nicht, weil jemand sie dir gibt. Sondern weil sie in dir bereits da ist.\u201c`}
          </div>
          <div className="zh-prose">
            <p>
              Und oft passiert genau dort etwas Entscheidendes:<br />
              Dinge ordnen sich.<br />
              Innere Spannungen lösen sich.
            </p>
            <p>
              Nicht, weil ich etwas <em>mache</em>.<br />
              Sondern weil Zuhören wirkt.
            </p>
          </div>
        </section>

        <hr className="zh-divider" />

        {/* WARUM ZUHÖREN WIRKT */}
        <section className="zh-section">
          <div className="zh-section-label">Warum Zuhören wirkt</div>
          <div className="zh-prose">
            <p>
              Viele versuchen, ihre Gedanken mit ihrem Kopf zu ordnen.<br />
              Das ist oft, als würde man versuchen, sich selbst aus dem Sumpf zu ziehen.
            </p>
            <p>
              Wenn du jedoch wirklich gehört wirst, passiert etwas anderes:
            </p>
            <p>
              Dein System beginnt, sich selbst zu regulieren.<br />
              Deine Wahrnehmung wird feiner.<br />
              Du kommst näher an das, was für dich wirklich stimmt.
            </p>
            <p>
              Zuhören ist kein passiver Prozess.<br />
              Es ist ein aktiver Raum, in dem <em>Bewusstsein entsteht.</em>
            </p>
          </div>
        </section>

        <hr className="zh-divider" />

        {/* FÜR WEN */}
        <section className="zh-section">
          <div className="zh-section-label">Für wen diese Sitzungen sind</div>
          <div className="zh-prose" style={{ marginBottom: "2rem" }}>
            <p>Menschen kommen zu mir, wenn sie…</p>
          </div>
          <ul className="zh-list">
            <li>viel im Kopf sind und nicht mehr klar sehen</li>
            <li>vor einer Entscheidung stehen und keine Ratschläge, sondern Klarheit brauchen</li>
            <li>sich im Kreis drehen und merken: Es wäre gut, das einmal auszusprechen</li>
            <li>etwas sagen wollen, ohne bewertet zu werden</li>
            <li>beruflich viel Verantwortung tragen und selten wirklich gehört werden</li>
            <li>spüren, dass „irgendetwas nicht stimmt", es aber nicht greifen können</li>
            <li>einfach einmal vollständig gehört werden wollen — ohne Rolle, ohne Funktion</li>
          </ul>
          <div className="zh-prose">
            <p>
              Du musst nicht wissen, worum es genau geht.<br />
              Es reicht, dass du merkst: Es wäre gut, das einmal auszusprechen.
            </p>
          </div>
        </section>

        <hr className="zh-divider" />

        {/* WAS IM GESPRÄCH PASSIERT */}
        <section className="zh-section">
          <div className="zh-section-label">Was im Gespräch passiert</div>
          <div className="zh-prose">
            <p>Wir sprechen.</p>
            <p>Und ich höre zu.<br /><em>Wirklich.</em></p>
            <p>
              Ohne zu unterbrechen.<br />
              Ohne dich in eine Richtung zu lenken.
            </p>
            <p>
              Ich stelle Fragen — nicht, um dich zu steuern,<br />
              sondern um dich tiefer zu dir selbst zu bringen.
            </p>
            <p>Es gibt kein Ziel, das erreicht werden muss.</p>
          </div>
          <div className="zh-standing">
            {zuhoeren?.zitatGespraech ?? `\u201eUnd genau deshalb entsteht oft das, was sonst schwer zugänglich ist: echte Klarheit.\u201c`}
          </div>
        </section>

        {/* ABGRENZUNG */}
        <section className="zh-section">
          <div className="zh-distinction">
            <div className="zh-distinction-title">Das ist kein klassisches Coaching.</div>
            <p>Ich gebe dir keine Strategien vor.</p>
            <p>Ich analysiere dich nicht.</p>
            <p>Und ich versuche nicht, dich zu „verbessern".</p>
            <p>
              Stattdessen entsteht ein Raum,<br />
              in dem du dich selbst wieder besser wahrnehmen kannst.
            </p>
            <p>
              Und das ist oft nachhaltiger<br />
              als jede gut gemeinte Lösung von außen.
            </p>
          </div>
        </section>

        {/* WIRKUNG */}
        <section className="zh-section">
          <div className="zh-section-label">Was du mitnehmen kannst</div>
          <div className="zh-prose" style={{ marginBottom: "2rem" }}>
            <p>Viele gehen aus einem Gespräch mit…</p>
          </div>
          <div className="zh-wirkung-grid">
            <div className="zh-wirkung-item">
              <p>mehr innerer Ruhe und einem Gefühl von Ordnung</p>
            </div>
            <div className="zh-wirkung-item">
              <p>klareren Gedanken, die sich von selbst geordnet haben</p>
            </div>
            <div className="zh-wirkung-item">
              <p>einer spürbaren Entlastung, die länger anhält</p>
            </div>
            <div className="zh-wirkung-item">
              <p>oder einer Entscheidung, die sich plötzlich stimmig anfühlt</p>
            </div>
          </div>
          <div className="zh-prose">
            <p>
              Nicht, weil etwas „gemacht" wurde.<br />
              Sondern weil Raum da war.
            </p>
          </div>
        </section>

        {/* BANNER IMAGE */}
        <div className="zh-banner">
          <img
            src="/zuhoeren-banner.jpg"
            alt="Zuhören und KI-Coaching — Tiefe Präsenz und klare Prozesse"
            loading="lazy"
          />
          <div className="zh-banner-caption">
            <p>Tiefe Präsenz und klare Prozesse — ein neuer Raum für Klarheit.</p>
          </div>
        </div>

        {/* ZUHÖREN + KI */}
        <section className="zh-ki-section">
          <div className="zh-ki-inner">
            <div>
              <div className="zh-section-label">Eine neue Dimension</div>
              <h2 className="zh-ki-title">
                Zuhören<br />
                <em>+ KI</em>
              </h2>
              <p className="zh-ki-body">
                Neben den klassischen Zuhör-Sitzungen biete ich auch eine erweiterte
                Form an: Zuhören in Kombination mit KI-gestützter Reflexion.
              </p>
              <p className="zh-ki-body">
                Hier wird das Gespräch — wenn du möchtest — zusätzlich durch eine
                KI gespiegelt. Nicht als Ersatz, sondern als Erweiterung.
              </p>
            </div>
            <div>
              <ul className="zh-ki-list">
                <li>Muster in deinen Worten sichtbar machen</li>
                <li>Gedanken strukturieren und sortieren</li>
                <li>neue Perspektiven anbieten, die du noch nicht bedacht hast</li>
                <li>das, was zwischen den Zeilen liegt, in Sprache bringen</li>
              </ul>
              <p className="zh-ki-note">
                Du bleibst dabei immer im Zentrum. Die KI ist kein „Coach",
                sondern ein Werkzeug für zusätzliche Klarheit — menschliches
                Zuhören und kollektive Intelligenz, die zusammenwirken.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="zh-cta-section">
          <span className="zh-cta-eyebrow">{zuhoeren?.ctaEyebrow ?? "Einladung"}</span>
          <h2 className="zh-cta-title" style={{ whiteSpace: "pre-line" }}>
            {zuhoeren?.ctaTitel ?? <>Wenn du das Gefühl hast,<br />dass es Zeit ist, einmal<br /><em>wirklich gehört zu werden.</em></>}
          </h2>
          <p className="zh-cta-body" style={{ whiteSpace: "pre-line" }}>
            {zuhoeren?.ctaBody ?? "Du musst nichts vorbereiten.\nDu darfst genau so kommen, wie du gerade bist."}
          </p>
          <a href={`mailto:${zuhoeren?.kontaktEmail ?? "bernd.wiese@googlemail.com"}`} className="zh-cta-btn">
            {zuhoeren?.ctaButton ?? "Gespräch anfragen"}
          </a>
          <p className="zh-cta-note">{zuhoeren?.ctaNote ?? "Ohne Verpflichtung. Einfach, um es einmal zu erleben."}</p>
        </section>

        {/* FOOTER */}
        <footer style={{
          borderTop: "1px solid var(--border2)",
          padding: "2rem",
          textAlign: "center",
          color: "var(--muted)",
          fontSize: "0.78rem",
          letterSpacing: "0.06em",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem"
        }}>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/" style={{ color: "var(--gold)", textDecoration: "none" }}>Startseite</Link>
            <Link href="/workshop" style={{ color: "var(--gold)", textDecoration: "none" }}>Workshop</Link>
            <Link href="/beratung" style={{ color: "var(--gold)", textDecoration: "none" }}>Beratung</Link>
            <Link href="/kompass" style={{ color: "var(--gold)", textDecoration: "none" }}>KI-Kompass</Link>
            <Link href="/ueber-mich" style={{ color: "var(--gold)", textDecoration: "none" }}>Über mich</Link>
          </div>
          <span>© 2025 KI·Coaching·Kompass · Bernd Wiese · Freiburg</span>
        </footer>
      </div>
    </>
  );
}
