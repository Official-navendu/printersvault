/* ==========================================================================
   PRINTERSVAULT — SHOP LISTING & FILTERING CONTROLLER
   Handles category filtering, brand filtering, price range, search, sorting,
   and URL-synchronized 12-item pagination.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const shopGrid = document.getElementById('shopProductsGrid');
  if (!shopGrid) return; // Only execute on shop page

  const resultsCountEl = document.getElementById('resultsCount');
  const sortSelect = document.getElementById('sortSelect');
  const activeSearchQueryEl = document.getElementById('activeSearchQuery');
  const paginationContainer = document.getElementById('shopPaginationContainer');

  const ITEMS_PER_PAGE = 12;

  // Parse URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  let searchQuery = urlParams.get('search') || '';
  let categoryFilter = urlParams.get('category') || 'all';
  let currentPage = parseInt(urlParams.get('page'), 10) || 1;

  if (activeSearchQueryEl && searchQuery) {
    activeSearchQueryEl.textContent = `Showing results for "${searchQuery}"`;
  }

  // Pre-check filter inputs if preset in URL
  if (categoryFilter !== 'all') {
    const catCheckbox = document.querySelector(`.filter-category[value="${categoryFilter}"]`);
    if (catCheckbox) catCheckbox.checked = true;
  }

  function getSelectedFilters() {
    const categories = Array.from(document.querySelectorAll('.filter-category:checked')).map(cb => cb.value);
    const brands = Array.from(document.querySelectorAll('.filter-brand:checked')).map(cb => cb.value);
    const tech = Array.from(document.querySelectorAll('.filter-tech:checked')).map(cb => cb.value);
    const maxPrice = Number(document.getElementById('priceRangeInput')?.value || 1000);
    const inStockOnly = document.getElementById('inStockOnly')?.checked || false;

    return { categories, brands, tech, maxPrice, inStockOnly };
  }

  function updateUrlPageParam(page) {
    const params = new URLSearchParams(window.location.search);
    if (page > 1) {
      params.set('page', page);
    } else {
      params.delete('page');
    }
    const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
    window.history.pushState({ page }, '', newUrl);
  }

  function filterAndSortProducts(resetPage = true) {
    if (resetPage) {
      currentPage = 1;
      updateUrlPageParam(1);
    }

    const filters = getSelectedFilters();
    let result = [...PRODUCTS];

    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes('all')) {
      result = result.filter(p => filters.categories.includes(p.category));
    }

    // Brand filter
    if (filters.brands.length > 0) {
      result = result.filter(p => filters.brands.includes(p.brand));
    }

    // Print tech filter
    if (filters.tech.length > 0) {
      result = result.filter(p => filters.tech.some(t => (p.printTech || '').toLowerCase().includes(t.toLowerCase())));
    }

    // Max price filter
    result = result.filter(p => p.price <= filters.maxPrice);

    // Stock filter
    if (filters.inStockOnly) {
      result = result.filter(p => p.stock);
    }

    // Sorting
    const sortVal = sortSelect ? sortSelect.value : 'featured';
    if (sortVal === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortVal === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortVal === 'rating') {
      result.sort((a, b) => Number(b.rating) - Number(a.rating));
    } else if (sortVal === 'newest') {
      result.sort((a, b) => String(b.id).localeCompare(String(a.id)));
    }

    // Calculate pagination totals
    const totalItems = result.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;

    if (currentPage > totalPages) {
      currentPage = 1;
      updateUrlPageParam(1);
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const pagedItems = result.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    renderShopGrid(pagedItems, totalItems, startIndex);
    renderPagination(totalPages);
  }

  function renderShopGrid(items, totalItems, startIndex) {
    if (resultsCountEl) {
      if (totalItems === 0) {
        resultsCountEl.textContent = 'Showing 0 of 0 products';
      } else {
        const start = startIndex + 1;
        const end = Math.min(startIndex + items.length, totalItems);
        resultsCountEl.textContent = `Showing ${start}–${end} of ${totalItems} products`;
      }
    }

    if (items.length === 0) {
      shopGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="1.5" style="margin-bottom: 1rem;">
            <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem; color: #111;">No Products Found</h3>
          <p style="color: #666; margin-bottom: 1.5rem;">Try adjusting your search query or clear sidebar filters.</p>
          <button class="btn btn-outline" onclick="resetFilters()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    shopGrid.innerHTML = items.map(product => createProductCardHTML(product)).join('');
  }

  function renderPagination(totalPages) {
    if (!paginationContainer) return;

    if (totalPages <= 1) {
      paginationContainer.innerHTML = '';
      return;
    }

    let buttonsHTML = '';

    // Previous Button
    const isPrevDisabled = currentPage === 1;
    buttonsHTML += `<button class="pagination-btn ${isPrevDisabled ? 'disabled' : ''}" ${isPrevDisabled ? 'disabled' : ''} onclick="goToShopPage(${currentPage - 1})">&larr; Previous</button>`;

    // Numeric Buttons
    for (let p = 1; p <= totalPages; p++) {
      const isActive = p === currentPage;
      buttonsHTML += `<button class="pagination-btn ${isActive ? 'active' : ''}" onclick="goToShopPage(${p})">${p}</button>`;
    }

    // Next Button
    const isNextDisabled = currentPage === totalPages;
    buttonsHTML += `<button class="pagination-btn ${isNextDisabled ? 'disabled' : ''}" ${isNextDisabled ? 'disabled' : ''} onclick="goToShopPage(${currentPage + 1})">Next &rarr;</button>`;

    paginationContainer.innerHTML = buttonsHTML;
  }

  window.goToShopPage = function(pageNumber) {
    currentPage = pageNumber;
    updateUrlPageParam(currentPage);
    filterAndSortProducts(false);

    const targetEl = document.getElementById('catalogLayout') || shopGrid;
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'auto' });
    }
  };

  // Attach Filter Listeners (Resets page to 1 automatically)
  const filterInputs = document.querySelectorAll('.filter-category, .filter-brand, .filter-tech, #inStockOnly');
  filterInputs.forEach(input => {
    input.addEventListener('change', () => filterAndSortProducts(true));
  });

  const priceRangeInput = document.getElementById('priceRangeInput');
  const priceDisplay = document.getElementById('priceRangeDisplay');
  if (priceRangeInput && priceDisplay) {
    priceRangeInput.addEventListener('input', (e) => {
      priceDisplay.textContent = `$${e.target.value}`;
    });
    priceRangeInput.addEventListener('change', () => {
      filterAndSortProducts(true);
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', () => filterAndSortProducts(true));
  }

  // Support Browser Back/Forward buttons
  window.addEventListener('popstate', () => {
    const params = new URLSearchParams(window.location.search);
    currentPage = parseInt(params.get('page'), 10) || 1;
    filterAndSortProducts(false);
  });

  // Initial render (preserves ?page=X if present in URL)
  filterAndSortProducts(false);
});

function resetFilters() {
  const checkboxes = document.querySelectorAll('.catalog-sidebar input[type="checkbox"]');
  checkboxes.forEach(cb => cb.checked = false);

  const priceInput = document.getElementById('priceRangeInput');
  const priceDisplay = document.getElementById('priceRangeDisplay');
  if (priceInput && priceDisplay) {
    priceInput.value = 1000;
    priceDisplay.textContent = '$1000';
  }

  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) sortSelect.value = 'featured';

  window.history.replaceState({}, document.title, window.location.pathname);
  location.reload();
}
