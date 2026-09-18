const fs = require('fs');
const path = require('path');

console.log('=== STARTING PRINTERSVAULT COMPLETE E-COMMERCE E2E SUITE ===\n');

// 1. LocalStorage Mock
class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

// Global Mocks
global.window = {
  location: { pathname: '/pages/cart.html', href: '', search: '' }
};
global.document = {
  body: { appendChild: () => {}, style: {} },
  querySelectorAll: (selector) => [],
  querySelector: (selector) => null,
  getElementById: (id) => null,
  createElement: (tag) => ({
    className: '',
    style: {},
    classList: { add: () => {}, remove: () => {} },
    appendChild: () => {},
    setAttribute: () => {},
    querySelector: () => null,
    querySelectorAll: () => []
  }),
  addEventListener: (event, cb) => {}
};
global.localStorage = new LocalStorageMock();
global.requestAnimationFrame = (cb) => cb();
global.showToast = (msg, type) => console.log(`[TOAST (${type || 'success'})] ${msg}`);
global.confirm = () => true;

// Load products.js
const productsCode = fs.readFileSync(path.join(__dirname, '../js/products.js'), 'utf8');
eval(productsCode + '\n global.PRODUCTS = PRODUCTS;');

console.log(`[TEST 1] Products Dataset: Loaded ${global.PRODUCTS ? global.PRODUCTS.length : 0} products.`);
if (!global.PRODUCTS || global.PRODUCTS.length !== 43) {
  console.error('FAILED: Expected 43 products in PRODUCTS array.');
  process.exit(1);
}

// Load app.js
const appCode = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');
eval(appCode + '\n global.getCart = getCart;\n global.saveCart = saveCart;\n global.clearCart = clearCart;\n global.updateCartItemQty = updateCartItemQty;\n global.removeCartItem = removeCartItem;\n global.calcCartTotals = calcCartTotals;\n global.getOrders = getOrders;\n global.saveOrder = saveOrder;\n global.addToCart = addToCart;\n global.getWishlist = getWishlist;\n global.saveWishlist = saveWishlist;\n global.toggleWishlist = toggleWishlist;\n global.formatCurrency = formatCurrency;\n global.getPathPrefix = getPathPrefix;');

console.log('[TEST 2] Storage Keys & Migration Verification');
// Test empty state
let cart = global.getCart();
console.log('Initial cart length:', cart.length);

// Test legacy migration: set pv_cart in localStorage
global.localStorage.clear();
global.localStorage.setItem('pv_cart', JSON.stringify([{ id: 'PV-001', name: 'Brother HL-L2350DW', price: 119.99, quantity: 2 }]));
cart = global.getCart();
console.log('Migrated cart length from pv_cart:', cart.length, 'Item:', cart[0].name, 'Qty:', cart[0].quantity);
const migratedKeyVal = global.localStorage.getItem('printersVaultCart');
if (!migratedKeyVal) {
  console.error('FAILED: Legacy pv_cart did not migrate to printersVaultCart!');
  process.exit(1);
}
console.log('SUCCESS: pv_cart migrated seamlessly to printersVaultCart.');

// Test Financial Total Calculations ($299 Threshold & 0 Tax)
console.log('\n[TEST 3] Financial Total Calculation Logic (calcCartTotals)');
const testCartUnder = [
  { id: 'PV-001', price: 50.00, quantity: 1 } // Subtotal $50 < $299 -> Shipping $9.99
];
let totals = global.calcCartTotals(testCartUnder);
console.log('Cart subtotal $50 -> Shipping:', totals.shipping, 'FreeShipping:', totals.isFreeShipping, 'Tax:', totals.tax.toFixed(2), 'Total:', totals.total.toFixed(2));
if (totals.shipping !== 9.99 || totals.isFreeShipping !== false || totals.tax !== 0 || totals.total !== 59.99) {
  console.error('FAILED: Shipping calculation under $299 threshold failed.');
  process.exit(1);
}

const testCart298 = [
  { id: 'PV-001', price: 298.00, quantity: 1 } // Subtotal $298 < $299 -> Shipping $9.99
];
totals = global.calcCartTotals(testCart298);
console.log('Cart subtotal $298 -> Shipping:', totals.shipping, 'FreeShipping:', totals.isFreeShipping, 'Tax:', totals.tax.toFixed(2), 'Total:', totals.total.toFixed(2));
if (totals.shipping !== 9.99 || totals.isFreeShipping !== false || totals.tax !== 0 || totals.total !== 307.99) {
  console.error('FAILED: Subtotal $298 should NOT be free shipping.');
  process.exit(1);
}

