const grid = document.querySelector(".grid");
let squares = Array.from(document.querySelectorAll(".grid div"));
const displayScore = document.querySelector("#score");
const startBtn = document.querySelector("#start-btn");
const width = 10;
let nextRandom = 0;
let timerId;
let score = 0;

// Shapes

const lShape = [
  [1, width + 1, width * 2 + 1, 2],
  [width, width + 1, width + 2, width * 2 + 2],
  [1, width + 1, width * 2 + 1, width * 2],
  [width, width * 2, width * 2 + 1, width * 2 + 2],
];

const zShape = [
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
];

const tShape = [
  [1, width, width + 1, width + 2],
  [1, width + 1, width + 2, width * 2 + 1],
  [width, width + 1, width + 2, width * 2 + 1],
  [1, width, width + 1, width * 2 + 1],
];

const oShape = [
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
];

const iShape = [
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
];

const allShapes = [lShape, zShape, tShape, oShape, iShape];

let currentPosition = 4;
let currentRotation = 0;

// randomly select shape and rotation
let random = Math.floor(Math.random() * allShapes.length);

let current = allShapes[random][currentRotation];

//add CSS class to the shape
function draw() {
  current.forEach((index) => {
    squares[currentPosition + index].classList.add("shapes");
  });
}

function undraw() {
  current.forEach((index) => {
    squares[currentPosition + index].classList.remove("shapes");
  });
}

//make the shapes move down
// timerId = setInterval(moveDown, 1000);

//assogn functions to KeyCodes
function control(e) {
  if (e.keyCode === 37) {
    moveLeft();
  } else if (e.keyCode === 38) {
    rotate();
  } else if (e.keyCode === 39) {
    moveRight();
  } else if (e.keyCode === 40) {
    moveDown();
  }
}

document.addEventListener("keydown", control);

function moveDown() {
  undraw();
  currentPosition += width;
  draw();
  freeze();
}

//freeze function
function freeze() {
  if (
    current.some((index) =>
      squares[currentPosition + index + width].classList.contains("taken")
    )
  ) {
    current.forEach((index) =>
      squares[currentPosition + index].classList.add("taken")
    );
    //start a new shape fallin
    random = nextRandom;
    nextRandom = Math.floor(Math.random() * allShapes.length);
    current = allShapes[random][currentRotation];
    currentPosition = 4;
    draw();
    displayShape();
    addScore();
    gameOver();
  }
}

//move it left
function moveLeft() {
  undraw();
  const isAtLeftEdge = current.some(
    (index) => (currentPosition + index) % width === 0
  );
  if (!isAtLeftEdge) currentPosition -= 1;

  if (
    current.some((index) =>
      squares[currentPosition + index].classList.contains("taken")
    )
  ) {
    currentPosition += 1;
  }

  draw();
}

// move it right
function moveRight() {
  undraw();
  const isAtRightEdge = current.some(
    (index) => (currentPosition + index) % width === width - 1
  );

  if (!isAtRightEdge) currentPosition += 1;

  if (
    current.some((index) =>
      squares[currentPosition + index].classList.contains("taken")
    )
  ) {
    currentPosition -= 1;
  }
  draw();
}

//rotate

function rotate() {
  undraw();
  currentRotation++;

  if (currentRotation === current.length) {
    currentRotation = 0;
  }
  current = allShapes[random][currentRotation];
  draw();
}

//show next shape in mini-grid

const dispplaySquares = document.querySelectorAll(".mini-grid div");
const displayWidth = 4;
let displayIndex = 0;

//shapes without rotations
const upNextShape = [
  [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lShape
  [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zShape
  [1, displayWidth, displayWidth + 1, displayWidth + 2], //tShape
  [0, 1, displayWidth, displayWidth + 1], //oShape
  [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //iShape
];

//display the shape in the mini-grid display
function displayShape() {
  dispplaySquares.forEach((square) => {
    square.classList.remove("shapes");
  });
  upNextShape[nextRandom].forEach((index) => {
    dispplaySquares[displayIndex + index].classList.add("shapes");
  });
}

//add functionality to the button
startBtn.addEventListener("click", () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  } else {
    draw();
    timerId = setInterval(moveDown, 1000);
    nextRandom = Math.floor(Math.random() * allShapes.length);
    displayShape();
  }
});

//score
function addScore() {
  for (let i = 0; i < 199; i += width) {
    const row = [
      i,
      i + 1,
      i + 2,
      i + 3,
      i + 4,
      i + 5,
      i + 6,
      i + 7,
      i + 8,
      i + 9,
    ];

    if (row.every((index) => squares[index].classList.contains("taken"))) {
      score += 10;
      displayScore.innerHTML = score;
      row.forEach((index) => {
        squares[index].classList.remove("taken");
        squares[index].classList.remove("shapes");
        squares[index].style.backgroundColor = "";
      });
      const squaresRemoved = squares.splice(i, width);
      squares = squaresRemoved.concat(squares);
      squares.forEach((kvadratk) => grid.appendChild(kvadratk));
    }
  }
}

//gave over
function gameOver() {
  if (
    current.some((index) =>
      squares[currentPosition + index].classList.contains("taken")
    )
  ) {
    displayScore.innerHTML = "GAME-OVER";
    clearInterval(timerId);
  }
}
