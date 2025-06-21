const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game Constants
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 16;
const PLAYER_X = 20;
const AI_X = canvas.width - PLAYER_X - PADDLE_WIDTH;
const PADDLE_SPEED = 6;

// Game State
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);

let playerScore = 0;
let aiScore = 0;

// Handle Mouse Movement for Player Paddle
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp within the canvas
    if (playerY < 0) playerY = 0;
    if (playerY + PADDLE_HEIGHT > canvas.height) playerY = canvas.height - PADDLE_HEIGHT;
});

// Draw Functions
function drawRect(x, y, w, h, color = '#fff') {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color = '#fff') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, size = 32, color = '#fff') {
    ctx.fillStyle = color;
    ctx.font = `${size}px Arial`;
    ctx.fillText(text, x, y);
}

function resetBall() {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// AI Paddle Movement
function moveAI() {
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ballY + BALL_SIZE / 2 - 10) {
        aiY += PADDLE_SPEED * 0.7;
    } else if (aiCenter > ballY + BALL_SIZE / 2 + 10) {
        aiY -= PADDLE_SPEED * 0.7;
    }
    // Clamp
    if (aiY < 0) aiY = 0;
    if (aiY + PADDLE_HEIGHT > canvas.height) aiY = canvas.height - PADDLE_HEIGHT;
}

// Collision Detection
function rectIntersect(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

// Game Loop
function gameLoop() {
    // Move Ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Wall collision
    if (ballY < 0) {
        ballY = 0;
        ballSpeedY *= -1;
    } else if (ballY + BALL_SIZE > canvas.height) {
        ballY = canvas.height - BALL_SIZE;
        ballSpeedY *= -1;
    }

    // Paddle collision (Player)
    if (rectIntersect(ballX, ballY, BALL_SIZE, BALL_SIZE, PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT)) {
        ballX = PLAYER_X + PADDLE_WIDTH; // Avoid sticking
        ballSpeedX *= -1;
        // Add a bit of random vertical speed
        let collidePoint = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
        ballSpeedY = collidePoint * 0.25;
    }

    // Paddle collision (AI)
    if (rectIntersect(ballX, ballY, BALL_SIZE, BALL_SIZE, AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT)) {
        ballX = AI_X - BALL_SIZE; // Avoid sticking
        ballSpeedX *= -1;
        // Add a bit of random vertical speed
        let collidePoint = (ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
        ballSpeedY = collidePoint * 0.25;
    }

    // Score logic
    if (ballX < 0) {
        aiScore++;
        resetBall();
    } else if (ballX + BALL_SIZE > canvas.width) {
        playerScore++;
        resetBall();
    }

    moveAI();

    // Draw Everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw net
    for (let i = 10; i < canvas.height; i += 30) {
        drawRect(canvas.width / 2 - 1, i, 2, 20, '#444');
    }

    // Draw paddles
    drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, '#1e90ff');
    drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, '#ff4136');

    // Draw ball
    drawCircle(ballX + BALL_SIZE / 2, ballY + BALL_SIZE / 2, BALL_SIZE / 2, '#fff');

    // Draw scores
    drawText(playerScore, canvas.width / 4, 50, 32, '#1e90ff');
    drawText(aiScore, 3 * canvas.width / 4, 50, 32, '#ff4136');

    requestAnimationFrame(gameLoop);
}

gameLoop();
