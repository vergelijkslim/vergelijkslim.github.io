#!/usr/bin/env node

/**
 * Batch generate regional content for scalable city-based pages.
 * Usage: node scripts/generate-regional.mjs --niche zonnepanelen
 */

import { execSync } from 'node:child_process';

const cities = [
  { city: 'Amsterdam', province: 'Noord-Holland' },
  { city: 'Rotterdam', province: 'Zuid-Holland' },
  { city: 'Den Haag', province: 'Zuid-Holland' },
  { city: 'Utrecht', province: 'Utrecht' },
  { city: 'Eindhoven', province: 'Noord-Brabant' },
  { city: 'Groningen', province: 'Groningen' },
  { city: 'Tilburg', province: 'Noord-Brabant' },
  { city: 'Almere', province: 'Flevoland' },
  { city: 'Breda', province: 'Noord-Brabant' },
  { city: 'Nijmegen', province: 'Gelderland' },
  { city: 'Apeldoorn', province: 'Gelderland' },
  { city: 'Arnhem', province: 'Gelderland' },
  { city: 'Haarlem', province: 'Noord-Holland' },
  { city: 'Enschede', province: 'Overijssel' },
  { city: 'Amersfoort', province: 'Utrecht' },
  { city: 'Zaanstad', province: 'Noord-Holland' },
  { city: 'Zwolle', province: 'Overijssel' },
  { city: 'Leiden', province: 'Zuid-Holland' },
  { city: 'Maastricht', province: 'Limburg' },
  { city: 'Dordrecht', province: 'Zuid-Holland' },
];

const niche = process.argv[2]?.replace('--niche=', '') || process.argv[3];

if (!niche) {
  console.log('Usage: node scripts/generate-regional.mjs --niche <niche>');
  process.exit(0);
}

let generated = 0;
let skipped = 0;

for (const { city, province } of cities) {
  try {
    execSync(
      `node scripts/generate-content.mjs --niche ${niche} --type regionaal --city "${city}" --province "${province}"`,
      { stdio: 'pipe' }
    );
    generated++;
    console.log(`  + ${city}`);
  } catch {
    skipped++;
    console.log(`  ~ ${city} (already exists)`);
  }
}

console.log(`\nDone: ${generated} generated, ${skipped} skipped.`);
