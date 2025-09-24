// Acessando o canvas e o contexto 2D
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ajusta o tamanho do canvas para a janela do navegador
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Objeto do jogador
const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 30,
    height: 30,
    speed: 5,
    dx: 0, // Delta X: para controle de movimento horizontal
    dy: 0, // Delta Y: para controle de movimento vertical
};

// Funções para desenhar
function drawPlayer() {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.width / 2, 0, Math.PI * 2);
    ctx.fillStyle = '#00ff00';
    ctx.fill();
    ctx.closePath();
}

// Funções para mover
function update() {
    // Limpa a tela
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Atualiza a posição do jogador
    player.x += player.dx;
    player.y += player.dy;

    // Garante que o jogador não saia da tela
    if (player.x - player.width / 2 < 0) {
        player.x = player.width / 2;
    }
    if (player.x + player.width / 2 > canvas.width) {
        player.x = canvas.width - player.width / 2;
    }
    if (player.y - player.height / 2 < 0) {
        player.y = player.height / 2;
    }
    if (player.y + player.height / 2 > canvas.height) {
        player.y = canvas.height - player.height / 2;
    }

    // Desenha o jogador na nova posição
    drawPlayer();

    // Chama a si mesma para criar um loop
    requestAnimationFrame(update);
}

// Eventos de teclado
function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'd') {
        player.dx = player.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        player.dx = -player.speed;
    } else if (e.key === 'ArrowUp' || e.key === 'w') {
        player.dy = -player.speed;
    } else if (e.key === 'ArrowDown' || e.key === 's') {
        player.dy = player.speed;
    }
}

function keyUp(e) {
    if (
        e.key === 'ArrowRight' ||
        e.key === 'd' ||
        e.key === 'ArrowLeft' ||
        e.key === 'a' ||
        e.key === 'ArrowUp' ||
        e.key === 'w' ||
        e.key === 'ArrowDown' ||
        e.key === 's'
    ) {
        player.dx = 0;
        player.dy = 0;
    }
}

// Adiciona os event listeners
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Inicia o jogo
update();