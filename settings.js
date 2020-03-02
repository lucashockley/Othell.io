// Define default settings
let darkPlayerType = 'user';
let lightPlayerType = 'computer';
let lightDifficulty = darkDifficulty = {
  depth: 2
};
// Keep track if user has timer enabled in settings
let timerSelected = false;
let timer = false;
let timerLength = 5;

// Set search depth
const setDepth = (side, difficulty) => {
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

// Update setting values and GUI after user changes a setting
const changeSetting = () => {
  // If the setting isn't already selected
  if (!event.target.classList.contains('selected')) {
    let path = event.path;

    // Add CSS class to selected option
    for (const option of path[1].children) {
      option.classList.remove('selected');
    }
    path[0].classList.add('selected');

    // Update settings
    switch (path[2].id) {
      case 'dark-player':
        darkPlayerType = path[0].innerHTML === 'Human' ? 'user' : 'computer';
        displayTimerSettings();
        displayDifficultySettings(darkPlayerType, document.getElementById('dark-difficulty'));
        break;

      case 'dark-difficulty':
        setDepth(darkDifficulty, path[0].innerHTML);
        break;

      case 'light-player':
        lightPlayerType = path[0].innerHTML === 'Human' ? 'user' : 'computer';
        displayTimerSettings();
        displayDifficultySettings(lightPlayerType, document.getElementById('light-difficulty'));
        break;

      case 'light-difficulty':
        setDepth(lightDifficulty, path[0].innerHTML);
        break;

      case 'timer-enabled':
        timer = path[0].innerHTML === 'Enabled' ? true : false;
        if (timer) {
          timerLengthSetting.style.display = 'flex';
          timerSelected = true;
        } else {
          timerLengthSetting.style.display = 'none';
          timerSelected = false;
        }
        break;

      case 'timer-length':
        timerLength = path[0].innerHTML.split(':')[0];
        break;
    }
  }

  // If the user selects one or more computer players, disable the timer but
  // keep track of if the user had timer enabled before
  if (darkPlayerType === 'computer' || lightPlayerType === 'computer') {
    timer = false;
  } else {
    if (timerSelected) {
      timer = true;
    }
  }

  displayTimerSettings();
}

// Add event listeners to each option
const settingsDiv = document.getElementById('settings');

for (const setting of settingsDiv.children) {
  for (const option of setting.lastElementChild.children) {
    option.addEventListener('click', changeSetting);
  }
}