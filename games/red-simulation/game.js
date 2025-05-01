const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');
const mouseSelect = document.querySelector("#mouse");
const biasAmount = document.querySelector("#bias");
const randomness = document.querySelector("#random");
const refresh = document.querySelector("#refresh");
const sizeAmount = document.querySelector("#size");
const speedAmount = document.querySelector("#speed");
const ballAmount = document.querySelector("#balls");
const baswitch = document.querySelector(".switch");

let playerY = 50;
let playerX = 50;
let mouseX = 0;
let mouseY = 0;

let ballsAmount = 20;
let balls = [];

let playerSpeed = 0.4;
let playerSize = 8;
let playerAngle = 0;

window.addEventListener('load', () => {
    loadGame();
    ballsAmount = ballAmount.value;
    balls = Array.from({ length: ballsAmount }, () => ({ x: 400, y: 400 }));
    gameloop();
});

refresh.addEventListener('click', () => {
    saveGame();
    location.reload()
})

baswitch.addEventListener('click', () => {
    if (ballAmount.type == "number") { ballAmount.type = "range" } else {ballAmount.type = "number"};
})

const player = () => {
    ctx.save();
    ctx.translate(playerX + playerSize / 2, playerY + playerSize / 2);
    ctx.rotate(playerAngle);
    ctx.fillStyle = "red";
    ctx.fillRect(-playerSize / 2, -playerSize / 2, playerSize, playerSize);
    ctx.restore();
};

const bullet = (x, y) => {
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
};

canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

const clamp = (min, v, max) => Math.max(min, Math.min(v, max));

let bias = (Math.random() - 1);
const vortexbias = (p, s) => p + bias * (s > 0.5 ? 1 : -1);

const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

setInterval(() => {
    saveGame();
}, 10);

mouseSelect.onchange = () => saveGame();
randomness.onchange = () => saveGame();

let last = Date.now();
const gameloop = () => {
    const now = Date.now();
    const d = now - last;
    last = now;

    bias = biasAmount.value;

    playerAngle = Math.atan2(mouseY - (playerY + playerSize / 2), mouseX - (playerX + playerSize / 2));

    playerSize = sizeAmount.value * 10;
    playerSpeed = speedAmount.value;
    bias = parseFloat(biasAmount.value) || 0;
    if (randomness.checked) bias = 0;

    if (mouseSelect.checked) {
        const centerX = playerX + playerSize / 2;
        const centerY = playerY + playerSize / 2;

        const dx = mouseX - centerX;
        const dy = mouseY - centerY;

        const distance = Math.hypot(dx, dy);
        if (distance > 1) {
            playerX += (dx / distance) * playerSpeed * d;
            playerY += (dy / distance) * playerSpeed * d;
        }
    } else {
        if (keys.ArrowLeft || keys.a) playerX -= d * playerSpeed;
        if (keys.ArrowRight || keys.d) playerX += d * playerSpeed;

        if (keys.ArrowUp || keys.w) playerY -= d * playerSpeed;
        if (keys.ArrowDown || keys.s) playerY += d * playerSpeed;
    };

    balls.forEach(ball => {
        const deltaX = (Math.random() * 3 - 1.5);
        const deltaY = (Math.random() * 3 - 1.5);

        const velX = -vortexbias(deltaX, (ball.y + deltaY) / canvas.height);
        const velY = vortexbias(deltaY, (ball.x + deltaX) / canvas.width);

        ball.x = clamp(0, ball.x + velX * d, canvas.width - playerSize);
        ball.y = clamp(0, ball.y + velY * d, canvas.height - playerSize);
    });

    //console.log(ballX, ballY)

    playerX = clamp(0, playerX, canvas.width - playerSize);
    playerY = clamp(0, playerY, canvas.height - playerSize);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player();
    balls.forEach(ball => bullet(ball.x, ball.y));

    //console.log(mouseSelect.checked)

    requestAnimationFrame(gameloop);
};

function saveGame() {
    localStorage.setItem('mouseControl', mouseSelect.checked);
    localStorage.setItem('biasValue', biasAmount.value);
    localStorage.setItem('randomness', randomness.checked);

    localStorage.setItem('size', sizeAmount.value);
    localStorage.setItem('speed', speedAmount.value);
    localStorage.setItem('balls', ballAmount.value);
    //console.log(`Game Saved: ${localStorage.getItem('mouseControl')}, ${localStorage.getItem('biasValue')}, ${localStorage.getItem('randomness')}`);
}

function loadGame() {
    mouseSelect.checked = localStorage.getItem('mouseControl') === 'true';
    biasAmount.value = localStorage.getItem('biasValue') || 0;
    randomness.checked = localStorage.getItem('randomness') === 'true';

    sizeAmount.value = localStorage.getItem('size') || 8;
    speedAmount.value = localStorage.getItem('speed') || 0.4;
    ballAmount.value = localStorage.getItem('balls') || 20;
    //console.log(`Game Loaded: ${mouseSelect.checked}, ${biasAmount.value}, ${randomness.checked}`);
}