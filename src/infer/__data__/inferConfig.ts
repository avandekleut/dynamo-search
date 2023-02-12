import { InferConfig } from '../types'

export const inferConfig: InferConfig = {
  stringSharedConstraints: {
    minLength: 10,
  },
  jsonSharedConstraints: {
    depthSize: 10,
  },
}
