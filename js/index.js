// Словарик для соотношения стилей и цифр
let tileMap = new Map()

tileMap.set(1,'--one')
tileMap.set(2,'--two',)
tileMap.set(3,'--three')
tileMap.set(4,'--four')
tileMap.set(5,'--five')
tileMap.set(6,'--six')
tileMap.set(7,'--seven')
tileMap.set(8,'--eight')

// Консты для расчетов
const tileWidth = 17
const boardTaleCountY = 16
const boardTaleCountX = 16
const bombQty = 40
const tillQty = boardTaleCountX * boardTaleCountY
let board = document.getElementById('board')



// Рабочие переменные
let isInitialClick = true
let bombs = new Set()
let numbers = []
let boardSize = 16


let isEndGame = false

// Функции
function renderTile(){
	board.style.width = `${boardTaleCountY * tileWidth}px`

	for(let index = 0; index < tillQty; index++){
		createTile(index)
	}
}

function setup(initialTile){
	let bombsLeft = bombQty

	let x = 0
	let y = 0


	//Вычисление позиций бомб
	document.querySelectorAll('.tile').forEach((tile) => {
		tile.setAttribute('data-tile', `${x},${y}`)
		let random_boolean = Math.random() < 0.2
		if (tile !== initialTile && random_boolean && bombsLeft) {
			bombsLeft--
			bombs.add(`${x},${y}`)
			if (x > 0) numbers.push(`${x-1},${y}`)
			if (x < boardTaleCountX - 1) numbers.push(`${x+1},${y}`)
			if (y > 0) numbers.push(`${x},${y-1}`)
			if (y < boardTaleCountX - 1) numbers.push(`${x},${y+1}`)
			
			if (x > 0 && y > 0) numbers.push(`${x-1},${y-1}`)
			if (x < boardTaleCountX - 1 && y < boardTaleCountX - 1) numbers.push(`${x+1},${y+1}`)
			
			if (y > 0 && x < boardTaleCountX - 1) numbers.push(`${x+1},${y-1}`)
			if (x > 0 && y < boardTaleCountX - 1) numbers.push(`${x-1},${y+1}`)
		}

		x++

		if (x >= 16) {
			x = 0
			y++
		}
	})

	// TODO: Поменять на внутреннее хранилище вместо записи в data-num
	numbers.forEach(num => {
		let coords = num.split(',')
		let tile = document.querySelectorAll(`[data-tile="${parseInt(coords[0])},${parseInt(coords[1])}"]`)[0]
		let dataNum = parseInt(tile.getAttribute('data-num')) || 0

		if(!bombs.has(num)){
			tile.setAttribute('data-num', dataNum + 1)
		}
	})
}

	
/**
	 * Отрисовка определенной ячейки
	 * 
	 * @param {DomElement} tale - Обрабатываемая ячейка
	 */
function clickTile(tile){
	if (tile.classList.contains('tile--checked') || tile.classList.contains('tile--flagged')) return

	let coordinate = tile.getAttribute('data-tile')
	if (bombs.has(coordinate)) {
		endGame(tile)
		return
	} else {
		let num = tile.getAttribute('data-num')
		if (num != null) {
			tile.classList.add('tile--checked')
			tile.classList.add(`tile${tileMap.get(+num)}`)
			setTimeout(() => {
				// checkVictory()
			}, 100)
			return
		}
		
		checkTile(coordinate)
	}
	tile.classList.add('tile--checked')
}

/**
	 * Проверка рядомстоящих ячеек
	 * 
	 * @param {DomElement} tale - Обрабатываемая ячейка
	 */

function checkTile(coordinate){
	let coords = coordinate.split(',')
	let x = parseInt(coords[0])
	let y = parseInt(coords[1])
	
	setTimeout(() => {
		if (x > 0) {
			let targetW = document.querySelectorAll(`[data-tile="${x-1},${y}"`)[0]
			clickTile(targetW, `${x-1},${y}`)
		}
		if (x < 16 - 1) {
			let targetE = document.querySelectorAll(`[data-tile="${x+1},${y}"`)[0]
			clickTile(targetE, `${x+1},${y}`)
		}
		if (y > 0) {
			let targetN = document.querySelectorAll(`[data-tile="${x},${y-1}"]`)[0]
			clickTile(targetN, `${x},${y-1}`)
		}
		if (y < 16 - 1) {
			let targetS = document.querySelectorAll(`[data-tile="${x},${y+1}"]`)[0]
			clickTile(targetS, `${x},${y+1}`)
		}
		
		if (x > 0 && y > 0) {
			let targetNW = document.querySelectorAll(`[data-tile="${x-1},${y-1}"`)[0]
			clickTile(targetNW, `${x-1},${y-1}`)
		}
		if (x < 16 - 1 && y < 16 - 1) {
			let targetSE = document.querySelectorAll(`[data-tile="${x+1},${y+1}"`)[0]
			clickTile(targetSE, `${x+1},${y+1}`)
		}
		
		if (y > 0 && x < 16 - 1) {
			let targetNE = document.querySelectorAll(`[data-tile="${x+1},${y-1}"]`)[0]
			clickTile(targetNE, `${x+1},${y-1}`)
		}
		if (x > 0 && y < 16 - 1) {
			let targetSW = document.querySelectorAll(`[data-tile="${x-1},${y+1}"`)[0]
			clickTile(targetSW, `${x-1},${y+1}`)
		}
	}, 10)
}


function createTile(indexId){
	function checkEndGame (){
		return new Promise((resolve) => {
			if(!isEndGame) resolve()
		})
	}
	
	let tile = document.createElement('div')
	tile.classList.add('tile')

	tile.addEventListener('mousedown', ()=> {
		checkEndGame()
			.then(()=>{
				tile.classList.add('tile--focus')
			})
	})
		
	tile.addEventListener('mouseout', ()=> {
		checkEndGame()
			.then(()=>{
				tile.classList.remove('tile--focus')
			})
	})

	tile.addEventListener('click', function(e) {
		checkEndGame()
			.then(()=> {
				if(isInitialClick){
					setup(e.target)
					isInitialClick = false
				}
				clickTile(tile)
			})
	})

	board.appendChild(tile)
}


function endGame(tile){
	isEndGame = true	

	tile.classList.add('tile-bomb--focus')

	bombs.forEach((bombCoords) => {
		document.querySelector(`.tile[data-tile="${bombCoords}"]`).classList.add('tile-bomb')
	})
}

renderTile()
