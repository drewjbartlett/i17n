import { extractInterpolations } from '@src/core/extract-interpolations';

describe('extractInterpolations', () => {
  it('should return an array of interpolations when they exist in a string', () => {
    expect(extractInterpolations('hello, {username}')).toEqual(['username']);
    expect(extractInterpolations('The awards go to: {first}, {second}, and {third}')).toEqual([
      'first',
      'second',
      'third',
    ]);
  });

  it('should can interpolate with {{double}} {{brackets}}', () => {
    expect(extractInterpolations('hello, {{username}}')).toEqual(['username']);
    expect(extractInterpolations('The awards go to: {{first}}, {{second}}, and {{third}}')).toEqual([
      'first',
      'second',
      'third',
    ]);
  });

  it('should remove spaces inside brackets', () => {
    expect(extractInterpolations('hello, { username }')).toEqual(['username']);
    expect(extractInterpolations('The awards go to: {  first }, {  second     }, and {third}')).toEqual([
      'first',
      'second',
      'third',
    ]);
  });

  it('should ignore unterminated brackets', () => {
    expect(extractInterpolations('hello, {username')).toEqual([]);
    expect(extractInterpolations('hello, username}')).toEqual([]);
    expect(extractInterpolations('hello, username}{')).toEqual([]);
  });

  it('should ignore empty brackets', () => {
    expect(extractInterpolations('hello, {}, { }')).toEqual([]);
  });

  it('should return an empty array when there are no interpolations', () => {
    expect(extractInterpolations('hello, world')).toEqual([]);
  });
});
