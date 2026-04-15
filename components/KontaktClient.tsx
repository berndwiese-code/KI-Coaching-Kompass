"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Theme = "light" | "dark";

export default function KontaktClient() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

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

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("submitting");
    const formData = new FormData(e.currentTarget);
    formData.append("access_key", "f2271aed-9d4c-45f2-a779-96e8ee685e8d");
    formData.append("subject", "Neue Rückruf-Anfrage über Webseite");
    formData.append("from_name", "KI-Coaching Kompass");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setFormStatus("success");
      } else {
        setFormStatus("error");
      }
    } catch (error) {
      setFormStatus("error");
    }
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

        /* ── STACKED LAYOUT ── */
        .kontakt-grid {
          display: flex;
          flex-direction: column;
          gap: 4rem;
          max-width: 800px;
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
          text-align: center;
        }

        /* 1: Kalender */
        .calendar-wrapper {
          width: 100%;
          height: 600px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          background: var(--surface);
          box-shadow: var(--shadow);
        }
        
        .calendar-iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        /* 2: Direkter Kontakt */
        .rueckruf-form {
          display: flex; flex-direction: column; gap: 1rem;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 8px; padding: 2rem; margin-bottom: 2.5rem;
        }
        .rueckruf-form-title {
          font-size: 1rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 0.5rem; font-weight: 500;
          display: flex; align-items: center; gap: 0.75rem;
        }
        .rueckruf-input {
          width: 100%; padding: 12px 14px; background: var(--bg2);
          border: 1px solid var(--border); border-radius: 6px;
          font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
          color: var(--text); outline: none; transition: border-color 0.2s;
        }
        .rueckruf-input:focus { border-color: var(--gold); }
        .rueckruf-btn {
          background: var(--gold); color: var(--bg); border: none;
          border-radius: 6px; padding: 12px 16px; font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem; letter-spacing: 0.08em; text-transform: uppercase;
          font-weight: 500; cursor: pointer; transition: background 0.2s, transform 0.2s;
          margin-top: 0.5rem;
        }
        .rueckruf-btn:hover { background: var(--gold2); transform: translateY(-1px); }

        .contact-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .contact-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
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
        
        .contact-icon {
          color: var(--gold);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: var(--bg2);
          flex-shrink: 0;
        }

        .contact-content {
          display: flex;
          flex-direction: column;
        }

        .contact-card-title {
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 0.3rem;
          font-weight: 500;
        }

        .contact-card-value {
          font-size: 1.25rem;
          color: var(--text);
          font-weight: 400;
          word-break: break-word;
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
        }
        @media (max-width: 600px) {
          .kontakt-col { padding: 2rem 1.5rem; }
          .contact-card { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .rueckruf-form { padding: 1.5rem; }
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

        {/* LAYOUT */}
        <div className="kontakt-grid">
          {/* 1. Kalender Integration */}
          <div className="calendar-wrapper" id="google-calendar-embed">
            <iframe 
              src="https://calendar.google.com/calendar/appointments/AcZssZ1jl0NOiRxuu9-ml1DO-l3Tqz5EreoqWx_XV9k=?gv=true"
              className="calendar-iframe"
              title="Gespräch buchen mit Bernd Wiese"
            />
          </div>

          {/* 2. Alternative Kontaktwege */}
          <div className="kontakt-col">
            <h2 className="kontakt-col-title">Weitere Kontaktwege</h2>

            <form onSubmit={handleFormSubmit} className="rueckruf-form">
              <span className="rueckruf-form-title">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                Rückruf anfordern
              </span>
              
              {formStatus === "success" ? (
                <div style={{ padding: "1.5rem 1rem", background: "var(--bg3)", borderRadius: "6px", color: "var(--text)", textAlign: "center", fontSize: "0.95rem" }}>
                  <strong>Vielen Dank!</strong><br />Deine Anfrage wurde erfolgreich gesendet. Ich melde mich in Kürze bei dir.
                </div>
              ) : (
                <>
                  <input type="text" name="Name" placeholder="Ihr Name" className="rueckruf-input" required disabled={formStatus === "submitting"} />
                  <input type="tel" name="Telefon" placeholder="Ihre Nummer" className="rueckruf-input" required disabled={formStatus === "submitting"} />
                  <input type="text" name="Wunschzeit" placeholder="Beste Zeit (z.B. Dienstag 14 Uhr)" className="rueckruf-input" disabled={formStatus === "submitting"} />
                  
                  {formStatus === "error" && (
                    <div style={{ color: "#d32f2f", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                      Ein Fehler ist aufgetreten. Bitte versuche es später nochmal oder rufe an.
                    </div>
                  )}

                  <button type="submit" disabled={formStatus === "submitting"} className="rueckruf-btn" style={{ opacity: formStatus === "submitting" ? 0.7 : 1 }}>
                    {formStatus === "submitting" ? "Wird gesendet..." : "Rückruf anfordern"}
                  </button>
                </>
              )}
            </form>

            <div className="contact-list">
              <a href="mailto:bernd.wiese@googlemail.com" className="contact-card">
                <div className="contact-icon">
                  <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" /><rect x="3" y="5" width="18" height="14" rx="2" /></svg>
                </div>
                <div className="contact-content">
                  <span className="contact-card-title">Per E-Mail schreiben</span>
                  <span className="contact-card-value">bernd.wiese@googlemail.com</span>
                </div>
              </a>

              <a href="tel:+491701234567" className="contact-card">
                <div className="contact-icon">
                  <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
                </div>
                <div className="contact-content">
                  <span className="contact-card-title">Anrufen / Rückruf</span>
                  <span className="contact-card-value">+49 (0) 170 123 4567</span>
                </div>
              </a>

              <a href="https://www.linkedin.com/in/bernd-wiese" target="_blank" rel="noopener noreferrer" className="contact-card">
                <div className="contact-icon">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </div>
                <div className="contact-content">
                  <span className="contact-card-title">Vernetzen</span>
                  <span className="contact-card-value">LinkedIn Profil</span>
                </div>
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
