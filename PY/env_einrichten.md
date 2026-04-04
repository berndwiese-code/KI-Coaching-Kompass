# Umgebungsvariablen einrichten (Windows PowerShell)

## Einmalig für die aktuelle PowerShell-Sitzung setzen:

```powershell
$env:SUPABASE_URL  = "https://w8oq2446.supabase.co"
$env:SUPABASE_KEY  = "DEIN_SERVICE_ROLE_KEY"
$env:APIFY_TOKEN   = "DEIN_APIFY_TOKEN"
$env:ANTHROPIC_KEY = "DEIN_ANTHROPIC_KEY"
```

## Reihenfolge der Ausführung:

```powershell
# 1. Pakete installieren (einmalig)
pip install supabase apify-client anthropic

# 2. Apify Metadaten holen
python schritt1_apify_fetch.py

# 3. Claude klassifiziert
python schritt2_claude_klassifizierung.py

# 4. Ergebnis in Supabase prüfen (Table Editor → import_750)
#    Spalten: kategorie, kategorie_konfidenz anschauen
#    "unklar" und "niedrig" manuell korrigieren

# 5. Migration (kommt als nächstes)
python schritt3_migration.py
```

## Wo findest du die Keys?

- SUPABASE_KEY (Service Role):
  Supabase Dashboard → Settings → API → "service_role" (NICHT anon!)
  
- APIFY_TOKEN:
  apify.com → Settings → Integrations → API token

- ANTHROPIC_KEY:
  console.anthropic.com → API Keys
