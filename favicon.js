(() => {
    const icon = document.querySelector('link[rel="icon"]');
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 32;
    const context = canvas.getContext('2d');
    if (!icon || !context) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fallback = icon.href;
    const path = [];
    for (let x = 6; x <= 26; x += 4) path.push([x, 6]);
    for (let y = 10; y <= 26; y += 4) path.push([26, y]);
    for (let x = 22; x >= 6; x -= 4) path.push([x, 26]);
    for (let y = 22; y >= 10; y -= 4) path.push([6, y]);

    let head = 5;
    let food = 10;
    let timer;

    function draw() {
        context.clearRect(0, 0, 32, 32);
        context.fillStyle = '#1a1a1a';
        context.beginPath();
        context.roundRect(0, 0, 32, 32, 7);
        context.fill();

        function square(index, color) {
            const [x, y] = path[index];
            context.fillStyle = color;
            context.fillRect(x - 2.5, y - 2.5, 5, 5);
        }

        square(food, '#e74c3c');
        for (let segment = 7; segment >= 0; segment--) {
            square((head - segment + path.length) % path.length,
                segment === 0 ? '#2ecc71' : '#27ae60');
        }

        const [x, y] = path[head];
        const [nextX, nextY] = path[(head + 1) % path.length];
        const dx = Math.sign(nextX - x);
        const dy = Math.sign(nextY - y);
        context.fillStyle = '#fff';
        for (const side of [-1, 1]) {
            context.fillRect(x + dx - dy * side - 0.5,
                y + dy + dx * side - 0.5, 1, 1);
        }

        icon.type = 'image/png';
        icon.href = canvas.toDataURL('image/png');
    }

    function updateAnimation() {
        clearInterval(timer);
        if (motion.matches) {
            icon.type = 'image/svg+xml';
            icon.href = fallback;
            return;
        }
        draw();
        if (document.hidden) return;
        timer = setInterval(() => {
            head = (head + 1) % path.length;
            if (head === food) food = (food + 10) % path.length;
            draw();
        }, 180);
    }

    document.addEventListener('visibilitychange', updateAnimation);
    motion.addEventListener('change', updateAnimation);
    updateAnimation();
})();
