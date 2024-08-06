if(window.window.innerWidth < 998) {
	document.querySelector('.button-wrapper').classList.remove('d-none')
}

const game = document.querySelector('#game');
const ctx = game.getContext('2d');
const scoreBlock = document.querySelector('.score.current-score');
const bestScoreBlock = document.querySelector('.score.best-score');

const config = {
	cellSize: 16,
	startPosition: 9,
	colorHead: '#008500',
	colorTail: '#269926',
	colorBerry: '#FF0000',
	gameBoardSize: 19,
	countFrame: 10
}

let snake;
let headDirection;
let berry;
let score = 0;
let bestScore = window.localStorage.getItem('best-score') || 0;
if(bestScore > 0) updateBestScore(bestScore);


function refreshGame() {
	if(score > bestScore) updateBestScore(score);;
	score =- 0;
	drawScore();

	snake = [];
	snake[0] = {
		x: config.startPosition,
		y: config.startPosition
	}

	headDirection = creatCord();
	berry = creatCord();

	spawnBerry();
}

let step = 0;
function gameLoop() {
	requestAnimationFrame(gameLoop);

	if(++step < config.countFrame) return;
	step = 0;

	ctx.clearRect(0, 0, game.width, game.height);
	drawSnake();
	drawBerry();

	++step;
}

refreshGame();
requestAnimationFrame(gameLoop);
// ============================================================================



function drawScore() {
	scoreBlock.innerHTML = `score: ${score}`;
}

function incScore() {
	++score;
	drawScore();
}

function updateBestScore(score) {
	bestScore = score;
	bestScoreBlock.innerHTML = `best score: ${bestScore}`;
	bestScoreBlock.classList.remove('d-none');
	window.localStorage.setItem('best-score', bestScore)

}


// ============================================================================

function drawBerry() {
	ctx.fillStyle = config.colorBerry;
	ctx.fillRect(
		berry.x * config.cellSize,
		berry.y * config.cellSize,
		config.cellSize,
		config.cellSize
	);
}

function spawnBerry() {
	berry.x = randomBetween(0, config.gameBoardSize);
	berry.y = randomBetween(0, config.gameBoardSize);
	if(!checkBerryPosition()) spawnBerry();
}

function checkBerryPosition() {
	for(let i = 0; i < snake.length; ++i) {
		if(snake[i].x === berry.x && snake[i].y === berry.y) {
			return false;
		}
	}
	return true;
}


function randomBetween(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

// ============================================================================

document.addEventListener('keydown', e => {
	const is_has_tail = snake.length !== 1;
	switch(e.code) {
        case 'KeyW':
        case 'ArrowUp':
            if (headDirection.y !== 1 || !is_has_tail) headDirection = creatCord(0, -1);
            break;
        case 'KeyS':
        case 'ArrowDown':
            if (headDirection.y !== -1 || !is_has_tail) headDirection = creatCord(0, 1);
            break;
        case 'KeyA':
        case 'ArrowLeft':
            if (headDirection.x !== 1 || !is_has_tail) headDirection = creatCord(-1, 0);
            break;
        case 'KeyD':
        case 'ArrowRight':
            if (headDirection.x !== -1 || !is_has_tail) headDirection = creatCord(1, 0);
            break;
    }
})

document.querySelector('.btn1').onclick = () => {
	 if (headDirection.y !== 1 || snake.length === 1) headDirection = creatCord(0, -1);
};
document.querySelector('.btn4').onclick = () => {
	 if (headDirection.y !== -1 || snake.length === 1) headDirection = creatCord(0, 1);
};
document.querySelector('.btn2').onclick = () => {
	 if (headDirection.x !== 1 || snake.length === 1) headDirection = creatCord(-1, 0);
};
document.querySelector('.btn3').onclick = () => {
	 if (headDirection.x !== -1 || snake.length === 1) headDirection = creatCord(1, 0);
};

// ============================================================================
function drawSnake() {

	const tail_tip = move();

	if(isEqual(snake[0], berry)) {
		snake.push(tail_tip);
		incScore();
		spawnBerry();
	}

	for(let i = 0; i < snake.length; ++i) {
		if(i === 0)
			ctx.fillStyle = config.colorHead;
		else ctx.fillStyle = config.colorTail;

		ctx.fillRect(
			snake[i].x * config.cellSize,
			snake[i].y * config.cellSize,
			config.cellSize, 
			config.cellSize
		);
	}
}

function move() {
	const newHead = { 
		x: snake[0].x + headDirection.x, 
		y: snake[0].y + headDirection.y
	};
	colisionBorder(newHead);
	if(checkSelfEat()) {
		refreshGame();
		return snake[0];
	}
	return shiftSnake(newHead);
}

function checkSelfEat() {
	for(let i = 1; i < snake.length; ++i) {
		if(isEqual(snake[0], snake[i])) return true;
	}
	return false;
}

function shiftSnake(newHead) {
	snake.unshift(newHead);
	return snake.pop();
}

function colisionBorder(newHead) {

	for(cord in newHead) {

		switch(newHead[cord]) {
			case -1:
				newHead[cord] = config.gameBoardSize - 1;
				break;
			case config.gameBoardSize:
				newHead[cord] = 0;
				break;
		}
	}
}
// ============================================================================

function copyCord(el1, el2) {
	el1.x = el2.x;
	el1.y = el2.y;
}
function isEqual(el1, el2) {
	return el1.x === el2.x && el1.y === el2.y
}
function zeroCord(el) {
	el.x = 0;
	el.y = 0;
}
function creatCord(x = 0, y = 0) {
	return { x: x, y: y }
}