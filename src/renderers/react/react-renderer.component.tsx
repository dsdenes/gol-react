import React, { useState } from 'react'
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

// let generationTimer: NodeJS.Timeout

export const ReactRenderer: React.FC<ReactRendererProps> = (props) => {
  const [world, setWorld] = useState({ data: props.world.data, boundaries: props.world.boundaries })

  // useEffect(() => {
  //   try {
  //     clearTimeout(generationTimer)
  //   } catch {}
  //   generationTimer = setTimeout(() => {
  //     setWorld((currentWorld) => {
  //       const [nextData, nextBoundaries] = props.world.getNextGeneration(
  //         currentWorld.data,
  //         currentWorld.boundaries
  //       )
  //       return { data: nextData, boundaries: nextBoundaries }
  //     })
  //   }, 1000)
  // }, [props.world, world])

  function handleClickGetNewGeneration() {
    setWorld((currentWorld) => {
      const [nextData, nextBoundaries] = props.world.getNextGeneration(
        currentWorld.data,
        currentWorld.boundaries
      )
      return { data: nextData, boundaries: nextBoundaries }
    })
  }

  const rows: JSX.Element[][] = []
  const numCols = Object.values(world.data).length
  const numRows = Object.values(world.data[world.boundaries.minX]).length
  for (let x = world.boundaries.minX; x < world.boundaries.minX + numCols; x++) {
    for (let y = world.boundaries.minY; y < world.boundaries.minY + numRows; y++) {
      rows[x] = rows[x] || []
      rows[x].push(<Cell x={x} y={y} live={world.data[x][y]} key={`${x}:${y}`} />)
    }
  }

  return (
    <Container>
      <button onClick={handleClickGetNewGeneration}>Get new generation</button>
      <Canvas>
        {rows.map((cells, index) => {
          return <Row key={index}>{cells}</Row>
        })}
      </Canvas>
    </Container>
  )
}
