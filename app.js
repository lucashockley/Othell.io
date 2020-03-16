const information = document.getElementById('information');
const historyTable = document.getElementById('history').firstElementChild;
const boardDisplay = document.getElementById('board');

const darkTimerDisplay = document.getElementById('dark-timer');
const lightTimerDisplay = document.getElementById('light-timer');

const clearBoardDisplay = () => {
  boardDisplay.innerHTML = '';
}

const createCells = () => {
  // Clear board    
  clearBoardDisplay();

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

const displayScore = () => {
  document.getElementById('dark-score').innerHTML = game.getDiskCount().dark;
  document.getElementById('light-score').innerHTML = game.getDiskCount().light;
}

const resetBoard = () => {
  if (game) {
    game.running = false;
    darkTimerDisplay.innerHTML = '-';
    lightTimerDisplay.innerHTML = '-';
    createCells();
  }
}

const resetHistoryTable = () => {
  let headings = historyTable.firstElementChild;
  let firstRow = document.createElement('tr');
  firstRow.appendChild(document.createElement('td'));
  firstRow.firstElementChild.innerHTML = '1';
  historyTable.innerHTML = '';
  historyTable.appendChild(headings);
  historyTable.appendChild(firstRow);
}

const startGame = () => {
  // Stop current game from running  
  resetBoard();

  game = new DisplayGame(darkPlayerType, lightPlayerType, darkDifficulty.depth, lightDifficulty.depth, timer, timerLength);
  game.displayScore();

  // Reset history table
  resetHistoryTable();

  information.innerHTML = `Dark's turn to move`;
}

document.getElementById('start').addEventListener('click', startGame);

// Function called when user clicks on a move indicator
const selectMove = () => {
  // Get coordinates of cell from event path
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

  if (darkCount === 0) {
    information.innerHTML = 'Light wins the game, beating dark 64 - 0';
  } else if (lightCount === 0) {
    information.innerHTML = 'Dark wins the game, beating light 64 - 0';
  }

  if (game.timer) {
    if (game.darkTimer.value <= 0) {
      information.innerHTML = 'Light wins the game as dark ran out of time';
    } else if (game.lightTimer.value <= 0) {
      information.innerHTML = 'Dark wins the game as light ran out of time';
    }
  }

  game.clearValidMoves();
}

// Initial call to create an empty board
createCells();

let game;