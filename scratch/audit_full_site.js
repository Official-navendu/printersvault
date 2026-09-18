const fs = require('fs');
const path = require('path');

const htmlFiles = [
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

let brokenLinks = [];
let brokenAssets = [];
let headerErrors = [];

htmlFiles.forEach(relPath => {
  const filePath = path.join(__dirname, '..', relPath);
  if (!fs.existsSync(filePath)) {
    console.error('File does not exist:', relPath);
    return;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  const dir = path.dirname(filePath);

  // Audit href links
  const hrefRegex = /href=["']([^"']+)["']/g;
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    const target = match[1];
    if (target.startsWith('http') || target.startsWith('#') || target.startsWith('mailto:') || target.startsWith('tel:') || target.startsWith('javascript:')) {
      continue;
    }
    const cleanTarget = target.split('?')[0].split('#')[0];
    if (!cleanTarget) continue;

    const resolved = path.resolve(dir, cleanTarget);
    if (!fs.existsSync(resolved)) {
      brokenLinks.push({ source: relPath, target, resolved });
    }
  }

  // Audit src assets
  const srcRegex = /src=["']([^"']+)["']/g;
  while ((match = srcRegex.exec(html)) !== null) {
    const target = match[1];
    if (target.startsWith('http') || target.startsWith('data:')) {
      continue;
    }
    const resolved = path.resolve(dir, target);
    if (!fs.existsSync(resolved)) {
      brokenAssets.push({ source: relPath, target, resolved });
    }
  }

  // Audit Header Sequence
  if (!html.includes('brand-logo') || !html.includes('header-nav-group') || !html.includes('header-search-wrap') || !html.includes('header-right-actions')) {
    headerErrors.push({ source: relPath, issue: 'Missing header component' });
  }
});

console.log('=== COMPLETE SITE AUDIT RESULTS ===');
console.log('HTML Files Scanned:', htmlFiles.length);
console.log('Broken Internal Links:', brokenLinks.length);
if (brokenLinks.length > 0) {
  console.log(JSON.stringify(brokenLinks, null, 2));
}

console.log('Broken Assets (Images/JS/CSS):', brokenAssets.length);
if (brokenAssets.length > 0) {
  console.log(JSON.stringify(brokenAssets, null, 2));
}

console.log('Header Sequence Issues:', headerErrors.length);
if (headerErrors.length > 0) {
  console.log(JSON.stringify(headerErrors, null, 2));
}
