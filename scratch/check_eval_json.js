const fs = require('fs');
const path = require('path');

const projectDir = 'c:/Users/naven/Desktop/printersvault';

console.log('=== CHECK 1: EVAL & NEW FUNCTION USAGE ===');
const jsFiles = [];
function getJsFiles(dir) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      if (!p.includes('node_modules') && !p.includes('.git') && !p.includes('scratch')) getJsFiles(p);
    } else if (f.endsWith('.js')) {
      jsFiles.push(p);
    }
  });
}
getJsFiles(projectDir);

let evalFound = false;
jsFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.match(/\beval\s*\(/) || content.match(/new\s+Function/) || content.match(/\bFunction\s*\(/)) {
    console.log('Found eval/Function in: ' + path.relative(projectDir, file));
    evalFound = true;
  }
});
if (!evalFound) console.log('No eval() or new Function() found in any production JavaScript files!');

console.log('\n=== CHECK 2: FETCHING JSON IN PRODUCTION JS ===');
jsFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.match(/fetch\s*\(/) || content.match(/\.json/i) || content.match(/XMLHttpRequest/i)) {
    console.log('JSON/fetch reference in: ' + path.relative(projectDir, file));
    const lines = content.split('\n');
    lines.forEach((l, idx) => {
      if (l.includes('fetch') || l.includes('.json') || l.includes('XMLHttp')) {
        console.log(`  L${idx+1}: ${l.trim().substring(0, 100)}`);
      }
    });
  }
});
