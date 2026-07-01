/* =============================================================
   WEDDING WEBSITE — Harapriya & Arijeet
   main.js
   Sections:
     1. DOOR    — 3D double-door opening animation
     2. PETALS  — Falling rose petals in the hero
     3. GSAP    — Hero text entrance (triggered after door opens)
     4. COUNTDOWN — Live countdown to July 8, 2026
     5. SCRATCH — Gold foil scratch card to reveal date & venue
     6. AOS     — Scroll-reveal animations (initialised after door)
   ============================================================= */


/* ── 1. DOOR ────────────────────────────────────────────────── */

const doorOverlay = document.getElementById('door-overlay');

function openDoors() {
  doorOverlay.classList.add('open');

  // After the door swing animation finishes, hide the overlay
  setTimeout(() => {
    doorOverlay.classList.add('hidden');
    startHeroAnimation();   // GSAP entrance
    startPetals();          // Rose petals begin falling
    startMusic();           // Background music begins
    AOS.init({              // Scroll animations are live now
      duration: 800,
      easing:   'ease-out-cubic',
      once:     true,
      offset:   60
    });
  }, 1550);
}

doorOverlay.addEventListener('click',      openDoors);
doorOverlay.addEventListener('touchstart', openDoors, { passive: true });


/* ── 2. ROSE PETALS ─────────────────────────────────────────── */
// CSS-animated petals — more realistic than circular particles

const PETAL_COLOURS = [
  '#c0392b', '#e74c3c', '#ff6b8a',
  '#ffb6c1', '#ffc0cb', '#C9A84C', '#E8CC80'
];
const petalsContainer = document.getElementById('petals-container');
let petalsRunning = false;

function spawnPetal() {
  if (!petalsRunning) return;

  const petal = document.createElement('div');
  petal.className = 'petal';

  const size     = 8 + Math.random() * 10;   // 8–18 px wide
  const duration = 5 + Math.random() * 5;    // 5–10 s to fall
  const startX   = Math.random() * 100;      // 0–100 vw

  petal.style.cssText = `
    width:  ${size}px;
    height: ${size * 1.6}px;
    left:   ${startX}vw;
    background: ${PETAL_COLOURS[Math.floor(Math.random() * PETAL_COLOURS.length)]};
    animation-duration: ${duration}s;
    animation-delay: 0s;
    transform: rotate(${Math.random() * 360}deg);
  `;

  petalsContainer.appendChild(petal);
  setTimeout(() => petal.remove(), duration * 1000 + 200);
}

function startPetals() {
  petalsRunning = true;
  // Initial burst — spawn several petals at once
  for (let i = 0; i < 12; i++) {
    setTimeout(spawnPetal, i * 180);
  }
  // Then keep spawning continuously
  setInterval(spawnPetal, 350);
}


/* ── 3. GSAP — Hero entrance timeline ──────────────────────── */
// Called only after the door finishes opening

// Mark wrap when real photo loads; hide img on error so placeholder shows
const heroPhotoEl = document.getElementById('hero-photo');
if (heroPhotoEl) {
  heroPhotoEl.addEventListener('load',  () => {
    document.getElementById('hero-photo-wrap').classList.add('photo-loaded');
  });
  heroPhotoEl.addEventListener('error', () => {
    heroPhotoEl.style.display = 'none';
  });
}

