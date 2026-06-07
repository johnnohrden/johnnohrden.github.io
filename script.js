/* ═══════════════════════════════════════════
   JOHN NOHRDEN — Portfolio Script
══════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ─────────────────────────────────────────
   LOADER
───────────────────────────────────────── */
function initLoader() {
  const loader = $('#loader');
  const tl = gsap.timeline({
    onComplete: () => {
      gsap.to(loader, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          loader.style.display = 'none';
          document.body.style.overflow = '';
          initHeroEntrance();
        }
      });
    }
  });

  document.body.style.overflow = 'hidden';
  tl.to('.loader-fill', { width: '100%', duration: 1.0, ease: 'power2.inOut' }, 0.3);
}

/* ─────────────────────────────────────────
   HERO ENTRANCE
───────────────────────────────────────── */
function initHeroEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Eyebrow chars stagger
  tl.to('.eyebrow-char, .eyebrow-sep', {
    opacity: 1,
    y: 0,
    stagger: 0.04,
    duration: 0.6
  }, 0);

  // Scramble the name
  tl.add(() => {
    $$('.scramble').forEach((el, i) => {
      setTimeout(() => scramble(el, el.dataset.text), i * 180);
    });
  }, 0.3);

  // Tagline, sub, location, scroll hint
  tl.to('.hero-tagline', { opacity: 1, y: 0, duration: 0.8 }, 0.9);
  tl.to('.hero-sub', { opacity: 1, y: 0, duration: 0.8 }, 1.05);
  tl.to('.hero-location', { opacity: 1, duration: 0.7 }, 1.3);
  tl.to('.hero-scroll-hint', { opacity: 1, duration: 0.7 }, 1.4);

  // Registration crosshairs draw in
  tl.to('.hmark', { opacity: 0.5, duration: 0.7, stagger: 0.08 }, 1.15);
}

/* ─────────────────────────────────────────
   TEXT SCRAMBLE
───────────────────────────────────────── */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function scramble(el, finalText, duration = 1200) {
  el.style.opacity = 1;
  let frame = 0;
  const totalFrames = duration / 40;
  const len = finalText.length;

  const tick = () => {
    el.textContent = finalText.split('').map((ch, i) => {
      const resolved = Math.floor((frame / totalFrames) * len);
      if (i < resolved) return ch;
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    }).join('');

    frame++;
    if (frame <= totalFrames) requestAnimationFrame(tick);
    else el.textContent = finalText;
  };

  requestAnimationFrame(tick);
}

/* ─────────────────────────────────────────
   CURSOR
───────────────────────────────────────── */
function initCursor() {
  const dot  = $('#cursorDot');
  const ring = $('#cursorRing');

  let mx = -100, my = -100;
  let rx = -100, ry = -100;
  let raf;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    raf = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover state
  const hoverEls = $$('a, button, .contact-link, .edu-card, .exp-item');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('is-hovering'));
  });

  document.addEventListener('mousedown', () => document.body.classList.add('is-clicking'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('is-clicking'));

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '';
    ring.style.opacity = '';
  });
}

/* ─────────────────────────────────────────
   SCROLL PROGRESS
───────────────────────────────────────── */
function initScrollProgress() {
  const bar = $('#scrollBar');
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    bar.style.width = (pct * 100) + '%';
  }, { passive: true });
}

/* ─────────────────────────────────────────
   NAV SCROLL STATE
───────────────────────────────────────── */
function initNav() {
  const nav = $('#nav');
  const threshold = 60;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > threshold);
  }, { passive: true });
}

/* ─────────────────────────────────────────
   THEME TOGGLE
───────────────────────────────────────── */
function initTheme() {
  const btn  = $('#themeBtn');
  const html = document.documentElement;
  const stored = localStorage.getItem('jn-theme');

  if (stored) html.dataset.theme = stored;

  btn.addEventListener('click', () => {
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    html.dataset.theme = next;
    localStorage.setItem('jn-theme', next);
  });
}

/* ─────────────────────────────────────────
   SCROLL ANIMATIONS – ABOUT
───────────────────────────────────────── */
function initAbout() {
  // Image reveal: slide mask away
  ScrollTrigger.create({
    trigger: '.img-reveal-wrap',
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.to('.img-mask', {
        scaleY: 0,
        transformOrigin: 'top',
        duration: 1.1,
        ease: 'power3.inOut'
      });
    }
  });

  // Heading reveal
  revealOnScroll('.about-text-col .sec-heading', { y: 40 });

  // Body text
  revealOnScroll('.about-body', { y: 30, delay: 0.2 });

  // Stats
  $$('.stat').forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo(el, { opacity: 0, y: 20 }, {
          opacity: 1, y: 0, duration: 0.7, delay: i * 0.12, ease: 'power3.out'
        });
        const counter = el.querySelector('.counter');
        if (counter) animateCounter(counter);
      }
    });
  });
}

