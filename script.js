document.addEventListener('DOMContentLoaded', () => {
    
    // ===== 🌓 THEME TOGGLE — РАБОТАЮЩИЙ =====
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Загружаем сохранённую тему
    const savedTheme = localStorage.getItem('immortal-theme');
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
    }
    
    // Переключение темы
    themeToggle?.addEventListener('click', (e) => {
        e.preventDefault();
        body.classList.toggle('light-theme');
        
        // Сохраняем выбор
        const newTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
        localStorage.setItem('immortal-theme', newTheme);
        
        // Мини-анимация кнопки
        themeToggle.style.transform = 'scale(0.95)';
        setTimeout(() => themeToggle.style.transform = '', 150);
    });
    
    // ===== 🍔 MENU TOGGLE =====
    const menuToggle = document.getElementById('menu-toggle');
    const sidePanel = document.getElementById('side-panel');
    const overlay = document.getElementById('panel-overlay');
    const closeBtn = document.getElementById('close-panel');
    
    function toggleMenu() {
        sidePanel.classList.toggle('active');
        overlay.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.style.overflow = sidePanel.classList.contains('active') ? 'hidden' : '';
    }
    
    menuToggle?.addEventListener('click', toggleMenu);
    closeBtn?.addEventListener('click', toggleMenu);
    overlay?.addEventListener('click', toggleMenu);
    
    document.querySelectorAll('.panel-link').forEach(link => {
        if (link.id !== 'theme-toggle') {
            link.addEventListener('click', toggleMenu);
        }
    });
    
    // ===== 🎰 CASINO =====
    const symbols = ['💎', '🎰', '🔥', '💀', '🍀', '👑'];
    const spinBtn = document.getElementById('spin-btn');
    const msg = document.getElementById('casino-msg');
    
    spinBtn?.addEventListener('click', () => {
        if (spinBtn.disabled) return;
        spinBtn.disabled = true;
        msg.innerText = "Spinning...";
        msg.style.color = "rgba(128,128,128,0.8)";
        
        let spins = 0;
        const timer = setInterval(() => {
            document.getElementById('slot1').innerText = symbols[Math.floor(Math.random() * symbols.length)];
            document.getElementById('slot2').innerText = symbols[Math.floor(Math.random() * symbols.length)];
            document.getElementById('slot3').innerText = symbols[Math.floor(Math.random() * symbols.length)];
            spins++;
            
            if (spins > 18) {
                clearInterval(timer);
                spinBtn.disabled = false;
                
                const s1 = document.getElementById('slot1').innerText;
                const s2 = document.getElementById('slot2').innerText;
                const s3 = document.getElementById('slot3').innerText;
                
                if (s1 === s2 && s2 === s3) {
                    msg.innerText = "🎉 JACKPOT! 🏆";
                    msg.style.color = "#ff2d55";
                } else if (s1 === s2 || s2 === s3 || s1 === s3) {
                    msg.innerText = "Nice pair! +10 ✨";
                    msg.style.color = "rgba(128,128,128,0.95)";
                } else {
                    msg.innerText = "Not today, try again.";
                    msg.style.color = "rgba(128,128,128,0.6)";
                }
            }
        }, 75);
    });
    
    // ===== 🌸 SAKURA =====
    const sakuraContainer = document.getElementById('sakura-container');
    
    function createSakura() {
        if (!sakuraContainer) return;
        const petal = document.createElement('div');
        petal.className = 'sakura';
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.setProperty('--drift', `${(Math.random() - 0.5) * 60}px`);
        petal.style.animationDuration = `${Math.random() * 5 + 10}s`;
        petal.style.animationDelay = `${Math.random() * 2}s`;
        sakuraContainer.appendChild(petal);
        setTimeout(() => petal.remove(), 17000);
    }
    
    let sakuraInterval = setInterval(createSakura, 450);
    for (let i = 0; i < 8; i++) setTimeout(createSakura, i * 150);
    
    document.addEventListener('visibilitychange', () => {
        document.hidden ? clearInterval(sakuraInterval) : (sakuraInterval = setInterval(createSakura, 450));
    });
    
    // ===== 🪟 PARALLAX (Desktop only) =====
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!isMobile) {
        let tiltRaf;
        document.addEventListener('mousemove', (e) => {
            if (tiltRaf) cancelAnimationFrame(tiltRaf);
            tiltRaf = requestAnimationFrame(() => {
                const x = (window.innerWidth / 2 - e.pageX) / 85;
                const y = (window.innerHeight / 2 - e.pageY) / 85;
                document.querySelectorAll('.glass-container').forEach(card => {
                    card.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
                });
            });
        });
        document.addEventListener('mouseleave', () => {
            document.querySelectorAll('.glass-container').forEach(card => {
                card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
            });
        });
    }
    
    console.log('%c🌹 Immortal OS', 'color:#ff2d55; font-weight:bold;');
});
