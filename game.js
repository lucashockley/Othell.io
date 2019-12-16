const darkDisk = '<svg class="disk-dark" width="64" height="64" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>';
const lightDisk = '<svg class="disk-light" width="64" height="64" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>';
const darkMove = '<svg class="dark-move" onclick="selectMove()" width="64" height="64" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>';
const lightMove = '<svg class="light-move" width="64" height="64" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>';

const boardDisplay = document.getElementById('board');

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

board[3][3] = 1;
board[3][4] = -1;
board[4][3] = -1;
board[4][4] = 1;

document.getElementById('3-3').innerHTML = lightDisk;
document.getElementById('3-4').innerHTML = darkDisk
document.getElementById('4-3').innerHTML = darkDisk;
document.getElementById('4-4').innerHTML = lightDisk;

showValidMoves();

function selectMove() {
  let x = Number(event.path[1].id[0]);
  let y = Number(event.path[1].id[2]);
  if (isValidMove(x, y, turn)) {
    move(x, y, turn)
    if (getValidMoves(turn).length === 0 && getValidMoves(turn * -1).length === 0) {
      let info = document.createElement('div');
      info.innerHTML = 'The game is over';
      document.body.appendChild(info);
    } else if (getValidMoves(turn * -1).length !== 0) {
      turn *= -1;
      showValidMoves();
      let validMoves = getValidMoves(turn);
      let AiMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      setTimeout(() => {
        move(AiMove.x, AiMove.y, turn);
        turn *= -1;
        showValidMoves();
      }, 500);
    }
  }
}

function isValidMove(x, y, turn) {
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

function move(x, y, turn) {
  board[x][y] = turn;
  let disk = document.getElementById(`${x}-${y}`);
  disk.innerHTML = turn === -1 ? darkDisk : lightDisk;
  disk.children[0].style.animation = 'place 200ms ease-out'
  disk.onanimationend = () => {
    disk.children[0].style.animation = '';
  }
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
            board[newX - dx][newY - dy] = turn;
            let disk = document.getElementById(`${newX - dx}-${newY - dy}`).firstElementChild;
            disk.className.baseVal += turn === -1 ? ' flip-dark' : ' flip-light';
            disk.onanimationend = () => {
              disk.className.baseVal = turn === -1 ? 'disk-dark' : 'disk-light';
            }
            newX -= dx;
            newY -= dy;
          }
        }
      }
    }
  }
}

function showValidMoves() {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let cell = document.getElementById(`${i}-${j}`);
      if (isValidMove(i, j, turn)) {
        cell.innerHTML = turn === -1 ? darkMove : lightMove;
        cell.firstElementChild.id = cell.id;
      } else if (board[i][j] === 0) {
        cell.innerHTML = '';
      }
    }
  }
}

function getValidMoves(turn) {
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