// ============================================================
// In the Absence of a Soapbox — content-loader.js
// ============================================================

(async function() {
  // Determine path depth (dispatches/ pages need ../ prefix)
  const isDispatches = window.location.pathname.includes('/dispatches/');
  const base = isDispatches ? '../' : '';

  let dispatches = [];
  try {
    const res = await fetch(`${base}data/dispatches.json`);
    dispatches = await res.json();
  } catch (e) {
    console.warn('Could not load dispatches.json', e);
    return;
  }

  // Helper: format date
  function fmtDate(str) {
    const d = new Date(str);
    return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  // Helper: build card HTML
  function buildCard(d) {
    const href = (d.slug === 'bra-seatbelts' || d.slug === 'turning-thirty')
      ? `${base}dispatches/${d.slug}.html`
      : `${base}dispatches/index.html`;
    const tags = Array.isArray(d.tags) ? d.tags.join(',') : (d.tags || '');
    const tag = Array.isArray(d.tags) ? d.tags[0] : d.tags;
    return `
      <a href="${href}" class="opinion-card" data-tags="${tags}">
        <div class="card-tag">${tag || ''}</div>
        <div class="card-title">${d.title}</div>
        <div class="card-excerpt">${d.excerpt || d.quote || ''}</div>
        <div class="card-footer">
          <span class="card-readtime">${d.readTime || ''}</span>
          <span class="card-date">${d.date ? fmtDate(d.date) : ''}</span>
        </div>
      </a>`;
  }

  // Homepage carousel
  const carouselTrack = document.getElementById('carouselTrack');
  if (carouselTrack) {
    const featured = dispatches.filter(d => d.featured || d.excerpt);
    featured.forEach(d => { carouselTrack.insertAdjacentHTML('beforeend', buildCard(d)); });
    if (typeof window.initCarousel === 'function') window.initCarousel();
  }

  // Dispatches index grid
  const opinionsGrid = document.getElementById('opinionsGrid');
  if (opinionsGrid) {
    dispatches.forEach(d => { opinionsGrid.insertAdjacentHTML('beforeend', buildCard(d)); });
    // Re-run filter logic after cards are added
    const filterPills = document.querySelectorAll('.filter-pill');
    const cards = document.querySelectorAll('.opinion-card[data-tags]');
    if (filterPills.length && cards.length) {
      filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
          filterPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          const tag = pill.dataset.tag;
          cards.forEach(card => {
            const cardTags = (card.dataset.tags || '').split(',').map(t => t.trim());
            card.style.display = (!tag || tag === 'all' || cardTags.includes(tag)) ? '' : 'none';
          });
        });
      });
    }
  }
})();
