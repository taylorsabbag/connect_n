const CONNECT_N_SIZE_MAP = {
    3: { columns: 6, rows: 5, winCondition: 3, maxMoves: 30, minMovesToWin: 5 },
    4: { columns: 7, rows: 6, winCondition: 4, maxMoves: 42, minMovesToWin: 7 },
    5: { columns: 8, rows: 7, winCondition: 5, maxMoves: 56, minMovesToWin: 9 },
    6: { columns: 9, rows: 8, winCondition: 6, maxMoves: 72, minMovesToWin: 11 },
}

let players = { player1: { name: '', class: 'player1' }, player2: { name: '', class: 'player2' } }
let { player1, player2 } = players

let currentPlayer = player1
let numMovesDone = 0
let connectNSize = 0

const board = document.getElementById('game-board')
const startGameBtn = document.getElementById('start-game-btn')
const resetGameBtn = document.getElementById('reset-game-btn')
const currentPlayerHeadingContainer = document.getElementById('current-player-heading-container')
const currentPlayerHeading = document.getElementById('current-player-heading')
const gameBoard = document.getElementById('game-board')
const gameForm = document.getElementById('game-form')

startGameBtn.addEventListener('click', () => {
    player1.name = document.getElementById('player1-name')?.value
    player2.name = document.getElementById('player2-name')?.value
    connectNSize = document.getElementById('connect-n-size')?.value
    
    if (player1.name && player2.name && connectNSize) {
        startGame()
    }

    return
})

resetGameBtn.addEventListener('click', resetGame)

function makeMove(column) {
    const gameCells = column.children
    let lastMove = null
    
    for (let i = gameCells.length - 1; i >= 0; i--) {
        const currentGameCell = gameCells[i]
        if (!currentGameCell.classList.contains('player1') && !currentGameCell.classList.contains('player2')) {
            currentGameCell.classList.add(currentPlayer.class)
            lastMove = { column: currentGameCell.dataset.column, row: currentGameCell.dataset.row }
            numMovesDone++
            break
        }
    }

    if (didPlayerWin(lastMove)) {
        alert(`${currentPlayer.name} Won!`)
    } else if (numMovesDone >= CONNECT_N_SIZE_MAP[connectNSize].maxMoves) {
        alert('Tie!')
    } else {
        currentPlayer = currentPlayer === player1 ? player2 : player1
        setCurrentPlayerHeading()
    }
}

function setCurrentPlayerHeading() {
    currentPlayerHeading.innerText = `${currentPlayer.name}'s Turn`
    currentPlayerHeadingContainer.style.display = 'grid'
    currentPlayerHeading.style.display = 'block'
}

function didPlayerWin(lastMove) {
    if (numMovesDone < CONNECT_N_SIZE_MAP[connectNSize].minMovesToWin) return false
    
    // Search array outwards from the last move
    // Check if the number of pieces in a row of same player pieces in any direction is equal to the win condition
    // If there is, return true
    // If not, return false
    let { column, row } = lastMove
    column = parseInt(column)
    row = parseInt(row)
    const winCondition = CONNECT_N_SIZE_MAP[connectNSize].winCondition
    const playerClass = currentPlayer.class
    let numInARow = 1

    // Check horizontal
    for (let i = column - 1; i >= 0; i--) {
        const gameCell = document.querySelector(`[data-column="${i}"][data-row="${row}"]`)
        if (gameCell.classList.contains(playerClass)) {
            numInARow++
        } else {
            break
        }
    }

    for (let i = column + 1; i < CONNECT_N_SIZE_MAP[connectNSize].columns; i++) {
        const gameCell = document.querySelector(`[data-column="${i}"][data-row="${row}"]`)
        if (gameCell.classList.contains(playerClass)) {
            numInARow++
        } else {
            break
        }
    }

    if (numInARow >= winCondition) return true

    // Check vertical
    numInARow = 1
    for (let i = row - 1; i >= 0; i--) {
        const gameCell = document.querySelector(`[data-column="${column}"][data-row="${i}"]`)
        if (gameCell.classList.contains(playerClass)) {
            numInARow++
        } else {
            break
        }
    }

    for (let i = row + 1; i < CONNECT_N_SIZE_MAP[connectNSize].rows; i++) {
        const gameCell = document.querySelector(`[data-column="${column}"][data-row="${i}"]`)
        if (gameCell.classList.contains(playerClass)) {
            numInARow++
        } else {
            break
        }
    }

    if (numInARow >= winCondition) return true

    // Check diagonal (top left to bottom right)
    numInARow = 1
    for (let i = column - 1, j = row - 1; i >= 0 && j >= 0; i--, j--) {
        const gameCell = document.querySelector(`[data-column="${i}"][data-row="${j}"]`)
        if (gameCell.classList.contains(playerClass)) {
            numInARow++
        } else {
            break
        }
    }

    for (let i = column + 1, j = row + 1; i < CONNECT_N_SIZE_MAP[connectNSize].columns && j < CONNECT_N_SIZE_MAP[connectNSize].rows; i++, j++) {
        const gameCell = document.querySelector(`[data-column="${i}"][data-row="${j}"]`)
        if (gameCell.classList.contains(playerClass)) {
            numInARow++
        } else {
            break
        }
    }

    if (numInARow >= winCondition) return true

    // Check diagonal (top right to bottom left)
    numInARow = 1
    
    for (let i = column + 1, j = row - 1; i < CONNECT_N_SIZE_MAP[connectNSize].columns && j >= 0; i++, j--) {
        const gameCell = document.querySelector(`[data-column="${i}"][data-row="${j}"]`)
        if (gameCell.classList.contains(playerClass)) {
            numInARow++
        } else {
            break
        }
    }

    for (let i = column - 1, j = row + 1; i >= 0 && j < CONNECT_N_SIZE_MAP[connectNSize].rows; i--, j++) {
        const gameCell = document.querySelector(`[data-column="${i}"][data-row="${j}"]`)
        if (gameCell.classList.contains(playerClass)) {
            numInARow++
        } else {
            break
        }
    }

    if (numInARow >= winCondition) return true

    return false
}

function startGame() {
    createGameBoard(connectNSize)
    gameForm.style.display = 'none'
    gameBoard.style.display = 'grid'
    setCurrentPlayerHeading(currentPlayer.name)
}

function createGameBoard() {
    let columns = CONNECT_N_SIZE_MAP[connectNSize].columns
    let rows = CONNECT_N_SIZE_MAP[connectNSize].rows
    gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`
    
    for (let i = 0; i < columns; i++) {
        const column = document.createElement('div')
        column.classList.add('column')
        column.setAttribute('data-column', i)
        column.addEventListener('click', () => makeMove(column))

        for (let j = 0; j < rows; j++) {
            const gameCell = document.createElement('div')
            gameCell.classList.add('game-cell')
            gameCell.setAttribute('data-column', i)
            gameCell.setAttribute('data-row', j)
            column.appendChild(gameCell)
        }

        gameBoard.appendChild(column)
    }
}

function resetGame() {
    gameBoard.innerHTML = ''
    gameBoard.style.display = 'none'
    numMovesDone = 0
    currentPlayer = player1
}

// player1.name = 'Taylor'
// player2.name = 'Computer'
// connectNSize = 4
// startGame()