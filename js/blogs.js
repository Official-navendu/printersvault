/* ==========================================================================
   PRINTERSVAULT — BLOGS DATA & CONTROLLER
   Provides Blog Articles Dataset, Listing Render & Details Render System
   ========================================================================== */

const BLOGS = [
  {
    id: "printer-buying-guide",
    title: "How to Choose the Right Printer for Your Home or Office",
    category: "Printer Guides",
    excerpt: "A comprehensive guide comparing inkjet, monochrome laser, color laser, and ink tank printers to help you choose the best model for your workload.",
    date: "September 15, 2026",
    author: "PrintersVault Team",
    readTime: "5 min read",
    image: "../images/blogs.png",
    content: `
      <p>Choosing the right printer is one of the most important hardware decisions for a home office, studio, or corporate workspace. With dozens of models featuring inkjet, laser, and refillable tank technologies, finding the perfect match depends on your daily page volume, document types, and total operating cost budget.</p>
      
      <h2>1. Assess Your Monthly Print Volume</h2>
      <p>Before looking at printer specifications, estimate how many pages you print each week:</p>
      <ul>
        <li><strong>Occasional Printing (10–50 pages/month):</strong> Standard wireless inkjet printers offer low initial costs and crisp photo printing capability.</li>
        <li><strong>Moderate Home Office (100–300 pages/month):</strong> Refillable ink tank models or compact monochrome laser printers deliver fast text printing at a fraction of the cost per page.</li>
        <li><strong>Busy Office Workgroup (500+ pages/month):</strong> High-capacity color or monochrome laser printers with dual paper trays ensure uninterrupted productivity.</li>
      </ul>

      <div class="blog-callout-box">
        <h4>Pro Tip from PrintersVault Techs</h4>
        <p>If you primarily print text documents, shipping labels, and invoices, a monochrome laser printer offers faster output, instant dry time, and toner that never dries out, even if left idle for weeks.</p>
      </div>

      <h2>2. Laser vs. Inkjet: Key Differences</h2>
      <p><strong>Laser Printers:</strong> Use heat to fuse powdered toner onto paper. They excel at sharp text, fast multi-page document printing, and long cartridge yields.</p>
      <p><strong>Inkjet Printers:</strong> Spray microscopic droplets of liquid ink. They are ideal for high-resolution photo printing, marketing materials, and vivid graphics.</p>

      <h2>3. Must-Have Connectivity Features</h2>
      <p>Modern printing workflows require seamless wireless connectivity across desktop computers, laptops, tablets, and smartphones. Look for dual-band Wi-Fi (2.4GHz / 5GHz), Apple AirPrint, Mopria Print Service, and Wi-Fi Direct for printing without a router.</p>

      <h3>Summary Recommendations</h3>
      <p>Investing in the right printer balances upfront price with ongoing cartridge costs. Explore PrintersVault's curated printer collection to find reliable models backed by full manufacturer specifications and support.</p>
    `
  },
  {
    id: "ink-vs-toner-efficiency",
    title: "Inkjet vs. Laser: Understanding Ink and Toner Efficiency",
    category: "Ink & Toner",
    excerpt: "Discover the cost-per-page breakdown between inkjet cartridges and high-yield laser toner cartridges for low to high-volume document printing.",
    date: "September 10, 2026",
    author: "Technical Support",
    readTime: "4 min read",
    image: "../images/blogs.png",
    content: `
      <p>Understanding cost-per-page (CPP) is the key to managing long-term printing expenses. While an entry-level inkjet printer might seem like a bargain, replacement cartridges can quickly add up if you print frequently.</p>
      
      <h2>Calculating Cost Per Page</h2>
      <p>To calculate CPP, divide the price of the ink or toner cartridge by its estimated page yield. For example:</p>
      <ul>
        <li>Standard Ink Cartridge: $30 ÷ 300 pages = <strong>10.0 cents per page</strong></li>
        <li>High-Yield Toner Cartridge: $75 ÷ 3,000 pages = <strong>2.5 cents per page</strong></li>
      </ul>

      <div class="blog-callout-box">
        <h4>Efficiency Highlight</h4>
        <p>High-yield XL cartridges typically provide 2x to 3x more printed pages for only a 30% to 50% increase in cartridge cost.</p>
      </div>

      <h2>When to Choose Toner</h2>
      <p>If your office prints text-heavy reports, contracts, or shipping documentation daily, toner cartridges provide reliable output without the risk of printhead clogging or dry-out during downtime.</p>

      <h2>When to Choose Pigment Ink</h2>
      <p>For vibrant color proofing and water-resistant document printing, high-capacity pigment ink bottles and XL cartridges deliver professional graphics with smudge-proof archival quality.</p>
    `
  },
  {
    id: "preventing-printer-jams",
    title: "5 Essential Tips to Prevent Paper Jams and Extend Printer Life",
    category: "Maintenance",
    excerpt: "Simple maintenance habits, paper storage tips, and roller cleaning techniques to eliminate paper jams and keep your printer running smoothly.",
    date: "September 04, 2026",
    author: "PrintersVault Team",
    readTime: "6 min read",
    image: "../images/blogs.png",
    content: `
      <p>Paper jams are one of the most common workplace print interruptions. Fortunately, over 90% of paper misfeeds can be prevented with simple storage and tray handling practices.</p>

      <h2>1. Store Paper in a Cool, Dry Place</h2>
      <p>Paper absorbs ambient moisture easily, causing individual sheets to stick together. Keep unused paper sealed in its original moisture-resistant wrapper until loaded into the printer tray.</p>

      <h2>2. Fan the Paper Stack Before Loading</h2>
      <p>Before sliding a fresh stack of paper into the tray, flex and fan the edges to eliminate static electricity between sheets.</p>

      <h2>3. Respect Tray Capacity Guides</h2>
      <p>Never overload the paper tray beyond the maximum fill line indicated on the tray guides. Overfilling exerts excessive pressure on feed rollers.</p>

      <h2>4. Clean Rubber Pickup Rollers Regularly</h2>
      <p>Dust and paper fiber accumulate on rubber pickup rollers over time, reducing traction. Wipe rollers gently with a lint-free cloth dampened with distilled water every few months.</p>
    `
  },
  {
    id: "setting-up-wireless-printing",
    title: "How to Set Up Wireless & Cloud Printing Across Multiple Devices",
    category: "Office Printing",
    excerpt: "Step-by-step instructions for connecting Wi-Fi printers to Windows, Mac, iOS AirPrint, and Android Direct Print without cable clutter.",
    date: "August 28, 2026",
    author: "Network Specialist",
    readTime: "5 min read",
    image: "../images/blogs.png",
    content: `
      <p>Wireless printing frees your workspace from cable clutter and allows every employee or family member to print seamlessly from any laptop, tablet, or mobile phone.</p>

      <h2>1. Connecting via Wi-Fi Protected Setup (WPS)</h2>
      <p>If your wireless router has a WPS button, press it, then press the WPS button on your printer within 2 minutes for instant, secure network pairing.</p>

      <h2>2. Mobile Printing with Apple AirPrint & Android Direct Print</h2>
      <p>Modern wireless printers built for PrintersVault support native driverless printing from iPhones, iPads, and Android smartphones connected to the same Wi-Fi network.</p>

      <h2>3. Assigning a Static IP Address</h2>
      <p>For office networks, assigning a static IP address to your network printer prevents connectivity drops when router DHCP leases renew.</p>
    `
  },
  {
    id: "high-yield-cartridge-savings",
    title: "Why High-Yield Cartridges Are More Cost-Effective for Businesses",
    category: "Ink & Toner",
    excerpt: "Learn how standard vs. XL high-yield cartridges reduce replacement frequency and lower your total cost of ownership over time.",
    date: "August 20, 2026",
    author: "PrintersVault Team",
    readTime: "4 min read",
    image: "../images/blogs.png",
    content: `
      <p>When purchasing replacement cartridges for home or commercial printers, choosing High-Yield (XL) or Extra High-Yield (XXL) cartridges significantly reduces operational expenses.</p>

      <h2>Fewer Replacements, Less Downtime</h2>
      <p>High-yield cartridges hold more ink or toner in the same physical shell dimensions. This means fewer ordering cycles, less packaging waste, and fewer interruptions during major print jobs.</p>
    `
  },
  {
    id: "essential-printer-accessories",
    title: "Essential Accessories Every Workgroup Printer Needs",
    category: "Office Printing",
    excerpt: "From high-speed USB cables to dual-band Wi-Fi adapters and additional paper trays, upgrade your workspace printing setup.",
    date: "August 12, 2026",
    author: "Workspace Specialist",
    readTime: "5 min read",
    image: "../images/blogs.png",
    content: `
      <p>Maxing out your printing setup goes beyond the base printer unit. The right accessories optimize speed, network stability, and paper capacity.</p>

      <h2>High-Speed Shielded Cables</h2>
      <p>For high-resolution graphics and heavy PDF transfers, shielded USB 2.0/3.0 printer cables prevent data drops and print spool errors.</p>
    `
  }
];

