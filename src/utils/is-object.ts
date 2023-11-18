/**
 * Determine if the passed value is an object.
 */
export function isObject(potentialObject: any): boolean {
  return typeof potentialObject === 'object' && potentialObject !== null && !Array.isArray(potentialObject);
}
