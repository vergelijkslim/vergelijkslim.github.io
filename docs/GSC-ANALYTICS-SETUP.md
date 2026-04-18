# Google Search Console & Analytics Setup — SlimZonnig.nl

## 1. Google Search Console (GSC)

### Stap 1: Account aanmaken
1. Ga naar https://search.google.com/search-console
2. Log in met een Google-account

### Stap 2: Property toevoegen
1. Klik op "Property toevoegen"
2. Kies **"URL-prefix"** en voer in: `https://slimzonnig.nl`
3. Klik op "Doorgaan"

### Stap 3: Eigendom verifiëren
Kies een van deze methoden:

**Optie A — HTML-tag (aanbevolen):**
1. Kopieer de meta-tag die Google geeft (bijv. `<meta name="google-site-verification" content="abc123..."/>`)
2. Stuur de tag naar de CTO om toe te voegen aan de site
3. Of voeg het zelf toe aan `src/layouts/BaseLayout.astro` in de `<head>` sectie

**Optie B — DNS TXT record:**
1. Voeg een TXT-record toe aan het DNS van slimzonnig.nl
2. Record type: `TXT`, waarde: de verificatiecode van Google
3. Wacht 5-10 minuten en klik op "Verifiëren"

### Stap 4: Sitemap indienen
1. Ga naar "Sitemaps" in het linkermenu
2. Voer in: `sitemap-index.xml`
3. Klik op "Indienen"
4. De sitemap bevat alle pagina's automatisch (gegenereerd door @astrojs/sitemap)

### Stap 5: Indexering aanvragen
1. Ga naar "URL-inspectie" bovenin
2. Voer de homepage in: `https://slimzonnig.nl/`
3. Klik op "Indexering aanvragen"
4. Herhaal voor de belangrijkste pagina's:
   - `https://slimzonnig.nl/gidsen/`
   - `https://slimzonnig.nl/vergelijkingen/`
   - `https://slimzonnig.nl/regionaal/`

---

## 2. Google Analytics 4 (GA4)

### Stap 1: Account aanmaken
1. Ga naar https://analytics.google.com
2. Klik op "Aan de slag" of "Account maken"
3. Accountnaam: `SlimZonnig`

### Stap 2: Property aanmaken
1. Property-naam: `SlimZonnig.nl`
2. Tijdzone: `Nederland (GMT+1)`
3. Valuta: `Euro (€)`

### Stap 3: Gegevensstream instellen
1. Kies "Web"
2. URL: `https://slimzonnig.nl`
3. Streamnaam: `SlimZonnig Website`
4. Klik op "Stream maken"

### Stap 4: Measurement ID ophalen
1. Na het aanmaken zie je het **Measurement ID** (begint met `G-`)
2. Kopieer dit ID (bijv. `G-ABC123DEF4`)

### Stap 5: ID in de site plaatsen
Stuur het Measurement ID naar de CTO, of vervang zelf `G-XXXXXXXXXX` in twee bestanden:
- `src/layouts/BaseLayout.astro` (regel 58-64)
- `src/components/CookieConsent.astro` (regel 123)

---

## 3. Huidige technische status

| Onderdeel | Status |
|---|---|
| Sitemap | Automatisch gegenereerd op `/sitemap-index.xml` |
| robots.txt | Correct, verwijst naar sitemap op slimzonnig.nl |
| Indexeerbaarheid | Alle pagina's indexeerbaar (alleen 404 = noindex) |
| GA4 script | Aanwezig, wacht op Measurement ID |
| Cookie consent | Werkend, respecteert opt-out voor analytics |
| HTTPS | Wordt geconfigureerd door GitHub Pages |
| Canonical URLs | Automatisch gegenereerd met slimzonnig.nl domein |
| Open Graph | Volledig ingesteld per pagina |
| Structured Data | JSON-LD: WebSite, Article, BreadcrumbList, FAQPage |

---

## 4. Na setup: eerste controles

Na 24-48 uur na GSC verificatie:
- [ ] Controleer of sitemap is geaccepteerd (GSC > Sitemaps)
- [ ] Controleer "Dekking" voor eventuele fouten
- [ ] Controleer "Core Web Vitals" scores
- [ ] Verifieer dat GA4 data binnenkomt (Realtime rapport)
