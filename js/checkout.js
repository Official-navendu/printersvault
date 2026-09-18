/* ==========================================================================
   PRINTERSVAULT — CHECKOUT CONTROLLER (COD PAYMENT & ORDER PLACEMENT)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const checkoutForm = document.getElementById('checkoutForm');
  if (!checkoutForm) return; // Only execute on checkout page

  const cart = getCart();

  if (cart.length === 0) {
    const mainWrap = document.getElementById('checkoutMainWrap');
    if (mainWrap) {
      mainWrap.innerHTML = `
        <div class="empty-checkout-state" style="text-align: center; padding: 5rem 1rem;">
          <div style="width: 80px; height: 80px; border-radius: 50%; background-color: var(--surface); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.75">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <h2 style="font-size: 1.75rem; font-weight: 800; margin-bottom: 0.5rem; color: var(--text-dark);">Your Cart is Empty</h2>
          <p style="color: var(--text-muted); margin-bottom: 2rem;">Add items to your cart before proceeding to checkout.</p>
          <a href="shop.html" class="btn btn-primary" style="padding: 0.85rem 2rem; font-weight: 700;">Return to Shop</a>
        </div>
      `;
    }
    return;
  }

  renderCheckoutSummary();

  let isSubmitting = false;

  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Field extractions
    const emailInput = document.getElementById('chkEmail');
    const firstNameInput = document.getElementById('chkFirstName');
    const lastNameInput = document.getElementById('chkLastName');
    const addressInput = document.getElementById('chkAddress');
    const cityInput = document.getElementById('chkCity');
    const stateInput = document.getElementById('chkState');
    const zipInput = document.getElementById('chkZip');

    const email = emailInput ? emailInput.value.trim() : '';
    const firstName = firstNameInput ? firstNameInput.value.trim() : '';
    const lastName = lastNameInput ? lastNameInput.value.trim() : '';
    const address = addressInput ? addressInput.value.trim() : '';
    const city = cityInput ? cityInput.value.trim() : '';
    const state = stateInput ? stateInput.value.trim() : '';
    const zip = zipInput ? zipInput.value.trim() : '';

    if (!email || !firstName || !lastName || !address || !city || !state || !zip) {
      if (typeof showToast === 'function') {
        showToast('Please fill in all required shipping address fields.', 'info');
      }
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      if (typeof showToast === 'function') {
        showToast('Please enter a valid email address.', 'info');
      }
      return;
    }

    const currentCart = getCart();
    if (currentCart.length === 0) {
      if (typeof showToast === 'function') {
        showToast('Your cart is empty.', 'info');
      }
      return;
    }

    // Prevent duplicate submission
    isSubmitting = true;
    const submitBtn = checkoutForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
      submitBtn.style.cursor = 'not-allowed';
      submitBtn.innerHTML = '⏳ Processing Order...';
    }

    // Format Unique Order ID: PV-YYYYMMDD-XXXX
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const orderId = `PV-${year}${month}${day}-${randomCode}`;

    const totals = calcCartTotals(currentCart);

    const orderData = {
      orderNumber: randomCode,
      orderId: orderId,
      date: now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      paymentMethod: 'Cash on Delivery (COD)',
      status: 'Order Placed',
      items: [...currentCart],
      customer: { email, firstName, lastName, address, city, state, zip },
      totals: { ...totals }
    };

    // 1. Save order in primary and legacy keys
    saveOrder(orderData);

    // 2. Set latest order ID in localStorage for Order Success Page
    try {
      localStorage.setItem('pv_latest_order_id', orderId);
    } catch (err) {}

    // 3. Preserve guest profile if not logged in
    try {
      if (!localStorage.getItem('pv_user')) {
        localStorage.setItem('pv_user', JSON.stringify({
          name: `${firstName} ${lastName}`,
          email: email
        }));
      }
    } catch (err) {}

    // 4. Clear cart & update counters
    clearCart();
    if (typeof updateCartCount === 'function') {
      updateCartCount();
    }

    // 5. Redirect to dedicated order success page
    setTimeout(() => {
      window.location.href = 'order-success.html';
    }, 400);
  });
});

function renderCheckoutSummary() {
  const cart = getCart();
  const container = document.getElementById('checkoutItemsList');
  const totalsContainer = document.getElementById('checkoutTotalsWrap');
  if (!container || !totalsContainer) return;

  const totals = calcCartTotals(cart);
  const pathPrefix = getPathPrefix();

  container.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.quantity;
    const imgSource = item.image ? (item.image.startsWith('http') ? item.image : `${pathPrefix}${item.image}`) : null;

    return `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.85rem; font-size: 0.9rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem; flex: 1; padding-right: 0.5rem;">
          <div style="width: 44px; height: 44px; background: #FFF; border: 1px solid var(--border); border-radius: 6px; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; padding: 2px;">
            ${imgSource ? `<img src="${imgSource}" alt="${item.name}" style="max-width: 100%; max-height: 100%; object-fit: contain;">` : '<span style="font-size:10px; font-weight:700; color:var(--primary);">PV</span>'}
          </div>
          <div>
            <div style="font-weight: 700; color: var(--text-dark); font-size: 0.875rem; line-height: 1.2;">${item.name}</div>
            <div style="font-size: 0.775rem; color: var(--text-muted); margin-top: 2px;">Qty: ${item.quantity} × ${formatCurrency(item.price)}</div>
          </div>
        </div>
        <span style="font-weight: 700; color: var(--text-dark); white-space: nowrap;">${formatCurrency(itemTotal)}</span>
      </div>
    `;
  }).join('');

  totalsContainer.innerHTML = `
    <div style="display: flex; justify-content: space-between; margin-bottom: 0.6rem; font-size: 0.9rem; color: #4B5563;">
      <span>Subtotal</span>
      <span style="font-weight: 700; color: var(--text-dark);">${formatCurrency(totals.subtotal)}</span>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 0.6rem; font-size: 0.9rem; color: #4B5563;">
      <span>Shipping</span>
      <span>${totals.isFreeShipping ? '<strong style="color: #10B981;">FREE</strong>' : `<strong style="color: var(--text-dark);">${formatCurrency(totals.shipping)}</strong>`}</span>
    </div>
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 0.85rem; padding-top: 0.85rem; border-top: 1.5px solid var(--border); font-size: 1.15rem; font-weight: 800; color: var(--text-dark);">
      <span>Total</span>
      <span style="color: var(--primary); font-size: 1.3rem;">${formatCurrency(totals.total)}</span>
    </div>
  `;
}
