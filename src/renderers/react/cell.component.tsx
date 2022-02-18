import React from 'react'
import styled from 'styled-components'

interface CellProps {
  x: number
  y: number
  live: boolean
  onClick: (x: number, y: number) => void
}

const StyledCell = styled.div`
  width: 30px;
  height: 30px;
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
      key={`${props.x}:${props.y}`}
      onClick={() => props.onClick(props.x, props.y)}
    ></CellRender>
  )
})
