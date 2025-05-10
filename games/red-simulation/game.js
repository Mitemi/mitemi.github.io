// Variables
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
const visContainer = document.querySelector(".vis-container");
const ballSpeed = document.querySelector("#ball-speed");
const board = document.querySelector(".board");
const ghost = document.querySelector("#ghost");
const oneHit = document.querySelector("#onehit");
const god = document.querySelector("#god");
const lang = document.querySelector(".lang");
const bossButton = document.querySelector(".bossmode");
const draw = document.querySelector("#draw");
const ballSetting = document.querySelector(".ball-settings");
const modes = document.querySelector(".modes");
const randomnessContainer = document.querySelector(".random-container");
const ballAmountDiv = document.querySelector(".ball-amount");
const bossmodes = document.querySelector(".bossmodes");
const aimbot = document.querySelector("#aimbot");

const textBoard = document.querySelector('.board p');
const textMouse = document.querySelector('label[for="mouse"]');
const textRandom = document.querySelector('label[for="random"]');
const textBias = document.querySelector('label[for="bias"]');
const textSpeed = document.querySelector('label[for="speed"]');
const textSize = document.querySelector('label[for="size"]');
const textBalls = document.querySelector('label[for="balls"]');
const textBallspeed = document.querySelector('label[for="ball-speed"]');
const textGhost = document.querySelector('label[for="ghost"]');
const textOneHit = document.querySelector('label[for="onehit"]');
const textGodMode = document.querySelector('label[for="god"]');
const textDraw = document.querySelector('label[for="draw"]');
const textRefresh = document.getElementById('refresh');
const textShoot = document.querySelector('.shoot');

let bossmode = false;
let french = false;

const player = {
    x: 50,
    y: 50,
    size: 8,
    speed: 0.4,
    angle: 0,
    health: 100,
    maxHealth: 100,
    color: "white",
    strokeColor: "white",

    hit: 0
};

const boss = {
    x: canvas.width / 2,
    y: 100,
    size: 45,
    health: 500,
    color: "cyan",

    hit: 0
};

let phaseTimer = 0;
let fireTimer = 0;
let bossIntensity = 2;

let mouseX = 0;
let mouseY = 0;

let ballsAmount = 20;
let balls = [];
let bullets = [];

loadGame();

ballsAmount = ballAmount.value;
balls = Array.from({ length: ballsAmount }, () => ({ x: 400, y: 400, r: 15, s: 1, color: "white" }));
if (randomness.checked) { visContainer.style.display = 'none' } else visContainer.style.display = 'block';

// Event Listeners
refresh.addEventListener('click', () => {
    saveGame();
    location.reload();
});

draw.onchange = () => location.reload();

bossButton.addEventListener('click', () => {
    bossmode = !bossmode
    saveGame();
    location.reload();
});

baswitch.addEventListener('click', () => ballAmount.type == "number" ? ballAmount.type = "range" : ballAmount.type = "number");

board.addEventListener("mouseup", () => saveGame());

randomness.onchange = () => randomness.checked ? visContainer.style.display = 'none' : visContainer.style.display = 'block';

canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) * (canvas.width / rect.width) + 10;
    mouseY = (e.clientY - rect.top) * (canvas.height / rect.height) + 10;
});

const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Language Setting
lang.addEventListener('click', () => {
    french = !french;
    langSet()
});

