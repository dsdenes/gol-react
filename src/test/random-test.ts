import { expandDataCanvas } from '../utils/expand-data-canvas'
import { getRandomWorldData } from '../utils/world'

for (let worldData of Array(100)
  .fill(1)
  .map(() => getRandomWorldData(100))) {
  try {
    expandDataCanvas(worldData, { minX: 0, minY: 0 })
  } catch (err) {
    console.log(worldData)
    console.log(err)
    break
  }
}
