import React from 'react'
import './App.css'
import { ReactRenderer } from './renderers/react/react-renderer.component'
import { defaultIterator, getRandomWorldData, newWorld } from './utils/world'

const world = newWorld({ data: getRandomWorldData(5), iterator: defaultIterator })

function App() {
  return (
    <div className='App'>
      <ReactRenderer world={world} />
    </div>
  )
}

export default App
