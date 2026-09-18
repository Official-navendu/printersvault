/* ==========================================================================
   PRINTERSVAULT — GLOBAL UTILITIES & CORE APP CONTROLLER
   Manages Header Badges, Path Resolution, Search, Wishlist, Cart & Toast System
   ========================================================================== */

function getPathPrefix() {
  const path = window.location.pathname;
  return (path.includes('/pages/') || path.endsWith('/pages')) ? '../' : '';
}

function getPagesPrefix() {
  const path = window.location.pathname;
  return (path.includes('/pages/') || path.endsWith('/pages')) ? '' : 'pages/';
}

// Global HTML Escaper for XSS Prevention
function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Format Currency
function formatCurrency(amount) {
  return `$${Number(amount).toFixed(2)}`;
}

// Toast Alert System - Premium Redesign
function showToast(message, type = 'success', customTitle = null) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  // Parse Title & Subtext for clean e-commerce hierarchy
  let title = customTitle;
  let subtitle = message;

  if (!title) {
    const lowerMsg = String(message).toLowerCase();
    if (lowerMsg.includes('added') && lowerMsg.includes('cart')) {
      title = 'Added to Cart';
      const prodMatch = message.match(/Added "([^"]+)" to cart!/);
      if (prodMatch && prodMatch[1]) {
        subtitle = `${prodMatch[1]} has been added to your cart.`;
      }
    } else if (lowerMsg.includes('wishlist') && lowerMsg.includes('added')) {
      title = 'Added to Wishlist';
      subtitle = 'Item saved to your wishlist.';
    } else if (lowerMsg.includes('wishlist') && lowerMsg.includes('removed')) {
      title = 'Wishlist Updated';
      subtitle = 'Item removed from your wishlist.';
    } else if (lowerMsg.includes('removed') && lowerMsg.includes('cart')) {
      title = 'Cart Updated';
      subtitle = 'Item has been removed from your cart.';
    } else if (lowerMsg.includes('cart cleared')) {
      title = 'Cart Cleared';
      subtitle = 'All items removed from your cart.';
    } else if (lowerMsg.includes('discount applied')) {
      title = 'Discount Applied';
      subtitle = '10% promotional discount applied.';
    } else if (lowerMsg.includes('promo code removed')) {
      title = 'Promo Code Removed';
      subtitle = 'Promotional discount code removed.';
    } else if (lowerMsg.includes('invalid promo code')) {
      title = 'Invalid Code';
      subtitle = message;
    } else if (lowerMsg.includes('logged out')) {
      title = 'Signed Out';
      subtitle = 'You have been logged out of your account.';
    } else if (lowerMsg.includes('welcome')) {
      title = 'Welcome Back';
      subtitle = message;
    } else if (lowerMsg.includes('account created')) {
      title = 'Account Created';
      subtitle = message;
    } else {
      switch (type) {
        case 'error':
          title = 'Notice';
          break;
        case 'warning':
          title = 'Warning';
          break;
        case 'info':
          title = 'Information';
          break;
        case 'success':
        default:
          title = 'Success';
          break;
      }
    }
  }

  // Type-Specific Crisp Inline SVGs
  let iconSVG = '';
  if (type === 'error') {
    iconSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C90A0E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  } else if (type === 'warning') {
    iconSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
  } else if (type === 'info') {
    iconSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#008EDA" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  } else {
    // success (default)
    iconSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C90A0E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon-wrap toast-icon-${type}">
      ${iconSVG}
    </div>
    <div class="toast-content">
      <div class="toast-title">${escapeHTML(title)}</div>
      <div class="toast-subtext">${escapeHTML(subtitle)}</div>
    </div>
    <button type="button" class="toast-close-btn" aria-label="Close notification" onclick="dismissToast(this.closest('.toast'))">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    <div class="toast-progress"></div>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  const dismissTimer = setTimeout(() => {
    dismissToast(toast);
  }, 3500);

  if (typeof toast.addEventListener === 'function') {
    toast.addEventListener('click', (e) => {
      if (e.target && typeof e.target.closest === 'function' && e.target.closest('.toast-close-btn')) {
        clearTimeout(dismissTimer);
      }
    });
  }
}