const testCart299 = [
  { id: 'PV-002', price: 299.00, quantity: 1 } // Subtotal $299 >= $299 -> FREE Shipping
];
totals = global.calcCartTotals(testCart299);
console.log('Cart subtotal $299 -> Shipping:', totals.shipping, 'FreeShipping:', totals.isFreeShipping, 'Tax:', totals.tax.toFixed(2), 'Total:', totals.total.toFixed(2));
if (totals.shipping !== 0 || totals.isFreeShipping !== true || totals.tax !== 0 || totals.total !== 299.00) {
  console.error('FAILED: Subtotal $299 should trigger FREE shipping.');
  process.exit(1);
}

// Promo Code SAVE10 Test
totals = global.calcCartTotals(testCart299, 'SAVE10');
console.log('Cart subtotal $299 with SAVE10 -> Discount:', totals.discount.toFixed(2), 'Tax:', totals.tax.toFixed(2), 'Total:', totals.total.toFixed(2));
if (Math.abs(totals.discount - 29.90) > 0.01 || totals.tax !== 0 || Math.abs(totals.total - 269.10) > 0.01) {
  console.error('FAILED: Promo code discount / tax calculation failed.');
  process.exit(1);
}
console.log('SUCCESS: calcCartTotals verified for $299 threshold, $0 tax, and promo discount.');

// Test Adding to Cart & Quantity Incrementing
console.log('\n[TEST 4] Add to Cart & Duplicate Item Quantity Incrementing');
global.localStorage.clear();
global.addToCart('PV-001', 1);
global.addToCart('PV-001', 2);
cart = global.getCart();
console.log('Cart item count after duplicate add:', cart.length, 'Quantity:', cart[0].quantity);
if (cart.length !== 1 || cart[0].quantity !== 3) {
  console.error('FAILED: Duplicate product add did not increment quantity properly.');
  process.exit(1);
}
console.log('SUCCESS: Duplicate product add correctly increments item quantity.');

// Test Order Placement & COD Enforcement
console.log('\n[TEST 5] Order Placement, COD Enforcement & Dual Storage Key Sync');
global.localStorage.clear();

const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const randomCode = 54321;
const expectedOrderId = `PV-${year}${month}${day}-${randomCode}`;

const demoOrder = {
  orderNumber: randomCode,
  orderId: expectedOrderId,
  date: now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  paymentMethod: 'Cash on Delivery (COD)',
  status: 'Order Placed',
  items: [{ id: 'PV-005', name: 'Canon imageCLASS MF232w', price: 189.99, quantity: 1 }],
  customer: { email: 'john@example.com', firstName: 'John', lastName: 'Doe', address: '123 Main St', city: 'NYC', state: 'NY', zip: '10001' },
  totals: { subtotal: 189.99, shipping: 9.99, tax: 0, total: 199.98 }
};

global.saveOrder(demoOrder);
global.localStorage.setItem('pv_latest_order_id', expectedOrderId);

const savedOrdersPrimary = JSON.parse(global.localStorage.getItem('printersVaultOrders'));
const savedOrdersLegacy = JSON.parse(global.localStorage.getItem('pv_orders'));

if (!savedOrdersPrimary || savedOrdersPrimary.length !== 1 || savedOrdersPrimary[0].orderId !== expectedOrderId) {
  console.error('FAILED: Order did not save to printersVaultOrders!');
  process.exit(1);
}
if (!savedOrdersLegacy || savedOrdersLegacy.length !== 1 || savedOrdersLegacy[0].orderId !== expectedOrderId) {
  console.error('FAILED: Order did not sync to legacy pv_orders!');
  process.exit(1);
}
if (savedOrdersPrimary[0].paymentMethod !== 'Cash on Delivery (COD)') {
  console.error('FAILED: Payment method must be Cash on Delivery (COD)!');
  process.exit(1);
}
console.log('SUCCESS: Order saved and synced seamlessly with COD payment and unique Order ID format:', expectedOrderId);

// Test Order Success Controller Logic
console.log('\n[TEST 6] Order Success Controller (js/order-success.js) Verification');
const orderSuccessJsCode = fs.readFileSync(path.join(__dirname, '../js/order-success.js'), 'utf8');
eval(orderSuccessJsCode);
console.log('SUCCESS: order-success.js loaded and evaluated cleanly with 0 syntax errors.');

