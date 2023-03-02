const startButton = {
	startButton: document.querySelector('.start-button'),
	fearClass: 'start-button--tile-focus',
	loseClass: 'start-button--lose',
	winClass: 'start-button--win',
	init: function(){
		this.startButton.addEventListener('click', () =>{
			startGame()
		})
	},
	toggleFear: function (needEnable = true) {
		if(needEnable){
			this.startButton.classList.add(this.fearClass)
			return
		}

		this.startButton.classList.remove(this.fearClass)
	},
	toggleLose: function(needEnable = true){
		if(needEnable){
			this.startButton.classList.add(this.loseClass)
			return
		}
		this.startButton.classList.remove(this.loseClass)
	},
	toggleWin: function(needEnable = true){
		if(needEnable){
			this.startButton.classList.add(this.winClass)
			return
		}
		this.startButton.classList.remove(this.winClass)
	}
}


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


let tilesState = new Map()

// Консты для расчетов
const tileWidth = 17
const bombQty = 40
let boardSize = 16 * 16
let boardSideLength = Math.sqrt(boardSize)

// Рабочие переменные
let isInitialClick = true
let board = document.getElementById('board')
let isEndGame = false
let isWinGame = false

// Функции
function renderTile(){
	board.parentElement.style.width = `${boardSideLength * tileWidth}px`

	for(let index = 0; index < boardSize; index++){
		createTile(index)
	}
}

function setup(){
	let bombsLeft = bombQty
	let numberBuff = {}
	let bombsBuff = {}

	let x = 0
	let y = 0


	//Вычисление позиций бомб
	document.querySelectorAll('.tile').forEach((tile) => {
		function addInNumberBuff(key) {
			if(Object.hasOwn(numberBuff,key)){
				numberBuff[key]++
				return
			}

			numberBuff[key] = 1
		}

		tile.setAttribute('data-tile', `${x},${y}`)

		let random_boolean = Math.random() < 0.25

		if (random_boolean && bombsLeft) {
			bombsLeft--
			// tile.setAttribute('data-bomb', '')
			bombsBuff[`${x},${y}`] = true

			if (x > 0) {
				addInNumberBuff(`${x-1},${y}`)
			}		
			if (x < boardSideLength - 1)	{
				addInNumberBuff(`${x+1},${y}`)
			}		
			if (y > 0){
				addInNumberBuff(`${x},${y-1}`)
			} 
			if (y < boardSideLength - 1) {
				addInNumberBuff(`${x},${y+1}`)
			}
			
			if (x > 0 && y > 0) {
				addInNumberBuff(`${x-1},${y-1}`)
			}
			if (x < boardSideLength - 1 && y < boardSideLength - 1){
				addInNumberBuff(`${x+1},${y+1}`)
			} 
			if (y > 0 && x < boardSideLength - 1) 	{
				addInNumberBuff(`${x+1},${y-1}`)
			}
			if (x > 0 && y < boardSideLength - 1){
				addInNumberBuff(`${x-1},${y+1}`)
			} 
		}

		x++

		if (x >= boardSideLength) {
			x = 0
			y++
		}
	})


	Object.entries(numberBuff).forEach(([key,value]) => {
		tilesState.set(key,{
			count: value,
			...(Object.hasOwn(bombsBuff,key) && {hasBomb: true}),
		}) 
	}) 

	console.log(numberBuff,tilesState)
}

	
/**
	 * Отрисовка определенной ячейки
	 * 
	 * @param {DomElement} tale - Обрабатываемая ячейка
	 */
function clickTile(tile){
	if (tile.classList.contains('tile--checked') || tile.classList.contains('tile--flagged')) return

	let coordinate = tile.getAttribute('data-tile')
	
	if(tilesState.has(coordinate)){
		if (tilesState.get(coordinate).hasBomb) {
			endGame(tile)
		} else {
			let num = tilesState.get(coordinate).count
			tile.classList.add('tile--checked')
			tile.classList.add(`tile${tileMap.get(num)}`)
			setTimeout(() => {
				checkVictory()
			}, 100)
		}
		return
	}

	checkTile(coordinate)
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
		if (x < boardSideLength - 1) {
			let targetE = document.querySelectorAll(`[data-tile="${x+1},${y}"`)[0]
			clickTile(targetE, `${x+1},${y}`)
		}
		if (y > 0) {
			let targetN = document.querySelectorAll(`[data-tile="${x},${y-1}"]`)[0]
			clickTile(targetN, `${x},${y-1}`)
		}
		if (y < boardSideLength - 1) {
			let targetS = document.querySelectorAll(`[data-tile="${x},${y+1}"]`)[0]
			clickTile(targetS, `${x},${y+1}`)
		}
		
		if (x > 0 && y > 0) {
			let targetNW = document.querySelectorAll(`[data-tile="${x-1},${y-1}"`)[0]
			clickTile(targetNW, `${x-1},${y-1}`)
		}
		if (x < boardSideLength - 1 && y < boardSideLength - 1) {
			let targetSE = document.querySelectorAll(`[data-tile="${x+1},${y+1}"`)[0]
			clickTile(targetSE, `${x+1},${y+1}`)
		}
		
		if (y > 0 && x < boardSideLength - 1) {
			let targetNE = document.querySelectorAll(`[data-tile="${x+1},${y-1}"]`)[0]
			clickTile(targetNE, `${x+1},${y-1}`)
		}
		if (x > 0 && y < boardSideLength - 1) {
			let targetSW = document.querySelectorAll(`[data-tile="${x-1},${y+1}"`)[0]
			clickTile(targetSW, `${x-1},${y+1}`)
		}
	}, 10)
}


function createTile(){
	function checkEndGame (){
		return new Promise((resolve) => {
			if(!isEndGame && !isWinGame) resolve()
		})
	}
	
	let tile = document.createElement('div')
	tile.classList.add('tile')

	tile.addEventListener('mousedown', ()=> {
		checkEndGame()
			.then(()=>{
				tile.classList.add('tile--focus')
				startButton.toggleFear()
			})
	})
		
	tile.addEventListener('mouseout', ()=> {
		checkEndGame()
			.then(()=>{
				tile.classList.remove('tile--focus')
				startButton.toggleFear(false)
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

	tilesState.forEach((value,key) =>{
		if(!Object.hasOwn(value,'hasBomb')) return
		document.querySelector(`.tile[data-tile="${key}"]`).classList.add('tile-bomb')
	})

	startButton.toggleLose()
}

function checkVictory(){
	let win = true

	// document.querySelectorAll('.tile').forEach((tile) => {
	// 	let coordinate = tile.getAttribute('data-tile')
	// 	let hasBomb = Object.hasOwn(tilesState.get(coordinate),'hasBomb')
	//
	// 	if (!(tile.classList.contains('tile--checked') && hasBomb)) win = false
	// })
	//
	// if(win){
	// 	startButton.toggleWin()
	// 	isWinGame = win
	// }
}

function startGame(){
	isEndGame = false
	isWinGame = false
	isInitialClick = true

	startButton.toggleLose(false)

	startButton.toggleWin(false)


	tilesState.clear()

	document.querySelectorAll('.tile').forEach((el) => {
		el.className = 'tile'
	})

}

startButton.init()
renderTile()
