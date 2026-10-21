/**
 * ============================================================
 * NTOKOZO ZULU – PORTFOLIO SCRIPT
 * script.js
 * ============================================================
 *
 * TABLE OF CONTENTS
 * -----------------
 * 01. DOM Utilities
 * 02. Current Year (Footer)
 * 03. Navigation – Scroll behaviour & active link
 * 04. Mobile Navigation Toggle
 * 05. Typing Animation (Hero)
 * 06. Scroll-Reveal Animations (Intersection Observer)
 * 07. Back to Top Button
 * 08. Contact Form Validation
 * 09. Smooth Scroll for anchor links (fallback)
 * 10. Init – Wire everything up
 * ============================================================
 */

'use strict';


/* ============================================================
   01. DOM UTILITIES
   ============================================================ */

/**
 * Shorthand querySelector
 * @param {string} selector
 * @param {Document|Element} [ctx=document]
 * @returns {Element|null}
 */
const $ = (selector, ctx = document) => ctx.querySelector(selector);

/**
 * Shorthand querySelectorAll → Array
 * @param {string} selector
 * @param {Document|Element} [ctx=document]
 * @returns {Element[]}
 */
const $$ = (selector, ctx = document) => Array.from(ctx.querySelectorAll(selector));


/* ============================================================
   02. CURRENT YEAR (Footer)
   ============================================================ */
function setCurrentYear() {
  const yearEl = $('#currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}


/* ============================================================
   03. NAVIGATION – Scroll behaviour & active link
   ============================================================ */

/**
 * Add/remove .scrolled class on the navbar when the user scrolls.
 * Also shows/hides the back-to-top button.
 */
function initNavScroll() {
  const navbar    = $('#navbar');
  const backToTop = $('#backToTop');

  if (!navbar) return;

  const onScroll = () => {
    const scrolled = window.scrollY > 60;
    navbar.classList.toggle('scrolled', scrolled);
    if (backToTop) backToTop.classList.toggle('visible', scrolled);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

/**
 * Highlight the nav link whose section is currently visible.
 * Uses IntersectionObserver for accuracy.
 */
function initActiveNavLink() {
  const navLinks = $$('.nav-link');
  if (!navLinks.length) return;

  const sectionIds = navLinks
    .map(link => link.getAttribute('href'))
    .filter(href => href && href.startsWith('#'))
    .map(href => href.slice(1));

  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.remove('active'));
          const id   = entry.target.id;
          const link = navLinks.find(l => l.getAttribute('href') === `#${id}`);
          if (link) link.classList.add('active');
        }
      });
    },
    {
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0,
    }
  );

  sections.forEach(section => observer.observe(section));
}


/* ============================================================
   04. MOBILE NAVIGATION TOGGLE
   ============================================================ */
function initMobileNav() {
  const hamburger = $('#hamburger');
  const navLinks  = $('#navLinks');

  if (!hamburger || !navLinks) return;

  // Toggle menu open/closed
  const toggleMenu = (forceClose = false) => {
    const isOpen = !forceClose && !navLinks.classList.contains('open');
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));

    // Prevent background scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => toggleMenu());

  // Close menu when a nav link is clicked
  navLinks.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-link')) {
      toggleMenu(true);
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      toggleMenu(true);
      hamburger.focus();
    }
  });

  // Close menu if user clicks outside the nav area
  document.addEventListener('click', (e) => {
    const isOutside = !navLinks.contains(e.target) && !hamburger.contains(e.target);
    if (isOutside && navLinks.classList.contains('open')) {
      toggleMenu(true);
    }
  });
}


/* ============================================================
   05. TYPING ANIMATION (Hero Section)
   ============================================================ */
