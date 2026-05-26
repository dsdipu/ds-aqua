/* ============================================================
   DS AQUA — Main JavaScript
   ============================================================ */

'use strict';

/* ============================================================
   NAVBAR — Scroll & Mobile Toggle
   ============================================================ */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  // Scroll effect
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    toggleBackToTop();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Active link highlight on scroll
  const sections = document.querySelectorAll('section[id], div[id]');
  const links    = navLinks.querySelectorAll('a[href^="#"]');

  const highlightLink = () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(link => {
      link.classList.toggle('active-link', link.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', highlightLink, { passive: true });
})();

/* ============================================================
   BACK TO TOP
   ============================================================ */
const backToTopBtn = document.getElementById('backToTop');

function toggleBackToTop() {
  backToTopBtn.classList.toggle('visible', window.scrollY > 500);
}

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   BUBBLE ANIMATION (Hero)
   ============================================================ */
(function createBubbles() {
  const container = document.getElementById('bubblesContainer');
  if (!container) return;

  const count = 30;
  for (let i = 0; i < count; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    const size   = Math.random() * 28 + 6;        // 6–34px
    const left   = Math.random() * 100;            // 0–100%
    const delay  = Math.random() * 10;             // 0–10s
    const dur    = Math.random() * 10 + 8;         // 8–18s

    bubble.style.cssText = `
      width:${size}px;
      height:${size}px;
      left:${left}%;
      bottom:${Math.random() * 20}%;
      animation-duration:${dur}s;
      animation-delay:-${delay}s;
    `;
    container.appendChild(bubble);
  }
})();

/* ============================================================
   SWIMMING FISH ANIMATION (Hero)
   ============================================================ */
(function createSwimmingFish() {
  const container = document.getElementById('fishSwim');
  if (!container) return;

  const fishEmojis = ['🐠', '🐟', '🐡', '🦈', '🦐'];
  const count = 6;

  for (let i = 0; i < count; i++) {
    const fish = document.createElement('div');
    fish.className = 'swim-fish';
    fish.textContent = fishEmojis[i % fishEmojis.length];

    const topPct  = Math.random() * 70 + 10;       // 10–80%
    const dur     = Math.random() * 20 + 20;        // 20–40s
    const delay   = -Math.random() * 20;
    const size    = Math.random() * 0.8 + 0.8;      // 0.8–1.6em scale

    fish.style.cssText = `
      top:${topPct}%;
      animation-duration:${dur}s;
      animation-delay:${delay}s;
      font-size:${size * 1.6}rem;
    `;
    container.appendChild(fish);
  }
})();

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
(function initScrollReveal() {
  const items = document.querySelectorAll('[data-reveal]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger siblings inside same parent
        const siblings = [...entry.target.parentElement.querySelectorAll('[data-reveal]')];
        const i = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${i * 0.08}s`;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  items.forEach(el => observer.observe(el));
})();

/* ============================================================
   HERO SECTION — Parallax
   ============================================================ */
(function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const offset = window.scrollY;
    const heroBg = hero.querySelector('.hero-bg');
    if (heroBg) heroBg.style.transform = `translateY(${offset * 0.4}px)`;
  }, { passive: true });
})();

/* ============================================================
   FAQ — Accordion
   ============================================================ */
(function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    const ans = item.querySelector('.faq-a');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-a').style.maxHeight = null;
      });

      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
        ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });
})();

/* ============================================================
   PRICING — Tab Toggle
   ============================================================ */
(function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const content = document.getElementById(target);
      if (content) content.classList.add('active');
    });
  });
})();

/* ============================================================
   REVIEWS — Slider (Mobile & Desktop adaptive)
   ============================================================ */
(function initReviewsSlider() {
  const track    = document.getElementById('reviewsTrack');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('sliderDots');

  if (!track) return;

  const cards  = [...track.querySelectorAll('.review-card')];
  let current  = 0;
  let perPage  = getPerPage();
  let total    = Math.ceil(cards.length / perPage);

  function getPerPage() {
    return window.innerWidth >= 900 ? 3 : window.innerWidth >= 600 ? 2 : 1;
  }

  // Build dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === current ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function updateDisplay() {
    const start = current * perPage;
    cards.forEach((card, i) => {
      card.style.display = (i >= start && i < start + perPage) ? '' : 'none';
    });
    // Track layout fix for CSS grid
    track.style.gridTemplateColumns = `repeat(${perPage}, 1fr)`;
    document.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(idx) {
    current = (idx + total) % total;
    updateDisplay();
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Auto-play
  let autoPlay = setInterval(() => goTo(current + 1), 5000);
  track.addEventListener('mouseenter', () => clearInterval(autoPlay));
  track.addEventListener('mouseleave', () => { autoPlay = setInterval(() => goTo(current + 1), 5000); });

  // Rebuild on resize
  window.addEventListener('resize', () => {
    const newPer = getPerPage();
    if (newPer !== perPage) {
      perPage = newPer;
      total = Math.ceil(cards.length / perPage);
      current = 0;
      buildDots();
      updateDisplay();
    }
  });

  buildDots();
  updateDisplay();
})();

/* ============================================================
   SMOOTH SCROLL for all anchor links
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ============================================================
   GALLERY — Lightbox
   ============================================================ */
(function initLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  // Create lightbox
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.style.cssText = `
    display:none;
    position:fixed;inset:0;
    background:rgba(2,11,24,0.95);
    z-index:9999;
    align-items:center;
    justify-content:center;
    cursor:zoom-out;
    backdrop-filter:blur(8px);
  `;

  const lbImg = document.createElement('img');
  lbImg.style.cssText = `
    max-width:90vw;max-height:85vh;
    border-radius:16px;
    box-shadow:0 0 80px rgba(0,180,216,0.3);
    animation:fadeSlideUp 0.3s ease;
  `;

  const lbClose = document.createElement('button');
  lbClose.textContent = '✕';
  lbClose.style.cssText = `
    position:fixed;top:24px;right:28px;
    font-size:2rem;color:#fff;
    background:rgba(0,180,216,0.2);
    border:none;cursor:pointer;
    width:48px;height:48px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    transition:background .2s;
  `;
  lbClose.onmouseover = () => lbClose.style.background = 'rgba(0,180,216,0.5)';
  lbClose.onmouseout  = () => lbClose.style.background = 'rgba(0,180,216,0.2)';

  lb.appendChild(lbImg);
  lb.appendChild(lbClose);
  document.body.appendChild(lb);

  const openLb = (src) => {
    lbImg.src = src;
    lb.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };
  const closeLb = () => {
    lb.style.display = 'none';
    document.body.style.overflow = '';
  };

  items.forEach(item => {
    const img = item.querySelector('img');
    if (img) {
      item.addEventListener('click', () => openLb(img.src));
    }
  });

  lb.addEventListener('click', e => { if (e.target === lb || e.target === lbClose) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
})();

/* ============================================================
   COUNTER ANIMATION (hero stats)
   ============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  if (!counters.length) return;

  const parseNum = str => {
    const match = str.match(/[\d,]+/);
    if (!match) return { num: 0, prefix: '', suffix: str };
    const num = parseInt(match[0].replace(/,/g, ''));
    const idx = str.indexOf(match[0]);
    return { num, prefix: str.slice(0, idx), suffix: str.slice(idx + match[0].length) };
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const original = el.textContent;
      const { num, prefix, suffix } = parseNum(original);
      let start = 0;
      const dur = 1800;
      const step = (timestamp) => {
        if (!step.startTime) step.startTime = timestamp;
        const progress = Math.min((timestamp - step.startTime) / dur, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = prefix + Math.floor(eased * num).toLocaleString('bn-BD') + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ============================================================
   CARD HOVER — 3D Tilt Effect (subtle)
   ============================================================ */
(function initTiltEffect() {
  const cards = document.querySelectorAll('.fish-card, .why-card, .acc-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -5;
      const rotY = ((x - cx) / cx) * 5;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ============================================================
   PAGE LOAD — Entrance animation
   ============================================================ */
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });
});

/* ============================================================
   WATER RIPPLE EFFECT — click anywhere
   ============================================================ */
document.addEventListener('click', (e) => {
  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position:fixed;
    left:${e.clientX}px;
    top:${e.clientY}px;
    width:0;height:0;
    border-radius:50%;
    border:2px solid rgba(0,180,216,0.5);
    transform:translate(-50%,-50%);
    pointer-events:none;
    z-index:9998;
    animation:rippleOut 0.8s ease-out forwards;
  `;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 800);
});

// Add ripple keyframe dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes rippleOut {
    from { width:0;height:0;opacity:1; }
    to   { width:120px;height:120px;opacity:0; }
  }
  .active-link {
    color: var(--accent) !important;
    background: rgba(0,245,212,0.1) !important;
    border-radius: 8px;
  }
