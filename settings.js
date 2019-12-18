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