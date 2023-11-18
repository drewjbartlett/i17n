import { isFunction } from '@src/utils/is-function';

function noop(): void {
  //
}

describe('isFunction', () => {
  it('should return true when it is an function', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(noop)).toBe(true);
  });

  it('should return false when it is not an function', () => {
    expect(isFunction({})).toBe(false);
    expect(isFunction(false)).toBe(false);
    expect(isFunction([])).toBe(false);
    expect(isFunction(true)).toBe(false);
    expect(isFunction('true')).toBe(false);
    expect(isFunction(undefined)).toBe(false);
    expect(isFunction(null)).toBe(false);
  });
});
