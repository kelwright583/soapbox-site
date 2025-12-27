/* ============================================
   Content Loader - Loads site content from JSON
   ============================================ */

(async function() {
  'use strict';

  let siteContent = {};

  // Load site content
  async function loadSiteContent() {
    try {
      const basePath = window.location.pathname.includes('/dispatches/') ? '../' : '';
      const response = await fetch(basePath + 'data/site-content.json');
      if (!response.ok) throw new Error('Failed to load site content');
      siteContent = await response.json();
      return siteContent;
    } catch (error) {
      console.error('Error loading site content:', error);
      return null;
    }
  }

  // Render paragraphs from array
  function renderParagraphs(paragraphs, container) {
    if (!paragraphs || !Array.isArray(paragraphs)) return;
    
    container.innerHTML = paragraphs.map(p => {
      // Handle line breaks in paragraphs
      const lines = p.split('<br>');
      if (lines.length > 1) {
        return `<p>${lines.join('<br>')}</p>`;
      }
      return `<p>${p}</p>`;
    }).join('');
  }

  // Load and render content for current page
  async function renderPageContent() {
    const content = await loadSiteContent();
    if (!content) return;

    const path = window.location.pathname;

    // Home page - "What This Is" section
    if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
      const whatThisIsContainer = document.querySelector('[data-content="whatThisIs"]');
      if (whatThisIsContainer && content.homePage?.whatThisIs) {
        renderParagraphs(content.homePage.whatThisIs, whatThisIsContainer);
      }
    }

    // Book page
    if (path.includes('book.html')) {
      if (content.book) {
        // Update book title/subtitle if elements exist
        const bookTitle = document.querySelector('[data-content="bookTitle"]');
        const bookSubtitle = document.querySelector('[data-content="bookSubtitle"]');
        
        if (bookTitle && content.book.title) {
          bookTitle.textContent = content.book.title;
        }
        if (bookSubtitle && content.book.subtitle) {
          bookSubtitle.textContent = content.book.subtitle;
        }

        // Render book description
        const bookDescContainer = document.querySelector('[data-content="bookDescription"]');
        if (bookDescContainer && content.book.description) {
          renderParagraphs(content.book.description, bookDescContainer);
        }

        // Render excerpt
        const excerptContainer = document.querySelector('[data-content="bookExcerpt"]');
        if (excerptContainer && content.book.excerpt) {
          const excerptTitle = content.book.excerpt.title || 'Read the Introduction';
          const excerptContent = content.book.excerpt.content || [];
          
          excerptContainer.innerHTML = `
            <details>
              <summary>${excerptTitle}</summary>
              <div style="margin-top: 1.5rem;">
                ${excerptContent.map(p => `<p>${p}</p>`).join('')}
              </div>
            </details>
          `;
        }

        // Update purchase links
        if (content.book.purchaseLinks) {
          const amazonLink = document.querySelector('[data-link="amazon"]');
          const takealotLink = document.querySelector('[data-link="takealot"]');
          const kindleLink = document.querySelector('[data-link="kindle"]');
          
          if (amazonLink && content.book.purchaseLinks.amazon !== '#') {
            amazonLink.href = content.book.purchaseLinks.amazon;
          }
          if (takealotLink && content.book.purchaseLinks.takealot !== '#') {
            takealotLink.href = content.book.purchaseLinks.takealot;
          }
          if (kindleLink && content.book.purchaseLinks.kindle !== '#') {
            kindleLink.href = content.book.purchaseLinks.kindle;
          }
        }
      }
    }

    // About page
    if (path.includes('about.html')) {
      if (content.about) {
        // Render author bio
        const bioContainer = document.querySelector('[data-content="authorBio"]');
        if (bioContainer && content.about.authorBio) {
          renderParagraphs(content.about.authorBio, bioContainer);
        }

        // Render house rules
        const rulesContainer = document.querySelector('[data-content="houseRules"]');
        if (rulesContainer && content.about.houseRules) {
          rulesContainer.innerHTML = content.about.houseRules.map(rule => 
            `<li>${rule}</li>`
          ).join('');
        }

        // Render "Before You Read"
        const beforeContainer = document.querySelector('[data-content="beforeYouRead"]');
        if (beforeContainer && content.about.beforeYouRead) {
          renderParagraphs(content.about.beforeYouRead, beforeContainer);
        }
      }
    }

    // Update email in correspondence page
    if (path.includes('correspondence.html')) {
      if (content.site?.email) {
        const emailElements = document.querySelectorAll('[data-email]');
        emailElements.forEach(el => {
          if (el.hasAttribute('data-link') && el.getAttribute('data-link') === 'mailto') {
            el.href = `mailto:${content.site.email}`;
          } else if (el.textContent.includes('@')) {
            el.textContent = content.site.email;
          }
        });
      }
    }
  }

  // Make siteContent available globally for carousel
  window.getSiteContent = async function() {
    if (!siteContent.site) {
      await loadSiteContent();
    }
    return siteContent;
  };

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderPageContent);
  } else {
    renderPageContent();
  }
})();

