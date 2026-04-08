"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Workshop } from "@/sanity/lib/queries";

type Theme = "light" | "dark";

type WorkshopClientProps = {
  workshop?: Workshop | null;
};

export default function WorkshopClient({ workshop }: WorkshopClientProps) {
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

  const fallbackNav = [
    { label: "Beratung", url: "/ki-coaching/beratung" },
    { label: "Workshop", url: "/ki-coaching/workshop" },
    { label: "Zuhören ↗", url: "https://isha.de", isExternal: true },
    { label: "Kompass", url: "/ki-coaching/kompass" },
    { label: "Kontakt", url: "#" }
  ];

  const currentNav = workshop?.navLinks?.length ? workshop.navLinks : fallbackNav;

  const fallbackFragen = [
    { icon: "🧭", text: "Sollen wir KI-Coaching in unserem Unternehmen einführen &mdash; <strong>und wenn ja, wie?</strong>" },
    { icon: "🔍", text: "Was unterscheidet einen <strong>seriösen KI-Coaching-Anbieter</strong> von einem schlechten?" },
    { icon: "🤝", text: "Wie überzeugen wir den Betriebsrat &mdash; und <strong>was muss rechtlich geregelt sein?</strong>" },
    { icon: "🤖", text: "Was kann KI wirklich leisten &mdash; und <strong>was bleibt dem menschlichen Coach vorbehalten?</strong>" },
    { icon: "🚀", text: "Wie starte ich mit einem Pilot, <strong>ohne große Risiken einzugehen?</strong>" },
  ];

  const fallbackMitnahmen = [
    { nummer: "01", text: "<strong>Eine klare Entscheidungsgrundlage</strong> &mdash; ob und wie KI-Coaching zu Ihrem Unternehmen passt" },
    { nummer: "02", text: "<strong>Einen ersten konkreten Pilotplan</strong> &mdash; mit Ziel, Zielgruppe, Tool und Messung" },
    { nummer: "03", text: "<strong>Orientierung im Tool-Markt</strong> &mdash; welche Kriterien wirklich zählen" },
    { nummer: "04", text: "<strong>Antworten auf die Datenschutz- und Betriebsratsfragen</strong>" },
    { nummer: "05", text: "<strong>Ein Netzwerk</strong> &mdash; Menschen aus anderen Unternehmen, die vor denselben Fragen stehen" },
  ];

  const fallbackAgenda1 = [
    { zeit: "13:00", thema: "Ankommen &mdash; wer ist im Raum, was bringen wir mit?", format: "Gesprächsrunde" },
    { zeit: "13:45", thema: "Was ist Coaching wirklich? &mdash; und warum erreicht es so wenige", format: "Impuls + Übung" },
    { zeit: "14:45", thema: "Pause", format: "15 Min." },
    { zeit: "15:00", thema: "Was kann KI &mdash; was kann sie nicht? Forschung und Realität", format: "Impuls + Demo" },
    { zeit: "16:00", thema: "Das Staffelstab-Modell &mdash; Mensch und KI als Team", format: "Gruppenarbeit" },
    { zeit: "16:45", thema: "Reflexion &mdash; was nehme ich mit in die Nacht?", format: "Stille Runde" },
  ];

  const fallbackAgenda2 = [
    { zeit: "13:00", thema: "Rückblick &mdash; was ist über Nacht aufgetaucht?", format: "Kurzrunde" },
    { zeit: "13:15", thema: "Einführung planen &mdash; Ziel, Zielgruppe, erster Schritt", format: "Canvas-Arbeit" },
    { zeit: "14:15", thema: "Toolauswahl &mdash; welche Kriterien zählen wirklich?", format: "Marktüberblick" },
    { zeit: "15:00", thema: "Pause", format: "15 Min." },
    { zeit: "15:15", thema: "Datenschutz, Vertrauen, Unternehmenskultur", format: "Diskussion" },
    { zeit: "16:00", thema: "Was kann ich messen &mdash; und was nicht?", format: "Impuls" },
    { zeit: "16:30", thema: "Nächste Schritte &mdash; was tue ich in zwei Wochen?", format: "Abschlussrunde" },
  ];

  const fallbackEnthalten = [
    { titel: "Persönliches Vorgespräch (15 Min. via Zoom)", text: "Vor dem Workshop &mdash; Ihre Fragen, Ihre Situation" },
    { titel: "Vorbereitungsmaterialien", text: "Sofort nach Anmeldung: Entscheidungs-Leitfaden, Vergleichsdokument Mensch vs. KI" },
    { titel: "Nachmittag 1 &mdash; Verstehen", text: "4 Stunden: Was ist Coaching? Was kann KI? Das Staffelstab-Modell" },
    { titel: "Nachmittag 2 &mdash; Gestalten", text: "4 Stunden: Pilotplanung, Toolauswahl, Datenschutz, Messung" },
    { titel: "Alle Arbeitsmaterialien (5 Dokumente)", text: "Pilot-Canvas, Toolbewertungs-Checkliste, Toolübersicht u.a." },
    { titel: "Persönliches Nachgespräch (15 Min. via Zoom)", text: "Nach dem Workshop &mdash; nächste Schritte, offene Fragen, Einstieg in Zusammenarbeit" },
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
          min-height: max(75vh, 600px);
          display: grid;
          grid-template-columns: 1fr 260px;
          align-items: stretch;
          padding: 0; text-align: center;
          position: relative; overflow: hidden;
          transition: background 0.35s;
        }
        .hero-content {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 7rem 2rem 5rem;
          position: relative; z-index: 2;
        }
        .hero-portrait {
          position: relative;
          width: 100%; height: auto;
          min-height: 60vh; max-height: 80vh;
          display: flex; align-items: center; align-self: flex-start;
          margin-top: 6rem;
          overflow: hidden; pointer-events: none;
        }
        .hero-portrait img {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
          mask-image: linear-gradient(to right, transparent 0%, black 20%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 20%);
        }
        @media (max-width: 1050px) { .ws-hero { grid-template-columns: 1fr 200px; } }
        @media (max-width: 900px) { .ws-hero { grid-template-columns: 1fr; } .hero-portrait { display: none; } }

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
        .ws-hero-facts {
          display: flex; flex-wrap: wrap; gap: 0.75rem;
          justify-content: center; margin-bottom: 3rem;
        }
        .fact-pill {
          font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase;
          padding: 0.4rem 1rem; border: 1px solid var(--border);
          color: var(--muted); border-radius: 4px; background: var(--surface);
        }
        .fact-pill.highlight {
          border-color: var(--gold); color: var(--gold);
          background: transparent;
        }
        .ws-hero-cta { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
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

        /* ── FRAGEN-GRID (für wen?) ── */
        .fragen-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1px; background: var(--border); margin-top: 3rem;
        }
        .frage-card {
          background: var(--surface); padding: 2rem 1.8rem;
          transition: background 0.2s;
        }
        .frage-card:hover { background: var(--bg2); }
        .frage-icon {
          font-size: 1.4rem; margin-bottom: 1rem; display: block;
        }
        .frage-text {
          font-size: 0.95rem; color: var(--text2); line-height: 1.7;
        }
        .frage-text strong { color: var(--text); font-weight: 500; }

        /* ── MITNAHMEN ── */
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
        .mitnahme-text strong { color: var(--text); font-weight: 500; }

        /* ── WAS PASSIERT ── */
        .ws-approach {
          padding: 6rem 2rem; background: var(--bg); transition: background 0.35s;
        }
        .approach-inner {
          max-width: 1100px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: start;
        }
        .approach-body { font-size: 0.97rem; color: var(--text2); line-height: 1.85; }
        .approach-body p + p { margin-top: 1rem; }

        .agenda-block { margin-top: 2rem; }
        .agenda-day {
          font-size: 0.68rem; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 0.75rem; font-weight: 500;
        }
        .agenda-table { width: 100%; border-collapse: collapse; }
        .agenda-table tr { border-bottom: 1px solid var(--border2); }
        .agenda-table td {
          padding: 0.6rem 0; font-size: 0.84rem; color: var(--text2);
          vertical-align: top;
        }
        .agenda-table td:first-child {
          width: 80px; color: var(--muted); font-size: 0.78rem; white-space: nowrap;
        }
        .agenda-table td:last-child { color: var(--muted); font-size: 0.75rem; padding-left: 1rem; }

        /* ── ENTHALTEN ── */
        .ws-enthalten {
          background: var(--bg2); padding: 6rem 2rem; transition: background 0.35s;
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

        /* ── FORSCHUNG ── */
        .ws-forschung {
          padding: 6rem 2rem; background: var(--bg); transition: background 0.35s;
        }
        .forschung-inner {
          max-width: 800px; margin: 0 auto; text-align: center;
        }
        .forschung-stat {
          display: flex; gap: 3rem; justify-content: center;
          flex-wrap: wrap; margin: 3rem 0;
        }
        .stat-block { text-align: center; }
        .stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3.5rem; font-weight: 300; color: var(--gold2); line-height: 1;
        }
        .stat-label { font-size: 0.78rem; color: var(--muted); margin-top: 0.4rem; max-width: 160px; line-height: 1.5; }
        .forschung-body { font-size: 0.97rem; color: var(--text2); line-height: 1.85; max-width: 640px; margin: 0 auto; }
        .forschung-body p + p { margin-top: 1rem; }
        .forschung-quelle {
          margin-top: 1.5rem; font-size: 0.72rem; color: var(--muted);
          letter-spacing: 0.04em; font-style: italic;
        }

        /* ── ÜBER BERND ── */
        .ws-ueber {
          background: var(--bg2); padding: 6rem 2rem; transition: background 0.35s;
        }
        .ueber-inner {
          max-width: 1100px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 2fr; gap: 5rem; align-items: start;
        }
        .ueber-label {
          font-size: 0.68rem; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 0.5rem;
        }
        .ueber-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem; font-weight: 300; color: var(--text); line-height: 1.2;
          margin-bottom: 1rem;
        }
        .ueber-role {
          font-size: 0.82rem; color: var(--muted); letter-spacing: 0.06em;
          text-transform: uppercase; line-height: 1.8;
        }
        .ueber-body { font-size: 0.97rem; color: var(--text2); line-height: 1.85; }
        .ueber-body p + p { margin-top: 1rem; }
        .ueber-hinweis {
          margin-top: 1.5rem; padding: 1rem 1.4rem;
          border-left: 3px solid var(--border); border-radius: 0 4px 4px 0;
          font-size: 0.82rem; color: var(--muted); line-height: 1.7;
          background: var(--bg3); transition: background 0.35s;
        }

        /* ── CTA ── */
        .ws-cta {
          padding: 7rem 2rem; background: var(--bg); transition: background 0.35s;
          text-align: center;
        }
        .cta-inner { max-width: 700px; margin: 0 auto; }
        .cta-preis {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3.5rem; font-weight: 300; color: var(--gold2); line-height: 1;
          margin: 1.5rem 0 0.5rem;
        }
        .cta-preis-label { font-size: 0.82rem; color: var(--muted); margin-bottom: 1rem; }
        .cta-termin {
          display: inline-block; font-size: 0.72rem; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--muted); padding: 0.4rem 1rem;
          border: 1px solid var(--border); border-radius: 4px; margin-bottom: 2.5rem;
        }
        .cta-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .cta-note {
          margin-top: 1.5rem; font-size: 0.78rem; color: var(--muted); line-height: 1.7;
        }

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
          .approach-inner { grid-template-columns: 1fr; gap: 3rem; }
          .ueber-inner { grid-template-columns: 1fr; gap: 2.5rem; }
          .enthalten-grid { grid-template-columns: 1fr; }
          .fragen-grid { grid-template-columns: 1fr; }
          .ws-hero { padding: 7rem 1.2rem 4rem; }
          .ws-hero-facts { gap: 0.5rem; }
          .ws-section, .ws-mitnahmen, .ws-approach,
          .ws-enthalten, .ws-forschung, .ws-ueber, .ws-cta { padding: 4rem 1.2rem; }
          .forschung-stat { gap: 2rem; }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className={`ws-root ${theme}`}>

        {/* NAV */}
        <nav className="ws-nav">
          <Link href="/" className="nav-logo">KI-Coaching<span> Kompass</span></Link>
          <ul className="nav-center">
            {currentNav.map((link, i) => (
              <li key={i}>
                {link.isExternal ? (
                  <a href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>
                ) : (
                  <Link href={link.url} className={link.url === "/workshop" ? "active" : ""}>{link.label}</Link>
                )}
              </li>
            ))}
          </ul>
          <div className="nav-right">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Theme wechseln" />
            <a href={`mailto:${workshop?.ctaEmail ?? "kontakt@ki-coaching-kompass.de"}`} className="nav-cta">
              {workshop?.navCta ?? "Anmelden"}
            </a>
            <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menü öffnen">
              <span /><span /><span />
            </button>
          </div>
          <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
            <Link href="/" onClick={() => setMenuOpen(false)}>Start</Link>
            <Link href="/ki-coaching" onClick={() => setMenuOpen(false)}>KI-Coaching</Link>
            <Link href="/ki-coaching/beratung" className="sub-item" onClick={() => setMenuOpen(false)}>Beratung</Link>
            <Link href="/ki-coaching/workshop" className="active sub-item" onClick={() => setMenuOpen(false)}>Workshop</Link>
            <Link href="/ki-coaching/kompass" className="sub-item" onClick={() => setMenuOpen(false)}>Kompass</Link>
            <Link href="/zuhoeren" onClick={() => setMenuOpen(false)}>Gehört werden</Link>
            <Link href="/ueber-mich" onClick={() => setMenuOpen(false)}>Über mich</Link>
          </div>
        </nav>

        {/* HERO */}
        <section className="ws-hero">
          <div className="hero-content">
            <div className="ws-hero-orb" />
            <div className="eyebrow">{workshop?.heroEyebrow ?? "Zweitägiger Online-Workshop"}</div>
            <h1 className="ws-hero-title" dangerouslySetInnerHTML={{ __html: workshop?.heroTitel ?? "KI-Coaching im<br /><em>Unternehmen</em>" }} />
            <p className="ws-hero-sub">{workshop?.heroUntertitel ?? "verstehen \u2014 bewerten \u2014 einführen"}</p>
            <div className="ws-hero-facts">
              <span className="fact-pill">{workshop?.heroPill1 ?? "2 Nachmittage à 4 Stunden"}</span>
              <span className="fact-pill">{workshop?.heroPill2 ?? "Online via Zoom"}</span>
              <span className="fact-pill">{workshop?.heroPill3 ?? "Max. 12 Teilnehmer"}</span>
              <span className="fact-pill highlight">{workshop?.heroPill4 ?? "399 EUR pro Person"}</span>
            </div>
            <div className="ws-hero-cta">
              <a href={`mailto:${workshop?.ctaEmail ?? "kontakt@ki-coaching-kompass.de"}`} className="btn-primary">{workshop?.heroCtaPrimary ?? "Jetzt anmelden"}</a>
              <a href="#was-passiert" className="btn-outline">{workshop?.heroCtaSecondary ?? "Mehr erfahren"}</a>
            </div>
          </div>
          <div className="hero-portrait" style={{ pointerEvents: "auto" }}>
            <img src="/bernd-wiese.jpg" alt="Bernd Wiese" />
            <Link href="/ueber-mich" style={{
              position: "absolute",
              bottom: "1.5rem",
              right: "1rem",
              fontSize: "0.68rem",
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

        {/* FÜR WEN? */}
        <section style={{ padding: "6rem 2rem", background: "var(--bg)", transition: "background 0.35s" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <p className="sec-eyebrow">{workshop?.zielgruppeEyebrow ?? "Zielgruppe"}</p>
            <h2 className="sec-title" dangerouslySetInnerHTML={{ __html: workshop?.zielgruppeTitel ?? "Ist dieser Workshop <em>für Sie?</em>" }} />
            <p className="sec-lead">{workshop?.zielgruppeLead ?? "Dieser Workshop ist für Sie, wenn Sie sich fragen:"}</p>
            <div className="fragen-grid">
              {(workshop?.zielgruppeKarten?.length ? workshop.zielgruppeKarten : fallbackFragen).map((frage, i) => (
                <div className="frage-card" key={i}>
                  <span className="frage-icon">{frage.icon}</span>
                  <p className="frage-text" dangerouslySetInnerHTML={{ __html: frage.text }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WAS SIE MITNEHMEN */}
        <section className="ws-mitnahmen">
          <div className="mitnahmen-inner">
            <p className="sec-eyebrow">{workshop?.mitnahmenEyebrow ?? "Ihr Ergebnis"}</p>
            <h2 className="sec-title" dangerouslySetInnerHTML={{ __html: workshop?.mitnahmenTitel ?? "Was Sie <em>mitnehmen</em>" }} />
            <p className="sec-lead">{workshop?.mitnahmenLead ?? "Nach zwei Nachmittagen haben Sie:"}</p>
            <div className="mitnahmen-grid">
              {(workshop?.mitnahmenKarten?.length ? workshop.mitnahmenKarten : fallbackMitnahmen).map((mitnahme, i) => (
                <div className="mitnahme-card" key={i}>
                  <div className="mitnahme-num">{mitnahme.nummer}</div>
                  <p className="mitnahme-text" dangerouslySetInnerHTML={{ __html: mitnahme.text }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WAS PASSIERT */}
        <section id="was-passiert" className="ws-approach">
          <div className="approach-inner">
            <div>
              <p className="sec-eyebrow">{workshop?.didaktikEyebrow ?? "Didaktik"}</p>
              <h2 className="sec-title" dangerouslySetInnerHTML={{ __html: workshop?.didaktikTitel ?? "Kein Folienvortrag.<br />Kein Hype.<br /><em>Kein Verkaufsgespräch.</em>" }} />
              <div className="approach-body">
                <p dangerouslySetInnerHTML={{ __html: workshop?.didaktikText1 ?? "Dieser Workshop pendelt bewusst zwischen tiefen Fragen &mdash; <em>Was ist Coaching wirklich? Was kann KI, was kann sie nicht?</em> &mdash; und konkreter Praxis: Wie plane ich eine Einführung? Wie wähle ich das richtige Tool?" }} />
                <p dangerouslySetInnerHTML={{ __html: workshop?.didaktikText2 ?? "Sie arbeiten mit echten Werkzeugen: einer Pilot-Canvas, einer Toolbewertungs-Checkliste, einem Entscheidungsleitfaden. Und Sie diskutieren mit anderen, die vor denselben Fragen stehen." }} />
              </div>
            </div>
            <div>
              <div className="agenda-block">
                <p className="agenda-day">{workshop?.agendaTag1Titel ?? "Nachmittag 1 &mdash; Verstehen"}</p>
                <table className="agenda-table">
                  <tbody>
                    {(workshop?.agendaTag1?.length ? workshop.agendaTag1 : fallbackAgenda1).map((item, i) => (
                      <tr key={i}>
                        <td>{item.zeit}</td>
                        <td dangerouslySetInnerHTML={{ __html: item.thema }} />
                        <td>{item.format}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="agenda-block" style={{ marginTop: "2rem" }}>
                <p className="agenda-day">{workshop?.agendaTag2Titel ?? "Nachmittag 2 &mdash; Gestalten"}</p>
                <table className="agenda-table">
                  <tbody>
                    {(workshop?.agendaTag2?.length ? workshop.agendaTag2 : fallbackAgenda2).map((item, i) => (
                      <tr key={i}>
                        <td>{item.zeit}</td>
                        <td dangerouslySetInnerHTML={{ __html: item.thema }} />
                        <td>{item.format}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* WAS ENTHALTEN */}
        <section className="ws-enthalten">
          <div className="enthalten-inner">
            <p className="sec-eyebrow">{workshop?.enthaltenEyebrow ?? "Leistungsumfang"}</p>
            <h2 className="sec-title" dangerouslySetInnerHTML={{ __html: workshop?.enthaltenTitel ?? "Was im Preis <em>enthalten ist</em>" }} />
            <div className="enthalten-grid">
              {(workshop?.enthaltenListe?.length ? workshop.enthaltenListe : fallbackEnthalten).map((item, i) => (
                <div className="enthalten-item" key={i}>
                  <div className="enthalten-check">✓</div>
                  <p className="enthalten-text">
                    <strong dangerouslySetInnerHTML={{ __html: item.titel }} />
                    <span dangerouslySetInnerHTML={{ __html: item.text }} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FORSCHUNG */}
        <section className="ws-forschung">
          <div className="forschung-inner">
            <p className="sec-eyebrow">{workshop?.forschungEyebrow ?? "Wissenschaftlicher Hintergrund"}</p>
            <h2 className="sec-title" dangerouslySetInnerHTML={{ __html: workshop?.forschungTitel ?? "Was die <em>Forschung sagt</em>" }} />
            <div className="forschung-stat">
              {(workshop?.forschungStats?.length ? workshop.forschungStats : [
                { nummer: "&gt;80%", label: "Abbruchrate bei KI-Coaching ohne menschliche Begleitung" },
                { nummer: "5–15%", label: "der Belegschaft erreicht klassisches Coaching im Schnitt" }
              ]).map((stat, i) => (
                <div className="stat-block" key={i}>
                  <div className="stat-num" dangerouslySetInnerHTML={{ __html: stat.nummer }} />
                  <p className="stat-label">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="forschung-body">
              {workshop?.forschungText1 && <p dangerouslySetInnerHTML={{ __html: workshop.forschungText1 }} />}
              {!workshop?.forschungText1 && <p>Die Studienlage zu KI-Coaching ist klar: KI allein &mdash; ohne menschliche Begleitung &mdash; erzeugt in kontrollierten Studien keine messbaren Entwicklungseffekte.</p>}
              
              {workshop?.forschungText2 && <p dangerouslySetInnerHTML={{ __html: workshop.forschungText2 }} />}
              {!workshop?.forschungText2 && <p>Gleichzeitig hat KI echte Stärken: Verfügbarkeit rund um die Uhr, Skalierung auf die gesamte Belegschaft, niedrige Hemmschwelle. Richtig eingesetzt kann sie Coaching für deutlich mehr Mitarbeitende zugänglich machen &mdash; ohne die Qualität menschlicher Begleitung zu opfern.</p>}
              
              {workshop?.forschungText3 && <p dangerouslySetInnerHTML={{ __html: workshop.forschungText3 }} />}
              {!workshop?.forschungText3 && <p>Der Schlüssel liegt nicht in der Entscheidung für oder gegen KI &mdash; sondern in der klugen Verbindung beider. Genau das ist das Thema dieses Workshops.</p>}
            </div>
            <p className="forschung-quelle">{workshop?.forschungQuelle ?? "Quelle: De Haan, Terblanche & Nowack (2026), RCT mit 114 Führungskräften"}</p>
          </div>
        </section>

        {/* ÜBER BERND */}
        <section className="ws-ueber">
          <div className="ueber-inner">
            <div>
              <p className="ueber-label">{workshop?.ueberEyebrow ?? "Workshopleitung"}</p>
              <h2 className="ueber-name">{workshop?.ueberName ?? "Bernd Wiese"}</h2>
              <p className="ueber-role" dangerouslySetInnerHTML={{ __html: workshop?.ueberRole ?? "Zuhörcoach nach Nancy Kline<br />Betreiber ki-coaching-kompass.de<br />Freiburg" }} />
            </div>
            <div>
              <div className="ueber-body">
                {workshop?.ueberText1 && <p dangerouslySetInnerHTML={{ __html: workshop.ueberText1 }} />}
                {!workshop?.ueberText1 && <p>Bernd Wiese betreibt ki-coaching-kompass.de &mdash; eine unabhängige deutschsprachige Plattform, die KI-Coaching-Tools, Studien und Artikel für den deutschsprachigen Raum kuratiert.</p>}
                
                {workshop?.ueberText2 && <p dangerouslySetInnerHTML={{ __html: workshop.ueberText2 }} />}
                {!workshop?.ueberText2 && <p>Als Zuhörcoach nach Nancy Kline und ehemaliger CRM-Vertriebsberater bringt er zwei Perspektiven zusammen: tiefes Verständnis von Coaching und 30 Jahre Erfahrung darin, wie Unternehmen Technologie wirklich einführen &mdash; und was dabei scheitert.</p>}
              </div>
              <div className="ueber-hinweis">
                <strong style={{ display: "block", marginBottom: "0.3rem", color: "var(--text2)" }}>
                  {workshop?.ueberHinweisTitel ?? "Transparenzhinweis"}
                </strong>
                <span dangerouslySetInnerHTML={{ __html: workshop?.ueberHinweisText ?? "Bernd Wiese ist Partneranbieter ausgewählter KI-Coaching-Tools und erhält bei Einführungen eine Provision vom Anbieter. Dies wird offen kommuniziert &mdash; und bedeutet: Empfohlen werden nur Tools, die persönlich geprüft und eingesetzt wurden." }} />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="ws-cta">
          <div className="cta-inner">
            <p className="sec-eyebrow">{workshop?.ctaEyebrow ?? "Anmeldung"}</p>
            <h2 className="sec-title" dangerouslySetInnerHTML={{ __html: workshop?.ctaTitel ?? "Nächster <em>Termin</em>" }} />
            <div className="cta-preis">{workshop?.ctaPreis ?? "399 EUR"}</div>
            <p className="cta-preis-label">{workshop?.ctaPreisLabel ?? "pro Person · inkl. aller Materialien und Gespräche"}</p>
            <div className="cta-termin">{workshop?.ctaTermin ?? "Nächster Termin: wird bekannt gegeben"}</div>
            <div className="cta-buttons">
              <a href={`mailto:${workshop?.ctaEmail ?? "kontakt@ki-coaching-kompass.de"}`} className="btn-primary">{workshop?.ctaButton ?? "Jetzt anmelden"}</a>
              <a href={`mailto:${workshop?.ctaEmail ?? "kontakt@ki-coaching-kompass.de"}`} className="btn-outline">{workshop?.ctaButtonSecondary ?? "Fragen vorab schreiben"}</a>
            </div>
            <p className="cta-note">
              {workshop?.ctaBody ?? "Mit Anmeldung erhalten Sie sofort Zugang zu Ihren Vorbereitungsmaterialien und einen Buchungslink für Ihr persönliches Vorgespräch."}
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="ws-footer">
          <p className="footer-copy">{workshop?.footerCopyright ?? "© 2025 KI-Coaching Kompass · Bernd Wiese · Staufen"}</p>
          <div className="footer-links">
            {(workshop?.footerLinks?.length ? workshop.footerLinks : [
              { label: "Start", url: "/" },
              { label: "Beratung", url: "/ki-coaching/beratung" },
              { label: "Kompass", url: "/ki-coaching/kompass" },
              { label: "Gehört werden", url: "/zuhoeren" },
              { label: "Über mich", url: "/ueber-mich" },
              { label: "Impressum", url: "/impressum" },
              { label: "Datenschutz", url: "/datenschutz" },
            ]).map((link, i) => (
              <Link key={i} href={link.url}>{link.label}</Link>
            ))}
          </div>
        </footer>

      </div>
    </>
  );
}
