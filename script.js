'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ── CLOCK ───────────────────────────────── */
  const clockEl = document.getElementById('nav-clock');
  function updateClock() {
    const now = new Date();
    clockEl.textContent =
      String(now.getHours()).padStart(2,'0') + ':' +
      String(now.getMinutes()).padStart(2,'0');
  }
  updateClock();
  setInterval(updateClock, 30000);

  /* ── SMOOTH SCROLL ───────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior:'smooth', block:'start' });
    });
  });

  /* ── DRAWER ──────────────────────────────── */
  const hamburger   = document.getElementById('hamburger');
  const drawer      = document.getElementById('drawer');
  const overlay     = document.getElementById('overlay');
  const drawerClose = document.getElementById('drawer-close');

  const openDrawer  = () => {
    drawer.classList.add('open');
    overlay.classList.add('active');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeDrawer = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('active');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () =>
    drawer.classList.contains('open') ? closeDrawer() : openDrawer()
  );
  drawerClose.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

  /* ── SAKURA ──────────────────────────────── */
  const sakura = document.getElementById('sakura-container');
  const palettes = [
    ['rgba(232,64,90,0.50)',  'rgba(200,80,110,0.28)'],
    ['rgba(123,97,255,0.42)','rgba(160,130,255,0.22)'],
    ['rgba(255,255,255,0.18)','rgba(200,200,255,0.08)'],
    ['rgba(255,180,50,0.26)','rgba(255,140,70,0.13)'],
  ];

  function spawnPetal() {
    const el = document.createElement('div');
    el.className = 'petal';
    const [c1,c2] = palettes[Math.floor(Math.random() * palettes.length)];
    const size = (5 + Math.random() * 8) + 'px';
    const dur  = 13 + Math.random() * 10;
    el.style.cssText = `
      left:${Math.random()*100}vw;
      width:${size}; height:${size};
      background:linear-gradient(135deg,${c1},${c2});
      --dx:${(Math.random()-0.5)*76}px;
      animation-duration:${dur}s;
      animation-delay:${Math.random()*1.5}s;
      border-radius:${50+Math.random()*20}% ${40+Math.random()*20}%
                   ${40+Math.random()*20}% ${50+Math.random()*20}% /
                   ${50+Math.random()*20}% ${50+Math.random()*20}%
                   ${40+Math.random()*20}% ${40+Math.random()*20}%;
    `;
    sakura.appendChild(el);
    setTimeout(() => el.remove(), (dur + 2) * 1000);
  }

  for (let i = 0; i < 7; i++) setTimeout(spawnPetal, i * 250);
  let sakuraTimer = setInterval(spawnPetal, 750);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearInterval(sakuraTimer);
    else sakuraTimer = setInterval(spawnPetal, 750);
  });

  /* ── SCROLL REVEAL ───────────────────────── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      entry.target.querySelectorAll('.skill-bar-fill').forEach((bar, i) => {
        setTimeout(() => bar.classList.add('animated'), i * 90);
      });
      revealObs.unobserve(entry.target);
    });
  }, { threshold: 0.10 });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── CARD TILT ───────────────────────────── */
  const isMobile = /Mobi|Android/i.test(navigator.userAgent) ||
                   window.matchMedia('(pointer:coarse)').matches;

  if (!isMobile) {
    let rafId;
    const MAX = 4.5;
    const clamp = (v,a,b) => Math.min(Math.max(v,a),b);

    document.addEventListener('mousemove', e => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        document.querySelectorAll('.glass-card').forEach(card => {
          const r = card.getBoundingClientRect();
          if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
          const dx = (e.clientX - (r.left + r.width/2))  / (r.width/2);
          const dy = (e.clientY - (r.top  + r.height/2)) / (r.height/2);
          card.style.transform =
            `perspective(900px) rotateX(${clamp(-dy*MAX,-MAX,MAX)}deg) rotateY(${clamp(dx*MAX,-MAX,MAX)}deg) translateY(-3px)`;
        });
      });
    });

    document.addEventListener('mouseleave', () => {
      document.querySelectorAll('.glass-card').forEach(c => c.style.transform = '');
    });
  }

  /* ── NAV SCROLL ──────────────────────────── */
  const islands = document.querySelectorAll('.nav-island');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 40;
    islands.forEach(island => {
      island.style.background = scrolled
        ? 'rgba(6,6,12,0.84)'
        : 'rgba(10,10,18,0.50)';
    });
  }, { passive:true });

  /* ── CONSOLE ─────────────────────────────── */
  console.log('%c✦ Immortal OS','color:#e8405a;font-weight:800;font-size:16px;');
  console.log('%cLiquid Glass · Built with precision.','color:#7b61ff;font-size:12px;');
});
