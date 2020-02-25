const inBoardBoundary = (x, y) => x >= 0 && x < 8 && y >= 0 && y < 8;

const copyGame = game => {
  let newGame = new Game;

  // Copy information from game to newGame
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      newGame.board[i][j].state = game.board[i][j].state;
    }
  }
  newGame.turn = game.turn;

  return newGame;
}

const minimax = (position, move, depth, alpha, beta) => {
  // If the maximum depth is reached, or there are no valid moves left, 
  // return the static evaluation of the current position
  if (depth === 0 || position.getValidMoves(position.turn).length === 0) {
    return {
      evaluation: position.getStaticEvaluation(),
      move: move
    }
  }

  let bestEvaluation;
  let moves = position.getValidMoves(position.turn);

  for (const nextMove of moves) {
    let nextPosition = copyGame(position);
    nextPosition.move(nextMove.x, nextMove.y);

    // Evaluate the new position
    let newEvaluation = minimax(nextPosition, nextMove, depth - 1, alpha, beta);

    // Compare the new evaluation to the current best evaluation
    if (position.turn === -1) {
      if (!bestEvaluation || newEvaluation.evaluation > bestEvaluation.evaluation) {
        bestEvaluation = {
          evaluation: newEvaluation.evaluation,
          move: nextMove
        }
      }

      // Update alpha value
      alpha = Math.max(alpha, newEvaluation.evaluation);
    } else {
      if (!bestEvaluation || newEvaluation.evaluation < bestEvaluation.evaluation) {
        bestEvaluation = {
          evaluation: newEvaluation.evaluation,
          move: nextMove
        }
      }

      // Update beta value
      beta = Math.min(beta, newEvaluation.evaluation);
    }

    // Prune the current branch if a better evaluation has already been found
    if (beta <= alpha) {
      break;
    }
  }

  return bestEvaluation;
}

class Game {
  constructor(darkDifficulty, lightDifficulty) {
    // Create a 2D array of 64 cells to represent the board
    this.board = [];
    for (let i = 0; i < 8; i++) {
      this.board[i] = [];
      for (let j = 0; j < 8; j++) {
        this.board[i][j] = new Cell(i, j);
      }
    }

    // Place the four centre disks
    this.turn = 1;
    this.place(3, 3);
    this.place(4, 4);

    this.turn = -1;
    this.place(3, 4);
    this.place(4, 3);

    this.darkDifficulty = darkDifficulty;
    this.lightDifficulty = lightDifficulty;

    // Add the initial state to the game history
    this.history = [{
      board: this.board,
      move: null
    }];
  }

  place(x, y) {
    this.board[x][y].state = this.turn;
  }

  flip(x, y) {
    this.board[x][y].flip();
  }

  updateHistory(x, y) {
    // Add the current board state and most recent move to the game history
    this.history.push({
      board: this.board,
      move: {
        x: x,
        y: y
      },
      turn: this.turn
    })
  }

  move(x, y) {
    if (this.isValidMove(x, y, this.turn)) {
      this.place(x, y);

      // For each cell surrounding the target cell
      for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
          // If the cell contains a disk of the opposite colour
          if (inBoardBoundary(i, j) && this.board[i][j].state === this.turn * -1) {
            // Calculate the horizontal and vertical distance to the disk
            let dx = i - x;
            let dy = j - y;
            let newX = x + dx;
            let newY = y + dy;

            // Traverse the board in the direction of the disk until there is no disk of the
            // opposite colour occupying the cell
            while (inBoardBoundary(newX, newY) && this.board[newX][newY].state === this.turn * -1) {
              newX += dx;
              newY += dy;
            }

            // If the cell contains a disk of the current player's colour, traverse back to the target cell,
            // flipping each disk to the current player's side
            if (inBoardBoundary(newX, newY) && this.board[newX][newY].state === this.turn) {
              while (this.board[newX - dx][newY - dy].state === this.turn * -1) {
                this.flip(newX - dx, newY - dy);

                newX -= dx;
                newY -= dy;
              }
            }
          }
        }
      }

      this.updateHistory(x, y);

