import React from 'react'
import './App.css'
import { ReactRenderer } from './renderers/react/react-renderer.component'
import { WorldData } from './types/world.type'
import { defaultIterator, newWorld } from './utils/world'

function getRandomData(canvasSize: number = 10): WorldData {
  return Array.from({ length: canvasSize }, (v, i) => i).reduce((canvas, x) => {
    return {
      ...canvas,
      [x]: Array.from({ length: canvasSize }, (v, i) => i).reduce((rows, y) => {
        return {
          ...rows,
          [y]: Math.random() < 0.5
        }
      }, {})
    }
  }, {})
}

const world = newWorld({ data: getRandomData(5), iterator: defaultIterator })

function App() {
  return (
    <div className='App'>
      <ReactRenderer world={world} />
    </div>
  )
}

export default App
