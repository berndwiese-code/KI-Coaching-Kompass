"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Theme = "light" | "dark";

export default function KontaktClient() {
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

        .nav-center { display: none; }
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

        /* ── HAMBURGER + MOBILE MENU ── */
        .hamburger {
          display: flex; flex-direction: column; gap: 5px;
          background: none; border: none; cursor: pointer; padding: 6px;
        }
        .hamburger span {
          display: block; width: 22px; height: 2px;
          background: var(--text2); border-radius: 1px;
          transition: transform 0.25s, opacity 0.25s;
        }
        .mobile-menu {
          display: none; position: absolute; top: 100%; left: auto; right: 0;
          width: 240px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 0 0 8px 8px;
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
        .kontakt-hero {
          background: var(--bg);
          padding: 8rem 2rem 4rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          transition: background 0.35s;
        }
        .hero-orb {
          position: absolute;
          top: 30%; left: 50%;
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
          position: relative;
          z-index: 2;
        }
        .hero-eyebrow::before { content: ''; width: 16px; height: 1px; background: var(--gold); }
        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.8rem, 6.5vw, 4.5rem);
          font-weight: 300; line-height: 1.1; color: var(--text);
          max-width: 800px; margin: 0 auto;
          position: relative; z-index: 2;
          animation: fadeUp 0.7s 0.08s ease both;
        }
        .hero-title em { font-style: italic; color: var(--gold2); }

        /* ── TWO COLUMNS ── */
        .kontakt-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          max-width: 1100px;
          margin: 4rem auto 8rem;
          padding: 0 2rem;
          position: relative;
          z-index: 2;
          animation: fadeUp 0.7s 0.16s ease both;
        }

        .kontakt-col {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 3rem;
        }

        .kontakt-col-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          font-weight: 300;
          color: var(--text);
          margin-bottom: 2rem;
          line-height: 1.2;
        }

        /* Spalte 1: Kalender */
        .calendar-wrapper {
          width: 100%;
          min-height: 480px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--muted);
          font-size: 0.9rem;
          text-align: center;
          padding: 2rem;
        }

        /* Spalte 2: Direkter Kontakt */
        .rueckruf-form {
          display: flex; flex-direction: column; gap: 1rem;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 8px; padding: 1.5rem; margin-bottom: 1.2rem;
        }
        .rueckruf-form-title {
          font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 0.5rem; font-weight: 500;
        }
        .rueckruf-input {
          width: 100%; padding: 10px 12px; background: var(--bg2);
          border: 1px solid var(--border); border-radius: 6px;
          font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
          color: var(--text); outline: none; transition: border-color 0.2s;
        }
        .rueckruf-input:focus { border-color: var(--gold); }
        .rueckruf-btn {
          background: var(--gold); color: var(--bg); border: none;
          border-radius: 6px; padding: 10px 16px; font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase;
          font-weight: 500; cursor: pointer; transition: background 0.2s, transform 0.2s;
        }
        .rueckruf-btn:hover { background: var(--gold2); transform: translateY(-1px); }

        .contact-list {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        
        .contact-card {
          display: flex;
          flex-direction: column;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1.5rem;
          text-decoration: none;
          transition: background 0.25s, transform 0.25s;
        }
        .contact-card:hover {
          background: var(--bg);
          transform: translateY(-2px);
        }
        
        .contact-card-title {
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .contact-card-value {
          font-size: 1.2rem;
          color: var(--text);
          font-weight: 400;
        }

        /* ── ANIMATIONS ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .kck-nav { padding: 1rem 1.5rem; }
          .nav-logo { font-size: 0.88rem; white-space: nowrap; }
          .kontakt-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .kontakt-col { padding: 2rem 1.5rem; }
        }
      `}</style>

      <div className={`kck-root ${theme}`}>

        {/* NAV */}
        <nav className="kck-nav">
          <Link href="/" className="nav-logo">KI-Coaching<span> Kompass</span></Link>
          <div className="nav-right">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Farbschema wechseln" />
            <Link href="/kontakt" className="nav-cta">Kontakt</Link>
            <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menü öffnen">
              <span /><span /><span />
            </button>
          </div>
          <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
            <Link href="/" onClick={() => setMenuOpen(false)}>Start</Link>
            <Link href="/ki-coaching" onClick={() => setMenuOpen(false)}>KI-Coaching</Link>
            <Link href="/ki-coaching/beratung-unternehmen" className="sub-item" onClick={() => setMenuOpen(false)}>Unternehmen</Link>
            <Link href="/ki-coaching/beratung-coaches" className="sub-item" onClick={() => setMenuOpen(false)}>Coaches</Link>
            <Link href="/ki-coaching/workshop" className="sub-item" onClick={() => setMenuOpen(false)}>Workshop</Link>
            <Link href="/ki-coaching/kompass" className="sub-item" onClick={() => setMenuOpen(false)}>Kompass</Link>
            <Link href="/zuhoeren" onClick={() => setMenuOpen(false)}>Gehört werden</Link>
            <Link href="/ueber-mich" onClick={() => setMenuOpen(false)}>Über mich</Link>
          </div>
        </nav>

        {/* HERO */}
        <div className="kontakt-hero">
          <div className="hero-orb" />
          <p className="hero-eyebrow">Kontakt</p>
          <h1 className="hero-title">
            Lass uns gemeinsam<br /><em>Klarheit schaffen.</em>
          </h1>
        </div>

        {/* GRID */}
        <div className="kontakt-grid">
          {/* Spalte 1: Kalender */}
          <div className="kontakt-col">
            <h2 className="kontakt-col-title">Gespräch buchen</h2>
            <div className="calendar-wrapper" id="google-calendar-embed">
              {/* Google Calendar Embed Platzhalter */}
              <p>
                [ Platzhalter für Google Kalender Widget ]<br /><br />
                Hier kann später das Skript oder iframe für den Google Kalender eingebunden werden.
              </p>
            </div>
          </div>

          {/* Spalte 2: Direktkontakt */}
          <div className="kontakt-col">
            <h2 className="kontakt-col-title">Alternative Kontaktwege</h2>

            <form action="mailto:Wiese@ISHA.de?subject=Rückruf%20anfordern" method="post" encType="text/plain" className="rueckruf-form">
              <span className="rueckruf-form-title">Rückruf anfordern</span>
              <input type="text" name="Name" placeholder="Ihr Name" className="rueckruf-input" required />
              <input type="tel" name="Telefon" placeholder="Ihre Nummer" className="rueckruf-input" required />
              <input type="text" name="Wunschzeit" placeholder="Beste Zeit (z.B. Dienstag 14 Uhr)" className="rueckruf-input" />
              <button type="submit" className="rueckruf-btn">Absenden (Mail öffnen)</button>
            </form>

            <div className="contact-list">
              <a href="mailto:bernd.wiese@googlemail.com" className="contact-card">
                <span className="contact-card-title">Per E-Mail schreiben</span>
                <span className="contact-card-value">bernd.wiese@googlemail.com</span>
              </a>

              <a href="tel:+491701234567" className="contact-card">
                <span className="contact-card-title">Anrufen / Rückruf</span>
                <span className="contact-card-value">+49 (0) 170 123 4567</span>
              </a>

              <a href="https://www.linkedin.com/in/bernd-wiese" target="_blank" rel="noopener noreferrer" className="contact-card">
                <span className="contact-card-title">Vernetzen</span>
                <span className="contact-card-value">LinkedIn Profil</span>
              </a>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer style={{
          background: "var(--bg2)", borderTop: "1px solid var(--border)",
          padding: "2rem 2.5rem", display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: "1rem",
          transition: "background 0.35s",
        }}>
          <span style={{fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.04em"}}>
            © 2025 KI-Coaching Kompass · Bernd Wiese · Freiburg
          </span>
          <ul style={{display: "flex", gap: "2rem", listStyle: "none", flexWrap: "wrap"}}>
            {[
              { label: "Unternehmen", href: "/ki-coaching/beratung-unternehmen" },
              { label: "Coaches", href: "/ki-coaching/beratung-coaches" },
              { label: "Workshop", href: "/ki-coaching/workshop" },
              { label: "Kompass", href: "/ki-coaching/kompass" },
              { label: "Gehört werden", href: "/zuhoeren" },
              { label: "Über mich", href: "/ueber-mich" },
              { label: "Impressum", href: "/impressum" },
              { label: "Datenschutz", href: "/datenschutz" },
            ].map(l => (
              <li key={l.label}>
                <Link href={l.href} style={{fontSize: "0.7rem", color: "var(--gold)", textDecoration: "none", letterSpacing: "0.04em"}}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </footer>

      </div>
    </>
  );
}
