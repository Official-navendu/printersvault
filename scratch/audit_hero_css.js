const fs = require('fs');
const path = require('path');

const cssPath = 'c:/Users/naven/Desktop/printersvault/css/style.css';
const css = fs.readFileSync(cssPath, 'utf8');

console.log('=== CSS HERO COMPONENT SPECIFIC AUDIT ===');

const heroClasses = [
  'hero-commercial-banner',
  'hero-commercial-grid',
  'hero-trust-wrapper',
  'hero-trust-item',
  'hero-dots-left',
  'hero-dots-right',
  'split-ref-section',
  'split-ref-grid',
  'split-ref-img-wrapper',
  'split-ref-img-box',
  'split-ref-img',
  'split-ref-features',
  'split-ref-feat-label-single',
  'split-ref-trust-strip',
  'blog-details-hero',
  'blog-featured-img',
  'pdetail-hero-grid',
  'pdetail-gallery-wrap',
  'cart-header-wrap',
  'acc-hero-card',
  'acc-hero-grid',
  'order-success-wrapper',
  'policy-hero-section',
  'policy-hero-title'
];

// Check fixed heights or widths in these classes
const lines = css.split('\n');
let currentSelector = '';
let inMedia = false;
let mediaQuery = '';

lines.forEach((line, idx) => {
  const lineNum = idx + 1;
  if (line.includes('@media')) {
    inMedia = true;
    mediaQuery = line.trim();
  }
  
  heroClasses.forEach(cls => {
    if (line.includes('.' + cls) || line.includes('#' + cls)) {
      console.log(`L${lineNum} [${inMedia ? mediaQuery : 'GLOBAL'}]: ${line.trim()}`);
    }
  });
});
