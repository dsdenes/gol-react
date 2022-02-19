import produce from 'immer'
import { Boundaries, WorldData } from '../types/world.type'

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
      draftData[boundaries.minX - 1] = draftData[boundaries.minX - 1] ?? {}
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
      draftData[boundaries.minX + numCols] = draftData[boundaries.minX + numCols] ?? {}
      draftData[boundaries.minX + numCols][y] = false
    }
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
    for (let y = boundaries.minY; y < boundaries.minY + numRows; y++) {
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
