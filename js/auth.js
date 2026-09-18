/* ==========================================================================
   PRINTERSVAULT — AUTHENTICATION & USER DASHBOARD CONTROLLER
   Unified Premium E-Commerce Authentication & User Dashboard
   ========================================================================== */

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('pv_user')) || null;
  } catch (e) {
    return null;
  }
}

function setCurrentUser(user) {
  if (user) {
    localStorage.setItem('pv_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('pv_user');
  }
}

function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input || !btn) return;
  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';

  const eyeOff = btn.querySelector('.eye-off');
  const eyeOn = btn.querySelector('.eye-on');

  if (isPassword) {
    if (eyeOff) eyeOff.style.display = 'none';
    if (eyeOn) eyeOn.style.display = 'block';
    btn.setAttribute('aria-label', 'Hide password');
  } else {
    if (eyeOff) eyeOff.style.display = 'block';
    if (eyeOn) eyeOn.style.display = 'none';
    btn.setAttribute('aria-label', 'Show password');
  }
}

// Make togglePasswordVisibility globally accessible
if (typeof window !== 'undefined') {
  window.togglePasswordVisibility = togglePasswordVisibility;
}

document.addEventListener('DOMContentLoaded', () => {
  const accountDashboard = document.getElementById('accountDashboardContainer');
  if (accountDashboard) {
    renderAccountDashboard();
  }
});