function initTypingAnimation() {
  const target = $('#typedText');
  if (!target) return;

  // Phrases to cycle through
  const phrases = [
    'Aspiring Software Developer',
    'Computer Science Student',
    'Future Full-Stack Developer',
    'Problem Solver',
    'Lifelong Learner',
  ];

  let phraseIndex  = 0;
  let charIndex    = 0;
  let isDeleting   = false;
  let isPaused     = false;

  const TYPE_SPEED   = 80;   // ms per character while typing
  const DELETE_SPEED = 45;   // ms per character while deleting
  const PAUSE_AFTER  = 1800; // ms to pause after fully typed
  const PAUSE_BEFORE = 300;  // ms to pause before typing next phrase

  function type() {
    if (isPaused) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      // Remove a character
      charIndex--;
      target.textContent = currentPhrase.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;

        // Pause briefly before typing next phrase
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          requestAnimationFrame(() => setTimeout(type, TYPE_SPEED));
        }, PAUSE_BEFORE);
        return;
      }

      setTimeout(type, DELETE_SPEED);
    } else {
      // Add a character
      charIndex++;
      target.textContent = currentPhrase.slice(0, charIndex);

      if (charIndex === currentPhrase.length) {
        // Pause at full word before deleting
        isPaused = true;
        setTimeout(() => {
          isDeleting = true;
          isPaused   = false;
          setTimeout(type, DELETE_SPEED);
        }, PAUSE_AFTER);
        return;
      }

      setTimeout(type, TYPE_SPEED);
    }
  }

  // Small initial delay so the page loads first
  setTimeout(type, 800);
}


/* ============================================================
   06. SCROLL-REVEAL ANIMATIONS (Intersection Observer)
   ============================================================ */
function initRevealAnimations() {
  // Respect reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealEls = $$('.reveal, .reveal-left, .reveal-right');
  if (!revealEls.length) return;

  // If reduced motion is preferred, immediately reveal all elements
  if (prefersReducedMotion) {
    revealEls.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // animate only once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealEls.forEach(el => observer.observe(el));
}


/* ============================================================
   07. BACK TO TOP BUTTON
   ============================================================ */
function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ============================================================
   08. CONTACT FORM VALIDATION
   ============================================================ */

/**
 * Validate a single field and update its error state.
 * @param {HTMLInputElement|HTMLTextAreaElement} field
 * @param {HTMLElement} errorEl
 * @returns {boolean} Whether the field is valid
 */
function validateField(field, errorEl) {
  const value = field.value.trim();
  let message = '';

  switch (field.name) {
    case 'name':
      if (!value) {
        message = 'Please enter your full name.';
      } else if (value.length < 2) {
        message = 'Name must be at least 2 characters.';
      }
      break;

    case 'email':
      if (!value) {
        message = 'Please enter your email address.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        message = 'Please enter a valid email address.';
      }
      break;

    case 'subject':
      if (!value) {
        message = 'Please enter a subject.';
      } else if (value.length < 3) {
        message = 'Subject must be at least 3 characters.';
      }
      break;

    case 'message':
      if (!value) {
        message = 'Please write a message.';
      } else if (value.length < 10) {
        message = 'Message must be at least 10 characters.';
      }
      break;
  }

  errorEl.textContent = message;
  field.classList.toggle('is-invalid', Boolean(message));
  field.classList.toggle('is-valid',   !message && value.length > 0);

  return !message;
}

function initContactForm() {
  const form       = $('#contactForm');
  if (!form) return;

  const nameField    = $('#contactName');
  const emailField   = $('#contactEmail');
  const subjectField = $('#contactSubject');
  const messageField = $('#contactMessage');
  const submitBtn    = $('#submitBtn');
  const formStatus   = $('#formStatus');

  const fields = [
    { el: nameField,    err: $('#nameError')    },
    { el: emailField,   err: $('#emailError')   },
    { el: subjectField, err: $('#subjectError') },
    { el: messageField, err: $('#messageError') },
  ].filter(f => f.el && f.err);

  // Live validation on blur (once user has left the field)
  fields.forEach(({ el, err }) => {
    el.addEventListener('blur', () => validateField(el, err));
    el.addEventListener('input', () => {
      // Only re-validate if already flagged invalid (avoids premature errors)
      if (el.classList.contains('is-invalid')) {
        validateField(el, err);
      }
    });
  });

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields
    const results = fields.map(({ el, err }) => validateField(el, err));
    const allValid = results.every(Boolean);

    if (!allValid) {
      // Focus first invalid field for accessibility
      const firstInvalidField = fields.find(({ el }) => el.classList.contains('is-invalid'));
      if (firstInvalidField) firstInvalidField.el.focus();
      return;
    }

    // Simulate a successful submission (no backend connected yet)
    // ----------------------------------------------------------
    // DEVELOPER NOTE:
    // Replace this simulation block with a real fetch() / XMLHttpRequest
    // call to your form backend (Formspree, EmailJS, your own API, etc.)
    //
    // Example with Formspree:
    //   fetch('https://formspree.io/f/YOUR_FORM_ID', {
    //     method: 'POST',
    //     body: new FormData(form),
    //     headers: { 'Accept': 'application/json' },
    //   })
    //   .then(res => res.ok ? showSuccess() : showError())
    //   .catch(() => showError());
    // ----------------------------------------------------------

    // Disable submit button while "sending"
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Sending…';

    setTimeout(() => {
      // Reset button
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').textContent = 'Send Message';

      // Show success message
      formStatus.textContent =
        '✓ Message received! (Note: this is a demo — connect a backend to send real emails.) I\'ll be in touch soon.';
      formStatus.className = 'form-status success';

      // Reset the form
      form.reset();
      fields.forEach(({ el, err }) => {
        el.classList.remove('is-valid', 'is-invalid');
        err.textContent = '';
      });

      // Scroll status into view
      formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Auto-hide the status after 8 seconds
      setTimeout(() => {
        formStatus.className = 'form-status';
        formStatus.textContent = '';
      }, 8000);
    }, 1200); // Simulate network delay
  });
}


