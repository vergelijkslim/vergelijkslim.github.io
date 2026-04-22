export interface AffiliateLink {
  id: string;
  network: 'daisycon' | 'tradetracker' | 'bolcom' | 'awin' | 'direct';
  merchant: string;
  url: string;
  niche: string;
  label: string;
  commissionType: 'cpa' | 'cps' | 'recurring';
  commissionValue: string;
}

export interface AffiliateConfig {
  links: AffiliateLink[];
  defaults: { rel: string; target: string };
}

const config: AffiliateConfig = {
  links: [],
  defaults: { rel: 'nofollow sponsored', target: '_blank' },
};

const registry = new Map<string, AffiliateLink>();

export function registerLinks(links: AffiliateLink[]): void {
  for (const link of links) {
    registry.set(link.id, link);
    config.links.push(link);
  }
}

export function getLink(id: string): AffiliateLink | undefined {
  return registry.get(id);
}

export function getLinksByNiche(niche: string): AffiliateLink[] {
  return config.links.filter((l) => l.niche === niche);
}

export function buildTrackingUrl(link: AffiliateLink, params?: Record<string, string>): string {
  const url = new URL(link.url);
  url.searchParams.set('utm_source', 'vergelijk-uw-renovatie');
  url.searchParams.set('utm_medium', 'affiliate');
  url.searchParams.set('utm_campaign', link.niche);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }
  return url.toString();
}

export function getDefaults() { return config.defaults; }
