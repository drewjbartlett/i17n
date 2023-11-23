import { replaceInterpolations } from '@src/core/replace-interpolations';

describe('replaceInterpolations', () => {
  it('should return an array of interpolations when they exist in a string', () => {
    expect(replaceInterpolations('hello, {username}', { username: 'drew' })).toEqual('hello, drew');
    expect(
      replaceInterpolations('The awards go to: {first}, {second}, and {third}', {
        first: 'drew',
        second: 'robin',
        third: 'cameron',
      }),
    ).toEqual('The awards go to: drew, robin, and cameron');
  });
});
