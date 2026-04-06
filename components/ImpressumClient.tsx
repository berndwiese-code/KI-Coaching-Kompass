"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Theme = "light" | "dark";

export default function ImpressumClient() {
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

        .kck-root {
          font-family: 'DM Sans', sans-serif;
          font-weight: 400; line-height: 1.75;
          overflow-x: hidden;
          transition: background 0.35s, color 0.35s;
          -webkit-font-smoothing: antialiased;
        }
        .kck-root.light {
          --bg: #f6f3ee; --bg2: #ede9e0; --bg3: #e2dbd0;
          --surface: #fdfcf9; --text: #1c1916; --text2: #2d2924;
          --muted: #6b5f54; --gold: #8c6820; --gold2: #a87e28;
          --border: rgba(140,104,32,0.20); --border2: rgba(140,104,32,0.10);
          --shadow: 0 2px 16px rgba(28,22,14,0.07);
        }
        .kck-root.dark {
          --bg: #141210; --bg2: #1b1815; --bg3: #232019;
          --surface: #1e1b17; --text: #ece7db; --text2: #c8bfad;
          --muted: #8c8274; --gold: #c2a03c; --gold2: #d4b24a;
          --border: rgba(194,160,60,0.14); --border2: rgba(194,160,60,0.07);
          --shadow: 0 4px 24px rgba(0,0,0,0.40);
        }

        /* NAV */
        .kck-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.1rem 2.5rem;
          border-bottom: 1px solid var(--border2);
          background: var(--bg); backdrop-filter: blur(16px);
          transition: background 0.35s;
        }
        .nav-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem; font-weight: 400; letter-spacing: 0.06em;
          color: var(--gold2); text-decoration: none;
        }
        .nav-logo span { color: var(--text2); font-weight: 300; }
        .nav-right { display: flex; align-items: center; gap: 1rem; }
        .theme-toggle {
          position: relative; width: 44px; height: 24px;
          border-radius: 12px; border: 1px solid var(--border);
          background: var(--bg3); cursor: pointer; transition: background 0.3s; flex-shrink: 0;
        }
        .theme-toggle::after {
          content: ''; position: absolute; top: 3px;
          width: 16px; height: 16px; border-radius: 50%;
          background: var(--gold); transition: left 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .kck-root.light .theme-toggle::after { left: 3px; }
        .kck-root.dark  .theme-toggle::after { left: 23px; }

        .hamburger {
          display: flex; flex-direction: column; gap: 5px;
          background: none; border: none; cursor: pointer; padding: 6px;
        }
        .hamburger span {
          display: block; width: 22px; height: 2px;
          background: var(--text2); border-radius: 1px;
        }
        .mobile-menu {
          display: none; position: absolute; top: 100%; right: 0;
          width: 240px; background: var(--surface); border: 1px solid var(--border);
          border-radius: 0 0 8px 8px; flex-direction: column;
          padding: 0.5rem 1.5rem 1rem; box-shadow: var(--shadow); z-index: 99;
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
        .mobile-menu a.sub-item { padding-left: 2.5rem; font-size: 0.68rem; color: var(--muted); }
        .mobile-menu a.sub-item::before { content: '→ '; color: var(--gold); }
        @media (max-width: 600px) {
          .mobile-menu { width: min(88vw, 300px); }
        }

        /* CONTENT */
        .legal-page {
          background: var(--bg); min-height: 100vh;
          padding: 9rem 2rem 6rem; transition: background 0.35s;
        }
        .legal-in {
          max-width: 720px; margin: 0 auto;
        }
        .legal-eyebrow {
          font-size: 0.68rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--gold); display: flex; align-items: center; gap: 0.6rem;
          margin-bottom: 1.5rem;
        }
        .legal-eyebrow::before { content: ''; width: 16px; height: 1px; background: var(--gold); }
        .legal-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.2rem, 4vw, 3.2rem);
          font-weight: 300; line-height: 1.15; color: var(--text);
          margin-bottom: 3rem;
        }
        .legal-section { margin-bottom: 2.5rem; }
        .legal-h2 {
          font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 0.75rem;
        }
        .legal-p {
          font-size: 0.95rem; color: var(--text2); line-height: 1.85;
          margin-bottom: 0.5rem;
        }
        .legal-p a {
          color: var(--gold); text-decoration: none;
        }
        .legal-p a:hover { color: var(--gold2); text-decoration: underline; }
        .legal-divider {
          border: none; border-top: 1px solid var(--border2); margin: 2.5rem 0;
        }
        .legal-note {
          font-size: 0.82rem; color: var(--muted); line-height: 1.75;
          padding: 1.25rem 1.5rem;
          border-left: 2px solid var(--border);
          background: var(--bg2);
        }

        /* FOOTER */
        .legal-footer {
          background: var(--bg2); border-top: 1px solid var(--border);
          padding: 1.75rem 2.5rem; display: flex; align-items: center;
          justify-content: space-between; flex-wrap: wrap; gap: 1rem;
          transition: background 0.35s;
        }
        .legal-footer span { font-size: 0.7rem; color: var(--muted); }
        .legal-footer-links { display: flex; gap: 2rem; list-style: none; flex-wrap: wrap; }
        .legal-footer-links a {
          font-size: 0.7rem; color: var(--gold); text-decoration: none;
        }
      `}</style>

      <div className={`kck-root ${theme}`}>

        <nav className="kck-nav">
          <Link href="/" className="nav-logo">KI-Coaching<span> Kompass</span></Link>
          <div className="nav-right">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Farbschema wechseln" />
            <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menü">
              <span /><span /><span />
            </button>
          </div>
          <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
            <Link href="/" onClick={() => setMenuOpen(false)}>Start</Link>
            <Link href="/ki-coaching" onClick={() => setMenuOpen(false)}>KI-Coaching</Link>
            <Link href="/ki-coaching/beratung" className="sub-item" onClick={() => setMenuOpen(false)}>Beratung</Link>
            <Link href="/ki-coaching/workshop" className="sub-item" onClick={() => setMenuOpen(false)}>Workshop</Link>
            <Link href="/ki-coaching/kompass" className="sub-item" onClick={() => setMenuOpen(false)}>Kompass</Link>
            <Link href="/zuhoeren" onClick={() => setMenuOpen(false)}>Gehört werden</Link>
            <Link href="/ueber-mich" onClick={() => setMenuOpen(false)}>Über mich</Link>
          </div>
        </nav>

        <main className="legal-page">
          <div className="legal-in">
            <p className="legal-eyebrow">Rechtliches</p>
            <h1 className="legal-h1">Impressum</h1>

            <div className="legal-section">
              <p className="legal-h2">Angaben gemäß § 5 TMG</p>
              <p className="legal-p">Bernd Wiese</p>
              <p className="legal-p">Großmattenstr. 26</p>
              <p className="legal-p">79219 Staufen</p>
            </div>

            <div className="legal-section">
              <p className="legal-h2">Kontakt</p>
              <p className="legal-p">
                Telefon: <a href="tel:+4917614061816">+49 176 1406 18 16</a>
              </p>
              <p className="legal-p">
                E-Mail: <a href="mailto:Wiese@ISHA.de">Wiese@ISHA.de</a>
              </p>
            </div>

            <hr className="legal-divider" />

            <div className="legal-section">
              <p className="legal-h2">Umsatzsteuer</p>
              <p className="legal-p">
                Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.
              </p>
            </div>

            <hr className="legal-divider" />

            <div className="legal-section">
              <p className="legal-h2">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</p>
              <p className="legal-p">Bernd Wiese, Großmattenstr. 26, 79219 Staufen</p>
            </div>

            <hr className="legal-divider" />

            <div className="legal-section">
              <p className="legal-h2">Haftung für Inhalte</p>
              <p className="legal-p">
                Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte
                auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis
                10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
                gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen,
                die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>
              <p className="legal-p">
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach
                den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung
                ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung
                möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir
                diese Inhalte umgehend entfernen.
              </p>
            </div>

            <div className="legal-section">
              <p className="legal-h2">Haftung für Links</p>
              <p className="legal-p">
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte
                wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch
                keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der
                jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
              </p>
            </div>

            <div className="legal-section">
              <p className="legal-h2">Urheberrecht</p>
              <p className="legal-p">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
                unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche
                gekennzeichnet. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
                der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
                schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
            </div>

            <hr className="legal-divider" />

            <div className="legal-note">
              Streitschlichtung: Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit:{" "}
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
                https://ec.europa.eu/consumers/odr
              </a>
              . Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren
              vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </div>
          </div>
        </main>

        <footer className="legal-footer">
          <span>© 2025 KI-Coaching Kompass · Bernd Wiese · Staufen</span>
          <ul className="legal-footer-links">
            <li><Link href="/">Start</Link></li>
            <li><Link href="/ueber-mich">Über mich</Link></li>
            <li><Link href="/datenschutz">Datenschutz</Link></li>
            <li><Link href="/impressum">Impressum</Link></li>
          </ul>
        </footer>

      </div>
    </>
  );
}