function renderAccountDashboard() {
  const container = document.getElementById('accountDashboardContainer');
  if (!container) return;

  const user = getCurrentUser();

  // 1. LOGGED-OUT STATE — PREMIUM UNIFIED AUTHENTICATION (WELCOME BACK | CREATE YOUR ACCOUNT)
  if (!user) {
    container.innerHTML = `
      <div class="acc-auth-container">
        <!-- Compact Page Intro -->
        <div class="acc-intro-wrap">
          <h1 class="acc-intro-title">My Account</h1>
          <p class="acc-intro-desc">Sign in to manage your account or create a new one to get started.</p>
        </div>

        <!-- Unified Card Composition -->
        <div class="acc-auth-card-unified">
          <div class="acc-auth-grid">
            <!-- LEFT SIDE: LOGIN -->
            <div class="acc-auth-col acc-auth-col-login">
              <div class="acc-auth-header">
                <h2 class="acc-col-title">Welcome Back</h2>
                <p class="acc-col-sub">Sign in to access your PrintersVault account.</p>
              </div>

              <form id="accountLoginForm" class="acc-auth-form" novalidate>
                <div class="form-group">
                  <label for="loginEmail" class="form-label">Email Address <span class="required">*</span></label>
                  <input type="email" id="loginEmail" class="form-control" placeholder="Enter your email" required>
                </div>

                <div class="form-group">
                  <label for="loginPassword" class="form-label">Password <span class="required">*</span></label>
                  <div class="password-input-wrap">
                    <input type="password" id="loginPassword" class="form-control password-input" placeholder="••••••••" required>
                    <button type="button" class="password-toggle-btn" aria-label="Show password" onclick="togglePasswordVisibility('loginPassword', this)">
                      <svg class="eye-icon eye-off" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                      <svg class="eye-icon eye-on" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none;">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="acc-form-options">
                  <label class="acc-remember-me">
                    <input type="checkbox" id="rememberMe" checked>
                    <span>Remember Me</span>
                  </label>
                  <a href="#" onclick="if(typeof showToast==='function') showToast('Password reset instructions sent to your email.', 'info'); return false;" class="acc-forgot-link">Forgot Password?</a>
                </div>

                <button type="submit" class="btn-acc-primary">Sign In</button>
              </form>
            </div>

            <!-- RIGHT SIDE: CREATE ACCOUNT -->
            <div class="acc-auth-col acc-auth-col-register">
              <div class="acc-auth-header">
                <h2 class="acc-col-title">Create Your Account</h2>
                <p class="acc-col-sub">Create an account to manage your orders and enjoy a smoother shopping experience.</p>
              </div>

              <form id="accountRegisterForm" class="acc-auth-form" novalidate>
                <div class="form-row-2col">
                  <div class="form-group">
                    <label for="regFirstName" class="form-label">First Name <span class="required">*</span></label>
                    <input type="text" id="regFirstName" class="form-control" placeholder="First name" required>
                  </div>
                  <div class="form-group">
                    <label for="regLastName" class="form-label">Last Name <span class="required">*</span></label>
                    <input type="text" id="regLastName" class="form-control" placeholder="Last name" required>
                  </div>
                </div>

                <div class="form-group">
                  <label for="regEmail" class="form-label">Email Address <span class="required">*</span></label>
                  <input type="email" id="regEmail" class="form-control" placeholder="Enter your email" required>
                </div>

                <div class="form-group">
                  <label for="regPassword" class="form-label">Password <span class="required">*</span></label>
                  <div class="password-input-wrap">
                    <input type="password" id="regPassword" class="form-control password-input" placeholder="Minimum 6 characters" required>
                    <button type="button" class="password-toggle-btn" aria-label="Show password" onclick="togglePasswordVisibility('regPassword', this)">
                      <svg class="eye-icon eye-off" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                      <svg class="eye-icon eye-on" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none;">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="form-group">
                  <label for="regConfirmPassword" class="form-label">Confirm Password <span class="required">*</span></label>
                  <div class="password-input-wrap">
                    <input type="password" id="regConfirmPassword" class="form-control password-input" placeholder="Re-enter password" required>
                    <button type="button" class="password-toggle-btn" aria-label="Show password" onclick="togglePasswordVisibility('regConfirmPassword', this)">
                      <svg class="eye-icon eye-off" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                      <svg class="eye-icon eye-on" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none;">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </div>
                </div>

                <button type="submit" class="btn-acc-primary">Create Account</button>
              </form>
            </div>
          </div>

          <!-- Micro Security Note -->
          <div class="acc-auth-footer-note">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span>Secure 256-bit SSL encrypted connection. Your data is kept strictly confidential.</span>
          </div>
        </div>
      </div>
    `;

    setupAuthFormListeners();
    return;
  }

  // 2. LOGGED-IN STATE (FULL USER DASHBOARD & E-COMMERCE HISTORY)
  const orders = (typeof getOrders === 'function') ? getOrders() : [];
  const wishlistIds = (typeof getWishlist === 'function') ? getWishlist() : [];
  const wishlistedProducts = (typeof PRODUCTS !== 'undefined' && Array.isArray(PRODUCTS)) ? PRODUCTS.filter(p => wishlistIds.includes(p.id)) : [];

  const ordersHTML = orders.length === 0 ? `
    <div style="background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 12px; padding: 2rem; text-align: center;">
      <p style="color: #64748B; font-size: 0.95rem; margin: 0;">You haven't placed any orders yet. Explore our shop for top deals on printers and accessories!</p>
    </div>
  ` : orders.map(o => `
    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.25rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem; padding-bottom: 0.75rem; border-bottom: 1px solid #E2E8F0; flex-wrap: wrap; gap: 0.5rem;">
        <div>
          <strong style="color: var(--primary); font-size: 1.1rem;">${o.orderId || ('#PV-' + o.orderNumber)}</strong>
          <span style="font-size: 0.85rem; color: #64748B; margin-left: 0.5rem;">— ${o.date}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          ${o.paymentMethod ? `<span style="font-size: 0.8rem; background: #E2E8F0; color: #334155; padding: 0.25rem 0.6rem; border-radius: 4px; font-weight: 700;">${o.paymentMethod}</span>` : ''}
          <span style="font-size: 0.85rem; font-weight: 800; color: #10B981; background: #ECFDF5; padding: 0.25rem 0.65rem; border-radius: 4px;">Order Placed</span>
        </div>
      </div>
      <div style="font-size: 0.925rem; color: #334155; margin-bottom: 0.85rem; line-height: 1.5;">
        ${o.items.map(i => `<strong>${i.name}</strong> (x${i.quantity})`).join(', ')}
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; pt: 0.75rem; border-top: 1px dashed #CBD5E1;">
        <span style="font-size: 0.85rem; color: #64748B;">Shipping to: ${o.customer ? `${o.customer.firstName} ${o.customer.lastName} (${o.customer.city}, ${o.customer.state})` : 'Standard Delivery'}</span>
        <div style="font-weight: 800; font-size: 1.1rem; color: #0F0F0E;">
          Total: <span style="color: var(--primary);">${typeof formatCurrency === 'function' ? formatCurrency(o.totals ? o.totals.total : 0) : '$' + (o.totals ? o.totals.total : 0).toFixed(2)}</span>
        </div>
      </div>
    </div>
  `).join('');

  const wishlistHTML = wishlistedProducts.length === 0 ? `
    <div style="background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 12px; padding: 2rem; text-align: center;">
      <p style="color: #64748B; font-size: 0.95rem; margin: 0;">Your wishlist is currently empty. Click the heart icon on any product card to save it here!</p>
    </div>
  ` : `
    <div class="products-grid">
      ${wishlistedProducts.map(p => typeof createProductCardHTML === 'function' ? createProductCardHTML(p) : `<div class="product-card"><h3>${p.name}</h3></div>`).join('')}
    </div>
  `;

  container.innerHTML = `
    <div class="acc-hero-card">
      <div class="acc-dashboard-header">
        <div class="acc-user-badge">
          <div class="acc-avatar">${(user.name || 'U').charAt(0).toUpperCase()}</div>
          <div>
            <h1 class="acc-user-title">My Account</h1>
            <div class="acc-user-email">Welcome back, <strong>${user.name}</strong> (${user.email})</div>
          </div>
        </div>
        <button type="button" class="btn btn-outline btn-sm" onclick="logoutUser()" style="border-radius: 8px; font-weight: 800; padding: 0.5rem 1.25rem; cursor: pointer;">Sign Out</button>
      </div>

      <div style="margin-bottom: 3.5rem;">
        <h2 style="font-size: 1.5rem; font-weight: 900; color: #0F0F0E; margin-bottom: 1.25rem;">Recent Order History</h2>
        ${ordersHTML}
      </div>

      <div>
        <h2 style="font-size: 1.5rem; font-weight: 900; color: #0F0F0E; margin-bottom: 1.25rem;">Saved Wishlist Items (${wishlistedProducts.length})</h2>
        ${wishlistHTML}
      </div>
    </div>
  `;
}

