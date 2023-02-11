import { FlattenedObject } from '../../src/flatten'

export const smallFlatObject: FlattenedObject = {
  string: '',
  number: 0,
  null: null,
  boolean: true,
}

export const largeObjectWithDotsInAttributeNames = {
  value: {
    foo: {
      bar: 'yes',
      so: {
        freakin: {
          nested: 'Wow',
          date: new Date(),
        },
      },
    },
  },
  test: [true, false, [null, undefined, 1]],
  not_lost: [], // Empty arrays should be preserved
  not_lost2: {}, // Empty objects should be preserved
  // Be careful with object having dots in the keys
  'I.like.dots..in.object.keys...': "... Please don't override me",
  I: {
    like: {
      'dots..in': {
        object: {
          'keys...': "You've been overwritten",
        },
      },
    },
  },
}