const langSet = () => {
    if (french == true) {
        textBoard.textContent = "Déplacez-vous avec WASD ou ↑←↓→";
        textShoot.textContent = "Tirez avec X"
        textMouse.textContent = "🖰 Contrôle de Souris";
        textRandom.textContent = "♣ Chance";
        textBias.textContent = "⓪ Biais";
        textSpeed.textContent = "✦ Vitesse du Joueur";
        textSize.textContent = "◆ Taille du Joueur";
        textBalls.textContent = "❂ Nombre de Balles";
        textBallspeed.textContent = "✦ Vitesse des Balles";
        textGhost.textContent = "⩀ Mode Fantôme";
        textOneHit.textContent = "☠ Mode One Hit";
        textGodMode.textContent = "❈ Mode Dieu";
        textDraw.textContent = "✎ Mode Dessin";
        textRefresh.textContent = "Rafraîchir";
        lang.src = "https://flagpedia.net/data/flags/emoji/twitter/256x256/fr.png";
        canvas.style.borderColor = "blue"

        ghost.checked = false;
        ghost.disabled = true;
    } else {
        textBoard.textContent = "Move with WASD or ↑←↓→";
        textShoot.textContent = "Shoot with X"
        textMouse.textContent = "🖰 Mouse Control";
        textRandom.textContent = "♣ Randomness";
        textBias.textContent = "⓪ Bias";
        textSpeed.textContent = "✦ Player Speed";
        textSize.textContent = "◆ Player Size";
        textBalls.textContent = "❂ Ball Amount";
        textBallspeed.textContent = "✦ Ball Speed";
        textGhost.textContent = "⩀ Ghost Mode";
        textOneHit.textContent = "☠ One Hit Mode";
        textGodMode.textContent = "❈ God Mode";
        textDraw.textContent = "✎ Drawing Mode";
        textRefresh.textContent = "Refresh";
        lang.src = "https://flagpedia.net/data/flags/emoji/twitter/256x256/gb.png";
        canvas.style.borderColor = "red"

        ghost.disabled = false;
    }
}

langSet();

// Mode Toggle
const defaultModes = () => {
    ballSetting.style.display = 'block';
    modes.style.display = 'block';
    randomnessContainer.style.display = 'block';
    ballAmountDiv.style.display = 'block';
    bossmodes.style.display = 'none'
    textShoot.style.display = 'none'
}

if (draw.checked) {
    ballSetting.style.display = 'none';
    modes.style.display = 'none';
    randomnessContainer.style.display = 'none';
    ballAmountDiv.style.display = 'none';
    bossmodes.style.display = 'none'
    textShoot.style.display = 'none'
    bossmode = false;
} else if (bossmode) {
    ballSetting.style.display = 'block';
    modes.style.display = 'block';
    randomnessContainer.style.display = 'none';
    ballAmountDiv.style.display = 'none';
    bossmodes.style.display = 'block'
    textShoot.style.display = 'block'
} else { defaultModes() };

// Canvas Drawing
const playerDraw = (s) => {
    ctx.save();
    ctx.translate(player.x + player.size / 2, player.y + player.size / 2);
    ctx.rotate(player.angle);
    ctx.fillStyle = player.color;
    ctx.strokeStyle = player.strokeColor;
    const strokeSize = (player.health / player.maxHealth) * player.size;
    if (s == "rectangle") {
        ctx.fillRect(-player.size / 2, -player.size / 2, player.size, player.size);
        ctx.strokeRect(-strokeSize / 2, -strokeSize / 2, strokeSize, strokeSize);
    } else {
        ctx.beginPath();
        ctx.arc(0, 0, player.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = strokeSize / 5;
        ctx.strokeStyle = player.strokeColor;
        ctx.stroke();
        ctx.closePath();
    }
    ctx.restore();
};

const ballDraw = (ball) => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
};

const bossDraw = () => {
    ctx.beginPath();
    ctx.arc(boss.x, boss.y, boss.size, 0, Math.PI * 2);
    ctx.fillStyle = boss.color;
    ctx.fill();
    ctx.closePath();
};

// Clamp, Bias, Vortex
const clamp = (min, v, max) => Math.max(min, Math.min(v, max));
let bias = (Math.random() - 1);
const vortexbias = (p, s) => p + bias * (s > 0.5 ? 1 : -1);

