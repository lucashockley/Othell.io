const inBoard = (x, y) => x > -1 && x < 8 && y > -1 && y < 8;

const copyGame = (game) => {
  let newGame = new Game;
  newGame.board = JSON.parse(JSON.stringify(game.board));
  newGame.turn = game.turn;
  return newGame;
}

const minimax = (position, move, depth, alpha, beta) => {
  if (depth === 0 || position.getValidMoves(position.turn).length === 0) {
    return {
      evaluation: position.staticEvaluation,
      move: move
    }
  }

  let bestEvaluation;
  let moves = position.getValidMoves(position.turn);

  for (const nextMove of moves) {
    let nextPosition = copyGame(position);
    nextPosition.move(nextMove.x, nextMove.y);

    let newEvaluation = minimax(nextPosition, nextMove, depth - 1, alpha, beta);

    if (position.turn === -1) {
      if (!bestEvaluation || newEvaluation.evaluation > bestEvaluation.evaluation) {
        bestEvaluation = {
          evaluation: newEvaluation.evaluation,
          move: nextMove
        }
      }

      alpha = Math.max(alpha, newEvaluation.evaluation);
    } else {
      if (!bestEvaluation || newEvaluation.evaluation < bestEvaluation.evaluation) {
        bestEvaluation = {
          evaluation: newEvaluation.evaluation,
          move: nextMove
        }
      }

      beta = Math.min(beta, newEvaluation.evaluation);
    }
    if (beta <= alpha) {
      break;
    }
  }

  return bestEvaluation;
}

class Game {
  constructor(darkDifficulty, lightDifficulty) {
    this.board = [];
    for (let i = 0; i < 8; i++) {
      this.board[i] = Array(8).fill(0);
    }

    this.turn = 1;
    this.place(3, 3);
    this.place(4, 4);

    this.turn = -1;
    this.place(3, 4);
    this.place(4, 3);

    this.darkDifficulty = darkDifficulty;
    this.lightDifficulty = lightDifficulty;

    this.history = [{
      board: this.board,
      move: null
    }];

    this.running = true;
  }

  place(x, y) {
    this.board[x][y] = this.turn;
  }

  flip(x, y) {
    this.board[x][y] = this.board[x][y] === -1 ? 1 : -1;
  }

  move(x, y) {
    this.place(x, y);

    for (let i = x - 1; i < x + 2; i++) {
      for (let j = y - 1; j < y + 2; j++) {
        if (inBoard(i, j) && this.board[i][j] === this.turn * -1) {
          let dx = i - x;
          let dy = j - y;
          let newX = x + dx;
          let newY = y + dy;

          while (inBoard(newX, newY) && this.board[newX][newY] === this.turn * -1) {
            newX += dx;
            newY += dy;
          }

          if (inBoard(newX, newY) && this.board[newX][newY] === this.turn) {
            while (this.board[newX - dx][newY - dy] === this.turn * -1) {
              this.flip(newX - dx, newY - dy);

              newX -= dx;
              newY -= dy;
            }
          }
        }
      }
    }

    this.history.push({
      board: this.board,
      move: {
        x: x,
        y: y
      }
    })

    this.turn *= -1;
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

  isGameOver = () => this.getValidMoves(-1).length === 0 && this.getValidMoves(1).length === 0;

  get diskCount() {
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

  get staticEvaluation() {
    return this.diskCount.dark - this.diskCount.light;
  }

  userMove(x, y) {
    this.move(x, y);
  }

  computerMove() {
    let difficulty = this.turn === -1 ? this.darkDifficulty : this.lightDifficulty;
    let move = minimax(this, null, difficulty, -64, 64).move;
    this.move(move.x, move.y);
  }
}

class DisplayGame extends Game {
  constructor(darkPlayerType, lightPlayerType, darkDifficulty, lightDifficulty) {
    super(darkDifficulty, lightDifficulty);

    this.computerDelay = 300;

    this.darkPlayer = darkPlayerType;
    this.lightPlayer = lightPlayerType;

    if (this.darkPlayer === 'user') {
      this.showValidMoves();
    } else {
      setTimeout(this.computerMove.bind(this), this.computerDelay);
    }
  }

  showValidMoves() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.isValidMove(i, j, this.turn)) {
          let cell = document.getElementById(`${i}-${j}`);
          let disk = (this.turn === -1 ? darkMove : lightMove).cloneNode(true);
          cell.innerHTML = '';
          cell.appendChild(disk);
        }
      }
    }
  }

  displayScore() {
    document.getElementById('dark-score').innerHTML = this.diskCount.dark;
    document.getElementById('light-score').innerHTML = this.diskCount.light;
  }

  place(x, y) {
    super.place(x, y);

    let cell = document.getElementById(`${x}-${y}`);
    let disk = (this.turn === -1 ? darkDisk : lightDisk).cloneNode(true);

    disk.style.animation = 'place 200ms ease-out'
    disk.onanimationend = () => {
      disk.style.animation = '';
    }

    cell.innerHTML = '';
    cell.appendChild(disk);
  }

  flip(x, y) {
    super.flip(x, y);

    let cell = document.getElementById(`${x}-${y}`);
    let disk = cell.firstElementChild;

    disk.className.baseVal += this.board[x][y] === -1 ? ' flip-dark' : ' flip-light';
    disk.onanimationend = () => {
      disk.className.baseVal = this.board[x][y] === -1 ? 'disk-dark' : 'disk-light';
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

  move(x, y) {
    super.move(x, y);
    const historyTable = document.getElementById('history').firstElementChild;
    let historyData = document.createElement('td');
    historyData.innerHTML = `${x}-${y}`;
    historyTable.lastElementChild.appendChild(historyData);
    if (this.turn === -1) {
      historyTable.appendChild(document.createElement('tr'));
      historyTable.lastElementChild.appendChild(document.createElement('td'));
      historyTable.lastElementChild.firstElementChild.innerHTML = this.history.length;
    }
  }

  userMove(x, y) {
    this.clearValidMoves();
    super.userMove(x, y);
    this.startNextTurn();
  }

  computerMove() {
    if (this.running) {
      super.computerMove();
      this.startNextTurn();
    }
  }

  startNextTurn() {
    this.displayScore();

    if (this.running) {
      if (!this.isGameOver()) {
        if (this.getValidMoves(this.turn).length > 0) {
          if (this.turn === -1) {
            if (this.darkPlayer === 'user') {
              info.innerHTML = `Dark's turn to move`;
              this.showValidMoves();
            } else {
              info.innerHTML = 'Dark is thinking of a move...';
              setTimeout(this.computerMove.bind(this), this.computerDelay);
            }
          } else {
            if (this.lightPlayer === 'user') {
              info.innerHTML = `Light's turn to move`;
              this.showValidMoves();
            } else {
              info.innerHTML = 'Light is thinking of a move...';
              setTimeout(this.computerMove.bind(this), this.computerDelay);
            }
          }
        } else {
          this.turn *= -1;
          this.startNextTurn();
        }
      } else {
        gameOver();
      }
    }
  }
}