function startHeroAnimation() {
  // Text panel starts shifted right + invisible
  gsap.set('.hero-content', { x: 60, opacity: 0 });
  // Individual text items start shifted down (opacity 0 via CSS)
  gsap.set([
    '.hero-ornament', '.hero-subtitle', '.hero-names', '.hero-divider'
  ], { y: 28 });

  gsap.timeline({ delay: 0.1 })
    // Photo wipes in from left edge via clip-path
    .to('.hero-photo-wrap', {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.4,
        ease: 'power3.inOut'
      }, 0)
    // Text panel slides in from right, overlapping
    .to('.hero-content', { opacity: 1, x: 0, duration: 1.1, ease: 'power3.out' }, 0.6)
    .to('.hero-ornament', { opacity: 0.8, y: 0, duration: 1,   ease: 'power3.out' }, 0.75)
    .to('.hero-subtitle', { opacity: 1,   y: 0, duration: 1,   ease: 'power3.out' }, '-=0.75')
    .to('.hero-names',    { opacity: 1,   y: 0, duration: 1,   ease: 'power3.out' }, '-=0.75')
    .to('.hero-divider',  { opacity: 1,   y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    // Sparkles scatter across the photo once it's fully revealed
    .call(spawnSparkles, [], 1.5);
}

/* ── 3b. SPARKLES — gold burst on the photo for ~4 s ────────── */

const SPARKLE_CHARS  = ['✦', '✧', '✶', '★', '✸', '⋆', '✷', '✺'];
const SPARKLE_COLORS = ['#E8CC80', '#C9A84C', '#F5E0A0', '#ffffff', '#ffdd88'];

function spawnSparkles() {
  const container = document.getElementById('hero-sparkles');
  if (!container) return;

  for (let i = 0; i < 30; i++) {
    const el    = document.createElement('span');
    el.className = 'sparkle';
    el.textContent = SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)];

    const size  = 12 + Math.random() * 22;      // 12–34 px
    const left  =  4 + Math.random() * 90;      // 4–94 %
    const top   =  4 + Math.random() * 90;      // 4–94 %
    const delay = Math.random() * 3.0;           // stagger across 3 s
    const dur   = 0.7 + Math.random() * 0.8;    // 0.7–1.5 s each

    el.style.cssText = `
      left:      ${left}%;
      top:       ${top}%;
      font-size: ${size}px;
      color:     ${SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)]};
      --delay:   ${delay}s;
      --dur:     ${dur}s;
    `;

    container.appendChild(el);
    setTimeout(() => el.remove(), (delay + dur + 0.15) * 1000);
  }
}


/* ── 4. COUNTDOWN TIMER ─────────────────────────────────────── */

const weddingDate = new Date('2026-07-08T10:00:00');

function updateCountdown() {
  const diff = weddingDate - new Date();

  if (diff <= 0) {
    ['cd-days', 'cd-hours', 'cd-mins', 'cd-secs'].forEach(id => {
      document.getElementById(id).textContent = '00';
    });
    return;
  }

  document.getElementById('cd-days').textContent  = String(Math.floor(diff / 86400000)).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
  document.getElementById('cd-mins').textContent  = String(Math.floor((diff % 3600000)  / 60000)).padStart(2, '0');
  document.getElementById('cd-secs').textContent  = String(Math.floor((diff % 60000)    / 1000)).padStart(2, '0');
}

// Keep the countdown ticking even while it's hidden
updateCountdown();
setInterval(updateCountdown, 1000);


/* ── 5. SCRATCH CARD ────────────────────────────────────────── */

window.addEventListener('load', initScratchCard);

