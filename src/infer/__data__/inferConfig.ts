import { InferConfig } from '../types'

export const testingInferConfig: InferConfig = {
  stringSharedConstraints: {
    minLength: 10,
  },
  jsonSharedConstraints: {
    depthSize: 10,
  },
  arrayConstraints: {
    minLength: 1,
  },
}
