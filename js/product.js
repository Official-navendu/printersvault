/* ==========================================================================
   PRINTERSVAULT — PRODUCT DETAIL CONTROLLER
   Parses ?id=X URL parameter, populates detail DOM, tabs, and related products
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('productDetailContainer');
  if (!container) return; // Only execute on product detail page

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || 'PV-001';
  const product = PRODUCTS.find(p => String(p.id) === String(productId)) || PRODUCTS[0];

  // Set Document Title
  document.title = `${product.name} | PrintersVault`;

  // Render Product Details
  const pathPrefix = getPathPrefix();
  const svgVisual = (typeof generateProductSVG === 'function') ? generateProductSVG(product.type, product.name.replace('PrintersVault ', ''), product.svgAccent) : '';
  const mainVisualHTML = product.image ? `<img src="${pathPrefix}${product.image}" alt="${product.name}" style="max-width: 100%; max-height: 320px; object-fit: contain;">` : svgVisual;
  const starsHTML = '★'.repeat(Math.floor(product.rating)) + (product.rating % 1 >= 0.5 ? '½' : '');
  const isWishlisted = getWishlist().includes(product.id);

  const featuresList = product.features.map(f => `<li>${f}</li>`).join('');

  let specsRows = '';
  if (product.specifications) {
    specsRows = Object.entries(product.specifications).map(([key, val]) => `
      <tr>
        <th>${key}</th>
        <td>${val}</td>
      </tr>
    `).join('');
  }

  container.innerHTML = `
    <!-- Breadcrumb Header -->
    <div class="breadcrumbs" style="margin-bottom: 2rem;">
      <a href="../index.html">Home</a>
      <span>/</span>
      <a href="shop.html">Shop</a>
      <span>/</span>
      <a href="shop.html?category=${encodeURIComponent(product.category)}">${product.category}</a>
      <span>/</span>
      <span style="color: #111; font-weight: 600;">${product.name}</span>
    </div>

    <!-- Main Detail Layout -->
    <div class="product-detail-grid">
      <!-- Left: Visual Gallery -->
      <div class="detail-gallery">
        <div class="gallery-main" style="display: flex; align-items: center; justify-content: center; background: #F8FAFC; border-radius: 12px; padding: 2rem; border: 1px solid #E2E8F0; min-height: 350px;">
          ${mainVisualHTML}
        </div>
      </div>

      <!-- Right: Buying Info -->
      <div class="detail-info">
        <div style="font-size: 0.85rem; font-weight: 700; color: #E30613; text-transform: uppercase; margin-bottom: 0.5rem;">${product.category}</div>
        <h1 class="detail-title">${product.name}</h1>
        <div class="detail-sku">SKU: ${product.sku} | Brand: ${product.brand}</div>

        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
          <div class="stars-wrap" style="color: #FFB800;">${starsHTML}</div>
          <span style="font-size: 0.9rem; font-weight: 700;">${product.rating}</span>
          <span style="font-size: 0.85rem; color: #666;">(${product.reviews} customer reviews)</span>
        </div>

        <div class="detail-price-box">
          <span class="detail-price">${formatCurrency(product.price)}</span>
          ${product.oldPrice ? `<span class="detail-old-price">${formatCurrency(product.oldPrice)}</span>` : ''}
          ${product.discount ? `<span class="badge badge-red">Save ${product.discount}%</span>` : ''}
        </div>

        <p style="color: #444; line-height: 1.7; margin-bottom: 1.75rem;">${product.description}</p>

        <div style="margin-bottom: 1.75rem;">
          <span style="font-size: 0.85rem; font-weight: 700; display: block; margin-bottom: 0.5rem;">QUANTITY:</span>
          <div style="display: flex; gap: 1rem; align-items: center;">
            <div class="qty-picker">
              <button class="qty-btn" onclick="adjustQty(-1)">-</button>
              <input type="number" id="detailQty" class="qty-input" value="1" min="1" max="99">
              <button class="qty-btn" onclick="adjustQty(1)">+</button>
            </div>
            <span style="font-size: 0.85rem; color: #10B981; font-weight: 600;">✓ In Stock &amp; Ready to Ship</span>
          </div>
        </div>

        <div class="detail-actions">
          <button class="btn btn-primary" style="flex: 1;" onclick="handleAddToCartClick('${product.id}')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Add to Cart
          </button>
          <button class="btn btn-secondary" style="flex: 1;" onclick="handleBuyNowClick('${product.id}')">
            Buy Now
          </button>
          <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" style="position: static; width: 44px; height: 44px;" onclick="handleWishlistClick('${product.id}', this)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>

        ${product.compatibility ? `
          <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; padding: 1rem; border-radius: 8px; font-size: 0.875rem; color: #334155;">
            <strong>Compatibility Note:</strong> ${product.compatibility}
          </div>
        ` : ''}
      </div>
    </div>

    <!-- Features & Specs Tabs -->
    <div style="margin-top: 4rem; border-top: 1px solid #E5E5E5; padding-top: 3rem;">
      <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1.5rem;">Product Specifications &amp; Features</h2>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem;">
        <div>
          <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem;">Key Highlights</h3>
          <ul style="padding-left: 1.25rem; line-height: 1.8; color: #444;">
            ${featuresList}
          </ul>
        </div>

        <div>
          <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem;">Technical Specifications</h3>
          <table class="specs-table">
            <tbody>
              ${specsRows}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Related Products -->
    <div style="margin-top: 5rem;">
      <h2 style="font-size: 1.75rem; font-weight: 800; margin-bottom: 2rem;">You Might Also Like</h2>
      <div class="products-grid">
        ${renderRelatedProducts(product)}
      </div>
    </div>
  `;
});

function adjustQty(amount) {
  const input = document.getElementById('detailQty');
  if (input) {
    let current = Number(input.value) || 1;
    current = Math.max(1, Math.min(99, current + amount));
    input.value = current;
  }
}

function handleAddToCartClick(productId) {
  const qtyInput = document.getElementById('detailQty');
  const qty = qtyInput ? Number(qtyInput.value) : 1;
  addToCart(productId, qty);
}

function handleBuyNowClick(productId) {
  const qtyInput = document.getElementById('detailQty');
  const qty = qtyInput ? Number(qtyInput.value) : 1;
  addToCart(productId, qty);
  window.location.href = 'checkout.html';
}

function renderRelatedProducts(currentProduct) {
  const related = PRODUCTS.filter(p => String(p.id) !== String(currentProduct.id) && (p.category === currentProduct.category || p.brand === currentProduct.brand)).slice(0, 4);
  return related.map(product => createProductCardHTML(product)).join('');
}
