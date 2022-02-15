export type WorldData = Record<number, Record<number, boolean>>

export type Iterator = (data: WorldData) => WorldData

export interface WorldOptions {
  initialData?: WorldData
  iterator: Iterator
}

export interface World {
  data: WorldData
  nextGeneration: () => WorldData
}

export interface Boundaries {
  minX: number
  minY: number
}
