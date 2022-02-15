export type WorldData = boolean[][]

export type Iterator = (data: WorldData) => WorldData

export interface WorldOptions {
  initialData?: WorldData
  iterator: Iterator
}

export interface World {
  data: WorldData
  nextGeneration: () => WorldData
}
