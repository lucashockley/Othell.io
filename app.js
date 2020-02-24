let darkPlayerType = 'user';
let lightPlayerType = 'computer';
let lightDifficulty = darkDifficulty = {
  depth: 2
};
let timer = false;
let timerLength = 5;

const timerSetting = document.getElementById('timer-enabled');
const timerLengthSetting = document.getElementById('timer-length');

const setDifficulty = (side, difficulty) => {
  switch (difficulty) {
    case 'Beginner':
      side.depth = 1;
      break;

    case 'Intermediate':
      side.depth = 2;
      break;

    case 'Expert':
      side.depth = 4;
      break;

    case 'Master':
      side.depth = 8;
      break;
  }
}

const displayTimerSettings = () => {
  if (darkPlayerType === 'user' && lightPlayerType === 'user') {
    timerSetting.style.display = 'flex';
    if (timer) {
      timerLengthSetting.style.display = 'flex';
      document.getElementById('dark-timer').innerHTML = `${timerLength}:00`;
      document.getElementById('light-timer').innerHTML = `${timerLength}:00`;
    }
  } else {
    document.getElementById('dark-timer').innerHTML = '-';
    document.getElementById('light-timer').innerHTML = '-';
    timerSetting.style.display = 'none';
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

const changeSetting = () => {
  if (!event.target.classList.contains('selected')) {
    let path = event.path;
    for (const option of path[1].children) {
      option.classList.remove('selected');
    }
    path[0].classList.add('selected');

    switch (path[2].id) {
      case 'dark-player':
        darkPlayerType = path[0].innerHTML === 'Human' ? 'user' : 'computer';
        displayTimerSettings();
        displayDifficultySettings(darkPlayerType, document.getElementById('dark-difficulty'));
        break;

      case 'dark-difficulty':
        setDifficulty(darkDifficulty, path[0].innerHTML);
        break;

      case 'light-player':
        lightPlayerType = path[0].innerHTML === 'Human' ? 'user' : 'computer';
        displayTimerSettings();
        displayDifficultySettings(lightPlayerType, document.getElementById('light-difficulty'));
        break;

      case 'light-difficulty':
        setDifficulty(lightDifficulty, path[0].innerHTML);
        break;

      case 'timer-enabled':
        timer = path[0].innerHTML === 'Enabled' ? true : false;
        if (timer) {
          timerLengthSetting.style.display = 'flex';
          document.getElementById('dark-timer').innerHTML = `${timerLength}:00`;
          document.getElementById('light-timer').innerHTML = `${timerLength}:00`;
        } else {
          timerLengthSetting.style.display = 'none';
          document.getElementById('dark-timer').innerHTML = '-';
          document.getElementById('light-timer').innerHTML = '-';
        }
        break;

      case 'timer-length':
        timerLength = path[0].innerHTML.split(':')[0];
        document.getElementById('dark-timer').innerHTML = `${timerLength}:00`;
        document.getElementById('light-timer').innerHTML = `${timerLength}:00`;
        break;
    }
  }
}

const settingsDiv = document.getElementById('settings');

for (const setting of settingsDiv.children) {
  for (const option of setting.lastElementChild.children) {
    option.addEventListener('click', changeSetting);
  }
}

const info = document.getElementById('info');
const historyTable = document.getElementById('history').firstElementChild;
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
darkDisk.className.baseVal = 'disk disk-dark';

const lightDisk = disk.cloneNode(true);
lightDisk.className.baseVal = 'disk disk-light';

let darkMove = disk.cloneNode(true);
darkMove.firstChild.setAttribute('onclick', 'selectMove()')
darkMove.className.baseVal = 'disk move-dark';

let lightMove = disk.cloneNode(true);
lightMove.firstChild.setAttribute('onclick', 'selectMove()')
lightMove.className.baseVal = 'disk move-light';

const createCells = () => {
  boardDisplay.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let cell = document.createElement('div');
      cell.className = 'cell';
      cell.id = `${i}-${j}`;
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

createCells();

let game;

const displayScore = () => {
  document.getElementById('dark-score').innerHTML = game.getDiskCount().dark;
  document.getElementById('light-score').innerHTML = game.getDiskCount().light;
}

const startGame = () => {
  if (game) {
    game.running = false;
    createCells();
  }

  game = new DisplayGame(darkPlayerType, lightPlayerType, darkDifficulty.depth, lightDifficulty.depth, timer, timerLength);
  game.displayScore();

  let headings = historyTable.firstElementChild;
  let firstRow = document.createElement('tr');
  firstRow.appendChild(document.createElement('td'));
  firstRow.firstElementChild.innerHTML = '1';
  historyTable.innerHTML = '';
  historyTable.appendChild(headings);
  historyTable.appendChild(firstRow);

  info.innerHTML = `Dark's turn to move`;
}

document.getElementById('start').addEventListener('click', startGame);

const selectMove = () => {
  let x = Number(event.path[2].id[0]);
  let y = Number(event.path[2].id[2]);

  game.userMove(x, y);
}

function gameOver() {
  let darkCount = game.diskCount.dark;
  let lightCount = game.diskCount.light;

  if (darkCount > lightCount) {
    info.innerHTML = `Dark wins the game, beating light ${darkCount} - ${lightCount}`;
  } else if (darkCount < lightCount) {
    info.innerHTML = `Light wins the game, beating dark ${lightCount} - ${darkCount}`;
  } else {
    info.innerHTML = 'The game is a draw';
  }
}