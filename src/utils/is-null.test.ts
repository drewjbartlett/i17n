import { isNull } from '@src/utils/is-null';

describe('isNull', () => {
  it('should return true for any null values', () => {
    expect(isNull(null)).toBe(true);
  });

  it('should return false for any non-null values', () => {
    expect(isNull('null')).toBe(false);
    expect(isNull('')).toBe(false);
    expect(isNull(undefined)).toBe(false);
    expect(isNull(false)).toBe(false);
    expect(isNull(0)).toBe(false);
    expect(isNull([])).toBe(false);
    expect(isNull({})).toBe(false);
  });
});
