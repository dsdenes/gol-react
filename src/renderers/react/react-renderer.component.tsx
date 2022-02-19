import React, { useMemo, useState, WheelEvent } from 'react'
import styled from 'styled-components'
import { config } from '../../config'
import { RendererProps } from '../../types/renderer.type'
import { Cell } from './components/cell.component'
import { Row } from './components/row.component'

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Canvas = styled.div`
  display: flex;
`

export const ReactRenderer: React.FC<RendererProps> = ({ data, boundaries, onCellClick }) => {
  const numCols = Object.values(data).length
  const numRows = Object.values(data[boundaries.minX]).length
  const [zoom, setZoom] = useState(1.0)

  function handleWheel(e: WheelEvent<HTMLDivElement>) {
    e.preventDefault()
    setZoom((currentZoom) => currentZoom - e.deltaY / 500)
    return false
  }

  const rows = useMemo(() => {
    let rows: {
      key: string
      cells: JSX.Element[]
    }[] = []

    let rowIndex = 0

    for (let x = boundaries.minX; x < boundaries.minX + numCols; x++) {
      for (let y = boundaries.minY; y < boundaries.minY + numRows; y++) {
        rows[rowIndex] = rows[rowIndex] ?? {
          cells: [],
          key: `${x}`
        }
        rows[rowIndex].cells.push(
          <Cell onClick={onCellClick} x={x} y={y} live={data[x][y]} key={`${x}:${y}`} />
        )
      }
      rowIndex++
    }
    return rows
  }, [boundaries.minX, boundaries.minY, numCols, numRows, onCellClick, data])

  return (
    <Container>
      <Canvas
        onWheel={handleWheel}
        style={{
          marginTop: (numRows + boundaries.minY - config.initialCanvasSize) * config.cellSize,
          marginLeft: (numCols + boundaries.minX - config.initialCanvasSize) * config.cellSize,
          transform: `scale(${zoom})`
        }}
      >
        {rows.map((row) => {
          return <Row key={row.key}>{row.cells}</Row>
        })}
      </Canvas>
    </Container>
  )
}
