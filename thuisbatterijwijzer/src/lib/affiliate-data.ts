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
    url: 'https://www.bol.com/nl/nl/s/?searchtext=thuisbatterij',
    niche: 'thuisbatterijen',
    label: 'Bekijk op bol.com',
    commissionType: 'cps',
    commissionValue: '3-6% per verkoop',
  },
  {
    id: 'bliq-batterij',
    network: 'direct',
    merchant: 'Bliq Energy',
    url: 'https://bliq.energy/',
    niche: 'thuisbatterijen',
    label: 'Bekijk Bliq batterijsystemen',
    commissionType: 'cpa',
    commissionValue: '€40-€120 per lead',
  },
  {
    id: 'energieleverancier-vergelijk',
    network: 'daisycon',
    merchant: 'Pricewise (Energievergelijken)',
    url: 'https://www.pricewise.nl/energie-vergelijken/',
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
  // Amazon PartnerNet (tag: vergelijk05-21)
  // Note: use /dp/ASIN URLs so links go to specific product pages, not search results.
  // Tag is appended dynamically by buildTrackingUrl().
  {
    id: 'amazon-jackery-powerstation',
    network: 'amazon',
    merchant: 'Amazon.nl',
    url: 'https://www.amazon.nl/dp/B0C5GNJT6C', // Jackery Explorer 500 Plus powerstation
    niche: 'thuisbatterijen',
    label: 'Jackery Explorer 500 bij Amazon',
    commissionType: 'cps',
    commissionValue: '3-10% per verkoop',
  },
  {
    id: 'amazon-ecoflow-powerstation',
    network: 'amazon',
    merchant: 'Amazon.nl',
    url: 'https://www.amazon.nl/dp/B09FMMVXGJ', // EcoFlow DELTA mini powerstation
    niche: 'thuisbatterijen',
    label: 'EcoFlow DELTA mini bij Amazon',
    commissionType: 'cps',
    commissionValue: '3-10% per verkoop',
  },
  {
    id: 'amazon-balkonbatterij',
    network: 'amazon',
    merchant: 'Amazon.nl',
    url: 'https://www.amazon.nl/dp/B0BFWVPWT3', // EcoFlow RIVER 2 - balkon/portable batterij
    niche: 'thuisbatterijen',
    label: 'EcoFlow RIVER 2 balkonbatterij bij Amazon',
    commissionType: 'cps',
    commissionValue: '3-10% per verkoop',
  },
];

registerLinks(links);

export default links;
