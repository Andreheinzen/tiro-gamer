// Referências aos elementos HTML
const menu = document.getElementById('menu');
const usernameInput = document.getElementById('usernameInput');
const playButton = document.getElementById('playButton');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Variáveis do jogo
const playerSpeed = 5;
const bulletSpeed = 7;
const asteroidSpeed = 2;
let score = 0;
let playerName = '';
let isGameRunning = false;
let isShooting = false; // Flag para controlar o tempo de disparo

// Estrelas para o fundo
const stars = [];
const numberOfStars = 300;
for (let i = 0; i < numberOfStars; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 0.5 + 0.1
    });
}

// Player
const player = {
    x: canvas.width / 2,
    y: canvas.height - 60,
    width: 50,
    height: 50,
};

// Arrays para guardar as balas e asteroides
const bullets = [];
const asteroids = [];

// Controles de teclado
const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// NOVO: Eventos de mouse para atirar
document.addEventListener('mousedown', (e) => {
    // 0: Botão esquerdo, 1: Roda do mouse, 2: Botão direito
    if (isGameRunning && e.button === 2 && !isShooting) {
        bullets.push({
            x: player.x - 2.5,
            y: player.y,
            width: 5,
            height: 10
        });
        isShooting = true;
        setTimeout(() => {
            isShooting = false;
        }, 200); // Cooldown de 200ms
    }
});

// NOVO: Previne o menu de contexto padrão do navegador
canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Evento de clique no botão de jogar
playButton.addEventListener('click', () => {
    const name = usernameInput.value.trim();
    if (name) {
        playerName = name;
        isGameRunning = true;
        menu.style.display = 'none';
        canvas.style.display = 'block';
        gameLoop();
    } else {
        alert('Por favor, insira seu nome de usuário!');
    }
});

// Desenha o player na tela
function drawPlayer() {
    ctx.fillStyle = 'cyan';
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(player.x - player.width / 2, player.y + player.height);
    ctx.lineTo(player.x + player.width / 2, player.y + player.height);
    ctx.closePath();
    ctx.fill();
}

// Desenha uma bala
function drawBullet(bullet) {
    ctx.fillStyle = 'lime';
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
}

// Desenha um asteroide
function drawAsteroid(asteroid) {
    ctx.fillStyle = 'gray';
    ctx.beginPath();
    ctx.arc(asteroid.x, asteroid.y, asteroid.radius, 0, Math.PI * 2);
    ctx.fill();
}

// Desenha a pontuação e o nome do jogador
function drawInfo() {
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Jogador: ${playerName}`, 10, 30);
    ctx.fillText(`Pontuação: ${score}`, 10, 60);
}

// Desenha o cenário de estrelas
function drawBackground() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (const star of stars) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    }
}

// Movimento do player
function updatePlayer() {
    if (keys['ArrowLeft'] && player.x > player.width / 2) {
        player.x -= playerSpeed;
    }
    if (keys['ArrowRight'] && player.x < canvas.width - player.width / 2) {
        player.x += playerSpeed;
    }
    // Lógica para atirar com a barra de espaço (mantida)
    if (keys[' '] && !isShooting) {
        bullets.push({
            x: player.x - 2.5,
            y: player.y,
            width: 5,
            height: 10
        });
        isShooting = true;
        setTimeout(() => {
            isShooting = false;
        }, 200);
    }
}

// Cria novos asteroides aleatoriamente
function createAsteroids() {
    if (Math.random() < 0.02) {
        asteroids.push({
            x: Math.random() * canvas.width,
            y: -20,
            radius: Math.random() * 20 + 10,
        });
    }
}

// Loop principal do jogo
function gameLoop() {
    if (!isGameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    updatePlayer();
    drawPlayer();

    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= bulletSpeed;
        drawBullet(bullets[i]);
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }

    createAsteroids();
    for (let i = 0; i < asteroids.length; i++) {
        asteroids[i].y += asteroidSpeed;
        drawAsteroid(asteroids[i]);
        for (let j = 0; j < bullets.length; j++) {
            const dx = bullets[j].x - asteroids[i].x;
            const dy = bullets[j].y - asteroids[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy);