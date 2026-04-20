import { registerLinks, type AffiliateLink } from './affiliates';

const links: AffiliateLink[] = [
  {
    id: 'thuisbatterij-offerte',
    network: 'direct',
    merchant: 'Thuisbatterij.nl',
    url: 'https://www.thuisbatterij.nl/offerte/',
    niche: 'thuisbatterijen',
    label: 'Gratis thuisbatterij offerte',
    commissionType: 'cpa',
    commissionValue: '€50-€150 per lead',
  },
  {
    id: 'coolblue-thuisbatterij',
    network: 'daisycon',
    merchant: 'Coolblue',
    url: 'https://www.coolblue.nl/thuisbatterijen',
    niche: 'thuisbatterijen',
    label: 'Bekijk bij Coolblue',
    commissionType: 'cps',
    commissionValue: '4-7% per verkoop',
  },
  {
    id: 'bolcom-thuisbatterij',
    network: 'bolcom',
    merchant: 'bol.com',
    url: 'https://www.bol.com/nl/nl/l/thuisbatterijen/N/15551/',
    niche: 'thuisbatterijen',
    label: 'Bekijk op bol.com',
    commissionType: 'cps',
    commissionValue: '3-6% per verkoop',
  },
  {
    id: 'solarcity-batterij',
    network: 'direct',
    merchant: 'SolarClarity',
    url: 'https://www.solarclarity.nl/thuisbatterij/',
    niche: 'thuisbatterijen',
    label: 'Offerte SolarClarity',
    commissionType: 'cpa',
    commissionValue: '€40-€120 per lead',
  },
  {
    id: 'energieleverancier-vergelijk',
    network: 'daisycon',
    merchant: 'Energievergelijken.nl',
    url: 'https://www.energievergelijken.nl/',
    niche: 'thuisbatterijen',
    label: 'Vergelijk energieleveranciers',
    commissionType: 'cpa',
    commissionValue: '€30-€80 per overstap',
  },
  {
    id: 'subsidie-check',
    network: 'direct',
    merchant: 'Verbeterjehuis / Milieu Centraal',
    url: 'https://www.verbeterjehuis.nl/energiesubsidiewijzer/',
    niche: 'thuisbatterijen',
    label: 'Check jouw subsidie',
    commissionType: 'cpa',
    commissionValue: 'geen commissie (informatief)',
  },
];

registerLinks(links);

export default links;