// Player Updating
const playerUpdate = (d) => {
    player.angle = Math.atan2(mouseY - (player.y + player.size / 2), mouseX - (player.x + player.size / 2));

    player.size = sizeAmount.value * 10;
    player.speed = speedAmount.value;

    // Controls
    if (mouseSelect.checked) {
        player.x = mouseX;
        player.y = mouseY;
    } else {
        if (keys.ArrowLeft || keys.a || keys.A) player.x -= d * player.speed;
        if (keys.ArrowRight || keys.d || keys.D) player.x += d * player.speed;

        if (keys.ArrowUp || keys.w || keys.W) player.y -= d * player.speed;
        if (keys.ArrowDown || keys.s || keys.S) player.y += d * player.speed;
    };

    let aimMethod = aimbot.checked ? [Math.cos(Math.atan2(boss.y - player.y, boss.x - player.x)) * 0.5, Math.sin(Math.atan2(boss.y - player.y, boss.x - player.x)) * 0.5] : [0, -1];

    phaseTimer+= 1 * d;
    if (keys.x && player.health > 0 && phaseTimer >= 15 * d|| keys.X && player.health > 0 && phaseTimer >= 15 * d) {
            bullets.push({
                x: player.x + player.size / 2,
                y: player.y + player.size / 2,
                dx: aimMethod[0],
                dy: aimMethod[1],
                r: 7,
                color: "#ab0000"
            });
            phaseTimer = 0;
    }

    // Restrict Player
    player.x = clamp(0, player.x, canvas.width - player.size);
    player.y = clamp(0, player.y, canvas.height - player.size);

    // Health If Hell
    bossmode ? player.strokeColor = ghost.checked ? "#f20000" : "#ffffff00" : player.strokeColor = ghost.checked ? "#ffffff90" : "#ffffff00";

    if (player.health == 0 && player.hit > 0) player.health = -1000;

    if (player.health <= 0) {
        player.color = ghost.checked ? "#ff000015" : "#ff000000";
        player.strokeColor = ghost.checked ? "#ffffff15" : "#ffffff00";
    } else {
        if (player.hit > 0) {
            player.color = !french ? "#ff000085" : "#0000ff85";
            player.strokeColor = !french ? "#6b0000" : "#0000ff85";
        } else {
            french ? player.color = "blue" : player.color = "red";
        }
    }

    if (player.hit > 0) {
        player.hit -= d;
    } else if (player.health > 0 || ghost.checked) {
        player.health = Math.min(player.maxHealth, player.health + 0.1 * d);
    }
};

// Boss Updating
const bossUpdate = (d) => {
    bossIntensity = ballSpeed.value;
    fireTimer += 1 * d;
    if (fireTimer >= bossIntensity * d && boss.health > 0) {
        fireTimer = 0;
        balls.push({
            x: boss.x,
            y: boss.y,
            dx: (Math.random() - 0.5) * d * 0.1,
            dy: (Math.random() - 0.5) * d * 0.1,
            r: 7,
            color: "#d9feff"
        });
        balls.push({
            x: boss.x,
            y: boss.y,
            dx: (Math.random() - 0.5) * d * 0.5,
            dy: (Math.random() - 0.5) * d * 0.5,
            r: 7,
            color: "#edffff"
        });
    }

    boss.color = boss.health < 0 ? "#ff000000" : "cyan";

    if (boss.health <= 0) {
        boss.color = ghost.checked ? "#00ffff15" : "#00ffff00";
        boss.strokeColor = ghost.checked ? "#ffffff15" : "#ffffff00";
    } else {
        if (boss.hit > 0) {
            boss.color = !french ? "#00ffff85" : "#0000ff85";
            boss.strokeColor = !french ? "#006b6b" : "#0000ff85";
        }
    }

    boss.hit -= d;

    // Collision
    if (Math.abs(player.x - boss.x) < (boss.size + player.size) && Math.abs(player.y - boss.y) < (boss.size + player.size) && !god.checked) {
        player.health = Math.max(0, player.health - 0.01 * d);
        player.hit = 10;
    }
};

// Save Game every 10ms
setInterval(() => {
    saveGame();
}, 10);

if (bossmode) {
    player.x = canvas.width / 2,
        player.y = 600
}

// Game Loop
let last = Date.now();
const gameloop = () => {
    // Delta Time
    const now = Date.now();
    const d = now - last;
    last = now;

    // Set Stats
    bias = randomness.checked ? 0 : biasAmount.value;

    playerUpdate(d);

    // Ball Movement
    balls.forEach(ball => {
        ball.s = ballSpeed.value;

        const deltaX = (Math.random() * 3 * ball.s - 1.5 * ball.s);
        const deltaY = (Math.random() * 3 * ball.s - 1.5 * ball.s);

        const velX = -vortexbias(deltaX, (ball.y + deltaY) / canvas.height);
        const velY = vortexbias(deltaY, (ball.x + deltaX) / canvas.width);

        ball.x = clamp(0, ball.x + velX * d, canvas.width - ball.r);
        ball.y = clamp(0, ball.y + velY * d, canvas.height - ball.r);

        // Collision
        if (Math.abs(player.x - ball.x) < (ball.r + player.size) && Math.abs(player.y - ball.y) < (ball.r + player.size) && !god.checked) {
            player.health = Math.max(0, player.health - 0.01 * d);
            player.hit = 10;
        }
    });

    // Frame Refresh
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    playerDraw("rectangle");
    balls.forEach(ball => ballDraw(ball));
};

