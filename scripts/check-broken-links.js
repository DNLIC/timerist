#!/usr/bin/env node
/**
 * Find internal HTML links that point to non-existent pages.
 * Scans all HTML files in the project root (excluding Backups, etc.)
 * and reports broken links.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// Get all HTML files in root (site pages) - exclude Backups, dev/demo files
function getSiteHtmlFiles() {
  const files = fs.readdirSync(rootDir);
  return files
    .filter((f) => f.endsWith('.html'))
    .filter((f) => !f.startsWith('Sample_') && !f.startsWith('Icon_') && !f.includes(' copy'))
    .filter((f) => !f.startsWith('__'))
    .filter((f) => f !== 'emon-timer-about copy.html' && f !== 'emon-timer-about copy 2.html');
}

// Get all HTML files we consider "source" (including subdirs like Backups for completeness, but we focus on root)
function getHtmlFilesToScan() {
  const files = fs.readdirSync(rootDir);
  const rootHtml = files
    .filter((f) => f.endsWith('.html'))
    .filter((f) => !f.startsWith('__'));
  return rootHtml.map((f) => path.join(rootDir, f));
}

// Extract internal hrefs (relative .html links only)
function extractInternalLinks(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const links = [];
  // Match href="something.html" or href="something.html#anchor"
  const regex = /href=["']([^"']*\.html)(?:[#"'][^"']*)?["']/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    const fullHref = m[1];
    // Skip external URLs
    if (fullHref.startsWith('http://') || fullHref.startsWith('https://') || fullHref.startsWith('//')) continue;
    // Get just the filename (handle ./page.html, page.html, subdir/page.html)
    const normalized = fullHref.split('#')[0].split('?')[0];
    const basename = path.basename(normalized) || normalized;
    if (basename.endsWith('.html')) {
      links.push({ href: basename, raw: fullHref, file: path.basename(filePath) });
    }
  }
  return links;
}

const siteFiles = new Set(getSiteHtmlFiles());
const filesToScan = getHtmlFilesToScan().filter((f) => {
  const name = path.basename(f);
  return !name.startsWith('Sample_') && !name.startsWith('Icon_') && !f.includes('Backups');
});

console.log('Site HTML files (existing pages):', [...siteFiles].sort().join(', '));
console.log('\nScanning', filesToScan.length, 'HTML files for internal links...\n');

const broken = new Map(); // href -> [{ file, raw }]

for (const filePath of filesToScan) {
  const links = extractInternalLinks(filePath);
  const baseName = path.basename(filePath);
  for (const { href, raw } of links) {
    if (!siteFiles.has(href)) {
      if (!broken.has(href)) broken.set(href, []);
      broken.get(href).push({ file: baseName, raw });
    }
  }
}

if (broken.size === 0) {
  console.log('✓ No broken internal links found.');
  process.exit(0);
}

console.log('BROKEN LINKS (link target does not exist):\n');
for (const [target, occurrences] of broken) {
  const uniqueFiles = [...new Set(occurrences.map((o) => o.file))];
  console.log(`  ${target}`);
  console.log(`    → Linked from: ${uniqueFiles.join(', ')}`);
  console.log('');
}

process.exit(1);
