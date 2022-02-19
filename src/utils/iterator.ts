import produce from 'immer'
import { Boundaries, WorldData } from '../types/world.type'

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

function getNumberOfLiveNeighbours(data: WorldData, x: number, y: number): number {
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
