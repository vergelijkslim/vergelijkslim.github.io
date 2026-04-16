import { registerLinks, type AffiliateLink } from './affiliates';

const links: AffiliateLink[] = [
  {
    id: 'zonnepanelen-offerte',
    network: 'daisycon',
    merchant: 'Zonnepanelen Vergelijker',
    url: '#affiliate-placeholder',
    niche: 'zonnepanelen',
    label: 'Gratis offertes aanvragen',
    commissionType: 'cpa',
    commissionValue: '€40-€120 per lead',
  },
  {
    id: 'energieleverancier-vergelijk',
    network: 'daisycon',
    merchant: 'Energievergelijker',
    url: '#affiliate-placeholder',
    niche: 'zonnepanelen',
    label: 'Vergelijk energieleveranciers',
    commissionType: 'cpa',
    commissionValue: '€30-€80 per overstap',
  },
  {
    id: 'installateur-vergelijk',
    network: 'daisycon',
    merchant: 'Installateurs Vergelijker',
    url: '#affiliate-placeholder',
    niche: 'zonnepanelen',
    label: 'Vergelijk installateurs',
    commissionType: 'cpa',
    commissionValue: '€40-€100 per lead',
  },
  {
    id: 'thuisbatterij-offerte',
    network: 'daisycon',
    merchant: 'Thuisbatterij Vergelijker',
    url: '#affiliate-placeholder',
    niche: 'zonnepanelen',
    label: 'Vergelijk thuisbatterijen',
    commissionType: 'cpa',
    commissionValue: '€50-€150 per lead',
  },
  {
    id: 'subsidie-check',
    network: 'daisycon',
    merchant: 'Subsidie Checker',
    url: '#affiliate-placeholder',
    niche: 'zonnepanelen',
    label: 'Check jouw subsidie',
    commissionType: 'cpa',
    commissionValue: '€20-€60 per lead',
  },
];

registerLinks(links);

export default links;
