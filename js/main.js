/* =============================================
   TALENCE INFORMATIXS — Main Script
   ============================================= */

// ---- EmailJS configuration ----
// 1. Sign up at https://www.emailjs.com (free tier: 200 emails/month)
// 2. Add Gmail as an Email Service (use your Gmail + App Password)
// 3. Create an Email Template and note the Template ID
// 4. Copy your Public Key from Account > API Keys
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // e.g. 'abc123XYZ'
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // e.g. 'service_xxxxxxx'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // e.g. 'template_xxxxxxx'

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ---- Mobile hamburger menu ----
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ---- Scroll reveal animation ----
const revealEls = document.querySelectorAll(
  '.service-card, .process-step, .value-item, .contact-item, .about-card, .section-header'
);

revealEls.forEach((el, i) => {
  el.classList.add('reveal');
  if (i % 4 === 1) el.classList.add('reveal-delay-1');
  if (i % 4 === 2) el.classList.add('reveal-delay-2');
  if (i % 4 === 3) el.classList.add('reveal-delay-3');
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => observer.observe(el));

// ---- Active nav link on scroll ----
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? '#6366f1' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ---- Contact form ----
const form = document.getElementById('contactForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = form.querySelector('#name').value.trim();
  const email   = form.querySelector('#email').value.trim();
  const message = form.querySelector('#message').value.trim();

  if (!name || !email || !message) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    showToast('Please enter a valid email address.', 'error');
    return;
  }

  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Sending...';

  const service  = form.querySelector('#service').value;

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    from_name:    name,
    from_email:   email,
    service_type: service || 'Not specified',
    message:      message,
    to_email:     'ab.diaby@gmail.com',
  })
  .then(() => {
    form.reset();
    btn.disabled = false;
    btn.textContent = 'Send Message';
    showToast('Thank you! Your message has been sent. We\'ll be in touch shortly.', 'success');
  })
  .catch((err) => {
    console.error('EmailJS error:', err);
    btn.disabled = false;
    btn.textContent = 'Send Message';

    let errorMsg = 'Sorry, something went wrong. Please try again or email us directly.';

    if (!navigator.onLine) {
      errorMsg = 'No internet connection. Please check your network and try again.';
    } else if (err && err.status === 400) {
      errorMsg = 'Invalid request. Please check your message and try again.';
    } else if (err && err.status === 401) {
      errorMsg = 'Email service not configured correctly. Please contact us directly.';
    } else if (err && err.status === 402) {
      errorMsg = 'Email quota exceeded. Please contact us directly at ab.diaby@gmail.com.';
    } else if (err && err.status === 403) {
      errorMsg = 'Email service access denied. Please contact us directly.';
    } else if (err && (err.status === 500 || err.status === 503)) {
      errorMsg = 'Email service is temporarily unavailable. Please try again in a few minutes.';
    }

    showToast(errorMsg, 'error');
  });
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ---- Toast notification ----
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.cssText = `
      position: fixed;
      bottom: 32px;
      right: 32px;
      z-index: 9999;
      background: ${type === 'success' ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#ef4444,#dc2626)'};
      color: #fff;
      padding: 14px 24px;
      border-radius: 12px;
      font-size: 0.9rem;
      font-weight: 500;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      max-width: 360px;
      line-height: 1.5;
      opacity: 0;
      transform: translateY(12px);
      transition: opacity 0.3s ease, transform 0.3s ease;
    `;
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 10);
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ---- Smooth scroll for all anchor links ----
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
