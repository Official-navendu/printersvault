const fs = require('fs');
const path = require('path');

const projectDir = 'c:/Users/naven/Desktop/printersvault';

console.log('==================================================');
console.log('FINAL SVG SECURITY AUDIT SCANNER');
console.log('==================================================');

// 1. Find all .svg files
function getAllSvgFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!filePath.includes('node_modules') && !filePath.includes('.git') && !filePath.includes('scratch')) {
        getAllSvgFiles(filePath, arrayOfFiles);
      }
    } else if (file.endsWith('.svg')) {
      arrayOfFiles.push(filePath);
    }
  });
  return arrayOfFiles;
}

const svgFiles = getAllSvgFiles(projectDir);
console.log(`Total .svg files found in filesystem: ${svgFiles.length}`);

let scriptsFound = 0;
let externalRefsFound = 0;
let suspiciousUrlsFound = 0;
let xxeEntitiesFound = 0;
let modifiedCount = 0;
const externalDomains = new Set();
const auditResults = [];

svgFiles.forEach(filePath => {
  const rel = path.relative(projectDir, filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  let issues = [];

  // Check 1: Scripts / Event Handlers
  if (/<script/i.test(content)) {
    issues.push('Contains <script> tag');
    scriptsFound++;
  }
  if (/javascript:/i.test(content)) {
    issues.push('Contains javascript: URI');
    scriptsFound++;
  }
  if (/on[a-z]+\s*=/i.test(content)) {
    issues.push('Contains inline event handler (e.g. onload, onclick, onerror)');
    scriptsFound++;
  }
  if (/\beval\s*\(/i.test(content) || /new\s+Function/i.test(content)) {
    issues.push('Contains eval/Function execution');
    scriptsFound++;
  }

  // Check 2: External / Dangerous Tags
  if (/<(iframe|object|embed|foreignObject)/i.test(content)) {
    issues.push('Contains iframe/object/embed/foreignObject tag');
    externalRefsFound++;
  }
  if (/<image[^>]+href=["']https?:\/\//i.test(content)) {
    issues.push('Contains external <image href>');
    externalRefsFound++;
  }

  // Check 3: Suspicious URLs / Data URLs
  const urlMatches = content.match(/https?:\/\/[^\s"'<>)]+/gi);
  if (urlMatches) {
    urlMatches.forEach(url => {
      externalDomains.add(url);
      if (!url.includes('w3.org')) {
        issues.push(`External URL found: ${url}`);
        suspiciousUrlsFound++;
      }
    });
  }

  // Check 4: XML / XXE Entities
  if (/<!DOCTYPE/i.test(content)) {
    issues.push('Contains <!DOCTYPE>');
    xxeEntitiesFound++;
  }
  if (/<!ENTITY/i.test(content)) {
    issues.push('Contains <!ENTITY> declaration');
    xxeEntitiesFound++;
  }

  // Check 5: Validity / Form / HTML elements
  if (/<(form|input|textarea|select|button)/i.test(content)) {
    issues.push('Contains HTML form elements');
  }

  auditResults.push({
    file: rel,
    status: issues.length === 0 ? 'CLEAN' : 'ISSUE_DETECTED',
    issues
  });
});

console.log('\n--- FILE SYSTEM SVG AUDIT SUMMARY ---');
auditResults.forEach(res => {
  console.log(`${res.file}: ${res.status}`);
  if (res.issues.length > 0) {
    res.issues.forEach(iss => console.log(`   - ${iss}`));
  }
});

// Also scan inline SVGs in HTML & JS files
console.log('\n--- SCANNING INLINE SVGs IN HTML & JS FILES ---');
const htmlAndJsFiles = [];
function getHtmlAndJs(dirPath) {
  fs.readdirSync(dirPath).forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!filePath.includes('node_modules') && !filePath.includes('.git') && !filePath.includes('scratch')) {
        getHtmlAndJs(filePath);
      }
    } else if (file.endsWith('.html') || file.endsWith('.js')) {
      htmlAndJsFiles.push(filePath);
    }
  });
}
getHtmlAndJs(projectDir);

let inlineSvgCount = 0;
let inlineIssues = 0;

htmlAndJsFiles.forEach(file => {
  const rel = path.relative(projectDir, file);
  const content = fs.readFileSync(file, 'utf8');
  const svgMatches = content.matchAll(/<svg[\s\S]*?<\/svg>/gi);
  for (const m of svgMatches) {
    inlineSvgCount++;
    const svgStr = m[0];
    if (/<script/i.test(svgStr) || /javascript:/i.test(svgStr) || /on[a-z]+\s*=/i.test(svgStr) || /<(iframe|object|embed|foreignObject)/i.test(svgStr) || /<!ENTITY/i.test(svgStr)) {
      console.log(`[INLINE SVG ISSUE] ${rel}: dangerous content found in inline SVG!`);
      inlineIssues++;
    }
  }
});

console.log(`Total inline <svg> elements scanned: ${inlineSvgCount}`);
console.log(`Inline SVG issues found: ${inlineIssues}`);
console.log('External domains in SVG files:', Array.from(externalDomains));

// Save report
fs.writeFileSync(
  path.join(projectDir, 'scratch', 'svg_audit_results.json'),
  JSON.stringify({
    totalSvgFiles: svgFiles.length,
    totalInlineSvgs: inlineSvgCount,
    cleanCount: svgFiles.length - modifiedCount,
    modifiedCount,
    scriptsFound,
    externalRefsFound,
    suspiciousUrlsFound,
    xxeEntitiesFound,
    externalDomains: Array.from(externalDomains)
  }, null, 2)
);
