export function flattenObject(object: any, separator = '.'): any {
  const toReturn = {}

  for (const property in object) {
    if (!Object.prototype.hasOwnProperty.call(object, property)) {
      continue
    }

    if (typeof object[property] == 'object' && object[property] !== null) {
      const flatObject = flattenObject(object[property])

      for (const subproperty in flatObject) {
        if (!Object.prototype.hasOwnProperty.call(flatObject, subproperty)) {
          continue
        }

        toReturn[property + separator + subproperty] = flatObject[subproperty]
      }
    } else {
      toReturn[property] = object[property]
    }
  }

  return toReturn
}
