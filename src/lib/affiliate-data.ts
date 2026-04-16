import { registerLinks, type AffiliateLink } from './affiliates';

// Real destination URLs — replace with tracked affiliate URLs once registered
// with Daisycon/TradeTracker/Awin. Current links are direct (untracked).
// TODO: Register at https://www.daisycon.com and https://www.tradetracker.com
//       to get tracked affiliate links with commission tracking.
const links: AffiliateLink[] = [
  {
    id: 'zonnepanelen-offerte',
    network: 'direct',
    merchant: 'Offerteadviseur',
    url: 'https://www.offerteadviseur.nl/zonnepanelen/',
    niche: 'zonnepanelen',
    label: 'Gratis offertes aanvragen',
    commissionType: 'cpa',
    commissionValue: '€40-€120 per lead (na Daisycon registratie)',
  },
  {
    id: 'energieleverancier-vergelijk',
    network: 'direct',
    merchant: 'Energievergelijken.nl',
    url: 'https://www.energievergelijken.nl/',
    niche: 'zonnepanelen',
    label: 'Vergelijk energieleveranciers',
    commissionType: 'cpa',
    commissionValue: '€30-€80 per overstap (na Daisycon registratie)',
  },
  {
    id: 'installateur-vergelijk',
    network: 'direct',
    merchant: 'Zonnepanelen.net',
    url: 'https://www.zonnepanelen.net/installateur/',
    niche: 'zonnepanelen',
    label: 'Vergelijk installateurs',
    commissionType: 'cpa',
    commissionValue: '€40-€100 per lead (na Daisycon registratie)',
  },
  {
    id: 'thuisbatterij-offerte',
    network: 'direct',
    merchant: 'Thuisbatterij.nl',
    url: 'https://www.thuisbatterij.nl/',
    niche: 'zonnepanelen',
    label: 'Vergelijk thuisbatterijen',
    commissionType: 'cpa',
    commissionValue: '€50-€150 per lead (na TradeTracker registratie)',
  },
  {
    id: 'subsidie-check',
    network: 'direct',
    merchant: 'Verbeterjehuis / Milieu Centraal',
    url: 'https://www.verbeterjehuis.nl/energiesubsidiewijzer/',
    niche: 'zonnepanelen',
    label: 'Check jouw subsidie',
    commissionType: 'cpa',
    commissionValue: 'geen commissie (informatief)',
  },
];

registerLinks(links);

export default links;
