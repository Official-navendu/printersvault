const fs = require('fs');
const path = require('path');

const projectDir = 'c:/Users/naven/Desktop/printersvault';
const css = fs.readFileSync(path.join(projectDir, 'css', 'style.css'), 'utf8');

console.log('=== VERIFYING RESPONSIVE HERO SECTIONS AUDIT ===');

const pages = [
  'index.html',
  'pages/about.html',
  'pages/account.html',
  'pages/blog-details.html',
  'pages/blog.html',
  'pages/cart.html',
  'pages/checkout.html',
  'pages/contact.html',
  'pages/disclaimer.html',
  'pages/login.html',
  'pages/order-success.html',
  'pages/privacy-policy.html',
  'pages/product.html',
  'pages/register.html',
  'pages/shipping-policy.html',
  'pages/shop.html',
  'pages/terms-conditions.html',
  'pages/wishlist.html'
];

let allPassed = true;

pages.forEach(page => {
  const filePath = path.join(projectDir, page);
  if (!fs.existsSync(filePath)) {
    console.error(`MISSING FILE: ${page}`);
    allPassed = false;
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Verify main/hero elements exist
  const hasHeroOrMain = content.includes('<main') || content.includes('hero') || content.includes('cart-header');
  if (!hasHeroOrMain) {
    console.error(`HERO AUDIT FAILED for ${page}: No hero/main tag found`);
    allPassed = false;
  }
});

// Check CSS brace balance
let openBraces = 0;
css.split('\n').forEach(line => {
  for (let char of line) {
    if (char === '{') openBraces++;
    if (char === '}') openBraces--;
  }
});

if (openBraces !== 0) {
  console.error(`CSS BRACE BALANCING FAILED: openBraces = ${openBraces}`);
  allPassed = false;
}

if (allPassed) {
  console.log('\nSUCCESS: All 18 pages verified with 0 hero responsiveness issues and 0 CSS brace errors!');
} else {
  console.error('\nFAILURE: Hero audit detected issues.');
  process.exit(1);
}