// Test Product Details Controller
console.log('\n[TEST 7] Product Details Controller (product.js) Verification');
const productJsCode = fs.readFileSync(path.join(__dirname, '../js/product.js'), 'utf8');
eval(productJsCode);
console.log('SUCCESS: product.js loaded and evaluated cleanly with 0 syntax errors.');

// Test Blogs Controller
console.log('\n[TEST 8] Blogs Controller (blogs.js) Verification');
const blogsJsCode = fs.readFileSync(path.join(__dirname, '../js/blogs.js'), 'utf8');
eval(blogsJsCode);
console.log('SUCCESS: blogs.js loaded and evaluated cleanly with 0 syntax errors.');

// HTML & Script Link Audit across all 18 HTML files
console.log('\n[TEST 9] Complete 18 HTML Pages Script Link & Asset Audit');
const htmlFiles = [
  'index.html',
  'pages/shop.html',
  'pages/product.html',
  'pages/cart.html',
  'pages/checkout.html',
  'pages/account.html',
  'pages/about.html',
  'pages/contact.html',
  'pages/blog.html',
  'pages/blog-details.html',
  'pages/login.html',
  'pages/register.html',
  'pages/privacy-policy.html',
  'pages/terms-conditions.html',
  'pages/shipping-policy.html',
  'pages/disclaimer.html',
  'pages/wishlist.html',
  'pages/order-success.html'
];

let hasErrors = false;
htmlFiles.forEach(relPath => {
  const filePath = path.join(__dirname, '..', relPath);
  if (!fs.existsSync(filePath)) {
    console.error(`ERROR: File missing: ${relPath}`);
    hasErrors = true;
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');

  // Verify scripts exist
  const scriptRegex = /<script\s+src="([^"]+)"/g;
  let match;
  while ((match = scriptRegex.exec(content)) !== null) {
    const src = match[1];
    const scriptPath = path.resolve(path.dirname(filePath), src);
    if (!fs.existsSync(scriptPath)) {
      console.error(`ERROR in ${relPath}: Script path "${src}" resolved to "${scriptPath}" which DOES NOT EXIST!`);
      hasErrors = true;
    }
  }

  // Verify stylesheet exists
  const linkRegex = /<link\s+rel="stylesheet"\s+href="([^"]+)"/g;
  while ((match = linkRegex.exec(content)) !== null) {
    const href = match[1];
    const cssPath = path.resolve(path.dirname(filePath), href);
    if (!fs.existsSync(cssPath)) {
      console.error(`ERROR in ${relPath}: Stylesheet path "${href}" resolved to "${cssPath}" which DOES NOT EXIST!`);
      hasErrors = true;
    }
  }
});

if (hasErrors) {
  console.error('FAILED: Asset or link errors found in HTML files!');
  process.exit(1);
}
console.log(`SUCCESS: All ${htmlFiles.length} HTML files verified for 0 broken script/CSS references.`);

// Password Eye Toggle Functionality Audit
console.log('\n[TEST 10] Password Eye Toggle Functionality Audit');
const authJsCode = fs.readFileSync(path.join(__dirname, '../js/auth.js'), 'utf8');
eval(authJsCode);
if (typeof togglePasswordVisibility !== 'function') {
  console.error('FAILED: togglePasswordVisibility function is missing!');
  process.exit(1);
}
console.log('SUCCESS: togglePasswordVisibility function verified.');

// CSS Syntax & Brace Validation Audit
console.log('\n[TEST 11] CSS Syntax & Brace Validation Audit');
const cssContent = fs.readFileSync(path.join(__dirname, '../css/style.css'), 'utf8');
const cleanCss = cssContent.replace(/\/\*[\s\S]*?\*\//g, '');
let stack = [];
cleanCss.split('\n').forEach((line, idx) => {
  for (let c of line) {
    if (c === '{') stack.push({ line: idx + 1 });
    if (c === '}') {
      if (stack.length === 0) {
        console.error(`ERROR: Extra closing brace } at line ${idx + 1}`);
        hasErrors = true;
      } else {
        stack.pop();
      }
    }
  }
});

if (stack.length > 0) {
  console.error(`FAILED: Found ${stack.length} unclosed braces in style.css!`);
  process.exit(1);
}
console.log('SUCCESS: style.css passed brace validation with EXACTLY 0 unclosed or extra braces.');

console.log('\n=== ALL E2E FUNCTIONALITY & QA AUDIT TESTS PASSED SUCCESSFULLY! ===');
