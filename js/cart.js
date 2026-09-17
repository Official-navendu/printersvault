/* ==========================================================================
   PRINTERSVAULT — SHOPPING CART CONTROLLER
   Renders cart table, manages item quantities, subtotal calculations & discounts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const cartContainer = document.getElementById('cartContainer');
  if (!cartContainer) return; // Only execute on cart page

  renderCart();
});

let appliedDiscount = 0;

function renderCart() {
  const cartContainer = document.getElementById('cartContainer');
  if (!cartContainer) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div style="text-align: center; padding: 5rem 1rem;">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="1.5" style="margin-bottom: 1rem;">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <h2 style="font-size: 1.75rem; font-weight: 800; margin-bottom: 0.5rem; color: #111;">Your cart is empty</h2>
        <p style="color: #666; margin-bottom: 2rem;">Looks like you haven't added any printers or accessories yet.</p>
        <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
      </div>
    `;
    return;
  }

  const pagesPrefix = getPagesPrefix();
  const pathPrefix = getPathPrefix();

  const cartRowsHTML = cart.map(item => {
    const svgVisual = generateProductSVG(item.type || 'printer', item.modelName || item.name, item.svgAccent || '#E30613');
    const itemSubtotal = item.price * item.quantity;

    return `
      <tr>
        <td>
          <div class="cart-item-info">
            <div class="cart-item-img">
              ${item.image ? `<img src="${pathPrefix}${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: contain;">` : svgVisual}
            </div>
            <div>
              <a href="${pagesPrefix}product.html?id=${item.id}" style="font-weight: 700; color: #111; display: block; margin-bottom: 0.2rem;">${item.name}</a>
              <span style="font-size: 0.775rem; color: #888;">SKU: ${item.sku}</span>
            </div>
          </div>
        </td>
        <td style="font-weight: 600;">${formatCurrency(item.price)}</td>
        <td>
          <div class="qty-picker">
            <button class="qty-btn" onclick="updateCartItemQty('${item.id}', ${item.quantity - 1})">-</button>
            <input type="number" class="qty-input" value="${item.quantity}" readonly>
            <button class="qty-btn" onclick="updateCartItemQty('${item.id}', ${item.quantity + 1})">+</button>
          </div>
        </td>
        <td style="font-weight: 800; color: #E30613;">${formatCurrency(itemSubtotal)}</td>
        <td style="text-align: right;">
          <button style="background: none; border: none; color: #9CA3AF; cursor: pointer; padding: 0.5rem;" onclick="removeCartItem('${item.id}')" title="Remove item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  // Calculations
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal >= 99 ? 0 : 9.99;
  const discountAmount = subtotal * appliedDiscount;
  const tax = (subtotal - discountAmount) * 0.08; // 8% tax
  const total = subtotal - discountAmount + shipping + tax;

  cartContainer.innerHTML = `
    <h1 style="font-size: 2.25rem; font-weight: 800; margin-bottom: 2rem;">Shopping Cart</h1>

    <div class="cart-layout">
      <!-- Left Table -->
      <div>
        <table class="cart-table">
          <thead>
            <tr>
              <th>PRODUCT</th>
              <th>PRICE</th>
              <th>QUANTITY</th>
              <th>SUBTOTAL</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${cartRowsHTML}
          </tbody>
        </table>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <a href="shop.html" class="btn btn-outline btn-sm">← Continue Shopping</a>
          <button class="btn btn-outline btn-sm" onclick="clearCart()">Clear Cart</button>
        </div>
      </div>

      <!-- Right Summary Panel -->
      <div class="summary-card">
        <h2 class="summary-title">Order Summary</h2>

        <div class="summary-row">
          <span>Subtotal</span>
          <span>${formatCurrency(subtotal)}</span>
        </div>

        ${appliedDiscount > 0 ? `
          <div class="summary-row" style="color: #10B981; font-weight: 600;">
            <span>Promo Discount (10%)</span>
            <span>-${formatCurrency(discountAmount)}</span>
          </div>
        ` : ''}

        <div class="summary-row">
          <span>Shipping</span>
          <span>${shipping === 0 ? '<strong style="color: #10B981;">FREE</strong>' : formatCurrency(shipping)}</span>
        </div>

        <div class="summary-row">
          <span>Estimated Tax (8%)</span>
          <span>${formatCurrency(tax)}</span>
        </div>

        <!-- Promo Input -->
        <div style="margin: 1.25rem 0;">
          <div style="display: flex; gap: 0.5rem;">
            <input type="text" id="promoInput" class="form-control" placeholder="Promo code (SAVE10)" style="font-size: 0.85rem;" value="${appliedDiscount > 0 ? 'SAVE10' : ''}">
            <button class="btn btn-secondary btn-sm" onclick="applyPromoCode()">Apply</button>
          </div>
        </div>

        <div class="summary-row summary-total">
          <span>Total</span>
          <span>${formatCurrency(total)}</span>
        </div>

        <a href="checkout.html" class="btn btn-primary btn-block" style="margin-top: 1.5rem; padding: 1rem;">
          Proceed to Checkout →
        </a>

        ${shipping > 0 ? `
          <div style="font-size: 0.8rem; color: #666; text-align: center; margin-top: 1rem;">
            Add <strong>${formatCurrency(99 - subtotal)}</strong> more to get <strong>FREE Shipping!</strong>
          </div>
        ` : `
          <div style="font-size: 0.8rem; color: #10B981; font-weight: 600; text-align: center; margin-top: 1rem;">
            ✓ Your order qualifies for FREE Shipping!
          </div>
        `}
      </div>
    </div>
  `;
}

function updateCartItemQty(productId, newQty) {
  if (newQty <= 0) {
    removeCartItem(productId);
    return;
  }
  let cart = getCart();
  const item = cart.find(i => String(i.id) === String(productId));
  if (item) {
    item.quantity = newQty;
    saveCart(cart);
    renderCart();
  }
}

function removeCartItem(productId) {
  let cart = getCart();
  cart = cart.filter(i => String(i.id) !== String(productId));
  saveCart(cart);
  showToast('Item removed from cart', 'info');
  renderCart();
}

function clearCart() {
  if (confirm('Are you sure you want to clear your cart?')) {
    saveCart([]);
    showToast('Cart cleared', 'info');
    renderCart();
  }
}

function applyPromoCode() {
  const code = document.getElementById('promoInput')?.value.trim().toUpperCase();
  if (code === 'SAVE10') {
    appliedDiscount = 0.10;
    showToast('10% Discount Applied!', 'success');
    renderCart();
  } else {
    showToast('Invalid Promo Code. Try SAVE10', 'info');
  }
}
