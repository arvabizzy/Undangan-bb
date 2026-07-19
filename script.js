/* ==============================================
   UNDANGAN PERNIKAHAN – KONGHUCU WEDDING
   script.js  –  Vanilla JS
   ============================================== */

'use strict';

/* ────────────────────────────────────────────
   CONFIG
──────────────────────────────────────────── */
const WEDDING_DATE = new Date('2025-08-17T08:00:00+07:00');
const MAX_UCAPAN   = 50;   // max komentar yang ditampilkan

/* ────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────── */
function $(sel, ctx = document)  { return ctx.querySelector(sel); }
function $$(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; }

function pad2(n) { return String(n).padStart(2, '0'); }

function showToast(msg, duration = 2800) {
  const toast = $('#toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), duration);
}

function timeAgo(date) {
  const secs = Math.floor((Date.now() - date) / 1000);
  if (secs < 5)   return 'Baru saja';
  if (secs < 60)  return `${secs} detik lalu`;
  if (secs < 3600) return `${Math.floor(secs / 60)} menit lalu`;
  if (secs < 86400) return `${Math.floor(secs / 3600)} jam lalu`;
  return `${Math.floor(secs / 86400)} hari lalu`;
}

function getInitial(name) {
  return name.trim().charAt(0).toUpperCase();
}

/* ────────────────────────────────────────────
   1. COVER PAGE – OPEN INVITATION
──────────────────────────────────────────── */
(function initCover() {
  const coverPage   = $('#cover-page');
  const mainContent = $('#main-content');
  const openBtn     = $('#open-invitation-btn');

  if (!openBtn) return;

  openBtn.addEventListener('click', function () {
    // Animate cover out
    coverPage.style.transition = 'opacity .8s ease, transform .8s ease';
    coverPage.style.opacity    = '0';
    coverPage.style.transform  = 'scale(1.04)';

    setTimeout(() => {
      coverPage.style.display = 'none';
      mainContent.classList.remove('hidden');

      // Trigger scroll-reveal for first visible section
      setTimeout(triggerReveal, 100);
    }, 800);
  });
})();

/* ────────────────────────────────────────────
   2. FALLING PETALS (plum blossom)
──────────────────────────────────────────── */
(function initPetals() {
  const containers = [
    $('#petals-container'),
    $('#petal-overlay')
  ].filter(Boolean);

  const PETAL_SVG = `
    <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="10" cy="6" rx="4" ry="6" fill="currentColor" opacity=".85" transform="rotate(0 10 10)"/>
      <ellipse cx="10" cy="6" rx="4" ry="6" fill="currentColor" opacity=".85" transform="rotate(72 10 10)"/>
      <ellipse cx="10" cy="6" rx="4" ry="6" fill="currentColor" opacity=".85" transform="rotate(144 10 10)"/>
      <ellipse cx="10" cy="6" rx="4" ry="6" fill="currentColor" opacity=".85" transform="rotate(216 10 10)"/>
      <ellipse cx="10" cy="6" rx="4" ry="6" fill="currentColor" opacity=".85" transform="rotate(288 10 10)"/>
    </svg>`;

  const COLORS = ['#c8102e', '#e8304a', '#d4af37', '#ff6b8a', '#ff8fab'];

  function createPetal(container) {
    const el    = document.createElement('div');
    const size  = 10 + Math.random() * 16;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const dur   = 6 + Math.random() * 8;
    const delay = Math.random() * 8;
    const startX = Math.random() * 110 - 5;
    const swing  = 60 + Math.random() * 80;
    const rot    = Math.random() * 360;

    el.innerHTML = PETAL_SVG;
    el.style.cssText = `
      position:absolute;
      top:-40px;
      left:${startX}%;
      width:${size}px;
      height:${size}px;
      color:${color};
      animation: petalFall ${dur}s ${delay}s linear infinite;
      transform: rotate(${rot}deg);
      pointer-events:none;
    `;

    // Inject keyframes once
    if (!document.querySelector('#petal-kf')) {
      const style = document.createElement('style');
      style.id = 'petal-kf';
      style.textContent = `
        @keyframes petalFall {
          0%   { transform: translateY(0) translateX(0) rotate(0deg); opacity: 1; }
          25%  { transform: translateY(25vh) translateX(${swing}px) rotate(120deg); }
          50%  { transform: translateY(50vh) translateX(0) rotate(240deg); }
          75%  { transform: translateY(75vh) translateX(-${swing}px) rotate(320deg); }
          100% { transform: translateY(110vh) translateX(0) rotate(480deg); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    container.appendChild(el);
  }

  containers.forEach(container => {
    const count = window.innerWidth < 600 ? 6 : 10;
    for (let i = 0; i < count; i++) createPetal(container);
  });
})();

/* ────────────────────────────────────────────
   3. NAVIGATION
──────────────────────────────────────────── */
(function initNav() {
  const nav         = $('#main-nav');
  const hamburger   = $('#nav-hamburger');
  const navLinks    = $('.nav-links');
  const allLinks    = $$('.nav-link');

  // Scrolled shadow
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Hamburger toggle
  hamburger?.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('open', !expanded);
  });

  // Close mobile menu on link click
  allLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
    });
  });

  // Active link on scroll
  const sections = $$('section[id]');
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        allLinks.forEach(l => l.classList.remove('active'));
        const target = $(`[data-section="${entry.target.id.replace('section-', '')}"]`);
        target?.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => navObserver.observe(s));
})();

/* ────────────────────────────────────────────
   4. SCROLL REVEAL
──────────────────────────────────────────── */
function triggerReveal() {
  const items = $$('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(el => observer.observe(el));
}

// Also run on load (after cover dismissed)
document.addEventListener('DOMContentLoaded', triggerReveal);

/* ────────────────────────────────────────────
   5. COUNTDOWN TIMER
──────────────────────────────────────────── */
(function initCountdown() {
  // 1. Fungsi pembantu lokal (tidak akan bentrok keluar)
  function pad2(num) {
    return String(num).padStart(2, '0');
  }

  // 2. Target Tanggal Pernikahan ke Tahun 2028
  // Format: YYYY-MM-DDTHH:mm:ss
  const WEDDING_DATE = new Date('2027-07-13T10:00:00').getTime();

  // 3. Mengambil elemen DOM menggunakan jQuery ($) sesuai bawaan kode lu
  const cdDays    = $('#cd-days');
  const cdHours   = $('#cd-hours');
  const cdMinutes = $('#cd-minutes');
  const cdSeconds = $('#cd-seconds');

  // Proteksi: Jika elemen countdown tidak ditemukan di halaman ini,
  // fungsi langsung berhenti dengan aman tanpa menghasilkan error di konsol.
  if (!cdDays || !cdHours || !cdMinutes || !cdSeconds) return;

  function updateTick(el, val) {
    const formatted = pad2(val);
    if (el.textContent !== formatted) {
      el.textContent = formatted;
      el.classList.remove('tick');
      void el.offsetWidth; // reflow
      el.classList.add('tick');
    }
  }

  function tick() {
    const now  = Date.now();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      [cdDays, cdHours, cdMinutes, cdSeconds].forEach(el => {
        if (el) el.textContent = '00';
      });
      const timer = $('#countdown-timer');
      if (timer) {
        const p = document.createElement('p');
        p.style.cssText = 'color:var(--gold);font-family:var(--font-title);font-size:1.2rem;position:relative;z-index:1;padding:1rem;';
        p.textContent   = '🎉 Hari Bahagia Telah Tiba! 囍';
        timer.replaceWith(p);
      }
      return;
    }

    const totalSec = Math.floor(diff / 1000);
    const d = Math.floor(totalSec / 86400);
    const h = Math.floor((totalSec % 86400) / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;

    updateTick(cdDays,    d);
    updateTick(cdHours,   h);
    updateTick(cdMinutes, m);
    updateTick(cdSeconds, s);
  }

  tick();
  setInterval(tick, 1000);
})();

/* ────────────────────────────────────────────
   6. COPY TO CLIPBOARD
──────────────────────────────────────────── */
(function initCopyButtons() {
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-copy');
    if (!btn) return;

    const text  = btn.dataset.copy;
    const label = btn.dataset.label || 'Teks';

    navigator.clipboard.writeText(text).then(() => {
      btn.classList.add('copied');
      const originalHTML = btn.innerHTML;
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Tersalin!
      `;
      showToast(`✅ ${label || text} berhasil disalin!`);

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('copied');
      }, 2500);
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity  = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast(`✅ ${label || text} disalin!`);
    });
  });
})();

