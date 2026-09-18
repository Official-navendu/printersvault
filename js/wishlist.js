/* ==========================================================================
   PRINTERSVAULT — WISHLIST CONTROLLER
   Renders saved wishlist products grid and empty state
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  renderWishlistPage();
});

function renderWishlistPage() {
  const container = document.getElementById('wishlistContainer');
  if (!container) return;

  const wishlistIds = getWishlist();
  const pagesPrefix = getPagesPrefix();

  const countHeadingEl = document.getElementById('wishlistCountHeading');
  if (countHeadingEl) {
    countHeadingEl.textContent = `${wishlistIds.length} ${wishlistIds.length === 1 ? 'item' : 'items'}`;
  }

  // EMPTY WISHLIST STATE
  if (wishlistIds.length === 0) {
    container.innerHTML = `
      <div class="empty-wishlist-card" style="text-align: center; padding: 5rem 2rem; background: #FFFFFF; border: 1px solid var(--border, #E5E5E5); border-radius: 12px; max-width: 720px; margin: 0 auto 3rem; box-shadow: var(--shadow-sm, 0 4px 12px rgba(0,0,0,0.03));">
        <div style="width: 80px; height: 80px; border-radius: 50%; background-color: #FFF0F1; color: var(--primary-red, #C90A0E); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
        <h2 style="font-size: 1.75rem; font-weight: 800; margin-bottom: 0.5rem; color: var(--primary-black, #0F0F0E);">Your Wishlist is Empty</h2>
        <p style="color: var(--text-muted, #666666); margin-bottom: 2rem; max-width: 480px; margin-left: auto; margin-right: auto; font-size: 0.95rem; line-height: 1.5;">
          Save products you love and come back to them anytime.
        </p>
        <a href="${pagesPrefix}shop.html" class="btn btn-primary" style="padding: 0.85rem 2.25rem; font-weight: 700; display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.95rem;">
          Explore Products &rarr;
        </a>
      </div>
    `;
    return;
  }

  // WISHLIST PRODUCT GRID
  const wishlistProducts = PRODUCTS.filter(p => wishlistIds.includes(String(p.id)));

  container.innerHTML = `
    <div class="wishlist-product-grid">
      ${wishlistProducts.map(product => createProductCardHTML(product)).join('')}
    </div>
  `;
}
