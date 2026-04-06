"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Theme = "light" | "dark";

export default function KICoachingClient() {
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

        .kc-root {
          font-family: 'DM Sans', sans-serif;
          font-weight: 400; line-height: 1.75;
          overflow-x: hidden;
          transition: background 0.35s, color 0.35s;
          -webkit-font-smoothing: antialiased;
        }
        .kc-root.light {
          --bg: #f6f3ee; --bg2: #ede9e0; --bg3: #e2dbd0;
          --surface: #fdfcf9; --text: #1c1916; --text2: #2d2924;
          --muted: #6b5f54; --gold: #8c6820; --gold2: #a87e28;
          --border: rgba(140,104,32,0.20); --border2: rgba(140,104,32,0.10);
          --shadow: 0 2px 16px rgba(28,22,14,0.07), 0 1px 4px rgba(28,22,14,0.04);
          background: #f6f3ee; color: #1c1916;
        }
        .kc-root.dark {
          --bg: #141210; --bg2: #1b1815; --bg3: #232019;
          --surface: #1e1b17; --text: #ece7db; --text2: #c8bfad;
          --muted: #8c8274; --gold: #c2a03c; --gold2: #d4b24a;
          --border: rgba(194,160,60,0.14); --border2: rgba(194,160,60,0.07);
          --shadow: 0 4px 24px rgba(0,0,0,0.40), 0 1px 6px rgba(0,0,0,0.20);
          background: #141210; color: #ece7db;
        }

        /* NAV */
        .kc-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.1rem 2.5rem;
          border-bottom: 1px solid var(--border2);
          background: var(--bg); backdrop-filter: blur(16px);
          transition: background 0.35s, border-color 0.35s;
        }
        .nav-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem; font-weight: 400; letter-spacing: 0.06em;
          color: var(--gold2); text-decoration: none;
        }
        .nav-logo span { color: var(--text2); font-weight: 300; }
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
        .kc-root.light .theme-toggle::after { left: 3px; }
        .kc-root.dark  .theme-toggle::after { left: 23px; }
        .nav-cta {
          font-size: 0.73rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--bg); background: var(--gold); padding: 0.5rem 1.2rem;
          text-decoration: none; font-weight: 500; transition: background 0.2s;
          white-space: nowrap; border-radius: 6px;
        }
        .nav-cta:hover { background: var(--gold2); }

        /* HAMBURGER */
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

        /* MOBILE MENU */
        .mobile-menu {
          display: none; flex-direction: column;
          position: absolute; top: 100%; right: 0; left: auto;
          width: min(88vw, 300px);
          background: var(--surface); border: 1px solid var(--border);
          border-top: none; border-radius: 0 0 8px 8px;
          box-shadow: var(--shadow); padding: 0.5rem 0; z-index: 99;
        }
        .mobile-menu.open { display: flex; }
        .mobile-menu a {
          font-size: 0.72rem; letter-spacing: 0.07em; text-transform: uppercase;
          color: var(--text2); text-decoration: none;
          padding: 0.8rem 1.5rem; border-bottom: 1px solid var(--border2);
          transition: color 0.2s;
        }
        .mobile-menu a:last-child { border-bottom: none; }
        .mobile-menu a:hover, .mobile-menu a.active { color: var(--gold); }
        .mobile-menu a.sub-item {
          padding-left: 2.5rem; font-size: 0.68rem;
          color: var(--muted);
        }
        .mobile-menu a.sub-item::before { content: '→ '; color: var(--gold); }
        @media (max-width: 600px) { .nav-cta { display: none; } }

        /* HERO */
        .kc-hero {
          min-height: 60vh;
          display: flex; flex-direction: column; justify-content: center;
          padding: 11rem 2rem 6rem;
          max-width: 820px; margin: 0 auto;
        }
        .kc-eyebrow {
          display: inline-flex; align-items: center; gap: 0.6rem;
          font-size: 0.65rem; letter-spacing: 0.24em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 2rem;
        }
        .kc-eyebrow::before { content: '—'; color: var(--gold); }
        .kc-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.6rem, 4.5vw, 4rem);
          font-weight: 300; line-height: 1.15; color: var(--text);
          margin-bottom: 1.5rem;
        }
        .kc-title em { font-style: italic; color: var(--gold2); }
        .kc-lead {
          font-size: 1.05rem; color: var(--muted);
          line-height: 1.8; max-width: 560px;
          margin-bottom: 4rem;
        }

        /* CARDS */
        .kc-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          max-width: 820px; margin: 0 auto 3rem;
          padding: 0 2rem;
        }
        .kc-card {
          display: block;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 2.5rem 2rem;
          text-decoration: none;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
        }
        .kc-card:hover {
          border-color: var(--gold);
          box-shadow: var(--shadow);
          transform: translateY(-2px);
        }
        .kc-card-icon {
          font-size: 1.8rem; margin-bottom: 1.2rem; display: block;
        }
        .kc-card-label {
          font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 0.75rem; display: block;
        }
        .kc-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem; font-weight: 300;
          color: var(--text); line-height: 1.25; margin-bottom: 1rem;
        }
        .kc-card-body {
          font-size: 0.92rem; color: var(--text2); line-height: 1.7;
        }
        .kc-card-arrow {
          display: block; margin-top: 1.5rem;
          font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--gold);
        }

        /* LINKS SECTION */
        .kc-links {
          max-width: 820px; margin: 0 auto 6rem;
          padding: 0 2rem;
          display: flex; gap: 2rem; flex-wrap: wrap;
        }
        .kc-link {
          font-size: 0.82rem; letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--muted); text-decoration: none;
          transition: color 0.2s;
          display: flex; align-items: center; gap: 0.5rem;
        }
        .kc-link::before { content: '→'; color: var(--gold); }
        .kc-link:hover { color: var(--gold); }

        /* FOOTER */
        .kc-footer {
          border-top: 1px solid var(--border2);
          padding: 2rem;
          text-align: center;
          color: var(--muted);
          font-size: 0.78rem;
          letter-spacing: 0.06em;
          display: flex; flex-direction: column;
          align-items: center; gap: 0.75rem;
        }
        .kc-footer-links {
          display: flex; gap: 1.5rem; flex-wrap: wrap; justify-content: center;
        }
        .kc-footer-links a {
          color: var(--gold); text-decoration: none; transition: color 0.2s;
        }
        .kc-footer-links a:hover { color: var(--gold2); }

        @media (max-width: 700px) {
          .kc-nav { padding: 0.9rem 1.5rem; }
          .kc-hero { padding: 9rem 1.5rem 4rem; }
          .kc-cards { grid-template-columns: 1fr; padding: 0 1.5rem; }
          .kc-links { padding: 0 1.5rem; }
        }
      `}</style>

      <div className={`kc-root ${theme}`}>
        {/* NAV */}
        <nav className="kc-nav" style={{ position: "relative" }}>
          <Link href="/" className="nav-logo">
            KI<span>·</span>Coaching<span>·</span>Kompass
          </Link>
          <div className="nav-right">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Theme wechseln" />
            <a href="mailto:bernd.wiese@googlemail.com" className="nav-cta">Kontakt</a>
            <button
              className={`hamburger ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menü"
            >
              <span /><span /><span />
            </button>
          </div>
          <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
            <Link href="/" onClick={() => setMenuOpen(false)}>Start</Link>
            <Link href="/ki-coaching" className="active" onClick={() => setMenuOpen(false)}>KI-Coaching</Link>
            <Link href="/ki-coaching/beratung" className="sub-item" onClick={() => setMenuOpen(false)}>Beratung</Link>
            <Link href="/ki-coaching/workshop" className="sub-item" onClick={() => setMenuOpen(false)}>Workshop</Link>
            <Link href="/ki-coaching/kompass" className="sub-item" onClick={() => setMenuOpen(false)}>Kompass</Link>
            <Link href="/zuhoeren" onClick={() => setMenuOpen(false)}>Gehört werden</Link>
            <Link href="/ueber-mich" onClick={() => setMenuOpen(false)}>Über mich</Link>
          </div>
        </nav>

        {/* HERO */}
        <div className="kc-hero">
          <div className="kc-eyebrow">KI-Coaching</div>
          <h1 className="kc-title">
            KI-Coaching:<br /><em>Was es ist. Was es kann.</em><br />Und was nicht.
          </h1>
          <p className="kc-lead">
            Der Markt für KI-Coaching-Tools wächst rasant — über 249 Lösungen, jede mit eigenen
            Stärken, Risiken und Anwendungsfällen. Ich helfe Unternehmen und Coaches,
            in diesem Markt die richtige Wahl zu treffen.
          </p>
        </div>

        {/* CARDS */}
        <div className="kc-cards">
          <Link href="/ki-coaching/beratung" className="kc-card">
            <span className="kc-card-icon">🏢</span>
            <span className="kc-card-label">Für Unternehmen</span>
            <div className="kc-card-title">KI-Coaching einführen — strukturiert und sicher</div>
            <p className="kc-card-body">
              Von der Bedarfsanalyse über die Toolauswahl bis zum Rollout:
              ich begleite Organisationen durch den gesamten Prozess.
            </p>
            <span className="kc-card-arrow">Zur Beratung →</span>
          </Link>
          <Link href="/ki-coaching/beratung" className="kc-card">
            <span className="kc-card-icon">🎯</span>
            <span className="kc-card-label">Für Coaches</span>
            <div className="kc-card-title">KI-Tools sinnvoll in die eigene Praxis integrieren</div>
            <p className="kc-card-body">
              Orientierung im Tool-Dschungel, DSGVO-Check, Hands-on Testing —
              für Coaches, die KI nutzen wollen, ohne ihre Qualität zu kompromittieren.
            </p>
            <span className="kc-card-arrow">Zur Beratung →</span>
          </Link>
        </div>

        {/* FURTHER LINKS */}
        <div className="kc-links">
          <Link href="/ki-coaching/workshop" className="kc-link">Workshop: KI-Coaching einführen</Link>
          <Link href="/ki-coaching/kompass" className="kc-link">KI-Tools entdecken</Link>
        </div>

        {/* FOOTER */}
        <footer className="kc-footer">
          <div className="kc-footer-links">
            <Link href="/">Startseite</Link>
            <Link href="/ki-coaching/beratung">Beratung</Link>
            <Link href="/ki-coaching/workshop">Workshop</Link>
            <Link href="/ki-coaching/kompass">KI-Tools</Link>
            <Link href="/zuhoeren">Zuhören</Link>
            <Link href="/ueber-mich">Über mich</Link>
          </div>
          <span>© 2025 KI·Coaching·Kompass · Bernd Wiese · Freiburg</span>
        </footer>
      </div>
    </>
  );
}
