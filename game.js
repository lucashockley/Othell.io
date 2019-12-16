const boardDisplay = document.getElementById('board');

const darkDisk = '<svg class="disk-dark" width="64" height="64" viewBox="0 0 24 24" stroke-width="2" ><circle cx="12" cy="12" r="10"></circle></svg>';
const lightDisk = '<svg class="disk-light" width="64" height="64" viewBox="0 0 24 24" stroke-width="2" ><circle cx="12" cy="12" r="10"></circle></svg>';

for (let i = 0; i < 8; i++) {
  for (let j = 0; j < 8; j++) {
    let cell = document.createElement('div');
    cell.className = 'cell';
    cell.id = `${j}-${i}`;
    cell.onclick = cellClick;
    boardDisplay.appendChild(cell);
  }
}

let turn = -1;

let board = [];
for (let i = 0; i < 8; i++) {
  board[i] = [];
  for (let j = 0; j < 8; j++) {
    board[i][j] = 0;
  }
}

board[3][3] = 1;
board[3][4] = -1;
board[4][3] = -1;
board[4][4] = 1;

function draw() {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const cell = document.getElementById(`${i}-${j}`)
      if (board[i][j] === -1) {
        cell.innerHTML = darkDisk;
      } else if (board[i][j] === 1) {
        cell.innerHTML = lightDisk;
      }
    }
  }
}

draw();

function cellClick() {
  let x = event.target.id[0];
  let y = event.target.id[2];
  console.log(isValidMove(x, y, turn));
  // board[x][y] = turn;
  // draw();
  // turn *= -1;
}

function isValidMove(x, y, turn) {
  for (let i = y - 1; i < y + 2; i++) {
    for (let j = x - 1; j < x + 2; j++) {
      if ((i > -1 && i < 8) && (j > -1 && j < 8)) {
        if (board[i][j] === turn * -1) {
          let dx = j - x;
          let dy = i - y;
          let newX = x + dx;
          let newY = y + dy;
          while (newX > 0 && newX < 7 && newY > 0 && newY < 7 && board[newX][newY] === turn * -1) {
            newX += dx;
            newY += dy;
          }
          if (newX > 0 && newX < 7 && newY > 0 && newY < 7 && board[newX][newY] === turn) {
            return true;
          }
        }
      }
    }
  }
}