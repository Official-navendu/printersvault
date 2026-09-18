const fs = require('fs');
const path = require('path');

const projectDir = 'c:/Users/naven/Desktop/printersvault';
const jsFiles = fs.readdirSync(path.join(projectDir, 'js'))
  .filter(f => f.endsWith('.js'))
  .map(f => path.join(projectDir, 'js', f));

console.log('=== AUDITING JS INLINE STYLES FOR RESPONSIVE THREATS ===');

jsFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(projectDir, file);
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    if (line.match(/style="[^"]*(grid-template-columns|min-width|width:\s*\d{3}px|height:\s*\d{3}px)/i)) {
      console.log(`${relPath}:${idx + 1}: ${line.trim()}`);
    }
  });
});