/* ─────────────────────────────────────────
   COUNTER ANIMATION
───────────────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  let start = 0;
  const duration = 1200;
  const startTime = performance.now();

  const tick = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target);
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

/* ─────────────────────────────────────────
   SCROLL ANIMATIONS – EXPERIENCE
───────────────────────────────────────── */
function initExperience() {
  $$('.exp-item').forEach((item) => {
    const rule  = item.querySelector('.exp-rule');
    const inner = item.querySelector('.exp-inner');

    if (!rule) return;

    ScrollTrigger.create({
      trigger: item,
      start: 'top 82%',
      once: true,
      onEnter: () => {
        gsap.to(rule, {
          scaleX: 1,
          duration: 0.8,
          ease: 'power3.out'
        });
        if (inner) {
          gsap.to(inner, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: 0.2,
            ease: 'power3.out'
          });
        }
      }
    });
  });

  revealOnScroll('#experience .sec-heading', { y: 40 });
}

/* ─────────────────────────────────────────
   SCROLL ANIMATIONS – EDUCATION
───────────────────────────────────────── */
function initEducation() {
  revealOnScroll('#education .sec-heading', { y: 40 });

  $$('.edu-card').forEach((card, i) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: (i % 2) * 0.12,
          ease: 'power3.out'
        });
      }
    });
  });
}

/* ─────────────────────────────────────────
   SCROLL ANIMATIONS – LEADERSHIP
───────────────────────────────────────── */
function initLeadership() {
  revealOnScroll('#leadership .sec-heading', { y: 40 });

  $$('.lead-item').forEach((item) => {
    const rule  = item.querySelector('.lead-rule');
    const inner = item.querySelector('.lead-inner');

    if (!rule) return;

    ScrollTrigger.create({
      trigger: item,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(rule, { scaleX: 1, duration: 0.7, ease: 'power3.out' });
        if (inner) {
          gsap.to(inner, {
            opacity: 1, y: 0, duration: 0.65, delay: 0.15, ease: 'power3.out'
          });
        }
      }
    });
  });
}

/* ─────────────────────────────────────────
   SCROLL ANIMATIONS – CONTACT
───────────────────────────────────────── */
function initContact() {
  revealOnScroll('.contact-heading', { y: 40 });

  $$('.cl-rule, .contact-link').forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        if (el.classList.contains('cl-rule')) {
          gsap.to(el, { scaleX: 1, duration: 0.7, ease: 'power3.out' });
        } else {
          gsap.to(el, {
            opacity: 1, x: 0, duration: 0.65, delay: 0.15, ease: 'power3.out'
          });
        }
      }
    });
  });
}

/* ─────────────────────────────────────────
   GENERIC REVEAL HELPER
───────────────────────────────────────── */
function revealOnScroll(selector, { y = 30, delay = 0 } = {}) {
  $$(selector).forEach(el => {
    gsap.set(el, { opacity: 0, y });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 82%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: 'power3.out'
        });
      }
    });
  });
}

/* ─────────────────────────────────────────
   PARALLAX — HERO GRADIENT
───────────────────────────────────────── */
function initParallax() {
  const gradient = $('.hero-gradient');
  if (!gradient) return;

  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    gsap.to(gradient, {
      x,
      y,
      duration: 1.8,
      ease: 'power1.out'
    });
  });
}

/* ─────────────────────────────────────────
   SEC-LABEL ROWS REVEAL
───────────────────────────────────────── */
function initSectionLabels() {
  $$('.sec-label-row').forEach(row => {
    gsap.set(row, { opacity: 0, x: -20 });
    ScrollTrigger.create({
      trigger: row,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(row, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' });
      }
    });
  });
}

