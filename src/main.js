const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const player_defaults = {
  width: 20,
  height: 200,
  color: "white",
  key: undefined,
};
let player_1, player_2, ball;

const setup = () => {
  // canvas.width = window.innerWidth;
  // canvas.height = window.innerHeight;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText("Click to start", canvas.width / 2 - 100, canvas.height / 2);
  canvas.addEventListener("click", startGame);
};

const spaw = (x, y, width, height, color = "#fff") => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
};

const draw = () => {
  spaw(player_1.x, player_1.y, player_1.width, player_1.height, player_1.color);
  spaw(player_2.x, player_2.y, player_2.width, player_2.height, player_2.color);
  spaw(ball.x, ball.y, ball.width, ball.height, ball.color);
  writePoints();
};

const clear = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const initBall = () => {
  ball = {
    width: 10,
    height: 10,
    x: canvas.width / 2 - 10,
    y: canvas.height / 2 - 10,
    dx: Math.pow(2, Math.floor(Math.random() * 2) + 1) - 3,
    dy: Math.pow(2, Math.floor(Math.random() * 2) + 1) - 3,
    color: "white",
  };
};

const initPlayers = () => {
  player_1 = {
    x: 10,
    y: canvas.height / 2 - player_defaults.height / 2,
    points: 0,
    ...player_defaults,
  };
  player_2 = {
    x: canvas.width - player_defaults.width - 10,
    y: canvas.height / 2 - player_defaults.height / 2,
    points: 0,
    ...player_defaults,
  };
};

const startListeners = () => {
  document.addEventListener("keydown", ({ keyCode }) => {
    if (keyCode === 87 || keyCode === 83) {
      player_1.key = keyCode;
    }

    if (keyCode === 38 || keyCode === 40) {
      player_2.key = keyCode;
    }
  });

  document.addEventListener("keyup", ({ keyCode }) => {
    if (keyCode === 87 || keyCode === 83) {
      player_1.key = undefined;
    }

    if (keyCode === 38 || keyCode === 40) {
      player_2.key = undefined;
    }
  });
};

const startGame = () => {
  canvas.removeEventListener("click", startGame);
  clear();
  initBall();
  initPlayers();
  startListeners();
  setInterval(tick, 1000 / 60);
};

const playerMoviments = (player, keyUp, keydown) => {
  if (player.key === keyUp && player.y > 0) {
    player.y -= 10;
  } else if (
    player.key === keydown &&
    player.y + player.height < canvas.height
  ) {
    player.y += 10;
  }
};

const writePoints = () => {
  ctx.fillStyle = "white";
  ctx.font = "30px Monospace";
  ctx.fillText(`${player_1.points}`, canvas.width / 2 - 100, 50);
  ctx.fillText(`${player_2.points}`, canvas.width / 2 + 100, 50);
};

const ballMoviments = ({ velocicy = 5 }) => {
  // Check if is colliding with the player 1
  if (
    ball.x >= player_1.x &&
    ball.x <= player_1.x + 10 &&
    ball.y >= player_1.y &&
    ball.y <= player_1.y + player_1.height
  ) {
    ball.dx = 1;
  }

  // Check if is colliding with the player 2
  if (
    ball.x >= player_2.x &&
    ball.x <= player_2.x + 10 &&
    ball.y >= player_2.y &&
    ball.y <= player_2.y + player_2.height
  ) {
    ball.dx = -1;
  }

  // check if is colliding with the top or bottom
  if (ball.y <= 0 || ball.y + ball.height >= canvas.height) {
    ball.dy *= -1;
  }

  // check if is colliding with the left or right
  if (ball.x <= 0 || ball.x + ball.width >= canvas.width) {
    ball.dx *= -1;
  }

  if (ball.x + ball.width >= canvas.width) {
    player_1.points++;
    initBall();
  }

  if (ball.x <= 0) {
    player_2.points++;
    initBall();
  }

  ball.x += velocicy * ball.dx;
  ball.y += velocicy * ball.dy;
};

const tick = () => {
  playerMoviments(player_1, 87, 83);
  playerMoviments(player_2, 38, 40);
  ballMoviments({
    velocicy: 5,
  });
  clear();
  draw();
  console.log("Tick");
};

setup();