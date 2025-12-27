/* ============================================
   Main JavaScript - Soapbox PWA
   ============================================ */

(function() {
  'use strict';

  // Mobile Navigation Toggle
  function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMobile = document.querySelector('.nav-mobile');
    const navClose = document.querySelector('.nav-mobile-close');
    const navMobileLinks = document.querySelectorAll('.nav-mobile-links a');

    if (!navToggle || !navMobile) return;

    function openNav() {
      navMobile.classList.add('active');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeNav() {
      navMobile.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    navToggle.addEventListener('click', openNav);
    if (navClose) {
      navClose.addEventListener('click', closeNav);
    }

    // Close nav when clicking a link
    navMobileLinks.forEach(link => {
      link.addEventListener('click', closeNav);
    });
  }

  // Load and render dispatches
  async function loadDispatches() {
    try {
      // Get base path - works from root or subdirectories
      const basePath = window.location.pathname.includes('/dispatches/') ? '../' : '';
      const response = await fetch(basePath + 'data/dispatches.json');
      if (!response.ok) throw new Error('Failed to load dispatches');
      const dispatches = await response.json();
      return dispatches;
    } catch (error) {
      console.error('Error loading dispatches:', error);
      return [];
    }
  }

  // Render dispatch cards
  function renderDispatchCard(dispatch, basePath = '', isFeatured = false) {
    const tagsHtml = dispatch.tags.map(tag => 
      `<span class="pill">${tag}</span>`
    ).join('');
    
    const cardClass = isFeatured ? 'card card--dispatch card--featured' : 'card card--dispatch';

    // Use modal for dispatches that have quote/reflection, otherwise link to page
    const hasModalContent = dispatch.quote && dispatch.reflection;
    const titleLink = hasModalContent 
      ? `<h3 class="card-title"><a href="#" class="card-title-link" data-slug="${dispatch.slug}">${dispatch.title}</a></h3>`
      : `<h3 class="card-title"><a href="${basePath}dispatches/${dispatch.slug}.html">${dispatch.title}</a></h3>`;

    return `
      <article class="${cardClass}">
        ${titleLink}
        <div class="card-meta">${dispatch.readTime}</div>
        <p class="card-excerpt">${dispatch.excerpt}</p>
        <div class="card-tags">${tagsHtml}</div>
        ${hasModalContent ? `
          <div class="card-actions" style="margin-top: var(--spacing-md); padding-top: var(--spacing-md); border-top: 1px solid var(--border);">
            <button class="btn btn--ghost btn--read-more" data-slug="${dispatch.slug}" style="font-size: 0.9rem; padding: 0.625rem 1.25rem;">Read more</button>
            <button class="btn btn--ghost btn--download-meme" data-slug="${dispatch.slug}" style="font-size: 0.9rem; padding: 0.625rem 1.25rem;">Download meme</button>
          </div>
        ` : ''}
      </article>
    `;
  }

  // Render featured dispatches carousel on home page
  async function renderFeaturedDispatches() {
    const container = document.querySelector('#featuredCarousel');
    const dotsContainer = document.querySelector('#carouselDots');
    if (!container) {
      console.log('Carousel container not found');
      return;
    }

    try {
      const dispatches = await loadDispatches();
      const featured = dispatches.filter(d => d.featured === true);

      if (featured.length === 0) {
        console.log('No featured dispatches found');
        return;
      }

      console.log('Found featured dispatches:', featured.length);

      // Get site content for book info
      const siteContent = await window.getSiteContent ? await window.getSiteContent() : null;
      const bookTitle = siteContent?.site?.title || "In the Absence of a Soapbox";
      const bookSubtitle = siteContent?.site?.subtitle || "Rants and Revelations of a 30-Something Single Mum";
      const bookAuthor = siteContent?.site?.author || "Kelwyn Wright";
      
      container.innerHTML = featured.map((dispatch, index) => {
        const tagsHtml = dispatch.tags.map(tag => 
          `<span class="pill">${tag}</span>`
        ).join('');
        
        return `
        <div class="carousel-card" data-index="${index}">
          <article class="card card--dispatch">
            <div class="card-book-info">
              <div class="card-book-title">${bookTitle}</div>
              <div class="card-book-subtitle">${bookSubtitle}</div>
              <div class="card-book-author">By ${bookAuthor}</div>
            </div>
            <h3 class="card-title">${dispatch.title}</h3>
            <div class="card-meta">From: ${dispatch.chapter}</div>
            <p class="card-excerpt">"${dispatch.quote}"</p>
            <div class="card-tags">${tagsHtml}</div>
            <div class="card-actions">
              <button class="btn btn--ghost btn--read-more" data-slug="${dispatch.slug}">Read more</button>
              <button class="btn btn--ghost btn--download-meme" data-slug="${dispatch.slug}">Download meme</button>
            </div>
          </article>
        </div>
      `;
      }).join('');

      // Render dots
      if (dotsContainer) {
        dotsContainer.innerHTML = featured.map((_, index) => `
          <button class="carousel-dot ${index === 0 ? 'active' : ''}" data-index="${index}" aria-label="Go to slide ${index + 1}"></button>
        `).join('');
      }

      // Show navigation buttons
      const prevBtn = document.querySelector('.carousel-btn--prev');
      const nextBtn = document.querySelector('.carousel-btn--next');
      if (prevBtn) prevBtn.style.display = 'flex';
      if (nextBtn) nextBtn.style.display = 'flex';

      // Initialize carousel
      initCarousel(featured);
    } catch (error) {
      console.error('Error rendering featured dispatches:', error);
    }
  }

  // Carousel functionality
  function initCarousel(dispatches) {
    const container = document.querySelector('#featuredCarousel');
    const prevBtn = document.querySelector('.carousel-btn--prev');
    const nextBtn = document.querySelector('.carousel-btn--next');
    const dots = document.querySelectorAll('.carousel-dot');
    
    if (!container) return;

    let currentIndex = 0;
    let autoAdvanceInterval;
    const totalSlides = dispatches.length;

    function updateCarousel(index) {
      currentIndex = index;
      container.scrollTo({
        left: index * container.offsetWidth,
        behavior: 'smooth'
      });

      // Update dots
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });

      // Update button states
      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index === totalSlides - 1;
    }

    function nextSlide() {
      if (currentIndex < totalSlides - 1) {
        updateCarousel(currentIndex + 1);
      } else {
        updateCarousel(0);
      }
    }

    function prevSlide() {
      if (currentIndex > 0) {
        updateCarousel(currentIndex - 1);
      } else {
        updateCarousel(totalSlides - 1);
      }
    }

    // Button events
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        clearInterval(autoAdvanceInterval);
        nextSlide();
        startAutoAdvance();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        clearInterval(autoAdvanceInterval);
        prevSlide();
        startAutoAdvance();
      });
    }

    // Dot events
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        clearInterval(autoAdvanceInterval);
        updateCarousel(index);
        startAutoAdvance();
      });
    });

    // Auto-advance
    function startAutoAdvance() {
      clearInterval(autoAdvanceInterval);
      autoAdvanceInterval = setInterval(() => {
        nextSlide();
      }, 5000); // 5 seconds
    }

    // Pause on hover
    container.addEventListener('mouseenter', () => {
      clearInterval(autoAdvanceInterval);
    });

    container.addEventListener('mouseleave', () => {
      startAutoAdvance();
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        clearInterval(autoAdvanceInterval);
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        startAutoAdvance();
      }
    }

    // Start auto-advance
    startAutoAdvance();

    // Update on scroll (for manual scrolling)
    container.addEventListener('scroll', () => {
      const scrollIndex = Math.round(container.scrollLeft / container.offsetWidth);
      if (scrollIndex !== currentIndex) {
        currentIndex = scrollIndex;
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === scrollIndex);
        });
        if (prevBtn) prevBtn.disabled = scrollIndex === 0;
        if (nextBtn) nextBtn.disabled = scrollIndex === totalSlides - 1;
      }
    });
  }

  // Modal functionality
  function initModal() {
    const modal = document.querySelector('#dispatchModal');
    const modalContent = document.querySelector('#modalContent');
    const closeBtn = document.querySelector('.modal-close');
    
    if (!modal || !modalContent) return;

    // Close modal
    function closeModal() {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    // Close on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });

    // Read more button handlers (for both carousel and archive cards)
    document.addEventListener('click', async (e) => {
      if (e.target.classList.contains('btn--read-more') || e.target.closest('.btn--read-more')) {
        e.preventDefault();
        const btn = e.target.classList.contains('btn--read-more') ? e.target : e.target.closest('.btn--read-more');
        const slug = btn.dataset.slug;
        await openModal(slug);
      }

      if (e.target.classList.contains('btn--download-meme') || e.target.closest('.btn--download-meme')) {
        e.preventDefault();
        const btn = e.target.classList.contains('btn--download-meme') ? e.target : e.target.closest('.btn--download-meme');
        const slug = btn.dataset.slug;
        await downloadMeme(slug);
      }

      // Handle card title clicks that open modals
      if (e.target.classList.contains('card-title-link')) {
        e.preventDefault();
        const slug = e.target.dataset.slug;
        await openModal(slug);
      }
    });

    async function openModal(slug) {
      const dispatches = await loadDispatches();
      const dispatch = dispatches.find(d => d.slug === slug);
      
      if (!dispatch) {
        // If dispatch not found, redirect to page if it exists
        window.location.href = `dispatches/${slug}.html`;
        return;
      }

      // If no quote/reflection, redirect to page
      if (!dispatch.quote && !dispatch.reflection) {
        window.location.href = `dispatches/${slug}.html`;
        return;
      }

      modalContent.innerHTML = `
        ${dispatch.quote ? `<div class="modal-quote">"${dispatch.quote}"</div>` : ''}
        ${dispatch.chapter ? `<div class="modal-chapter">From: ${dispatch.chapter}</div>` : ''}
        <div class="modal-reflection">${dispatch.reflection || dispatch.fullText || dispatch.excerpt}</div>
        <div class="modal-actions">
          <div class="modal-share">
            ${dispatch.quote ? `<button class="btn btn--share btn--download" data-slug="${slug}">Download Meme</button>` : ''}
            <button class="btn btn--share" data-action="share" data-slug="${slug}">Share</button>
            <button class="btn btn--share" data-action="copy" data-slug="${slug}">Copy Link</button>
          </div>
          <a href="book.html" class="btn btn--buy-book">Buy the Book</a>
        </div>
      `;

      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Add event listeners for modal buttons
      const downloadBtn = modalContent.querySelector('.btn--download');
      const shareBtn = modalContent.querySelector('[data-action="share"]');
      const copyBtn = modalContent.querySelector('[data-action="copy"]');

      if (downloadBtn) {
        downloadBtn.addEventListener('click', () => downloadMeme(slug));
      }

      if (shareBtn) {
        shareBtn.addEventListener('click', () => shareDispatch(slug));
      }

      if (copyBtn) {
        copyBtn.addEventListener('click', () => copyLink(slug));
      }
    }

    window.openModal = openModal;
  }

  // Meme download functionality
  async function downloadMeme(slug) {
    const dispatches = await loadDispatches();
    const dispatch = dispatches.find(d => d.slug === slug);
    
    if (!dispatch) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1200;
    canvas.height = 1200;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgba(242, 199, 191, 0.2)');
    gradient.addColorStop(1, 'rgba(59, 94, 115, 0.15)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Quote text
    ctx.fillStyle = '#1B2943';
    ctx.font = 'bold 48px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const maxWidth = canvas.width - 120;
    const words = dispatch.quote.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) lines.push(currentLine);

    const lineHeight = 70;
    const totalHeight = lines.length * lineHeight;
    const startY = (canvas.height - totalHeight) / 2;

    lines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, startY + (index * lineHeight));
    });

    // Chapter reference
    ctx.font = '16px Inter, sans-serif';
    ctx.fillStyle = '#343642';
    ctx.fillText(`From: ${dispatch.chapter}`, canvas.width / 2, canvas.height - 100);

    // Book attribution
    ctx.font = '14px Inter, sans-serif';
    ctx.fillStyle = '#7C4F6C';
    ctx.fillText('In the Absence of a Soapbox', canvas.width / 2, canvas.height - 60);

    // Download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug}-meme.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // Share functionality
  async function shareDispatch(slug) {
    const dispatches = await loadDispatches();
    const dispatch = dispatches.find(d => d.slug === slug);
    
    if (!dispatch) return;

    const url = `${window.location.origin}${window.location.pathname}#${slug}`;
    const text = `"${dispatch.quote}" - ${dispatch.chapter}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: dispatch.title,
          text: text,
          url: url
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      // Fallback: copy to clipboard
      copyLink(slug);
    }
  }

  function copyLink(slug) {
    const url = `${window.location.origin}${window.location.pathname}#${slug}`;
    navigator.clipboard.writeText(url).then(() => {
      // Show feedback
      const btn = document.querySelector(`[data-action="copy"][data-slug="${slug}"]`);
      if (btn) {
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      }
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }

  // Render all dispatches on archive page
  async function renderDispatchesArchive() {
    const container = document.querySelector('.dispatches-grid');
    if (!container) return;

    const dispatches = await loadDispatches();
    
    // Store dispatches globally for filtering
    window.allDispatches = dispatches;
    window.currentFilter = 'All';

    function renderList(filteredDispatches, basePath = '') {
      if (filteredDispatches.length === 0) {
        container.innerHTML = '<p>No dispatches found.</p>';
        return;
      }
      container.innerHTML = filteredDispatches.map(dispatch => 
        renderDispatchCard(dispatch, basePath)
      ).join('');
    }

    // Initial render
    renderList(dispatches, '../');

    // Filter functionality
    const filterPills = document.querySelectorAll('.pill-filter');
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const tag = pill.dataset.tag || 'All';
        window.currentFilter = tag;

        // Update active state
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        // Filter and render
        const filtered = tag === 'All' 
          ? dispatches 
          : dispatches.filter(d => d.tags.includes(tag));
        
        renderList(filtered, '../');
      });
    });
  }

  // Copy email address functionality
  async function initEmailCopy() {
    const copyBtn = document.querySelector('.btn-copy-email');
    if (!copyBtn) return;

    // Get email from site content
    let email = 'hello@yourdomain.com';
    try {
      const siteContent = await window.getSiteContent ? await window.getSiteContent() : null;
      if (siteContent?.site?.email) {
        email = siteContent.site.email;
      }
    } catch (e) {
      console.log('Using default email');
    }

    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(email);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      } catch (error) {
        console.error('Failed to copy email:', error);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = email;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          copyBtn.textContent = 'Copied!';
          setTimeout(() => {
            copyBtn.textContent = 'Copy email address';
          }, 2000);
        } catch (err) {
          alert('Please copy manually: ' + email);
        }
        document.body.removeChild(textArea);
      }
    });
  }

  // Initialize on DOM ready
  async function init() {
    initMobileNav();
    await renderFeaturedDispatches();
    renderDispatchesArchive();
    initEmailCopy();
    initModal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

