import { Drawer, message, Space, Statistic } from 'antd'
import 'antd/dist/antd.min.css'
import Title from 'antd/lib/typography/Title'
import produce from 'immer'
import React, { useCallback, useEffect, useState } from 'react'
import './App.css'
import { ControlButton } from './components/control-button.component'
import { ControlSlider } from './components/control-slider.component'
import { config } from './config'
import { ReactRenderer } from './renderers/react/react-renderer.component'
import { defaultIterator } from './utils/iterator'
import { getEmptyWorldData, getRandomWorldData, newWorld } from './utils/world'

let world = newWorld({
  data: getEmptyWorldData(config.initialCanvasSize),
  iterator: defaultIterator
})

let generationTimer: NodeJS.Timeout

function App() {
  const [currentWorld, setCurrentWorld] = useState({
    data: world.data,
    boundaries: world.boundaries
  })
  const [generationCount, setGenerationCount] = useState(0)
  const [populationCount, setPopulationCount] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)
  const [autoPlayInterval, setAutoPlayInterval] = useState(config.defaultPlayInterval)

  useEffect(() => {
    const numCols = Object.values(currentWorld.data).length
    const numRows = Object.values(currentWorld.data[currentWorld.boundaries.minX]).length
    let popCount = 0
    for (let x = currentWorld.boundaries.minX; x < currentWorld.boundaries.minX + numCols; x++) {
      for (let y = currentWorld.boundaries.minY; y < currentWorld.boundaries.minY + numRows; y++) {
        if (currentWorld.data[x][y]) {
          popCount++
        }
      }
    }
    setPopulationCount(popCount)
  }, [
    generationCount,
    currentWorld.boundaries.minX,
    currentWorld.boundaries.minY,
    currentWorld.data
  ])

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
    world = newWorld({
      data: getEmptyWorldData(config.initialCanvasSize),
      iterator: defaultIterator
    })
    setCurrentWorld({ data: world.data, boundaries: world.boundaries })
  }

  function handleClickReset() {
    setGenerationCount(0)
    setAutoPlay(false)
    setAutoPlayInterval(config.defaultPlayInterval)
    message.success('State reseted to the 0th generation')
  }

  function handleClickRandom() {
    setGenerationCount(0)
    setAutoPlay(false)
    setAutoPlayInterval(config.defaultPlayInterval)
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

  const handleCellClick = useCallback(
    (x: number, y: number) => {
      if (generationCount !== 0) {
        message.error('Cannot modify cell state after the 0th iteration.')
        return
      }
      setCurrentWorld((currentWorld) => {
        return produce(currentWorld, (draftWorld) => {
          draftWorld.data[x][y] = !currentWorld.data[x][y]
        })
      })
    },
    [generationCount]
  )

  return (
    <>
      <Drawer placement='left' width={270} visible mask={false} closable={false}>
        <Space direction='vertical' size={20}>
          <ControlButton onClick={handleClickRandom} disabled={autoPlay}>
            Reset to radom state
          </ControlButton>
          <ControlButton onClick={handleClickGetNewGeneration} disabled={autoPlay}>
            Get next generation
          </ControlButton>
          <ControlButton type='primary' onClick={handleClickAutoPlay}>
            {autoPlay ? 'Stop' : 'Start'}
          </ControlButton>

          <Title level={5}>
            Autoplay wait interval (ms)
            <ControlSlider value={autoPlayInterval} onChange={handleSpeedChange} />
          </Title>
          <Statistic title='Generation' value={generationCount} />
          <Statistic title='Population' value={populationCount} />
          <ControlButton onClick={handleClickClear} disabled={autoPlay}>
            Clear canvas
          </ControlButton>
          <ControlButton onClick={handleClickReset} disabled={autoPlay}>
            Reset to the 0th generation
          </ControlButton>
        </Space>
      </Drawer>
      <ReactRenderer
        onCellClick={handleCellClick}
        data={currentWorld.data}
        boundaries={currentWorld.boundaries}
      />
    </>
  )
}

export default App
