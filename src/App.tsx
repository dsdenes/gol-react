import { message, Slider } from 'antd'
import 'antd/dist/antd.css'
import produce from 'immer'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import './App.css'
import { ControlBar } from './components/control-bar.component'
import { ReactRenderer } from './renderers/react/react-renderer.component'
import { defaultIterator, getEmptyWorldData, getRandomWorldData, newWorld } from './utils/world'

let world = newWorld({ data: getEmptyWorldData(20), iterator: defaultIterator })
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
  const [generationCount, setGenerationCount] = useState(0)
  const [populationCount, setPopulationCount] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)
  const [autoPlayInterval, setAutoPlayInterval] = useState(1000)

  useEffect(() => {
    try {
      clearTimeout(generationTimer)
    } catch {}
    if (autoPlay) {
      generationTimer = setInterval(setNewGeneration, autoPlayInterval)
    }
  }, [autoPlay, autoPlayInterval])

  function handleClickGetNewGeneration() {
    setNewGeneration()
  }

  function handleClickAutoPlay() {
    setAutoPlay((currentValue) => !currentValue)
  }

  function handleClickClear() {
    world = newWorld({ data: getEmptyWorldData(20), iterator: defaultIterator })
    setCurrentWorld({ data: world.data, boundaries: world.boundaries })
  }

  function handleClickReset() {
    setGenerationCount(0)
    setAutoPlay(false)
    setAutoPlayInterval(1000)
    message.success('State reseted to the 0th generation')
  }

  function handleClickRandom() {
    setAutoPlay(false)
    setAutoPlayInterval(1000)
    setGenerationCount(0)
    world = newWorld({ data: getRandomWorldData(20), iterator: defaultIterator })
    setCurrentWorld({ data: world.data, boundaries: world.boundaries })
  }

  function handleSpeedChange(value: number) {
    setAutoPlayInterval(value)
  }

  function setNewGeneration() {
    setGenerationCount((currentGenerationCount) => currentGenerationCount + 1)
    setCurrentWorld((currentWorld) => {
      const [nextData, nextBoundaries] = world.getNextGeneration(
        currentWorld.data,
        currentWorld.boundaries
      )
      return { data: nextData, boundaries: nextBoundaries }
    })
  }

  function handleCellClick(x: number, y: number) {
    if (generationCount !== 0) {
      message.error('Cannot manually modify cell state after the 0th iteration.')
      return
    }
    setCurrentWorld((currentWorld) => {
      return produce(currentWorld, (draftWorld) => {
        draftWorld.data[x][y] = !currentWorld.data[x][y]
      })
    })
  }

  return (
    <Container>
      <ControlBar>
        <div>{generationCount}</div>
        <div>{populationCount}</div>
        <button onClick={handleClickClear} disabled={autoPlay}>
          Clear
        </button>
        <button onClick={handleClickReset} disabled={autoPlay}>
          Reset
        </button>
        <button onClick={handleClickRandom} disabled={autoPlay}>
          Random state
        </button>
        <button onClick={handleClickGetNewGeneration} disabled={autoPlay}>
          Get next generation
        </button>
        <button onClick={handleClickAutoPlay}>{autoPlay ? 'Stop' : 'Start'}</button>
        <ControlSlider value={autoPlayInterval} min={100} max={2000} onChange={handleSpeedChange} />
      </ControlBar>
      <ReactRenderer
        onCellClick={handleCellClick}
        data={currentWorld.data}
        boundaries={currentWorld.boundaries}
      />
    </Container>
  )
}

export default App
