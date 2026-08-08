/* =========================================================
   NANDHAKUMAR V M — PORTFOLIO SCRIPT (Apple-Style)
   Sections:
   1. Loading Screen
   2. Ambient Background Glow
   3. Scroll Progress Bar
   4. Sticky Navbar + Mobile Toggle + Active Link
   5. Smooth Scroll (in-page anchors)
   6. Scroll Reveal (IntersectionObserver)
   7. Skills Tabs
   8. Back To Top
   9. Copy Email Button
   10. Contact Form (UI only)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Loading Screen ---------- */
  const loader = document.getElementById('loading-screen');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (loader) loader.classList.add('hidden');
    }, 400);
  });
  // Fallback in case 'load' already fired
  setTimeout(() => { if (loader) loader.classList.add('hidden'); }, 2000);

  /* ---------- 2. Ambient Background Glow ---------- */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    // Apple-style subtle ambient glow — no particles, just soft radial gradients
    const ctx = canvas.getContext('2d');
    let width, height;
    let time = 0;

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function drawAmbient() {
      ctx.clearRect(0, 0, width, height);
      time += 0.003;

      // Soft blue glow - top right
      const x1 = width * 0.7 + Math.sin(time) * 80;
      const y1 = height * 0.2 + Math.cos(time * 0.7) * 60;
      const grad1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, width * 0.4);
      grad1.addColorStop(0, 'rgba(41, 151, 255, 0.06)');
      grad1.addColorStop(1, 'transparent');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Soft purple glow - bottom left
      const x2 = width * 0.25 + Math.cos(time * 0.5) * 60;
      const y2 = height * 0.75 + Math.sin(time * 0.8) * 50;
      const grad2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, width * 0.35);
      grad2.addColorStop(0, 'rgba(100, 100, 255, 0.04)');
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      requestAnimationFrame(drawAmbient);
    }

    resizeCanvas();
    requestAnimationFrame(drawAmbient);

    window.addEventListener('resize', resizeCanvas);
  }

  /* ---------- 3. Scroll Progress Bar ---------- */
  const progressBar = document.getElementById('scroll-progress');
  function updateProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------- 4. Sticky Navbar + Mobile Toggle + Active Link ---------- */
  const navbar = document.querySelector('.navbar');
  function handleNavbarBg() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }
  window.addEventListener('scroll', handleNavbarBg, { passive: true });
  handleNavbarBg();

  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // Active link highlight based on current file name
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---------- 5. Smooth Scroll for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  /* ---------- 6. Scroll Reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal, .timeline-item');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- 7. Skills Tabs ---------- */
  const tabs = document.querySelectorAll('.skills-tab');
  const panels = document.querySelectorAll('.skill-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const targetPanel = document.getElementById(tab.getAttribute('data-target'));
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  /* ---------- 8. Back To Top ---------- */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 9. Copy Email Button ---------- */
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy');
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        const original = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove('copied');
        }, 1800);
      } catch (err) {
        btn.textContent = 'Copy failed';
      }
    });
  });

  /* ---------- 10. Contact Form (UI only, no backend) ---------- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Message Sent ✓';
      contactForm.reset();
      setTimeout(() => { submitBtn.textContent = originalText; }, 2200);
    });
  }

  /* ---------- 11. ProtoSem Journal Pagination ---------- */
  const weekPages = document.querySelectorAll('.week-page');
  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');
  const pageIndicator = document.getElementById('page-indicator');

  if (weekPages.length > 0 && prevBtn && nextBtn && pageIndicator) {
    let currentPage = 0;
    const totalPages = weekPages.length;

    function updatePagination() {
      // Hide all pages
      weekPages.forEach(page => page.classList.remove('active-page'));
      
      // Show current page
      weekPages[currentPage].classList.add('active-page');
      
      // Update text (assuming first page is Week 0)
      pageIndicator.textContent = `Week ${currentPage} of ${totalPages - 1}`;
      
      // Update buttons
      prevBtn.disabled = currentPage === 0;
      nextBtn.disabled = currentPage === totalPages - 1;

      // Scroll to top of the book container smoothly
      const bookContainer = document.querySelector('.journal-book-container');
      if (bookContainer) {
         const y = bookContainer.getBoundingClientRect().top + window.scrollY - 100; // offset for navbar
         window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }

    prevBtn.addEventListener('click', () => {
      if (currentPage > 0) {
        currentPage--;
        updatePagination();
      }
    });

    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages - 1) {
        currentPage++;
        updatePagination();
      }
    });

    // Initialize
    updatePagination();
  }

});