function dismissToast(toast) {
  if (!toast || (toast.classList && typeof toast.classList.contains === 'function' && toast.classList.contains('hide'))) return;
  if (toast.classList) {
    if (typeof toast.classList.remove === 'function') toast.classList.remove('show');
    if (typeof toast.classList.add === 'function') toast.classList.add('hide');
  }
  setTimeout(() => {
    if (toast && toast.parentNode && typeof toast.remove === 'function') toast.remove();
  }, 280);
}

// Storage Constants
const CART_STORAGE_KEY = 'printersVaultCart';
const LEGACY_CART_KEY = 'pv_cart';
const WISHLIST_STORAGE_KEY = 'printersVaultWishlist';
const ORDERS_STORAGE_KEY = 'printersVaultOrders';
const LEGACY_ORDERS_KEY = 'pv_orders';

// Get / Set LocalStorage Utilities
function getCart() {
  try {
    let cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
    if (!cart || !Array.isArray(cart)) {
      const legacy = JSON.parse(localStorage.getItem(LEGACY_CART_KEY));
      if (legacy && Array.isArray(legacy)) {
        cart = legacy;
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } else {
        cart = [];
      }
    }
    return cart;
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    localStorage.setItem(LEGACY_CART_KEY, JSON.stringify(cart));
  } catch (e) {}
  updateHeaderBadges();
}

function clearCart() {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(LEGACY_CART_KEY);
  } catch (e) {}
  updateHeaderBadges();
}

function updateCartItemQty(productId, delta) {
  let cart = getCart();
  const item = cart.find(i => String(i.id) === String(productId));
  if (item) {
    item.quantity += Number(delta);
    if (item.quantity <= 0) {
      cart = cart.filter(i => String(i.id) !== String(productId));
    }
    saveCart(cart);
  }
  return cart;
}

function removeCartItem(productId) {
  let cart = getCart();
  cart = cart.filter(i => String(i.id) !== String(productId));
  saveCart(cart);
  return cart;
}

function calcCartTotals(cart, promoCode = '') {
  const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
  const freeShippingThreshold = 299;
  const isFreeShipping = subtotal >= freeShippingThreshold || cart.length === 0;
  const shipping = isFreeShipping ? 0 : 9.99;
  
  let discount = 0;
  let discountCode = '';
  if (promoCode && promoCode.trim().toUpperCase() === 'SAVE10') {
    discount = subtotal * 0.10;
    discountCode = 'SAVE10';
  }

  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = 0;
  const total = Math.max(0, taxableAmount + shipping);

  return {
    subtotal,
    shipping,
    isFreeShipping,
    freeShippingThreshold,
    discount,
    discountCode,
    tax: 0,
    total,
    itemCount: cart.reduce((sum, item) => sum + Number(item.quantity), 0)
  };
}

function getOrders() {
  try {
    let orders = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY));
    if (!orders || !Array.isArray(orders)) {
      const legacy = JSON.parse(localStorage.getItem(LEGACY_ORDERS_KEY));
      if (legacy && Array.isArray(legacy)) {
        orders = legacy;
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
      } else {
        orders = [];
      }
    }
    return orders;
  } catch (e) {
    return [];
  }
}

function saveOrder(orderData) {
  const orders = getOrders();
  orders.unshift(orderData);
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    localStorage.setItem(LEGACY_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {}
  return orders;
}

function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveWishlist(wishlist) {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  } catch (e) {}
  updateHeaderBadges();
}

function toggleWishlist(productId) {
  let wishlist = getWishlist();
  const index = wishlist.indexOf(productId);
  let isAdded = false;

  if (index > -1) {
    wishlist.splice(index, 1);
    showToast('Removed from Wishlist', 'info');
  } else {
    wishlist.push(productId);
    isAdded = true;
    showToast('Added to Wishlist!', 'success');
  }

  saveWishlist(wishlist);
  return isAdded;
}

function addToCart(productId, quantity = 1) {
  const product = PRODUCTS.find(p => String(p.id) === String(productId));
  if (!product) return;

  let cart = getCart();
  const existingItem = cart.find(item => String(item.id) === String(product.id));

  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      sku: product.sku,
      category: product.category,
      type: product.type || 'printer',
      image: product.image || 'images/products/pv_001.png',
      modelName: product.name,
      svgAccent: product.svgAccent || '#C90A0E',
      quantity: Number(quantity)
    });
  }

  saveCart(cart);
  showToast(`Added "${product.name}" to cart!`);
}

