const fs = require('fs');
const path = require('path');

const projectDir = 'c:/Users/naven/Desktop/printersvault';
const css = fs.readFileSync(path.join(projectDir, 'css', 'style.css'), 'utf8');

console.log('=== DEEP AUDIT OF ALL 10 HERO COMPONENTS ===');

// 1. Homepage Hero
console.log('\n--- 1. Homepage Hero ---');
const hpLines = css.split('\n').filter(l => l.includes('hero-commercial') || l.includes('hero-trust'));
hpLines.forEach(l => console.log(l.trim()));

// 2. Split-Ref Hero (About, Shop, Blog, Contact)
console.log('\n--- 2. Split-Ref Hero ---');
const splitLines = css.split('\n').filter(l => l.includes('split-ref-'));
console.log(`Found ${splitLines.length} split-ref CSS rules`);

// 3. Blog Details Hero
console.log('\n--- 3. Blog Details Hero ---');
const blogDetailsJs = fs.readFileSync(path.join(projectDir, 'js', 'blogs.js'), 'utf8');
const blogHeroMatch = blogDetailsJs.match(/class="blog-details-hero"[\s\S]*?<\/div>/i);
if (blogHeroMatch) console.log(blogHeroMatch[0].substring(0, 300));

// 4. Product Details Hero
console.log('\n--- 4. Product Details Hero ---');
const productJs = fs.readFileSync(path.join(projectDir, 'js', 'product.js'), 'utf8');
const pdetailHeroMatch = productJs.match(/pdetail-hero-grid[\s\S]*?<\/div>/i);
if (pdetailHeroMatch) console.log(pdetailHeroMatch[0].substring(0, 300));

// 5. Cart / Wishlist Header
console.log('\n--- 5. Cart & Wishlist Header ---');
const cartJs = fs.readFileSync(path.join(projectDir, 'js', 'cart.js'), 'utf8');
const cartHeroMatch = cartJs.match(/cart-header-wrap[\s\S]*?<\/div>/i);
if (cartHeroMatch) console.log(cartHeroMatch[0].substring(0, 300));

// 6. Checkout Header
console.log('\n--- 6. Checkout Header ---');
const checkoutHtml = fs.readFileSync(path.join(projectDir, 'pages', 'checkout.html'), 'utf8');
const checkoutMatch = checkoutHtml.match(/checkoutMainWrap[\s\S]*?<\/h1>/i);
if (checkoutMatch) console.log(checkoutMatch[0]);

// 7. Account Hero
console.log('\n--- 7. Account Hero ---');
const authJs = fs.readFileSync(path.join(projectDir, 'js', 'auth.js'), 'utf8');
const accHeroMatch = authJs.match(/acc-hero-card[\s\S]*?<\/div>/i);
if (accHeroMatch) console.log(accHeroMatch[0].substring(0, 300));

// 8. Order Success Hero
console.log('\n--- 8. Order Success Hero ---');
const orderSuccessJs = fs.readFileSync(path.join(projectDir, 'js', 'order-success.js'), 'utf8');
const orderSuccessMatch = orderSuccessJs.match(/order-success-wrapper[\s\S]*?<\/div>/i);
if (orderSuccessMatch) console.log(orderSuccessMatch[0].substring(0, 300));

// 9. Policy Pages Hero
console.log('\n--- 9. Policy Hero ---');
const policyLines = css.split('\n').filter(l => l.includes('policy-hero'));
policyLines.forEach(l => console.log(l.trim()));

// 10. Login / Register Container
console.log('\n--- 10. Login / Register ---');
const loginHtml = fs.readFileSync(path.join(projectDir, 'pages', 'login.html'), 'utf8');
console.log(loginHtml.match(/<main[\s\S]*?<\/h1>/i)[0]);
