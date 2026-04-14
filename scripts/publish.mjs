#!/usr/bin/env node

/**
 * Automated publication pipeline.
 *
 * Steps:
 * 1. Validate all content files (frontmatter, required fields)
 * 2. Build the static site
 * 3. Output build stats
 *
 * Usage:
 *   node scripts/publish.mjs              # validate + build
 *   node scripts/publish.mjs --dry-run    # validate only
 */

import { execSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const CONTENT_DIR = 'src/content';
const REQUIRED_FIELDS = ['title', 'description', 'niche', 'type', 'publishDate'];
const dryRun = process.argv.includes('--dry-run');

function collectMarkdownFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...collectMarkdownFiles(full));
    } else if (extname(full) === '.md') {
      files.push(full);
    }
  }
  return files;
}

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fm = {};
  for (const line of match[1].split('\n')) {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      fm[key.trim()] = rest.join(':').trim().replace(/^["']|["']$/g, '');
    }
  }
  return fm;
}

function validate() {
  const files = collectMarkdownFiles(CONTENT_DIR);
  let errors = 0;
  let drafts = 0;

  console.log(`Validating ${files.length} content files...\n`);

  for (const file of files) {
    const content = readFileSync(file, 'utf-8');
    const fm = extractFrontmatter(content);

    if (!fm) {
      console.error(`  ERROR: No frontmatter in ${file}`);
      errors++;
      continue;
    }

    if (fm.draft === 'true') {
      drafts++;
      continue;
    }

    for (const field of REQUIRED_FIELDS) {
      if (!fm[field]) {
        console.error(`  ERROR: Missing "${field}" in ${file}`);
        errors++;
      }
    }
  }

  console.log(`  ${files.length} files checked`);
  console.log(`  ${drafts} drafts skipped`);
  console.log(`  ${errors} errors found\n`);

  return errors;
}

function build() {
  console.log('Building site...\n');
  try {
    execSync('npx astro build', { stdio: 'inherit' });
    console.log('\nBuild complete.');

    const distFiles = collectMarkdownFiles('dist').length;
    console.log(`Output: dist/ directory`);
  } catch (e) {
    console.error('Build failed.');
    process.exit(1);
  }
}

const errors = validate();

if (errors > 0) {
  console.error(`Validation failed with ${errors} errors. Fix them before publishing.`);
  process.exit(1);
}

if (dryRun) {
  console.log('Dry run complete — no build performed.');
} else {
  build();
}
