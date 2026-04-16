#!/usr/bin/env node
/**
 * Link checker for ZonneWijzer — crawls dist/ HTML files,
 * extracts all outgoing (external) links, and checks HTTP status.
 *
 * Usage:
 *   node scripts/check-links.mjs            # check all links
 *   node scripts/check-links.mjs --json     # output JSON report
 *
 * Exit codes:
 *   0 = all links OK
 *   1 = broken links found
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const DIST_DIR = 'dist';
const TIMEOUT_MS = 15_000;
const CONCURRENCY = 5;
const USER_AGENT = 'ZonneWijzer-LinkChecker/1.0';

// ── Collect HTML files ──────────────────────────────────────────────

async function findHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter(e => e.isFile() && e.name.endsWith('.html'))
    .map(e => join(e.parentPath ?? e.path, e.name));
}

// ── Extract external links from HTML ────────────────────────────────

function extractLinks(html) {
  const links = new Set();
  // Match href links but skip preconnect/dns-prefetch (not real navigable links)
  const re = /<(?:a|link)\s[^>]*href="(https?:\/\/[^"]+)"[^>]*>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const tag = m[0].toLowerCase();
    if (tag.includes('rel="preconnect"') || tag.includes('rel="dns-prefetch"')) continue;
    // Only check <a> tags (navigable links), skip stylesheet/preload links
    if (tag.startsWith('<link') && !tag.includes('rel="canonical"')) continue;
    links.add(m[1]);
  }
  return [...links];
}

// ── Check a single URL ─────────────────────────────────────────────

async function checkUrl(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: { 'User-Agent': USER_AGENT },
      redirect: 'follow',
    });
    clearTimeout(timer);
    return { url, status: res.status, ok: res.ok, redirected: res.redirected, finalUrl: res.url };
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      return { url, status: 0, ok: false, error: 'timeout' };
    }
    // Some servers reject HEAD — retry with GET
    try {
      const controller2 = new AbortController();
      const timer2 = setTimeout(() => controller2.abort(), TIMEOUT_MS);
      const res = await fetch(url, {
        method: 'GET',
        signal: controller2.signal,
        headers: { 'User-Agent': USER_AGENT },
        redirect: 'follow',
      });
      clearTimeout(timer2);
      // Consume body to avoid memory leak
      await res.text();
      return { url, status: res.status, ok: res.ok, redirected: res.redirected, finalUrl: res.url };
    } catch (err2) {
      return { url, status: 0, ok: false, error: err2.message };
    }
  }
}

// ── Concurrency limiter ─────────────────────────────────────────────

async function mapConcurrent(items, fn, concurrency) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx]);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return results;
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  const jsonOutput = process.argv.includes('--json');

  const htmlFiles = await findHtmlFiles(DIST_DIR);
  if (htmlFiles.length === 0) {
    console.error('No HTML files found in dist/. Run `npm run build` first.');
    process.exit(1);
  }

  // Build map: url -> set of pages that link to it
  const linkMap = new Map();
  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf-8');
    const links = extractLinks(html);
    const page = '/' + relative(DIST_DIR, file).replace(/\\/g, '/').replace(/\/index\.html$/, '');
    for (const link of links) {
      if (!linkMap.has(link)) linkMap.set(link, new Set());
      linkMap.get(link).add(page);
    }
  }

  const uniqueUrls = [...linkMap.keys()];
  if (!jsonOutput) {
    console.log(`Found ${uniqueUrls.length} unique external links across ${htmlFiles.length} pages.\n`);
    console.log('Checking links...\n');
  }

  const results = await mapConcurrent(uniqueUrls, checkUrl, CONCURRENCY);

  // Categorize
  const broken = [];
  const redirected = [];
  const ok = [];

  for (const r of results) {
    const pages = [...linkMap.get(r.url)];
    const entry = { ...r, pages };
    if (!r.ok) broken.push(entry);
    else if (r.redirected) redirected.push(entry);
    else ok.push(entry);
  }

  if (jsonOutput) {
    console.log(JSON.stringify({ total: uniqueUrls.length, broken, redirected, ok }, null, 2));
  } else {
    if (broken.length > 0) {
      console.log(`❌ BROKEN (${broken.length}):`);
      for (const b of broken) {
        console.log(`  ${b.status || 'ERR'} ${b.url}${b.error ? ` (${b.error})` : ''}`);
        console.log(`      used on: ${b.pages.join(', ')}`);
      }
      console.log();
    }

    if (redirected.length > 0) {
      console.log(`⚠️  REDIRECTED (${redirected.length}):`);
      for (const r of redirected) {
        console.log(`  ${r.status} ${r.url}`);
        console.log(`      → ${r.finalUrl}`);
        console.log(`      used on: ${r.pages.join(', ')}`);
      }
      console.log();
    }

    console.log(`✅ OK: ${ok.length} | ⚠️ Redirected: ${redirected.length} | ❌ Broken: ${broken.length}`);
  }

  process.exit(broken.length > 0 ? 1 : 0);
}

main();
