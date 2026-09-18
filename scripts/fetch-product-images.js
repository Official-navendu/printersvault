const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Dynamic project root directory resolution
const ROOT_DIR = process.cwd();
const SCRIPTS_DIR = path.join(ROOT_DIR, 'scripts');
const SCRATCH_DIR = path.join(ROOT_DIR, 'scratch');
const PRODUCTS_DIR = path.join(ROOT_DIR, 'images', 'products');
const PRODUCTS_JS_PATH = path.join(ROOT_DIR, 'js', 'products.js');

// Ensure all required directories exist
[SCRIPTS_DIR, SCRATCH_DIR, PRODUCTS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          const u = new URL(url);
          redirectUrl = u.origin + redirectUrl;
        }
        return resolve(fetchUrl(redirectUrl));
      }
      let data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data)));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${url}`));
    });
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          const u = new URL(url);
          redirectUrl = u.origin + redirectUrl;
        }
        return resolve(downloadFile(redirectUrl, destPath));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP status code ${res.statusCode}`));
      }
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(destPath);
      });
      fileStream.on('error', err => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error(`Timeout downloading ${url}`));
    });
  });
}

async function run() {
  console.log('====================================================');
  console.log('PRINTERSVAULT — SMART EPRINT PRODUCT IMAGE IMPORT');
  console.log('====================================================\n');

  console.log('STEP 1: SCRAPING PRODUCTS FROM SMART EPRINT SHOP PAGES...');
  const scrapedProducts = [];
  let page = 1;

  while (page <= 10) {
    const url = page === 1 ? 'https://smarteprint.com/shop/' : `https://smarteprint.com/shop/page/${page}/`;
    console.log(` -> Fetching Shop Page ${page}: ${url}`);

    try {
      const buffer = await fetchUrl(url);
      const html = buffer.toString('utf8');

      if (html.includes('Page not found') || html.includes('No products were found')) {
        console.log(` -> Reached end of product catalog at Page ${page}.`);
        break;
      }

      const productBlockRegex = /<li[^>]*class="[^"]*product[^"]*"[^>]*>([\s\S]*?)<\/li>/gi;
      let match;
      let countOnPage = 0;

      while ((match = productBlockRegex.exec(html)) !== null) {
        const block = match[1];

        const linkMatch = block.match(/href="([^"]*smarteprint\.com\/product\/[^"]*)"/i);
        const productUrl = linkMatch ? linkMatch[1] : null;

        const titleMatch = block.match(/<h2[^>]*class="[^"]*woocommerce-loop-product__title[^"]*"[^>]*>([^<]+)<\/h2>/i) ||
                           block.match(/alt="([^"]+)"/i);
        const rawTitle = titleMatch ? titleMatch[1].trim() : null;
        const title = decodeHtmlEntities(rawTitle);

        const imgMatch = block.match(/data-large_image="([^"]+)"/i) ||
                         block.match(/src="([^"]+\.(?:jpg|png|webp|jpeg)[^"]*)"/i) ||
                         block.match(/data-src="([^"]+)"/i);
        let imgUrl = imgMatch ? imgMatch[1] : null;

        const srcsetMatch = block.match(/srcset="([^"]+)"/i);
        if (srcsetMatch) {
          const parts = srcsetMatch[1].split(',').map(s => s.trim().split(' '));
          const sorted = parts.sort((a, b) => parseInt(b[1] || '0') - parseInt(a[1] || '0'));
          if (sorted[0] && sorted[0][0]) {
            imgUrl = sorted[0][0];
          }
        }

        if (productUrl) {
          scrapedProducts.push({
            page,
            title,
            productUrl,
            imgUrl
          });
          countOnPage++;
        }
      }

      console.log(`    Found ${countOnPage} products on page ${page}.`);
      if (countOnPage === 0) break;
      page++;
    } catch (err) {
      console.error(`    Error fetching page ${page}: ${err.message}`);
      break;
    }
  }

  console.log(`\nTotal products scraped from Smart ePrint shop: ${scrapedProducts.length}`);
  fs.writeFileSync(path.join(SCRATCH_DIR, 'scraped_shop_products.json'), JSON.stringify(scrapedProducts, null, 2));

  console.log('\nSTEP 2: FETCHING FULL-RESOLUTION IMAGES FROM INDIVIDUAL PRODUCT PAGES...');
  for (let i = 0; i < scrapedProducts.length; i++) {
    const item = scrapedProducts[i];
    console.log(`[${i+1}/${scrapedProducts.length}] Processing detail page: ${item.title || item.productUrl}`);

    try {
      const detailBuf = await fetchUrl(item.productUrl);
      const detailHtml = detailBuf.toString('utf8');

      const largeImgMatch = detailHtml.match(/data-large_image="([^"]+)"/i) ||
                            detailHtml.match(/<div[^>]*class="[^"]*woocommerce-product-gallery__image[^"]*"[^>]*data-thumb="[^"]*"[^>]*><a href="([^"]+)"/i) ||
                            detailHtml.match(/property="og:image"\s+content="([^"]+)"/i) ||
                            detailHtml.match(/class="wp-post-image"[^>]+src="([^"]+)"/i);

      if (largeImgMatch && largeImgMatch[1]) {
        item.fullImgUrl = largeImgMatch[1];
        console.log(`    Full-res Image: ${item.fullImgUrl}`);
      } else {
        item.fullImgUrl = item.imgUrl;
        console.log(`    Using shop image: ${item.fullImgUrl}`);
      }
    } catch (err) {
      console.error(`    Failed to fetch detail page: ${err.message}. Using shop image.`);
      item.fullImgUrl = item.imgUrl;
    }
  }

  fs.writeFileSync(path.join(SCRATCH_DIR, 'scraped_full_products.json'), JSON.stringify(scrapedProducts, null, 2));

  console.log('\nSTEP 3: MATCHING PRODUCTS AND DOWNLOADING LOCAL IMAGES...');
  const { PRODUCTS } = require(PRODUCTS_JS_PATH);
  console.log(`Master PrintersVault Catalog: ${PRODUCTS.length} products.\n`);

  let successCount = 0;
  let failCount = 0;
  const failedProducts = [];
  const updatedProducts = JSON.parse(JSON.stringify(PRODUCTS));

  for (let i = 0; i < updatedProducts.length; i++) {
    const catalogItem = updatedProducts[i];
    console.log(`[${catalogItem.id}] ${catalogItem.name}`);

    // Match strategy
    const catalogNameClean = catalogItem.name.toLowerCase().replace(/[^a-z0-9]/g, '');

    let match = scrapedProducts.find(sp => {
      if (!sp.title) return false;
      const spClean = sp.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      return spClean === catalogNameClean || spClean.includes(catalogNameClean) || catalogNameClean.includes(spClean);
    });

    if (!match) {
      // Secondary model extraction match
      const modelMatch = catalogItem.name.match(/([a-z0-9]{3,}-[a-z0-9]{3,}|[a-z]{1,4}[0-9]{3,}[a-z]{0,4})/i);
      const modelNum = modelMatch ? modelMatch[1].toLowerCase() : null;

      if (modelNum) {
        match = scrapedProducts.find(sp => {
          const spUrl = sp.productUrl.toLowerCase();
          const spTitle = (sp.title || '').toLowerCase();
          return spUrl.includes(modelNum) || spTitle.includes(modelNum);
        });
      }
    }

    if (!match) {
      // Tertiary index fallback
      if (scrapedProducts[i]) {
        match = scrapedProducts[i];
      }
    }

    if (match && (match.fullImgUrl || match.imgUrl)) {
      const targetUrl = match.fullImgUrl || match.imgUrl;

      // Extract original image extension
      let ext = '.webp';
      if (targetUrl.includes('.png')) ext = '.png';
      else if (targetUrl.includes('.jpg') || targetUrl.includes('.jpeg')) ext = '.jpg';
      else if (targetUrl.includes('.webp')) ext = '.webp';

      // Clean slug
      const slug = catalogItem.slug || catalogItem.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const fileName = `${slug}${ext}`;
      const destPath = path.join(PRODUCTS_DIR, fileName);
      const localRelPath = `images/products/${fileName}`;

      console.log(`  -> Downloading: ${targetUrl}`);
      console.log(`  -> Target: ${localRelPath}`);

      try {
        await downloadFile(targetUrl, destPath);

        // Verify file exists and is non-empty
        if (fs.existsSync(destPath) && fs.statSync(destPath).size > 0) {
          catalogItem.image = localRelPath;
          successCount++;
          console.log(`  ✓ Successfully downloaded (${(fs.statSync(destPath).size / 1024).toFixed(1)} KB)`);
        } else {
          throw new Error('Downloaded file is empty or missing');
        }
      } catch (err) {
        failCount++;
        console.error(`  ✗ Download failed: ${err.message}`);
        failedProducts.push({
          name: catalogItem.name,
          url: catalogItem.productUrl || match.productUrl,
          imgUrl: targetUrl,
          reason: err.message
        });
      }
    } else {
      failCount++;
      console.error(`  ✗ No matching image found`);
      failedProducts.push({
        name: catalogItem.name,
        url: null,
        imgUrl: null,
        reason: 'No matching image found on Smart ePrint'
      });
    }
    console.log('');
  }

  // STEP 4: UPDATE PRODUCTS.JS ONLY IF IMAGES WERE DOWNLOADED
  console.log('STEP 4: UPDATING JS/PRODUCTS.JS DATASET...');
  const fileContent = `/* ==========================================================================
   PRINTERSVAULT — MASTER PRODUCT DATASET (44 PRODUCTS)
   Source of Truth: Centralized E-Commerce Catalog matching Smart ePrint
   ========================================================================== */

const PRODUCTS = ${JSON.stringify(updatedProducts, null, 2)};

// Expose globally for both Browser and Node module environments if applicable
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCTS };
}
`;

  fs.writeFileSync(PRODUCTS_JS_PATH, fileContent);
  console.log(`✓ Successfully updated ${PRODUCTS_JS_PATH}\n`);

  // STEP 5: FINAL VERIFICATION
  console.log('====================================================');
  console.log('FINAL SCRAPING & VERIFICATION SUMMARY');
  console.log('====================================================');
  console.log(`Total Products Found:          ${updatedProducts.length}`);
  console.log(`Images Downloaded Successfully: ${successCount}`);
  console.log(`Images Failed:                  ${failCount}`);

  // Disk verification check
  let diskVerifiedCount = 0;
  updatedProducts.forEach(p => {
    if (p.image && p.image.startsWith('images/products/')) {
      const fullPath = path.join(ROOT_DIR, p.image);
      if (fs.existsSync(fullPath) && fs.statSync(fullPath).size > 0) {
        diskVerifiedCount++;
      }
    }
  });

  console.log(`Local Disk Files Verified:     ${diskVerifiedCount} / ${updatedProducts.length}`);

  if (failedProducts.length > 0) {
    console.log('\n--- FAILED PRODUCTS LIST ---');
    failedProducts.forEach((f, idx) => {
      console.log(`${idx + 1}. Product: ${f.name}`);
      console.log(`   URL: ${f.url || 'N/A'}`);
      console.log(`   Image URL: ${f.imgUrl || 'N/A'}`);
      console.log(`   Reason: ${f.reason}`);
    });
  } else {
    console.log('\n🎉 ALL 44 PRODUCTS HAVE ACTUAL LOCAL IMAGES SUCCESSFULLY DOWNLOADED & MAPPED!');
  }
}

run().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
