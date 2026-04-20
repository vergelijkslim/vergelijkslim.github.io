import { registerLinks, type AffiliateLink } from './affiliates';

const links: AffiliateLink[] = [
  {
    id: 'laadpaal-offerte',
    network: 'direct',
    merchant: 'Laadpaalnodig.nl',
    url: 'https://www.laadpaalnodig.nl/',
    niche: 'laadpalen',
    label: 'Gratis laadpaal offerte',
    commissionType: 'cpa',
    commissionValue: '€30-€100 per lead',
  },
  {
    id: 'coolblue-laadpaal',
    network: 'daisycon',
    merchant: 'Coolblue',
    url: 'https://www.coolblue.nl/laadpalen',
    niche: 'laadpalen',
    label: 'Bekijk bij Coolblue',
    commissionType: 'cps',
    commissionValue: '4-7% per verkoop',
  },
  {
    id: 'bolcom-laadpaal',
    network: 'bolcom',
    merchant: 'bol.com',
    url: 'https://www.bol.com/nl/nl/s/?searchtext=laadpaal',
    niche: 'laadpalen',
    label: 'Bekijk op bol.com',
    commissionType: 'cps',
    commissionValue: '3-6% per verkoop',
  },
  {
    id: 'energieleverancier-vergelijk',
    network: 'daisycon',
    merchant: 'Pricewise (Energievergelijken)',
    url: 'https://www.pricewise.nl/energie-vergelijken/',
    niche: 'laadpalen',
    label: 'Vergelijk energieleveranciers',
    commissionType: 'cpa',
    commissionValue: '€30-€80 per overstap',
  },
  {
    id: 'subsidie-check',
    network: 'direct',
    merchant: 'Verbeterjehuis / Milieu Centraal',
    url: 'https://www.verbeterjehuis.nl/energiesubsidiewijzer/',
    niche: 'laadpalen',
    label: 'Check jouw subsidie',
    commissionType: 'cpa',
    commissionValue: 'geen commissie (informatief)',
  },
];

registerLinks(links);

export default links;
