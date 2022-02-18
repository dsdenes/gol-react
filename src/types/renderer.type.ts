import { Boundaries, WorldData } from './world.type'

export interface RendererProps {
  data: WorldData
  boundaries: Boundaries
  onCellClick: (x: number, y: number) => void
}
