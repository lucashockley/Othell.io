const boardDisplay = document.getElementById('board');

const disk = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
disk.setAttribute('width', '60');
disk.setAttribute('height', '60');
disk.setAttribute('viewBox', '0 0 24 24');
disk.setAttribute('stroke-width', '2');

const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
circle.setAttribute('cx', '12');
circle.setAttribute('cy', '12');
circle.setAttribute('r', '9');

disk.appendChild(circle);

const darkDisk = disk.cloneNode(true);
darkDisk.className.baseVal = 'disk-dark';

const lightDisk = disk.cloneNode(true);
lightDisk.className.baseVal = 'disk-light';

let darkMove;
let lightMove;

const inBoard = (x, y) => x > -1 && x < 8 && y > -1 && y < 8;

class Game {
  constructor(darkPlayerType, lightPlayerType, animate, aiDelay) {
    this.animate = animate;
    this.aiDelay = aiDelay;

    this.turn = -1;

    this.board = [];
    for (let i = 0; i < 8; i++) {
      this.board[i] = Array(8).fill(0);
    }

    this.place(3, 3, 1);
    this.place(3, 4, -1);
    this.place(4, 3, -1);
    this.place(4, 4, 1);

    this.displayScore();

    this.darkPlayer = darkPlayerType;
    this.lightPlayer = lightPlayerType;

    if (this.darkPlayer === 'user') {
      darkMove = disk.cloneNode(true);
      darkMove.firstChild.setAttribute('onclick', 'selectMove()')
      darkMove.className.baseVal = 'move-dark';

      this.showValidMoves(-1);
    }
    if (this.lightPlayer === 'user') {
      lightMove = disk.cloneNode(true);
      lightMove.firstChild.setAttribute('onclick', 'selectMove()')
      lightMove.className.baseVal = 'move-light';
    }
    if (this.darkPlayer === 'ai') {
      this.aiMove();
    }

    this.running = true;
  }

  displayScore() {
    document.getElementById('dark-score').innerHTML = this.getDiskCount().dark;
    document.getElementById('light-score').innerHTML = this.getDiskCount().light;
  }

  place(x, y, side) {
    this.board[x][y] = side;

    let cell = document.getElementById(`${x}-${y}`);
    let disk = (side === -1 ? darkDisk : lightDisk).cloneNode(true);

    if (this.animate) {
      disk.style.animation = 'place 200ms ease-out'
      disk.onanimationend = () => {
        disk.style.animation = '';
      }
    }

    cell.innerHTML = '';
    cell.appendChild(disk);
  }

  flip(x, y, side) {
    this.board[x][y] = side;

    let cell = document.getElementById(`${x}-${y}`);
    let disk = cell.firstElementChild;

    if (this.animate) {
      disk.className.baseVal += side === -1 ? ' flip-dark' : ' flip-light';
      disk.onanimationend = () => {
        disk.className.baseVal = side === -1 ? 'disk-dark' : 'disk-light';
      }
    } else {
      disk.className.baseVal = side === -1 ? 'disk-dark' : 'disk-light';
    }
  }

  move(x, y, side) {
    this.place(x, y, side);

    for (let i = x - 1; i < x + 2; i++) {
      for (let j = y - 1; j < y + 2; j++) {
        if (inBoard(i, j) && this.board[i][j] === side * -1) {
          let dx = i - x;
          let dy = j - y;
          let newX = x + dx;
          let newY = y + dy;

          while (inBoard(newX, newY) && this.board[newX][newY] === side * -1) {
            newX += dx;
            newY += dy;
          }

          if (inBoard(newX, newY) && this.board[newX][newY] === side) {
            while (this.board[newX - dx][newY - dy] === side * -1) {
              this.flip(newX - dx, newY - dy, side);

              newX -= dx;
              newY -= dy;
            }
          }
        }
      }
    }
  }

  isValidMove(x, y, side) {
    let result = false;

    if (this.board[x][y] === 0) {
      for (let i = x - 1; i < x + 2; i++) {
        for (let j = y - 1; j < y + 2; j++) {
          if (inBoard(i, j) && this.board[i][j] === side * -1) {
            let dx = i - x;
            let dy = j - y;
            let newX = x + dx;
            let newY = y + dy;

            while (inBoard(newX, newY) && this.board[newX][newY] === side * -1) {
              newX += dx;
              newY += dy;
            }

            if (inBoard(newX, newY) && this.board[newX][newY] === side) {
              result = true;
            }
          }
        }
      }
    }

    return result;
  }

  getValidMoves(side) {
    let validMoves = [];

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.isValidMove(i, j, side)) {
          validMoves.push({
            x: i,
            y: j
          });
        }
      }
    }

    return validMoves;
  }

  showValidMoves(side) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.isValidMove(i, j, side)) {
          let cell = document.getElementById(`${i}-${j}`);
          let disk = (side === -1 ? darkMove : lightMove).cloneNode(true);
          cell.innerHTML = '';
          cell.appendChild(disk);
        }
      }
    }
  }

  clearValidMoves() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.board[i][j] === 0) {
          document.getElementById(`${i}-${j}`).innerHTML = '';
        }
      }
    }
  }

  isGameOver() {
    return (this.getValidMoves(this.turn).length === 0 && this.getValidMoves(this.turn * -1).length === 0)
  }

  getDiskCount() {
    let darkCount = 0;
    let lightCount = 0;

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.board[i][j] === -1) {
          darkCount++;
        } else if (this.board[i][j] === 1) {
          lightCount++;
        }
      }
    }

    return {
      dark: darkCount,
      light: lightCount,
      total: darkCount + lightCount
    }
  }

  userMove(x, y) {
    this.move(x, y, this.turn);
    this.clearValidMoves();
    this.startNextTurn();
  }

  aiMove() {
    setTimeout(() => {
      if (this.running) {
        let validMoves = this.getValidMoves(this.turn);
        let chosenMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        this.move(chosenMove.x, chosenMove.y, this.turn);
        this.startNextTurn();
      }
    }, this.aiDelay)
  }

  startNextTurn() {
    this.displayScore();

    if (this.running) {
      this.turn *= -1;

      if (!this.isGameOver()) {
        if (this.getValidMoves(this.turn).length > 0) {
          if (this.turn === -1) {
            if (this.darkPlayer === 'user') {
              this.showValidMoves(-1);
            } else {
              this.aiMove();
            }
          } else {
            if (this.lightPlayer === 'user') {
              this.showValidMoves(1);
            } else {
              this.aiMove();
            }
          }
        } else {
          this.startNextTurn();
        }
      }
    }
  }
}

const createCells = () => {
  boardDisplay.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let cell = document.createElement('div');
      cell.className = 'cell';
      cell.id = `${i}-${j}`;
      boardDisplay.appendChild(cell);
    }
  }
}

createCells();

let game;

const startNewGame = () => {
  if (game) {
    game.running = false;
    createCells();
  }

  let settings = document.getElementById('settings');

  let darkPlayerType = settings.children[0].lastElementChild.firstElementChild.checked ? 'ai' : 'user';
  let lightPlayerType = !settings.children[1].lastElementChild.firstElementChild.checked ? 'ai' : 'user';
  let animations = !settings.children[2].lastElementChild.firstElementChild.checked;

  game = new Game(darkPlayerType, lightPlayerType, animations, 500);
}

const selectMove = () => {
  let x = Number(event.path[2].id[0]);
  let y = Number(event.path[2].id[2]);

  game.userMove(x, y);
}