/* ────────────────────────────────────────────
   7. GALLERY LIGHTBOX
──────────────────────────────────────────── */
(function initLightbox() {
  const lightbox = $('#lightbox');
  const lbImg    = $('#lightbox-img');
  const lbClose  = $('#lightbox-close');

  if (!lightbox) return;

  function openLightbox(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || 'Foto';
    lightbox.classList.add('active');
    lightbox.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  // Open on gallery item click / enter key
  document.addEventListener('click', e => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;
    openLightbox(item.dataset.src, item.querySelector('img')?.alt);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const item = e.target.closest('.gallery-item');
      if (item) openLightbox(item.dataset.src, item.querySelector('img')?.alt);
    }
    if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
  });

  lbClose?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
})();

/* ────────────────────────────────────────────
   8. RSVP FORM
──────────────────────────────────────────── */
(function initRSVP() {
  const form = $('#rsvp-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = $('#rsvp-name')?.value.trim();
    const attend  = $('#rsvp-attend')?.value;
    const guests  = $('#rsvp-guests')?.value || 1;
    const message = $('#rsvp-message')?.value.trim();

    if (!name) {
      showToast('⚠️ Mohon isi nama Anda!');
      $('#rsvp-name')?.focus();
      return;
    }
    if (!attend) {
      showToast('⚠️ Mohon pilih konfirmasi kehadiran!');
      $('#rsvp-attend')?.focus();
      return;
    }

    const attendMap = {
      'hadir'       : '✅ Hadir',
      'tidak-hadir' : '❌ Tidak Hadir',
      'mungkin'     : '🤔 Mungkin Hadir'
    };

    showToast(`🎉 Terima kasih, ${name}! Status: ${attendMap[attend]}`);

    // Jika ada pesan, tambahkan ke ucapan
    if (message) {
      addUcapan(name, message);
    }

    // Auto scroll ke ucapan jika berhasil
    setTimeout(() => {
      $('#section-ucapan')?.scrollIntoView({ behavior: 'smooth' });
    }, 1200);

    form.reset();
  });
})();

