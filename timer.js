class Timer {
  constructor(side, startLength) {
    this.display = side === 'dark' ? darkTimerDisplay : lightTimerDisplay;
    this.startLength = startLength;
    this.value = this.startLength * 60;
    this.countdown;
  }

  start() {
    this.countdown = setInterval(() => {
      if (this.value > 0) {
        this.value--;
      } else {
        this.stop();
      }
    }, 1000)
  }

  stop() {
    clearInterval(this.countdown);
  }

  formatTime() {
    let minutes = Math.floor(this.value / 60).toString();
    let seconds = Math.round(this.value % 60).toString();

    if (seconds.length === 1) {
      seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
  }
}