const information = document.getElementById('information');
const historyTable = document.getElementById('history').firstElementChild;
const boardDisplay = document.getElementById('board');

const darkTimerDisplay = document.getElementById('dark-timer');
const lightTimerDisplay = document.getElementById('light-timer');

const timerEnableSetting = document.getElementById('timer-enabled');
const timerLengthSetting = document.getElementById('timer-length');

const displayTimerSettings = () => {
  // If both players are human, show timer settings
  if (darkPlayerType === 'user' && lightPlayerType === 'user') {
    timerEnableSetting.style.display = 'flex';
    if (timer) {
      timerLengthSetting.style.display = 'flex';
    }
  } else {
    timerEnableSetting.style.display = 'none';
    timerLengthSetting.style.display = 'none';
  }
}

const displayDifficultySettings = (side, settings) => {
  if (side === 'computer') {
    settings.style.display = 'flex';
  } else {
    settings.style.display = 'none';
  }
}

const createCells = () => {
  // Clear board  
  boardDisplay.innerHTML = '';

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let cell = document.createElement('div');
      cell.className = 'cell';
      cell.id = `${i}-${j}`;

      // Add cell references to edge cells
      if (j === 0) {
        let reference = document.createElement('span');
        reference.className = 'ref ref-y';
        reference.innerHTML = i + 1;
        cell.appendChild(reference);
      }
      if (i === 7) {
        let reference = document.createElement('span');
        reference.className = 'ref ref-x';
        reference.innerHTML = String.fromCharCode(j + 97);
        cell.appendChild(reference);
      }
      boardDisplay.appendChild(cell);
    }
  }
}

const updateTimerDisplay = (side, value) => {
  side.innerHTML = value;
}

const displayScore = () => {
  document.getElementById('dark-score').innerHTML = game.getDiskCount().dark;
  document.getElementById('light-score').innerHTML = game.getDiskCount().light;
}

const startGame = () => {
  // Stop current game from running
  if (game) {
    game.running = false;
    createCells();
  }

  game = new DisplayGame(darkPlayerType, lightPlayerType, darkDifficulty.depth, lightDifficulty.depth, timer, timerLength);
  game.displayScore();

  // Reset history table
  let headings = historyTable.firstElementChild;
  let firstRow = document.createElement('tr');
  firstRow.appendChild(document.createElement('td'));
  firstRow.firstElementChild.innerHTML = '1';
  historyTable.innerHTML = '';
  historyTable.appendChild(headings);
  historyTable.appendChild(firstRow);

  information.innerHTML = `Dark's turn to move`;
}

document.getElementById('start').addEventListener('click', startGame);

// Called when user clicks on a move indicator
const selectMove = () => {
  let x = Number(event.path[2].id[0]);
  let y = Number(event.path[2].id[2]);

  game.userMove(x, y);
}

function gameOver() {
  let darkCount = game.diskCount.dark;
  let lightCount = game.diskCount.light;

  // Display game outcome
  if (darkCount > lightCount) {
    information.innerHTML = `Dark wins the game, beating light ${darkCount} - ${lightCount}`;
  } else if (darkCount < lightCount) {
    information.innerHTML = `Light wins the game, beating dark ${lightCount} - ${darkCount}`;
  } else {
    information.innerHTML = 'The game is a draw';
  }
}

// Initial call to create an empty board
createCells();

let game;