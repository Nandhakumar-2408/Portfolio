/* =========================================================
   NANDHAKUMAR V M — PORTFOLIO SCRIPT (Vanilla JS)
   Sections:
   1. Loading Screen
   2. Particle / Circuit Background
   3. Scroll Progress Bar
   4. Sticky Navbar + Mobile Toggle + Active Link
   5. Smooth Scroll (in-page anchors)
   6. Typing Effect (home page)
   7. Scroll Reveal (IntersectionObserver)
   8. Skill Progress Bars + Counter Animation
   9. Skills Tabs
   10. Back To Top
   11. Copy Email Button
   12. Contact Form (UI only)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Loading Screen ---------- */
  const loader = document.getElementById('loading-screen');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (loader) loader.classList.add('hidden');
    }, 450);
  });
  // Fallback in case 'load' already fired
  setTimeout(() => { if (loader) loader.classList.add('hidden'); }, 2500);

  /* ---------- 2. Particle / Circuit Background ---------- */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;
    const MAX_DIST = 140;

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function initParticles() {
      const count = Math.min(70, Math.floor((width * height) / 18000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6
      }));
    }

    function step() {
      ctx.clearRect(0, 0, width, height);

      // update + draw nodes
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(96,165,250,0.75)';
        ctx.fill();
      });

      // draw circuit-like connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(59,130,246,${(1 - dist / MAX_DIST) * 0.25})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(step);
    }

    resizeCanvas();
    initParticles();
    requestAnimationFrame(step);

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });
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

  /* ---------- 6. Typing Effect ---------- */
  const typingEl = document.getElementById('typing-text');
  if (typingEl) {
    const phrases = JSON.parse(typingEl.getAttribute('data-phrases') || '[]');
    let phraseIndex = 0, charIndex = 0, deleting = false;

    function typeLoop() {
      const current = phrases[phraseIndex];
      if (!deleting) {
        charIndex++;
        typingEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(typeLoop, 1500);
          return;
        }
      } else {
        charIndex--;
        typingEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }
      setTimeout(typeLoop, deleting ? 40 : 70);
    }
    if (phrases.length) typeLoop();
  }

  /* ---------- 7. Scroll Reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal, .timeline-item');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- 8. Skill Progress Bars + Counter Animation ---------- */
  const progressFills = document.querySelectorAll('.progress-fill');
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const pct = fill.getAttribute('data-percent') || '0';
        fill.style.width = pct + '%';

        const pctLabel = fill.closest('.skill-card')?.querySelector('.skill-pct');
        if (pctLabel) {
          let current = 0;
          const target = parseInt(pct, 10);
          const step = Math.max(1, Math.floor(target / 40));
          const counter = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(counter);
            }
            pctLabel.textContent = current + '%';
          }, 20);
        }
        progressObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });
  progressFills.forEach(fill => progressObserver.observe(fill));

  /* ---------- 9. Skills Tabs ---------- */
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
        // re-trigger progress animation for newly shown panel
        targetPanel.querySelectorAll('.progress-fill').forEach(fill => {
          const pct = fill.getAttribute('data-percent') || '0';
          fill.style.width = '0%';
          requestAnimationFrame(() => {
            setTimeout(() => { fill.style.width = pct + '%'; }, 30);
          });
        });
      }
    });
  });

  /* ---------- 10. Back To Top ---------- */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 11. Copy Email Button ---------- */
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

  /* ---------- 12. Contact Form (UI only, no backend) ---------- */
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

});
