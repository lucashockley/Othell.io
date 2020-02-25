class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.reference = String.fromCharCode(x + 97) + (y + 1);

    this.state = 0;
  }

  flip() {
    this.state = this.state *= -1;
  }

  isEmpty() {
    return this.state === 0;
  }
}