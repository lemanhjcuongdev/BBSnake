const playground = document.querySelector(".playground");
const currSpeed = document.querySelector(".currSpeed");
const score = document.querySelector(".score");
const h_score = document.querySelector(".h_score");
const mobile_controls = document.querySelectorAll(".mobile_controls .part i");

const btnPause = document.querySelector(".fa-solid.fa-pause");
const btnPlay = document.querySelector(".fa-solid.fa-play");

let foodX, foodY;
let snakeX, snakeY;
let directionX = 0,
  directionY = 0;
let snakeLength = [];
let speed = 186;
let currentSpeed;
let isDead = false;
let currentScore = 0;
let isPaused = false;

let highestScore = localStorage.getItem("highestScore") || 0;
h_score.innerHTML = `Highest Score: ${highestScore}`;

const randomFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
  // plus 1 because 0-30 random number and floor round number down
  console.log(Math.floor(Math.random() * 3) + 1);
};
const randomSnakePosition = () => {
  snakeX = Math.floor(Math.random() * 30) + 1;
  snakeY = Math.floor(Math.random() * 30) + 1;
  // plus 1 because 0-30 random number and floor round number down
};

const control = (e) => {
  if (e.key === "ArrowUp" && directionY !== 1) {
    directionX = 0;
    directionY = -1;
  } else if (e.key === "ArrowDown" && directionY !== -1) {
    directionX = 0;
    directionY = 1;
  } else if (e.key === "ArrowLeft" && directionX !== 1) {
    directionX = -1;
    directionY = 0;
  } else if (e.key === "ArrowRight" && directionX !== -1) {
    directionX = 1;
    directionY = 0;
  } else if (e.key === "BtnPlay" && isPaused == true) {
    currentSpeed = setInterval(initGame, speed);
    isPaused = false;
    btnPlay.classList.remove("active");
    btnPause.classList.add("active");
  } else if (e.key === "BtnPause" && isPaused == false) {
    clearInterval(currentSpeed);
    isPaused = true;
    btnPause.classList.remove("active");
    btnPlay.classList.add("active");
  }
};

const handleDeadSnake = () => {
  clearInterval(currentSpeed);
  alert("Game over! Press OK to play again");
  location.reload();
};

mobile_controls.forEach((key) => {
  key.addEventListener("click", () => {
    control({ key: key.dataset.key });
  });
});

const initGame = () => {
  if (isDead) return handleDeadSnake();
  let html = "";
  html += `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
  if (snakeX === foodX && snakeY === foodY) {
    randomFoodPosition();
    //avoid snake's head at the same food position at first and create random food after snake ate
    snakeLength.push([foodX, foodY]);
    currentScore++;

    highestScore = currentScore >= highestScore ? currentScore : highestScore;
    localStorage.setItem("highestScore", highestScore);

    score.innerHTML = `Score: ${currentScore}`;
    h_score.innerHTML = `Highest Score: ${highestScore}`;
    if (speed >= 18) {
      // speed -= snakeLength.length; // fast and furious
      speed -= 6;
    }
    clearInterval(currentSpeed);
    currentSpeed = setInterval(initGame, speed);
    currSpeed.innerHTML = `Speed: ${speed}ms/step`;
  }

  //g???n ph???n t??? m???i ??n ???????c v??o ??u??i c???a con r???n
  for (let i = snakeLength.length - 1; i > 0; i--) {
    snakeLength[i] = snakeLength[i - 1];
  }

  //set first position of snake
  snakeLength[0] = [snakeX, snakeY];

  //controlling snake
  snakeX += directionX;
  snakeY += directionY;

  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    isDead = true;
  }
  //increase length after eating
  for (let i = 0; i < snakeLength.length; i++) {
    eatenFood = snakeLength[i];
    html += `<div class="snake_head" style="grid-area: ${eatenFood[1]} / ${eatenFood[0]}">
    </div>`;
    //check r???n t??? h???y, trong m???ng snakeLength[X,Y] g???i ph???n t??? ?????u ti??n (0) l?? ?????u, ph???n t??? ti???p theo (1) l?? c???.
    //N???u (t???a ????? X c???a ?????u, t???a ????? Y c???a c???) === (t???a ????? X c???a ph???n r???n ??n v??o, t???a ????? Y c???a ph???n c???) && (t???a ????? X c???a ?????u, t???a ????? Y c???a ?????u) === (t???a ????? X c???a ph???n r???n ??n v??o, t???a ????? Y c???a ?????u) th?? die
    if (
      i !== 0 &&
      snakeLength[0][1] === snakeLength[i][1] &&
      snakeLength[0][0] === snakeLength[i][0]
    ) {
      isDead = true;
    }
  }

  playground.innerHTML = html;
};

function controller() {
  //controlling snake
  snakeX += directionX;
  snakeY += directionY;

  //increase length after eating
  for (let i = 0; i < snakeLength.length; i++) {
    eatenFood = snakeLength[i];
    html += `<div class="snake_head" style="grid-area: ${eatenFood[1]} / ${eatenFood[0]}">
      <div class="eyes">8</div>
    </div>`;
  }

  playground.innerHTML = html;
}

randomFoodPosition();
randomSnakePosition();
currentSpeed = setInterval(initGame, speed);
document.addEventListener("keydown", control);
