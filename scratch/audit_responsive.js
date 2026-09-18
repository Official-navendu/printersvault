const fs = require('fs');
const path = require('path');

const cssContent = fs.readFileSync(path.join(__dirname, '../css/style.css'), 'utf8');

// Check fixed widths in CSS > 300px without max-width or media query
const fixedWidthRegex = /([a-zA-Z0-9_.-]+)\s*\{[^}]*?width:\s*([3-9]\d{2}|\d{4,})px/g;
let fixedWidths = [];
let match;

while ((match = fixedWidthRegex.exec(cssContent)) !== null) {
  fixedWidths.push({ selector: match[1], width: match[2] });
}

console.log('Fixed width declarations > 300px:', fixedWidths.length);
if (fixedWidths.length > 0) {
  console.log(fixedWidths.slice(0, 15));
}

// Check unclosed media queries or braces
const cleanCss = cssContent.replace(/\/\*[\s\S]*?\*\//g, '');
let stack = [];
cleanCss.split('\n').forEach((line, idx) => {
  for (let c of line) {
    if (c === '{') stack.push({ line: idx + 1 });
    if (c === '}') {
      if (stack.length === 0) {
        console.error(`Extra closing brace } at line ${idx + 1}`);
      } else {
        stack.pop();
      }
    }
  }
});

console.log('Brace stack count:', stack.length);
