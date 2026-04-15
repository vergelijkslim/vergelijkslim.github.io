import { registerLinks, type AffiliateLink } from './affiliates';

const links: AffiliateLink[] = [
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
];

registerLinks(links);

export default links;
