/* ========================================
   PORTFOLIO - Main JavaScript
   ======================================== */

(function () {
  'use strict';

  // --- State ---
  let currentLang = 'ko';

  // --- DOM References ---
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const langToggle = document.getElementById('langToggle');
  const langToggleMobile = document.getElementById('langToggleMobile');
  const downloadBtn = document.getElementById('downloadPdf');
  const downloadBtnMobile = document.getElementById('downloadPdfMobile');

  // --- Navigation: Scroll Effect ---
  function handleScroll() {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Active link highlight
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-links a');
    let current = '';

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // --- Hamburger Menu ---
  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  // --- Language Toggle ---
  function switchLanguage(lang) {
    currentLang = lang;
    var elements = document.querySelectorAll('[data-ko][data-en]');
    elements.forEach(function (el) {
      el.textContent = el.getAttribute('data-' + lang);
    });

    // Update toggle button text
    var newLabel = lang === 'ko' ? 'EN' : 'KO';
    var toggleSpans = document.querySelectorAll('#langToggle span, #langToggleMobile span');
    toggleSpans.forEach(function (span) {
      span.textContent = newLabel;
    });

    // Update html lang attribute
    document.documentElement.lang = lang === 'ko' ? 'ko' : 'en';
  }

  function toggleLang() {
    switchLanguage(currentLang === 'ko' ? 'en' : 'ko');
  }

  langToggle.addEventListener('click', toggleLang);
  langToggleMobile.addEventListener('click', toggleLang);

  // --- PDF Download (window.print) ---
  function generatePDF() {
    window.print();
  }

  downloadBtn.addEventListener('click', generatePDF);
  downloadBtnMobile.addEventListener('click', generatePDF);

  // --- Scroll Animations (Intersection Observer) ---
  function initScrollAnimations() {
    var animTargets = document.querySelectorAll(
      '.about-card, .skill-card, .timeline-item, .edu-card, .contact-card, .about-personal, .project-card, .project-featured'
    );

    animTargets.forEach(function (el) {
      el.classList.add('fade-in');
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    animTargets.forEach(function (el) {
      observer.observe(el);
    });
  }

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --- Node Filter (Projects) ---
  function initNodeFilter() {
    var filterBtns = document.querySelectorAll('.node-btn[data-filter]');
    var cards = document.querySelectorAll('.project-card[data-cat]');

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = this.getAttribute('data-filter');

        // Update active button
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');

        // Filter cards
        cards.forEach(function (card) {
          var cats = card.getAttribute('data-cat');
          if (filter === 'all' || cats.indexOf(filter) !== -1) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  // --- Gallery Slider ---
  function initGalleries() {
    var galleries = document.querySelectorAll('.project-gallery');

    galleries.forEach(function (gallery) {
      var images = gallery.querySelectorAll('img');
      var counter = gallery.querySelector('.gallery-counter');
      var prevBtn = gallery.querySelector('.gallery-prev');
      var nextBtn = gallery.querySelector('.gallery-next');
      var current = 0;

      if (images.length < 2) return;

      // Initialize: show first image
      images[0].classList.add('gallery-active');

      function showSlide(index) {
        images.forEach(function (img) { img.classList.remove('gallery-active'); });
        current = (index + images.length) % images.length;
        images[current].classList.add('gallery-active');
        if (counter) {
          counter.textContent = (current + 1) + ' / ' + images.length;
        }
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          showSlide(current - 1);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          showSlide(current + 1);
        });
      }
    });
  }

  // --- Interactive Pixel Canvas ---
  function initPixelCanvas() {
    var canvas = document.getElementById('pixelCanvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var hero = document.getElementById('hero');
    var mouse = { x: -9999, y: -9999 };
    var dots = [];
    var SPACING = 28;
    var DOT_BASE = 2;
    var DOT_MAX = 7;
    var INFLUENCE = 120;
    var cols, rows;

    // Colors from CSS variables
    var ACCENT = '#2d2d5e';
    var ACCENT_LIGHT = '#5a5a8f';
    var ACCENT_LIGHTER = '#9494c0';
    var DOT_REST = '#d8dae5';

    function resize() {
      var rect = hero.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      cols = Math.floor(canvas.width / SPACING) + 1;
      rows = Math.floor(canvas.height / SPACING) + 1;

      dots = [];
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          dots.push({
            x: c * SPACING + SPACING / 2,
            y: r * SPACING + SPACING / 2,
            size: DOT_BASE,
            targetSize: DOT_BASE,
            alpha: 0.25,
            targetAlpha: 0.25
          });
        }
      }
    }

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        var dx = mouse.x - d.x;
        var dy = mouse.y - d.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < INFLUENCE) {
          var ratio = 1 - dist / INFLUENCE;
          d.targetSize = DOT_BASE + (DOT_MAX - DOT_BASE) * ratio;
          d.targetAlpha = 0.25 + 0.75 * ratio;
        } else {
          d.targetSize = DOT_BASE;
          d.targetAlpha = 0.25;
        }

        d.size = lerp(d.size, d.targetSize, 0.15);
        d.alpha = lerp(d.alpha, d.targetAlpha, 0.15);

        // Color based on proximity
        var color;
        if (d.size > DOT_BASE + (DOT_MAX - DOT_BASE) * 0.6) {
          color = ACCENT;
        } else if (d.size > DOT_BASE + (DOT_MAX - DOT_BASE) * 0.25) {
          color = ACCENT_LIGHT;
        } else if (d.size > DOT_BASE + 0.3) {
          color = ACCENT_LIGHTER;
        } else {
          color = DOT_REST;
        }

        ctx.globalAlpha = d.alpha;
        ctx.fillStyle = color;
        ctx.fillRect(
          Math.round(d.x - d.size / 2),
          Math.round(d.y - d.size / 2),
          Math.round(d.size),
          Math.round(d.size)
        );
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }

    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    hero.addEventListener('mouseleave', function () {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    // Touch support
    hero.addEventListener('touchmove', function (e) {
      var rect = hero.getBoundingClientRect();
      var touch = e.touches[0];
      mouse.x = touch.clientX - rect.left;
      mouse.y = touch.clientY - rect.top;
    }, { passive: true });

    hero.addEventListener('touchend', function () {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    window.addEventListener('resize', resize);
    resize();
    draw();
  }

  // --- Initialize ---
  initNodeFilter();
  initGalleries();
  initPixelCanvas();
  initScrollAnimations();
  handleScroll();
})();
