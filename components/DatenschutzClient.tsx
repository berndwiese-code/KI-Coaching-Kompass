"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Theme = "light" | "dark";

export default function DatenschutzClient() {
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
        .legal-in { max-width: 720px; margin: 0 auto; }
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
          margin-bottom: 0.5rem;
        }
        .legal-stand {
          font-size: 0.78rem; color: var(--muted); letter-spacing: 0.05em;
          margin-bottom: 3rem;
        }
        .legal-section { margin-bottom: 2.5rem; }
        .legal-h2 {
          font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 0.75rem;
        }
        .legal-h3 {
          font-size: 0.85rem; font-weight: 500; color: var(--text2);
          margin-bottom: 0.5rem; margin-top: 1.25rem;
        }
        .legal-p {
          font-size: 0.95rem; color: var(--text2); line-height: 1.85;
          margin-bottom: 0.75rem;
        }
        .legal-p a { color: var(--gold); text-decoration: none; }
        .legal-p a:hover { color: var(--gold2); text-decoration: underline; }
        .legal-ul {
          list-style: none; margin: 0.75rem 0 0.75rem 0;
        }
        .legal-ul li {
          font-size: 0.95rem; color: var(--text2); line-height: 1.85;
          padding-left: 1.25rem; position: relative; margin-bottom: 0.25rem;
        }
        .legal-ul li::before {
          content: '—'; position: absolute; left: 0;
          color: var(--gold); font-size: 0.8rem;
        }
        .legal-divider {
          border: none; border-top: 1px solid var(--border2); margin: 2.5rem 0;
        }
        .legal-note {
          font-size: 0.82rem; color: var(--muted); line-height: 1.75;
          padding: 1.25rem 1.5rem;
          border-left: 2px solid var(--border);
          background: var(--bg2); margin-top: 1rem;
        }
        .legal-highlight {
          font-size: 0.88rem; color: var(--text2); line-height: 1.8;
          padding: 1.25rem 1.5rem;
          border: 1px solid var(--border); background: var(--surface);
          border-radius: 4px; margin-top: 0.75rem;
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
        .legal-footer-links a { font-size: 0.7rem; color: var(--gold); text-decoration: none; }
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
            <Link href="/ki-coaching/beratung-unternehmen" className="sub-item" onClick={() => setMenuOpen(false)}>Unternehmen</Link>
            <Link href="/ki-coaching/beratung-coaches" className="sub-item" onClick={() => setMenuOpen(false)}>Coaches</Link>
            <Link href="/ki-coaching/workshop" className="sub-item" onClick={() => setMenuOpen(false)}>Workshop</Link>
            <Link href="/ki-coaching/kompass" className="sub-item" onClick={() => setMenuOpen(false)}>Kompass</Link>
            <Link href="/zuhoeren" onClick={() => setMenuOpen(false)}>Gehört werden</Link>
            <Link href="/ueber-mich" onClick={() => setMenuOpen(false)}>Über mich</Link>
          </div>
        </nav>

        <main className="legal-page">
          <div className="legal-in">
            <p className="legal-eyebrow">Rechtliches</p>
            <h1 className="legal-h1">Datenschutzerklärung</h1>
            <p className="legal-stand">Stand: Januar 2025</p>

            {/* 1 */}
            <div className="legal-section">
              <p className="legal-h2">1. Verantwortlicher</p>
              <p className="legal-p">
                Verantwortlicher im Sinne der DSGVO ist:
              </p>
              <div className="legal-highlight">
                Bernd Wiese<br />
                Großmattenstr. 26<br />
                79219 Staufen<br />
                E-Mail: <a href="mailto:Wiese@ISHA.de">Wiese@ISHA.de</a><br />
                Telefon: <a href="tel:+4917614061816">+49 176 1406 18 16</a>
              </div>
            </div>

            <hr className="legal-divider" />

            {/* 2 */}
            <div className="legal-section">
              <p className="legal-h2">2. Allgemeines zur Datenverarbeitung</p>
              <p className="legal-p">
                Diese Website erhebt und verarbeitet personenbezogene Daten nur im technisch
                notwendigen Umfang. Es werden keine Tracking-Tools, keine Werbenetzwerke
                und keine Analytics-Dienste eingesetzt. Es werden keine Cookies gesetzt,
                die einer Einwilligung bedürfen.
              </p>
            </div>

            <hr className="legal-divider" />

            {/* 3 */}
            <div className="legal-section">
              <p className="legal-h2">3. Hosting — Vercel</p>
              <p className="legal-p">
                Diese Website wird gehostet von Vercel Inc., 340 Pine Street, Suite 701,
                San Francisco, CA 94104, USA. Beim Aufruf der Website werden automatisch
                Server-Logfiles übermittelt, die folgende Daten enthalten können:
              </p>
              <ul className="legal-ul">
                <li>IP-Adresse des anfragenden Geräts</li>
                <li>Datum und Uhrzeit des Zugriffs</li>
                <li>Name und URL der abgerufenen Datei</li>
                <li>Browsertyp und Betriebssystem</li>
                <li>HTTP-Statuscode</li>
              </ul>
              <p className="legal-p">
                Die Verarbeitung erfolgt auf Basis von Art. 6 Abs. 1 lit. f DSGVO
                (berechtigtes Interesse am sicheren und stabilen Betrieb der Website).
                Die Übermittlung in die USA erfolgt auf Basis der
                EU-Standardvertragsklauseln (SCC). Weitere Informationen:
                {" "}<a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                  vercel.com/legal/privacy-policy
                </a>
              </p>
            </div>

            <hr className="legal-divider" />

            {/* 4 */}
            <div className="legal-section">
              <p className="legal-h2">4. Content Management — Sanity</p>
              <p className="legal-p">
                Inhalte dieser Website werden über Sanity CMS verwaltet (Sanity AS,
                Pilestredet 33, 0166 Oslo, Norwegen). Sanity verarbeitet Inhalte auf
                Servern innerhalb des Europäischen Wirtschaftsraums. Eine Weitergabe
                personenbezogener Besucherdaten an Sanity findet nicht statt. Weitere
                Informationen:{" "}
                <a href="https://www.sanity.io/legal/privacy" target="_blank" rel="noopener noreferrer">
                  sanity.io/legal/privacy
                </a>
              </p>
            </div>

            <hr className="legal-divider" />

            {/* 5 */}
            <div className="legal-section">
              <p className="legal-h2">5. Google Fonts</p>
              <p className="legal-p">
                Diese Website lädt Schriftarten über den Google Fonts Dienst
                (Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA).
                Dabei wird die IP-Adresse des Besuchers an Google-Server übermittelt.
                Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Die Übermittlung in die
                USA erfolgt auf Basis der EU-Standardvertragsklauseln.
              </p>
              <div className="legal-note">
                Hinweis: Wir arbeiten daran, Google Fonts durch eine lokale Einbindung
                (self-hosting) zu ersetzen, um die Übermittlung von IP-Adressen an
                Google zu vermeiden.
              </div>
            </div>

            <hr className="legal-divider" />

            {/* 6 */}
            <div className="legal-section">
              <p className="legal-h2">6. Kontaktaufnahme per E-Mail</p>
              <p className="legal-p">
                Wenn du uns per E-Mail kontaktierst, werden die übermittelten Daten
                (E-Mail-Adresse, Inhalt der Nachricht, ggf. Name) zur Bearbeitung der
                Anfrage und für mögliche Rückfragen gespeichert. Die Verarbeitung erfolgt
                auf Basis von Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung) bzw.
                Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse). Die Daten werden
                nicht an Dritte weitergegeben und nach abgeschlossener Bearbeitung gelöscht,
                sofern keine gesetzlichen Aufbewahrungspflichten bestehen.
              </p>
            </div>

            <hr className="legal-divider" />

            {/* 7 */}
            <div className="legal-section">
              <p className="legal-h2">7. Deine Rechte</p>
              <p className="legal-p">
                Du hast gegenüber uns folgende Rechte hinsichtlich deiner
                personenbezogenen Daten:
              </p>
              <ul className="legal-ul">
                <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
                <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
                <li>Recht auf Löschung (Art. 17 DSGVO)</li>
                <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
                <li>Recht auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
              </ul>
              <p className="legal-p">
                Zur Ausübung deiner Rechte wende dich an:{" "}
                <a href="mailto:Wiese@ISHA.de">Wiese@ISHA.de</a>
              </p>
            </div>

            <hr className="legal-divider" />

            {/* 8 */}
            <div className="legal-section">
              <p className="legal-h2">8. Beschwerderecht</p>
              <p className="legal-p">
                Du hast das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu
                beschweren. Die zuständige Aufsichtsbehörde für Baden-Württemberg ist:
              </p>
              <div className="legal-highlight">
                Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit
                Baden-Württemberg<br />
                Lautenschlagerstraße 20<br />
                70173 Stuttgart<br />
                <a href="https://www.baden-wuerttemberg.datenschutz.de" target="_blank" rel="noopener noreferrer">
                  www.baden-wuerttemberg.datenschutz.de
                </a>
              </div>
            </div>

          </div>
        </main>

        <footer className="legal-footer">
          <span>© 2025 KI-Coaching Kompass · Bernd Wiese · Staufen</span>
          <ul className="legal-footer-links">
            <li><Link href="/">Start</Link></li>
            <li><Link href="/ueber-mich">Über mich</Link></li>
            <li><Link href="/impressum">Impressum</Link></li>
            <li><Link href="/datenschutz">Datenschutz</Link></li>
          </ul>
        </footer>

      </div>
    </>
  );
}
