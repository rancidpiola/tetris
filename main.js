import './style.css'

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

const BLOCK_SIZE = 20
const BOARD_WIDTH = 14
const BOARD_HEIGHT = 30
let $score = document.querySelector('span')
let score = 0


canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

context.scale(BLOCK_SIZE, BLOCK_SIZE)

const board = createBoard(BOARD_WIDTH, BOARD_HEIGHT)

const piece = {
  position: { x: 5, y: 5 },
  shape: [
    [1, 1],
    [1, 1]
  ]
}

const PIECES = [
  [
    [1, 1],
    [1, 1]
  ],
  [
    [1, 1, 1]
  ],
  [
    [0, 1, 0],
    [1, 1, 1]
  ],
  [
    [1, 1, 0],
    [0, 1, 1]
  ],
  [
    [1, 0],
    [1, 0],
    [1, 1]
  ]
]


function createBoard(width, height) {
  return Array(height).fill().map(() => Array(width).fill(0))
}
let dropConter = 0
let lastTime = 0

function update(time = 0) {
  const deltaTime = time - lastTime
  lastTime = time
  dropConter += deltaTime

  if (dropConter > 1000) {
    piece.position.y++
    dropConter = 0

    if (checkCollition()) {
      piece.position.y--
      solidiftPiece()
      removeRows()
    }
  }
  window.requestAnimationFrame(update)

  draw()
  $score.innerText = score

}

function draw() {
  context.fillStyle = '#000'
  context.fillRect(0, 0, canvas.width, canvas.height)
  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value == 1) {
        context.fillStyle = 'yellow'
        context.fillRect(x, y, 1, 1)
      }
    })
  })
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillStyle = 'red'
        context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1)

      }
    })
  })
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') {
    piece.position.x--
    if (checkCollition()) {
      piece.position.x++
    }
  }
  if (e.key === 'ArrowRight') {
    piece.position.x++
    if (checkCollition()) {
      piece.position.x--
    }
  }
  if (e.key === 'ArrowDown') {
    piece.position.y++
    if (checkCollition()) {
      piece.position.y--
      solidiftPiece()
      removeRows()
    }
  }
  if (e.key === "ArrowUp") {
    const rotated = []

    for (let i = 0; i < piece.shape[0].length; i++) {
      const row = []

      for (let j = piece.shape.length - 1; j >= 0; j--) {
        row.push(piece.shape[j][i])
      }

      rotated.push(row)
    }

    const previousShape = piece.shape
    piece.shape = rotated
    if (checkCollition()) {
      piece.shape = previousShape
    }
  }
})


function checkCollition() {
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return (
        value != 0 &&
        board[y + piece.position.y]?.[x + piece.position.x] != 0
      )
    })
  })
}

function solidiftPiece() {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value == 1) {
        board[y + piece.position.y][x + piece.position.x] = 1
      }
    })
  })

  piece.position.x = 0
  piece.position.y = 0

  piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)]
  if (checkCollition()) {
    window.alert('Game Over!! Sorry ')
    board.forEach((row) => row.fill(0))
  }
}


function removeRows() {

  const rowsToRemove = []

  board.forEach((row, y) => {
    if (row.every(value => value == 1)) {
      rowsToRemove.push(y)

    }
  })

  rowsToRemove.forEach(y => {
    board.splice(y, 1)
    const newRow = Array(BOARD_WIDTH).fill(0)
    board.unshift(newRow)
    score += 10
  })

}
update()


