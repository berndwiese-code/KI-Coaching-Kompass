"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

type Theme = "light" | "dark";
type Entitaet = "tools" | "studien" | "artikel" | "ausbildung";
type SubTab = "kacheln" | "detail" | "liste";

interface Tool {
  id: string;
  url_sauber: string;
  seitentitel: string;
  zusammenfassung_kurz: string;
  zusammenfassung: string;
  zielgruppe: string;
  schwerpunkt: string;
  produktkategorie: string;
  kostenmodell: string;
  firmensitz: string;
  sprache_website: string;
  dsgvo_jn: boolean;
  relevanz_bewertung: number | null;
  technologie_fokus: string;
  ap1_name: string;
  ap1_rolle: string;
  ap1_email: string;
}

interface GenericEntry {
  id: string;
  url_sauber: string;
  seitentitel: string;
  zusammenfassung: string;
  zielgruppe: string;
  relevanz_bewertung: number | null;
  status: string;
  kostenmodell?: string;
  schwerpunkt?: string;
}

type AnyEntry = Tool | GenericEntry;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const CONFIG: Record<Entitaet, { felder: string; order: string }> = {
  tools: {
    felder: "id,url_sauber,seitentitel,zusammenfassung_kurz,zusammenfassung,zielgruppe,schwerpunkt,produktkategorie,kostenmodell,firmensitz,sprache_website,dsgvo_jn,relevanz_bewertung,technologie_fokus,ap1_name,ap1_rolle,ap1_email",
    order: "relevanz_bewertung.desc.nullslast,url_sauber.asc",
  },
  studien: {
    felder: "id,url_sauber,seitentitel,zusammenfassung,zielgruppe,relevanz_bewertung,status",
    order: "relevanz_bewertung.desc.nullslast,url_sauber.asc",
  },
  artikel: {
    felder: "id,url_sauber,seitentitel,zusammenfassung,zielgruppe,relevanz_bewertung,status",
    order: "relevanz_bewertung.desc.nullslast,url_sauber.asc",
  },
  ausbildung: {
    felder: "id,url_sauber,seitentitel,zusammenfassung,kostenmodell,relevanz_bewertung,status",
    order: "relevanz_bewertung.desc.nullslast,url_sauber.asc",
  },
};

const LABELS: Record<Entitaet, string> = {
  tools: "Tools",
  studien: "Studien",
  artikel: "Artikel",
  ausbildung: "Ausbildungen",
};

const ICONS: Record<Entitaet, string> = {
  tools: "🔧",
  studien: "🔬",
  artikel: "📄",
  ausbildung: "🎓",
};

const CLUSTER_SCHWERPUNKT: Record<string, string> = {
  coaching: "Coaching",
  mental_health: "Mental Health",
  organisation: "Leadership",
  wissen: "Lernen",
  markt: "Sales Coaching",
};

