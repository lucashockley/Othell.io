const boardDisplay = document.getElementById('board');

for (let i = 0; i < 8; i++) {
  for (let j = 0; j < 8; j++) {
    let cell = document.createElement('div');
    cell.className = 'cell';
    cell.id = `${j}-${i}`;
    cell.onclick = cellClick;
    boardDisplay.appendChild(cell);
  }
}

let board = [];
for (let i = 0; i < 8; i++) {
  board[i] = [];
  for (let j = 0; j < 8; j++) {
    board[i][j] = 0;
  }
}

function cellClick() {
  let x = event.target.id[0];
  let y = event.target.id[2];
}