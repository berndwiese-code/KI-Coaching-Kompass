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

export default function HomeClient({ startseite, testimonials }: Props) {
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
        .hero-portrait {
          position: absolute; top: 50%; right: 0;
          transform: translateY(-50%);
          width: 190px; overflow: hidden; pointer-events: none;
        }
        .hero-portrait img {
          width: 100%; height: auto;
          object-position: center top;
          display: block;
          mask-image: linear-gradient(to right, transparent 0%, black 30%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 30%);
        }
        @media (max-width: 1300px) { .hero-portrait { width: 168px; } }
        @media (max-width: 1050px) { .hero-portrait { width: 144px; } }
        @media (max-width: 900px)  { .hero-portrait { display: none; } }

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
          font-size: 1.05rem; font-weight: 400; color: var(--text2);
          max-width: 480px; line-height: 1.85;
          animation: fadeUp 0.7s 0.16s ease both;
        }

        .hero-pills {
          margin-top: 2.5rem;
          display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center;
          animation: fadeUp 0.7s 0.24s ease both;
        }
        .hero-pill {
          font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase;
          text-decoration: none; padding: 0.55rem 1.3rem;
          border: 1px solid var(--border); color: var(--text2);
          border-radius: 20px;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .hero-pill:hover { border-color: var(--gold); color: var(--gold); }
        .hero-pill.primary {
          background: var(--gold); color: var(--bg); border-color: var(--gold);
        }
        .hero-pill.primary:hover { background: var(--gold2); border-color: var(--gold2); color: var(--bg); }

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
        .sec.dark-band {
          background: var(--bg2);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
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

        /* ── DREI WEGE ── */
        .drei-wege-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: var(--border); margin-top: 3.5rem;
        }
        .weg-card {
          background: var(--surface);
          padding: 2.5rem 2rem;
          display: flex; flex-direction: column;
          transition: background 0.25s;
        }
        .weg-card:hover { background: var(--bg3); }
        .weg-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3rem; font-weight: 300; line-height: 1;
          color: var(--border); margin-bottom: 1.5rem;
        }
        .weg-eyebrow {
          font-size: 0.63rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 0.9rem;
        }
        .weg-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.4rem, 2vw, 1.75rem);
          font-weight: 300; line-height: 1.2; color: var(--text);
          margin-bottom: 1.1rem;
        }
        .weg-title em { font-style: italic; color: var(--gold2); }
        .weg-text {
          font-size: 0.9rem; color: var(--muted); line-height: 1.8;
          flex: 1; margin-bottom: 2rem;
        }
        .weg-link {
          font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--gold); text-decoration: none;
          display: inline-flex; align-items: center; gap: 0.4rem;
          transition: gap 0.2s, color 0.2s;
        }
        .weg-link:hover { gap: 0.7rem; color: var(--gold2); }

        /* ── KOMPASS BAND ── */
        .kompass-band .sec-in {
          display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;
        }
        .kompass-text {}
        .kompass-stat-row {
          display: flex; gap: 2.5rem; margin-top: 2rem; flex-wrap: wrap;
        }
        .kompass-stat { display: flex; flex-direction: column; }
        .stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.8rem; font-weight: 300; color: var(--gold2); line-height: 1;
        }
        .stat-lbl {
          font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--muted); margin-top: 0.25rem;
        }
        .kompass-pull {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.5rem, 2.5vw, 2.2rem);
          font-weight: 300; font-style: italic;
          line-height: 1.4; color: var(--text2);
          padding-left: 2rem;
          border-left: 2px solid var(--gold);
        }

        /* ── ÜBER MINI ── */
        .ueber-mini .sec-in {
          display: flex; align-items: center; gap: 3.5rem;
        }
        .ueber-mini-portrait {
          width: clamp(100px, 14vw, 160px);
          flex-shrink: 0; overflow: hidden;
          border-radius: 4px;
        }
        .ueber-mini-portrait img {
          width: 100%; height: auto; display: block;
          filter: grayscale(20%);
        }
        .ueber-mini-text {}
        .ueber-mini-text p {
          font-size: 0.98rem; color: var(--text2); line-height: 1.85;
          margin-bottom: 0.5rem;
        }
        .ueber-mini-text p em { font-style: italic; color: var(--text); }

        /* ── STIMMEN ── */
        .stimmen-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: var(--border); margin-top: 2.75rem;
        }
        .stimme-card { background: var(--surface); padding: 2rem; border-radius: 0; transition: background 0.35s; }
        .stimme-q {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.08rem; font-weight: 300; font-style: italic;
          line-height: 1.7; color: var(--text2); margin-bottom: 1.4rem;
        }
        .stimme-q::before {
          content: '\u201e'; font-size: 3.5rem; line-height: 0;
          vertical-align: -0.55rem; color: var(--gold); opacity: 0.5;
          margin-right: 0.05rem; font-style: normal;
        }
        .stimme-auth { font-size: 0.74rem; color: var(--muted); }
        .stimme-auth strong { display: block; color: var(--text2); font-weight: 400; margin-bottom: 0.15rem; }

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
        @media (max-width: 900px) {
          .kck-nav { padding: 1rem 1.5rem; }
          .nav-logo { font-size: 0.88rem; white-space: nowrap; }
          .drei-wege-grid { grid-template-columns: 1fr; }
          .kompass-band .sec-in { grid-template-columns: 1fr; gap: 2rem; }
          .kompass-pull { border-left: none; padding-left: 0; border-top: 2px solid var(--gold); padding-top: 1.5rem; }
          .ueber-mini .sec-in { flex-direction: column; gap: 2rem; }
          .stimmen-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .hero-pills { flex-direction: column; align-items: center; }
          .theme-label { display: none; }
          .kompass-stat-row { gap: 1.5rem; }
        }
      `}</style>

      <div className={`kck-root ${theme}`}>

        {/* NAV */}
        <nav className="kck-nav">
          <Link href="/" className="nav-logo">KI-Coaching<span> Kompass</span></Link>
          <div className="nav-right">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Farbschema wechseln" />
            <Link href="/ki-coaching/beratung" className="nav-cta">Beratung</Link>
            <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menü öffnen">
              <span /><span /><span />
            </button>
          </div>
          <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
            <Link href="/" className="active" onClick={() => setMenuOpen(false)}>Start</Link>
            <Link href="/ki-coaching" onClick={() => setMenuOpen(false)}>KI-Coaching</Link>
            <Link href="/ki-coaching/beratung" className="sub-item" onClick={() => setMenuOpen(false)}>Beratung</Link>
            <Link href="/ki-coaching/workshop" className="sub-item" onClick={() => setMenuOpen(false)}>Workshop</Link>
            <Link href="/ki-coaching/kompass" className="sub-item" onClick={() => setMenuOpen(false)}>Kompass</Link>
            <Link href="/zuhoeren" onClick={() => setMenuOpen(false)}>Gehört werden</Link>
            <Link href="/ueber-mich" onClick={() => setMenuOpen(false)}>Über mich</Link>
          </div>
        </nav>

        {/* HERO */}
        <div className="hero">
          <div className="hero-portrait" style={{ pointerEvents: "auto" }}>
            <img src="/bernd-wiese.jpg" alt="Bernd Wiese" />
            <a href="/ueber-mich" style={{
              position: "absolute",
              bottom: "1.5rem",
              right: "1rem",
              fontSize: "0.68rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "rgba(255,255,255,0.85)",
              background: "rgba(0,0,0,0.35)",
              backdropFilter: "blur(6px)",
              padding: "0.4rem 1rem",
              borderRadius: "20px",
              textDecoration: "none",
              whiteSpace: "nowrap" as const,
            }}>
              Über mich →
            </a>
          </div>
          <div className="hero-orb" />
          <p className="hero-eyebrow">{startseite?.heroEyebrow ?? "KI-Coaching Kompass"}</p>
          <h1 className="hero-title">
            {startseite?.heroTitel ?? <>KI verändert, wie wir uns begegnen.<br />Die Frage ist nur: <em>wie?</em></>}
          </h1>
          <p className="hero-sub">
            {startseite?.heroUntertitel ?? (
              <>
                Ich begleite Unternehmen, Coaches und Menschen, die das herausfinden wollen —
                mit Methode, Präsenz und ohne Hype.
              </>
            )}
          </p>
          <div className="hero-pills">
            <Link href="/ki-coaching/beratung" className="hero-pill primary">Für Unternehmen</Link>
            <Link href="/ki-coaching/workshop" className="hero-pill">Für Coaches</Link>
            <Link href="/zuhoeren" className="hero-pill">Für mich</Link>
          </div>
          <div className="hero-scroll">
            <span>Weiter</span>
            <div className="scroll-line" />
          </div>
        </div>

        <hr className="divider" />

        {/* DREI WEGE */}
        <section className="sec" id="angebote">
          <div className="sec-in">
            <p className="eyebrow">Die drei Wege</p>
            <h2 className="sec-title">Was kann ich für dich tun?</h2>
            <p className="sec-lead">
              Drei Zielgruppen. Drei Formate. Ein gemeinsamer Ausgangspunkt:
              KI ist kein Selbstzweck — sie ist ein Spiegel.
            </p>
            <div className="drei-wege-grid">

              {/* Card 1: Unternehmen */}
              <div className="weg-card">
                <div className="weg-number">01</div>
                <p className="weg-eyebrow">Für Unternehmen</p>
                <h3 className="weg-title">KI-Coaching kommt.<br /><em>Seid ihr bereit dafür?</em></h3>
                <p className="weg-text">
                  Nicht als Hype-Welle, die man einfach surft. Sondern als echte Entscheidung:
                  Was soll KI in eurem Coaching-Prozess können — und was soll sie lassen?
                  Ich begleite euch dabei, das herauszufinden.
                </p>
                <Link href="/ki-coaching/beratung" className="weg-link">Beratung entdecken →</Link>
              </div>

              {/* Card 2: Coaches */}
              <div className="weg-card">
                <div className="weg-number">02</div>
                <p className="weg-eyebrow">Für Coaches</p>
                <h3 className="weg-title">KI im Coaching —<br /><em>muss das sein?</em></h3>
                <p className="weg-text">
                  Spoiler: Ja. Aber nicht so, wie du vielleicht denkst.
                  Nicht als Konkurrenz zu deiner Arbeit — als Werkzeug, das dir Zeit,
                  Klarheit und neue Möglichkeiten zurückgibt.
                </p>
                <Link href="/ki-coaching/workshop" className="weg-link">Workshop entdecken →</Link>
              </div>

              {/* Card 3: Für dich */}
              <div className="weg-card">
                <div className="weg-number">03</div>
                <p className="weg-eyebrow">Für dich</p>
                <h3 className="weg-title">Manchmal braucht es jemanden,<br /><em>der einfach zuhört.</em></h3>
                <p className="weg-text">
                  Kein Programm. Kein Tool. Nur ein Gespräch —
                  in dem du dich selbst hören kannst.
                  Mit mir, in echter Präsenz.
                </p>
                <Link href="/zuhoeren" className="weg-link">Gehört werden →</Link>
              </div>

            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* KOMPASS ALS BEWEIS */}
        <section className="sec alt kompass-band">
          <div className="sec-in">
            <div className="kompass-text">
              <p className="eyebrow">{startseite?.toolsEyebrow ?? "Der Kompass"}</p>
              <h2 className="sec-title">
                {startseite?.toolsTitel ?? <>Tools, Studien, Meinungen —<br /><em>ohne Affiliate-Brille.</em></>}
              </h2>
              <p className="sec-lead">
                {startseite?.toolsFooterText ?? "Ich habe aufgehört zu zählen, wie viele KI-Tools sich als Coaching-Revolution vermarkten. Deshalb habe ich angefangen zu sortieren. Der Kompass ist kein Versprechen — er ist das, was ich selbst gebraucht hätte."}
              </p>
              <div className="kompass-stat-row">
                <div className="kompass-stat">
                  <span className="stat-num">40+</span>
                  <span className="stat-lbl">Tools bewertet</span>
                </div>
                <div className="kompass-stat">
                  <span className="stat-num">3</span>
                  <span className="stat-lbl">Perspektiven</span>
                </div>
                <div className="kompass-stat">
                  <span className="stat-num">0</span>
                  <span className="stat-lbl">Affiliate-Links</span>
                </div>
              </div>
              <Link href="/ki-coaching/kompass" className="btn-primary" style={{marginTop: "2rem", display: "inline-block"}}>
                {startseite?.toolsFooterCta ?? "Zum Kompass"}
              </Link>
            </div>
            <blockquote className="kompass-pull">
              Keine leeren Versprechen,<br />
              sondern kuratiertes Wissen.<br />
              Für alle, die den Unterschied<br />
              erkennen wollen.
            </blockquote>
          </div>
        </section>

        <hr className="divider" />

        {/* STIMMEN */}
        {testimonials.length > 0 && (
          <>
            <section className="sec">
              <div className="sec-in">
                <p className="eyebrow">{startseite?.testimonialsEyebrow ?? "Stimmen"}</p>
                <h2 className="sec-title">
                  {startseite?.testimonialsTitel ?? <>Was Menschen sagen,<br /><em>die dabei waren.</em></>}
                </h2>
                <div className="stimmen-grid">
                  {testimonials.map(t => (
                    <div key={t._id} className="stimme-card">
                      <p className="stimme-q">{t.zitat}</p>
                      <p className="stimme-auth"><strong>{t.name}</strong>{t.rolle ?? ""}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <hr className="divider" />
          </>
        )}

        {/* ÜBER MINI */}
        <section className="sec ueber-mini">
          <div className="sec-in">
            <div className="ueber-mini-portrait">
              <img src="/bernd-wiese.jpg" alt="Bernd Wiese" />
            </div>
            <div className="ueber-mini-text">
              <p className="eyebrow">Über mich</p>
              <h2 className="sec-title" style={{marginBottom: "1rem"}}>
                Bernd Wiese
              </h2>
              <p>
                Ich liebe echte Präsenz — und ich finde es faszinierend, was gerade mit KI entsteht.
                Nicht nur technologisch. Sondern in dem, was es über uns sichtbar macht.
              </p>
              <p style={{marginTop: "0.75rem"}}>
                Ich arbeite in der Spannung zwischen einem Zuhören, das nichts will,
                und einer Technologie, die unglaublich viel kann. Als Zuhörcoach und KI-Berater
                aus Freiburg.
              </p>
              <Link href="/ueber-mich" className="btn-outline" style={{marginTop: "1.75rem", display: "inline-block"}}>
                Mehr über mich
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{
          background: "var(--bg2)", borderTop: "1px solid var(--border)",
          padding: "2rem 2.5rem", display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap" as const, gap: "1rem",
          transition: "background 0.35s",
        }}>
          <span style={{fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.04em"}}>
            {startseite?.footerCopyright ?? "© 2025 KI-Coaching Kompass · Bernd Wiese · Freiburg"}
          </span>
          <ul style={{display: "flex", gap: "2rem", listStyle: "none", flexWrap: "wrap" as const}}>
            {[
              { label: "Beratung", href: "/ki-coaching/beratung" },
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
