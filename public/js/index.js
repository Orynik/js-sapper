// Словарик для соотношения стилей и цифр
let tileMap = new Map()

tileMap.set(1,'-one')
tileMap.set(2,'-second',)
tileMap.set(3,'-three')
tileMap.set(4,'-four')
tileMap.set(5,'-five')
tileMap.set(6,'-six')
tileMap.set(7,'-seven')
tileMap.set(8,'-eight')

// Хранилище с значениями каждой ячейки
let tileCoordMap = new Set()

// Консты для расчетов
const tileWidth = 17
const boardTaleCountY = 16
const boardTaleCountX = 16
let board = document.getElementById('board')

// Рабочие переменные
let currentTileId = null
let isInitialClick = true


// Обработчики
board.addEventListener('mousedown',(e) =>{
	if(e.target.classList.contains('til--default')){
		return 
	}

	currentTileId = e.target.id
})


board.addEventListener('mouseup',(e) =>{
	// Вынести логику открытия в clickTile
	if(e.target.id === currentTileId) {
		e.target.classList.remove('tile--focus')
		e.target.classList.add('tile--one')
	}else{
		document.getElementById(currentTileId).classList.remove('tile--focus')
	}

	currentTileId = null
})

// Функции
function renderTile(){
	board.style.width = `${boardTaleCountY * tileWidth}px`

	const tillQty = boardTaleCountX * boardTaleCountY

	for(let index = 0; index < tillQty; index++){
		let till = document.createElement('div')
		till.classList.add('tile')
		till.id = `till_${index}`
		board.appendChild(till)
	}
}

function setup(){
// Подготовка всех значений для игры
	console.log('start setup...')
}

	
/**
	 * Отрисовка определенной ячейки
	 * 
	 * @param {DomElement} tale - Обрабатываемая ячейка
	 */
function clickTale(tale){
	console.log('tile click')
}

/**
	 * Проверка рядомстоящих ячеек
	 * 
	 * @param {DomElement} tale - Обрабатываемая ячейка
	 */

function checkTale(tale){
	console.log('tile click')
}


renderTile()
