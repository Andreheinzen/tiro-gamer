// Acessando o canvas e os elementos do placar
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');

// Carregando as imagens
const playerImg = document.getElementById('playerImg');
const batImg = document.getElementById('batImg');
const bulletImg = document.getElementById('bulletImg');

// Variáveis do jogo
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let isGameOver = false;

// Ajusta o tamanho do canvas para a janela
canvas.width = 800;
canvas.height = 600;

// Atualiza o display da melhor pontuação
highScoreElement.innerText = highScore;

// Objeto do jogador
const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 60, // Aumentado para melhor visualização da imagem
    height: 60,
    speed: 5,
};

// Arrays para guardar os tiros e os morcegos
const bullets = [];
const bats = [];

// Funções para desenhar
function drawPlayer() {
    ctx.drawImage(playerImg, player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
}

function drawBullets() {
    bullets.forEach(bullet => {
        ctx.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function drawBats() {
    bats.forEach(bat => {
        ctx.drawImage(batImg, bat.x, bat.y, bat.width, bat.height);
    });
}

// Funções para mover
function updatePlayer(e) {
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        player.x -= player.speed;
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
        player.x += player.speed;
    }

    // Garante que o jogador não saia da tela
    if (player.x < player.width / 2) {
        player.x = player.width / 2;
    }
    if (player.x > canvas.width - player.width / 2) {
        player.x = canvas.width - player.width / 2;
    }
}

function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bullets[i].speed;

        // Remove tiros que saíram da tela
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
        }
    }
}

function updateBats() {
    for (let i = bats.length - 1; i >= 0; i--) {
        bats[i].y += bats[i].speed;

        // Verifica se o morcego chegou ao final da tela
        if (bats[i].y > canvas.height) {
            isGameOver = true;
            return;
        }
    }
}

// Disparar
function shoot() {
    const bullet = {
        x: player.x - 2.5,
        y: player.y - player.height / 2,
        width: 10,
        height: 20,
        speed: 7,
    };
    bullets.push(bullet);
}

// Spawn dos morcegos
function spawnBat() {
    const bat = {
        x: Math.random() * (canvas.width - 40) + 20,
        y: -40,
        width: 40,
        height: 40,
        speed: Math.random() * 2 + 1,
    };
    bats.push(bat);
}

// Colisão e pontuação
function checkCollisions() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = bats.length - 1; j >= 0; j--) {
            // Lógica de colisão mais precisa para imagens
            if (
                bullets[i].x < bats[j].x + bats[j].width &&
                bullets[i].x + bullets[i].width > bats[j].x &&
                bullets[i].y < bats[j].y + bats[j].height &&
                bullets[i].y + bullets[i].height > bats[j].y
            ) {
                // Colisão detectada!
                bullets.splice(i, 1);
                bats.splice(j, 1);
                score++;
                scoreElement.innerText = score;

                // Para evitar erros de índice após a remoção
                break;
            }
        }
    }
}

// Loop principal do jogo
function gameLoop() {
    if (isGameOver) {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            highScoreElement.innerText = highScore;
        }
        alert(`Fim de Jogo! Sua pontuação foi: ${score}`);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateBullets();
    updateBats();
    checkCollisions();

    drawPlayer();
    drawBullets();
    drawBats();

    requestAnimationFrame(gameLoop);
}

// Eventos de teclado
document.addEventListener('keydown', updatePlayer);
document.addEventListener('keydown', e => {
    if (e.key === ' ' || e.key === 'Spacebar') {
        shoot();
    }
});

// Spawn dos morcegos a cada 1.5 segundos
setInterval(spawnBat, 1500);

// Inicia o jogo
gameLoop();