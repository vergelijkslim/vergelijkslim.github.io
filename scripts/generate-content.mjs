#!/usr/bin/env node

/**
 * Programmatic content generation pipeline.
 *
 * Usage:
 *   node scripts/generate-content.mjs --niche zonnepanelen --type regionaal --city Amsterdam
 *   node scripts/generate-content.mjs --niche hosting --type review --product "TransIP"
 *   node scripts/generate-content.mjs --niche woningverbetering --type gids --topic "dakisolatie"
 *
 * This script generates markdown content files from templates.
 * In production, integrate with an AI content API for full article generation.
 */

import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const NICHES = ['zonnepanelen', 'hosting', 'woningverbetering'];
const TYPES = ['vergelijking', 'review', 'gids', 'regionaal'];

const templates = {
  regionaal: ({ niche, city, province }) => ({
    filename: `${slugify(niche)}-${slugify(city)}`,
    frontmatter: {
      title: getTitleForRegional(niche, city),
      description: getDescriptionForRegional(niche, city),
      niche,
      type: 'regionaal',
      publishDate: new Date().toISOString().split('T')[0],
      city,
      province: province || '',
      affiliateLinks: [getDefaultAffiliateLink(niche)],
      keywords: getRegionalKeywords(niche, city),
      faq: getRegionalFAQ(niche, city),
    },
    body: getRegionalBody(niche, city),
  }),

  vergelijking: ({ niche, topic }) => ({
    filename: `beste-${slugify(topic || niche)}-vergelijking`,
    frontmatter: {
      title: `Beste ${topic || niche} vergelijken – Top 10 ${new Date().getFullYear()}`,
      description: `Vergelijk de beste ${topic || niche} op prijs, kwaliteit en reviews. Onafhankelijk advies.`,
      niche,
      type: 'vergelijking',
      publishDate: new Date().toISOString().split('T')[0],
      affiliateLinks: [getDefaultAffiliateLink(niche)],
      keywords: [`beste ${topic || niche}`, `${topic || niche} vergelijken`, `${topic || niche} top 10`],
      faq: [],
    },
    body: `## Beste ${topic || niche} vergeleken\n\nIn dit artikel vergelijken we de beste opties op de Nederlandse markt.\n\n## Hoe wij testen\n\n## Top 10 overzicht\n\n## Conclusie\n`,
  }),

  review: ({ niche, product }) => ({
    filename: `${slugify(product)}-review`,
    frontmatter: {
      title: `${product} Review ${new Date().getFullYear()} – Ervaringen & Test`,
      description: `Onze eerlijke ${product} review. Lees onze ervaringen, voor- en nadelen en of het de prijs waard is.`,
      niche,
      type: 'review',
      publishDate: new Date().toISOString().split('T')[0],
      affiliateLinks: [getDefaultAffiliateLink(niche)],
      keywords: [`${product} review`, `${product} ervaringen`, `${product} test`],
      faq: [],
    },
    body: `## ${product} Review\n\n## Belangrijkste kenmerken\n\n## Voordelen\n\n## Nadelen\n\n## Prijzen\n\n## Conclusie\n`,
  }),

  gids: ({ niche, topic }) => ({
    filename: `${slugify(topic)}-gids`,
    frontmatter: {
      title: `${topic} – Complete Gids ${new Date().getFullYear()}`,
      description: `Alles wat je moet weten over ${topic.toLowerCase()}. Kosten, tips en advies.`,
      niche,
      type: 'gids',
      publishDate: new Date().toISOString().split('T')[0],
      affiliateLinks: [getDefaultAffiliateLink(niche)],
      keywords: [`${topic} kosten`, `${topic} tips`, topic.toLowerCase()],
      faq: [],
    },
    body: `## ${topic}\n\n## Wat kost het?\n\n## Waar moet je op letten?\n\n## Tips\n\n## Veelgestelde vragen\n`,
  }),
};

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getDefaultAffiliateLink(niche) {
  const map = {
    zonnepanelen: 'zonnepanelen-offerte',
    hosting: 'hosting-vergelijk',
    woningverbetering: 'verbouwing-offerte',
  };
  return map[niche] || '';
}

function getTitleForRegional(niche, city) {
  const map = {
    zonnepanelen: `Zonnepanelen ${city} – Installateurs & Prijzen ${new Date().getFullYear()}`,
    hosting: `Webdesign Bureau ${city} – Vergelijking & Reviews`,
    woningverbetering: `Aannemer ${city} – Vergelijk Offertes & Prijzen`,
  };
  return map[niche] || `${niche} in ${city}`;
}

function getDescriptionForRegional(niche, city) {
  const map = {
    zonnepanelen: `Vergelijk zonnepanelen installateurs in ${city}. Ontvang gratis offertes en bespaar op uw energierekening.`,
    hosting: `De beste webdesign bureaus in ${city} vergeleken op prijs, kwaliteit en reviews.`,
    woningverbetering: `Zoekt u een betrouwbare aannemer in ${city}? Vergelijk offertes en lees reviews.`,
  };
  return map[niche] || `${niche} in ${city} vergelijken`;
}

function getRegionalKeywords(niche, city) {
  const base = {
    zonnepanelen: ['zonnepanelen', 'installateur', 'offerte'],
    hosting: ['webdesign', 'website laten maken'],
    woningverbetering: ['aannemer', 'verbouwing', 'renovatie'],
  };
  return (base[niche] || []).map((k) => `${k} ${city.toLowerCase()}`);
}

function getRegionalFAQ(niche, city) {
  if (niche === 'zonnepanelen') {
    return [
      {
        question: `Wat kosten zonnepanelen in ${city}?`,
        answer: `De kosten van zonnepanelen in ${city} variëren tussen €3.000 en €8.000 voor een gemiddeld huishouden.`,
      },
      {
        question: `Hoeveel kan ik besparen met zonnepanelen in ${city}?`,
        answer: `Met zonnepanelen kunt u jaarlijks €400 tot €800 besparen op uw energierekening in ${city}.`,
      },
    ];
  }
  return [];
}

function getRegionalBody(niche, city) {
  if (niche === 'zonnepanelen') {
    return `## Zonnepanelen in ${city}\n\nOverweegt u zonnepanelen te laten plaatsen in ${city}? Wij helpen u de beste installateurs te vinden.\n\n## Waarom zonnepanelen in ${city}?\n\n## Beste installateurs\n\n## Prijzen vergelijken\n\nVraag gratis offertes aan van gecertificeerde installateurs in ${city}.\n`;
  }
  return `## ${niche} in ${city}\n\n`;
}

function generateContent(args) {
  const niche = args.niche;
  const type = args.type;

  if (!NICHES.includes(niche)) {
    console.error(`Invalid niche: ${niche}. Options: ${NICHES.join(', ')}`);
    process.exit(1);
  }
  if (!TYPES.includes(type)) {
    console.error(`Invalid type: ${type}. Options: ${TYPES.join(', ')}`);
    process.exit(1);
  }

  const template = templates[type];
  if (!template) {
    console.error(`No template for type: ${type}`);
    process.exit(1);
  }

  const result = template(args);
  const dir = join('src', 'content', niche);

  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const filepath = join(dir, `${result.filename}.md`);

  if (existsSync(filepath)) {
    console.error(`File already exists: ${filepath}`);
    process.exit(1);
  }

  const fm = Object.entries(result.frontmatter)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length === 0) return `${key}: []`;
        if (typeof value[0] === 'object') {
          return `${key}:\n${value.map((v) => `  - ${Object.entries(v).map(([k, val]) => `${k}: ${JSON.stringify(val)}`).join('\n    ')}`).join('\n')}`;
        }
        return `${key}:\n${value.map((v) => `  - ${JSON.stringify(v)}`).join('\n')}`;
      }
      return `${key}: ${JSON.stringify(value)}`;
    })
    .join('\n');

  const content = `---\n${fm}\n---\n\n${result.body}`;
  writeFileSync(filepath, content, 'utf-8');
  console.log(`Generated: ${filepath}`);
}

function parseArgs() {
  const args = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i].replace(/^--/, '');
    args[key] = argv[i + 1];
  }
  return args;
}

const args = parseArgs();
if (!args.niche || !args.type) {
  console.log('Usage: node scripts/generate-content.mjs --niche <niche> --type <type> [--city <city>] [--product <product>] [--topic <topic>]');
  console.log(`Niches: ${NICHES.join(', ')}`);
  console.log(`Types: ${TYPES.join(', ')}`);
  process.exit(0);
}

generateContent(args);
