/* ==========================================================================
   PRINTERSVAULT — ORDER SUCCESS CONTROLLER
   Renders real order confirmation data or graceful fallback state
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  renderOrderSuccessPage();
});

function renderOrderSuccessPage() {
  const container = document.getElementById('orderSuccessContainer');
  if (!container) return;

  const orders = (typeof getOrders === 'function') ? getOrders() : [];
  let latestOrderId = null;
  try {
    latestOrderId = localStorage.getItem('pv_latest_order_id');
  } catch (e) {}

  let targetOrder = null;

  if (latestOrderId) {
    targetOrder = orders.find(o => o.orderId === latestOrderId || o.orderNumber == latestOrderId);
  }

  // Fallback to most recent order if latestOrderId is missing but orders exist
  if (!targetOrder && orders.length > 0) {
    targetOrder = orders[0];
  }

  // FALLBACK STATE — No valid order data
  if (!targetOrder) {
    container.innerHTML = `
      <div class="order-fallback-card" style="max-width: 600px; margin: 3rem auto; background: #FFFFFF; border: 1px solid #E5E5E5; border-radius: 16px; padding: 3.5rem 2rem; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
        <div style="width: 72px; height: 72px; border-radius: 50%; background-color: #FEF2F2; color: var(--primary); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h1 style="font-size: 1.85rem; font-weight: 800; color: #111111; margin-bottom: 0.5rem;">Order Information Unavailable</h1>
        <p style="color: #666666; font-size: 0.975rem; margin-bottom: 2rem;">Your recent order could not be loaded.</p>
        <a href="shop.html" class="btn btn-primary" style="padding: 0.85rem 2rem; font-weight: 700; border-radius: 8px;">Continue Shopping &rarr;</a>
      </div>
    `;
    return;
  }

  // SUCCESS STATE — Real order data found
  const pathPrefix = (typeof getPathPrefix === 'function') ? getPathPrefix() : '../';

  const itemsListHTML = (targetOrder.items || []).map(i => {
    const itemTotal = (i.price || 0) * (i.quantity || 1);
    const imgSource = i.image ? (i.image.startsWith('http') ? i.image : `${pathPrefix}${i.image}`) : null;

    return `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid #F0F0F0; font-size: 0.925rem;">
        <div style="display: flex; align-items: center; gap: 1rem; flex: 1; padding-right: 1rem;">
          <div style="width: 50px; height: 50px; background: #FFFFFF; border: 1px solid #E5E5E5; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; padding: 3px;">
            ${imgSource ? `<img src="${imgSource}" alt="${i.name}" style="max-width: 100%; max-height: 100%; object-fit: contain;">` : '<span style="font-size:10px; font-weight:800; color:var(--primary);">PV</span>'}
          </div>
          <div>
            <div style="font-weight: 800; color: #111111; line-height: 1.25;">${i.name}</div>
            <div style="font-size: 0.8rem; color: #666666; margin-top: 3px;">Qty: ${i.quantity} &times; ${(typeof formatCurrency === 'function') ? formatCurrency(i.price) : '$' + i.price}</div>
          </div>
        </div>
        <span style="font-weight: 800; color: #111111; white-space: nowrap;">${(typeof formatCurrency === 'function') ? formatCurrency(itemTotal) : '$' + itemTotal.toFixed(2)}</span>
      </div>
    `;
  }).join('');

  const customer = targetOrder.customer || {};
  const totals = targetOrder.totals || { subtotal: 0, shipping: 0, total: 0, isFreeShipping: true };

  container.innerHTML = `
    <div class="order-success-wrapper" style="max-width: 760px; margin: 0 auto; text-align: center;">
      <!-- Success Icon Visual -->
      <div style="width: 76px; height: 76px; border-radius: 50%; background-color: #ECFDF5; color: #10B981; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.18);">
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>

      <h1 style="font-size: 2.25rem; font-weight: 900; color: #111111; margin-bottom: 0.35rem; letter-spacing: -0.02em;">Order Placed Successfully</h1>
      <p style="font-size: 1.05rem; font-weight: 700; color: var(--primary); margin-bottom: 0.35rem;">Thank you for your order!</p>
      <p style="color: #666666; font-size: 0.95rem; margin-bottom: 2.25rem; max-width: 540px; margin-left: auto; margin-right: auto; line-height: 1.5;">
        Your order has been successfully placed and is now being processed by PrintersVault.
      </p>

      <!-- Order Details Summary Card -->
      <div style="background-color: #FFFFFF; border: 1px solid #E5E5E5; border-radius: 16px; padding: 2.5rem; text-align: left; margin-bottom: 2.25rem; box-shadow: 0 4px 25px rgba(0,0,0,0.03);">
        
        <!-- Header Info Row -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.75rem; padding-bottom: 1.25rem; border-bottom: 1px solid #EAEAEA; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.75rem; color: #888888; text-transform: uppercase; font-weight: 800; letter-spacing: 0.08em; margin-bottom: 2px;">ORDER ID</div>
            <div style="font-size: 1.4rem; font-weight: 900; color: var(--primary);">${targetOrder.orderId || ('#PV-' + targetOrder.orderNumber)}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.75rem; color: #888888; text-transform: uppercase; font-weight: 800; letter-spacing: 0.08em; margin-bottom: 2px;">ORDER DATE</div>
            <div style="font-weight: 700; color: #111111;">${targetOrder.date || 'Today'}</div>
          </div>
        </div>

        <!-- Details Grid (Payment & Status) -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.75rem; background: #F8FAFC; padding: 1.25rem; border-radius: 10px; border: 1px solid #E2E8F0;">
          <div>
            <div style="font-size: 0.75rem; color: #64748B; text-transform: uppercase; font-weight: 800; letter-spacing: 0.05em; margin-bottom: 4px;">PAYMENT METHOD</div>
            <div style="font-weight: 800; color: #111111; font-size: 0.95rem;">${targetOrder.paymentMethod || 'Cash on Delivery (COD)'}</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; color: #64748B; text-transform: uppercase; font-weight: 800; letter-spacing: 0.05em; margin-bottom: 4px;">ORDER STATUS</div>
            <div>
              <span style="display: inline-block; background-color: #ECFDF5; color: #10B981; font-weight: 800; font-size: 0.8rem; padding: 0.25rem 0.65rem; border-radius: 50px;">
                ${targetOrder.status || 'Order Placed'}
              </span>
            </div>
          </div>
        </div>

        <!-- Customer & Delivery Info -->
        <div style="margin-bottom: 2rem;">
          <h3 style="font-size: 0.95rem; font-weight: 800; text-transform: uppercase; color: #111111; letter-spacing: 0.05em; margin-bottom: 0.75rem;">Delivery Information</h3>
          <div style="font-size: 0.925rem; color: #444444; line-height: 1.6; background-color: #FFFFFF; border: 1px solid #E5E5E5; border-radius: 10px; padding: 1rem 1.25rem;">
            <strong>${customer.firstName || 'Customer'} ${customer.lastName || ''}</strong><br>
            ${customer.address || ''}<br>
            ${customer.city || ''}${customer.state ? ', ' + customer.state : ''} ${customer.zip || ''}<br>
            <span style="color: #666666;">Email: ${customer.email || 'N/A'}</span>
          </div>
        </div>

        <!-- Ordered Items -->
        <h3 style="font-size: 0.95rem; font-weight: 800; text-transform: uppercase; color: #111111; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Ordered Products</h3>
        <div style="margin-bottom: 1.75rem;">
          ${itemsListHTML}
        </div>

        <!-- Summary Totals Block -->
        <div style="background-color: #F8FAFC; padding: 1.25rem; border-radius: 10px; border: 1px solid #E2E8F0;">
          <div style="display: flex; justify-content: space-between; font-size: 0.9rem; color: #475569; margin-bottom: 0.45rem;">
            <span>Subtotal</span>
            <span style="font-weight: 700; color: #111111;">${(typeof formatCurrency === 'function') ? formatCurrency(totals.subtotal) : '$' + totals.subtotal}</span>
          </div>
          ${totals.discount > 0 ? `
            <div style="display: flex; justify-content: space-between; font-size: 0.9rem; color: #10B981; margin-bottom: 0.45rem; font-weight: 700;">
              <span>Promo Discount</span>
              <span>-${(typeof formatCurrency === 'function') ? formatCurrency(totals.discount) : '$' + totals.discount}</span>
            </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; font-size: 0.9rem; color: #475569; margin-bottom: 0.75rem;">
            <span>Shipping</span>
            <span>${totals.isFreeShipping ? '<strong style="color:#10B981;">FREE</strong>' : (typeof formatCurrency === 'function' ? formatCurrency(totals.shipping) : '$' + totals.shipping)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-weight: 900; font-size: 1.25rem; color: #111111; border-top: 1.5px solid #CBD5E1; padding-top: 0.65rem;">
            <span>Total Amount</span>
            <span style="color: var(--primary);">${(typeof formatCurrency === 'function') ? formatCurrency(totals.total) : '$' + totals.total}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; justify-content: center; gap: 1.25rem; flex-wrap: wrap;">
        <a href="shop.html" class="btn btn-primary" style="padding: 0.85rem 2rem; font-weight: 700; border-radius: 8px;">Continue Shopping &rarr;</a>
        <a href="account.html" class="btn btn-outline" style="padding: 0.85rem 2rem; font-weight: 700; border-radius: 8px;">View My Orders &rarr;</a>
      </div>
    </div>
  `;
}
