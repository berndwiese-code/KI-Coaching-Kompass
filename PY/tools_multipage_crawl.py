"""
tools_multipage_crawl.py
Crawlt bis zu 8 Unterseiten pro Tool ausgehend von url_root.

Umgebungsvariablen:
  SUPABASE_URL  = https://xxxx.supabase.co
  SUPABASE_KEY  = Service-Role-Key
  APIFY_TOKEN   = Apify API Token

Verwendung:
  python tools_multipage_crawl.py
  python tools_multipage_crawl.py --limit 3
  python tools_multipage_crawl.py --force
  python tools_multipage_crawl.py --ids id1,id2,id3
"""

import os
import sys
import time
import argparse
import requests
from urllib.parse import urlparse
from supabase import create_client

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]
APIFY_TOKEN  = os.environ["APIFY_TOKEN"]

supabase     = create_client(SUPABASE_URL, SUPABASE_KEY)

APIFY_ACTOR  = "apify~website-content-crawler"
MAX_PAGES    = 8
MIN_TEXT_LEN = 100

GEZIELTE_PFADE = [
    "/pricing", "/preise", "/preismodell", "/plans", "/tarife",
    "/features", "/funktionen", "/produkt", "/product",
    "/datenschutz", "/privacy", "/privacy-policy",
    "/about", "/about-us", "/ueber-uns",
]

FEHLER_SIGNALE = [
    "404", "page not found", "seite nicht gefunden",
    "not found", "nicht gefunden", "oops",
]


def teste_url(url, url_root):
    try:
        r = requests.get(url, timeout=8, allow_redirects=True)
        if r.status_code >= 400:
            return False
        final = urlparse(r.url)
        orig  = urlparse(url)
        if final.path.rstrip("/") != orig.path.rstrip("/"):
            return False
        if len(r.text) < 500:
            return False
        return True
    except Exception:
        return False


def finde_gezielte_urls(url_root):
    gefunden = []
    for pfad in GEZIELTE_PFADE:
        url = url_root.rstrip("/") + pfad
        if teste_url(url, url_root):
            gefunden.append(url)
            if len(gefunden) >= 3:
                break
    return gefunden


def crawle_urls(start_urls, max_pages):
    run_url = f"https://api.apify.com/v2/acts/{APIFY_ACTOR}/runs?token={APIFY_TOKEN}"
    payload = {
        "startUrls": [{"url": u} for u in start_urls],
        "crawlerType": "playwright:firefox",
        "maxCrawlDepth": 1,
        "maxCrawlPages": max_pages,
        "maxResultsPerCrawl": max_pages,
        "maxConcurrency": 1,
        "removeCookieWarnings": True,
        "htmlTransformer": "readableText",
        "readableTextCharThreshold": MIN_TEXT_LEN,
    }
    try:
        response = requests.post(run_url, json=payload, timeout=30)
        if response.status_code != 201:
            print(f"      ⚠ Apify Start fehlgeschlagen: {response.status_code}")
            return []
        run_id = response.json()["data"]["id"]
    except Exception as e:
        print(f"      ⚠ Apify Start Fehler: {e}")
        return []

    status_url    = f"https://api.apify.com/v2/actor-runs/{run_id}?token={APIFY_TOKEN}"
    max_wartezeit = 180
    wartezeit     = 0
    status        = "RUNNING"

    while wartezeit < max_wartezeit:
        time.sleep(5)
        wartezeit += 5
        try:
            resp = requests.get(status_url, timeout=30)
            if resp.text.strip():
                status = resp.json()["data"]["status"]
                if status in ("SUCCEEDED", "FAILED", "ABORTED", "TIMED-OUT"):
                    break
        except Exception:
            pass
        if wartezeit % 30 == 0:
            print(f"      ⏳ Warte... ({wartezeit}s)")

    if status != "SUCCEEDED":
        print(f"      ⚠ Crawl nicht erfolgreich: {status}")
        return []

    dataset_id = resp.json()["data"]["defaultDatasetId"]
    items_url  = f"https://api.apify.com/v2/datasets/{dataset_id}/items?token={APIFY_TOKEN}&limit={max_pages}"
    try:
        return requests.get(items_url, timeout=30).json()
    except Exception:
        return []


