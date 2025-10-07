const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.header-menu');

hamburger.addEventListener('click', () => {
    menu.classList.toggle('active');
});

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const STAR_COUNT = (width + height) / 8;
const STAR_SIZE = 2;
const STAR_MIN_SCALE = 0.2;
const OVERFLOW_THRESHOLD = 50;

let stars = [];
let velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.0005 };
let pointerX, pointerY;
let touchInput = false;

// Generate stars
for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE)
    });
}

// Functions
function recycleStar(star) {
    star.z = STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE);
    star.x = Math.random() * width;
    star.y = Math.random() * height;
}

function updateStars() {
    velocity.tx *= 0.96;
    velocity.ty *= 0.96;
    velocity.x += (velocity.tx - velocity.x) * 0.6;
    velocity.y += (velocity.ty - velocity.y) * 0.8;

    stars.forEach(star => {
        star.x += velocity.x * star.z;
        star.y += velocity.y * star.z;
        star.x += (star.x - width / 2) * velocity.z * star.z;
        star.y += (star.y - height / 2) * velocity.z * star.z;
        star.z += velocity.z;

        if (star.x < -OVERFLOW_THRESHOLD || star.x > width + OVERFLOW_THRESHOLD ||
            star.y < -OVERFLOW_THRESHOLD || star.y > height + OVERFLOW_THRESHOLD) {
            recycleStar(star);
        }
    });
}

function drawStars() {
    ctx.clearRect(0, 0, width, height);
    stars.forEach(star => {

        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineWidth = STAR_SIZE * star.z;
        ctx.strokeStyle = `rgba(200,200,200,${0.5 + 0.5 * Math.random()})`;
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        let tailX = velocity.x * 2;
        let tailY = velocity.y * 2;
        if (Math.abs(tailX) < 0.1) tailX = 0.5;
        if (Math.abs(tailY) < 0.1) tailY = 0.5;
        ctx.lineTo(star.x + tailX, star.y + tailY);
        ctx.stroke();
    });
}


// Pointer movement
function movePointer(x, y) {
    if (typeof pointerX === 'number' && typeof pointerY === 'number') {
        let ox = x - pointerX;
        let oy = y - pointerY;
        velocity.tx += (ox / 40) * (touchInput ? -1 : 1);
        velocity.ty += (oy / 40) * (touchInput ? -1 : 1);
    }
    pointerX = x;
    pointerY = y;
}

document.querySelector('.hero').onmousemove = e => { touchInput = false; movePointer(e.clientX, e.clientY); };
document.querySelector('.hero').ontouchmove = e => { touchInput = true; movePointer(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); };
document.querySelector('.hero').onmouseleave = () => { pointerX = pointerY = null; };

// Animation loop
function step() {
    updateStars();
    drawStars();
    requestAnimationFrame(step);
}

step();

// Resize
window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    stars.forEach(star => {
        star.x = Math.random() * width;
        star.y = Math.random() * height;
    });
});

