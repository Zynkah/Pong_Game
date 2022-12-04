var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 15;
var ballSpeedY = 5;
var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 15;
const PADDLE_HEIGHT = 125;
var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 5;
var showingWinScreen = false;

// paddle movement
function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY,
  };
}

// reset win game screen
function handleMouseClick(evt) {
  if (showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}

// game board
window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");
  // speed of the ball & game board load
  let framesPerSecond = 40;
  setInterval(function () {
    moveEverything();
    drawEverything();
  }, 1000 / framesPerSecond);
  // win screen reset
  canvas.addEventListener("mousedown", handleMouseClick);
  // paddle movement
  canvas.addEventListener("mousemove", function (evt) {
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
  });
};

function ballReset() {
  // win screen
  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
  }
  // out of bounds reset
  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}
// Right paddle AI
function computerMovement() {
  var paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2;
  if (paddle2YCenter < ballY - 35) {
    paddle2Y += 6;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y -= 6;
  }
}

function moveEverything() {
  // win screen
  if (showingWinScreen) {
    return;
  }
  // AI Paddle
  computerMovement();
  // speed of the ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  // wall barriers
  if (ballX < 0) {
    if (
      // left paddle blocking
      ballY > paddle1Y &&
      ballY < paddle1Y + PADDLE_HEIGHT
    ) {
      ballSpeedX = -ballSpeedX;
      // angled ball speed
      var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player2Score++; // must be before ballReset
      ballReset();
    }
  }
  if (ballX > canvas.width) {
    if (
      // right paddle blocking
      ballY > paddle2Y &&
      ballY < paddle2Y + PADDLE_HEIGHT
    ) {
      ballSpeedX = -ballSpeedX;
      // angled ball speed
      var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player1Score++; // must be before ballReset
      ballReset();
    }
  }
  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
}

//net function
function drawNet() {
  for (var i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, "white");
  }
}

function drawEverything() {
  // game board background
  colorRect(0, 0, canvas.width, canvas.height, "darkslategrey");
  // win screen
  if (showingWinScreen) {
    canvasContext.fillStyle = "white";
    canvasContext.font = "bold 40px serif";
    canvasContext.letterSpacing = "2px";
    canvasContext.fontVariantCaps = "petite-caps";
    if (player1Score >= WINNING_SCORE) {
      canvasContext.fillText("You Won", canvas.width / 2.5, canvas.height / 3);
    } else if (player2Score >= WINNING_SCORE) {
      canvasContext.fillText("You Lose", canvas.width / 2.5, canvas.height / 3);
    }
    canvasContext.fillText("Click to Play Again", canvas.width / 3.3, canvas.height / 2);
    return;
  }
  // net function
  drawNet();
  // left paddle
  colorRect(0, paddle1Y, PADDLE_THICKNESS, 100, "white");
  // right paddle
  colorRect(
    canvas.width - PADDLE_THICKNESS,
    paddle2Y,
    PADDLE_THICKNESS,
    100,
    "white"
  );
  // ball
  colorCircle(ballX, ballY, 10, "white");
  // score
  canvasContext.font = "bold 40px serif";
  canvasContext.fillText(player1Score, 100, 100);
  canvasContext.fillText(player2Score, canvas.width - 100, 100);
}

// ball design
function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true); //shape of ball
  canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
  // colors
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}
