document.addEventListener('DOMContentLoaded', () => {
    const card = document.querySelector('.glass-container');
    const discordBtn = document.getElementById('discord-copy');

    // Копирование Discord
    discordBtn.addEventListener('click', () => {
        const tag = "immortal_user";
        navigator.clipboard.writeText(tag).then(() => {
            const originalText = discordBtn.innerText;
            discordBtn.innerText = "Copied!";
            setTimeout(() => { discordBtn.innerText = originalText; }, 2000);
        });
    });

    // Мягкий 3D Наклон
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 45;
        const y = (window.innerHeight / 2 - e.pageY) / 45;
        
        card.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
    });
    
    // Сброс наклона, когда мышь уходит
    document.addEventListener('mouseleave', () => {
        card.style.transform = `rotateY(0deg) rotateX(0deg)`;
    });
});
