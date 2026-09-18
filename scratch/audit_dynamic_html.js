const fs = require('fs');
const path = require('path');

const projectDir = 'c:/Users/naven/Desktop/printersvault';

console.log('=== AUDITING DYNAMIC HTML RENDERING IN JS CONTROLLERS ===');

const jsFiles = ['app.js', 'auth.js', 'blogs.js', 'cart.js', 'checkout.js', 'order-success.js', 'product.js', 'shop.js', 'wishlist.js'];

jsFiles.forEach(file => {
  const filePath = path.join(projectDir, 'js', file);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    // Check for innerHTML or template strings containing dynamic parameters
    if (line.includes('.innerHTML') || line.includes('insertAdjacentHTML')) {
      console.log(`[DYNAMIC HTML] ${file}:${idx+1} -> ${line.trim().substring(0, 100)}`);
    }
  });
});
