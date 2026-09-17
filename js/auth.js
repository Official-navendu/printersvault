/* ==========================================================================
   PRINTERSVAULT — AUTHENTICATION & USER DASHBOARD CONTROLLER
   Handles login, registration, localStorage user sessions & account tabs
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

document.addEventListener('DOMContentLoaded', () => {
  // Login Form Handler
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail')?.value.trim();
      const password = document.getElementById('loginPassword')?.value.trim();

      if (!email || !password) {
        showToast('Please enter your email and password.', 'info');
        return;
      }

      // Check registered users in localStorage
      let users = [];
      try {
        users = JSON.parse(localStorage.getItem('pv_users')) || [];
      } catch (e) {}

      const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

      // Demo login fallback if user enters any valid credentials
      const user = matchedUser || { name: email.split('@')[0], email: email };
      setCurrentUser(user);
      showToast(`Welcome back, ${user.name}!`);
      setTimeout(() => window.location.href = 'account.html', 800);
    });
  }

  // Register Form Handler
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regName')?.value.trim();
      const email = document.getElementById('regEmail')?.value.trim();
      const password = document.getElementById('regPassword')?.value.trim();
      const confirmPassword = document.getElementById('regConfirmPassword')?.value.trim();

      if (!name || !email || !password || !confirmPassword) {
        showToast('Please complete all registration fields.', 'info');
        return;
      }

      if (password !== confirmPassword) {
        showToast('Passwords do not match.', 'info');
        return;
      }

      if (password.length < 6) {
        showToast('Password must be at least 6 characters long.', 'info');
        return;
      }

      let users = [];
      try {
        users = JSON.parse(localStorage.getItem('pv_users')) || [];
      } catch (e) {}

      const newUser = { name, email, password };
      users.push(newUser);
      localStorage.setItem('pv_users', JSON.stringify(users));

      setCurrentUser(newUser);
      showToast('Account created successfully!');
      setTimeout(() => window.location.href = 'account.html', 800);
    });
  }

  // Account Page Dashboard Handler
  const accountDashboard = document.getElementById('accountDashboardContainer');
  if (accountDashboard) {
    renderAccountDashboard();
  }
});

function renderAccountDashboard() {
  const container = document.getElementById('accountDashboardContainer');
  if (!container) return;

  const user = getCurrentUser();

  if (!user) {
    container.innerHTML = `
      <div style="text-align: center; padding: 4rem 1rem;">
        <h2 style="font-size: 1.75rem; font-weight: 800; margin-bottom: 0.5rem; color: #111;">Account Sign-In Required</h2>
        <p style="color: #666; margin-bottom: 2rem;">Please sign in to access your PrintersVault account dashboard, saved wishlist, and past order history.</p>
        <div style="display: flex; justify-content: center; gap: 1rem;">
          <a href="login.html" class="btn btn-primary">Sign In</a>
          <a href="register.html" class="btn btn-outline">Create Account</a>
        </div>
      </div>
    `;
    return;
  }

  // Fetch Past Orders
  let orders = [];
  try {
    orders = JSON.parse(localStorage.getItem('pv_orders')) || [];
  } catch (e) {}

  // Fetch Wishlist Products
  const wishlistIds = getWishlist();
  const wishlistedProducts = PRODUCTS.filter(p => wishlistIds.includes(p.id));

  const ordersHTML = orders.length === 0 ? `
    <p style="color: #666; font-size: 0.95rem;">You haven't placed any orders yet.</p>
  ` : orders.map(o => `
    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px solid #E5E5E5;">
        <div>
          <strong style="color: #E30613;">#${o.orderNumber}</strong>
          <span style="font-size: 0.85rem; color: #666; margin-left: 0.5rem;">— ${o.date}</span>
        </div>
        <span style="font-size: 0.85rem; font-weight: 700; color: #10B981; background: #ECFDF5; padding: 0.2rem 0.6rem; border-radius: 4px;">Completed</span>
      </div>
      <div style="font-size: 0.9rem; color: #444;">
        ${o.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
      </div>
      <div style="margin-top: 0.5rem; font-weight: 800; font-size: 1.05rem; text-align: right;">
        Total: ${formatCurrency(o.totals.total)}
      </div>
    </div>
  `).join('');

  const wishlistHTML = wishlistedProducts.length === 0 ? `
    <p style="color: #666; font-size: 0.95rem;">Your wishlist is currently empty.</p>
  ` : `
    <div class="products-grid">
      ${wishlistedProducts.map(p => createProductCardHTML(p)).join('')}
    </div>
  `;

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; border-bottom: 1px solid #E5E5E5; padding-bottom: 1.5rem;">
      <div>
        <h1 style="font-size: 2.25rem; font-weight: 800; margin-bottom: 0.25rem;">My Account</h1>
        <p style="color: #666;">Welcome back, <strong>${user.name}</strong> (${user.email})</p>
      </div>
      <button class="btn btn-outline btn-sm" onclick="logoutUser()">Sign Out</button>
    </div>

    <!-- Account Tabs -->
    <div style="margin-bottom: 3rem;">
      <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1.25rem;">Recent Order History</h2>
      ${ordersHTML}
    </div>

    <div>
      <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1.25rem;">Saved Wishlist Items (${wishlistedProducts.length})</h2>
      ${wishlistHTML}
    </div>
  `;
}

function logoutUser() {
  setCurrentUser(null);
  showToast('Logged out successfully');
  setTimeout(() => window.location.href = '../index.html', 600);
}
