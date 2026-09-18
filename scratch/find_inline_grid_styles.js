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

console.log('=== AUDITING INLINE STYLES FOR RESPONSIVE THREATS ===');

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(projectDir, file);
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    if (line.match(/style="[^"]*(grid-template-columns|min-width|width:\s*\d{3}px|height:\s*\d{3}px)/i)) {
      console.log(`${relPath}:${idx + 1}: ${line.trim()}`);
    }
  });
});
