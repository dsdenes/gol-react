import React from 'react'
import styled from 'styled-components'
import { RendererProps } from '../../types/renderer.type'
import { Cell } from './cell.component'

interface ReactRendererProps extends RendererProps {}

const Container = styled.div``

const Canvas = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Row: React.FC = React.memo((props) => {
  return <div>{props.children}</div>
})

export const ReactRenderer: React.FC<ReactRendererProps> = ({ data, boundaries, onCellClick }) => {
  const rows: JSX.Element[][] = []
  const numCols = Object.values(data).length
  const numRows = Object.values(data[boundaries.minX]).length
  for (let x = boundaries.minX; x < boundaries.minX + numCols; x++) {
    for (let y = boundaries.minY; y < boundaries.minY + numRows; y++) {
      rows[x] = rows[x] || []
      rows[x].push(<Cell onClick={onCellClick} x={x} y={y} live={data[x][y]} key={`${x}:${y}`} />)
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
