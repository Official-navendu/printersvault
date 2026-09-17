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

// Format Currency
function formatCurrency(amount) {
  return `$${Number(amount).toFixed(2)}`;
}

// Toast Alert System
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Get / Set LocalStorage Utilities
function getCart() {
  try {
    return JSON.parse(localStorage.getItem('pv_cart')) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('pv_cart', JSON.stringify(cart));
  updateHeaderBadges();
}

function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem('pv_wishlist')) || [];
  } catch (e) {
    return [];
  }
}

function saveWishlist(wishlist) {
  localStorage.setItem('pv_wishlist', JSON.stringify(wishlist));
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
      image: product.image || 'images/build.png',
      modelName: product.name,
      svgAccent: product.svgAccent || '#E30613',
      quantity: Number(quantity)
    });
  }

  saveCart(cart);
  showToast(`Added "${product.name}" to cart!`);
}

// Update Header Badge Counters
function updateHeaderBadges() {
  const cart = getCart();
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
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
  const wishlistBadges = document.querySelectorAll('.wishlist-count-badge');
  wishlistBadges.forEach(el => {
    el.textContent = wishlist.length;
    el.style.display = wishlist.length > 0 ? 'inline-flex' : 'none';
  });
}

// Commercial Product Card Component (Requirement 17 Structure)
function createProductCardHTML(product) {
  const wishlist = getWishlist();
  const isWishlisted = wishlist.includes(product.id);
  const pagesPrefix = getPagesPrefix();
  const pathPrefix = getPathPrefix();

  const starsHTML = '★'.repeat(Math.floor(product.rating)) + (product.rating % 1 >= 0.5 ? '½' : '');
  const svgVisual = (typeof generateProductSVG === 'function') ? generateProductSVG(product.type, product.name.replace('PrintersVault ', ''), product.svgAccent) : '';
  const visualHTML = product.image ? `<img src="${pathPrefix}${product.image}" alt="${product.name}" class="product-card-img" style="width: 100%; height: 200px; object-fit: contain; padding: 1rem;">` : svgVisual;

  return `
    <div class="product-card" data-id="${product.id}">
      <div class="card-image-wrap">
        ${product.discount ? `<span class="card-sale-badge badge badge-red">${product.discount}% OFF</span>` : (product.badge ? `<span class="card-sale-badge badge badge-dark">${product.badge}</span>` : '')}
        
        <button class="card-wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="event.preventDefault(); handleWishlistClick('${product.id}', this)" aria-label="Add to Wishlist">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        <a href="${pagesPrefix}product.html?id=${product.id}">
          ${visualHTML}
        </a>
      </div>

      <div class="card-meta-category">${product.category}</div>
      <h3 class="card-product-name">
        <a href="${pagesPrefix}product.html?id=${product.id}">${product.name}</a>
      </h3>

      <div class="card-rating-row">
        <span class="stars-gold">${starsHTML}</span>
        <span style="font-weight: 700; color: #161616;">${product.rating}</span>
        <span style="color: #6B6B6B;">(${product.reviews})</span>
      </div>

      <div class="card-price-container">
        <span class="price-main">${formatCurrency(product.price)}</span>
        ${product.oldPrice ? `<span class="price-crossed">${formatCurrency(product.oldPrice)}</span>` : ''}
      </div>

      <button class="btn btn-primary btn-sm btn-block" onclick="addToCart('${product.id}')">
        Add to Cart
      </button>
    </div>
  `;
}

function handleWishlistClick(productId, buttonEl) {
  const isAdded = toggleWishlist(productId);
  if (buttonEl) {
    if (isAdded) {
      buttonEl.classList.add('active');
      buttonEl.querySelector('svg').setAttribute('fill', 'currentColor');
    } else {
      buttonEl.classList.remove('active');
      buttonEl.querySelector('svg').setAttribute('fill', 'none');
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