/* ─────────────────────────────────────────
   MAGNETIC EFFECT — SUBTLE
───────────────────────────────────────── */
function initMagnetic() {
  $$('.theme-btn, .nav-logo').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * 0.25;
      const dy = (e.clientY - cy) * 0.25;
      gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

/* ─────────────────────────────────────────
   SMOOTH ANCHOR SCROLL
───────────────────────────────────────── */
function initSmoothAnchors() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ─────────────────────────────────────────
   REDUCED MOTION
───────────────────────────────────────── */
const prefersReducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─────────────────────────────────────────
   SCROLL PARALLAX — depth on scrub
───────────────────────────────────────── */
function initScrollParallax() {
  if (prefersReducedMotion) return;

  // Hero drifts up + fades as it leaves the viewport
  gsap.to('.hero-body', {
    y: -120,
    opacity: 0.15,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6
    }
  });

  // Hero backdrop layers move at different rates (depth)
  gsap.to('.hero-noise',    { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-gradient', { yPercent: 30, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // About image block drifts for parallax depth
  // (targets the column, not .about-photo, to preserve its CSS zoom + hover)
  gsap.fromTo('.about-img-col',
    { y: 40 },
    {
      y: -40,
      ease: 'none',
      scrollTrigger: { trigger: '.about-grid', start: 'top bottom', end: 'bottom top', scrub: 1 }
    }
  );
}

/* ─────────────────────────────────────────
   VELOCITY-REACTIVE MARQUEE
───────────────────────────────────────── */
function initMarqueeMotion() {
  const inners = $$('.marquee-inner');
  const track  = $('.marquee-track');
  if (!inners.length || !track || prefersReducedMotion) return;

  // Take over the CSS animation so we can modulate speed + skew live
  inners.forEach(el => { el.style.animation = 'none'; });

  const BASE = 1;               // baseline timeScale (normal drift speed)
  const tween = gsap.to(inners, {
    xPercent: -50,
    repeat: -1,
    duration: 24,
    ease: 'none'
  });

  const skewTo = gsap.quickTo(inners, 'skewX', { duration: 0.5, ease: 'power3' });
  let idle;

  ScrollTrigger.create({
    trigger: track,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: self => {
      const v = self.getVelocity();
      const dir = self.direction === 1 ? 1 : -1;          // 1 = scrolling down
      // Speed scales with how fast you scroll; direction follows scroll direction
      const speed = BASE + gsap.utils.clamp(0, 7, Math.abs(v) / 180);
      tween.timeScale(speed * dir);
      // Lean the type into the motion
      skewTo(gsap.utils.clamp(-6, 6, -v / 420));

      // When scrolling stops, ease everything back to a calm baseline
      clearTimeout(idle);
      idle = setTimeout(() => {
        gsap.to(tween, { timeScale: BASE * dir, duration: 0.6, ease: 'power2.out' });
        skewTo(0);
      }, 120);
    }
  });
}

/* ─────────────────────────────────────────
   3D TILT — EDUCATION CARDS
───────────────────────────────────────── */
function initCardTilt() {
  if (prefersReducedMotion) return;
  if (window.matchMedia('(hover: none)').matches) return;

  $$('.edu-card').forEach(card => {
    const rotX = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3' });
    const rotY = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3' });
    const lift = gsap.quickTo(card, 'y',          { duration: 0.5, ease: 'power3' });

    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width  - 0.5;
      const py = (e.clientY - r.top)  / r.height - 0.5;
      rotY(px * 8);
      rotX(-py * 8);
      lift(-6);
    });

    card.addEventListener('mouseleave', () => {
      rotX(0); rotY(0); lift(0);
    });
  });
}

/* ─────────────────────────────────────────
   EXPERIENCE LOGO REVEAL
───────────────────────────────────────── */
function initLogoReveal() {
  $$('.exp-logo').forEach(logo => {
    gsap.set(logo, { opacity: 0, y: 12, filter: 'brightness(0) invert(1) blur(6px)' });
    ScrollTrigger.create({
      trigger: logo.closest('.exp-item'),
      start: 'top 82%',
      once: true,
      onEnter: () => {
        gsap.to(logo, {
          opacity: 0.82,
          y: 0,
          filter: 'brightness(0) invert(1) blur(0px)',
          duration: 0.9,
          delay: 0.1,
          ease: 'power3.out'
        });
      }
    });
  });
}

/* ─────────────────────────────────────────
   SIDE INDEX RAIL — scroll-active state
───────────────────────────────────────── */
function initRail() {
  const items = $$('.rail-item');
  if (!items.length) return;

  items.forEach(item => {
    const id  = item.getAttribute('href').slice(1);
    const sec = document.getElementById(id);
    if (!sec) return;

    ScrollTrigger.create({
      trigger: sec,
      start: 'top center',
      end: 'bottom center',
      onToggle: self => {
        if (self.isActive) {
          items.forEach(i => i.classList.remove('is-active'));
          item.classList.add('is-active');
        }
      }
    });
  });
}

/* ─────────────────────────────────────────
   INIT
───────────────────────────────────────── */
function init() {
  initTheme();
  initCursor();
  initScrollProgress();
  initNav();
  initParallax();
  initSectionLabels();
  initMagnetic();
  initSmoothAnchors();
  initAbout();
  initExperience();
  initEducation();
  initLeadership();
  initContact();
  initScrollParallax();
  initMarqueeMotion();
  initCardTilt();
  initLogoReveal();
  initRail();
  initLoader();
}

document.addEventListener('DOMContentLoaded', init);
