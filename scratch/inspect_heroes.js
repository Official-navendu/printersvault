const fs = require('fs');
const path = require('path');

const projectDir = 'c:/Users/naven/Desktop/printersvault';

console.log('=== CHECKING ALL HERO SECTIONS ===');

const indexHtml = fs.readFileSync(path.join(projectDir, 'index.html'), 'utf8');
const trustMatch = indexHtml.match(/class="hero-trust-wrapper"[\s\S]*?<\/div>\s*<\/div>/i);
if (trustMatch) {
  console.log('--- Homepage hero-trust-wrapper ---');
  console.log(trustMatch[0]);
}

// Check all HTML pages for hero/banner sections
const htmlFiles = fs.readdirSync(projectDir)
  .filter(f => f.endsWith('.html'))
  .map(f => path.join(projectDir, f))
  .concat(
    fs.readdirSync(path.join(projectDir, 'pages'))
      .filter(f => f.endsWith('.html'))
      .map(f => path.join(projectDir, 'pages', f))
  );

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const baseName = path.basename(file);
  const heroMatch = content.match(/<section[^>]*hero[^>]*>[\s\S]*?<\/section>|<section[^>]*split-ref[^>]*>[\s\S]*?<\/section>|<div[^>]*header-wrap[^>]*>[\s\S]*?<\/div>/i);
  if (heroMatch) {
    console.log(`\n=== Hero in ${baseName} ===`);
    console.log(heroMatch[0].substring(0, 350).replace(/\s+/g, ' '));
  }
});
