import { Slider } from 'antd'
import 'antd/dist/antd.css'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import './App.css'
import { ControlBar } from './components/control-bar.component'
import { ReactRenderer } from './renderers/react/react-renderer.component'
import { defaultIterator, getRandomWorldData, newWorld } from './utils/world'

let world = newWorld({ data: getRandomWorldData(20), iterator: defaultIterator })
const Container = styled.div``

const ControlSlider = styled(Slider)`
  width: 200px;
`

let generationTimer: NodeJS.Timeout

function App() {
  const [currentWorld, setCurrentWorld] = useState({
    data: world.data,
    boundaries: world.boundaries
  })
  const [autoPlay, setAutoPlay] = useState(false)
  const [autoPlayInterval, setAutoPlayInterval] = useState(1000)

  useEffect(() => {
    try {
      clearTimeout(generationTimer)
    } catch {}
    if (autoPlay) {
      generationTimer = setInterval(() => {
        setCurrentWorld((currentWorld) => {
          const [nextData, nextBoundaries] = world.getNextGeneration(
            currentWorld.data,
            currentWorld.boundaries
          )
          return { data: nextData, boundaries: nextBoundaries }
        })
      }, autoPlayInterval)
    }
  }, [autoPlay, autoPlayInterval])

  function handleClickGetNewGeneration() {
    setCurrentWorld((currentWorld) => {
      const [nextData, nextBoundaries] = world.getNextGeneration(
        currentWorld.data,
        currentWorld.boundaries
      )
      return { data: nextData, boundaries: nextBoundaries }
    })
  }

  function handleClickAutoPlay() {
    setAutoPlay((currentValue) => !currentValue)
  }

  function handleClickReset() {
    setAutoPlay(false)
    setAutoPlayInterval(1000)
    world = newWorld({ data: getRandomWorldData(20), iterator: defaultIterator })
    setCurrentWorld({ data: world.data, boundaries: world.boundaries })
  }

  function handleSpeedChange(value: number) {
    setAutoPlayInterval(value)
  }

  return (
    <Container>
      <ControlBar>
        <button onClick={handleClickReset}>Reset</button>
        <button onClick={handleClickGetNewGeneration} disabled={autoPlay}>
          Get new generation
        </button>
        <button onClick={handleClickAutoPlay}>{autoPlay ? 'Stop' : 'Start'}</button>
        <ControlSlider value={autoPlayInterval} min={100} max={2000} onChange={handleSpeedChange} />
      </ControlBar>
      <ReactRenderer data={currentWorld.data} boundaries={currentWorld.boundaries} />
    </Container>
  )
}

export default App
