const fs = require('fs')

function getRandomWorldData(canvasSize = 10) {
  return Array.from({ length: canvasSize }, (v, i) => i).reduce((canvas, x) => {
    return {
      ...canvas,
      [x]: Array.from({ length: canvasSize }, (v, i) => i).reduce((rows, y) => {
        return {
          ...rows,
          [y]: Math.random() < 0.5
        }
      }, {})
    }
  }, {})
}

fs.writeFileSync(
  'test-random-worlds.json',
  JSON.stringify(
    Array(10000)
      .fill(1)
      .map(() => [getRandomWorldData(10)])
  )
)
