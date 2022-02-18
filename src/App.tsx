import React, { useState } from 'react'
import styled from 'styled-components'
import './App.css'
import { ControlBar } from './components/control-bar.component'
import { ReactRenderer } from './renderers/react/react-renderer.component'
import { defaultIterator, getRandomWorldData, newWorld } from './utils/world'

const world = newWorld({ data: getRandomWorldData(5), iterator: defaultIterator })
const Container = styled.div``

function App() {
  const [currentWorld, setCurrentWorld] = useState({
    data: world.data,
    boundaries: world.boundaries
  })

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
    setCurrentWorld((currentWorld) => {
      const [nextData, nextBoundaries] = world.getNextGeneration(
        currentWorld.data,
        currentWorld.boundaries
      )
      return { data: nextData, boundaries: nextBoundaries }
    })
  }

  // console.log(worldData, world)

  return (
    <Container>
      <ControlBar>
        <button onClick={handleClickGetNewGeneration}>Get new generation</button>
      </ControlBar>
      <ReactRenderer data={currentWorld.data} boundaries={currentWorld.boundaries} />
    </Container>
  )
}

export default App
