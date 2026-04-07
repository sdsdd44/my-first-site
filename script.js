document.addEventListener('DOMContentLoaded', () => {
    const discordBtn = document.getElementById('discord-copy');

    discordBtn.addEventListener('click', () => {
        const tag = "immortal_user";
        
        navigator.clipboard.writeText(tag).then(() => {
            const originalText = discordBtn.innerText;
            discordBtn.innerText = "Copied to clipboard!";
            discordBtn.style.color = "#fff";

            setTimeout(() => {
                discordBtn.innerText = originalText;
                discordBtn.style.color = "rgba(255, 255, 255, 0.3)";
            }, 2000);
        });
    });

    // Добавляем эффект легкого наклона при движении мыши (необязательно, но круто)
    const card = document.querySelector('.glass-container');
    document.addEventListener('mousemove', (e) => {
        let x = (window.innerWidth / 2 - e.pageX) / 50;
        let y = (window.innerHeight / 2 - e.pageY) / 50;
        card.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    });
});