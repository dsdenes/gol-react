import { writeFileSync } from 'fs'
import { getRandomWorldData } from '../utils/world'

const randomWorldData = Array(50)
  .fill(1)
  .map(() => {
    const data = getRandomWorldData(20)
    return [data]
  })

writeFileSync('random-world-data.json', JSON.stringify(randomWorldData))
