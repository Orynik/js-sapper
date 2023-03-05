import {tileMap,startButton,stopwatch,bombCounter} from './additional.js'

let tilesState = new Map()
// Консты для расчетов
const tileWidth = 17
let boardSize = 16 * 16
let boardSideLength = Math.sqrt(boardSize)

// Рабочие переменные
let isInitialClick = true
let board = document.getElementById('board')
let tiles
let isEndGame = false
let isWinGame = false

// Функции

function renderTile(){
	board.parentElement.style.width = `${boardSideLength * tileWidth}px`

	for(let index = 0; index < boardSize; index++){
		createTile(index)
	}

	bombCounter.renderBombQty()
	stopwatch.init()
	tiles = document.querySelectorAll('.tile')
}

function setup(initialTile = null){
	let bombsLeft = bombCounter.bombQty
	let numberBuff = {}
	let bombsBuff = {}

	let x = 0
	let y = 0


	//Вычисление позиций бомб
	//Запись текущих номеров
	// Двойной проход по массиву, можно ли упростить не создавая два массива и не мешая их на ходу?
	// Использовал Map только из-за удобства использования
	tiles.forEach((tile) => {
		function addInNumberBuff(key) {
			if(Object.hasOwn(numberBuff,key)){
				numberBuff[key]++
				return
			}

			numberBuff[key] = 1
		}

		tile.setAttribute('data-tile', `${x},${y}`)

		let random_boolean = Math.random() < 0.25
		
		if (tile !== initialTile && random_boolean && bombsLeft) {

			bombsLeft--
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

	
	tiles.forEach((tile) => {
		let coord = tile.dataset.tile

		let tileData = {}

		if(Object.hasOwn(bombsBuff,coord)){
			tileData.hasBomb = bombsBuff[coord]
		}else if(Object.hasOwn(numberBuff,coord)){
			tileData.count = numberBuff[coord]
		}else{
			tileData = null
		}
	
		if(tileData !== null) {
			tilesState.set(coord, tileData)
		}
	})


	stopwatch.start()
}

	
/**
	 * Отрисовка определенной ячейки
	 * @param {DomElement} tale - Обрабатываемая ячейка
	 */
function clickTile(tile){
	if (tile.classList.contains('tile--checked') || tile.classList.contains('tile--flagged') || tile.classList.contains('tile-question')) return

	let coordinate = tile.getAttribute('data-tile')

	if(tilesState.has(coordinate)){
		if (tilesState.get(coordinate).hasBomb) {
			endGame(tile)
		} else if (tilesState.get(coordinate).count){
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


	// Переписать querySelectorAll -> querySelector
	setTimeout(() => {
		if (x > 0) {
			let targetW = document.querySelectorAll(`[data-tile="${x-1},${y}"`)[0]
			clickTile(targetW, false)
		}
		if (x < boardSideLength - 1) {
			let targetE = document.querySelectorAll(`[data-tile="${x+1},${y}"`)[0]
			clickTile(targetE, false)
		}
		if (y > 0) {
			let targetN = document.querySelectorAll(`[data-tile="${x},${y-1}"]`)[0]
			clickTile(targetN, false)
		}
		if (y < boardSideLength - 1) {
			let targetS = document.querySelectorAll(`[data-tile="${x},${y+1}"]`)[0]
			clickTile(targetS, false)
		}
		
		if (x > 0 && y > 0) {
			let targetNW = document.querySelectorAll(`[data-tile="${x-1},${y-1}"`)[0]
			clickTile(targetNW, false)
		}
		if (x < boardSideLength - 1 && y < boardSideLength - 1) {
			let targetSE = document.querySelectorAll(`[data-tile="${x+1},${y+1}"`)[0]
			clickTile(targetSE, false)
		}
		
		if (y > 0 && x < boardSideLength - 1) {
			let targetNE = document.querySelectorAll(`[data-tile="${x+1},${y-1}"]`)[0]
			clickTile(targetNE, false)
		}
		if (x > 0 && y < boardSideLength - 1) {
			let targetSW = document.querySelectorAll(`[data-tile="${x-1},${y+1}"`)[0]
			clickTile(targetSW, false)
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

	tile.addEventListener('mousedown', (e)=> {
		checkEndGame()
			.then(()=>{
				if(tile.classList.contains('tile-question') || tile.classList.contains('tile--flagged') || e.button === 2) return

				tile.classList.add('tile--focus')

				startButton.toggleFear()
			})
	})
		
	tile.addEventListener('mouseout', ()=> {
		checkEndGame()
			.then(()=>{
				if(tile.classList.contains('tile-question') || tile.classList.contains('tile--flagged')) return

				tile.classList.remove('tile--focus')

				startButton.toggleFear(false)
			})
	})

	tile.addEventListener('click', function(e) {
		checkEndGame()
			.then(()=> {
				if(tile.classList.contains('tile-question') || tile.classList.contains('tile--flagged')) return

				if(isInitialClick){
					setup(e.target)
					isInitialClick = false
				}
				clickTile(tile)
			})
	})

	tile.addEventListener('contextmenu', function(e){
		e.preventDefault()
		
		checkEndGame()
			.then(() =>{
				if(!e.target.classList.contains('tile--checked'))	{
					if(e.target.classList.contains('tile--flagged')){
						bombCounter.incrementBomb()

						e.target.classList.remove('tile--flagged')
						e.target.classList.add('tile-question')
					}
					else if(e.target.classList.contains('tile-question')){
						e.target.classList.remove('tile-question')
						e.target.classList.remove('tile-question--focus')
						e.target.classList.remove('tile--flagged')
					}
					else{
						if(!bombCounter.bombQty) return
						bombCounter.decrementBomb()

						e.target.classList.add('tile--flagged')
					}
				}


				e.target.classList.remove('tile--focus')
			})
	})

	board.appendChild(tile)
}


function endGame(tile){
	isEndGame = true	

	tile.classList.add('tile-bomb--focus')

	tilesState.forEach((value,key) =>{
		let currentTile = document.querySelector(`.tile[data-tile="${key}"]`)
		if(!Object.hasOwn(value,'hasBomb')) return

		if(currentTile.classList.contains('tile--flagged')){
			currentTile.classList.add('tile-bomb', 'tile-bomb--disable')
			return
		}

		currentTile.classList.add('tile-bomb')
		
	})

	startButton.toggleLose()
	stopwatch.stop()
}

function checkVictory(){
	const isAllTileOpen = document.querySelectorAll('.tile--checked').length === boardSize - 1 

	if(isAllTileOpen){
		document.querySelectorAll('.tile:not(.tile--checked)').forEach((bombEl) => {
			if(bombEl.classList.contains('tile--flagged')) return
			
			bombEl.classList.add('tile--flagged')

		})
		startButton.toggleWin()
		isWinGame = true
		stopwatch.stop()
	}
}

function startGame(){
	isEndGame = false
	isWinGame = false
	isInitialClick = true
	
	bombCounter.resetQty()

	startButton.toggleLose(false)
	startButton.toggleWin(false)

	stopwatch.clear()
	tilesState.clear()

	tiles.forEach((el) => {
		el.remove()
	})

	renderTile()
}

startButton.init(startGame)
renderTile()
