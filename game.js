const boardDisplay = document.getElementById('board');

for (let i = 0; i < 64; i++) {
  let cell = document.createElement('div');
  cell.className = 'cell';
  boardDisplay.appendChild(cell);
}

let board = [];
for (let i = 0; i < 8; i++) {
  board[i] = [];
  for (let j = 0; j < 8; j++) {
    board[i][j] = 0;
  }
}