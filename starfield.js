const starsCanvas = document.getElementById('starfield');
const starCtx     = starsCanvas.getContext('2d');

let   stars       = [];
const numStars    = 200;

class Star {
    constructor() {
        this.reset();
    }
    reset() {
        this.x    = Math.random() * starsCanvas.width;
        this.y    = Math.random() * starsCanvas.height;
        this.z    = Math.random() * starsCanvas.width; // depth for speed
        this.size = Math.random() * 1.5;
    }

    update() {
        this.z -= 2; // speed
        if (this.z <= 0) {
            this.reset();
        }
    }
    
    draw() {
        const sx = (this.x - starsCanvas.width / 2) * (starsCanvas.width / this.z) + starsCanvas.width / 2;
        const sy = (this.y - starsCanvas.height / 2) * (starsCanvas.width / this.z) + starsCanvas.height / 2;
        const radius = (1 - this.z / starsCanvas.width) * this.size * 3;
        starCtx.beginPath();
        starCtx.arc(sx, sy, radius, 0, Math.PI * 2);
        starCtx.fillStyle = 'white';
        starCtx.fill();
    }
}

function resizeStarfield() {
    const oldWidth = starsCanvas.width;
    const oldHeight = starsCanvas.height;

    starsCanvas.width = window.innerWidth;
    starsCanvas.height = window.innerHeight;

    const widthRatio = starsCanvas.width / oldWidth;
    const heightRatio = starsCanvas.height / oldHeight;

    stars.forEach(star => {
        star.x *= widthRatio;
        star.y *= heightRatio;
        star.z *= widthRatio;
    });
}

function initStars() {
    window.addEventListener('resize', resizeStarfield);
    resizeStarfield();
    for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
    }
}

function animateStars() {
    starCtx.fillStyle = 'black';
    starCtx.fillRect(0, 0, starsCanvas.width, starsCanvas.height);

    stars.forEach(star => {
        star.update();
        star.draw();
    });

    requestAnimationFrame(animateStars);
}