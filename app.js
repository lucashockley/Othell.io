const changeSetting = () => {
  if (!event.target.classList.contains('selected')) {
    let options = event.path[1].getElementsByClassName('option');
    for (const option of options) {
      option.classList.remove('selected');
    }
    event.target.classList.add('selected');
  }
}

const info = document.getElementById('info');

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
darkDisk.className.baseVal = 'disk-dark';

const lightDisk = disk.cloneNode(true);
lightDisk.className.baseVal = 'disk-light';

let darkMove = disk.cloneNode(true);
darkMove.firstChild.setAttribute('onclick', 'selectMove()')
darkMove.className.baseVal = 'move-dark';

let lightMove = disk.cloneNode(true);
lightMove.firstChild.setAttribute('onclick', 'selectMove()')
lightMove.className.baseVal = 'move-light';

const createCells = () => {
  boardDisplay.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let cell = document.createElement('div');
      cell.className = 'cell';
      cell.id = `${i}-${j}`;
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
  info.className = '';
  info.innerHTML = '';

  if (game) {
    game.running = false;
    createCells();
  }

  let settings = document.getElementById('settings');
  let darkPlayerType;
  let lightPlayerType;
  let darkDifficulty;
  let lightDifficulty;

  for (const type of settings.children[0].lastElementChild.children) {
    if (type.classList.contains('selected')) {
      darkPlayerType = type.innerHTML === 'Human' ? 'user' : 'computer';
    }
  }

  for (const type of settings.children[2].lastElementChild.children) {
    if (type.classList.contains('selected')) {
      lightPlayerType = type.innerHTML === 'Human' ? 'user' : 'computer';
    }
  }

  for (const type of settings.children[1].lastElementChild.children) {
    if (type.classList.contains('selected')) {
      switch (type.innerHTML) {
        case 'Beginner':
          darkDifficulty = 1;
          break;

        case 'Intermediate':
          darkDifficulty = 2;
          break;

        case 'Master':
          darkDifficulty = 5;
          break;
      }
    }
  }

  for (const type of settings.children[3].lastElementChild.children) {
    if (type.classList.contains('selected')) {
      switch (type.innerHTML) {
        case 'Beginner':
          lightDifficulty = 1;
          break;

        case 'Intermediate':
          lightDifficulty = 2;
          break;

        case 'Master':
          lightDifficulty = 5;
          break;
      }
    }
  }

  game = new DisplayGame(darkPlayerType, lightPlayerType, darkDifficulty, lightDifficulty, 500);
}

const selectMove = () => {
  let x = Number(event.path[2].id[0]);
  let y = Number(event.path[2].id[2]);

  game.userMove(x, y);
}

function gameOver() {
  info.className = 'container';

  let darkCount = game.diskCount.dark;
  let lightCount = game.diskCount.light;

  if (darkCount > lightCount) {
    info.innerHTML = `Dark wins the game, beating light ${darkCount} to ${lightCount}`;
  } else if (darkCount < lightCount) {
    info.innerHTML = `Light wins the game, beating dark ${lightCount} to ${darkCount}`;
  } else {
    info.innerHTML = 'The game is a draw';
  }
}