      this.turn *= -1;
    } else {
      console.error(`Invalid move`);
    }
  }

  isValidMove(x, y, side) {
    if (this.board[x][y].isEmpty()) {
      for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
          if (inBoardBoundary(i, j) && this.board[i][j].state === side * -1) {
            let dx = i - x;
            let dy = j - y;
            let newX = x + dx;
            let newY = y + dy;

            while (inBoardBoundary(newX, newY) && this.board[newX][newY].state === side * -1) {
              newX += dx;
              newY += dy;
            }

            if (inBoardBoundary(newX, newY) && this.board[newX][newY].state === side) {
              return true;
            }
          }
        }
      }
    }

    return false;
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
        if (this.board[i][j].state === -1) {
          darkCount++;
        } else if (this.board[i][j].state === 1) {
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

  getStaticEvaluation = () => this.diskCount.dark - this.diskCount.light;

  userMove(x, y) {
    this.move(x, y);
  }

  computerMove() {
    // Set search depth
    let difficulty = this.turn === -1 ? this.darkDifficulty : this.lightDifficulty;
    let move = minimax(this, null, difficulty, -64, 64).move;
    this.move(move.x, move.y);
  }
}

class DisplayGame extends Game {
  constructor(darkPlayerType, lightPlayerType, darkDifficulty, lightDifficulty, timer, timerLength) {
    super(darkDifficulty, lightDifficulty);

    this.timer = timer;
    if (this.timer) {
      this.timerLength = timerLength;
    }

    this.computerDelay = 300;

    this.darkPlayer = darkPlayerType;
    this.lightPlayer = lightPlayerType;

    if (this.darkPlayer === 'user') {
      this.showValidMoves();
    } else {
      setTimeout(this.computerMove.bind(this), this.computerDelay);
    }

    this.running = true;
  }

  showValidMoves() {
    let moves = this.getValidMoves(this.turn);
    for (const move of moves) {
      let cell = document.getElementById(`${move.x}-${move.y}`);
      let disk = (this.turn === -1 ? darkMove : lightMove).cloneNode(true);
      cell.appendChild(disk);
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

    // Apply placing animation to disk
    disk.style.animation = 'place 200ms ease-out'
    disk.onanimationend = () => {
      disk.style.animation = '';
    }

    cell.appendChild(disk);
  }

  flip(x, y) {
    super.flip(x, y);

    let cell = document.getElementById(`${x}-${y}`);
    let disk = cell.lastElementChild;

    // Apply flipping animation to disk
    disk.className.baseVal += this.board[x][y].state === -1 ? ' flip-dark' : ' flip-light';
    disk.onanimationend = () => {
      disk.className.baseVal = this.board[x][y].state === -1 ? 'disk-dark' : 'disk-light';
    }
  }

  clearValidMoves() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.board[i][j].isEmpty()) {
          const cell = document.getElementById(`${i}-${j}`);
          // Avoid removing cell references
          if (cell.lastElementChild && cell.lastElementChild.classList.contains('disk')) {
            cell.removeChild(cell.lastElementChild);
          }
        }
      }
    }
  }

  addMoveToHistoryTable(cellReference) {
    const historyContainer = document.getElementById('history-container');

    let historyData = document.createElement('td');
    historyData.id = `move-${this.history.length - 1}`;
    historyData.innerHTML = cellReference;
    historyTable.lastElementChild.appendChild(historyData);

    // Create a new table row every other turn
    if (this.turn === -1 && !this.isGameOver()) {
      historyTable.appendChild(document.createElement('tr'));
      historyTable.lastElementChild.appendChild(document.createElement('td'));
      historyTable.lastElementChild.firstElementChild.innerHTML = Math.ceil(this.history.length / 2);
    }

    historyContainer.scrollTop = historyContainer.scrollHeight;
  }

  move(x, y) {
    super.move(x, y);
    if (this.isValidMove(x, y, this.turn)) {
      this.addMoveToHistoryTable(String.fromCharCode(y + 97) + (x + 1));
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
              information.innerHTML = `Dark's turn to move`;
              this.showValidMoves();
            } else {
              information.innerHTML = 'Dark is thinking of a move...';
              setTimeout(this.computerMove.bind(this), this.computerDelay);
            }
          } else {
            if (this.lightPlayer === 'user') {
              information.innerHTML = `Light's turn to move`;
              this.showValidMoves();
            } else {
              information.innerHTML = 'Light is thinking of a move...';
              setTimeout(this.computerMove.bind(this), this.computerDelay);
            }
          }
        } else {
          // If the player has no available moves
          this.turn *= -1;
          this.updateHistory(null, null);
          this.addMoveToHistoryTable('-');
          this.startNextTurn();
        }
      } else {
        gameOver();
      }
    }
  }
}