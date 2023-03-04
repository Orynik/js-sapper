let tileMap = new Map()


tileMap.set(0,'--zero')
tileMap.set(1,'--one')
tileMap.set(2,'--two',)
tileMap.set(3,'--three')
tileMap.set(4,'--four')
tileMap.set(5,'--five')
tileMap.set(6,'--six')
tileMap.set(7,'--seven')
tileMap.set(8,'--eight')
tileMap.set(9,'--nine')

// Рабочие объект
const startButton = {
	startButton: document.querySelector('.start-button'),
	fearClass: 'start-button--tile-focus',
	loseClass: 'start-button--lose',
	winClass: 'start-button--win',

	init(startGameCallBack){
		this.startButton.addEventListener('click', () =>{
			startGameCallBack()
		})
	},
	toggleFear(needEnable = true) {
		if(needEnable){
			this.startButton.classList.add(this.fearClass)
			return
		}

		this.startButton.classList.remove(this.fearClass)
	},
	toggleLose(needEnable = true){
		if(needEnable){
			this.startButton.classList.add(this.loseClass)
			return
		}
		this.startButton.classList.remove(this.loseClass)
	},
	toggleWin(needEnable = true){
		if(needEnable){
			this.startButton.classList.add(this.winClass)
			return
		}
		this.startButton.classList.remove(this.winClass)
	},
}

const bombCounter = {
	bombEl: document.querySelector('.bomb-indicate'),
	arrayCountersElems: [],
	constBombQty: 40,
	bombQty: 40,

	resetQty() {
		this.bombQty = 40
	},

	renderBombQty() {
		this.bombEl.querySelectorAll('.numeric').forEach((numericItem) =>{
			numericItem.remove()
		})
			
		let first = document.createElement('div')
		let second = document.createElement('div')
		let third = document.createElement('div')
	
		this.arrayCountersElems = [first,second,third]

		renderNumericFields(this.bombQty,this.arrayCountersElems)
		
		this.bombEl.appendChild(first)
		this.bombEl.appendChild(second)
		this.bombEl.appendChild(third)

		// this.bombEl.innerHTML = this.bombQty
	},
	decrementBomb() {
		if(!this.bombQty) return

		this.bombQty--
		this.renderBombQty()
	},
	incrementBomb(){
		this.bombQty++
		this.renderBombQty()
	}
}

const stopwatch = {
	el: document.querySelector('.stopwatch'),
	inst: null,
	currentValue: 2400,
	init(){
		this.el.querySelectorAll('.numeric').forEach((numericItem) =>{
			numericItem.remove()
		})

		let first = document.createElement('div')
		let second = document.createElement('div')
		let third = document.createElement('div')
		let four = document.createElement('div')
	
		this.arrayCountersElems = [first,second,third,four]

		renderNumericFields(this.currentValue,this.arrayCountersElems)
		
		this.el.appendChild(first)
		this.el.appendChild(second)
		this.el.appendChild(third)
		this.el.appendChild(four)
	},
	start(){
		this.step()
	},
	step(){
		this.inst = setTimeout(() => {
			if(!this.currentValue) {
				isEndGame = true
				this.stop()
			}
			this.init()
			this.currentValue--

			this.step()
		},1000)
	},
	clear(){
		this.stop()
		this.currentValue = 2400
	}, 
	stop(){ 
		clearTimeout(this.inst)
	}
}

function renderNumericFields(counter, arrElements) {
	let stringCounter = String(counter)
	let startCounterRender = 0
	arrElements.forEach((numericItem,index)=>{
		if(arrElements.length - index <= stringCounter.length){
			let classPostfix = tileMap.get(+stringCounter[startCounterRender])
			numericItem.classList.add('numeric', `numeric${classPostfix}`)
			startCounterRender++

			return
		}

		numericItem.classList.add('numeric', 'numeric--zero')
	})
}

export {startButton,bombCounter,stopwatch, tileMap}