// Update Header Badge Counters
function updateHeaderBadges() {
  const cart = getCart();
  const totalCartCount = cart.reduce((sum, item) => sum + Number(item.quantity), 0);
  
  const cartCountLabels = document.querySelectorAll('.cart-count-label');
  cartCountLabels.forEach(el => {
    el.textContent = `Cart (${totalCartCount})`;
  });

  const cartBadges = document.querySelectorAll('.cart-count-badge');
  cartBadges.forEach(el => {
    el.textContent = totalCartCount;
    el.style.display = totalCartCount > 0 ? 'inline-flex' : 'none';
  });

  const wishlist = getWishlist();
  const wishlistCount = wishlist.length;

  const wishlistLabels = document.querySelectorAll('.wishlist-count-label');
  wishlistLabels.forEach(el => {
    el.textContent = `Wishlist ${wishlistCount > 0 ? wishlistCount : ''}`.trim();
  });

  const wishlistBadges = document.querySelectorAll('.wishlist-count-badge');
  wishlistBadges.forEach(el => {
    el.textContent = wishlistCount;
    el.style.display = wishlistCount > 0 ? 'inline-flex' : 'none';
  });
}

// Commercial Product Card Component (Requirement 17 Structure)
function createProductCardHTML(product) {
  const wishlist = getWishlist();
  const isWishlisted = wishlist.includes(String(product.id));
  const pagesPrefix = getPagesPrefix();
  const pathPrefix = getPathPrefix();

  const starsHTML = '★'.repeat(Math.floor(product.rating)) + (product.rating % 1 >= 0.5 ? '½' : '');
  const svgVisual = (typeof generateProductSVG === 'function') ? generateProductSVG(product.type, product.name.replace('PrintersVault ', ''), product.svgAccent) : '';
  const visualHTML = product.image ? `<img src="${pathPrefix}${product.image}" alt="${product.name}" class="product-card-img" loading="lazy">` : svgVisual;

  const metaTag = product.brand ? `${escapeHTML(product.brand)} • ${escapeHTML(product.category)}` : escapeHTML(product.category);

  return `
    <div class="product-card" data-id="${escapeHTML(product.id)}">
      <div class="card-image-wrap">
        ${product.discount ? `<span class="card-sale-badge badge badge-red">${escapeHTML(product.discount)}% OFF</span>` : (product.badge ? `<span class="card-sale-badge badge badge-dark">${escapeHTML(product.badge)}</span>` : '')}
        
        <button class="card-wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="event.preventDefault(); handleWishlistClick('${escapeHTML(product.id)}', this)" aria-label="Add to Wishlist">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        <a href="${pagesPrefix}product.html?id=${escapeHTML(product.id)}" class="card-img-link">
          ${visualHTML}
        </a>
      </div>

      <div class="card-body">
        <div class="card-meta-category">${metaTag}</div>
        <h3 class="card-product-name">
          <a href="${pagesPrefix}product.html?id=${escapeHTML(product.id)}">${escapeHTML(product.name)}</a>
        </h3>

        <div class="card-rating-row">
          <span class="stars-gold">${starsHTML}</span>
          <span class="rating-num">${product.rating}</span>
          <span class="rating-count">(${product.reviews})</span>
        </div>

        <div class="card-footer-row">
          <div class="card-price-container">
            <span class="price-main">${formatCurrency(product.price)}</span>
            ${product.oldPrice ? `<span class="price-crossed">${formatCurrency(product.oldPrice)}</span>` : ''}
          </div>

          <button class="btn btn-primary btn-sm btn-block card-add-btn" onclick="addToCart('${product.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
}

function handleWishlistClick(productId, buttonEl) {
  const isAdded = toggleWishlist(productId);
  if (buttonEl) {
    if (isAdded) {
      buttonEl.classList.add('active');
      const svg = buttonEl.querySelector('svg');
      if (svg) svg.setAttribute('fill', 'currentColor');
    } else {
      buttonEl.classList.remove('active');
      const svg = buttonEl.querySelector('svg');
      if (svg) svg.setAttribute('fill', 'none');
    }
  }
  if (typeof renderWishlistPage === 'function') {
    renderWishlistPage();
  }
}

function handleDetailWishlist(productId, buttonEl) {
  const isAdded = toggleWishlist(productId);
  if (buttonEl) {
    const svg = buttonEl.querySelector('svg');
    if (isAdded) {
      buttonEl.classList.add('active');
      if (svg) svg.setAttribute('fill', 'currentColor');
      for (let i = 0; i < buttonEl.childNodes.length; i++) {
        if (buttonEl.childNodes[i].nodeType === 3) {
          buttonEl.childNodes[i].textContent = ' Remove from Wishlist';
          break;
        }
      }
    } else {
      buttonEl.classList.remove('active');
      if (svg) svg.setAttribute('fill', 'none');
      for (let i = 0; i < buttonEl.childNodes.length; i++) {
        if (buttonEl.childNodes[i].nodeType === 3) {
          buttonEl.childNodes[i].textContent = ' Add to Wishlist';
          break;
        }
      }
    }
  }
}

// FAQ Accordion Handler
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close all other FAQ items for a clean single-open accordion feel
        faqItems.forEach(otherItem => otherItem.classList.remove('active'));
        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

// Testimonials Horizontal Carousel Slider
function initTestimonialSlider() {
  const container = document.getElementById('testi-slider');
  const track = document.getElementById('testi-track');
  const prevBtn = document.getElementById('testi-prev');
  const nextBtn = document.getElementById('testi-next');
  const dotsContainer = document.getElementById('testi-dots');
  
  if (!container || !track) return;
  
  const cards = Array.from(track.querySelectorAll('.testimonial-card'));
  if (cards.length === 0) return;

  let currentIndex = 0;
  let autoplayTimer = null;
  const autoPlayInterval = 4500;

  function getVisibleCardsCount() {
    const width = window.innerWidth;
    if (width > 991) return 3;
    if (width > 640) return 2;
    return 1;
  }

  function getMaxIndex() {
    const visibleCount = getVisibleCardsCount();
    return Math.max(0, cards.length - visibleCount);
  }

  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const maxIndex = getMaxIndex();
    
    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `testi-dot ${i === currentIndex ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to testimonial slide ${i + 1}`);
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateSlider();
        resetAutoplay();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateSlider() {
    const maxIndex = getMaxIndex();
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    const cardWidth = cards[0].offsetWidth;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 24;
    const moveAmount = (cardWidth + gap) * currentIndex;

    track.style.transform = `translateX(-${moveAmount}px)`;

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.testi-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }

    if (prevBtn) prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
    if (nextBtn) nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
  }

  function nextSlide() {
    const maxIndex = getMaxIndex();
    if (currentIndex < maxIndex) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    updateSlider();
  }

  function prevSlide() {
    const maxIndex = getMaxIndex();
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = maxIndex;
    }
    updateSlider();
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, autoPlayInterval);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function resetAutoplay() {
    startAutoplay();
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });
  }

  // Touch / Swipe support
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    currentX = e.touches[0].clientX;
    isDragging = true;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    const diffX = startX - currentX;
    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    resetAutoplay();
  });

  // Hover Pause
  container.addEventListener('mouseenter', stopAutoplay);
  container.addEventListener('mouseleave', startAutoplay);

  // Resize handler
  window.addEventListener('resize', () => {
    renderDots();
    updateSlider();
  });

  renderDots();
  updateSlider();
  startAutoplay();
}

// Header & Global App Init
document.addEventListener('DOMContentLoaded', () => {
  updateHeaderBadges();
  initFAQAccordion();
  initTestimonialSlider();

  // Search form handler
  const searchForms = document.querySelectorAll('.search-form');
  searchForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.search-input');
      if (input && input.value.trim()) {
        const query = encodeURIComponent(input.value.trim());
        const targetPage = getPagesPrefix() + `shop.html?search=${query}`;
        window.location.href = targetPage;
      }
    });
  });

  // Mobile menu toggle
  const mobileToggleBtn = document.querySelector('.mobile-nav-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerOverlay = document.querySelector('.drawer-overlay');

  if (mobileToggleBtn && mobileDrawer && drawerOverlay) {
    const toggleDrawer = (open) => {
      const isOpen = open !== undefined ? open : !mobileDrawer.classList.contains('open');
      mobileDrawer.classList.toggle('open', isOpen);
      drawerOverlay.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    mobileToggleBtn.addEventListener('click', () => toggleDrawer());
    drawerOverlay.addEventListener('click', () => toggleDrawer(false));

    window.addEventListener('resize', () => {
      if (window.innerWidth > 991 && mobileDrawer.classList.contains('open')) {
        toggleDrawer(false);
      }
    });
  }
});

