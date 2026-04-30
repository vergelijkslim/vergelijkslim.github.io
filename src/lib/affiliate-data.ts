import { registerLinks, type AffiliateLink } from './affiliates';

// Daisycon energy campaigns — publisher 41aslimzo, media 420541
// programId: 'PENDING' = tracking URL activates zodra board program IDs aanlevert (AFF-155)
const links: AffiliateLink[] = [
  // ── Daisycon energieleveranciers ──────────────────────────────────────────────
  {
    id: 'vattenfall-energie',
    network: 'daisycon',
    programId: 'PENDING', // TODO: vervang met echt Daisycon program ID (AFF-155)
    merchant: 'Vattenfall',
    url: 'https://www.vattenfall.nl/energie/',
    niche: 'energie',
    label: 'Stroom + gas via Vattenfall',
    commissionType: 'cpa',
    commissionValue: '€96 per conversie',
  },
  {
    id: 'essent-energie',
    network: 'daisycon',
    programId: 'PENDING', // TODO: vervang met echt Daisycon program ID (AFF-155)
    merchant: 'Essent',
    url: 'https://www.essent.nl/',
    niche: 'energie',
    label: 'Stroom + gas via Essent',
    commissionType: 'cpa',
    commissionValue: '€70 per conversie',
  },
  {
    id: 'vandebron-energie',
    network: 'daisycon',
    programId: 'PENDING', // TODO: vervang met echt Daisycon program ID (AFF-155)
    merchant: 'Vandebron',
    url: 'https://vandebron.nl/',
    niche: 'energie',
    label: 'Groene stroom via Vandebron',
    commissionType: 'cpa',
    commissionValue: '€60 per conversie + €0,51/klik',
  },
  {
    id: 'innova-energie',
    network: 'daisycon',
    programId: 'PENDING', // TODO: vervang met echt Daisycon program ID (AFF-155)
    merchant: 'Innova Energie',
    url: 'https://www.innovaenergie.nl/',
    niche: 'energie',
    label: 'Goedkope energie via Innova',
    commissionType: 'cpa',
    commissionValue: '€60 per conversie',
  },
  {
    id: 'energieleverancier-vergelijk',
    network: 'daisycon',
    programId: 'PENDING', // TODO: vervang met echt Daisycon program ID (AFF-155)
    merchant: 'Pricewise',
    url: 'https://www.pricewise.nl/energie-vergelijken/',
    niche: 'energie',
    label: 'Vergelijk energieleveranciers',
    commissionType: 'cpa',
    commissionValue: '€30-€80 per overstap',
  },
  // ── Zonnepanelen ──────────────────────────────────────────────────────────────
  {
    id: 'zonnepanelen-offerte',
    network: 'direct',
    merchant: 'Offerteadviseur',
    url: 'https://www.offerteadviseur.nl/zonnepanelen/',
    niche: 'zonnepanelen',
    label: 'Gratis offertes aanvragen',
    commissionType: 'cpa',
    commissionValue: '€40-€120 per lead',
  },
  {
    id: 'installateur-vergelijk',
    network: 'direct',
    merchant: 'Zonnepanelen.net',
    url: 'https://www.zonnepanelen.net/installateur/',
    niche: 'zonnepanelen',
    label: 'Vergelijk installateurs',
    commissionType: 'cpa',
    commissionValue: '€40-€100 per lead',
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
  // Amazon PartnerNet (tag: vergelijk05-21)
  // Note: use /dp/ASIN URLs so links go to specific product pages, not search results.
  // Tag is appended dynamically by buildTrackingUrl().
  {
    id: 'amazon-zonnepanelen-reiniger',
    network: 'amazon',
    merchant: 'Amazon.nl',
    url: 'https://www.amazon.nl/dp/B07PDJLCE2', // Zonnepanelen reinigingsset met zachte borstel
    niche: 'zonnepanelen',
    label: 'Zonnepanelen reinigingsset bij Amazon',
    commissionType: 'cps',
    commissionValue: '3-10% per verkoop',
  },
  {
    id: 'amazon-solar-monitor',
    network: 'amazon',
    merchant: 'Amazon.nl',
    url: 'https://www.amazon.nl/dp/B0BDF5DX3N', // Shelly Pro 3EM energie monitor
    niche: 'zonnepanelen',
    label: 'Zonne-energie monitor bij Amazon',
    commissionType: 'cps',
    commissionValue: '3-10% per verkoop',
  },
  {
    id: 'amazon-portable-powerstation',
    network: 'amazon',
    merchant: 'Amazon.nl',
    url: 'https://www.amazon.nl/dp/B0BFWVPWT3', // EcoFlow RIVER 2 portable powerstation
    niche: 'zonnepanelen',
    label: 'EcoFlow RIVER 2 powerstation bij Amazon',
    commissionType: 'cps',
    commissionValue: '3-10% per verkoop',
  },
];

registerLinks(links);

export default links;
