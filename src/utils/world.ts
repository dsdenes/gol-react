import produce from 'immer'
import { World, WorldData, WorldOptions } from './world.type'

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
    for (let x = 0; x < data.length; x++) {
      for (let y = 0; y < data[x].length; y++) {
        const nextState = shouldCellLive(data, x, y)
        if (data[x][y] !== nextState) {
          draftData[x][y] = nextState
        }
      }
    }
  })
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
