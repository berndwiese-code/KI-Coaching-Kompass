"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Theme = "light" | "dark";

export type ToolHighlight = {
  nummer?: string;
  titel: string;
  text: string;
  popupText?: string;
};

export type ToolCheck = {
  titel: string;
  text: string;
};

export type ToolDetailProps = {
  toolName: string;
  heroHeadline: string;
  heroSubline?: string;
  heroEinleitung?: string;
  highlights: ToolHighlight[];
  checkTitel?: string;
  checkTextLead?: string;
  checks?: ToolCheck[];
  ctaButtonText?: string;
};

export default function ToolDetailClient({
  toolName,
  heroHeadline,
  heroSubline,
  heroEinleitung,
  highlights,
  checkTitel = "Der Bernd-Wiese-Check",
  checkTextLead = "Warum empfehle ich dieses Tool?",
  checks = [],
  ctaButtonText = "Jetzt Kontakt aufnehmen"
}: ToolDetailProps) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePopup, setActivePopup] = useState<{titel: string, text: string} | null>(null);

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

  const fallbackNav = [
    { label: "Unternehmen", url: "/ki-coaching/beratung-unternehmen" },
    { label: "Coaches", url: "/ki-coaching/beratung-coaches" },
    { label: "Workshop", url: "/ki-coaching/workshop" },
    { label: "Zuhören ↗", url: "https://isha.de", isExternal: true },
    { label: "Kompass", url: "/ki-coaching/kompass" },
    { label: "Kontakt", url: "/kontakt" }
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .ws-root {
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          line-height: 1.75;
          overflow-x: hidden;
          transition: background 0.35s, color 0.35s;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        .ws-root.light {
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

        .ws-root.dark {
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
        .ws-nav {
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
        .nav-center { display: flex; gap: 2rem; list-style: none; }
        .nav-center a {
          font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--text2); text-decoration: none; transition: color 0.2s;
        }
        .nav-center a.active, .nav-center a:hover { color: var(--gold); }
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
        .ws-root.light .theme-toggle::after { left: 3px; }
        .ws-root.dark  .theme-toggle::after { left: 23px; }
        .nav-cta {
          font-size: 0.73rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--bg); background: var(--gold); padding: 0.5rem 1.2rem;
          text-decoration: none; font-weight: 500; transition: background 0.2s;
          white-space: nowrap; border-radius: 6px;
        }
        .nav-cta:hover { background: var(--gold2); }

        /* ── SECTIONS ── */
        .ws-section {
          padding: 7rem 2rem 5rem;
          max-width: 1100px; margin: 0 auto;
        }
        .ws-section.full-bleed {
          max-width: none; padding-left: 0; padding-right: 0;
        }
        .ws-section-inner {
          max-width: 1100px; margin: 0 auto; padding: 0 2rem;
        }

        /* ── HERO ── */
        .ws-hero {
          background: var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10rem 2rem 6rem; text-align: center;
          position: relative; overflow: hidden;
          transition: background 0.35s;
        }
        .hero-content {
          display: flex; flex-direction: column;
          align-items: center; justify-content: flex-start;
          padding: 0;
          position: relative; z-index: 2;
        }
        .ws-hero-orb {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -60%);
          width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(ellipse, rgba(200,160,70,0.1) 0%, transparent 68%);
          pointer-events: none;
        }
        .eyebrow {
          display: inline-flex; align-items: center; gap: 0.6rem;
          font-size: 0.68rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--gold); border: 1px solid var(--border);
          padding: 0.38rem 1rem; margin-bottom: 2rem;
          border-radius: 4px;
        }
        .eyebrow::before { content: ''; width: 16px; height: 1px; background: var(--gold); }
        .ws-hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.6rem, 6vw, 5rem);
          font-weight: 300; line-height: 1.1; color: var(--text);
          max-width: 780px; margin-bottom: 1rem;
        }
        .ws-hero-title em { font-style: italic; color: var(--gold2); }
        .ws-hero-sub {
          font-size: 1.12rem; font-weight: 400; color: var(--text2);
          letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 2.5rem;
        }
        .ws-hero-einleitung {
          font-size: 1.15rem; font-weight: 400; color: var(--text2);
          line-height: 1.8; max-width: 680px; margin-bottom: 2.5rem;
        }
        .ws-hero-cta { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; margin-top: 2rem;}
        .btn-primary {
          display: inline-block; background: var(--gold); color: var(--bg);
          padding: 0.75rem 2rem; font-size: 0.78rem; font-weight: 500;
          letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none;
          transition: background 0.2s; border-radius: 6px;
        }
        .btn-primary:hover { background: var(--gold2); }
        .btn-outline {
          display: inline-block; border: 1px solid var(--border); color: var(--gold);
          padding: 0.75rem 2rem; font-size: 0.78rem; letter-spacing: 0.1em;
          text-transform: uppercase; text-decoration: none;
          transition: border-color 0.2s, color: var(--gold2); border-radius: 6px;
        }
        .btn-outline:hover { border-color: var(--gold2); color: var(--gold2); }

        /* ── SECTION HEADER ── */
        .sec-eyebrow {
          font-size: 0.68rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 0.75rem;
        }
        .sec-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 4vw, 3rem); font-weight: 300;
          color: var(--text); line-height: 1.2; margin-bottom: 1rem;
        }
        .sec-title em { font-style: italic; color: var(--gold2); }
        .sec-lead {
          font-size: 1.05rem; font-weight: 400; color: var(--text2);
          max-width: 580px; line-height: 1.8;
        }

        /* ── MITNAHMEN (Highlights) ── */
        .ws-mitnahmen {
          background: var(--bg2); padding: 6rem 2rem;
          transition: background 0.35s;
        }
        .mitnahmen-inner { max-width: 1100px; margin: 0 auto; }
        .mitnahmen-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem; margin-top: 3rem;
        }
        .mitnahme-card {
          background: var(--surface); padding: 1.8rem;
          border-left: 3px solid var(--gold);
          border-radius: 8px;
          box-shadow: var(--shadow); transition: background 0.2s;
        }
        .mitnahme-card:hover { background: var(--bg3); }
        .mitnahme-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem; font-weight: 300; color: var(--border);
          line-height: 1; margin-bottom: 0.75rem;
        }
        .mitnahme-text { font-size: 0.93rem; color: var(--text2); line-height: 1.7; }
        .mitnahme-text strong { display: block; color: var(--text); font-weight: 500; font-size: 1.05rem; margin-bottom: 0.5rem;}

        /* ── ENTHALTEN (Bernd Wiese Check) ── */
        .ws-enthalten {
          background: var(--bg); padding: 6rem 2rem; transition: background 0.35s;
        }
        .enthalten-inner { max-width: 1100px; margin: 0 auto; }
        .enthalten-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1px;
          background: var(--border); margin-top: 3rem;
        }
        .enthalten-item {
          background: var(--surface); padding: 1.6rem 1.8rem;
          display: flex; gap: 1rem; align-items: flex-start;
          transition: background 0.2s;
        }
        .enthalten-item:hover { background: var(--bg3); }
        .enthalten-check {
          width: 22px; height: 22px; border-radius: 50%;
          background: var(--gold); color: var(--bg);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem; font-weight: 700; flex-shrink: 0; margin-top: 2px;
        }
        .enthalten-text { font-size: 0.9rem; color: var(--text2); line-height: 1.65; }
        .enthalten-text strong { display: block; color: var(--text); font-weight: 500; margin-bottom: 0.2rem; }

        /* ── FOOTER ── */
        .ws-footer {
          background: var(--bg2); border-top: 1px solid var(--border2);
          padding: 2.5rem 2.5rem; transition: background 0.35s;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 1rem;
        }
        .footer-copy { font-size: 0.72rem; color: var(--muted); letter-spacing: 0.04em; }
        .footer-links { display: flex; gap: 1.5rem; flex-wrap: wrap; }
        .footer-links a {
          font-size: 0.72rem; color: var(--muted); text-decoration: none;
          letter-spacing: 0.06em; text-transform: uppercase; transition: color 0.2s;
        }
        .footer-links a:hover { color: var(--gold); }

        /* ── CTA ── */
        .ws-cta {
          padding: 7rem 2rem; background: var(--bg2); transition: background 0.35s;
          text-align: center;
        }
        .cta-inner { max-width: 700px; margin: 0 auto; }
        .cta-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-top: 3rem;}

        /* ── MODAL ── */
        .ws-modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(20,18,16,0.6); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 1.5rem;
          opacity: 0; pointer-events: none; transition: opacity 0.25s ease-out;
        }
        .ws-modal-overlay.open {
          opacity: 1; pointer-events: auto;
        }
        .ws-modal {
          background: var(--surface); padding: 3rem 2.5rem;
          border-radius: 12px; border: 1px solid var(--border);
          box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-width: 500px; width: 100%;
          position: relative;
          transform: translateY(20px) scale(0.95); transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .ws-modal-overlay.open .ws-modal { transform: translateY(0) scale(1); }
        .ws-modal-close {
          position: absolute; top: 1.2rem; right: 1.5rem;
          background: none; border: none; font-size: 2rem; line-height: 1;
          color: var(--muted); cursor: pointer; transition: color 0.2s;
        }
        .ws-modal-close:hover { color: var(--gold); }
        .ws-modal-title {
          font-family: 'Cormorant Garamond', serif; font-size: 2.2rem;
          color: var(--text); margin-bottom: 1.2rem; font-weight: 300; line-height: 1.1;
        }
        .ws-modal-text {
          font-size: 1rem; color: var(--text2); line-height: 1.75;
        }

        /* ── HAMBURGER + MOBILE-MENU ── */
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
        @media (max-width: 900px) {
           .nav-center { display: none; }
        }
        @media (max-width: 600px) {
          .nav-cta { display: none; }
          .mobile-menu { left: auto; right: 0; width: min(88vw, 300px); }
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .ws-nav { padding: 0.9rem 1.2rem; }
          .nav-logo { font-size: 0.88rem; white-space: nowrap; }
          .enthalten-grid { grid-template-columns: 1fr; }
          .ws-hero { padding: 7rem 1.2rem 4rem; }
          .ws-section, .ws-mitnahmen, .ws-enthalten, .ws-cta { padding: 4rem 1.2rem; }
        }
      `}</style>

      <div className={`ws-root ${theme}`}>

        {/* NAV */}
        <nav className="ws-nav">
          <Link href="/" className="nav-logo">KI-Coaching<span> Kompass</span></Link>
          <ul className="nav-center">
            {fallbackNav.map((link, i) => (
              <li key={i}>
                {link.isExternal ? (
                  <a href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>
                ) : (
                  <Link href={link.url}>{link.label}</Link>
                )}
              </li>
            ))}
          </ul>
          <div className="nav-right">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Theme wechseln" />
            <Link href="/kontakt" className="nav-cta">
              Kontakt
            </Link>
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
        <section className="ws-hero">
          <div className="hero-content">
            <div className="ws-hero-orb" />
            <div className="eyebrow">{toolName}</div>
            <h1 className="ws-hero-title" dangerouslySetInnerHTML={{ __html: heroHeadline }} />
            {heroSubline && <p className="ws-hero-sub">{heroSubline}</p>}
            {heroEinleitung && <p className="ws-hero-einleitung">{heroEinleitung}</p>}
            <div className="ws-hero-cta">
              <a href="#highlights" className="btn-primary">Highlights entdecken</a>
            </div>
          </div>
        </section>

        {/* HIGHLIGHTS */}
        <section id="highlights" className="ws-mitnahmen">
          <div className="mitnahmen-inner">
            <p className="sec-eyebrow">Plattform Features</p>
            <h2 className="sec-title">Key-<em>Highlights</em></h2>
            <div className="mitnahmen-grid">
              {highlights.map((mitnahme, i) => (
                <div 
                  className="mitnahme-card" 
                  key={i}
                  style={mitnahme.popupText ? {cursor: "pointer"} : {}}
                  onClick={() => mitnahme.popupText ? setActivePopup({titel: mitnahme.titel, text: mitnahme.popupText}) : undefined}
                >
                  <div className="mitnahme-num">{mitnahme.nummer || `0${i + 1}`}</div>
                  <p className="mitnahme-text">
                    <strong>{mitnahme.titel}</strong>
                    <span dangerouslySetInnerHTML={{ __html: mitnahme.text }} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BERND WIESE CHECK */}
        <section className="ws-enthalten">
          <div className="enthalten-inner">
            <p className="sec-eyebrow">Warum dieses Tool?</p>
            <h2 className="sec-title" dangerouslySetInnerHTML={{ __html: checkTitel.replace(checkTitel.split(" ").slice(-1)[0], `<em>${checkTitel.split(" ").slice(-1)[0]}</em>`) }} />
            <p className="sec-lead">{checkTextLead}</p>
            {checks && checks.length > 0 && (
              <div className="enthalten-grid">
                {checks.map((item, i) => (
                  <div className="enthalten-item" key={i}>
                    <div className="enthalten-check">✓</div>
                    <p className="enthalten-text">
                      <strong dangerouslySetInnerHTML={{ __html: item.titel }} />
                      <span dangerouslySetInnerHTML={{ __html: item.text }} />
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="ws-cta">
          <div className="cta-inner">
            <p className="sec-eyebrow">Interesse geweckt?</p>
            <h2 className="sec-title">Lassen Sie uns <em>sprechen</em></h2>
            <p className="sec-lead" style={{ margin: '0 auto' }}>Möchten Sie mehr über {toolName} und die Einsatzmöglichkeiten in Ihrem Umfeld erfahren?</p>
            <div className="cta-buttons">
              <Link href="/kontakt" className="btn-primary">{ctaButtonText}</Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="ws-footer">
          <div className="footer-links">
            <Link href="/impressum">Impressum</Link>
            <Link href="/datenschutz">Datenschutz</Link>
          </div>
          <div className="footer-copy">
            © 2026 KI-Coaching Kompass · Bernd Wiese · Staufen
          </div>
        </footer>

        {/* POPUP MODAL */}
        <div className={`ws-modal-overlay ${activePopup ? "open" : ""}`} onClick={() => setActivePopup(null)}>
          <div className="ws-modal" onClick={e => e.stopPropagation()}>
            <button className="ws-modal-close" onClick={() => setActivePopup(null)} aria-label="Schließen">×</button>
            <h3 className="ws-modal-title">{activePopup?.titel}</h3>
            <p className="ws-modal-text" dangerouslySetInnerHTML={{ __html: activePopup?.text || "" }} />
          </div>
        </div>

      </div>
    </>
  );
}
