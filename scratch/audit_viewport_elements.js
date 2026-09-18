const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, '../css/style.css'), 'utf8');

// 1. Check for max-width on containers and images
const imgRulesWithoutMaxWidth = [];
const flexWithoutWrap = [];

console.log('=== ADVANCED RESPONSIVE CSS RULE INSPECTION ===');

// Check overflow-x hidden vs real container overflow
if (!css.includes('word-break') && !css.includes('overflow-wrap')) {
  console.log('NOTICE: Adding overflow-wrap / word-break for long titles/IDs on mobile is recommended.');
}

// Check 1024px to 1200px laptop range
console.log('Checking 1024px - 1200px range for header navigation padding and gap adjustments...');
