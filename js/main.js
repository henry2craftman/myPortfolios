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
    var images = document.querySelectorAll('img[loading="lazy"]');
    var pending = 0;

    images.forEach(function (img) {
      img.removeAttribute('loading');
      if (!img.complete) {
        pending++;
        img.onload = img.onerror = function () {
          pending--;
          if (pending === 0) window.print();
        };
      }
    });

    if (pending === 0) window.print();
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

  // --- 3D Isometric Pixel Background ---
  function initBg3D() {
    var canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    var TW = 48;
    var TH = 24;
    var MAX_ELEV = 18;
    var MOUSE_RADIUS = 200;
    var BASE_ALPHA = 0.4;

    var mouse = { x: -9999, y: -9999 };
    var time = 0;
    var scrollY = 0;
    var w, h, gridN, offsetX, offsetY;

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      var needed = Math.ceil(Math.max(w * 2 / TW, h * 2 / TH)) + 6;
      gridN = Math.ceil(needed / 2) + 2;
      offsetX = w / 2;
      offsetY = h / 2 - (gridN - 1) * TH / 2;
    }

    function toScreenX(c, r) {
      return (c - r) * TW / 2 + offsetX;
    }

    function toScreenY(c, r) {
      return (c + r) * TH / 2 + offsetY;
    }

    function getElevation(c, r) {
      var t = time;
      var elev =
        Math.sin(c * 0.13 + t * 0.7) * Math.cos(r * 0.11 + t * 0.5) * 5 +
        Math.sin((c + r) * 0.08 + t * 0.35) * 3.5 +
        Math.sin(c * 0.2 - t * 0.6) * Math.sin(r * 0.16 + t * 0.45) * 2.5;

      var sx = toScreenX(c, r);
      var sy = toScreenY(c, r);
      var dx = mouse.x - sx;
      var dy = mouse.y - sy;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS) {
        var ratio = 1 - dist / MOUSE_RADIUS;
        elev += ratio * ratio * MAX_ELEV;
      }

      return Math.max(0, elev);
    }

    function drawCube(sx, sy, elev) {
      var hw = TW / 2;
      var hh = TH / 2;

      if (elev < 0.5) {
        ctx.globalAlpha = BASE_ALPHA * 0.15;
        ctx.fillStyle = '#d8dae5';
        ctx.beginPath();
        ctx.moveTo(sx, sy - hh);
        ctx.lineTo(sx + hw, sy);
        ctx.lineTo(sx, sy + hh);
        ctx.lineTo(sx - hw, sy);
        ctx.closePath();
        ctx.fill();
        return;
      }

      var ratio = Math.min(elev / MAX_ELEV, 1);
      ctx.globalAlpha = BASE_ALPHA * (0.25 + ratio * 0.75);

      var topCol, leftCol, rightCol;
      if (ratio > 0.55) {
        topCol = '#6a6aaf'; leftCol = '#5252a0'; rightCol = '#3d3d80';
      } else if (ratio > 0.25) {
        topCol = '#9494c0'; leftCol = '#8080b0'; rightCol = '#6b6b9a';
      } else {
        topCol = '#b8b8d8'; leftCol = '#a4a4c8'; rightCol = '#9090b4';
      }

      // Right face
      ctx.fillStyle = rightCol;
      ctx.beginPath();
      ctx.moveTo(sx, sy + hh);
      ctx.lineTo(sx + hw, sy);
      ctx.lineTo(sx + hw, sy - elev);
      ctx.lineTo(sx, sy + hh - elev);
      ctx.closePath();
      ctx.fill();

      // Left face
      ctx.fillStyle = leftCol;
      ctx.beginPath();
      ctx.moveTo(sx, sy + hh);
      ctx.lineTo(sx - hw, sy);
      ctx.lineTo(sx - hw, sy - elev);
      ctx.lineTo(sx, sy + hh - elev);
      ctx.closePath();
      ctx.fill();

      // Top face
      ctx.fillStyle = topCol;
      ctx.beginPath();
      ctx.moveTo(sx, sy - hh - elev);
      ctx.lineTo(sx + hw, sy - elev);
      ctx.lineTo(sx, sy + hh - elev);
      ctx.lineTo(sx - hw, sy - elev);
      ctx.closePath();
      ctx.fill();
    }

    function draw() {
      time += 0.016;
      ctx.clearRect(0, 0, w, h);

      for (var sum = 0; sum < gridN * 2; sum++) {
        for (var c = Math.max(0, sum - gridN + 1); c <= Math.min(sum, gridN - 1); c++) {
          var r = sum - c;
          if (r < 0 || r >= gridN) continue;

          var sx = toScreenX(c, r);
          var sy = toScreenY(c, r);
          if (sx + TW < 0 || sx - TW > w) continue;
          if (sy + TH + MAX_ELEV < 0 || sy - MAX_ELEV > h) continue;

          drawCube(sx, sy, getElevation(c, r));
        }
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }

    window.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', function () {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    window.addEventListener('touchmove', function (e) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', function () {
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
  initBg3D();
  initScrollAnimations();
  handleScroll();
})();
