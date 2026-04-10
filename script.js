'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════════════
     CURSOR
  ══════════════════════════════════════════ */
  const cursorGlow = document.getElementById('cursor-glow');
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // CSS custom props for the ::after dot
    document.documentElement.style.setProperty('--cx', mouseX + 'px');
    document.documentElement.style.setProperty('--cy', mouseY + 'px');
  });

  // Smooth glow follow
  (function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    if (cursorGlow) {
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top  = glowY + 'px';
    }
    requestAnimationFrame(animateGlow);
  })();

  /* ══════════════════════════════════════════
     PARTICLE CANVAS
  ══════════════════════════════════════════ */
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x    = Math.random() * canvas.width;
      this.y    = Math.random() * canvas.height;
      this.r    = Math.random() * 1.2 + 0.3;
      this.vx   = (Math.random() - 0.5) * 0.3;
      this.vy   = (Math.random() - 0.5) * 0.3;
      this.life = Math.random();
      this.maxLife = Math.random() * 0.006 + 0.002;
      this.hue  = Math.random() < 0.5 ? 350 : 260; // red or purple
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.maxLife;
      if (this.life <= 0 ||
          this.x < 0 || this.x > canvas.width ||
          this.y < 0 || this.y > canvas.height) {
        this.reset();
        this.life = Math.random();
      }
    }
    draw() {
      const alpha = Math.sin(this.life * Math.PI) * 0.4;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue},80%,70%,${alpha})`;
      ctx.fill();
    }
  }

  const PARTICLE_COUNT = 80;
  const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

  // Connections
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          const alpha = (1 - dist / 90) * 0.08;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(180,160,255,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  /* ══════════════════════════════════════════
     HAMBURGER / DRAWER
  ══════════════════════════════════════════ */
  const hamburger  = document.getElementById('hamburger');
  const drawer     = document.getElementById('drawer');
  const overlay    = document.getElementById('overlay');
  const drawerClose = document.getElementById('drawer-close');

  const openDrawer = () => {
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

  /* ══════════════════════════════════════════
     SAKURA PETALS
  ══════════════════════════════════════════ */
  const sakuraContainer = document.getElementById('sakura-container');
  const PETAL_EMOJIS = ['🌸', '✦', '◇', '·', '✿'];

  function spawnPetal() {
    const el = document.createElement('div');
    el.className = 'petal';

    if (Math.random() < 0.25) {
      el.textContent = PETAL_EMOJIS[Math.floor(Math.random() * PETAL_EMOJIS.length)];
      Object.assign(el.style, {
        fontSize: '12px', background: 'none', borderRadius: '0'
      });
    }

    el.style.left = Math.random() * 100 + 'vw';
    el.style.setProperty('--dx', (Math.random() - 0.5) * 90 + 'px');

    const dur = 13 + Math.random() * 9;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay   = Math.random() * 1.5 + 's';

    const size = (5 + Math.random() * 7) + 'px';
    el.style.width  = size;
    el.style.height = size;

    sakuraContainer.appendChild(el);
    setTimeout(() => el.remove(), (dur + 2) * 1000);
  }

  for (let i = 0; i < 12; i++) setTimeout(spawnPetal, i * 180);
  let sakuraTimer = setInterval(spawnPetal, 700);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearInterval(sakuraTimer);
    else sakuraTimer = setInterval(spawnPetal, 700);
  });

  /* ══════════════════════════════════════════
     TYPEWRITER
  ══════════════════════════════════════════ */
  const phrases = [
    'Developer.',
    'Gamer.',
    'UI Craftsman.',
    'Bot Architect.',
    'Night Owl.',
    'Perfectionist.',
  ];
  const typeEl = document.getElementById('typewriter-text');
  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let typeTimer;

  function type() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      charIdx++;
      typeEl.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        deleting = true;
        typeTimer = setTimeout(type, 1800);
        return;
      }
    } else {
      charIdx--;
      typeEl.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    typeTimer = setTimeout(type, deleting ? 55 : 90);
  }
  type();

  /* ══════════════════════════════════════════
     HERO STAT COUNTER
  ══════════════════════════════════════════ */
  function animateCounter(el, target, duration = 1400) {
    const start = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    };
    requestAnimationFrame(update);
  }

  // Trigger counters when hero is loaded (after short delay)
  setTimeout(() => {
    document.querySelectorAll('.hs-num').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      animateCounter(el, target);
    });
  }, 800);

  /* ══════════════════════════════════════════
     NAV SCROLL BEHAVIOR + ACTIVE LINK
  ══════════════════════════════════════════ */
  const nav      = document.getElementById('main-nav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Shrink on scroll
    nav.classList.toggle('scrolled', window.scrollY > 50);

    // Active link highlighting
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.id;
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active',
        link.getAttribute('href') === `#${current}`
      );
    });
  }, { passive: true });

  /* ══════════════════════════════════════════
     SCROLL REVEAL (general)
  ══════════════════════════════════════════ */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');

      // Animate skill bars
      entry.target.querySelectorAll('.skill-bar-fill').forEach((bar, i) => {
        setTimeout(() => bar.classList.add('animated'), i * 120);
      });
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal, .reveal-tl').forEach(el => {
    revealObserver.observe(el);
  });

  /* ══════════════════════════════════════════
     CASINO
  ══════════════════════════════════════════ */
  const SYMBOLS = ['💎', '🎰', '🔥', '💀', '🍀', '👑', '⚡', '🌸', '🎯', '🃏'];
  const s1 = document.getElementById('s1');
  const s2 = document.getElementById('s2');
  const s3 = document.getElementById('s3');
  const spinBtn    = document.getElementById('spin-btn');
  const casinoMsg  = document.getElementById('casino-msg');
  const slotsWrap  = document.getElementById('slots-wrap');
  const spinCount  = document.getElementById('spin-count');
  const winCount   = document.getElementById('win-count');

  let totalSpins = 0;
  let totalWins  = 0;

  spinBtn.addEventListener('click', () => {
    if (spinBtn.disabled) return;
    spinBtn.disabled = true;
    slotsWrap.classList.remove('slot-win');
    casinoMsg.textContent = 'Spinning…';
    casinoMsg.style.color = '';

    totalSpins++;
    spinCount.textContent = totalSpins;
    [s1, s2, s3].forEach(el => el.classList.add('spinning'));

    let tick = 0;
    const iv = setInterval(() => {
      s1.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      s2.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      s3.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      tick++;

      if (tick > 25) {
        clearInterval(iv);
        [s1, s2, s3].forEach(el => el.classList.remove('spinning'));
        spinBtn.disabled = false;

        const r1 = s1.textContent;
        const r2 = s2.textContent;
        const r3 = s3.textContent;

        if (r1 === r2 && r2 === r3) {
          casinoMsg.textContent = '🏆 JACKPOT! Fortune smiles today!';
          casinoMsg.style.color = '#f5c842';
          slotsWrap.classList.add('slot-win');
          totalWins++;
          winCount.textContent = totalWins;
          triggerAchievement('🎰', 'Jackpot!');
          burstConfetti();
        } else if (r1 === r2 || r2 === r3 || r1 === r3) {
          casinoMsg.textContent = '✨ Close one! Almost there.';
          casinoMsg.style.color = '#a08cf0';
        } else {
          const taunts = [
            'Not today. Try again.',
            'Fortune is laughing at you.',
            'Almost… not really.',
            'The house always wins.',
            'Keep spinning, champ.',
          ];
          casinoMsg.textContent = taunts[Math.floor(Math.random() * taunts.length)];
          casinoMsg.style.color = '';
        }

        // Achievement: 10 spins
        if (totalSpins === 10) triggerAchievement('🎯', 'High Roller — 10 spins!');
      }
    }, 65);
  });

  /* ══════════════════════════════════════════
     CONFETTI BURST
  ══════════════════════════════════════════ */
  function burstConfetti() {
    const colors = ['#e8405a','#7b61ff','#f5c842','#4ade80','#29b6f6'];
    for (let i = 0; i < 40; i++) {
      setTimeout(() => {
        const dot = document.createElement('div');
        const size = 4 + Math.random() * 6;
        Object.assign(dot.style, {
          position: 'fixed',
          left: '50%',
          top: '50%',
          width: size + 'px',
          height: size + 'px',
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          background: colors[Math.floor(Math.random() * colors.length)],
          pointerEvents: 'none',
          zIndex: '9999',
          transform: 'translate(-50%,-50%)',
          transition: 'none',
        });
        document.body.appendChild(dot);

        const angle   = Math.random() * Math.PI * 2;
        const dist    = 80 + Math.random() * 200;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;

        requestAnimationFrame(() => {
          Object.assign(dot.style, {
            transition: `transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94),
                         opacity 0.9s ease`,
            transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`,
            opacity: '0',
          });
        });
        setTimeout(() => dot.remove(), 950);
      }, i * 20);
    }
  }

  /* ══════════════════════════════════════════
     ACHIEVEMENT TOAST
  ══════════════════════════════════════════ */
  const achievementToast = document.getElementById('achievement-toast');
  const achIcon = document.getElementById('ach-icon');
  const achName = document.getElementById('ach-name');
  let achTimer;

  function triggerAchievement(icon, name) {
    clearTimeout(achTimer);
    achIcon.textContent = icon;
    achName.textContent = name;
    achievementToast.classList.add('show');
    achTimer = setTimeout(() => achievementToast.classList.remove('show'), 3500);
  }

  // Section-based achievements
  const sectionAchievements = {
    'about':    ['📖', 'Lore Seeker'],
    'projects': ['⚙️', 'Project Inspector'],
    'skills':   ['⚡', 'Skill Scouter'],
    'timeline': ['🛣️', 'Timeline Explorer'],
    'connect':  ['🤝', 'Connector'],
  };

  const achievedSections = new Set();

  const sectionAchObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      if (sectionAchievements[id] && !achievedSections.has(id)) {
        achievedSections.add(id);
        const [icon, name] = sectionAchievements[id];
        setTimeout(() => triggerAchievement(icon, name), 600);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('section[id]').forEach(s => {
    sectionAchObserver.observe(s);
  });

  /* ══════════════════════════════════════════
     MUSIC PLAYER (fake / decorative)
  ══════════════════════════════════════════ */
  const musicToggle   = document.getElementById('music-toggle');
  const musicDisc     = document.getElementById('music-disc');
  const musicProgress = document.getElementById('music-progress');
  const musicTitle    = document.querySelector('.music-title');
  const musicArtist   = document.querySelector('.music-artist');

  const tracks = [
    { title: 'night.wav',       artist: 'Immortal Radio' },
    { title: 'lowkey.mp3',      artist: 'Dark Sessions' },
    { title: 'retrograde.flac', artist: 'Deep Focus' },
    { title: 'glass.aiff',      artist: 'Liquid Beats' },
  ];

  let trackIdx    = 0;
  let isPlaying   = false;
  let progress    = 0;
  let musicTimer;

  function updateTrack() {
    const t = tracks[trackIdx];
    musicTitle.textContent  = t.title;
    musicArtist.textContent = t.artist;
    progress = 0;
    musicProgress.style.width = '0%';
  }

  musicToggle.addEventListener('click', () => {
    isPlaying = !isPlaying;
    musicToggle.textContent = isPlaying ? '⏸' : '▶';

    if (isPlaying) {
      musicDisc.classList.add('spinning');
      musicTimer = setInterval(() => {
        progress += 0.5;
        musicProgress.style.width = Math.min(progress, 100) + '%';
        if (progress >= 100) {
          progress = 0;
          trackIdx = (trackIdx + 1) % tracks.length;
          updateTrack();
        }
      }, 100);
    } else {
      musicDisc.classList.remove('spinning');
      clearInterval(musicTimer);
    }
  });

  /* ══════════════════════════════════════════
     CARD TILT (desktop)
  ══════════════════════════════════════════ */
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  if (!isMobile) {
    let raf;
    document.addEventListener('mousemove', e => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        document.querySelectorAll('.glass-card').forEach(card => {
          const rect = card.getBoundingClientRect();
          const inBounds =
            e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top  && e.clientY <= rect.bottom;

          if (inBounds) {
            const dx = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2);
            const dy = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2);
            card.style.transform =
              `perspective(900px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg) translateY(-6px)`;
            card.style.transition = 'transform 0.1s linear';
          } else {
            card.style.transform  = '';
            card.style.transition = 'transform 0.5s var(--ease-smooth)';
          }
        });
      });
    });

    document.addEventListener('mouseleave', () => {
      document.querySelectorAll('.glass-card').forEach(card => {
        card.style.transform  = '';
        card.style.transition = 'transform 0.5s var(--ease-smooth)';
      });
    });
  }

  /* ══════════════════════════════════════════
     EASTER EGG — Konami Code
  ══════════════════════════════════════════ */
  const KONAMI = [
    'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
    'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
    'b','a'
  ];
  let konamiIdx = 0;

  document.addEventListener('keydown', e => {
    if (e.key === KONAMI[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === KONAMI.length) {
        konamiIdx = 0;
        triggerAchievement('🎖️', 'Easter Egg Found!');
        // Extra: flood confetti
        setTimeout(burstConfetti, 300);
        setTimeout(burstConfetti, 600);
        setTimeout(burstConfetti, 900);
      }
    } else {
      konamiIdx = 0;
    }
  });

  /* ══════════════════════════════════════════
     SECRET: CLICK LOGO 5x
  ══════════════════════════════════════════ */
  const logoEl = document.querySelector('.nav-logo');
  let logoClicks = 0;
  let logoTimer;

  logoEl.addEventListener('click', () => {
    logoClicks++;
    clearTimeout(logoTimer);
    logoTimer = setTimeout(() => { logoClicks = 0; }, 2000);

    if (logoClicks >= 5) {
      logoClicks = 0;
      triggerAchievement('👁️', 'You found a secret!');
      // Rainbow logo flash
      logoEl.style.transition = 'filter 0.1s';
      const hues = [0,60,120,180,240,300];
      hues.forEach((h, i) => {
        setTimeout(() => {
          logoEl.style.filter = `hue-rotate(${h}deg) brightness(1.5)`;
        }, i * 100);
      });
      setTimeout(() => { logoEl.style.filter = ''; }, 700);
    }
  });

  /* ══════════════════════════════════════════
     CONSOLE SIGNATURE
  ══════════════════════════════════════════ */
  console.clear();
  console.log(
    '%c  ✦ IMMORTAL OS v2.0  ',
    'background:linear-gradient(135deg,#e8405a,#7b61ff);' +
    'color:#fff;font-weight:900;font-size:18px;' +
    'padding:10px 20px;border-radius:8px;'
  );
  console.log('%cLiquid Glass · Particle Engine · Achievement System', 'color:#7b61ff;font-size:12px;');
  console.log('%c→ Try the Konami Code: ↑↑↓↓←→←→BA', 'color:#e8405a;font-size:11px;font-weight:600;');
  console.log('%c→ Click the logo 5 times fast', 'color:#f5c842;font-size:11px;');
  console.log('%cBuilt with precision. Runs on vibes. 🔥', 'color:rgba(255,255,255,0.5);font-size:11px;');

});