/* ────────────────────────────────────────────
   9. UCAPAN / COMMENT SYSTEM
──────────────────────────────────────────── */
// In-memory store (persists for session)
const ucapanStore = [];

function addUcapan(name, text, timestamp = new Date()) {
  const ucapanList = $('#ucapan-list');
  if (!ucapanList) return;

  // Guard max
  if (ucapanStore.length >= MAX_UCAPAN) {
    ucapanStore.shift();
    ucapanList.querySelector('.ucapan-item')?.remove();
  }

  const entry = { name, text, timestamp };
  ucapanStore.push(entry);

  const item = document.createElement('div');
  item.className = 'ucapan-item';
  item.setAttribute('role', 'article');
  item.setAttribute('aria-label', `Ucapan dari ${name}`);
  item.innerHTML = `
    <div class="ucapan-avatar" aria-hidden="true">${getInitial(name)}</div>
    <div class="ucapan-body">
      <div class="ucapan-header">
        <strong class="ucapan-author">${escHtml(name)}</strong>
        <time class="ucapan-time" datetime="${timestamp.toISOString()}">${timeAgo(timestamp)}</time>
      </div>
      <p class="ucapan-text">${escHtml(text)}</p>
    </div>
  `;

  // Prepend (newest first)
  ucapanList.insertBefore(item, ucapanList.firstChild);

  // Scroll to newly added
  item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function escHtml(str) {
  return str
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#039;');
}

(function initUcapan() {
  const form = $('#ucapan-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const namaEl  = $('#ucapan-nama');
    const teksEl  = $('#ucapan-teks');
    const nama    = namaEl?.value.trim();
    const teks    = teksEl?.value.trim();

    if (!nama) {
      showToast('⚠️ Mohon isi nama Anda!');
      namaEl?.focus();
      return;
    }
    if (!teks) {
      showToast('⚠️ Mohon tulis ucapan Anda!');
      teksEl?.focus();
      return;
    }

    addUcapan(nama, teks);
    showToast('💌 Ucapan Anda telah terkirim! Terima kasih 🙏');
    form.reset();
    namaEl?.focus();
  });
})();



/* ────────────────────────────────────────────
   10. SMOOTH NAV SCROLL (offset for fixed nav)
──────────────────────────────────────────── */
(function initSmoothScroll() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    e.preventDefault();
    const navH   = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
    const top    = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
})();

/* ────────────────────────────────────────────
   11. PARALLAX (subtle on desktop)
──────────────────────────────────────────── */
(function initParallax() {
  if (window.innerWidth < 768) return; // skip on mobile

  const bgs = $$('.section-bg-img');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    bgs.forEach(bg => {
      const rect    = bg.closest('.section')?.getBoundingClientRect();
      if (!rect) return;
      const offset  = rect.top;
      const shift   = offset * 0.15;
      bg.style.transform = `translateY(${shift}px) scale(1.05)`;
    });
  }, { passive: true });
})();

/* ────────────────────────────────────────────
   12. UPDATE UCAPAN TIME AGO (live)
──────────────────────────────────────────── */
(function startTimeAgoUpdater() {
  setInterval(() => {
    $$('.ucapan-item .ucapan-time').forEach(el => {
      const dt = el.getAttribute('datetime');
      if (dt) {
        el.textContent = timeAgo(new Date(dt));
      }
    });
  }, 30000); // every 30 s
})();

/* ────────────────────────────────────────────
   13. KEYBOARD TRAP IN LIGHTBOX
──────────────────────────────────────────── */
(function initLightboxTrap() {
  const lightbox = $('#lightbox');
  if (!lightbox) return;

  lightbox.addEventListener('keydown', e => {
    if (e.key === 'Tab') {
      e.preventDefault();
      $('#lightbox-close')?.focus();
    }
  });
})();

/* ────────────────────────────────────────────
   14. INIT on DOMContentLoaded
──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Ensure main content is hidden initially (cover shows first)
  const mainContent = $('#main-content');
  if (mainContent && !mainContent.classList.contains('hidden')) {
    mainContent.classList.add('hidden');
  }

  console.log('%c囍 Undangan Pernikahan Loaded 囍', [
    'font-size:16px',
    'color:#d4af37',
    'background:#1a0a0a',
    'padding:8px 16px',
    'border-radius:4px'
  ].join(';'));
});
