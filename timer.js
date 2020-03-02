class Timer {
  constructor(side, startLength, game) {
    // Allow a timer to reference it's parent game
    this.game = game;

    this.display = side === 'dark' ? darkTimerDisplay : lightTimerDisplay;

    this.startLength = startLength;
    // Convert start length given in minutes to milliseconds
    this.value = this.startLength * 60 * 1000;
    this.countdown;
  }

  start() {
    this.countdown = setInterval(() => {
      if (!this.game.running) {
        this.stop();
      } else {
        if (this.value > 0) {
          this.value -= 100;
        } else {
          this.stop();
          gameOver();
        }
        this.updateDisplay();
      }
    }, 100)
  }

  stop() {
    clearInterval(this.countdown);
  }

  formatTime() {
    // Convert from milliseconds to minutes and seconds
    let minutes = Math.floor(this.value / 1000 / 60).toString();
    let seconds = Math.floor(this.value / 1000 % 60).toString();

    // Add leading zero if seconds is only one digit
    if (seconds.length === 1) {
      seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
  }

  updateDisplay() {
    this.display.innerHTML = this.formatTime();
  }
}