// Helper to resolve relative path prefix for images/pages
function getAssetPrefix() {
  const path = window.location.pathname;
  return (path.includes('/pages/') || path.endsWith('/pages')) ? '../' : '';
}

function getPagesPrefix() {
  const path = window.location.pathname;
  return (path.includes('/pages/') || path.endsWith('/pages')) ? '' : 'pages/';
}

// Global Copy Link handler
function copyArticleLink() {
  const url = window.location.href;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      if (typeof showToast === 'function') {
        showToast('Article link copied to clipboard.', 'success');
      } else {
        alert('Article link copied to clipboard.');
      }
    }).catch(() => fallbackCopyText(url));
  } else {
    fallbackCopyText(url);
  }
}

function fallbackCopyText(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    if (typeof showToast === 'function') {
      showToast('Article link copied to clipboard.', 'success');
    }
  } catch (err) {}
  document.body.removeChild(textArea);
}

if (typeof window !== 'undefined') {
  window.copyArticleLink = copyArticleLink;
}

// Render Blog Listing on pages/blog.html
function initBlogListing() {
  const container = document.getElementById('blogs-grid');
  if (!container) return;

  const pagesPrefix = getPagesPrefix();
  const filterBtns = document.querySelectorAll('.blog-filter-btn');

  function renderGrid(filter = 'All') {
    const filtered = filter === 'All' ? BLOGS : BLOGS.filter(b => b.category === filter);
    
    if (filtered.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem 0; color: var(--text-muted);">No articles found in this category.</div>`;
      return;
    }

    container.innerHTML = filtered.map(blog => `
      <article class="blog-card">
        <div class="blog-card-img-wrap">
          <a href="${pagesPrefix}blog-details.html?id=${blog.id}">
            <img src="${blog.image}" alt="${blog.title}" class="blog-card-img">
          </a>
          <span class="blog-card-category">${blog.category}</span>
        </div>
        <div class="blog-card-content">
          <div class="blog-card-meta">
            <span>${blog.date}</span>
            <span class="meta-dot">•</span>
            <span>${blog.readTime}</span>
          </div>
          <h3 class="blog-card-title">
            <a href="${pagesPrefix}blog-details.html?id=${blog.id}">${blog.title}</a>
          </h3>
          <p class="blog-card-excerpt">${blog.excerpt}</p>
          <div class="blog-card-footer">
            <span class="blog-author">${blog.author}</span>
            <a href="${pagesPrefix}blog-details.html?id=${blog.id}" class="blog-read-more">Read Article &rarr;</a>
          </div>
        </div>
      </article>
    `).join('');
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-category');
      renderGrid(cat);
    });
  });

  renderGrid('All');
}

