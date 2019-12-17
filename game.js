const darkDisk = '<svg class="disk-dark" width="64" height="64" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>';
const lightDisk = '<svg class="disk-light" width="64" height="64" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>';
const darkMove = '<svg class="move dark-move" width="64" height="64" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10" onclick="selectMove()"></circle></svg>';
const lightMove = '<svg class="move light-move" width="64" height="64" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>';

const boardDisplay = document.getElementById('board');

const placeDisk = (x, y, turn, animate) => {
  board[x][y] = turn;
  let disk = document.getElementById(`${x}-${y}`);
  disk.innerHTML = turn === -1 ? darkDisk : lightDisk;
  if (animate) {
    disk.children[0].style.animation = 'place 200ms ease-out'
    disk.onanimationend = () => {
      disk.children[0].style.animation = '';
    }
  }
}

const flipDisk = (x, y, turn, animate) => {
  board[x][y] = turn;
  let disk = document.getElementById(`${x}-${y}`).firstElementChild;
  if (animate) {
    disk.className.baseVal += turn === -1 ? ' flip-dark' : ' flip-light';
    disk.onanimationend = () => {
      disk.className.baseVal = turn === -1 ? 'disk-dark' : 'disk-light';
    }
  } else {
    disk.className.baseVal = turn === -1 ? 'disk-dark' : 'disk-light';
  }
}

const isValidMove = (x, y, turn) => {
  let result = false;
  if (board[x][y] === 0) {
    for (let i = x - 1; i < x + 2; i++) {
      for (let j = y - 1; j < y + 2; j++) {
        if (i > -1 && i < 8 && j > -1 && j < 8 && board[i][j] === turn * -1) {
          let dx = i - x;
          let dy = j - y;
          let newX = x + dx;
          let newY = y + dy;
          while (newX > -1 && newX < 8 && newY > -1 && newY < 8 && board[newX][newY] === turn * -1) {
            newX += dx;
            newY += dy;
          }
          if (newX > -1 && newX < 8 && newY > -1 && newY < 8 && board[newX][newY] === turn) {
            result = true;
          }
        }
      }
    }
  }
  return result;
}

const gameOver = () => {
  alert('The game is over');
}

const move = (x, y, turn) => {
  placeDisk(x, y, turn, true);
  for (let i = x - 1; i < x + 2; i++) {
    for (let j = y - 1; j < y + 2; j++) {
      if (i > -1 && i < 8 && j > -1 && j < 8 && board[i][j] === turn * -1) {
        let dx = i - x;
        let dy = j - y;
        let newX = x + dx;
        let newY = y + dy;
        while (newX > -1 && newX < 8 && newY > -1 && newY < 8 && board[newX][newY] === turn * -1) {
          newX += dx;
          newY += dy;
        }
        if (newX > -1 && newX < 8 && newY > -1 && newY < 8 && board[newX][newY] === turn) {
          while (board[newX - dx][newY - dy] === turn * -1) {
            flipDisk(newX - dx, newY - dy, turn, true);
            newX -= dx;
            newY -= dy;
          }
        }
      }
    }
  }
}

const getDiskCount = () => {
  let lightCount = darkCount = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] === -1) {
        darkCount++;
      } else if (board[i][j] === 1) {
        lightCount++;
      }
    }
  }
  return {
    light: lightCount,
    dark: darkCount
  }
}

function userMove(x, y) {
  move(x, y, turn);
  clearValidMoves();
  if (isGameOver()) {
    gameOver();
  } else if (!hasMoves(turn * -1)) {
    showValidMoves();
  } else {
    turn *= -1;
    aiMove();
  }
}

function aiMove() {
  if (isGameOver()) {
    console.log('Game over');
    console.log(`Light: ${getDiskCount().light}, Dark: ${getDiskCount().dark}`);
    let outcome;
    if (getDiskCount().light === getDiskCount().dark) {
      outcome = 'Draw';
    } else {
      outcome = getDiskCount().light > getDiskCount().dark ? 'Light wins' : 'Dark wins';
    }
    console.log(outcome);
  } else {
    setTimeout(() => {
      let validMoves = getValidMoves(turn);
      let chosenMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      move(chosenMove.x, chosenMove.y, turn);
      if (!hasMoves(turn * -1)) {
        aiMove();
      } else {
        turn *= -1;
        showValidMoves();
        // aiMove();
      }
    }, 200)
  }
}

const getValidMoves = turn => {
  let validMoves = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (isValidMove(i, j, turn)) {
        validMoves.push({
          x: i,
          y: j
        });
      }
    }
  }
  return validMoves;
}

const showValidMoves = () => {
  let validMoves = getValidMoves(turn);
  for (let move in validMoves) {
    let cell = document.getElementById(`${validMoves[move].x}-${validMoves[move].y}`);
    cell.innerHTML = turn === -1 ? darkMove : lightMove;
  }
}

const clearValidMoves = () => {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let cell = document.getElementById(`${i}-${j}`);
      if (cell.hasChildNodes() && cell.lastChild.classList.contains('move')) {
        cell.lastChild.remove();
      }
    }
  }
}

const isGameOver = () => (getValidMoves(turn).length === 0 && getValidMoves(turn *= -1).length === 0);

const hasMoves = turn => getValidMoves(turn).length !== 0;

for (let i = 0; i < 8; i++) {
  for (let j = 0; j < 8; j++) {
    let cell = document.createElement('div');
    cell.className = 'cell';
    cell.id = `${j}-${i}`;
    boardDisplay.appendChild(cell);
  }
}

let turn = -1;
let board = Array(8).fill([]);
for (let column in board) {
  board[column] = Array(8).fill(0)
}

placeDisk(3, 3, 1);
placeDisk(3, 4, -1);
placeDisk(4, 3, -1);
placeDisk(4, 4, 1);

const selectMove = () => {
  let x = Number(event.path[2].id[0]);
  let y = Number(event.path[2].id[2]);
  if (isValidMove(x, y, turn)) {
    userMove(x, y);
  }
}

showValidMoves();
// aiMove();