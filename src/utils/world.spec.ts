import { defaultIterator, newWorld, shouldCellLive } from './world'
import { WorldData } from './world.type'

const dataDefault: WorldData = [
  [false, false, false],
  [false, false, false],
  [false, false, false]
]

describe('World', () => {
  it('should expose initial data', () => {
    expect(newWorld({ initialData: dataDefault, iterator: defaultIterator }).data).toEqual(
      dataDefault
    )
  })

  it('should return with the same data if there are no live cell', () => {
    expect(newWorld({ initialData: dataDefault, iterator: defaultIterator }).data).toEqual(
      dataDefault
    )
  })

  describe('shouldCellLive', () => {
    describe('cell with existing neighbours', () => {
      describe('survive', () => {
        it('should die if there is one living neighbour', () => {
          const data: WorldData = [
            [false, true, false],
            [false, true, false],
            [false, false, false]
          ]

          expect(shouldCellLive(data, 1, 1)).toEqual(false)
        })
        it('should survive if there are two living neighbours', () => {
          const data: WorldData = [
            [false, true, true],
            [false, true, false],
            [false, false, false]
          ]

          expect(shouldCellLive(data, 1, 1)).toEqual(true)
        })
        it('should survive if there are three living neighbours', () => {
          const data: WorldData = [
            [false, true, true],
            [false, true, true],
            [false, false, false]
          ]

          expect(shouldCellLive(data, 1, 1)).toEqual(true)
        })
        it('should die if there are four living neighbours', () => {
          const data: WorldData = [
            [false, true, true],
            [false, true, true],
            [false, false, true]
          ]

          expect(shouldCellLive(data, 1, 1)).toEqual(false)
        })
      })

      describe('resurrect', () => {
        it('should not resurrect if there is one living neighbour', () => {
          const data: WorldData = [
            [false, true, false],
            [false, false, false],
            [false, false, false]
          ]

          expect(shouldCellLive(data, 1, 1)).toEqual(false)
        })

        it('should not resurrect if there are two living neighbours', () => {
          const data: WorldData = [
            [false, true, true],
            [false, false, false],
            [false, false, false]
          ]

          expect(shouldCellLive(data, 1, 1)).toEqual(false)
        })

        it('should resurrect if there are three living neighbours', () => {
          const data: WorldData = [
            [false, true, true],
            [false, false, true],
            [false, false, false]
          ]

          expect(shouldCellLive(data, 1, 1)).toEqual(true)
        })

        it('should not resurrect if there are four living neighbours', () => {
          const data: WorldData = [
            [false, true, true],
            [false, false, true],
            [false, false, true]
          ]

          expect(shouldCellLive(data, 1, 1)).toEqual(false)
        })
      })
    })

    describe('cells on the edge', () => {
      describe('survive', () => {
        it('should die if there is one living neighbour', () => {
          const data: WorldData = [
            [true, false, false],
            [true, false, false],
            [false, false, false]
          ]

          expect(shouldCellLive(data, 1, 0)).toEqual(false)
        })
        it('should survive if there are two living neighbours', () => {
          const data: WorldData = [
            [true, true, false],
            [true, false, false],
            [false, false, false]
          ]

          expect(shouldCellLive(data, 1, 0)).toEqual(true)
        })
        it('should survive if there are three living neighbours', () => {
          const data: WorldData = [
            [true, true, false],
            [true, true, false],
            [false, false, false]
          ]

          expect(shouldCellLive(data, 1, 0)).toEqual(true)
        })
        it('should die if there are four living neighbours', () => {
          const data: WorldData = [
            [true, true, false],
            [true, true, false],
            [false, true, false]
          ]

          expect(shouldCellLive(data, 1, 0)).toEqual(false)
        })
      })

      describe('resurrect', () => {
        it('should not resurrect if there is one living neighbour', () => {
          const data: WorldData = [
            [true, false, false],
            [false, false, false],
            [false, false, false]
          ]

          expect(shouldCellLive(data, 1, 0)).toEqual(false)
        })

        it('should not resurrect if there are two living neighbours', () => {
          const data: WorldData = [
            [true, true, false],
            [false, false, false],
            [false, false, false]
          ]

          expect(shouldCellLive(data, 1, 0)).toEqual(false)
        })

        it('should resurrect if there are three living neighbours', () => {
          const data: WorldData = [
            [true, true, false],
            [false, true, false],
            [false, false, false]
          ]

          expect(shouldCellLive(data, 1, 0)).toEqual(true)
        })

        it('should not resurrect if there are four living neighbours', () => {
          const data: WorldData = [
            [true, true, false],
            [false, true, false],
            [false, true, false]
          ]

          expect(shouldCellLive(data, 1, 0)).toEqual(false)
        })
      })
    })
  })
})
