import { Interpolations } from '@src/core/create-i17n';

/**
 * Replace interpolated strings with values. Such as "Hello {user}".
 *
 * `replaceInterpolations('Hello {user}', { user: 'drew' });`
 */
export function replaceInterpolations<T extends Interpolations>(str: string, interpolations: T): string {
  let interpolated = str;

  Object.keys(interpolations).forEach((interpolation) => {
    interpolated = interpolated.replace(new RegExp(`\{${interpolation}\}`, 'g'), `${interpolations[interpolation]}`);
  });

  return interpolated;
}
