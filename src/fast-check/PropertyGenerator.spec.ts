import { PropertyGenerator } from './PropertyGenerator'

describe('PropertyGenerator', () => {
  test('library functionality test', () => {
    const exampleBody = {
      session: 1234,
      id: 'ad780446-f330-494d-945d-ae1777f2c23b',
      event: {
        headers: {
          'x-api-key': '3e47abdb-f77d-4aa7-94c9-87c3df7381a0',
        },
      },
      records: [
        {
          complete: false,
          status: 400,
          message: 'failed to upload.',
        },
      ],
    }
    const property = PropertyGenerator.getProperties(exampleBody)
    console.log(property)
  })
})
