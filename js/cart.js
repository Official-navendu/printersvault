/* ==========================================================================
   PRINTERSVAULT — SHOPPING CART CONTROLLER
   Exact Reference Redesign & Centralized E-Commerce Data Binding
   ========================================================================== */

let appliedPromoCode = '';

document.addEventListener('DOMContentLoaded', () => {
  const cartContainer = document.getElementById('cartContainer');
  if (!cartContainer) return;

  renderCart();
});

function renderCart() {
  const cartContainer = document.getElementById('cartContainer');
  if (!cartContainer) return;

  const cart = getCart();
  const pagesPrefix = getPagesPrefix();
  const pathPrefix = getPathPrefix();
  const totals = calcCartTotals(cart, appliedPromoCode);

  // 1. EMPTY CART STATE
  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="cart-header-wrap">
        <div>
          <div class="cart-eyebrow"><span class="eyebrow-dash">—</span> YOUR CART</div>
          <h1 class="cart-main-heading">Shopping <span class="text-red">Cart</span></h1>
          <p class="cart-subheading">Review your items and proceed to checkout.</p>
        </div>
        <div class="cart-item-count-badge">
          <div class="cart-badge-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <div>
            <div class="cart-badge-count">0 items</div>
            <div class="cart-badge-sub">in your cart</div>
          </div>
        </div>
      </div>

      <div class="ref-cart-table-card" style="text-align: center; padding: 5rem 2rem;">
        <div style="width: 80px; height: 80px; border-radius: 50%; background-color: #FFF0F1; color: var(--primary); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        </div>
        <h2 style="font-size: 1.75rem; font-weight: 800; margin-bottom: 0.5rem; color: #111;">Your Cart is Empty</h2>
        <p style="color: #666; margin-bottom: 2rem; max-width: 480px; margin-left: auto; margin-right: auto;">
          You haven't added any printing products yet. Explore our wide selection of printers, ink, toner, and accessories!
        </p>
        <a href="shop.html" class="btn-continue-shopping" style="display: inline-flex; padding: 0.85rem 2.25rem; font-size: 1rem;">
          Continue Shopping
        </a>
      </div>
    `;
    return;
  }

  // 2. CART ITEMS ROWS GENERATION
  const cartRowsHTML = cart.map(item => {
    const svgVisual = (typeof generateProductSVG === 'function') ? generateProductSVG(item.type || 'printer', item.modelName || item.name, item.svgAccent || '#C90A0E') : '';
    const itemSubtotal = Number(item.price) * Number(item.quantity);
    const imgSource = item.image ? (item.image.startsWith('http') ? item.image : `${pathPrefix}${item.image}`) : null;

    return `
      <tr>
        <td>
          <div class="ref-cart-item-flex">
            <div class="ref-cart-img-box">
              ${imgSource ? `<img src="${imgSource}" alt="${item.name}">` : svgVisual}
            </div>
            <div>
              <a href="${pagesPrefix}product.html?id=${item.id}" class="ref-cart-item-title">${item.name}</a>
              <span class="ref-cart-sku">SKU: ${item.sku || ('PV-' + item.id)}</span>
              <span class="ref-cart-stock-badge">In Stock</span>
            </div>
          </div>
        </td>
        <td>
          <div class="ref-cart-price">${formatCurrency(item.price)}</div>
        </td>
        <td>
          <div class="ref-qty-capsule">
            <button type="button" class="ref-qty-btn" onclick="handleCartQtyChange('${item.id}', -1)" aria-label="Decrease quantity">-</button>
            <span class="ref-qty-val">${item.quantity}</span>
            <button type="button" class="ref-qty-btn" onclick="handleCartQtyChange('${item.id}', 1)" aria-label="Increase quantity">+</button>
          </div>
        </td>
        <td>
          <div class="ref-cart-subtotal">${formatCurrency(itemSubtotal)}</div>
        </td>
        <td style="text-align: right;">
          <button type="button" class="ref-cart-trash-btn" onclick="handleCartRemove('${item.id}')" title="Remove product" aria-label="Remove product">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  // 3. COMPLETE REFERENCE CART PAGE HTML
  cartContainer.innerHTML = `
    <!-- Top Header -->
    <div class="cart-header-wrap">
      <div>
        <div class="cart-eyebrow"><span class="eyebrow-dash">—</span> YOUR CART</div>
        <h1 class="cart-main-heading">Shopping <span class="text-red">Cart</span></h1>
        <p class="cart-subheading">Review your items and proceed to checkout.</p>
      </div>
      <div class="cart-item-count-badge">
        <div class="cart-badge-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>
        <div>
          <div class="cart-badge-count">${totals.itemCount} ${totals.itemCount === 1 ? 'item' : 'items'}</div>
          <div class="cart-badge-sub">in your cart</div>
        </div>
      </div>
    </div>

    <!-- Main 2-Column Layout -->
    <div class="ref-cart-layout">
      <!-- LEFT COLUMN -->
      <div>
        <!-- Table Card -->
        <div class="ref-cart-table-card">
          <div class="ref-cart-table-wrap">
            <table class="ref-cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                ${cartRowsHTML}
              </tbody>
            </table>
          </div>

          <!-- Bottom Action Buttons -->
          <div class="ref-cart-actions-row">
            <a href="shop.html" class="btn-continue-shopping">
              &larr; Continue Shopping
            </a>
            <button type="button" class="btn-clear-cart" onclick="handleClearCart()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Clear Cart
            </button>
          </div>
        </div>

        <!-- Trust Features Strip -->
        <div class="ref-trust-strip">
          <div class="ref-trust-item">
            <div class="ref-trust-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <div>
              <div class="ref-trust-title">Free Shipping</div>
              <div class="ref-trust-desc">On eligible orders</div>
            </div>
          </div>

          <div class="ref-trust-item">
            <div class="ref-trust-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <div>
              <div class="ref-trust-title">Secure Checkout</div>
              <div class="ref-trust-desc">100% safe &amp; secure</div>
            </div>
          </div>

          <div class="ref-trust-item">
            <div class="ref-trust-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <div>
              <div class="ref-trust-title">Easy Returns</div>
              <div class="ref-trust-desc">Hassle-free process</div>
            </div>
          </div>

          <div class="ref-trust-item">
            <div class="ref-trust-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
              </svg>
            </div>
            <div>
              <div class="ref-trust-title">Dedicated Support</div>
              <div class="ref-trust-desc">We're here to help</div>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: ORDER SUMMARY CARD -->
      <div class="ref-summary-card">
        <h2 class="ref-summary-title">Order Summary</h2>
        <p class="ref-summary-sub">Here's a quick overview of your order.</p>

        <div class="ref-summary-row">
          <span>Subtotal</span>
          <span class="val">${formatCurrency(totals.subtotal)}</span>
        </div>

        ${totals.discount > 0 ? `
          <div class="ref-summary-row" style="color: #10B981;">
            <span>Promo Code (${totals.discountCode})</span>
            <span style="font-weight: 800;">-${formatCurrency(totals.discount)}</span>
          </div>
        ` : ''}

        <div class="ref-summary-row">
          <span>Shipping</span>
          <span>${totals.isFreeShipping ? '<span class="val-green">FREE</span>' : `<span class="val">${formatCurrency(totals.shipping)}</span>`}</span>
        </div>

        <div class="ref-summary-divider"></div>

        <div class="ref-summary-total-row">
          <span class="ref-total-label">Total</span>
          <span class="ref-total-amount">${formatCurrency(totals.total)}</span>
        </div>

        <!-- Promo Box -->
        <div class="ref-promo-box">
          <div class="ref-promo-header">
            <div class="ref-promo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
            </div>
            <div>
              <div class="ref-promo-title">Have a promo code?</div>
              <div class="ref-promo-sub">Enter your code to get a discount.</div>
            </div>
          </div>

          <div class="ref-promo-input-row">
            <input type="text" id="promoInput" class="ref-promo-input" placeholder="TRY SAVE10" value="${appliedPromoCode}">
            <button type="button" class="ref-promo-btn" onclick="applyPromoCode()">Apply</button>
          </div>
          <span class="ref-promo-caption">Use code <strong>SAVE10</strong> for 10% off your order!</span>
        </div>

        <!-- Proceed to Checkout Button -->
        <a href="checkout.html" class="btn-proceed-checkout">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Proceed to Checkout &rarr;
        </a>

        <!-- Free Shipping Qualification Pill -->
        ${totals.isFreeShipping ? `
          <div class="ref-free-ship-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>Your order qualifies for FREE Shipping!</span>
          </div>
        ` : `
          <div class="ref-free-ship-badge" style="background: #FFF8F8; color: #D97706;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>Add <strong>${formatCurrency(299 - totals.subtotal)}</strong> more for <strong>FREE Shipping!</strong></span>
          </div>
        `}
      </div>
    </div>
  `;
}

function handleCartQtyChange(productId, delta) {
  updateCartItemQty(productId, delta);
  renderCart();
}

function handleCartRemove(productId) {
  removeCartItem(productId);
  showToast('Item removed from cart', 'info');
  renderCart();
}

function handleClearCart() {
  if (confirm('Are you sure you want to clear your cart?')) {
    clearCart();
    showToast('Cart cleared', 'info');
    renderCart();
  }
}

function applyPromoCode() {
  const code = document.getElementById('promoInput')?.value.trim().toUpperCase();
  if (code === 'SAVE10') {
    appliedPromoCode = 'SAVE10';
    showToast('10% Discount Applied successfully!', 'success');
  } else if (code === '') {
    appliedPromoCode = '';
    showToast('Promo code removed', 'info');
  } else {
    showToast('Invalid promo code. Try SAVE10', 'info');
  }
  renderCart();
}
