const score = document.querySelector('.score'),
  start = document.querySelector('.start'),
  gameArea = document.querySelector('.gameArea'),
  // sound = document.querySelector('.sound'),
  // soundAudio = document.querySelector('.soundAudio'),
  car = document.createElement('div');

const MAX_ENEMY = 5;
const HEIGHT_ELEM = 100;

var radio = new Audio();
radio.src = 'audio/the-weeknd-blinding-lights.mp3';

car.classList.add('car');

//console.log(Math.floor(document.documentElement.clientHeight / HEIGHT_ELEM)*HEIGHT_ELEM);
gameArea.style.height = Math.floor(document.documentElement.clientHeight / HEIGHT_ELEM)*HEIGHT_ELEM + 'px';

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

document.querySelector('.sound').onclick = function() {
  if (radio.paused == true) {
    radio.play();
    // document.querySelector('.sound').innerHTML = 'pause';
  
  } else {
    radio.pause();
    // document.querySelector('.sound').innerHTML = 'play';
  }
}


const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
};

const setting = {
  start: false,
  score: 0,
  speed: 0,
  traffic: 0
};

topScore.textContent = localStorage.getItem('nfjs_score', setting.score) ? 
  localStorage.getItem('nfjs_score', setting.score) :
  0;

const addLocalStorage = () => {
  localStorage.setItem('nfjs_score', setting.score);
  topScore.textContent = setting.score;
}


function getQuantityElements(heightElement) {
  return document.documentElement.clientHeight / heightElement + 1;
}

function startGame(event){

  const target = event.target;

  if (target === start) return;

    switch (target.id) {
      case 'easy':
        setting.speed = 3;
        setting.traffic = 4;
      break;
      case 'medium':
        setting.speed = 5;
        setting.traffic = 3;
      break;
      case 'hard':
        setting.speed = 8;
        setting.traffic = 2;
      break;
    }

    start.classList.add('hide');
    gameArea.innerHTML = '';

    for (let i = 0; i < getQuantityElements(HEIGHT_ELEM); i++) {
      const line = document.createElement('div');
      line.classList.add('line');
      line.style.top = (i*HEIGHT_ELEM) + 'px';
      line.y = i*HEIGHT_ELEM;
      gameArea.appendChild(line);
    }

    for (let  i = 0; i < getQuantityElements(HEIGHT_ELEM * setting.traffic); i++) {
      const enemy = document.createElement('div');
      const randomEnemy = Math.floor(Math.random() * MAX_ENEMY) + 1;
      enemy.classList.add('enemy');
      enemy.y = - HEIGHT_ELEM * setting.traffic * (i + 1);
      enemy.style.left = Math.floor((Math.random() * HEIGHT_ELEM * 2.5)) + 'px';
      enemy.style.top = enemy.y + 'px';
      enemy.style.background = `transparent url(./image/enemy${randomEnemy}.png) center / cover no-repeat`;
      gameArea.appendChild(enemy);
    }
    setting.score = 0;
    gameArea.classList.remove('hide');
    setting.start = true;
    gameArea.appendChild(car);
    car.style.left = '125px';
    car.style.bottom = '10px';
    car.style.top = 'auto';
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);
}

function playGame(){
  if (setting.start){
    setting.score += setting.speed;
    score.textContent = 'SCORE:' + setting.score;
    moveRoad();
    moveEnemy();
    if (keys.ArrowLeft && setting.x > 0){
      setting.x -= setting.speed;
      // car.classList.add('rotate');
    }
    if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)){
      setting.x += setting.speed;
    }

    if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight - 10)){
      setting.y += setting.speed;
    }
    if (keys.ArrowUp && setting.y > 10){
      setting.y -= setting.speed;
    }

    car.style.left = setting.x + 'px';
    car.style.top = setting.y + 'px';

    requestAnimationFrame(playGame);
  } 
}

function startRun(event) {
  event.preventDefault();
  keys[event.key] = true;
}

function stopRun(event) {
  event.preventDefault();
  keys[event.key] = false;
}

function moveRoad() {
  let lines = document.querySelectorAll('.line');
  lines.forEach(function(line){
    line.y += setting.speed;
    line.style.top = line.y + 'px';
    
    if (line.y >document.documentElement.clientHeight) {
      line.y = -HEIGHT_ELEM;
    }
  });
}

function moveEnemy() {
  let enemy = document.querySelectorAll('.enemy');
  enemy.forEach(function(item) {
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();

    if (carRect.top + 5 <= enemyRect.bottom && 
      carRect.right + 5 >= enemyRect.left &&
      carRect.left + 5 <= enemyRect.right &&
      carRect.bottom + 5 >= enemyRect.top) {
      setting.start = false;
      start.classList.remove('hide');
      start.style.top = score.offsetHeight + 'px';
      addLocalStorage();
    }

    item.y += setting.speed / 2;
    item.style.top = item.y + 'px';

    if (item.y >= gameArea.clientHeight) {
      item.y = -HEIGHT_ELEM * setting.traffic;
      item.style.left = Math.floor((Math.random() * 2.5 * HEIGHT_ELEM)) + 'px';
    }
  });
}



