const fs = require('fs');
const path = require('path');

const projectDir = 'c:/Users/naven/Desktop/printersvault';

const htmlFiles = fs.readdirSync(projectDir)
  .filter(f => f.endsWith('.html'))
  .map(f => path.join(projectDir, f))
  .concat(
    fs.readdirSync(path.join(projectDir, 'pages'))
      .filter(f => f.endsWith('.html'))
      .map(f => path.join(projectDir, 'pages', f))
  );

console.log('=== AUDITING target="_blank" IN ALL HTML & JS FILES ===');

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(projectDir, file);
  const matches = content.matchAll(/<a[^>]+target=["']_blank["'][^>]*>/gi);
  for (const m of matches) {
    if (!m[0].includes('rel=') || !m[0].includes('noopener')) {
      console.log(`[MISSING REL] ${relPath}: ${m[0]}`);
    }
  }
});

// Also check JS files
const jsFiles = fs.readdirSync(path.join(projectDir, 'js'))
  .filter(f => f.endsWith('.js'))
  .map(f => path.join(projectDir, 'js', f));

jsFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(projectDir, file);
  const matches = content.matchAll(/target=["']_blank["']/gi);
  for (const m of matches) {
    // Check surrounding context
    const idx = m.index;
    const snippet = content.substring(Math.max(0, idx - 50), Math.min(content.length, idx + 100));
    if (!snippet.includes('rel=') || !snippet.includes('noopener')) {
      console.log(`[JS MISSING REL] ${relPath}: ${snippet.replace(/\s+/g, ' ')}`);
    }
  }
});
