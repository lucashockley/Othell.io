class Board {
  constructor() {
    // Create a 2D array of 64 cells to represent the board
    this.board = [];
    for (let i = 0; i < 8; i++) {
      this.board[i] = [];
      for (let j = 0; j < 8; j++) {
        this.board[i][j] = new Cell(i, j);
      }
    }
  }

  cellAt(x, y) {
    return this.board[x][y];
  }

  copy() {
    let newBoard = new Board;

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        newBoard.board[i][j].state = this.board[i][j].state;
      }
    }

    return newBoard;
  }
}