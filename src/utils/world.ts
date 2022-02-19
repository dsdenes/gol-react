import { Boundaries, World, WorldData, WorldOptions } from '../types/world.type'
import { expandDataCanvas } from './expand-data-canvas'
import { defaultIterator } from './iterator'

export function getRandomWorldData(canvasSize: number = 10): WorldData {
  return Array.from({ length: canvasSize }, (v, i) => i).reduce((canvas, x) => {
    return {
      ...canvas,
      [x]: Array.from({ length: canvasSize }, (v, i) => i).reduce((rows, y) => {
        return {
          ...rows,
          [y]: Math.random() < 0.2
        }
      }, {})
    }
  }, {})
}

export function getEmptyWorldData(canvasSize: number = 10): WorldData {
  return Array.from({ length: canvasSize }, (v, i) => i).reduce((canvas, x) => {
    return {
      ...canvas,
      [x]: Array.from({ length: canvasSize }, (v, i) => i).reduce((rows, y) => {
        return {
          ...rows,
          [y]: false
        }
      }, {})
    }
  }, {})
}

export function getDefaultWorld(): World {
  return newWorld({ iterator: defaultIterator })
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