/* ============================================================
   09. THEME TOGGLE (Light / Dark mode)
   ============================================================ */

/**
 * Reads the saved theme from localStorage, applies it, and wires
 * up the toggle button so the preference persists across page loads.
 *
 * Convention:
 *   - Default (no attribute / attribute = "dark") → dark theme
 *   - data-theme="light" on <html>                → light theme
 */
function initThemeToggle() {
  const btn  = $('#themeToggle');
  const html = document.documentElement;

  if (!btn) return;

  // Apply saved preference immediately (before first paint)
  const saved = localStorage.getItem('theme');
  if (saved === 'light') {
    html.setAttribute('data-theme', 'light');
    btn.setAttribute('aria-label', 'Switch to dark mode');
  }

  btn.addEventListener('click', () => {
    const isLight = html.getAttribute('data-theme') === 'light';

    // 1. Fire the ripple animation on the button
    btn.classList.remove('ripple');
    // Force a reflow so removing+re-adding the class always restarts the animation
    void btn.offsetWidth;
    btn.classList.add('ripple');

    // 2. Small delay lets the ripple start before the colour wash lands,
    //    making the transition feel intentional rather than instantaneous.
    setTimeout(() => {
      if (isLight) {
        html.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
        btn.setAttribute('aria-label', 'Switch to light mode');
      } else {
        html.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        btn.setAttribute('aria-label', 'Switch to dark mode');
      }
    }, 80); // 80 ms — ripple starts, then colours flow in

    // 3. Clean up the ripple class once the animation finishes
    btn.addEventListener('animationend', () => btn.classList.remove('ripple'), { once: true });
  });
}


/* ============================================================
   10. SMOOTH SCROLL FALLBACK
   CSS `scroll-behavior: smooth` handles most cases, but this
   ensures anchor links inside JS-generated content also work.
   ============================================================ */
function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href').slice(1);
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();

    const navHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
      10
    ) || 70;

    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top, behavior: 'smooth' });
  });
}


/* ============================================================
   11. INIT – Wire everything up on DOMContentLoaded
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  setCurrentYear();
  initNavScroll();
  initActiveNavLink();
  initMobileNav();
  initTypingAnimation();
  initRevealAnimations();
  initBackToTop();
  initContactForm();
  initSmoothScroll();
  initThemeToggle();

  // Log a friendly greeting in the console for fellow developers
  console.log(
    '%c👋 Hi there, developer!\n%cYou\'re looking at Ntokozo Zulu\'s portfolio.\nBuilt with HTML5, CSS3, and vanilla JavaScript.',
    'font-size:16px; font-weight:bold; color:#6366f1;',
    'font-size:13px; color:#94a3b8;'
  );
});
