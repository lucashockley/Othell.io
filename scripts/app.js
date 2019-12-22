const changeSetting = () => {
  if (!event.target.classList.contains('selected')) {
    let checked = event.composedPath()[1].children[0].checked;
    event.composedPath()[1].children[0].checked = !checked;
    let options = event.path[1].getElementsByClassName('switch-option');
    options[0].classList.remove('selected');
    options[1].classList.remove('selected');
    event.target.classList.add('selected');
  }
}

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

const startNewGame = () => {
  if (game) {
    game.running = false;
    createCells();
  }

  let settings = document.getElementById('settings');

  let darkPlayerType = settings.children[0].lastElementChild.firstElementChild.checked ? 'ai' : 'user';
  let lightPlayerType = !settings.children[1].lastElementChild.firstElementChild.checked ? 'ai' : 'user';
  let animations = !settings.children[2].lastElementChild.firstElementChild.checked;

  game = new Game(darkPlayerType, lightPlayerType, animations, 500);
}

const selectMove = () => {
  let x = Number(event.path[2].id[0]);
  let y = Number(event.path[2].id[2]);

  game.userMove(x, y);
}