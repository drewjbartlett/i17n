import { isObjectLike } from './is-object-like';

describe('isObjectLike', () => {
  it('should return true for an object', () => {
    expect(isObjectLike({})).toBe(true);
  });

  it('should return true for an array', () => {
    expect(isObjectLike([1, 2, 3])).toBe(true);
  });

  it('should return true for an object', () => {
    expect(isObjectLike(Function)).toBe(false);
  });

  it('should return true for a null', () => {
    expect(isObjectLike(null)).toBe(false);
  });
});