// Render Blog Details on pages/blog-details.html
function initBlogDetails() {
  const container = document.getElementById('blog-details-container');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const blogId = params.get('id');
  const pagesPrefix = getPagesPrefix();

  // Find target blog
  const blog = blogId ? BLOGS.find(b => b.id === blogId) : null;

  // INVALID ARTICLE FALLBACK
  if (!blog) {
    document.title = "Article Not Found | PrintersVault Blog";

    container.innerHTML = `
      <div class="blog-not-found-card">
        <div class="blog-not-found-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h1 class="blog-not-found-title">Article Not Found</h1>
        <p class="blog-not-found-desc">The blog article you're looking for could not be found.</p>
        <a href="${pagesPrefix}blog.html" class="btn btn-primary">&larr; Back to Blogs</a>
      </div>
    `;
    return;
  }

  // DYNAMIC SEO & META UPDATES
  document.title = `${blog.title} | PrintersVault Blog`;

  const metaDesc = document.getElementById('metaDescription');
  if (metaDesc) metaDesc.setAttribute('content', blog.excerpt);

  const ogTitle = document.getElementById('ogTitle');
  if (ogTitle) ogTitle.setAttribute('content', `${blog.title} | PrintersVault Blog`);

  const ogDesc = document.getElementById('ogDescription');
  if (ogDesc) ogDesc.setAttribute('content', blog.excerpt);

  const ogImage = document.getElementById('ogImage');
  if (ogImage) ogImage.setAttribute('content', blog.image);

  const currentUrl = window.location.href;
  const ogUrl = document.getElementById('ogUrl');
  if (ogUrl) ogUrl.setAttribute('content', currentUrl);

  const canonicalUrl = document.getElementById('canonicalUrl');
  if (canonicalUrl) canonicalUrl.setAttribute('href', currentUrl);

  const breadcrumbTitle = document.getElementById('breadcrumb-title');
  if (breadcrumbTitle) breadcrumbTitle.textContent = blog.title;

  // Dynamic Related Articles Selection:
  // 1. Exclude current article
  // 2. Prioritize articles in same category
  // 3. Fill remaining slots with other articles
  const otherBlogs = BLOGS.filter(b => b.id !== blog.id);
  const sameCatBlogs = otherBlogs.filter(b => b.category === blog.category);
  const diffCatBlogs = otherBlogs.filter(b => b.category !== blog.category);
  const related = [...sameCatBlogs, ...diffCatBlogs].slice(0, 3);

  // Social Sharer URLs
  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(blog.title)}`;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;

  container.innerHTML = `
    <!-- Editorial Hero Header -->
    <div class="blog-details-hero">
      <a href="${pagesPrefix}blog.html" class="blog-back-link">
        &larr; Back to Blogs
      </a>
      
      <div class="blog-details-category">${blog.category}</div>
      
      <h1 class="blog-details-title">${blog.title}</h1>
      
      <p class="blog-details-excerpt">${blog.excerpt}</p>
      
      <div class="blog-details-meta">
        <span>Published ${blog.date}</span>
        <span class="meta-dot">•</span>
        <span>By <strong>${blog.author}</strong></span>
        <span class="meta-dot">•</span>
        <span>${blog.readTime}</span>
      </div>
    </div>

    <!-- Featured Image -->
    <div class="blog-featured-image-wrap">
      <img src="${blog.image}" alt="${blog.title}" class="blog-featured-image">
    </div>

    <!-- 2-Column Article & Sidebar Layout -->
    <div class="blog-details-grid">
      <!-- Main Content Column -->
      <article class="blog-article-content">
        ${blog.content}
      </article>

      <!-- Compact Sidebar Column -->
      <aside class="blog-sidebar">
        <!-- Info Box -->
        <div class="blog-sidebar-box">
          <h4 class="blog-sidebar-heading">Article Details</h4>
          <div class="blog-sidebar-info-row">
            <span class="info-label">Category</span>
            <span class="info-val">${blog.category}</span>
          </div>
          <div class="blog-sidebar-info-row">
            <span class="info-label">Published</span>
            <span class="info-val">${blog.date}</span>
          </div>
          <div class="blog-sidebar-info-row">
            <span class="info-label">Author</span>
            <span class="info-val">${blog.author}</span>
          </div>
          <div class="blog-sidebar-info-row">
            <span class="info-label">Reading Time</span>
            <span class="info-val">${blog.readTime}</span>
          </div>
        </div>

        <!-- Share Box -->
        <div class="blog-sidebar-box">
          <h4 class="blog-sidebar-heading">Share Article</h4>
          <div class="blog-share-list">
            <a href="${fbShareUrl}" target="_blank" rel="noopener noreferrer" class="blog-share-btn" aria-label="Share on Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
              <span>Facebook</span>
            </a>
            <a href="${twitterShareUrl}" target="_blank" rel="noopener noreferrer" class="blog-share-btn" aria-label="Share on X Twitter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>X / Twitter</span>
            </a>
            <a href="${linkedInShareUrl}" target="_blank" rel="noopener noreferrer" class="blog-share-btn" aria-label="Share on LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <button type="button" class="blog-share-btn blog-copy-link-btn" onclick="copyArticleLink()" aria-label="Copy Article Link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              <span>Copy Link</span>
            </button>
          </div>
        </div>
      </aside>
    </div>

    <!-- Related Articles Section -->
    <div class="related-articles-section">
      <h3 class="related-articles-title">RELATED ARTICLES</h3>
      <div class="related-articles-grid">
        ${related.map(r => `
          <a href="${pagesPrefix}blog-details.html?id=${r.id}" class="related-article-card">
            <div class="related-card-img-wrap">
              <img src="${r.image}" alt="${r.title}" class="related-card-img">
              <span class="related-card-category">${r.category}</span>
            </div>
            <div class="related-card-body">
              <div class="related-card-meta">${r.date || ''} • ${r.readTime || ''}</div>
              <h4 class="related-card-title">${r.title}</h4>
              <span class="related-card-link">Read Article &rarr;</span>
            </div>
          </a>
        `).join('')}
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  initBlogListing();
  initBlogDetails();
});
