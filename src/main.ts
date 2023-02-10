export function flattenObject(
  object: Object,
  prefix: string | undefined = undefined,
  result = null,
): Object {
  result = result || {}

  // Preserve empty objects and arrays, they are lost otherwise
  if (prefix && isEmpty(object)) {
    result[prefix] = Array.isArray(object) ? [] : {}
    return result
  }

  prefix = prefix ? prefix + '.' : ''

  for (const i in object) {
    if (Object.prototype.hasOwnProperty.call(object, i)) {
      if (isRecursivelyFlattenable(object[i])) {
        flattenObject(object[i], prefix + i, result)
      } else {
        result[prefix + i] = object[i]
      }
    }
  }
  return result
}

function isEmpty(object: Object): boolean {
  if (
    typeof object === 'object' &&
    object !== null &&
    Object.keys(object).length === 0
  ) {
    return true
  }
  return false
}

/**
 * Drops custom classes like Dates, etc
 */
function isRecursivelyFlattenable(object: Object): boolean {
  if (
    typeof object === 'object' &&
    (Array.isArray(object) ||
      Object.prototype.toString.call(object) === '[object Object]') &&
    object !== null
  ) {
    return true
  }
  return false
}
