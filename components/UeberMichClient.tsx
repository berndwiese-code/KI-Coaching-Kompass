"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { UeberMich } from "@/sanity/lib/queries";

type Theme = "light" | "dark";

export default function UeberMichClient({ data }: { data?: UeberMich | null }) {
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

        .um-root {
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          line-height: 1.75;
          overflow-x: hidden;
          transition: background 0.35s, color 0.35s;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        .um-root.light {
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

        .um-root.dark {
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
        .um-nav {
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
        .um-root.light .theme-toggle::after { left: 3px; }
        .um-root.dark  .theme-toggle::after { left: 23px; }
        .nav-back {
          font-size: 0.73rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--bg); background: var(--gold); padding: 0.5rem 1.2rem;
          text-decoration: none; font-weight: 500; transition: background 0.2s;
          white-space: nowrap; border-radius: 6px;
        }
        .nav-back:hover { background: var(--gold2); }

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
          .nav-back { display: none; }
          .mobile-menu { left: auto; right: 0; width: min(88vw, 300px); }
        }

        /* ── HERO ── */
        .um-hero {
          padding: 11rem 2rem 5rem;
          max-width: 760px;
          margin: 0 auto;
        }
        .um-eyebrow {
          display: inline-flex; align-items: center; gap: 0.6rem;
          font-size: 0.65rem; letter-spacing: 0.24em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 2rem;
        }
        .um-eyebrow::before { content: '—'; color: var(--gold); }
        .um-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.8rem, 5vw, 4.2rem);
          font-weight: 300; line-height: 1.1;
          color: var(--text); margin-bottom: 0.4rem;
        }
        .um-subname {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.1rem, 2vw, 1.4rem);
          font-weight: 300; font-style: italic;
          color: var(--gold2); margin-bottom: 4rem;
          letter-spacing: 0.04em;
        }

        /* ── PORTRAIT ── */
        .um-portrait-wrap {
          float: right;
          margin: 0 0 2.5rem 3rem;
          width: clamp(160px, 22vw, 260px);
          shape-outside: inset(0 round 12px);
        }
        .um-portrait-wrap img {
          width: 100%;
          aspect-ratio: 3 / 4;
          object-fit: cover;
          object-position: center top;
          border-radius: 12px;
          display: block;
          box-shadow: var(--shadow);
        }
        .um-portrait-link {
          display: block;
          text-align: center;
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--gold);
          text-decoration: none;
          margin-top: 0.75rem;
          transition: color 0.2s;
        }
        .um-portrait-link:hover { color: var(--gold2); }

        /* ── PROSE ── */
        .um-prose {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.35rem, 2vw, 1.7rem);
          font-weight: 300; line-height: 1.75;
          color: var(--text2);
          clear: none;
        }
        .um-prose p { margin-bottom: 1.5em; }
        .um-prose p:last-child { margin-bottom: 0; }
        .um-prose em { font-style: italic; color: var(--text); }

        /* ── CONTACT ── */
        .um-contact {
          margin-top: 4rem;
          padding-top: 3rem;
          border-top: 1px solid var(--border);
          clear: both;
        }
        .um-contact-label {
          font-size: 0.63rem; letter-spacing: 0.26em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 2rem;
        }
        .um-contact-links {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .um-contact-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 1rem;
          color: var(--text2);
          text-decoration: none;
          transition: color 0.2s;
        }
        .um-contact-item:hover { color: var(--gold); }
        .um-contact-item::before {
          content: '—';
          color: var(--gold);
          font-size: 0.85rem;
          flex-shrink: 0;
        }

        /* ── FOOTER ── */
        .um-footer {
          border-top: 1px solid var(--border2);
          padding: 2rem 2rem;
          text-align: center;
          color: var(--muted);
          font-size: 0.78rem;
          letter-spacing: 0.06em;
          margin-top: 6rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        .um-footer-links {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .um-footer-links a {
          color: var(--gold);
          text-decoration: none;
          transition: color 0.2s;
        }
        .um-footer-links a:hover { color: var(--gold2); }

        @media (max-width: 600px) {
          .um-hero { padding: 9rem 1.5rem 4rem; }
          .um-portrait-wrap {
            float: none;
            margin: 0 auto 2rem;
            width: min(60vw, 200px);
          }
          .um-prose { font-size: clamp(1.15rem, 4vw, 1.4rem); }
        }
      `}</style>

      <div className={`um-root ${theme}`}>
        {/* NAV */}
        <nav className="um-nav">
          <Link href="/" className="nav-logo">
            KI<span>·</span>Coaching<span>·</span>Kompass
          </Link>
          <div className="nav-right">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Theme wechseln" />
            <Link href="/" className="nav-back">← Zurück</Link>
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
            <Link href="/ki-coaching" onClick={() => setMenuOpen(false)}>KI-Coaching</Link>
            <Link href="/ki-coaching/beratung" className="sub-item" onClick={() => setMenuOpen(false)}>Beratung</Link>
            <Link href="/ki-coaching/workshop" className="sub-item" onClick={() => setMenuOpen(false)}>Workshop</Link>
            <Link href="/ki-coaching/kompass" className="sub-item" onClick={() => setMenuOpen(false)}>Kompass</Link>
            <Link href="/zuhoeren" onClick={() => setMenuOpen(false)}>Gehört werden</Link>
            <Link href="/ueber-mich" className="active" onClick={() => setMenuOpen(false)}>Über mich</Link>
          </div>
        </nav>

        {/* CONTENT */}
        <main className="um-hero">
          <div className="um-eyebrow">{data?.eyebrow ?? "Über mich"}</div>
          <h1 className="um-name" dangerouslySetInnerHTML={{ __html: data?.name ?? "Bernd Wiese" }} />
          <p className="um-subname" dangerouslySetInnerHTML={{ __html: data?.subname ?? "Zuhörcoach · KI-Berater · Freiburg" }} />

          <div className="um-portrait-wrap">
            <img src="/bernd-wiese.jpg" alt={data?.name ?? "Bernd Wiese"} />
            <a
              href={data?.portraitLinkUrl ?? "https://www.linkedin.com/in/bernd-wiese-9303341/"}
              target="_blank"
              rel="noopener noreferrer"
              className="um-portrait-link"
            >
              {data?.portraitLinkText ?? "LinkedIn ↗"}
            </a>
          </div>

          <div 
            className="um-prose" 
            dangerouslySetInnerHTML={{ __html: data?.prose ?? "<p>Ich liebe echte Präsenz.<br />Momente, in denen nichts optimiert werden muss.<br />In denen jemand einfach da sein darf — und gehört wird.</p><p>Und gleichzeitig fasziniert mich, was gerade mit KI entsteht.</p><p>Nicht nur technologisch.<br />Sondern in dem, was es über uns sichtbar macht.</p><p>Denn KI kann viel.<br />Sie analysiert, strukturiert, spiegelt.<br />Manchmal überraschend klar.</p><p>Aber genau darin liegt für mich die eigentliche Frage:<br />Was passiert, wenn etwas uns <em>perfekt antwortet</em> —<br />ohne uns wirklich zu begegnen?</p><p>Ich arbeite genau in dieser Spannung.</p><p>Zwischen einem Zuhören, das nichts will,<br />und einer Technologie, die unglaublich viel kann —<br />aber nichts fühlt.</p><p>Für mich ist KI kein Ersatz für menschliche Tiefe.<br />Aber sie ist ein Werkzeug, das uns herausfordert:<br />ehrlicher zu werden, klarer zu sehen, bewusster zu sprechen.</p><p>Und manchmal sogar: <em>uns selbst besser zu hören.</em></p><p>Ich verbinde beides —<br />menschliche Präsenz und KI-gestützte Reflexion.</p><p>Nicht, um Prozesse zu beschleunigen.<br />Sondern um Räume zu öffnen,<br />in denen echte Erkenntnis entstehen kann.</p>" }}
          />

          <div className="um-contact">
            <div className="um-contact-label">{data?.contactLabel ?? "Kontakt"}</div>
            <div className="um-contact-links">
              <a href={data?.emailUrl ?? "mailto:Wiese@ISHA.de"} className="um-contact-item">
                {data?.emailText ?? "Wiese@ISHA.de"}
              </a>
              <a
                href={data?.linkedInUrl ?? "https://www.linkedin.com/in/bernd-wiese-9303341/"}
                target="_blank"
                rel="noopener noreferrer"
                className="um-contact-item"
              >
                {data?.linkedInText ?? "LinkedIn"}
              </a>
              <a href={data?.phoneUrl ?? "tel:+4917614061816"} className="um-contact-item">
                {data?.phoneText ?? "+49 176 1406 18 16"}
              </a>
            </div>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="um-footer">
          <div className="um-footer-links">
            <Link href="/">Start</Link>
            <Link href="/ki-coaching/beratung">Beratung</Link>
            <Link href="/ki-coaching/workshop">Workshop</Link>
            <Link href="/ki-coaching/kompass">Kompass</Link>
            <Link href="/zuhoeren">Gehört werden</Link>
            <Link href="/impressum">Impressum</Link>
            <Link href="/datenschutz">Datenschutz</Link>
          </div>
          <span>© 2025 KI-Coaching Kompass · Bernd Wiese · Staufen</span>
        </footer>
      </div>
    </>
  );
}
