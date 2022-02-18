import React from 'react'
import styled from 'styled-components'
import { RendererProps } from '../../types/renderer.type'

interface ReactRendererProps extends RendererProps {}

interface CellProps {
  x: number
  y: number
  live: boolean
}

const Container = styled.div``

const Canvas = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const LiveCell = styled.div`
  width: 30px;
  height: 30px;
  background-color: black;
`

const DeadCell = styled.div`
  width: 30px;
  height: 30px;
  background-color: white;
`

export const Row: React.FC = React.memo((props) => {
  return <div>{props.children}</div>
})

export const Cell: React.FC<CellProps> = React.memo((props) => {
  const CellRender = props.live ? LiveCell : DeadCell
  return <CellRender key={`${props.x}:${props.y}`}></CellRender>
})

export const ReactRenderer: React.FC<ReactRendererProps> = ({ data, boundaries }) => {
  const rows: JSX.Element[][] = []
  const numCols = Object.values(data).length
  const numRows = Object.values(data[boundaries.minX]).length
  for (let x = boundaries.minX; x < boundaries.minX + numCols; x++) {
    for (let y = boundaries.minY; y < boundaries.minY + numRows; y++) {
      rows[x] = rows[x] || []
      rows[x].push(<Cell x={x} y={y} live={data[x][y]} key={`${x}:${y}`} />)
    }
  }

  return (
    <Container>
      <Canvas>
        {rows.map((cells, index) => {
          return <Row key={index}>{cells}</Row>
        })}
      </Canvas>
    </Container>
  )
}
