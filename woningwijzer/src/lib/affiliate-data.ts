import { registerLinks, type AffiliateLink } from './affiliates';

const links: AffiliateLink[] = [
  {
    id: 'verbouwing-offerte',
    network: 'direct',
    merchant: 'Offerteadviseur',
    url: 'https://www.offerteadviseur.nl/verbouwen/',
    niche: 'woningverbetering',
    label: 'Gratis offertes aanvragen',
    commissionType: 'cpa',
    commissionValue: '€15-€60 per lead (na Daisycon registratie)',
  },
  {
    id: 'isolatie-offerte',
    network: 'direct',
    merchant: 'Verbeterjehuis',
    url: 'https://www.verbeterjehuis.nl/isolatie/',
    niche: 'woningverbetering',
    label: 'Vergelijk isolatie offertes',
    commissionType: 'cpa',
    commissionValue: '€20-€80 per lead (na Daisycon registratie)',
  },
  {
    id: 'warmtepomp-offerte',
    network: 'direct',
    merchant: 'Warmtepomp-weetjes',
    url: 'https://www.warmtepomp-weetjes.nl/offertes/',
    niche: 'woningverbetering',
    label: 'Vergelijk warmtepompen',
    commissionType: 'cpa',
    commissionValue: '€40-€120 per lead (na TradeTracker registratie)',
  },
  {
    id: 'aannemer-vergelijk',
    network: 'direct',
    merchant: 'Werkspot',
    url: 'https://www.werkspot.nl/',
    niche: 'woningverbetering',
    label: 'Vind een aannemer',
    commissionType: 'cpa',
    commissionValue: '€10-€40 per lead (na Daisycon registratie)',
  },
  {
    id: 'subsidie-check',
    network: 'direct',
    merchant: 'Verbeterjehuis / Milieu Centraal',
    url: 'https://www.verbeterjehuis.nl/energiesubsidiewijzer/',
    niche: 'woningverbetering',
    label: 'Check jouw subsidie',
    commissionType: 'cpa',
    commissionValue: 'geen commissie (informatief)',
  },
  // Amazon PartnerNet (tag: vergelijk05-21)
  {
    id: 'amazon-tado-thermostaat',
    network: 'amazon',
    merchant: 'Amazon.nl',
    url: 'https://www.amazon.nl/s?k=tado+slimme+thermostaat',
    niche: 'woningverbetering',
    label: 'Tado slimme thermostaat bij Amazon',
    commissionType: 'cps',
    commissionValue: '3-10% per verkoop',
  },
  {
    id: 'amazon-isolatiefolie',
    network: 'amazon',
    merchant: 'Amazon.nl',
    url: 'https://www.amazon.nl/s?k=radiatorfolie+isolatiefolie',
    niche: 'woningverbetering',
    label: 'Isolatiefolie bij Amazon',
    commissionType: 'cps',
    commissionValue: '3-10% per verkoop',
  },
  {
    id: 'amazon-tochtstopper',
    network: 'amazon',
    merchant: 'Amazon.nl',
    url: 'https://www.amazon.nl/s?k=tochtstrip+tochtstrip+deuren',
    niche: 'woningverbetering',
    label: 'Tochtstrips bij Amazon',
    commissionType: 'cps',
    commissionValue: '3-10% per verkoop',
  },
];

registerLinks(links);

export default links;
