import { registerLinks, type AffiliateLink } from './affiliates';

const links: AffiliateLink[] = [
  // Zonnepanelen & Energie
  {
    id: 'zonnepanelen-offerte',
    network: 'daisycon',
    merchant: 'Zonnepanelen Vergelijker',
    url: 'https://example.com/zonnepanelen',
    niche: 'zonnepanelen',
    label: 'Gratis offertes aanvragen',
    commissionType: 'cpa',
    commissionValue: '€40-€120 per lead',
  },
  {
    id: 'energieleverancier-vergelijk',
    network: 'daisycon',
    merchant: 'Energievergelijker',
    url: 'https://example.com/energie',
    niche: 'zonnepanelen',
    label: 'Vergelijk energieleveranciers',
    commissionType: 'cpa',
    commissionValue: '€30-€80 per overstap',
  },
  // Web Hosting & SaaS
  {
    id: 'hosting-vergelijk',
    network: 'tradetracker',
    merchant: 'Hosting Vergelijker',
    url: 'https://example.com/hosting',
    niche: 'hosting',
    label: 'Bekijk hosting aanbiedingen',
    commissionType: 'recurring',
    commissionValue: '20-50% recurring',
  },
  {
    id: 'saas-tool',
    network: 'direct',
    merchant: 'SaaS Platform',
    url: 'https://example.com/saas',
    niche: 'hosting',
    label: 'Probeer gratis',
    commissionType: 'recurring',
    commissionValue: '30% recurring',
  },
  // Woningverbetering
  {
    id: 'verbouwing-offerte',
    network: 'daisycon',
    merchant: 'Verbouwing Vergelijker',
    url: 'https://example.com/verbouwing',
    niche: 'woningverbetering',
    label: 'Ontvang gratis offertes',
    commissionType: 'cpa',
    commissionValue: '€15-€60 per lead',
  },
  {
    id: 'bolcom-gereedschap',
    network: 'bolcom',
    merchant: 'Bol.com',
    url: 'https://partner.bol.com/click/click?p=1',
    niche: 'woningverbetering',
    label: 'Bekijk op Bol.com',
    commissionType: 'cps',
    commissionValue: '4-8% per verkoop',
  },
];

registerLinks(links);

export default links;
