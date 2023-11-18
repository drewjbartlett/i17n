/**
 * Determine if the given value is a function.
 */
export function isFunction(value: any): boolean {
  return typeof value === 'function';
}

/**
 * Check if the given function is a type of function.
 * This is useful when you need to check if a union type is not just a function
 * but a certain type of function.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunctionType<T extends Function>(value: any): value is T {
  return typeof value === 'function';
}