function initScratchCard() {
  const canvas     = document.getElementById('scratch-canvas');
  const hiddenText = document.querySelector('.scratch-hidden-text');
  if (!canvas || !hiddenText) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  // Size the canvas to exactly cover the hidden text area
  const rect = hiddenText.getBoundingClientRect();
  const W = rect.width;
  const H = rect.height;

  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width  = W + 'px';
  canvas.style.height = H + 'px';
  ctx.scale(dpr, dpr);

  // Draw the gold foil scratch surface
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0,    '#B8882A');
  grad.addColorStop(0.25, '#E8CC80');
  grad.addColorStop(0.5,  '#F5E0A0');
  grad.addColorStop(0.75, '#E8CC80');
  grad.addColorStop(1,    '#B8882A');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Add a subtle cross-hatch texture
  ctx.strokeStyle = 'rgba(160, 110, 20, 0.18)';
  ctx.lineWidth = 0.8;
  for (let x = 0; x < W; x += 12) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 12) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // "SCRATCH HERE" instruction on the foil
  ctx.fillStyle   = 'rgba(74, 19, 32, 0.7)';
  ctx.font        = `bold ${Math.round(W * 0.042)}px Cinzel, serif`;
  ctx.textAlign   = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✦   SCRATCH HERE   ✦', W / 2, H / 2);

  // ── Scratch interaction ──
  let painting = false;

  function getXY(e) {
    const r   = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return {
      x: src.clientX - r.left,
      y: src.clientY - r.top
    };
  }

  function scratchAt(x, y) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();
    checkIfDone();
  }

  function checkIfDone() {
    const data    = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let cleared   = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 128) cleared++;
    }
    if (cleared / (canvas.width * canvas.height) > 0.55) {
      revealDate();
    }
  }

  canvas.addEventListener('mousedown',   e => { painting = true;  const p = getXY(e); scratchAt(p.x, p.y); });
  canvas.addEventListener('mousemove',   e => { if (!painting) return; const p = getXY(e); scratchAt(p.x, p.y); });
  canvas.addEventListener('mouseup',     () => painting = false);
  canvas.addEventListener('mouseleave',  () => painting = false);
  canvas.addEventListener('touchstart',  e => { e.preventDefault(); painting = true;  const p = getXY(e); scratchAt(p.x, p.y); }, { passive: false });
  canvas.addEventListener('touchmove',   e => { e.preventDefault(); if (!painting) return; const p = getXY(e); scratchAt(p.x, p.y); }, { passive: false });
  canvas.addEventListener('touchend',    () => painting = false);

  // Show a fallback "tap to reveal" button after 5 seconds
  setTimeout(() => {
    const skipBtn = document.getElementById('scratch-skip');
    if (skipBtn) skipBtn.style.display = 'inline-block';
  }, 5000);
}

// Called when scratch is complete or skip button is clicked
window.revealDate = function () {
  const canvas  = document.getElementById('scratch-canvas');
  const skipBtn = document.getElementById('scratch-skip');

  if (canvas)  canvas.style.opacity = '0';
  if (skipBtn) skipBtn.style.display = 'none';

  setTimeout(() => {
    if (canvas) canvas.style.display = 'none';

    const countdown = document.getElementById('countdown-section');
    if (!countdown) return;
    countdown.style.display   = 'block';
    countdown.style.opacity   = '0';
    countdown.style.transition = 'opacity 0.9s ease';
    // Force reflow so transition fires
    void countdown.offsetHeight;
    countdown.style.opacity   = '1';
  }, 750);
};



/* ── 7. BACKGROUND MUSIC ────────────────────────────────────── */
/*
  Add your music file to the music/ folder:
    music/background.mp3   ← primary (MP3 works in all browsers)
    music/background.ogg   ← optional fallback

  Recommended: soft instrumental — shehnai, sitar, piano, or strings.
  Keep the file under 5 MB for fast loading. Volume is set to 30%.
*/

const bgMusic     = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
const musicIcon   = document.getElementById('music-icon');

function startMusic() {
  if (!bgMusic) return;
  bgMusic.volume = 0.3;

  // Fade in gradually so it doesn't startle
  bgMusic.volume = 0;
  bgMusic.play().then(() => {
    fadeInMusic();
    musicToggle.classList.add('playing');
  }).catch(() => {
    // Autoplay blocked in some edge cases — button still works manually
  });
}

function fadeInMusic() {
  const target = 0.3;
  const step   = 0.01;
  const timer  = setInterval(() => {
    if (bgMusic.volume < target - step) {
      bgMusic.volume = Math.min(bgMusic.volume + step, target);
    } else {
      bgMusic.volume = target;
      clearInterval(timer);
    }
  }, 80);
}

// Toggle mute / unmute on button click
if (musicToggle) {
  musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play();
      musicToggle.classList.add('playing');
      musicToggle.classList.remove('muted');
      musicIcon.textContent = '♪';
    } else {
      bgMusic.pause();
      musicToggle.classList.remove('playing');
      musicToggle.classList.add('muted');
      musicIcon.textContent = '♪';
    }
  });
}
