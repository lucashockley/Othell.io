class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    // Set board reference, e.g. 'd5'
    this.reference = String.fromCharCode(x + 97) + (y + 1);

    this.state = 0;
  }

  flip() {
    this.state = this.state *= -1;
  }

  isEmpty = () => this.state === 0;
}