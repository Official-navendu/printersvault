/* ==========================================================================
   PRINTERSVAULT — CHECKOUT CONTROLLER
   Handles multi-step form validation, payment mock, and order confirmation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const checkoutForm = document.getElementById('checkoutForm');
  if (!checkoutForm) return; // Only execute on checkout page

  const cart = getCart();

  if (cart.length === 0) {
    const mainWrap = document.getElementById('checkoutMainWrap');
    if (mainWrap) {
      mainWrap.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem;">
          <h2 style="font-size: 1.75rem; margin-bottom: 0.5rem;">Your Cart is Empty</h2>
          <p style="color: #666; margin-bottom: 1.5rem;">Add items to your cart before proceeding to checkout.</p>
          <a href="shop.html" class="btn btn-primary">Return to Shop</a>
        </div>
      `;
    }
    return;
  }

  renderCheckoutSummary();

  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Client-side form validation
    const email = document.getElementById('chkEmail')?.value.trim();
    const firstName = document.getElementById('chkFirstName')?.value.trim();
    const lastName = document.getElementById('chkLastName')?.value.trim();
    const address = document.getElementById('chkAddress')?.value.trim();
    const city = document.getElementById('chkCity')?.value.trim();
    const state = document.getElementById('chkState')?.value.trim();
    const zip = document.getElementById('chkZip')?.value.trim();
    const cardNumber = document.getElementById('chkCardNumber')?.value.trim();

    if (!email || !firstName || !lastName || !address || !city || !state || !zip || !cardNumber) {
      showToast('Please fill in all required checkout fields.', 'info');
      return;
    }

    // Process Mock Order
    const orderNum = 'PV-' + Math.floor(100000 + Math.random() * 900000);
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = subtotal >= 99 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const orderData = {
      orderNumber: orderNum,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      items: [...cart],
      customer: { email, firstName, lastName, address, city, state, zip },
      totals: { subtotal, shipping, tax, total }
    };

    // Save order to past orders in localStorage
    try {
      let orders = JSON.parse(localStorage.getItem('pv_orders')) || [];
      orders.unshift(orderData);
      localStorage.setItem('pv_orders', JSON.stringify(orders));
    } catch (e) {}

    // Clear Cart
    saveCart([]);

    // Render Order Confirmation State
    renderOrderConfirmation(orderData);
  });
});

function renderCheckoutSummary() {
  const cart = getCart();
  const container = document.getElementById('checkoutItemsList');
  const totalsContainer = document.getElementById('checkoutTotalsWrap');
  if (!container || !totalsContainer) return;

  container.innerHTML = cart.map(item => `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.85rem; font-size: 0.9rem;">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <span style="font-weight: 700; color: #111;">${item.quantity}x</span>
        <span>${item.name}</span>
      </div>
      <span style="font-weight: 700; color: #111;">${formatCurrency(item.price * item.quantity)}</span>
    </div>
  `).join('');

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal >= 99 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  totalsContainer.innerHTML = `
    <div class="summary-row"><span>Subtotal</span><span>${formatCurrency(subtotal)}</span></div>
    <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? '<strong style="color:#10B981">FREE</strong>' : formatCurrency(shipping)}</span></div>
    <div class="summary-row"><span>Estimated Tax</span><span>${formatCurrency(tax)}</span></div>
    <div class="summary-row summary-total"><span>Total</span><span>${formatCurrency(total)}</span></div>
  `;
}

function renderOrderConfirmation(order) {
  const mainWrap = document.getElementById('checkoutMainWrap');
  if (!mainWrap) return;

  const itemsListHTML = order.items.map(i => `
    <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #E5E5E5; font-size: 0.925rem;">
      <span>${i.name} (x${i.quantity})</span>
      <span style="font-weight: 700;">${formatCurrency(i.price * i.quantity)}</span>
    </div>
  `).join('');

  mainWrap.innerHTML = `
    <div style="max-width: 680px; margin: 0 auto; padding: 3rem 1.5rem; text-align: center;">
      <div style="width: 64px; height: 64px; border-radius: 50%; background-color: #ECFDF5; color: #10B981; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>

      <h1 style="font-size: 2.25rem; font-weight: 800; margin-bottom: 0.5rem; color: #111;">Order Placed Successfully!</h1>
      <p style="color: #666; font-size: 1.05rem; margin-bottom: 2rem;">Thank you for shopping with PrintersVault. Your order confirmation is below.</p>

      <div style="background-color: #F6F6F6; border: 1px solid #E5E5E5; border-radius: 8px; padding: 1.75rem; text-align: left; margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 1.25rem; padding-bottom: 1rem; border-bottom: 1.5px solid #DDD;">
          <div>
            <div style="font-size: 0.8rem; color: #888; text-transform: uppercase; font-weight: 700;">ORDER NUMBER</div>
            <div style="font-size: 1.25rem; font-weight: 800; color: #E30613;">#${order.orderNumber}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.8rem; color: #888; text-transform: uppercase; font-weight: 700;">DATE</div>
            <div style="font-weight: 700;">${order.date}</div>
          </div>
        </div>

        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">Items Summary</h3>
        ${itemsListHTML}

        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1.5px solid #DDD;">
          <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 1.2rem;">
            <span>Total Paid</span>
            <span style="color: #E30613;">${formatCurrency(order.totals.total)}</span>
          </div>
        </div>

        <div style="margin-top: 1.5rem;">
          <h4 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 0.35rem;">Shipping Address</h4>
          <p style="font-size: 0.9rem; color: #444;">
            ${order.customer.firstName} ${order.customer.lastName}<br>
            ${order.customer.address}<br>
            ${order.customer.city}, ${order.customer.state} ${order.customer.zip}
          </p>
        </div>
      </div>

      <div style="display: flex; justify-content: center; gap: 1rem;">
        <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
        <a href="account.html" class="btn btn-outline">View Order History</a>
      </div>
    </div>
  `;
}
