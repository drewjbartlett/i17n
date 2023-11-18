import { isObject } from '@src/utils/is-object';

describe('isObject', () => {
  it('should return true when it is an object', () => {
    expect(isObject({})).toBe(true);
    expect(
      isObject({
        someObject: {},
      }),
    ).toBe(true);
  });

  it('should return false when it is not an object', () => {
    expect(isObject(false)).toBe(false);
    expect(isObject([])).toBe(false);
    expect(isObject(true)).toBe(false);
    expect(isObject('true')).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject(null)).toBe(false);
  });
});
