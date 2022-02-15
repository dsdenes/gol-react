import produce from 'immer'
import { Boundaries, World, WorldData, WorldOptions } from '../types/world.type'

function getNeighbours(data: WorldData, x: number, y: number): (boolean | undefined)[] {
  return [
    data[x + 1]?.[y - 1] ?? false,
    data[x + 1]?.[y] ?? false,
    data[x + 1]?.[y + 1] ?? false,
    data[x][y - 1] ?? false,
    data[x][y + 1] ?? false,
    data[x - 1]?.[y - 1] ?? false,
    data[x - 1]?.[y] ?? false,
    data[x - 1]?.[y + 1] ?? false
  ]
}

export function getNumberOfLiveNeighbours(data: WorldData, x: number, y: number): number {
  const neighbours = getNeighbours(data, x, y)
  return neighbours.filter((cell) => cell).length
}

export function shouldCellLive(data: WorldData, x: number, y: number): boolean {
  const numberofLiveNeighbours = getNumberOfLiveNeighbours(data, x, y)

  if (data[x][y]) {
    if (numberofLiveNeighbours === 2 || numberofLiveNeighbours === 3) {
      return true
    }
    return false
  }

  if (numberofLiveNeighbours === 3) {
    return true
  }

  return false
}

export function defaultIterator(data: WorldData): WorldData {
  return produce(data, (draftData) => {
    for (let x = 0; x < Object.values(data).length; x++) {
      for (let y = 0; y < Object.values(data[x]).length; y++) {
        const nextState = shouldCellLive(data, x, y)
        if (data[x][y] !== nextState) {
          draftData[x][y] = nextState
        }
      }
    }
  })
}

function getEmptyCol(numCols: number): Record<number, boolean> {
  return Array(numCols)
    .fill(false)
    .reduce((row, value, index) => {
      return {
        ...row,
        [index]: value
      }
    }, {})
}

function expandWithFirstRow(data: WorldData, boundaries: Boundaries, numCols: number): WorldData {
  return produce(data, (draftData) => {
    for (let x = boundaries.minX; x < boundaries.minX + numCols; x++) {
      draftData[x][boundaries.minY - 1] = false
    }
  })
}

function expandWithLastRow(
  data: WorldData,
  boundaries: Boundaries,
  numCols: number,
  numRows: number
): WorldData {
  return produce(data, (draftData) => {
    for (let x = boundaries.minX; x < boundaries.minX + numCols; x++) {
      draftData[x][boundaries.minY + numRows] = false
    }
  })
}

function expandWithFirstCol(data: WorldData, boundaries: Boundaries, numRows: number): WorldData {
  return produce(data, (draftData) => {
    draftData[boundaries.minX - 1] = getEmptyCol(numRows)
  })
}

function expandWithLastCol(
  data: WorldData,
  boundaries: Boundaries,
  numCols: number,
  numRows: number
): WorldData {
  return produce(data, (draftData) => {
    draftData[boundaries.minX + numCols] = getEmptyCol(numRows)
  })
}

// The size of the virtual canvas for the world is unlimited,
// so on the edges, there will be always dead cells. This function
// extends the size of this "canvas" by addig dead cells to the edges
export function expandDataCanvas(data: WorldData, boundaries: Boundaries): [WorldData, Boundaries] {
  const numCols = Object.values(data).length
  const numRows = Object.values(data[boundaries.minX]).length
  for (let x = boundaries.minX; x < boundaries.minX + numCols; x++) {
    // If first row contains live cell
    if (data[x][boundaries.minY]) {
      const extendedData = expandWithFirstRow(data, boundaries, numCols)
      return expandDataCanvas(extendedData, { ...boundaries, minY: boundaries.minY - 1 })
    }
    // If last row contains live cell
    if (data[x][boundaries.minY + numRows - 1]) {
      const extendedData = expandWithLastRow(data, boundaries, numCols, numRows)
      return expandDataCanvas(extendedData, boundaries)
    }
    for (let y = boundaries.minX; y < boundaries.minY + numRows; y++) {
      // If first col contains live cell
      if (x === boundaries.minX && data[x][y]) {
        const extendedData = expandWithFirstCol(data, boundaries, numRows)
        return expandDataCanvas(extendedData, { ...boundaries, minX: boundaries.minX - 1 })
      }
      // If last col contains live cell
      if (x === boundaries.minX + numCols - 1 && data[x][y]) {
        const extendedData = expandWithLastCol(data, boundaries, numCols, numRows)
        return expandDataCanvas(extendedData, boundaries)
      }
    }
  }
  return [data, boundaries]
}

export function newWorld(options: WorldOptions): World {
  const data: WorldData = options?.initialData ?? []

  function nextGeneration(): WorldData {
    return options.iterator(data)
  }

  return {
    data,
    nextGeneration
  }
}
