const fs = require('fs');
const path = require('path');

const projectDir = 'c:/Users/naven/Desktop/printersvault';

function searchInDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      if (!full.includes('node_modules') && !full.includes('.git')) {
        searchInDir(full);
      }
    } else {
      const text = fs.readFileSync(full, 'utf8');
      if (text.toLowerCase().includes('smarteprint')) {
        console.log(`FOUND smarteprint in ${path.relative(projectDir, full)}`);
      }
    }
  });
}

searchInDir(projectDir);
