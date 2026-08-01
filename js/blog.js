/* =============================================
   TALENCE INFORMATIXS — Blog Script
   ============================================= */

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ---- Mobile hamburger menu ----
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

// ---- Scroll reveal animation ----
const revealEls = document.querySelectorAll(
  '.article-card, .video-card, .section-header, .related-grid .article-card'
);

revealEls.forEach((el, i) => {
  el.classList.add('reveal');
  const delay = i % 4;
  if (delay === 1) el.classList.add('reveal-delay-1');
  if (delay === 2) el.classList.add('reveal-delay-2');
  if (delay === 3) el.classList.add('reveal-delay-3');
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ---- Blog filter tabs (All / Articles / Videos) ----
const filterTabs = document.querySelectorAll('.blog-tab');
const blogCards  = document.querySelectorAll('[data-type]');

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const filter = tab.dataset.filter;
    blogCards.forEach(card => {
      const show = filter === 'all' || card.dataset.type === filter;
      card.style.display = show ? '' : 'none';
    });
  });
});

// ---- Video modal ----
// NOTE: video cards carry a data-video-id placeholder (e.g. "REPLACE_WITH_YOUTUBE_ID_1").
// Swap those for real YouTube video IDs when the videos are ready.
const videoModal = document.getElementById('videoModal');

if (videoModal) {
  const modalFrame = videoModal.querySelector('iframe');
  const modalTitle = videoModal.querySelector('.video-modal-title');
  const closeBtn   = videoModal.querySelector('.video-modal-close');

  function openModal(videoId, title) {
    modalFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    modalTitle.textContent = title || '';
    videoModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    videoModal.classList.remove('open');
    modalFrame.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => {
      openModal(card.dataset.videoId, card.dataset.title);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('open')) closeModal();
  });
}

// ---- Smooth scroll for in-page anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
