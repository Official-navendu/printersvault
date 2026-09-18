const fs = require('fs');

function checkFile(filePath, term) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes(term.toLowerCase())) {
      console.log(`[MATCH] ${filePath}:${idx+1} -> found "${term}": ${line.trim()}`);
    }
  });
}

console.log('--- Checking Cialis ---');
checkFile('index.html', 'cialis');
checkFile('js/blogs.js', 'cialis');
checkFile('pages/contact.html', 'cialis');

console.log('\n--- Checking Adult ---');
checkFile('pages/privacy-policy.html', 'adult');

console.log('\n--- Checking Smarteprint ---');
checkFile('js/blogs.js', 'smarteprint');
