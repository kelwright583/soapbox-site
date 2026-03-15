// ============================================================
// In the Absence of a Soapbox — main.js
// ============================================================

// --- Nav scroll shadow ---
const nav = document.querySelector('.site-nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// --- Mobile nav ---
const navToggle = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('.nav-mobile');
const mobileClose = document.querySelector('.nav-mobile-close');

if (navToggle && mobileNav) {
  navToggle.addEventListener('click', () => {
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
    navToggle.setAttribute('aria-expanded', 'true');
  });
}
if (mobileClose && mobileNav) {
  mobileClose.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  });
}

// --- Notify Modal ---
const modal = document.getElementById('notifyModal');
const modalOpenBtns = document.querySelectorAll('[data-modal="notify"]');
const modalClose = modal ? modal.querySelector('.modal-close') : null;

function openModal() {
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

modalOpenBtns.forEach(btn => btn.addEventListener('click', openModal));
if (modalClose) modalClose.addEventListener('click', closeModal);
if (modal) {
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// --- Fade-up IntersectionObserver ---
const fadeEls = document.querySelectorAll('.fade-up');
if (fadeEls.length) {
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.08 }
  );
  fadeEls.forEach(el => obs.observe(el));
}

// --- Carousel (homepage) ---
const track = document.getElementById('carouselTrack');
const dotsContainer = document.getElementById('carouselDots');
const prevBtn = document.querySelector('.carousel-btn--prev');
const nextBtn = document.querySelector('.carousel-btn--next');

if (track) {
  let current = 0;

  function getVisible() {
    return window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
  }

  function updateCarousel() {
    const cards = track.querySelectorAll('.opinion-card');
    if (!cards.length) return;
    const visible = getVisible();
    const total = Math.ceil(cards.length / visible);
    current = Math.max(0, Math.min(current, total - 1));
    const cardWidth = cards[0].offsetWidth + 20;
    track.style.transform = `translateX(-${current * visible * cardWidth}px)`;
    if (dotsContainer) {
      dotsContainer.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
    }
  }

  function buildDots() {
    if (!dotsContainer) return;
    const cards = track.querySelectorAll('.opinion-card');
    const visible = getVisible();
    const total = Math.ceil(cards.length / visible);
    dotsContainer.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => { current = i; updateCarousel(); });
      dotsContainer.appendChild(dot);
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { current--; updateCarousel(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { current++; updateCarousel(); });

  window.addEventListener('resize', () => { current = 0; buildDots(); updateCarousel(); });

  // Called after content-loader populates the track
  window.initCarousel = function() {
    buildDots();
    updateCarousel();
    if (prevBtn) prevBtn.style.display = '';
    if (nextBtn) nextBtn.style.display = '';
  };
}

// --- Filter pills (dispatches index) ---
const filterPills = document.querySelectorAll('.filter-pill');
const opinionCards = document.querySelectorAll('.opinion-card[data-tags]');

if (filterPills.length && opinionCards.length) {
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const tag = pill.dataset.tag;
      opinionCards.forEach(card => {
        const tags = (card.dataset.tags || '').split(',').map(t => t.trim());
        card.style.display = (!tag || tag === 'all' || tags.includes(tag)) ? '' : 'none';
      });
    });
  });
}