const drawloop = () => {
    // Delta Time
    const now = Date.now();
    const d = now - last;
    last = now;

    playerUpdate(d);
    playerDraw("rectangle");
}

const bossloop = () => {
    // Delta Time
    const now = Date.now();
    const d = now - last;
    last = now;

    playerUpdate(d);
    bossUpdate(d);

    boss.x = clamp(boss.size, boss.x + (Math.random() - 0.5) * d * 5, canvas.width - boss.size);
    boss.y = clamp(boss.size, boss.y + (Math.random() - 0.5) * d * 1.5, canvas.height / 4 - boss.size);

    balls.forEach(ball => {
        ball.x += ball.dx * d;
        ball.y += ball.dy * d;

        // Collision
        if (Math.abs(player.x - ball.x) < (ball.r + player.size) && Math.abs(player.y - ball.y) < (ball.r + player.size) && !god.checked) {
            player.health = Math.max(0, player.health - 0.05 * d);
            player.hit = 10;
        }
    });

    bullets.forEach(bullet => {
        bullet.x += bullet.dx * d;
        bullet.y += bullet.dy * d;

        // Collision
        if (Math.abs(boss.x - bullet.x) < (bullet.r + boss.size) && Math.abs(boss.y - bullet.y) < (bullet.r + boss.size)) {
            boss.health = Math.max(0, boss.health - 0.05 * d);
            boss.hit = 10;
        }
    });

    // Frame Refresh
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    playerDraw("circle");
    bossDraw();
    balls.forEach(ball => ballDraw(ball));
    bullets.forEach(bullet => ballDraw(bullet));
}

const mainLoop = () => {
    requestAnimationFrame(mainLoop);
    draw.checked ? drawloop() : bossmode ? bossloop() : gameloop();
};

mainLoop();

// Save Game
function saveGame() {
    localStorage.setItem('mouseControl', mouseSelect.checked);
    localStorage.setItem('biasValue', biasAmount.value);
    localStorage.setItem('randomness', randomness.checked);

    localStorage.setItem('size', sizeAmount.value);
    localStorage.setItem('speed', speedAmount.value);
    localStorage.setItem('balls', ballAmount.value);
    localStorage.setItem('ballspeed', ballSpeed.value);

    localStorage.setItem('ghost', ghost.checked);
    localStorage.setItem('onehit', oneHit.checked);
    oneHit.checked ? player.maxHealth = 1 : player.maxHealth = 100;
    localStorage.setItem('god', god.checked);
    localStorage.setItem('aimbot', aimbot.checked);
    localStorage.setItem('lang', french);

    localStorage.setItem('bossmode', bossmode);
    localStorage.setItem('draw', draw.checked);
    //console.log(`Game Saved: ${localStorage.getItem('mouseControl')}, ${localStorage.getItem('biasValue')}, ${localStorage.getItem('randomness')}`);
};

// Load Game
function loadGame() {
    mouseSelect.checked = localStorage.getItem('mouseControl') === 'true';
    biasAmount.value = localStorage.getItem('biasValue') ?? 0;
    randomness.checked = localStorage.getItem('randomness') === 'true';

    sizeAmount.value = localStorage.getItem('size') ?? 8;
    speedAmount.value = localStorage.getItem('speed') ?? 0.4;
    ballAmount.value = localStorage.getItem('balls') ?? 20;
    ballSpeed.value = localStorage.getItem('ballspeed') ?? 1;

    ghost.checked = localStorage.getItem('ghost') === 'true';
    oneHit.checked = localStorage.getItem('onehit') === 'true';
    oneHit.checked ? player.maxHealth = 1 : player.maxHealth = 100;
    god.checked = localStorage.getItem('god') === 'true';
    aimbot.checked = localStorage.getItem('aimbot') === 'true';
    french = localStorage.getItem('lang') === 'true';

    bossmode = localStorage.getItem('bossmode') === 'true';
    draw.checked = localStorage.getItem('draw') === 'true';
    //console.log(`Game Loaded: ${mouseSelect.checked}, ${biasAmount.value}, ${randomness.checked}`);
};