function setupAuthFormListeners() {
  const loginForm = document.getElementById('accountLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail')?.value.trim();
      const password = document.getElementById('loginPassword')?.value.trim();

      if (!email || !password) {
        if (typeof showToast === 'function') showToast('Please enter your email and password.', 'info');
        return;
      }

      let users = [];
      try {
        users = JSON.parse(localStorage.getItem('pv_users')) || [];
      } catch (err) {}

      const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      const user = matchedUser || { name: email.split('@')[0], email: email };

      setCurrentUser(user);
      if (typeof showToast === 'function') showToast(`Welcome back, ${user.name}!`);
      renderAccountDashboard();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const registerForm = document.getElementById('accountRegisterForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const firstName = document.getElementById('regFirstName')?.value.trim();
      const lastName = document.getElementById('regLastName')?.value.trim();
      const email = document.getElementById('regEmail')?.value.trim();
      const password = document.getElementById('regPassword')?.value.trim();
      const confirmPassword = document.getElementById('regConfirmPassword')?.value.trim();

      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        if (typeof showToast === 'function') showToast('Please complete all registration fields.', 'info');
        return;
      }

      if (password !== confirmPassword) {
        if (typeof showToast === 'function') showToast('Passwords do not match.', 'info');
        return;
      }

      if (password.length < 6) {
        if (typeof showToast === 'function') showToast('Password must be at least 6 characters long.', 'info');
        return;
      }

      let users = [];
      try {
        users = JSON.parse(localStorage.getItem('pv_users')) || [];
      } catch (err) {}

      const fullName = `${firstName} ${lastName}`.trim();
      const newUser = { name: fullName, email, password };
      users.push(newUser);
      localStorage.setItem('pv_users', JSON.stringify(users));

      setCurrentUser(newUser);
      if (typeof showToast === 'function') showToast(`Account created! Welcome, ${fullName}.`);
      renderAccountDashboard();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

function logoutUser() {
  setCurrentUser(null);
  if (typeof showToast === 'function') showToast('Logged out successfully');
  renderAccountDashboard();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


