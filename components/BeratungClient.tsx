"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Beratung } from "@/sanity/lib/queries";

type Theme = "light" | "dark";
type Tab = "unternehmen" | "coaches";

type BeratungClientProps = {
  beratung?: Beratung | null;
};

export default function BeratungClient({ beratung }: BeratungClientProps) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("unternehmen");

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

        .br-root {
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          line-height: 1.75;
          overflow-x: hidden;
          transition: background 0.35s, color 0.35s;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        .br-root.light {
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

        .br-root.dark {
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
        .br-nav {
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
        .br-root.light .theme-toggle::after { left: 3px; }
        .br-root.dark  .theme-toggle::after { left: 23px; }
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
          padding: 0.85rem 0; border-bottom: 1px solid var(--border2);
          transition: color 0.2s; padding-left: 1.5rem; padding-right: 1.5rem;
        }
        .mobile-menu a:last-child { border-bottom: none; }
        .mobile-menu a:hover { color: var(--gold); }
        @media (max-width: 600px) {
          .nav-cta { display: none; }
          .mobile-menu { left: auto; right: 0; width: min(88vw, 300px); }
        }

        /* ── HERO ── */
        .br-hero {
          min-height: 72vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 10rem 2rem 5rem; text-align: center;
          position: relative; overflow: hidden;
          background: var(--bg);
        }
        .hero-portrait {
          position: absolute; top: 0; right: 0; bottom: 0;
          width: 300px; overflow: hidden; pointer-events: none;
        }
        .hero-portrait img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: center top;
          display: block;
          mask-image: linear-gradient(to right, transparent 0%, black 30%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 30%);
        }
        @media (max-width: 1300px) { .hero-portrait { width: 200px; } }
        @media (max-width: 1050px) { .hero-portrait { width: 160px; } }
        @media (max-width: 900px) { .hero-portrait { display: none; } }

        .br-hero-orb {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -60%);
          width: 700px; height: 700px; border-radius: 50%;
          background: radial-gradient(ellipse, rgba(200,160,70,0.08) 0%, transparent 68%);
          pointer-events: none;
        }
        .eyebrow {
          display: inline-flex; align-items: center; gap: 0.6rem;
          font-size: 0.68rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--gold); border: 1px solid var(--border);
          padding: 0.38rem 1rem; margin-bottom: 2rem; border-radius: 4px;
          position: relative; z-index: 1;
        }
        .eyebrow::before { content: ''; width: 16px; height: 1px; background: var(--gold); }
        .br-hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.4rem, 5.5vw, 4.4rem);
          font-weight: 300; line-height: 1.12; color: var(--text);
          max-width: 820px; margin-bottom: 1.5rem;
          position: relative; z-index: 1;
        }
        .br-hero-title em { font-style: italic; color: var(--gold2); }
        .br-hero-lead {
          font-size: 1.1rem; color: var(--text2); max-width: 640px;
          line-height: 1.7; position: relative; z-index: 1;
          margin-bottom: 3rem;
        }

        /* ── TABS ── */
        .tab-bar {
          display: flex; gap: 0; border-bottom: 1px solid var(--border);
          max-width: 900px; margin: 0 auto 0;
          position: relative; z-index: 1;
        }
        .tab-btn {
          flex: 1; padding: 1rem 2rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem; letter-spacing: 0.14em; text-transform: uppercase;
          font-weight: 500; color: var(--muted);
          background: none; border: none; border-bottom: 2px solid transparent;
          cursor: pointer; transition: color 0.2s, border-color 0.2s;
          margin-bottom: -1px;
        }
        .tab-btn:hover { color: var(--text2); }
        .tab-btn.active { color: var(--gold); border-bottom-color: var(--gold); }

        /* ── TAB CONTENT ── */
        .tab-panel {
          max-width: 1100px; margin: 0 auto;
          padding: 5rem 2rem 7rem;
          display: none;
        }
        .tab-panel.active { display: block; }

        /* ── SECTION HEADINGS ── */
        .br-section-label {
          font-size: 0.65rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 0.75rem;
        }
        .br-section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.9rem, 3.5vw, 2.8rem);
          font-weight: 300; line-height: 1.2; color: var(--text);
          margin-bottom: 1.25rem;
        }
        .br-section-title em { font-style: italic; color: var(--gold2); }
        .br-section-body {
          font-size: 1.05rem; color: var(--text2); line-height: 1.8;
          max-width: 720px; margin-bottom: 3rem;
        }

        /* ── CHALLENGE BOX ── */
        .challenge-box {
          background: var(--bg2); border-left: 3px solid var(--gold);
          padding: 2rem 2.5rem; border-radius: 0 8px 8px 0;
          margin-bottom: 4rem;
        }
        .challenge-box p {
          font-size: 1rem; color: var(--text2); line-height: 1.8;
        }
        .challenge-box strong { color: var(--text); }

        /* ── PROCESS STEPS ── */
        .process-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem; margin-bottom: 5rem;
        }
        .process-step {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 10px; padding: 2rem 1.5rem;
          box-shadow: var(--shadow); position: relative;
        }
        .step-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.6rem; font-weight: 300;
          color: var(--gold); opacity: 0.5; line-height: 1;
          margin-bottom: 1rem;
        }
        .step-title {
          font-size: 0.85rem; font-weight: 500; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--text);
          margin-bottom: 0.75rem;
        }
        .step-body {
          font-size: 0.9rem; color: var(--text2); line-height: 1.65;
        }

        /* ── LEISTUNGS-KARTEN ── */
        .leistung-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem; margin-bottom: 5rem;
        }
        .leistung-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 10px; padding: 2rem 1.75rem;
          box-shadow: var(--shadow);
        }
        .leistung-icon {
          font-size: 1.6rem; margin-bottom: 1rem; display: block;
        }
        .leistung-title {
          font-size: 0.95rem; font-weight: 500; color: var(--text);
          margin-bottom: 0.75rem; letter-spacing: 0.04em;
        }
        .leistung-body {
          font-size: 0.88rem; color: var(--text2); line-height: 1.7;
        }

        /* ── TOOL-CLUSTER ── */
        .cluster-grid {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem; margin-bottom: 5rem;
        }
        .cluster-card {
          background: var(--bg2); border: 1px solid var(--border);
          border-radius: 8px; padding: 1.5rem 1.75rem;
        }
        .cluster-title {
          font-size: 0.8rem; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--gold); font-weight: 500; margin-bottom: 0.6rem;
        }
        .cluster-tools {
          font-size: 0.88rem; color: var(--text2); line-height: 1.7;
        }
        .cluster-tools strong { color: var(--text); }

        /* ── DIVIDER ── */
        .br-divider {
          border: none; border-top: 1px solid var(--border);
          margin: 4rem 0;
        }

        /* ── CTA BLOCK ── */
        .br-cta-block {
          background: var(--bg2); border: 1px solid var(--border);
          border-radius: 14px; padding: 3.5rem; text-align: center;
        }
        .br-cta-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          font-weight: 300; color: var(--text); margin-bottom: 1rem;
          line-height: 1.2;
        }
        .br-cta-title em { font-style: italic; color: var(--gold2); }
        .br-cta-body {
          font-size: 1rem; color: var(--text2); max-width: 540px;
          margin: 0 auto 2rem; line-height: 1.7;
        }
        .br-cta-btn {
          display: inline-block;
          font-size: 0.76rem; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--bg); background: var(--gold);
          padding: 0.85rem 2.2rem; border-radius: 6px;
          text-decoration: none; font-weight: 500;
          transition: background 0.2s;
        }
        .br-cta-btn:hover { background: var(--gold2); }

        /* ── FACTS ROW ── */
        .facts-row {
          display: flex; flex-wrap: wrap; gap: 2rem;
          justify-content: center; margin-bottom: 4rem;
        }
        .fact-item { text-align: center; }
        .fact-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.6rem; font-weight: 300; color: var(--gold);
          line-height: 1;
        }
        .fact-label {
          font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--muted); margin-top: 0.3rem;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .br-nav { padding: 0.9rem 1.5rem; }
          .nav-logo { font-size: 0.88rem; white-space: nowrap; }
          .process-grid { grid-template-columns: repeat(2, 1fr); }
          .leistung-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .nav-cta { display: none; }
          .mobile-menu { left: auto; right: 0; width: min(88vw, 300px); }
          .br-hero { padding: 8rem 1.5rem 3rem; }
          .tab-btn { padding: 0.85rem 1rem; font-size: 0.72rem; }
          .tab-panel { padding: 3rem 1.25rem 5rem; }
          .process-grid { grid-template-columns: 1fr; }
          .leistung-grid { grid-template-columns: 1fr; }
          .cluster-grid { grid-template-columns: 1fr; }
          .br-cta-block { padding: 2.5rem 1.5rem; }
          .challenge-box { padding: 1.5rem; }
          .facts-row { gap: 1.5rem; }
        }
      `}</style>

      <div className={`br-root ${theme}`}>
        {/* NAV */}
        <nav className="br-nav" style={{ position: "relative" }}>
          <Link href="/" className="nav-logo">
            KI<span>·</span>Coaching<span>·</span>Kompass
          </Link>
          <div className="nav-center" />
          <div className="nav-right">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Theme wechseln" />
            <Link href="/workshop" className="nav-cta">Workshop</Link>
            <button
              className={`hamburger ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menü"
            >
              <span /><span /><span />
            </button>
          </div>
          <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
            <Link href="/" onClick={() => setMenuOpen(false)}>Startseite</Link>
            <Link href="/kompass" onClick={() => setMenuOpen(false)}>KI-Kompass</Link>
            <Link href="/workshop" onClick={() => setMenuOpen(false)}>Workshop</Link>
            <Link href="/beratung" onClick={() => setMenuOpen(false)}>Beratung</Link>
            <Link href="/zuhoeren" onClick={() => setMenuOpen(false)}>Zuhören</Link>
          </div>
        </nav>

        {/* HERO */}
        <section className="br-hero">
          <div className="hero-portrait">
            <img src="/bernd-wiese.jpg" alt="Bernd Wiese" />
          </div>
          <div className="br-hero-orb" />
          <div className="eyebrow">{beratung?.heroEyebrow ?? "Beratung"}</div>
          <h1 className="br-hero-title">
            {beratung?.heroTitel ?? <>KI-Coaching-Software<br /><em>gezielt einsetzen.</em></>}
          </h1>
          <p className="br-hero-lead">
            {beratung?.heroLead ?? "Der Markt für KI-Coaching-Tools wächst rasant — über 249 Lösungen, jede mit eigenen Stärken, Risiken und Anwendungsfällen. Ich helfe Unternehmen und Coaches, in diesem Markt die richtige Wahl zu treffen."}
          </p>

          {/* TABS */}
          <div className="tab-bar">
            <button
              className={`tab-btn ${activeTab === "unternehmen" ? "active" : ""}`}
              onClick={() => setActiveTab("unternehmen")}
            >
              Für Unternehmen
            </button>
            <button
              className={`tab-btn ${activeTab === "coaches" ? "active" : ""}`}
              onClick={() => setActiveTab("coaches")}
            >
              Für Coaches
            </button>
          </div>
        </section>

        {/* ══════════════ TAB: UNTERNEHMEN ══════════════ */}
        <div className={`tab-panel ${activeTab === "unternehmen" ? "active" : ""}`}>

          {/* Challenge */}
          <div className="challenge-box">
            <p>
              <strong>Die Ausgangssituation:</strong> Unternehmen erkennen, dass Coaching ein
              strategisches Werkzeug für Führungskräfteentwicklung, Mitarbeiterbindung und
              kulturellen Wandel ist. Doch der Markt ist unübersichtlich: Soll es eine
              All-in-One-Plattform sein, oder spezialisierte Tools? Wie lässt sich Qualität
              messen? Was kostet wirklich was — und was rechnet sich? Und wie stellt man
              DSGVO-Konformität sicher, wenn KI-Systeme sensible Gesprächsdaten verarbeiten?
            </p>
          </div>

          {/* Facts */}
          <div className="facts-row">
            <div className="fact-item">
              <div className="fact-num">249+</div>
              <div className="fact-label">KI-Coaching-Tools<br />im Markt</div>
            </div>
            <div className="fact-item">
              <div className="fact-num">9</div>
              <div className="fact-label">Funktionale<br />Kategorien</div>
            </div>
            <div className="fact-item">
              <div className="fact-num">∅ 3×</div>
              <div className="fact-label">Mehr Engagement<br />mit KI-Unterstützung</div>
            </div>
            <div className="fact-item">
              <div className="fact-num">ROI</div>
              <div className="fact-label">Messbar &<br />nachweisbar</div>
            </div>
          </div>

          {/* Leistungen */}
          <div className="br-section-label">Was ich biete</div>
          <h2 className="br-section-title">
            Von der Analyse bis<br /><em>zum laufenden Betrieb</em>
          </h2>
          <p className="br-section-body">
            Ich begleite Sie durch den gesamten Prozess der Einführung von KI-Coaching —
            von der ersten Bedarfsklärung bis zur nachhaltigen Verankerung in Ihrer Organisation.
          </p>

          <div className="leistung-grid">
            <div className="leistung-card">
              <span className="leistung-icon">🔍</span>
              <div className="leistung-title">Bedarfsanalyse</div>
              <div className="leistung-body">
                Was wollen Sie mit Coaching wirklich erreichen? Wir klären Zielgruppen,
                Anwendungsfälle, Skalierungserwartungen und kulturelle Voraussetzungen —
                bevor wir auch nur ein Tool in Betracht ziehen.
              </div>
            </div>
            <div className="leistung-card">
              <span className="leistung-icon">🧭</span>
              <div className="leistung-title">Tool-Auswahl & Bewertung</div>
              <div className="leistung-body">
                Auf Basis Ihres Bedarfs erstelle ich eine strukturierte Shortlist aus dem
                Markt: von Praxis-Management-Software über KI-Coaching-Plattformen bis hin
                zu spezialisierten Assessment- und Analytics-Tools.
              </div>
            </div>
            <div className="leistung-card">
              <span className="leistung-icon">🛡</span>
              <div className="leistung-title">DSGVO & Compliance</div>
              <div className="leistung-body">
                Sensible Coaching-Gespräche dürfen nicht in unsichere Systeme fließen.
                Ich prüfe Datenverarbeitung, Serverstandorte, Verschlüsselung und
                Auftragsverarbeitungsverträge — bevor der Vertrag unterschrieben wird.
              </div>
            </div>
            <div className="leistung-card">
              <span className="leistung-icon">🚀</span>
              <div className="leistung-title">Pilotierung & Rollout</div>
              <div className="leistung-body">
                Kleine Piloten mit echten Nutzern — bevor das Budget freigegeben wird.
                Ich begleite Pilot-Setup, Evaluierung und die strukturierte Ausweitung
                auf die gesamte Organisation.
              </div>
            </div>
            <div className="leistung-card">
              <span className="leistung-icon">📊</span>
              <div className="leistung-title">ROI-Messung</div>
              <div className="leistung-body">
                Coaching-Investitionen müssen sich rechtfertigen lassen. Ich helfe Ihnen,
                aussagekräftige KPIs zu definieren, Coaching-Daten auszuwerten und den
                Mehrwert intern sichtbar zu machen.
              </div>
            </div>
            <div className="leistung-card">
              <span className="leistung-icon">🤝</span>
              <div className="leistung-title">Coach-Pool & Qualität</div>
              <div className="leistung-body">
                Welche Coaches passen zu welchen Tools und Zielgruppen? Ich unterstütze
                beim Aufbau oder der Qualifizierung interner und externer Coach-Pools —
                einschließlich KI-Kompetenz als Kriterium.
              </div>
            </div>
          </div>

          {/* Prozess */}
          <div className="br-section-label">Vorgehen</div>
          <h2 className="br-section-title">Vier Phasen zum<br /><em>laufenden System</em></h2>

          <div className="process-grid">
            <div className="process-step">
              <div className="step-number">01</div>
              <div className="step-title">Analyse</div>
              <div className="step-body">
                Ziele, Zielgruppen, Volumina, bestehende HR-Systeme und kulturelle
                Rahmenbedingungen werden erfasst. Ergebnis: ein klares Anforderungsprofil.
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">02</div>
              <div className="step-title">Marktcheck</div>
              <div className="step-body">
                Systematische Bewertung relevanter Tools aus einer Datenbank von
                249+ Lösungen — nach Funktion, Skalierbarkeit, Preis und DSGVO-Status.
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">03</div>
              <div className="step-title">Pilot</div>
              <div className="step-body">
                3–6 Wochen Praxistest mit ausgewählter Gruppe. Messung, Feedback,
                Optimierung. Erst dann folgt die Entscheidung über den Rollout.
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">04</div>
              <div className="step-title">Rollout</div>
              <div className="step-body">
                Skalierte Einführung mit begleitenden Trainings, Change-Kommunikation
                und definierten Erfolgskennzahlen für die Dauerbeobachtung.
              </div>
            </div>
          </div>

          {/* Relevante Plattformen */}
          <div className="br-section-label">Tool-Landschaft</div>
          <h2 className="br-section-title">Relevante Plattformen<br /><em>für Unternehmen</em></h2>
          <p className="br-section-body">
            Je nach Anforderung kommen grundlegend verschiedene Tool-Kategorien infrage.
            Hier ein Überblick über die relevantesten Lösungsfelder aus der analysierten
            Marktdatenbank:
          </p>

          <div className="cluster-grid">
            <div className="cluster-card">
              <div className="cluster-title">Skalierbare KI-Coaching-Plattformen</div>
              <div className="cluster-tools">
                <strong>Retorio, AIcoach.chat, Sherlock AI, BetterUp</strong> —
                KI-gestützte Coaching-Erfahrungen für große Mitarbeitergruppen,
                oft mit Rollenspiel-Simulationen und automatisiertem Feedback.
              </div>
            </div>
            <div className="cluster-card">
              <div className="cluster-title">Corporate Learning & L&D</div>
              <div className="cluster-tools">
                <strong>Sharpist, Optify, Torch, CoachHub, Excelia</strong> —
                Plattformen für strukturierte Führungskräfteentwicklung mit
                kombinierten Human-Coach- und KI-Angeboten.
              </div>
            </div>
            <div className="cluster-card">
              <div className="cluster-title">Analytics & ROI-Messung</div>
              <div className="cluster-tools">
                <strong>Hoolr, Cloverleaf, Flowit</strong> —
                Tools zur Auswertung von Coaching-Daten, Benchmarking und
                Nachweis messbarer Wirksamkeit gegenüber dem Management.
              </div>
            </div>
            <div className="cluster-card">
              <div className="cluster-title">Self-Coaching für alle Mitarbeiter</div>
              <div className="cluster-tools">
                <strong>Evoach, Bestselfy, Symbolon, Mindsera</strong> —
                Skalierbare Selbstcoaching-Angebote, die Coaching ohne
                menschlichen Coach zugänglich machen.
              </div>
            </div>
          </div>

          <div className="br-cta-block">
            <h3 className="br-cta-title">
              {beratung?.unternehmenCtaTitel ?? <>Bereit für den ersten Schritt<br /><em>in Ihrer Organisation?</em></>}
            </h3>
            <p className="br-cta-body">
              {beratung?.unternehmenCtaBody ?? "Ein unverbindliches Erstgespräch klärt, ob und wie KI-Coaching zu Ihrem Unternehmen passt. Ohne Tool-Bias, ohne Verkaufsdruck."}
            </p>
            <a href={`mailto:${beratung?.kontaktEmail ?? "bernd.wiese@googlemail.com"}`} className="br-cta-btn">
              {beratung?.unternehmenCtaButton ?? "Erstgespräch anfragen"}
            </a>
          </div>
        </div>

        {/* ══════════════ TAB: COACHES ══════════════ */}
        <div className={`tab-panel ${activeTab === "coaches" ? "active" : ""}`}>

          {/* Challenge */}
          <div className="challenge-box">
            <p>
              <strong>Die Ausgangssituation:</strong> KI verändert die Coaching-Praxis
              grundlegend — schneller als die meisten Coaches verarbeiten können. Welches
              Tool übernimmt administrative Aufgaben, welches unterstützt im Prozess,
              welches dokumentiert DSGVO-konform? Und wie bleibe ich als Coach authentisch,
              wenn KI zunehmend Aufgaben übernimmt, die bisher meine Stärke waren?
            </p>
          </div>

          {/* Facts */}
          <div className="facts-row">
            <div className="fact-item">
              <div className="fact-num">249+</div>
              <div className="fact-label">Tools im Markt —<br />analysiert</div>
            </div>
            <div className="fact-item">
              <div className="fact-num">7</div>
              <div className="fact-label">Funktionale<br />Tool-Kategorien</div>
            </div>
            <div className="fact-item">
              <div className="fact-num">ICF</div>
              <div className="fact-label">Kompatibel &<br />geprüft</div>
            </div>
            <div className="fact-item">
              <div className="fact-num">DSGVO</div>
              <div className="fact-label">Immer ein<br />Kriterium</div>
            </div>
          </div>

          {/* Leistungen */}
          <div className="br-section-label">Was ich biete</div>
          <h2 className="br-section-title">
            Orientierung im<br /><em>KI-Tool-Dschungel</em>
          </h2>
          <p className="br-section-body">
            Ich begleite Coaches dabei, KI-Tools sinnvoll, sicher und qualitätsbewusst
            in ihre Praxis zu integrieren — von der ersten Orientierung bis zur
            vollständigen Einbindung in den eigenen Prozess.
          </p>

          <div className="leistung-grid">
            <div className="leistung-card">
              <span className="leistung-icon">🗺</span>
              <div className="leistung-title">Tool-Orientierung</div>
              <div className="leistung-body">
                Welche Tools gibt es, und welche passen zu meiner Praxis? Ich liefere
                einen strukturierten Überblick nach Anwendungsfall — ohne Werbung,
                ohne Affiliate-Interessen.
              </div>
            </div>
            <div className="leistung-card">
              <span className="leistung-icon">🎯</span>
              <div className="leistung-title">Bedarfsklärung</div>
              <div className="leistung-body">
                Wo verlieren Sie heute Zeit? Wo würden Sie sich Unterstützung wünschen?
                Auf Basis Ihrer konkreten Situation erstelle ich eine personalisierte
                Tool-Shortlist.
              </div>
            </div>
            <div className="leistung-card">
              <span className="leistung-icon">🔬</span>
              <div className="leistung-title">Hands-on Testing</div>
              <div className="leistung-body">
                Ich teste Tools mit Ihnen gemeinsam — live, an realen Anwendungsfällen.
                Kein Lesen von Testberichten, sondern direktes Ausprobieren in
                der eigenen Praxissituation.
              </div>
            </div>
            <div className="leistung-card">
              <span className="leistung-icon">⚖️</span>
              <div className="leistung-title">DSGVO & ICF-Check</div>
              <div className="leistung-body">
                KI-Transkription, Cloud-Speicherung, KI-Analyse von Sitzungsinhalten —
                ich prüfe, was ethisch und rechtlich vertretbar ist, und was
                Ihre Zertifizierung gefährden könnte.
              </div>
            </div>
            <div className="leistung-card">
              <span className="leistung-icon">🔧</span>
              <div className="leistung-title">Implementierung</div>
              <div className="leistung-body">
                Einrichtung, Konfiguration, Workflows — ich begleite die technische
                Integration in Ihre bestehende Praxis, bis alles reibungslos läuft.
              </div>
            </div>
            <div className="leistung-card">
              <span className="leistung-icon">🌱</span>
              <div className="leistung-title">Kontinuierliche Begleitung</div>
              <div className="leistung-body">
                Der Markt entwickelt sich schnell. Auf Wunsch bleibe ich als
                laufender Sparringspartner, der neue Tools beobachtet und bewertet,
                bevor Sie Zeit damit verlieren.
              </div>
            </div>
          </div>

          {/* Tool-Kategorien */}
          <div className="br-section-label">Die Tool-Landschaft für Coaches</div>
          <h2 className="br-section-title">Was es gibt —<br /><em>und wofür es taugt</em></h2>
          <p className="br-section-body">
            Der Markt lässt sich in sieben funktionale Kategorien einteilen.
            Jede hat unterschiedliche Reifegrade, Preismodelle und ethische Implikationen:
          </p>

          <div className="cluster-grid">
            <div className="cluster-card">
              <div className="cluster-title">Praxis-Management</div>
              <div className="cluster-tools">
                <strong>CoachAccountable, Simply.Coach, CoachVantage, Delenta, Paperbell</strong> —
                Terminplanung, Klientenmanagement, Aufgaben und Abrechnungen in einem System.
                Die Basis für eine effiziente Praxis.
              </div>
            </div>
            <div className="cluster-card">
              <div className="cluster-title">Gesprächsanalyse & Transkription</div>
              <div className="cluster-tools">
                <strong>Gerty.health, Fireflies.ai, Fathom</strong> —
                Automatische Mitschriften, ICF-orientiertes Feedback auf Ihre
                Gesprächsführung, strukturierte Sitzungszusammenfassungen.
              </div>
            </div>
            <div className="cluster-card">
              <div className="cluster-title">Online-Coaching-Umgebung</div>
              <div className="cluster-tools">
                <strong>CoachingSpace, LINC Coaching Board, CAI World</strong> —
                Digitale Whiteboards, DSGVO-konforme Videokonferenz und interaktive
                Methoden für Online-Sitzungen in einer Umgebung.
              </div>
            </div>
            <div className="cluster-card">
              <div className="cluster-title">KI als Co-Coach</div>
              <div className="cluster-tools">
                <strong>Evoach, CoachBot, BeCoach</strong> —
                KI übernimmt strukturierte Coaching-Sequenzen zwischen den Sitzungen.
                Klienten reflektieren eigenständig, Sie sehen die Ergebnisse.
              </div>
            </div>
            <div className="cluster-card">
              <div className="cluster-title">KI-Avatar des Coaches</div>
              <div className="cluster-tools">
                <strong>CoachVox, CoachClone</strong> —
                Eine KI-Version von Ihnen selbst, trainiert auf Ihre Methode und Sprache.
                Für Lead-Generierung, Community und skalierbare Erstbegleitung.
              </div>
            </div>
            <div className="cluster-card">
              <div className="cluster-title">Assessment & Diagnostik</div>
              <div className="cluster-tools">
                <strong>Coachmetrix, Flowit, Hedy AI</strong> —
                360°-Feedback, Zielmessung und Fortschrittstracking für
                strukturierte Coaching-Prozesse mit nachweisbarer Wirksamkeit.
              </div>
            </div>
          </div>

          {/* Prozess */}
          <div className="br-section-label">Vorgehen</div>
          <h2 className="br-section-title">Von der Verwirrung zur<br /><em>klaren Entscheidung</em></h2>

          <div className="process-grid">
            <div className="process-step">
              <div className="step-number">01</div>
              <div className="step-title">Situationscheck</div>
              <div className="step-body">
                Wo stehen Sie heute? Was kostet Ihnen aktuell die meiste Zeit?
                Wo wünschen Sie sich Entlastung oder Qualitätsgewinn?
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">02</div>
              <div className="step-title">Tool-Shortlist</div>
              <div className="step-body">
                Auf Basis Ihrer Situation wähle ich 3–5 konkrete Tools aus,
                die für Ihren Anwendungsfall wirklich relevant sind.
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">03</div>
              <div className="step-title">Live-Test</div>
              <div className="step-body">
                Gemeinsames Ausprobieren, Bewertung nach Praxis-tauglichkeit,
                Datenschutz, Kosten und Einlernaufwand.
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">04</div>
              <div className="step-title">Integration</div>
              <div className="step-body">
                Das ausgewählte Tool wird vollständig in Ihren Praxis-Workflow
                eingebettet — mit klaren Prozessen und Grenzen für die KI-Nutzung.
              </div>
            </div>
          </div>

          <div className="br-cta-block">
            <h3 className="br-cta-title">
              {beratung?.coachesCtaTitel ?? <>Starten Sie mit einem<br /><em>Orientierungsgespräch</em></>}
            </h3>
            <p className="br-cta-body">
              {beratung?.coachesCtaBody ?? "60 Minuten, in denen wir Ihre aktuelle Praxis anschauen und klären, welche KI-Tools für Sie wirklich sinnvoll sind — und welche nicht."}
            </p>
            <a href={`mailto:${beratung?.kontaktEmail ?? "bernd.wiese@googlemail.com"}`} className="br-cta-btn">
              {beratung?.coachesCtaButton ?? "Orientierungsgespräch buchen"}
            </a>
          </div>
        </div>

        {/* FOOTER */}
        <footer style={{
          borderTop: "1px solid var(--border2)",
          padding: "2rem",
          textAlign: "center",
          color: "var(--muted)",
          fontSize: "0.78rem",
          letterSpacing: "0.06em"
        }}>
          © 2025 KI·Coaching·Kompass · Bernd Wiese ·{" "}
          <Link href="/" style={{ color: "var(--gold)", textDecoration: "none" }}>
            Startseite
          </Link>
        </footer>
      </div>
    </>
  );
}
