const fs = require('fs');
const css = fs.readFileSync('c:/Users/naven/Desktop/printersvault/css/style.css', 'utf8');

let openBraces = 0;
const lines = css.split('\n');
let errorCount = 0;

lines.forEach((line, idx) => {
  for (let char of line) {
    if (char === '{') openBraces++;
    if (char === '}') openBraces--;
    if (openBraces < 0) {
      console.log(`Extra closing brace found at line ${idx + 1}`);
      errorCount++;
      openBraces = 0;
    }
  }
});

console.log(`Brace validation complete. Final openBraces count: ${openBraces}, Errors: ${errorCount}`);
if (openBraces === 0 && errorCount === 0) {
  console.log('SUCCESS: CSS brace balance is PERFECT (0 errors, 0 unclosed braces)!');
} else {
  console.error('FAILURE: CSS brace mismatch!');
  process.exit(1);
}
