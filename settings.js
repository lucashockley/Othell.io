let darkPlayerType = 'user';
let lightPlayerType = 'computer';
let lightDifficulty = darkDifficulty = {
  depth: 2
};
let timer = false;
let timerLength = 5;

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
          setTimers(`${timerLength}:00`);
        } else {
          timerLengthSetting.style.display = 'none';
          setTimers('-');
        }
        break;

      case 'timer-length':
        timerLength = path[0].innerHTML.split(':')[0];
        setTimers(`${timerLength}:00`);
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