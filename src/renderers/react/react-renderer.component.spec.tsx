import { render, screen } from '@testing-library/react'
import { WorldData } from '../../types/world.type'
import { defaultIterator } from '../../utils/iterator'
import { getEmptyWorldData, newWorld } from '../../utils/world'
import { ReactRenderer } from './react-renderer.component'
const randomWorldData: WorldData[] = require('../../test/random-world-data.json')

describe('ReactRenderer', () => {
  it('should render an empty 20x20 world', async () => {
    const world = newWorld({ iterator: defaultIterator, data: getEmptyWorldData(20) })
    const view = render(
      <ReactRenderer data={world.data} boundaries={world.boundaries} onCellClick={() => null} />
    )
    const cells = screen.queryAllByTestId('cell')
    expect(cells.length).toBe(400)
    expect(view.asFragment()).toMatchSnapshot()
  })

  it.each(randomWorldData)('random world cases', (worldData: WorldData) => {
    const world = newWorld({ iterator: defaultIterator, data: worldData })
    const view = render(
      <ReactRenderer data={world.data} boundaries={world.boundaries} onCellClick={() => null} />
    )
    const cells = screen.queryAllByTestId('cell')
    expect(cells.length).toBe(400)
    expect(view.asFragment()).toMatchSnapshot()
  })
})
