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

export function getRandomWorldData(canvasSize: number = 10): WorldData {
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

export function defaultIterator(data: WorldData, boundaries: Boundaries): WorldData {
  return produce(data, (draftData) => {
    const numCols = Object.values(data).length
    const numRows = Object.values(data[boundaries.minX]).length
    for (let x = boundaries.minX; x < boundaries.minX + numCols; x++) {
      for (let y = boundaries.minY; y < boundaries.minY + numRows; y++) {
        const nextState = shouldCellLive(data, x, y)
        if (data[x][y] !== nextState) {
          draftData[x][y] = nextState
        }
      }
    }
  })
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
    for (let y = boundaries.minY; y < boundaries.minY + numRows; y++) {
      draftData[boundaries.minX - 1] = draftData[boundaries.minX - 1] || {}
      draftData[boundaries.minX - 1][y] = false
    }
  })
}

function expandWithLastCol(
  data: WorldData,
  boundaries: Boundaries,
  numCols: number,
  numRows: number
): WorldData {
  return produce(data, (draftData) => {
    for (let y = boundaries.minY; y < boundaries.minY + numRows; y++) {
      draftData[boundaries.minX + numCols] = draftData[boundaries.minX + numCols] || {}
      draftData[boundaries.minX + numCols][y] = false
    }
  })
}

// The size of the virtual canvas for the world is unlimited,
// so on the edges, there will be always dead cells. This function
// extends the size of this "canvas" by addig dead cells to the edges
export function expandDataCanvas(
  data: WorldData,
  boundaries: Boundaries,
  calls = 0
): [WorldData, Boundaries] {
  if (calls > 10) {
    throw new Error('LOOOP')
  }
  const numCols = Object.values(data).length
  const numRows = Object.values(data[boundaries.minX]).length
  for (let x = boundaries.minX; x < boundaries.minX + numCols; x++) {
    // If first row contains live cell
    if (data[x][boundaries.minY]) {
      const extendedData = expandWithFirstRow(data, boundaries, numCols)
      return expandDataCanvas(extendedData, { ...boundaries, minY: boundaries.minY - 1 }, ++calls)
    }
    // If last row contains live cell
    if (data[x][boundaries.minY + numRows - 1]) {
      const extendedData = expandWithLastRow(data, boundaries, numCols, numRows)
      return expandDataCanvas(extendedData, boundaries, ++calls)
    }
    for (let y = boundaries.minX; y < boundaries.minY + numRows; y++) {
      // If first col contains live cell
      if (x === boundaries.minX && data[x][y]) {
        const extendedData = expandWithFirstCol(data, boundaries, numRows)
        return expandDataCanvas(extendedData, { ...boundaries, minX: boundaries.minX - 1 }, ++calls)
      }
      // If last col contains live cell
      if (x === boundaries.minX + numCols - 1 && data[x][y]) {
        const extendedData = expandWithLastCol(data, boundaries, numCols, numRows)
        return expandDataCanvas(extendedData, boundaries, ++calls)
      }
    }
  }
  return [data, boundaries]
}

export function newWorld(options: WorldOptions): World {
  function getDefaultBoundaries(): Boundaries {
    return { minX: 0, minY: 0 }
  }

  function getNextGeneration(
    data: WorldData,
    boundaries: Boundaries = getDefaultBoundaries()
  ): [WorldData, Boundaries] {
    const [expandedData, expandedBoundaries] = expandDataCanvas(data, boundaries)
    return [options.iterator(expandedData, expandedBoundaries), expandedBoundaries]
  }

  return {
    data: options.data ?? {},
    boundaries: options.boundaries ?? getDefaultBoundaries(),
    getNextGeneration
  }
}
