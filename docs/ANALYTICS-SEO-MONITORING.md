# Analytics & SEO Monitoring Setup — VergelijkSlim.nl

## 1. Google Analytics 4 (GA4)

### Setup stappen

1. Ga naar [analytics.google.com](https://analytics.google.com)
2. Klik "Start measuring" → maak een nieuw account "VergelijkSlim"
3. Maak een property "VergelijkSlim.nl" met tijdzone Europe/Amsterdam en valuta EUR
4. Kies "Web" als platform, vul `vergelijkslim.nl` in als URL
5. Kopieer het **Measurement ID** (format: `G-XXXXXXXXXX`)
6. Vervang `G-XXXXXXXXXX` in `src/layouts/BaseLayout.astro` (2x) met je echte Measurement ID
7. Bouw de site opnieuw en deploy

### Aanbevolen GA4-configuratie

- **Enhanced Measurement** inschakelen (scroll tracking, outbound clicks, site search)
- **Data retention** instellen op 14 maanden (Admin → Data Settings → Data Retention)
- **Cross-domain tracking** niet nodig (single domain)
- **Events** aanmaken voor affiliate klikken: configureer een custom event `affiliate_click` op basis van outbound clicks naar affiliate-domeinen

### Affiliate click tracking

Voeg na de GA4 config in BaseLayout dit toe zodra het Measurement ID live is:

```javascript
document.querySelectorAll('a[data-affiliate]').forEach(link => {
  link.addEventListener('click', () => {
    gtag('event', 'affiliate_click', {
      affiliate_partner: link.dataset.affiliate,
      link_url: link.href,
      page_path: window.location.pathname
    });
  });
});
```

Zorg dat affiliate links het attribuut `data-affiliate="partnernaam"` hebben.

---

## 2. Google Search Console (GSC)

### Verificatie stappen voor vergelijkslim.nl

1. Ga naar [search.google.com/search-console](https://search.google.com/search-console)
2. Klik "Add property" → kies **URL prefix** → vul `https://vergelijkslim.nl` in
3. Kies verificatiemethode **HTML tag**:
   - Kopieer de meta tag (format: `<meta name="google-site-verification" content="XXXXX" />`)
   - Voeg toe in `src/layouts/BaseLayout.astro` in de `<head>` sectie, na de viewport meta tag
   - Deploy de site
   - Klik "Verify" in Search Console
4. Voeg ook `https://vergelijkslim.github.io` toe als property (zolang GitHub Pages URL actief is)

### Na verificatie

- **Sitemap indienen**: Ga naar Sitemaps → voeg `sitemap-index.xml` toe
- **URL Inspection**: Test de homepage en 1 artikel per categorie
- **Coverage rapport** controleren na 48 uur

---

## 3. Sitemap

De sitemap wordt automatisch gegenereerd door `@astrojs/sitemap` en bevat alle pagina's.

- Index: `/sitemap-index.xml`
- Pagina's: `/sitemap-0.xml`
- Huidige pagina's: 38 URLs (3 categorieen + 36 artikelen + homepage)

### Submit instructies

1. Open Google Search Console → Sitemaps
2. Voer in: `sitemap-index.xml`
3. Klik "Submit"
4. Controleer na 24-48u of de status "Success" is en het aantal geindexeerde pagina's klopt

---

## 4. robots.txt

**Status: Geoptimaliseerd** (bijgewerkt in deze commit)

```
User-agent: *
Allow: /

Sitemap: https://vergelijkslim.github.io/sitemap-index.xml
```

Wanneer het domein vergelijkslim.nl live is, update de Sitemap-URL naar:
```
Sitemap: https://vergelijkslim.nl/sitemap-index.xml
```

En update ook `site` in `astro.config.mjs` naar `https://vergelijkslim.nl`.

---

## 5. Dashboard — Key Metrics

### Wekelijks monitoren

| Metric | Bron | Doel (maand 1-3) |
|--------|------|-------------------|
| Organic sessions | GA4 | Groeitrend zichtbaar |
| Top landing pages | GA4 | Top 10 identificeren |
| Bounce rate | GA4 | < 70% |
| Avg. session duration | GA4 | > 1:30 min |
| Affiliate clicks | GA4 (custom event) | Tracking actief |
| Indexed pages | GSC | 38/38 geindexeerd |
| Avg. position | GSC | Track per keyword |
| Click-through rate | GSC | > 3% gemiddeld |
| Crawl errors | GSC | 0 errors |
| Core Web Vitals | GSC | Alle "Good" |

### Maandelijks rapporteren

- Top 10 pagina's op organic traffic
- Keyword rankings veranderingen (top 20 keywords)
- Nieuwe keywords die ranken (GSC → Performance → Queries)
- Affiliate click-through rate per categorie
- Technische issues (crawl errors, indexeringsproblemen)

---

## 6. Keyword Rank Tracking — Top 20 Keywords

Gebaseerd op de huidige content en zoekvolume potentieel in Nederland:

### Zonnepanelen (7 keywords)
1. `zonnepanelen kosten` — kosten-zonnepanelen-2026
2. `beste zonnepanelen` — beste-zonnepanelen-2026
3. `zonnepanelen subsidie` — subsidie-zonnepanelen-2026
4. `hoeveel zonnepanelen heb ik nodig` — hoeveel-zonnepanelen-nodig
5. `zonnepanelen plat dak` — plat-dak
6. `thuisbatterij kosten` — thuisbatterij-kosten-opbrengst
7. `zonnepanelen installateur [stad]` — installateur-amsterdam (+ andere steden)

### Hosting (7 keywords)
8. `beste webhosting nederland` — beste-webhosting-nederland
9. `beste wordpress hosting` — beste-wordpress-hosting
10. `transip review` — transip-review
11. `antagonist review` — antagonist-review
12. `vps hosting nederland` — beste-vps-hosting-nederland
13. `website bouwer vergelijken` — beste-website-bouwer
14. `email hosting vergelijken` — beste-email-hosting-bedrijf

### Woningverbetering (6 keywords)
15. `warmtepomp kosten` — warmtepomp-kosten
16. `keuken renovatie kosten` — keuken-renovatie-kosten
17. `badkamer renovatie kosten` — badkamer-renovatie-kosten
18. `dakkapel kosten` — dakkapel-kosten
19. `vloerverwarming kosten` — vloerverwarming-kosten
20. `huis verbouwen kosten` — huis-verbouwen-gids

### Gratis rank tracking opties

- **Google Search Console** (gratis, beperkt tot eigen data): Performance rapport → filter op queries
- **Google Looker Studio** + GSC connector: geautomatiseerd wekelijks dashboard
- **Alternatief**: Ubersuggest free tier (3 keywords/dag) of SERPRobot (gratis tot 5 keywords)

---

## Checklist — Uitvoervolgorde

- [ ] GA4 property aanmaken en Measurement ID invullen in code
- [ ] Google Search Console property toevoegen en verifiëren
- [ ] Sitemap indienen via Search Console
- [ ] robots.txt URL updaten zodra vergelijkslim.nl live is
- [ ] astro.config.mjs `site` updaten naar vergelijkslim.nl
- [ ] Enhanced Measurement inschakelen in GA4
- [ ] Affiliate click tracking implementeren
- [ ] Looker Studio dashboard koppelen aan GA4 + GSC
- [ ] Eerste rank tracking baseline vastleggen (week 1)
