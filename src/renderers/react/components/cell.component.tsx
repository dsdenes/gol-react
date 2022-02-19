import React from 'react'
import styled from 'styled-components'
import { config } from '../../../config'

interface CellProps {
  x: number
  y: number
  live: boolean
  onClick: (x: number, y: number) => void
}

const StyledCell = styled.div`
  width: ${config.cellSize}px;
  height: ${config.cellSize}px;
  cursor: pointer;
  border: 1px solid black;
`

const LiveCell = styled(StyledCell)`
  background-color: black;
`

const DeadCell = styled(StyledCell)`
  background-color: white;
`

export const Cell: React.FC<CellProps> = React.memo((props) => {
  const CellRender = props.live ? LiveCell : DeadCell
  return (
    <CellRender
      data-testid='cell'
      key={`${props.x}:${props.y}`}
      onClick={() => props.onClick(props.x, props.y)}
    />
  )
})

Cell.displayName = 'Cell'
