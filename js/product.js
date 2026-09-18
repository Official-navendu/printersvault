/* ==========================================================================
   PRINTERSVAULT — PRODUCT DETAIL CONTROLLER
   Exact Reference Redesign & Centralized Data Binding
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('productDetailContainer');
  if (!container) return; // Only execute on product detail page

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  // Handle Invalid or Missing Product ID
  if (!productId) {
    renderProductNotFound(container);
    return;
  }

  const product = PRODUCTS.find(p => String(p.id).toLowerCase() === String(productId).toLowerCase());

  if (!product) {
    renderProductNotFound(container);
    return;
  }

  // Set Document Title
  document.title = `${product.name} | PrintersVault`;

  // Render Product Details
  renderProductDetails(container, product);
});

function renderProductNotFound(container) {
  document.title = `Product Not Found | PrintersVault`;
  container.innerHTML = `
    <div style="text-align: center; padding: 5rem 1rem;">
      <div style="width: 80px; height: 80px; border-radius: 50%; background-color: #FFF0F1; color: var(--primary); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h1 style="font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; color: #111;">Product Not Found</h1>
      <p style="color: #666; margin-bottom: 2rem; max-width: 480px; margin-left: auto; margin-right: auto;">
        The requested printer or accessory could not be found in our catalog. Please return to our shop to explore available models.
      </p>
      <a href="shop.html" class="btn btn-primary" style="padding: 0.85rem 2.25rem; font-weight: 800; font-size: 1rem;">
        &larr; Back to Shop
      </a>
    </div>
  `;
}

function renderProductDetails(container, product) {
  const pathPrefix = getPathPrefix();
  const svgVisual = (typeof generateProductSVG === 'function') ? generateProductSVG(product.type, product.name.replace('PrintersVault ', ''), product.svgAccent) : '';
  const imgSource = product.image ? (product.image.startsWith('http') ? product.image : `${pathPrefix}${product.image}`) : null;
  const starsHTML = '★'.repeat(Math.floor(product.rating || 5)) + ((product.rating || 5) % 1 >= 0.5 ? '½' : '');
  const isWishlisted = (typeof getWishlist === 'function') ? getWishlist().includes(product.id) : false;

  // Features checkmarks
  const featuresList = (product.features || [
    "Print, scan, copy and fax capabilities",
    "Wireless and mobile device printing integration",
    "Automatic document feeder & duplex printing",
    "High-resolution professional print output",
    "Energy efficient, compact desktop footprint"
  ]).map(f => `
    <li class="pdetail-ov-checkitem">
      <span class="pdetail-check-icon">✓</span>
      <span>${f}</span>
    </li>
  `).join('');

  // Specs table rows
  let specsRows = '';
  if (product.specifications) {
    specsRows = Object.entries(product.specifications).map(([key, val]) => `
      <tr>
        <th>${key}</th>
        <td>${val}</td>
      </tr>
    `).join('');
  } else {
    specsRows = `
      <tr><th>Print Technology</th><td>${product.printTech || 'Inkjet / Laser'}</td></tr>
      <tr><th>Brand</th><td>${product.brand || 'PrintersVault'}</td></tr>
      <tr><th>Category</th><td>${product.category || 'Printers'}</td></tr>
      <tr><th>Functions</th><td>Print, Scan, Copy</td></tr>
      <tr><th>Connectivity</th><td>Wi-Fi, USB 2.0, Mobile App</td></tr>
    `;
  }

  // Smart Related Products Recommendations (Excludes current product, max 4 items)
  const relatedProducts = getSmartRecommendations(product);
  const relatedHTML = relatedProducts.map(p => createProductCardHTML(p)).join('');

  const savingsAmount = product.oldPrice ? (product.oldPrice - product.price).toFixed(2) : null;
  const savingsPercent = product.discount || (product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : null);

  container.innerHTML = `
    <!-- Breadcrumb Header -->
    <div style="margin-bottom: 2rem; font-size: 0.875rem; color: #64748B; font-weight: 600;">
      <a href="../index.html" style="text-decoration:none; color:inherit;">Home</a>
      <span style="margin: 0 0.4rem; color: #CBD5E1;">/</span>
      <a href="shop.html" style="text-decoration:none; color:inherit;">Shop</a>
      <span style="margin: 0 0.4rem; color: #CBD5E1;">/</span>
      <a href="shop.html?category=${encodeURIComponent(product.category)}" style="text-decoration:none; color:inherit;">${product.category}</a>
      <span style="margin: 0 0.4rem; color: #CBD5E1;">/</span>
      <span style="color: #111111; font-weight: 800;">${product.name}</span>
    </div>

    <!-- 1. HERO 2-COLUMN GRID -->
    <div class="pdetail-hero-grid">
      <!-- LEFT COLUMN: GALLERY STAGE & QUICK CAPABILITIES -->
      <div>
        <div class="pdetail-gallery-wrap">
          <!-- Thumbnail Strip -->
          <div class="pdetail-thumb-strip">
            <div class="pdetail-thumb-box active" onclick="switchDetailImage(this, '${imgSource || ''}')">
              ${imgSource ? `<img src="${imgSource}" alt="${product.name}">` : svgVisual}
            </div>
            <div class="pdetail-thumb-box" onclick="switchDetailImage(this, '${imgSource || ''}')">
              ${imgSource ? `<img src="${imgSource}" alt="${product.name}" style="transform: scaleX(-1);">` : svgVisual}
            </div>
            <div class="pdetail-thumb-box" onclick="switchDetailImage(this, '${imgSource || ''}')">
              ${imgSource ? `<img src="${imgSource}" alt="${product.name}" style="filter: brightness(0.97);">` : svgVisual}
            </div>
            <div class="pdetail-thumb-box" onclick="switchDetailImage(this, '${imgSource || ''}')">
              <span style="font-size: 1.2rem; color: var(--primary);">▶</span>
            </div>
          </div>

          <!-- Main Stage -->
          <div class="pdetail-stage-box">
            <button class="pdetail-zoom-btn" title="Zoom image" aria-label="Zoom image">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </button>
            <div id="pdetailMainImgBox">
              ${imgSource ? `<img id="pdetailMainImg" src="${imgSource}" alt="${product.name}">` : svgVisual}
            </div>
          </div>
        </div>

        <!-- Quick Capability Bubbles -->
        <div class="pdetail-caps-row">
          <div class="pdetail-cap-item">
            <div class="pdetail-cap-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            </div>
            <span class="pdetail-cap-label">Print</span>
          </div>

          <div class="pdetail-cap-item">
            <div class="pdetail-cap-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="7" y1="8" x2="17" y2="8"></line><line x1="7" y1="12" x2="17" y2="12"></line><line x1="7" y1="16" x2="13" y2="16"></line></svg>
            </div>
            <span class="pdetail-cap-label">Scan</span>
          </div>

          <div class="pdetail-cap-item">
            <div class="pdetail-cap-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="2" width="14" height="14" rx="2" ry="2"></rect><path d="M4 6H2v14a2 2 0 0 0 2 2h14v-2"></path></svg>
            </div>
            <span class="pdetail-cap-label">Copy</span>
          </div>

          <div class="pdetail-cap-item">
            <div class="pdetail-cap-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
            </div>
            <span class="pdetail-cap-label">Wireless</span>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: PRODUCT INFO & PURCHASE CONTROLS -->
      <div class="pdetail-info-panel">
        <span class="pdetail-badge-tag">${product.badge || 'Best Seller'}</span>
        <h1 class="pdetail-title">${product.name}</h1>
        <div class="pdetail-meta-line">SKU: <strong>${product.sku || product.id}</strong> | Brand: <strong>${product.brand}</strong></div>

        <div class="pdetail-rating-row">
          <span class="pdetail-stars">${starsHTML}</span>
          <span class="pdetail-rating-num">${product.rating || '4.8'}</span>
          <span class="pdetail-reviews-count">(${product.reviews || '320'} reviews)</span>
          <a href="#reviews" class="pdetail-review-link" onclick="switchProductTab('reviews')">Write a review</a>
        </div>

        <p class="pdetail-short-desc">${product.description}</p>

        <!-- Price Row -->
        <div class="pdetail-price-row">
          <span class="pdetail-main-price">${formatCurrency(product.price)}</span>
          ${product.oldPrice ? `<span class="pdetail-old-price">${formatCurrency(product.oldPrice)}</span>` : ''}
          ${savingsPercent ? `<span class="pdetail-save-badge">Save $${savingsAmount || '30.00'} (${savingsPercent}%)</span>` : ''}
        </div>

        <!-- Stock & Shipping Note -->
        <div class="pdetail-stock-shipping-row">
          <span class="pdetail-stock-pill">In Stock</span>
          <span class="pdetail-ship-note">Free Shipping on orders over $299</span>
        </div>

        <!-- Action Row 1: Quantity & Add to Cart -->
        <div class="pdetail-action-row-1">
          <div class="ref-qty-capsule" style="background: #F1F5F9; border-radius: 10px; padding: 4px;">
            <button type="button" class="ref-qty-btn" onclick="adjustDetailQty(-1)" aria-label="Decrease quantity">-</button>
            <span id="detailQtyVal" class="ref-qty-val">1</span>
            <button type="button" class="ref-qty-btn" onclick="adjustDetailQty(1)" aria-label="Increase quantity">+</button>
          </div>

          <button type="button" class="btn-add-to-cart-lg" onclick="handleDetailAddToCart('${product.id}')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            Add to Cart
          </button>
        </div>

        <!-- Action Row 2: Wishlist & Compare -->
        <div class="pdetail-action-row-2">
          <button type="button" class="btn-pdetail-sec ${isWishlisted ? 'active' : ''}" onclick="handleDetailWishlist('${product.id}', this)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            Add to Wishlist
          </button>

          <button type="button" class="btn-pdetail-sec" onclick="showToast('Added to Product Comparison!', 'info')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            Compare
          </button>
        </div>

        <!-- Trust Micro Strip -->
        <div class="pdetail-trust-strip">
          <div class="pdetail-trust-item">
            <div class="pdetail-trust-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            </div>
            <div>
              <div class="pdetail-trust-title">Free Shipping</div>
              <div class="pdetail-trust-sub">On eligible orders</div>
            </div>
          </div>

          <div class="pdetail-trust-item">
            <div class="pdetail-trust-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <div>
              <div class="pdetail-trust-title">1 Year Warranty</div>
              <div class="pdetail-trust-sub">Manufacturer warranty</div>
            </div>
          </div>

          <div class="pdetail-trust-item">
            <div class="pdetail-trust-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
            </div>
            <div>
              <div class="pdetail-trust-title">Dedicated Support</div>
              <div class="pdetail-trust-sub">We're here to help</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. HIGHLIGHTS STRIP (SECTION 2) -->
    <div class="pdetail-highlights-strip">
      <div class="pdetail-hl-item">
        <div class="pdetail-hl-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
        </div>
        <div>
          <div class="pdetail-hl-title">High-Quality Prints</div>
          <div class="pdetail-hl-desc">Vibrant and sharp output</div>
        </div>
      </div>

      <div class="pdetail-hl-item">
        <div class="pdetail-hl-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
        </div>
        <div>
          <div class="pdetail-hl-title">Wireless Connectivity</div>
          <div class="pdetail-hl-desc">Print from anywhere</div>
        </div>
      </div>

      <div class="pdetail-hl-item">
        <div class="pdetail-hl-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="7" y1="8" x2="17" y2="8"></line><line x1="7" y1="12" x2="17" y2="12"></line><line x1="7" y1="16" x2="13" y2="16"></line></svg>
        </div>
        <div>
          <div class="pdetail-hl-title">All-In-One Functionality</div>
          <div class="pdetail-hl-desc">Print, scan, copy, fax</div>
        </div>
      </div>

      <div class="pdetail-hl-item">
        <div class="pdetail-hl-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><line x1="12" y1="6" x2="12" y2="18"></line></svg>
        </div>
        <div>
          <div class="pdetail-hl-title">Cost Efficient</div>
          <div class="pdetail-hl-desc">High-yield ink options</div>
        </div>
      </div>
    </div>

    <!-- 3. TABS AREA (SECTION 3) -->
    <div class="pdetail-tabs-wrapper">
      <div class="pdetail-tabs-nav">
        <button type="button" class="pdetail-tab-btn active" onclick="switchProductTab('overview', this)">Overview</button>
        <button type="button" class="pdetail-tab-btn" onclick="switchProductTab('specs', this)">Specifications</button>
        <button type="button" class="pdetail-tab-btn" onclick="switchProductTab('inbox', this)">In the Box</button>
        <button type="button" class="pdetail-tab-btn" onclick="switchProductTab('reviews', this)">Reviews (${product.reviews || 320})</button>
      </div>

      <!-- Tab 1: Overview -->
      <div id="tab-overview" class="pdetail-tab-panel active">
        <div class="pdetail-overview-grid">
          <div>
            <h3 class="pdetail-ov-heading">Reliable Performance for Everyday Printing</h3>
            <p class="pdetail-ov-desc">${product.description}</p>
            <ul class="pdetail-ov-checklist">
              ${featuresList}
            </ul>
          </div>

          <div class="pdetail-lifestyle-card">
            ${imgSource ? `<img src="${imgSource}" alt="${product.name}">` : svgVisual}
            <div class="pdetail-lifestyle-overlay">
              <h4>Smart Printing for a Smarter Tomorrow</h4>
              <div class="pdetail-lifestyle-bar"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 2: Specifications -->
      <div id="tab-specs" class="pdetail-tab-panel">
        <h3 class="pdetail-ov-heading">Technical Specifications</h3>
        <table class="pdetail-specs-table">
          <tbody>
            ${specsRows}
          </tbody>
        </table>
      </div>

      <!-- Tab 3: In the Box -->
      <div id="tab-inbox" class="pdetail-tab-panel">
        <h3 class="pdetail-ov-heading">What's In The Box</h3>
        <ul style="line-height: 2; color: #475569; font-weight: 600; padding-left: 1.25rem;">
          <li>1x ${product.name} Main Unit</li>
          <li>1x Starter Ink / Toner Cartridge Set</li>
          <li>1x Power Cord &amp; AC Adapter</li>
          <li>1x Quick Setup Guide &amp; User Manual</li>
          <li>1x Installation CD-ROM &amp; Warranty Documentation</li>
        </ul>
      </div>

      <!-- Tab 4: Reviews -->
      <div id="tab-reviews" class="pdetail-tab-panel">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
          <div>
            <h3 class="pdetail-ov-heading" style="margin: 0;">Customer Reviews (${product.reviews || 320})</h3>
            <div style="color: #FFB800; font-size: 1.2rem; font-weight: 800; margin-top: 0.35rem;">
              ${starsHTML} <span style="color: #111; font-size: 1rem; margin-left: 0.5rem;">${product.rating || '4.8'} out of 5</span>
            </div>
          </div>
          <button type="button" class="btn btn-outline btn-sm" onclick="showToast('Review form opened!', 'info')">Write a Review</button>
        </div>
        <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <strong style="color: #111;">John D. — Verified Buyer</strong>
            <span style="color: #FFB800;">★★★★★</span>
          </div>
          <p style="color: #475569; margin: 0; font-size: 0.9rem;">Excellent print quality and super easy wireless setup with my laptop and mobile phone!</p>
        </div>
      </div>
    </div>

    <!-- 4. YOU MAY ALSO LIKE (RECOMMENDED PRODUCTS) -->
    <section class="pdetail-related-section" style="margin-top: 5rem; padding-top: 3.5rem; border-top: 1px solid #E5E7EB;">
      <div class="pdetail-related-header" style="margin-bottom: 2rem;">
        <div>
          <h2 style="font-family: var(--font-main); font-size: 1.65rem; font-weight: 700; color: #1A1A1A; margin: 0 0 0.35rem 0; letter-spacing: -0.01em;">You May Also Like</h2>
          <p style="font-family: var(--font-main); font-size: 0.925rem; color: #666666; margin: 0;">Explore more printers and accessories</p>
        </div>
      </div>

      <div class="related-products-grid">
        ${relatedHTML}
      </div>
    </section>
  `;
}

// Quantity Adjuster Helper
let currentDetailQty = 1;

function adjustDetailQty(delta) {
  currentDetailQty = Math.max(1, Math.min(99, currentDetailQty + delta));
  const qtyValEl = document.getElementById('detailQtyVal');
  if (qtyValEl) {
    qtyValEl.textContent = currentDetailQty;
  }
}

// Add to Cart Click Handler
function handleDetailAddToCart(productId) {
  if (typeof addToCart === 'function') {
    addToCart(productId, currentDetailQty);
  }
}

// Wishlist Handler
function handleDetailWishlist(productId, btnEl) {
  if (typeof toggleWishlist === 'function') {
    const isAdded = toggleWishlist(productId);
    if (btnEl) {
      btnEl.classList.toggle('active', isAdded);
    }
  }
}

// Image Switcher
function switchDetailImage(thumbEl, newSrc) {
  const allThumbs = document.querySelectorAll('.pdetail-thumb-box');
  allThumbs.forEach(t => t.classList.remove('active'));
  if (thumbEl) thumbEl.classList.add('active');

  const mainImg = document.getElementById('pdetailMainImg');
  if (mainImg && newSrc) {
    mainImg.src = newSrc;
  }
}

// Tab Switcher
function switchProductTab(tabName, btnEl) {
  const allTabs = document.querySelectorAll('.pdetail-tab-btn');
  allTabs.forEach(t => t.classList.remove('active'));
  if (btnEl) {
    btnEl.classList.add('active');
  }

  const allPanels = document.querySelectorAll('.pdetail-tab-panel');
  allPanels.forEach(p => p.classList.remove('active'));

  const targetPanel = document.getElementById(`tab-${tabName}`);
  if (targetPanel) {
    targetPanel.classList.add('active');
  }
}

// Smart Recommendation Algorithm
function getSmartRecommendations(currentProduct) {
  if (!PRODUCTS || !Array.isArray(PRODUCTS) || !currentProduct) return [];

  // Exclude current product
  const candidates = PRODUCTS.filter(p => String(p.id).toLowerCase() !== String(currentProduct.id).toLowerCase());

  // Score candidate items for relevance
  const scored = candidates.map(p => {
    let score = 0;
    
    // Category match (+10)
    if (p.category && currentProduct.category && p.category.toLowerCase() === currentProduct.category.toLowerCase()) {
      score += 10;
    }
    // Brand match (+5)
    if (p.brand && currentProduct.brand && p.brand.toLowerCase() === currentProduct.brand.toLowerCase()) {
      score += 5;
    }
    // Print technology match (+3)
    if (p.printTech && currentProduct.printTech && p.printTech.toLowerCase() === currentProduct.printTech.toLowerCase()) {
      score += 3;
    }
    // Cross-category printer <-> accessory match (+4)
    const isPrinter = (cat) => cat && (cat.includes('Printer') || cat.includes('Laser') || cat.includes('Inkjet'));
    const isAccessory = (cat) => cat && (cat.includes('Ink') || cat.includes('Toner') || cat.includes('Accessories'));

    if (isPrinter(currentProduct.category) && isAccessory(p.category)) {
      score += 4;
    } else if (isAccessory(currentProduct.category) && isPrinter(p.category)) {
      score += 4;
    }

    return { product: p, score };
  });

  // Sort candidates by score descending
  scored.sort((a, b) => b.score - a.score);

  // Return exactly top 4 items
  return scored.slice(0, 4).map(item => item.product);
}

