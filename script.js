document.addEventListener('DOMContentLoaded', () => {
 
  // ── Hamburger / Drawer ────────────────────────
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('drawer');
  const overlay   = document.getElementById('overlay');
  const drawerClose = document.getElementById('drawer-close');
 
  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('active');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('active');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }
 
  hamburger.addEventListener('click', () =>
    drawer.classList.contains('open') ? closeDrawer() : openDrawer()
  );
  drawerClose.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
 
  // ── Sakura petals ──────────────────────────────
  const sakuraContainer = document.getElementById('sakura-container');
  const PETAL_SYMBOLS = ['💎', '🌸', '✦', '◇'];
 
  function spawnPetal() {
    const el = document.createElement('div');
    el.className = 'petal';
 
    const useEmoji = Math.random() < 0.3;
    if (useEmoji) {
      el.textContent = PETAL_SYMBOLS[Math.floor(Math.random() * PETAL_SYMBOLS.length)];
      el.style.cssText = 'font-size:14px;background:none;border-radius:0;';
    }
 
    el.style.left = Math.random() * 100 + 'vw';
    el.style.setProperty('--dx', (Math.random() - 0.5) * 80 + 'px');
 
    const dur = 12 + Math.random() * 8;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay    = Math.random() * 2 + 's';
 
    const size = (6 + Math.random() * 8) + 'px';
    el.style.width  = size;
    el.style.height = size;
 
    sakuraContainer.appendChild(el);
    setTimeout(() => el.remove(), (dur + 2) * 1000);
  }
 
  // Initial burst
  for (let i = 0; i < 10; i++) setTimeout(spawnPetal, i * 200);
 
  // Ongoing interval, paused when tab is hidden
  let sakuraTimer = setInterval(spawnPetal, 600);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearInterval(sakuraTimer);
    else sakuraTimer = setInterval(spawnPetal, 600);
  });
 
  // ── Casino ────────────────────────────────────
  const SLOT_SYMBOLS = ['💎', '🎰', '🔥', '💀', '🍀', '👑', '⚡', '🌸'];
  const s1        = document.getElementById('s1');
  const s2        = document.getElementById('s2');
  const s3        = document.getElementById('s3');
  const spinBtn   = document.getElementById('spin-btn');
  const casinoMsg = document.getElementById('casino-msg');
  const slotsWrap = document.getElementById('slots-wrap');
 
  spinBtn.addEventListener('click', () => {
    if (spinBtn.disabled) return;
    spinBtn.disabled = true;
    slotsWrap.classList.remove('slot-win');
    casinoMsg.textContent  = 'Spinning…';
    casinoMsg.style.color  = '';
 
    [s1, s2, s3].forEach(el => el.classList.add('spinning'));
 
    let tick = 0;
    const iv = setInterval(() => {
      s1.textContent = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
      s2.textContent = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
      s3.textContent = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
      tick++;
 
      if (tick > 22) {
        clearInterval(iv);
        [s1, s2, s3].forEach(el => el.classList.remove('spinning'));
        spinBtn.disabled = false;
 
        const r1 = s1.textContent, r2 = s2.textContent, r3 = s3.textContent;
 
        if (r1 === r2 && r2 === r3) {
          casinoMsg.textContent = '🏆 JACKPOT! You won everything!';
          casinoMsg.style.color = '#ffd700';
          slotsWrap.classList.add('slot-win');
        } else if (r1 === r2 || r2 === r3 || r1 === r3) {
          casinoMsg.textContent = '✨ Nice pair! Almost there.';
          casinoMsg.style.color = '#a08cf0';
        } else {
          casinoMsg.textContent = 'Not today. Try again.';
          casinoMsg.style.color = '';
        }
      }
    }, 70);
  });
 
  // ── Scroll reveal ──────────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
 
      // Animate skill bars once visible
      entry.target.querySelectorAll('.skill-bar-fill').forEach((bar, i) => {
        const w = parseFloat(bar.style.getPropertyValue('--w')) || 0.7;
        bar.style.transform = `scaleX(${w})`;
        setTimeout(() => bar.classList.add('animated'), i * 100);
      });
    });
  }, { threshold: 0.12 });
 
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
 
  // ── Card tilt parallax (desktop only) ──────────
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
 
  if (!isMobile) {
    let raf;
    document.addEventListener('mousemove', e => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        document.querySelectorAll('.glass-card').forEach(card => {
          const rect = card.getBoundingClientRect();
          const dx = (e.clientX - (rect.left + rect.width  / 2)) / rect.width;
          const dy = (e.clientY - (rect.top  + rect.height / 2)) / rect.height;
          card.style.transform =
            `perspective(800px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg) translateY(-4px)`;
        });
      });
    });
 
    document.addEventListener('mouseleave', () => {
      document.querySelectorAll('.glass-card').forEach(card => {
        card.style.transform = '';
      });
    });
  }
 
  // ── Nav scroll shrink ──────────────────────────
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.style.background = 'rgba(5,5,10,0.75)';
      nav.style.top = '10px';
    } else {
      nav.style.background = 'rgba(10,10,16,0.55)';
      nav.style.top = '16px';
    }
  }, { passive: true });
 
  console.log('%c✦ Immortal OS — Liquid Glass Edition', 'color:#e8405a;font-weight:800;font-size:14px;');
  console.log('%cBuilt with precision. Runs on vibes.', 'color:#7b61ff;');
});
