/**
 * Renders FRAMEWORK.html into a paginated FRAMEWORK.pdf using the
 * locally installed Playwright Chromium browser.
 *
 * The HTML source stores "<" and ">" inside code samples as @@LT@@ / @@GT@@
 * tokens. They are substituted with the corresponding HTML character
 * references here, at render time, so the browser shows them literally
 * instead of parsing them as tags.
 *
 * Usage:  node scripts/generate-framework-pdf.js
 */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const HTML_FILE = path.join(PROJECT_ROOT, 'FRAMEWORK.html');
const PDF_FILE = path.join(PROJECT_ROOT, 'FRAMEWORK.pdf');

// Character references assembled from code points, so this source file
// never needs to contain a literal entity string.
const AMP = String.fromCharCode(38);
const LT = AMP + 'lt;';   // renders as "<"
const GT = AMP + 'gt;';   // renders as ">"

const FOOTER = `
<div style="width:100%;padding:0 18mm;font-size:8px;color:#8a93a6;
     font-family:'Segoe UI',Arial,sans-serif;display:flex;
     justify-content:space-between;align-items:center;">
  <span>Playwright Automation Framework &mdash; Framework Documentation</span>
  <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
</div>`;

function loadHtml() {
  return fs
    .readFileSync(HTML_FILE, 'utf8')
    .replace(/@@LT@@/g, LT)
    .replace(/@@GT@@/g, GT);
}

async function main() {
  if (!fs.existsSync(HTML_FILE)) {
    throw new Error(`Source HTML not found: ${HTML_FILE}`);
  }

  const html = loadHtml();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });

    await page.pdf({
      path: PDF_FILE,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: FOOTER,
      margin: { top: '12mm', right: '0mm', bottom: '14mm', left: '0mm' },
    });
  } finally {
    await browser.close();
  }

  const { size } = fs.statSync(PDF_FILE);
  console.log(`PDF generated: ${PDF_FILE} (${(size / 1024).toFixed(1)} KB)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
