import { WorldData } from '../types/world.type'
import { expandDataCanvas } from './expand-data-canvas'
import { defaultIterator, shouldCellLive } from './iterator'
import { newWorld } from './world'
const dataDefault: WorldData = [
  [false, false, false],
  [false, false, false],
  [false, false, false]
]

describe('World', () => {
  it('should expose initial data', () => {
    expect(newWorld({ data: dataDefault, iterator: defaultIterator }).data).toEqual(dataDefault)
  })

  it('should return with the same data if there are no live cell', () => {
    expect(newWorld({ data: dataDefault, iterator: defaultIterator }).data).toEqual(dataDefault)
  })

  describe('expandDataCanvas', () => {
    it('should return with the same data, if there are no live cells on the edges', () => {
      const boundaries = { minX: 0, minY: 0 }
      expect(expandDataCanvas(dataDefault, boundaries)).toEqual([dataDefault, boundaries])
    })
    it('should expand the canvas in multiple dimensions if there is only one living cell', () => {
      const boundaries = { minX: 0, minY: 0 }
      const data: WorldData = { 0: { 0: true } }
      expect(expandDataCanvas(data, boundaries)).toMatchInlineSnapshot(`
Array [
  Object {
    "-1": Object {
      "-1": false,
      "0": false,
      "1": false,
    },
    "0": Object {
      "-1": false,
      "0": true,
      "1": false,
    },
    "1": Object {
      "-1": false,
      "0": false,
      "1": false,
    },
  },
  Object {
    "minX": -1,
    "minY": -1,
  },
]
`)
    })
    it('should expand the canvas only in vertical dimensions', () => {
      const boundaries = { minX: 0, minY: 0 }
      const data: WorldData = { 0: { 0: false, 1: true, 2: false } }
      expect(expandDataCanvas(data, boundaries)).toMatchInlineSnapshot(`
Array [
  Object {
    "-1": Object {
      "0": false,
      "1": false,
      "2": false,
    },
    "0": Object {
      "0": false,
      "1": true,
      "2": false,
    },
    "1": Object {
      "0": false,
      "1": false,
      "2": false,
    },
  },
  Object {
    "minX": -1,
    "minY": 0,
  },
]
`)
    })
    it('should expand the canvas only in horizontal dimensions', () => {
      const boundaries = { minX: 0, minY: 0 }
      const data: WorldData = { 0: { 0: false }, 1: { 0: true }, 2: { 0: false } }
      expect(expandDataCanvas(data, boundaries)).toMatchInlineSnapshot(`
Array [
  Object {
    "0": Object {
      "-1": false,
      "0": false,
      "1": false,
    },
    "1": Object {
      "-1": false,
      "0": true,
      "1": false,
    },
    "2": Object {
      "-1": false,
      "0": false,
      "1": false,
    },
  },
  Object {
    "minX": 0,
    "minY": -1,
  },
]
`)
    })
    it("should not expand the canvas if it's not needed", () => {
      const boundaries = { minX: 0, minY: 0 }
      const data: WorldData = {
        0: { 0: false, 1: false, 2: false },
        1: { 0: false, 1: true, 2: false },
        2: { 0: false, 1: false, 2: false }
      }
      expect(expandDataCanvas(data, boundaries)).toMatchInlineSnapshot(`
Array [
  Object {
    "0": Object {
      "0": false,
      "1": false,
      "2": false,
    },
    "1": Object {
      "0": false,
      "1": true,
      "2": false,
    },
    "2": Object {
      "0": false,
      "1": false,
      "2": false,
    },
  },
  Object {
    "minX": 0,
    "minY": 0,
  },
]
`)
    })
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
