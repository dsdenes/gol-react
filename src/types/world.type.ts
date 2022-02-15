export type WorldData = Record<number, Record<number, boolean>>

export type Iterator = (data: WorldData, boundaries: Boundaries) => WorldData

export interface WorldOptions {
  data?: WorldData
  boundaries?: Boundaries
  iterator: Iterator
}

export interface World {
  data: WorldData
  boundaries: Boundaries
  getNextGeneration: (data: WorldData, boundaries: Boundaries) => [WorldData, Boundaries]
}

export interface Boundaries {
  minX: number
  minY: number
}
