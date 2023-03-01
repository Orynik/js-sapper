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
let currentTileId = null
let isInitialClick = true
let bombs = new Set()
let numbers = []
let boardSize = Math.sqrt(boardTaleCountX)


// Обработчики
board.addEventListener('mousedown',(e) =>{
	currentTileId = e.target.id

	e.target.classList.add('tile--focus')
	
})


board.addEventListener('mouseup',(e) =>{
	if((currentTileId !== e.target.id) || e.target.classList.contains('tile--clicked')) return

	if(isInitialClick){
		setup(e.target)
		isInitialClick = false
	}
	console.log(e.target)
	clickTile(e.target)

	currentTileId = null
})

// Функции
function renderTile(){
	board.style.width = `${boardTaleCountY * tileWidth}px`

	for(let index = 0; index < tillQty; index++){
		createTile(index)
	}
}

function setup(){
	let bombsLeft = bombQty

	let x = 0
	let y = 0


	//Вычисление позиций бомб
	document.querySelectorAll('.tile').forEach((tile) => {
		tile.setAttribute('data-tile', `${x},${y}`)
		let random_boolean = Math.random() < 0.3

		if (random_boolean && bombsLeft) {
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
		console.log(coords)
		let tile = document.querySelectorAll(`[data-tile="${parseInt(coords[0])},${parseInt(coords[1])}"]`)[0]
		console.log(tile, coords)
		let dataNum = parseInt(tile.getAttribute('data-num'))
		if (!dataNum) dataNum = 0
		tile.setAttribute('data-num', dataNum + 1)
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
		// endGame(tile)
		alert('Ты проиграл')
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
		if (x < boardSize - 1) {
			let targetE = document.querySelectorAll(`[data-tile="${x+1},${y}"`)[0]
			clickTile(targetE, `${x+1},${y}`)
		}
		if (y > 0) {
			let targetN = document.querySelectorAll(`[data-tile="${x},${y-1}"]`)[0]
			clickTile(targetN, `${x},${y-1}`)
		}
		if (y < boardSize - 1) {
			let targetS = document.querySelectorAll(`[data-tile="${x},${y+1}"]`)[0]
			clickTile(targetS, `${x},${y+1}`)
		}
		
		if (x > 0 && y > 0) {
			let targetNW = document.querySelectorAll(`[data-tile="${x-1},${y-1}"`)[0]
			clickTile(targetNW, `${x-1},${y-1}`)
		}
		if (x < boardSize - 1 && y < boardSize - 1) {
			let targetSE = document.querySelectorAll(`[data-tile="${x+1},${y+1}"`)[0]
			clickTile(targetSE, `${x+1},${y+1}`)
		}
		
		if (y > 0 && x < boardSize - 1) {
			let targetNE = document.querySelectorAll(`[data-tile="${x+1},${y-1}"]`)[0]
			clickTile(targetNE, `${x+1},${y-1}`)
		}
		if (x > 0 && y < boardSize - 1) {
			let targetSW = document.querySelectorAll(`[data-tile="${x-1},${y+1}"`)[0]
			clickTile(targetSW, `${x-1},${y+1}`)
		}
	}, 10)
}


function createTile(indexId){
	let till = document.createElement('div')
	till.classList.add('tile')
	// till.id = `tile_${indexId}`

	till.addEventListener('mousedown', ()=> {
		till.classList.add('tile--focus')
	})
		
	till.addEventListener('mouseout', ()=> {
		till.classList.remove('tile--focus')
	})

	board.appendChild(till)
}


renderTile()