export default function KompassClient() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOffen, setSidebarOffen] = useState(false);

  // Data
  const cacheRef = useRef<Partial<Record<Entitaet, AnyEntry[]>>>({});
  const [counts, setCounts] = useState<Partial<Record<Entitaet, number>>>({});
  const [aktEntitaet, setAktEntitaet] = useState<Entitaet>("tools");
  const [aktSubTab, setAktSubTab] = useState<SubTab>("kacheln");
  const [gefiltert, setGefiltert] = useState<AnyEntry[]>([]);
  const [ausgewaehlt, setAusgewaehlt] = useState<AnyEntry | null>(null);
  const [loading, setLoading] = useState(false);

  // Filter state
  const [suche, setSuche] = useState("");
  const [filterKat, setFilterKat] = useState("");
  const [filterZg, setFilterZg] = useState("");
  const [filterSchw, setFilterSchw] = useState("");
  const [filterSpr, setFilterSpr] = useState("");
  const [filterKos, setFilterKos] = useState("");
  const [filterDsgvo, setFilterDsgvo] = useState("");

  // Dynamic options
  const [kategorieOptionen, setKategorieOptionen] = useState<string[]>([]);
  const [schwerpunktOptionen, setSchwerpunktOptionen] = useState<string[]>([]);
  const [kostenOptionen, setKostenOptionen] = useState<string[]>([]);

  // Modal
  const [modalOffen, setModalOffen] = useState(false);

  // Theme init
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

  // Sofortige Counts für alle Tabs
  useEffect(() => {
    if (!mounted) return;
    const entitaeten: Entitaet[] = ["tools", "studien", "artikel", "ausbildung"];
    entitaeten.forEach((e) => {
      const url = `${SUPABASE_URL}/rest/v1/${e}?status=eq.aktiv&select=id`;
      fetch(url, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: "count=exact",
          Range: "0-0",
        },
      })
        .then((res) => {
          const range = res.headers.get("content-range");
          if (range) {
            const total = parseInt(range.split("/")[1], 10);
            if (!isNaN(total)) setCounts((prev) => ({ ...prev, [e]: total }));
          }
        })
        .catch(() => {});
    });
  }, [mounted]);

  const ladeDaten = useCallback(async (entitaet: Entitaet): Promise<AnyEntry[]> => {
    if (cacheRef.current[entitaet]) return cacheRef.current[entitaet]!;
    const cfg = CONFIG[entitaet];
    const url = `${SUPABASE_URL}/rest/v1/${entitaet}?select=${cfg.felder}&status=eq.aktiv&order=${cfg.order}&limit=500`;
    try {
      const res = await fetch(url, {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      });
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error(JSON.stringify(data));
      cacheRef.current[entitaet] = data;
      setCounts((prev) => ({ ...prev, [entitaet]: data.length }));
      if (entitaet === "tools") {
        const tools = data as Tool[];
        const kats = [...new Set(tools.map((d) => d.produktkategorie).filter(Boolean))].sort();
        setKategorieOptionen(kats);
        const schwerpunkte = [
          ...new Set(
            tools.flatMap((d) =>
              (d.schwerpunkt || "").split(",").map((s) => s.trim()).filter(Boolean)
            )
          ),
        ].sort();
        setSchwerpunktOptionen(schwerpunkte);
        const kosten = [...new Set(tools.map((d) => d.kostenmodell).filter(Boolean))].sort();
        setKostenOptionen(kosten);
      }
      return data;
    } catch (e) {
      console.error("Ladefehler:", e);
      cacheRef.current[entitaet] = [];
      return [];
    }
  }, []);

  const filtereUndRendere = useCallback(
    (
      daten: AnyEntry[],
      ent: Entitaet,
      opts: {
        suche: string;
        filterKat: string;
        filterZg: string;
        filterSchw: string;
        filterSpr: string;
        filterKos: string;
        filterDsgvo: string;
      }
    ) => {
      const s = opts.suche.toLowerCase();
      const result = daten.filter((row) => {
        if (s) {
          const t = row as Tool;
          const hay = [
            row.url_sauber,
            row.seitentitel,
            (t as Tool).zusammenfassung_kurz,
            row.zusammenfassung,
            row.zielgruppe,
            (t as Tool).schwerpunkt,
            (t as Tool).produktkategorie,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          if (!hay.includes(s)) return false;
        }
        if (ent === "tools") {
          const t = row as Tool;
          if (opts.filterKat && t.produktkategorie !== opts.filterKat) return false;
          if (opts.filterZg && !(t.zielgruppe || "").includes(opts.filterZg)) return false;
          if (opts.filterSchw && !(t.schwerpunkt || "").includes(opts.filterSchw)) return false;
          if (opts.filterSpr && !(t.sprache_website || "").includes(opts.filterSpr)) return false;
          if (opts.filterKos && !(t.kostenmodell || "").includes(opts.filterKos)) return false;
          if (opts.filterDsgvo === "ja" && t.dsgvo_jn !== true) return false;
        }
        return true;
      });
      setGefiltert(result);
    },
    []
  );

  // Initial load + switch entity
  const wechselEntitaet = useCallback(
    async (ent: Entitaet) => {
      setAktEntitaet(ent);
      setAusgewaehlt(null);
      setAktSubTab("kacheln");
      setSuche("");
      setFilterKat("");
      setFilterZg("");
      setFilterSchw("");
      setFilterSpr("");
      setFilterKos("");
      setFilterDsgvo("");
      setGefiltert([]);
      setLoading(true);
      const daten = await ladeDaten(ent);
      setLoading(false);
      filtereUndRendere(daten, ent, {
        suche: "",
        filterKat: "",
        filterZg: "",
        filterSchw: "",
        filterSpr: "",
        filterKos: "",
        filterDsgvo: "",
      });
    },
    [ladeDaten, filtereUndRendere]
  );

  useEffect(() => {
    if (mounted) wechselEntitaet("tools");
  }, [mounted]); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-filter when filters change
  useEffect(() => {
    const daten = cacheRef.current[aktEntitaet] || [];
    filtereUndRendere(daten, aktEntitaet, {
      suche,
      filterKat,
      filterZg,
      filterSchw,
      filterSpr,
      filterKos,
      filterDsgvo,
    });
  }, [suche, filterKat, filterZg, filterSchw, filterSpr, filterKos, filterDsgvo, aktEntitaet, filtereUndRendere]);

  const resetFilter = () => {
    setSuche("");
    setFilterKat("");
    setFilterZg("");
    setFilterSchw("");
    setFilterSpr("");
    setFilterKos("");
    setFilterDsgvo("");
  };

  const zeigeDetail = (entry: AnyEntry) => {
    setAusgewaehlt(entry);
    setAktSubTab("detail");
  };

  // Cluster-Zahlen
  const zaehleCluster = (schwerpunkt: string) => {
    const daten = (cacheRef.current["tools"] || []) as Tool[];
    if (!schwerpunkt) return daten.length;
    return daten.filter((r) =>
      (r.schwerpunkt || "").toLowerCase().includes(schwerpunkt.toLowerCase())
    ).length;
  };

  const waehleCluster = (cluster: string) => {
    setModalOffen(false);
    const schw = CLUSTER_SCHWERPUNKT[cluster] || "";
    // Switch to tools & set filter
    setAktEntitaet("tools");
    setAusgewaehlt(null);
    setAktSubTab("kacheln");
    setSuche("");
    setFilterKat("");
    setFilterZg("");
    setFilterSchw(schw);
    setFilterSpr("");
    setFilterKos("");
    setFilterDsgvo("");
    // Ensure tools are loaded
    if (!cacheRef.current["tools"]) {
      ladeDaten("tools").then(() => {});
    }
  };

  if (!mounted) return null;

  const gesamtDaten = cacheRef.current[aktEntitaet] || [];
  const gesamtAnzahl = gesamtDaten.length;
  const gefiltertAnzahl = gefiltert.length;

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
          overflow: hidden;
          height: 100vh;
          display: flex;
          flex-direction: column;
          transition: background 0.35s, color 0.35s;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }
        .kck-root.light {
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

        /* NAV */
        .kck-nav {
          position: relative; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.1rem 2.5rem;
          border-bottom: 1px solid var(--border2);
          background: var(--bg);
          flex-shrink: 0;
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
          position: relative; width: 44px; height: 24px;
          border-radius: 12px; border: 1px solid var(--border);
          background: var(--bg3); cursor: pointer; transition: background 0.3s;
        }
        .theme-toggle::after {
          content: ''; position: absolute; top: 3px;
          width: 16px; height: 16px; border-radius: 50%;
          background: var(--gold); transition: left 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .kck-root.light .theme-toggle::after { left: 3px; }
        .kck-root.dark  .theme-toggle::after { left: 23px; }
        .theme-label {
          font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--muted); user-select: none;
        }

        /* HAMBURGER + MOBILE-MENU */
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

        /* MOBILE FILTER-TOGGLE */
        .filter-toggle-btn {
          display: none; width: 100%; padding: 10px 16px;
          background: var(--bg2); border: none; border-bottom: 1px solid var(--border);
          font-family: 'DM Sans', sans-serif; font-size: 0.82rem;
          font-weight: 500; color: var(--text2); cursor: pointer;
          text-align: left; letter-spacing: 0.04em;
          transition: background 0.2s;
        }
        .filter-toggle-btn:hover { background: var(--bg3); }

        @media (max-width: 768px) {
          /* NAV */
          .kck-nav { padding: 0.9rem 1.2rem; }
          .nav-logo { font-size: 0.88rem; white-space: nowrap; }

          /* APP LAYOUT */
          .kompass-app { flex-direction: column; overflow: hidden; }
          .k-sidebar {
            width: 100%; border-right: none;
            border-bottom: 1px solid var(--border);
            overflow: hidden; flex-shrink: 0;
          }
          .k-sidebar-body { display: none; }
          .k-sidebar-body.open { display: block; }
          .filter-toggle-btn { display: flex; align-items: center; justify-content: space-between; }
          .k-main { overflow: hidden; }

          /* KACHELN CONTAINER */
          .kacheln-container { overflow-y: auto; overflow-x: hidden; padding: 12px 14px; }
          .kacheln-grid { max-width: 100%; gap: 14px; }

          /* KACHEL: Option B — sauberes vertikales Layout */
          .kachel { flex-direction: column; gap: 0; padding: 16px; overflow: hidden; }
          .kachel-body { width: 100%; min-width: 0; }

          /* Badge oben, URL darunter */
          .kachel-header {
            flex-direction: column-reverse; align-items: flex-start;
            gap: 6px; margin-bottom: 10px;
          }
          .kachel-url {
            white-space: normal; word-break: break-all;
            font-size: 0.75rem;
          }
          .badge { max-width: 100%; overflow: hidden; text-overflow: ellipsis; }

          /* Beschreibung: 3 Zeilen */
          .kachel-zusammenfassung {
            -webkit-line-clamp: 3; margin-bottom: 12px;
            word-break: break-word;
          }

          /* Meta: jede Info in eigener Zeile */
          .kachel-meta { flex-direction: column; gap: 5px; margin-bottom: 14px; }
          .meta-item { width: 100%; flex-wrap: nowrap; }
          .meta-sep { display: none; }

          /* Details-Button: volle Breite */
          .kachel-actions { width: 100%; margin-top: 4px; }
          .kachel-actions .btn {
            width: 100%; text-align: center;
            display: block; padding: 10px;
          }

          /* DETAIL */
          .detail-container { padding: 14px; overflow-x: hidden; }
          .detail-card { padding: 18px; }
          .detail-grid { grid-template-columns: 1fr; }

          /* LISTE */
          .listen-container { overflow-x: auto; }

          /* SUB-TABS */
          .sub-tabs { padding: 0 14px; }
        }

        /* APP LAYOUT */
        .kompass-app {
          display: flex; flex: 1; overflow: hidden;
          background: var(--bg);
        }

        /* SIDEBAR — C: eigener Hintergrund für klarere Trennung */
        .k-sidebar {
          width: 280px; flex-shrink: 0;
          background: var(--bg2);
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          overflow-y: auto;
          transition: background 0.35s, border-color 0.35s;
        }

        .entity-tabs {
          padding: 16px 12px 8px;
          display: flex; flex-direction: column; gap: 6px;
        }
        .entity-tab {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px;
          border: 1.5px solid var(--border2);
          border-radius: 8px;
          background: var(--surface);
          cursor: pointer; width: 100%; text-align: left;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.86rem; font-weight: 400;
          color: var(--text2);
          transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
        }
        .entity-tab:hover { border-color: var(--gold); color: var(--text2); }
        .entity-tab.active {
          background: var(--gold); border-color: var(--gold);
          color: var(--bg); font-weight: 500;
        }
        .entity-tab .icon { font-size: 1rem; }
        .entity-tab .label { flex: 1; }
        .entity-tab .count {
          font-size: 0.68rem;
          background: var(--bg2); padding: 1px 6px;
          color: var(--muted);
        }
        .entity-tab.active .count { background: rgba(255,255,255,0.2); color: var(--bg); }

        .landkarte-btn-wrap { padding: 0 12px 10px; }
        .landkarte-btn {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 9px 14px;
          background: var(--bg2); border: 1.5px solid var(--border);
          font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 400;
          color: var(--text2); cursor: pointer; transition: all 0.2s;
        }
        .landkarte-btn:hover { border-color: var(--gold); color: var(--gold); }

        .filter-section { padding: 12px 16px; flex: 1; }
        .filter-section h4 {
          font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.1em;
          color: var(--muted); margin-bottom: 10px; font-weight: 500;
        }
        .filter-group { margin-bottom: 10px; }
        .filter-group label {
          display: block; font-size: 0.74rem;
          color: var(--muted); margin-bottom: 3px; font-weight: 400;
        }
        .filter-group input,
        .filter-group select {
          width: 100%; padding: 6px 9px; font-size: 0.78rem;
          background: var(--bg2); border: 1px solid var(--border2);
          border-radius: 6px;
          color: var(--text); font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color 0.22s, background 0.35s;
          appearance: none;
        }
        .filter-group input:focus,
        .filter-group select:focus { border-color: var(--gold); }
        .filter-group select { cursor: pointer; }

        .filter-reset {
          width: 100%; margin-top: 6px; font-size: 0.74rem;
          color: var(--muted); background: none; border: 1px solid var(--border2);
          padding: 6px; cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s, color 0.2s;
        }
        .filter-reset:hover { border-color: var(--gold); color: var(--gold); }

        .erklaerung { padding: 0 12px 12px; }
        .erklaerung-box {
          background: var(--surface); border: 1px solid var(--border2);
          padding: 12px 14px; font-size: 0.74rem; color: var(--text2); line-height: 1.6;
        }
        .erklaerung-box strong {
          display: block; font-family: 'Cormorant Garamond', serif;
          font-size: 0.95rem; color: var(--text2); margin-bottom: 4px;
        }

        /* MAIN */
        .k-main {
          flex: 1; display: flex; flex-direction: column; overflow: hidden;
          background: var(--bg);
        }

        .sub-tabs {
          background: var(--surface); border-bottom: 1px solid var(--border2);
          padding: 0 24px; display: flex; align-items: center; flex-shrink: 0;
          transition: background 0.35s;
        }
        .sub-tab {
          padding: 13px 18px; border-bottom: 2.5px solid transparent;
          font-size: 0.8rem; font-weight: 400; letter-spacing: 0.04em;
          color: var(--muted); cursor: pointer; white-space: nowrap;
          background: none; border-left: none; border-right: none; border-top: none;
          font-family: 'DM Sans', sans-serif; transition: all 0.2s;
        }
        .sub-tab:hover { color: var(--text2); }
        .sub-tab.active { color: var(--gold); border-bottom-color: var(--gold); font-weight: 500; }

        /* PANELS */
        .panel { display: none; flex: 1; overflow: hidden; }
        .panel.active { display: flex; flex-direction: column; }

        /* KACHELN */
        .kacheln-container { flex: 1; overflow-y: auto; padding: 20px 24px; }
        .kacheln-grid { display: flex; flex-direction: column; gap: 16px; max-width: 900px; }

        /* B: Kacheln mit Goldakzent-Linie, abgerundeten Ecken */
        .kachel {
          background: var(--surface); border: 1px solid var(--border2);
          border-left: 3px solid var(--border2);
          border-radius: 10px;
          padding: 16px 18px; cursor: pointer;
          box-shadow: var(--shadow);
          overflow: hidden;
          transition: border-color 0.22s cubic-bezier(0.4,0,0.2,1),
                      border-left-color 0.22s cubic-bezier(0.4,0,0.2,1),
                      box-shadow 0.22s cubic-bezier(0.4,0,0.2,1),
                      transform 0.22s cubic-bezier(0.4,0,0.2,1);
          display: flex; gap: 14px; align-items: flex-start;
        }
        .kachel:hover { border-color: var(--border); border-left-color: var(--gold); box-shadow: 0 6px 24px rgba(28,22,14,0.13), 0 2px 8px rgba(28,22,14,0.07); transform: translateY(-1px); }
        .kck-root.dark .kachel:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3); }
        .kachel-body { flex: 1; min-width: 0; overflow: hidden; }
        .kachel-header { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 6px; overflow: hidden; }
        .kachel-url {
          font-size: 0.8rem; font-weight: 500; color: var(--gold);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; min-width: 0;
        }
        .kachel-zusammenfassung {
          font-size: 0.85rem; color: var(--text2); line-height: 1.6; margin-bottom: 9px;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
          word-break: break-word;
        }
        .kachel-meta { display: flex; flex-wrap: wrap; gap: 5px; align-items: center; overflow: hidden; }
        .meta-item { display: flex; align-items: center; gap: 3px; font-size: 0.72rem; color: var(--text2); flex-wrap: wrap; }
        .meta-label { font-weight: 500; color: var(--muted); white-space: nowrap; }
        .meta-sep { color: var(--border); font-size: 0.8rem; margin: 0 2px; flex-shrink: 0; }
        .kachel-actions { flex-shrink: 0; display: flex; flex-direction: column; gap: 6px; align-items: flex-end; }

        /* BADGES */
        .badge {
          font-size: 0.62rem; letter-spacing: 0.08em; text-transform: uppercase;
          padding: 2px 8px; border: 1px solid; white-space: nowrap;
          border-radius: 4px;
        }
        .badge-gold { border-color: var(--gold); color: var(--gold); }
        .badge-green { border-color: #5a9a50; color: #5a9a50; }
        .badge-muted { border-color: var(--border); color: var(--muted); }

        /* BUTTONS */
        .btn {
          font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase;
          padding: 7px 16px; cursor: pointer; font-family: 'DM Sans', sans-serif;
          font-weight: 500; text-decoration: none; display: inline-block;
          transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
          border: 1px solid var(--border); color: var(--text2);
          background: transparent; border-radius: 6px;
        }
        .btn:hover { border-color: var(--gold); color: var(--gold); background: var(--bg2); }
        .btn-primary {
          background: var(--gold); color: var(--bg); border-color: var(--gold);
          font-weight: 500; border-radius: 6px;
        }
        .btn-primary:hover { background: var(--gold2); border-color: var(--gold2); color: var(--bg);
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(140,104,32,0.28);
        }
        .kck-root.dark .btn-primary:hover {
          box-shadow: 0 4px 14px rgba(194,160,60,0.22);
        }

        /* Premium Transitions */
        .entity-tab, .landkarte-btn,
        .filter-group input, .filter-group select {
          transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Typografie-Feinschliff */
        .meta-item { letter-spacing: 0.015em; }
        .meta-label { letter-spacing: 0.04em; }
        .kachel-url { letter-spacing: 0.01em; }

        /* DETAIL */
        .detail-container { flex: 1; overflow-y: auto; padding: 24px; }
        .detail-card {
          background: var(--surface); border: 1px solid var(--border2);
          padding: 28px; max-width: 800px;
          box-shadow: var(--shadow);
          transition: background 0.35s;
        }
        .detail-header { margin-bottom: 20px; padding-bottom: 18px; border-bottom: 1px solid var(--border2); }
        .detail-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.7rem; font-weight: 300; color: var(--text); margin-bottom: 4px;
        }
        .detail-url { font-size: 0.8rem; color: var(--gold); text-decoration: none; }
        .detail-url:hover { color: var(--gold2); }
        .detail-badges { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
        .detail-section { margin-bottom: 20px; }
        .detail-section-title {
          font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.09em;
          color: var(--muted); font-weight: 500; margin-bottom: 7px;
        }
        .detail-text { font-size: 0.88rem; color: var(--text2); line-height: 1.75; }
        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .detail-field { background: var(--bg2); padding: 9px 13px; }
        .detail-field-label {
          font-size: 0.66rem; text-transform: uppercase; letter-spacing: 0.06em;
          color: var(--muted); font-weight: 500; margin-bottom: 2px;
        }
        .detail-field-value { font-size: 0.84rem; color: var(--text); font-weight: 500; }
        .detail-empty { text-align: center; padding: 80px 40px; color: var(--muted); }
        .detail-actions { margin-top: 20px; display: flex; gap: 10px; }
        .detail-back { margin-bottom: 16px; }

        /* LISTE */
        .listen-container { flex: 1; overflow-y: auto; }
        .liste-table { width: 100%; border-collapse: collapse; font-size: 0.79rem; }
        .liste-table thead {
          position: sticky; top: 0;
          background: var(--surface); z-index: 5;
          transition: background 0.35s;
        }
        .liste-table th {
          padding: 10px 14px; text-align: left; color: var(--muted);
          font-weight: 500; border-bottom: 2px solid var(--border2);
          white-space: nowrap; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em;
        }
        .liste-table td {
          padding: 8px 14px; border-bottom: 1px solid var(--border2);
          color: var(--text2); vertical-align: middle;
        }
        .liste-table tr { cursor: pointer; transition: background 0.15s; }
        .liste-table tr:hover td { background: var(--bg2); }
        .td-url { color: var(--gold); max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .td-text { max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--muted); }

        /* LOADING / EMPTY */
        .loading-state {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; padding: 80px; gap: 12px; color: var(--muted);
        }
        .spinner {
          width: 28px; height: 28px;
          border: 2px solid var(--border);
          border-top-color: var(--gold);
          border-radius: 50%; animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .empty-state { text-align: center; padding: 80px 40px; color: var(--muted); font-size: 0.88rem; }

        /* MODAL */
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(28,24,18,0.6);
          z-index: 500; display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .modal-box {
          background: var(--surface); max-width: 780px; width: 100%;
          max-height: 95vh; overflow-y: auto; padding: 26px 26px 24px;
          position: relative; box-shadow: 0 12px 48px rgba(0,0,0,0.4);
          transition: background 0.35s;
        }
        .modal-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 12px;
        }
        .modal-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.35rem; font-weight: 300; color: var(--text);
        }
        .modal-close {
          background: none; border: none; font-size: 1.3rem;
          cursor: pointer; color: var(--muted); line-height: 1;
          transition: color 0.2s;
        }
        .modal-close:hover { color: var(--gold); }
        .modal-hint { font-size: 0.76rem; color: var(--muted); margin-bottom: 14px; }
        .modal-divider { border: none; border-top: 1px solid var(--border2); margin: 12px 0; }

        .mword { cursor: pointer; transition: opacity 0.2s; }
        .mword:hover { opacity: 0.7; }
        .mbubble { cursor: pointer; transition: opacity 0.2s; }
        .mbubble:hover { opacity: 0.8; }


      `}</style>

      <div className={`kck-root ${theme}`}>

        {/* NAV */}
        <nav className="kck-nav">
          <Link href="/" className="nav-logo">KI-Coaching<span> Kompass</span></Link>
          <ul className="nav-center">
            <li><a href="#">Beratung</a></li>
            <li><a href="#">Workshop</a></li>
            <li><a href="https://isha.de" target="_blank" rel="noopener noreferrer">Zuhören</a></li>
            <li><a className="active">Kompass</a></li>
            <li><a href="#">Kontakt</a></li>
          </ul>
          <div className="nav-right">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Farbschema wechseln" />
            <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menü öffnen">
              <span /><span /><span />
            </button>
          </div>
          <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
            <Link href="/" onClick={() => setMenuOpen(false)}>Coaching und KI</Link>
            <Link href="/ki-coaching" onClick={() => setMenuOpen(false)}>KI-Coaching</Link>
            <Link href="/ki-coaching/beratung" className="sub-item" onClick={() => setMenuOpen(false)}>Beratung</Link>
            <Link href="/ki-coaching/workshop" className="sub-item" onClick={() => setMenuOpen(false)}>Einführung von KI-Coaching</Link>
            <Link href="/ki-coaching/kompass" className="active sub-item" onClick={() => setMenuOpen(false)}>KI-Tools entdecken</Link>
            <Link href="/zuhoeren" onClick={() => setMenuOpen(false)}>Tiefes Zuhören (und KI)</Link>
            <Link href="/ueber-mich" onClick={() => setMenuOpen(false)}>Über mich</Link>
          </div>
        </nav>

        {/* APP */}
        <div className="kompass-app">

          {/* SIDEBAR */}
          <aside className="k-sidebar">
            <button
              className="filter-toggle-btn"
              onClick={() => setSidebarOffen(o => !o)}
            >
              <span>Filter {sidebarOffen ? "ausblenden" : "anzeigen"}</span>
              <span>{sidebarOffen ? "▲" : "▼"}</span>
            </button>
            <div className={`k-sidebar-body${sidebarOffen ? " open" : ""}`}>
            <div className="entity-tabs">
              {(["tools", "studien", "artikel", "ausbildung"] as Entitaet[]).map((e) => {
                const isAktiv = aktEntitaet === e;
                const gesamt = counts[e];
                const countLabel = isAktiv && gesamt !== undefined && gefiltertAnzahl !== gesamt
                  ? `${gefiltertAnzahl}/${gesamt}`
                  : (gesamt ?? "—");
                return (
                  <button
                    key={e}
                    className={`entity-tab${isAktiv ? " active" : ""}`}
                    onClick={() => wechselEntitaet(e)}
                  >
                    <span className="icon">{ICONS[e]}</span>
                    <span className="label">{LABELS[e]}</span>
                    <span className="count">{countLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Themenlandkarte */}
            <div className="landkarte-btn-wrap">
              <button className="landkarte-btn" onClick={() => setModalOffen(true)}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="9.5" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="3" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                Themenlandkarte
              </button>
            </div>

            {/* Filter */}
            <div className="filter-section">
              <h4>Filter</h4>
              <div className="filter-group">
                <label>Suche</label>
                <input
                  type="text"
                  placeholder="Stichwort…"
                  value={suche}
                  onChange={(e) => setSuche(e.target.value)}
                />
              </div>

              {aktEntitaet === "tools" && (
                <>
                  <div className="filter-group">
                    <label>Produktkategorie</label>
                    <select value={filterKat} onChange={(e) => setFilterKat(e.target.value)}>
                      <option value="">Alle</option>
                      {kategorieOptionen.map((k) => <option key={k}>{k}</option>)}
                    </select>
                  </div>
                  <div className="filter-group">
                    <label>Zielgruppe</label>
                    <select value={filterZg} onChange={(e) => setFilterZg(e.target.value)}>
                      <option value="">Alle</option>
                      {["Coach","HR","L&D","Führungskraft","Einzelperson","Unternehmen","Trainer","Sales"].map((z) => (
                        <option key={z}>{z}</option>
                      ))}
                    </select>
                  </div>
                  <div className="filter-group">
                    <label>Schwerpunkt</label>
                    <select value={filterSchw} onChange={(e) => setFilterSchw(e.target.value)}>
                      <option value="">Alle</option>
                      {schwerpunktOptionen.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="filter-group">
                    <label>Sprache</label>
                    <select value={filterSpr} onChange={(e) => setFilterSpr(e.target.value)}>
                      <option value="">Alle</option>
                      <option value="DE">Deutsch (DE)</option>
                      <option value="EN">Englisch (EN)</option>
                    </select>
                  </div>
                  <div className="filter-group">
                    <label>Kostenmodell</label>
                    <select value={filterKos} onChange={(e) => setFilterKos(e.target.value)}>
                      <option value="">Alle</option>
                      {kostenOptionen.length > 0
                        ? kostenOptionen.map((k) => <option key={k}>{k}</option>)
                        : ["Kostenlos","Freemium","Abo","Enterprise","Auf Anfrage"].map((k) => <option key={k}>{k}</option>)}
                    </select>
                  </div>
                  <div className="filter-group">
                    <label>DSGVO</label>
                    <select value={filterDsgvo} onChange={(e) => setFilterDsgvo(e.target.value)}>
                      <option value="">Alle</option>
                      <option value="ja">DSGVO-konform</option>
                    </select>
                  </div>
                </>
              )}

              <button className="filter-reset" onClick={resetFilter}>✕ Filter zurücksetzen</button>
            </div>

            <div className="erklaerung">
              <div className="erklaerung-box">
                <strong>So nutzen Sie den Kompass</strong>
                Wählen Sie links eine Kategorie, filtern Sie nach Ihren Bedürfnissen und klicken Sie auf eine Kachel für Details.
              </div>
            </div>
            </div>{/* end k-sidebar-body */}
          </aside>

          {/* MAIN */}
          <main className="k-main">
            <div className="sub-tabs">
              {(["kacheln","detail","liste"] as SubTab[]).map((tab, i) => (
                <button
                  key={tab}
                  className={`sub-tab${aktSubTab === tab ? " active" : ""}`}
                  onClick={() => setAktSubTab(tab)}
                >
                  {["⊞ Übersicht","◎ Detail","≡ Liste"][i]}
                </button>
              ))}
            </div>

            {/* KACHELN */}
            <div className={`panel${aktSubTab === "kacheln" ? " active" : ""}`}>
              <div className="kacheln-container">
                <div className="kacheln-grid">
                  {loading ? (
                    <div className="loading-state"><div className="spinner" /><span>Lade Daten…</span></div>
                  ) : gefiltert.length === 0 ? (
                    <div className="empty-state"><p>Keine Ergebnisse für diese Filter.</p></div>
                  ) : (
                    gefiltert.map((row) => {
                      const t = row as Tool;
                      const url = row.url_sauber || "";
                      const kurz = t.zusammenfassung_kurz || row.zusammenfassung || "";
                      return (
                        <div key={row.id} className="kachel" onClick={() => zeigeDetail(row)}>
                          <div className="kachel-body">
                            <div className="kachel-header">
                              <span className="kachel-url">{url}</span>
                              {t.produktkategorie && (
                                <span className="badge badge-gold">{t.produktkategorie}</span>
                              )}
                            </div>
                            <div className="kachel-zusammenfassung">
                              {kurz || <em style={{ color: "var(--muted)" }}>Keine Beschreibung</em>}
                            </div>
                            <div className="kachel-meta">
                              {row.zielgruppe && (
                                <><span className="meta-item"><span className="meta-label">Zielgruppe:</span> {row.zielgruppe}</span><span className="meta-sep">·</span></>
                              )}
                              {t.sprache_website && (
                                <><span className="meta-item"><span className="meta-label">Sprache:</span> {t.sprache_website}</span><span className="meta-sep">·</span></>
                              )}
                              {t.firmensitz && (
                                <><span className="meta-item"><span className="meta-label">Sitz:</span> {t.firmensitz}</span><span className="meta-sep">·</span></>
                              )}
                              {t.kostenmodell && (
                                <span className="meta-item"><span className="meta-label">Kosten:</span> {t.kostenmodell}</span>
                              )}
                              {t.dsgvo_jn === true && (
                                <span className="badge badge-green" style={{ marginLeft: 4 }}>DSGVO ✓</span>
                              )}
                            </div>
                          </div>
                          <div className="kachel-actions">
                            <button
                              className="btn btn-primary"
                              onClick={(e) => { e.stopPropagation(); zeigeDetail(row); }}
                            >Details →</button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* DETAIL */}
            <div className={`panel${aktSubTab === "detail" ? " active" : ""}`}>
              <div className="detail-container">
                <div className="detail-back">
                  <button className="btn" onClick={() => setAktSubTab("kacheln")}>← Zurück zur Übersicht</button>
                </div>
                {ausgewaehlt ? (
                  <div className="detail-card">
                    <div className="detail-header">
                      <div className="detail-title">
                        {ausgewaehlt.seitentitel || ausgewaehlt.url_sauber}
                      </div>
                      <a
                        className="detail-url"
                        href={ausgewaehlt.url_sauber}
                        target="_blank"
                        rel="noopener noreferrer"
                      >↗ {ausgewaehlt.url_sauber}</a>
                      <div className="detail-badges">
                        {(ausgewaehlt as Tool).produktkategorie && (
                          <span className="badge badge-gold">{(ausgewaehlt as Tool).produktkategorie}</span>
                        )}
                        {(ausgewaehlt as Tool).kostenmodell && (
                          <span className="badge badge-muted">{(ausgewaehlt as Tool).kostenmodell}</span>
                        )}
                        {(ausgewaehlt as Tool).dsgvo_jn === true && (
                          <span className="badge badge-green">DSGVO-konform</span>
                        )}
                      </div>
                    </div>
                    {ausgewaehlt.zusammenfassung && (
                      <div className="detail-section">
                        <div className="detail-section-title">Beschreibung</div>
                        <div className="detail-text">{ausgewaehlt.zusammenfassung}</div>
                      </div>
                    )}
                    {(() => {
                      const t = ausgewaehlt as Tool;
                      const felder: [string, string][] = [];
                      if (ausgewaehlt.zielgruppe)    felder.push(["Zielgruppe", ausgewaehlt.zielgruppe]);
                      if (t.schwerpunkt)              felder.push(["Schwerpunkt", t.schwerpunkt]);
                      if (t.firmensitz)               felder.push(["Firmensitz", t.firmensitz]);
                      if (t.sprache_website)          felder.push(["Sprache Website", t.sprache_website]);
                      if (t.technologie_fokus)        felder.push(["Technologie", t.technologie_fokus]);
                      if (t.kostenmodell)             felder.push(["Kostenmodell", t.kostenmodell]);
                      if (t.ap1_name)                 felder.push(["Ansprechpartner", t.ap1_name + (t.ap1_rolle ? ` (${t.ap1_rolle})` : "")]);
                      if (t.ap1_email)                felder.push(["E-Mail", t.ap1_email]);
                      return felder.length > 0 ? (
                        <div className="detail-section">
                          <div className="detail-section-title">Weitere Informationen</div>
                          <div className="detail-grid">
                            {felder.map(([label, value]) => (
                              <div key={label} className="detail-field">
                                <div className="detail-field-label">{label}</div>
                                <div className="detail-field-value">{value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null;
                    })()}
                    <div className="detail-actions">
                      <a
                        className="btn btn-primary"
                        href={ausgewaehlt.url_sauber}
                        target="_blank"
                        rel="noopener noreferrer"
                      >↗ Website öffnen</a>
                      <button className="btn" onClick={() => setAktSubTab("kacheln")}>← Zurück</button>
                    </div>
                  </div>
                ) : (
                  <div className="detail-empty">
                    <p>Wählen Sie ein Element in der Übersicht aus<br />und klicken Sie auf &bdquo;Details&ldquo;.</p>
                  </div>
                )}
              </div>
            </div>

            {/* LISTE */}
            <div className={`panel${aktSubTab === "liste" ? " active" : ""}`}>
              <div className="listen-container">
                <table className="liste-table">
                  <thead>
                    <tr>
                      {aktEntitaet === "tools"
                        ? ["URL","Kurzbeschreibung","Kategorie","Zielgruppe","Kosten"].map((h) => <th key={h}>{h}</th>)
                        : aktEntitaet === "ausbildung"
                        ? ["URL","Titel","Kosten"].map((h) => <th key={h}>{h}</th>)
                        : ["URL","Titel","Zielgruppe","Schwerpunkt"].map((h) => <th key={h}>{h}</th>)
                      }
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={5} style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>Lade…</td></tr>
                    ) : gefiltert.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>Keine Ergebnisse</td></tr>
                    ) : (
                      gefiltert.map((row) => {
                        const t = row as Tool;
                        const g = row as GenericEntry;
                        return (
                          <tr key={row.id} onClick={() => zeigeDetail(row)}>
                            {aktEntitaet === "tools" ? (
                              <>
                                <td className="td-url">{row.url_sauber || "—"}</td>
                                <td className="td-text">{t.zusammenfassung_kurz || "—"}</td>
                                <td>{t.produktkategorie || "—"}</td>
                                <td className="td-text">{row.zielgruppe || "—"}</td>
                                <td>{t.kostenmodell || "—"}</td>
                              </>
                            ) : aktEntitaet === "ausbildung" ? (
                              <>
                                <td className="td-url">{row.url_sauber || "—"}</td>
                                <td className="td-text">{row.seitentitel || "—"}</td>
                                <td>{g.kostenmodell || "—"}</td>
                              </>
                            ) : (
                              <>
                                <td className="td-url">{row.url_sauber || "—"}</td>
                                <td className="td-text">{row.seitentitel || "—"}</td>
                                <td className="td-text">{row.zielgruppe || "—"}</td>
                                <td className="td-text">{g.schwerpunkt || "—"}</td>
                              </>
                            )}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>

        {/* THEMENLANDKARTE MODAL */}
        {modalOffen && (
          <div className="modal-overlay" onClick={() => setModalOffen(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Themenlandkarte</h2>
                <button className="modal-close" onClick={() => setModalOffen(false)}>✕</button>
              </div>
              <p className="modal-hint">Klick auf ein Thema — die Suche wird entsprechend gefiltert.</p>

              {/* Wortwolke */}
              <svg viewBox="0 0 700 200" width="100%" style={{ display: "block" }}>
                {/* Coaching – Lila */}
                <text className="mword" onClick={() => waehleCluster("coaching")} x="340" y="48" textAnchor="middle" fontSize="30" fontWeight="500" fill="#534AB7">Coaching</text>
                <text className="mword" onClick={() => waehleCluster("coaching")} x="155" y="70" textAnchor="middle" fontSize="18" fill="#7F77DD">Mentoring</text>
                <text className="mword" onClick={() => waehleCluster("coaching")} x="530" y="64" textAnchor="middle" fontSize="16" fill="#7F77DD">Supervision</text>
                <text className="mword" onClick={() => waehleCluster("coaching")} x="238" y="34" textAnchor="middle" fontSize="14" fill="#AFA9EC">Reflexion</text>
                <text className="mword" onClick={() => waehleCluster("coaching")} x="488" y="34" textAnchor="middle" fontSize="13" fill="#AFA9EC">Gesprächsbegleitung</text>
                <text className="mword" onClick={() => waehleCluster("coaching")} x="98" y="108" textAnchor="middle" fontSize="12" fill="#AFA9EC">Coach-Tools</text>
                {/* Mental Health – Pink */}
                <text className="mword" onClick={() => waehleCluster("mental_health")} x="192" y="148" textAnchor="middle" fontSize="24" fontWeight="500" fill="#993556">Mental Health</text>
                <text className="mword" onClick={() => waehleCluster("mental_health")} x="396" y="134" textAnchor="middle" fontSize="20" fill="#D4537E">Resilienz</text>
                <text className="mword" onClick={() => waehleCluster("mental_health")} x="78" y="178" textAnchor="middle" fontSize="15" fill="#ED93B1">Wohlbefinden</text>
                <text className="mword" onClick={() => waehleCluster("mental_health")} x="306" y="188" textAnchor="middle" fontSize="13" fill="#ED93B1">Burnout</text>
                <text className="mword" onClick={() => waehleCluster("mental_health")} x="522" y="148" textAnchor="middle" fontSize="12" fill="#ED93B1">Stressprävention</text>
                <text className="mword" onClick={() => waehleCluster("mental_health")} x="456" y="192" textAnchor="middle" fontSize="12" fill="#ED93B1">Mindfulness</text>
                {/* Organisation – Coral */}
                <text className="mword" onClick={() => waehleCluster("organisation")} x="554" y="104" textAnchor="middle" fontSize="20" fontWeight="500" fill="#993C1D">Leadership</text>
                <text className="mword" onClick={() => waehleCluster("organisation")} x="616" y="168" textAnchor="middle" fontSize="17" fill="#D85A30">Karriere</text>
                <text className="mword" onClick={() => waehleCluster("organisation")} x="152" y="198" textAnchor="middle" fontSize="13" fill="#F0997B">Performance</text>
                <text className="mword" onClick={() => waehleCluster("organisation")} x="616" y="44" textAnchor="middle" fontSize="12" fill="#F0997B">Executive</text>
                <text className="mword" onClick={() => waehleCluster("organisation")} x="584" y="192" textAnchor="middle" fontSize="11" fill="#F0997B">Onboarding</text>
                {/* Wissen – Amber */}
                <text className="mword" onClick={() => waehleCluster("wissen")} x="346" y="104" textAnchor="middle" fontSize="19" fontWeight="500" fill="#633806">Lernen</text>
                <text className="mword" onClick={() => waehleCluster("wissen")} x="88" y="44" textAnchor="middle" fontSize="15" fill="#BA7517">Training</text>
                <text className="mword" onClick={() => waehleCluster("wissen")} x="196" y="104" textAnchor="middle" fontSize="13" fill="#EF9F27">Skill Development</text>
                <text className="mword" onClick={() => waehleCluster("wissen")} x="474" y="104" textAnchor="middle" fontSize="12" fill="#EF9F27">E-Learning</text>
                <text className="mword" onClick={() => waehleCluster("wissen")} x="78" y="142" textAnchor="middle" fontSize="11" fill="#FAC775">Weiterbildung</text>
                {/* Markt – Grün */}
                <text className="mword" onClick={() => waehleCluster("markt")} x="444" y="168" textAnchor="middle" fontSize="19" fontWeight="500" fill="#3B6D11">Sales</text>
                <text className="mword" onClick={() => waehleCluster("markt")} x="624" y="128" textAnchor="middle" fontSize="13" fill="#639922">Vertrieb</text>
                <text className="mword" onClick={() => waehleCluster("markt")} x="346" y="198" textAnchor="middle" fontSize="12" fill="#97C459">Pipeline</text>
                <text className="mword" onClick={() => waehleCluster("markt")} x="534" y="198" textAnchor="middle" fontSize="11" fill="#97C459">Revenue</text>
              </svg>

              <hr className="modal-divider" />

              {/* Netzwerk */}
              <svg viewBox="0 0 700 270" width="100%" style={{ display: "block" }}>
                <line x1="240" y1="142" x2="150" y2="200" stroke="#AFA9EC" strokeWidth="4" strokeLinecap="round" opacity="0.4"/>
                <line x1="308" y1="128" x2="426" y2="140" stroke="#AFA9EC" strokeWidth="7" strokeLinecap="round" opacity="0.4"/>
                <line x1="262" y1="132" x2="346" y2="82" stroke="#EF9F27" strokeWidth="4" strokeLinecap="round" opacity="0.35"/>
                <line x1="298" y1="150" x2="484" y2="200" stroke="#97C459" strokeWidth="3" strokeLinecap="round" opacity="0.35"/>
                <line x1="428" y1="128" x2="364" y2="84" stroke="#EF9F27" strokeWidth="5" strokeLinecap="round" opacity="0.35"/>
                <line x1="486" y1="154" x2="494" y2="192" stroke="#97C459" strokeWidth="3" strokeLinecap="round" opacity="0.35"/>
                <line x1="426" y1="152" x2="180" y2="200" stroke="#ED93B1" strokeWidth="3" strokeLinecap="round" opacity="0.3"/>
                <line x1="370" y1="84" x2="482" y2="190" stroke="#97C459" strokeWidth="2" strokeLinecap="round" opacity="0.28"/>
                <line x1="338" y1="86" x2="178" y2="192" stroke="#ED93B1" strokeWidth="1.5" strokeLinecap="round" opacity="0.25"/>
                <line x1="482" y1="200" x2="184" y2="210" stroke="#ED93B1" strokeWidth="1" strokeLinecap="round" opacity="0.2"/>

                <g className="mbubble" onClick={() => waehleCluster("coaching")} style={{ cursor: "pointer" }}>
                  <circle cx="264" cy="142" r="96" fill="#EEEDFE" stroke="#AFA9EC" strokeWidth="1.5"/>
                  <text x="264" y="128" textAnchor="middle" fontSize="14" fontWeight="500" fill="#3C3489" style={{ pointerEvents: "none" }}>Coaching</text>
                  <text x="264" y="144" textAnchor="middle" fontSize="10" fill="#534AB7" style={{ pointerEvents: "none" }}>Mentoring · Reflexion</text>
                  <text x="264" y="162" textAnchor="middle" fontSize="19" fontWeight="500" fill="#3C3489" style={{ pointerEvents: "none" }}>{zaehleCluster("Coaching")}</text>
                  <text x="264" y="176" textAnchor="middle" fontSize="9" fill="#7F77DD" style={{ pointerEvents: "none" }}>aktive Tools</text>
                </g>
                <g className="mbubble" onClick={() => waehleCluster("mental_health")} style={{ cursor: "pointer" }}>
                  <circle cx="148" cy="222" r="58" fill="#FBEAF0" stroke="#ED93B1" strokeWidth="1.5"/>
                  <text x="148" y="212" textAnchor="middle" fontSize="11" fontWeight="500" fill="#72243E" style={{ pointerEvents: "none" }}>Mental Health</text>
                  <text x="148" y="226" textAnchor="middle" fontSize="10" fill="#993556" style={{ pointerEvents: "none" }}>Resilienz</text>
                  <text x="148" y="242" textAnchor="middle" fontSize="15" fontWeight="500" fill="#72243E" style={{ pointerEvents: "none" }}>{zaehleCluster("Mental Health")}</text>
                  <text x="148" y="254" textAnchor="middle" fontSize="9" fill="#D4537E" style={{ pointerEvents: "none" }}>aktive Tools</text>
                </g>
                <g className="mbubble" onClick={() => waehleCluster("organisation")} style={{ cursor: "pointer" }}>
                  <circle cx="456" cy="142" r="84" fill="#FAECE7" stroke="#F0997B" strokeWidth="1.5"/>
                  <text x="456" y="128" textAnchor="middle" fontSize="13" fontWeight="500" fill="#4A1B0C" style={{ pointerEvents: "none" }}>Organisation</text>
                  <text x="456" y="143" textAnchor="middle" fontSize="10" fill="#993C1D" style={{ pointerEvents: "none" }}>Leadership · Karriere</text>
                  <text x="456" y="160" textAnchor="middle" fontSize="18" fontWeight="500" fill="#4A1B0C" style={{ pointerEvents: "none" }}>{zaehleCluster("Leadership")}</text>
                  <text x="456" y="173" textAnchor="middle" fontSize="9" fill="#D85A30" style={{ pointerEvents: "none" }}>aktive Tools</text>
                </g>
                <g className="mbubble" onClick={() => waehleCluster("wissen")} style={{ cursor: "pointer" }}>
                  <circle cx="350" cy="66" r="48" fill="#FAEEDA" stroke="#EF9F27" strokeWidth="1.5"/>
                  <text x="350" y="56" textAnchor="middle" fontSize="12" fontWeight="500" fill="#412402" style={{ pointerEvents: "none" }}>Wissen</text>
                  <text x="350" y="70" textAnchor="middle" fontSize="10" fill="#633806" style={{ pointerEvents: "none" }}>Lernen · L&D</text>
                  <text x="350" y="85" textAnchor="middle" fontSize="14" fontWeight="500" fill="#412402" style={{ pointerEvents: "none" }}>{zaehleCluster("Lernen")}</text>
                  <text x="350" y="97" textAnchor="middle" fontSize="9" fill="#BA7517" style={{ pointerEvents: "none" }}>aktive Tools</text>
                </g>
                <g className="mbubble" onClick={() => waehleCluster("markt")} style={{ cursor: "pointer" }}>
                  <circle cx="504" cy="218" r="54" fill="#EAF3DE" stroke="#97C459" strokeWidth="1.5"/>
                  <text x="504" y="208" textAnchor="middle" fontSize="12" fontWeight="500" fill="#173404" style={{ pointerEvents: "none" }}>Markt</text>
                  <text x="504" y="221" textAnchor="middle" fontSize="10" fill="#3B6D11" style={{ pointerEvents: "none" }}>Sales · Vertrieb</text>
                  <text x="504" y="236" textAnchor="middle" fontSize="15" fontWeight="500" fill="#173404" style={{ pointerEvents: "none" }}>{zaehleCluster("Sales Coaching")}</text>
                  <text x="504" y="248" textAnchor="middle" fontSize="9" fill="#639922" style={{ pointerEvents: "none" }}>aktive Tools</text>
                </g>

                <text x="350" y="264" textAnchor="middle" fontSize="10" fill="#888">
                  {(cacheRef.current["tools"] || []).length} aktive Tools · Liniendicke = Verbindungsstärke
                </text>
              </svg>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