`;
document.head.appendChild(style);

/* ============================================================
   FLOATING WHATSAPP BUTTON
   ============================================================ */
(function addFloatingWA() {
  const floatBtn = document.createElement('a');
  floatBtn.href = 'https://wa.me/8801XXXXXXXXX?text=আমি%20DS%20Aqua%20থেকে%20অর্ডার%20করতে%20চাই';
  floatBtn.target = '_blank';
  floatBtn.setAttribute('aria-label', 'WhatsApp');
  floatBtn.style.cssText = `
    position:fixed;
    bottom:88px;right:28px;
    width:54px;height:54px;
    border-radius:50%;
    background:linear-gradient(135deg,#25d366,#128c7e);
    color:#fff;
    display:flex;align-items:center;justify-content:center;
    font-size:1.6rem;
    box-shadow:0 4px 20px rgba(37,211,102,0.5);
    z-index:899;
    transition:all 0.3s ease;
    text-decoration:none;
  `;
  floatBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
  floatBtn.addEventListener('mouseenter', () => floatBtn.style.transform = 'scale(1.1)');
  floatBtn.addEventListener('mouseleave', () => floatBtn.style.transform = '');

  // Pulse ring
  const pulse = document.createElement('div');
  pulse.style.cssText = `
    position:absolute;inset:-6px;
    border-radius:50%;
    border:2px solid rgba(37,211,102,0.4);
    animation:pulse 2s ease-in-out infinite;
  `;
  floatBtn.style.position = 'fixed';
  floatBtn.appendChild(pulse);
  document.body.appendChild(floatBtn);
})();

console.log('%c🐠 DS Aqua — Premium Aquarium Showcase', 'color:#00b4d8;font-size:16px;font-weight:bold;');
console.log('%c Built with ❤️ for fish lovers of Bangladesh', 'color:#00f5d4;font-size:12px;');