def ist_fehlerseite(volltext, titel):
    text = (volltext + " " + titel).lower()
    if len(volltext) < 500:
        for signal in FEHLER_SIGNALE:
            if signal in text:
                return True
    return False


def speichere_seiten(tool_id, seiten):
    gespeichert = 0
    for seite in seiten:
        volltext = seite.get("text") or seite.get("markdown") or ""
        titel    = seite.get("title") or ""
        if len(volltext) < MIN_TEXT_LEN:
            continue
        if ist_fehlerseite(volltext, titel):
            print(f"      ↷ Fehlerseite: {seite.get('url', '')[:60]}")
            continue
        try:
            supabase.table("tools_pages").insert({
                "tool_id":      tool_id,
                "url":          seite.get("url", ""),
                "titel":        titel[:500],
                "beschreibung": (seite.get("description") or "")[:1000],
                "volltext":     volltext[:50000],
                "apify_status": "ok",
            }).execute()
            gespeichert += 1
        except Exception as e:
            print(f"      ⚠ Speicher-Fehler: {e}")
    return gespeichert


def crawle_tool(tool, nummer, gesamt, stats):
    url_root = tool.get("url_root", "")
    print(f"  [{nummer}/{gesamt}] {url_root}")

    gezielte = finde_gezielte_urls(url_root)
    if gezielte:
        namen = ", ".join(p.split("/")[-1] for p in gezielte)
        print(f"      🎯 {len(gezielte)} gezielte URLs: {namen}")
        start_urls = [url_root] + gezielte
        stats["gezielt"] += 1
    else:
        start_urls = [url_root]

    seiten = crawle_urls(start_urls, MAX_PAGES)
    if not seiten:
        print("      ✗ Keine Seiten gefunden")
        stats["fehler"] += 1
        return

    anzahl = speichere_seiten(tool["id"], seiten)
    print(f"      ✓ {anzahl} Seiten gespeichert")
    stats["ok"] += 1
    stats["seiten_gesamt"] += anzahl
    time.sleep(2)


def main():
    parser = argparse.ArgumentParser(description="Multi-Page Crawl fuer Tools")
    parser.add_argument("--limit", type=int,  default=None)
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--ids",   type=str,  default=None)
    args = parser.parse_args()

    stats = {"ok": 0, "fehler": 0, "seiten_gesamt": 0, "gezielt": 0}

    # -- Modus 1: Bestimmte IDs --
    if args.ids:
        ids   = [i.strip() for i in args.ids.split(",")]
        tools = supabase.table("tools").select("id, url_sauber, url_root, seitentitel").in_("id", ids).execute().data
        print(f"▶ {len(tools)} Tools via --ids\n")
        for i, tool in enumerate(tools, 1):
            crawle_tool(tool, i, len(tools), stats)

    # -- Modus 2: Automatisch --
    else:
        # Bereits gecrawlte url_roots per SQL ermitteln
        gecrawlte = supabase.rpc("get_gecrawlte_url_roots", {}).execute().data
        gecrawlte_roots = {r["url_root"] for r in (gecrawlte or [])}

        alle = supabase.table("tools").select("id, url_sauber, url_root, seitentitel").not_.is_("url_root", "null").eq("status", "aktiv").execute().data

        # Deduplizieren nach url_root und filtern
        gesehen = set()
        tools   = []
        for t in alle:
            root = t.get("url_root")
            if not root or root in gesehen:
                continue
            gesehen.add(root)
            if args.force or root not in gecrawlte_roots:
                tools.append(t)

        if args.limit:
            tools = tools[:args.limit]

        print(f"▶ {len(tools)} Tools zu crawlen\n")
        if not tools:
            print("Alle Tools bereits gecrawlt.")
            sys.exit(0)

        for i, tool in enumerate(tools, 1):
            crawle_tool(tool, i, len(tools), stats)

    print(f"\n{'=' * 55}")
    print("✅ Crawl abgeschlossen!\n")
    print(f"  Tools verarbeitet:    {stats['ok']}")
    print(f"  Davon mit gezielten:  {stats['gezielt']}")
    print(f"  Fehler:               {stats['fehler']}")
    print(f"  Seiten gesamt:        {stats['seiten_gesamt']}")


if __name__ == "__main__":
    main()
