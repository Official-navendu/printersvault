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
    image: "../images/hero.png",
    content: `
      <p>Choosing the right printer is one of the most important hardware decisions for a home office, studio, or corporate workspace. With dozens of models featuring inkjet, laser, and refillable tank technologies, finding the perfect match depends on your daily page volume, document types, and total operating cost budget.</p>
      
      <h3>1. Assess Your Monthly Print Volume</h3>
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

      <h3>2. Laser vs. Inkjet: Key Differences</h3>
      <p><strong>Laser Printers:</strong> Use heat to fuse powdered toner onto paper. They excel at sharp text, fast multi-page document printing, and long cartridge yields.</p>
      <p><strong>Inkjet Printers:</strong> Spray microscopic droplets of liquid ink. They are ideal for high-resolution photo printing, marketing materials, and vivid graphics.</p>

      <h3>3. Must-Have Connectivity Features</h3>
      <p>Modern printing workflows require seamless wireless connectivity across desktop computers, laptops, tablets, and smartphones. Look for dual-band Wi-Fi (2.4GHz / 5GHz), Apple AirPrint, Mopria Print Service, and Wi-Fi Direct for printing without a router.</p>

      <h3>Conclusion</h3>
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
    image: "../images/build.png",
    content: `
      <p>Understanding cost-per-page (CPP) is the key to managing long-term printing expenses. While an entry-level inkjet printer might seem like a bargain, replacement cartridges can quickly add up if you print frequently.</p>
      
      <h3>Calculating Cost Per Page</h3>
      <p>To calculate CPP, divide the price of the ink or toner cartridge by its estimated page yield. For example:</p>
      <ul>
        <li>Standard Ink Cartridge: $30 ÷ 300 pages = <strong>10.0 cents per page</strong></li>
        <li>High-Yield Toner Cartridge: $75 ÷ 3,000 pages = <strong>2.5 cents per page</strong></li>
      </ul>

      <div class="blog-callout-box">
        <h4>Efficiency Highlight</h4>
        <p>High-yield XL cartridges typically provide 2x to 3x more printed pages for only a 30% to 50% increase in cartridge cost.</p>
      </div>

      <h3>When to Choose Toner</h3>
      <p>If your office prints text-heavy reports, contracts, or shipping documentation daily, toner cartridges provide reliable output without the risk of printhead clogging or dry-out during downtime.</p>

      <h3>When to Choose Pigment Ink</h3>
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
    image: "../images/ESSENTIALS.png",
    content: `
      <p>Paper jams are one of the most common workplace print interruptions. Fortunately, over 90% of paper misfeeds can be prevented with simple storage and tray handling practices.</p>

      <h3>1. Store Paper in a Cool, Dry Place</h3>
      <p>Paper absorbs ambient moisture easily, causing individual sheets to stick together. Keep unused paper sealed in its original moisture-resistant wrapper until loaded into the printer tray.</p>

      <h3>2. Fan the Paper Stack Before Loading</h3>
      <p>Before sliding a fresh stack of paper into the tray, flex and fan the edges to eliminate static electricity between sheets.</p>

      <h3>3. Respect Tray Capacity Guides</h3>
      <p>Never overload the paper tray beyond the maximum fill line indicated on the tray guides. Overfilling exerts excessive pressure on feed rollers.</p>

      <h3>4. Clean Rubber Pickup Rollers Regularly</h3>
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
    image: "../images/how-it-works.png",
    content: `
      <p>Wireless printing frees your workspace from cable clutter and allows every employee or family member to print seamlessly from any laptop, tablet, or mobile phone.</p>

      <h3>1. Connecting via Wi-Fi Protected Setup (WPS)</h3>
      <p>If your wireless router has a WPS button, press it, then press the WPS button on your printer within 2 minutes for instant, secure network pairing.</p>

      <h3>2. Mobile Printing with Apple AirPrint & Android Direct Print</h3>
      <p>Modern wireless printers built for PrintersVault support native driverless printing from iPhones, iPads, and Android smartphones connected to the same Wi-Fi network.</p>

      <h3>3. Assigning a Static IP Address</h3>
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
    image: "../images/build.png",
    content: `
      <p>When purchasing replacement cartridges for home or commercial printers, choosing High-Yield (XL) or Extra High-Yield (XXL) cartridges significantly reduces operational expenses.</p>

      <h3>Fewer Replacements, Less Downtime</h3>
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
    image: "../images/ESSENTIALS.png",
    content: `
      <p>Maxing out your printing setup goes beyond the base printer unit. The right accessories optimize speed, network stability, and paper capacity.</p>

      <h3>High-Speed Shielded Cables</h3>
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
  const blogId = params.get('id') || 'printer-buying-guide';
  const blog = BLOGS.find(b => b.id === blogId) || BLOGS[0];

  const pagesPrefix = getPagesPrefix();

  // Document Title
  document.title = `${blog.title} | PrintersVault Blog`;

  // Related articles (other than current)
  const related = BLOGS.filter(b => b.id !== blog.id).slice(0, 3);

  container.innerHTML = `
    <!-- Back Link & Header -->
    <div style="margin-bottom: 2rem;">
      <a href="${pagesPrefix}blog.html" style="display: inline-flex; align-items: center; gap: 0.5rem; font-weight: 800; color: var(--primary); font-size: 0.9rem; margin-bottom: 1.5rem; text-decoration: none;">
        &larr; Back to All Articles
      </a>
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
        <span class="blog-card-category" style="position: static;">${blog.category}</span>
        <span style="font-size: 0.85rem; color: var(--text-muted);">${blog.date}</span>
        <span style="font-size: 0.85rem; color: var(--text-muted);">• ${blog.readTime}</span>
      </div>
      <h1 style="font-size: clamp(2rem, 3.5vw, 2.75rem); font-weight: 900; color: #111111; line-height: 1.2; margin-bottom: 1rem;">
        ${blog.title}
      </h1>
      <div style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; color: var(--text-muted);">
        <span>By <strong>${blog.author}</strong></span>
      </div>
    </div>

    <!-- Featured Image with Corner Red Frame Treatment -->
    <div class="split-ref-img-wrapper" style="max-width: 100%; margin-bottom: 3rem;">
      <div class="red-accent-top-left"></div>
      <div class="red-accent-bottom-right"></div>
      <div class="red-dots-matrix-left"></div>
      <div class="split-ref-img-box" style="aspect-ratio: 21 / 9;">
        <img src="${blog.image}" alt="${blog.title}" class="split-ref-img" style="height: 100%; object-fit: cover;">
      </div>
    </div>

    <!-- Article Body -->
    <div class="article-body-content" style="max-width: 840px; margin: 0 auto 4rem auto;">
      ${blog.content}
    </div>

    <!-- Related Articles Section -->
    <div style="border-top: 1px solid var(--border); padding-top: 3.5rem; margin-top: 3.5rem;">
      <h3 style="font-size: 1.5rem; font-weight: 800; color: #111111; margin-bottom: 2rem; text-align: center;">
        Related Articles
      </h3>
      <div class="about-offer-grid" style="grid-template-columns: repeat(3, 1fr);">
        ${related.map(r => `
          <a href="${pagesPrefix}blog-details.html?id=${r.id}" class="blog-card" style="text-decoration: none;">
            <div class="blog-card-img-wrap" style="height: 160px;">
              <img src="${r.image}" alt="${r.title}" class="blog-card-img">
              <span class="blog-card-category">${r.category}</span>
            </div>
            <div class="blog-card-content" style="padding: 1.25rem;">
              <h4 style="font-size: 1rem; font-weight: 800; color: #111111; line-height: 1.35; margin-bottom: 0.5rem;">${r.title}</h4>
              <span style="font-size: 0.8rem; font-weight: 800; color: var(--primary);">Read Article &rarr;</span>
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
