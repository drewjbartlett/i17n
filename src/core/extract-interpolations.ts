/**
 * Takes a string with potential interpolations and returns an array of them.
 * This assumes the interpolations are wrapped in brackets as such "Hello, {username}."
 *
 * `extractInterpolations('Hello, {username}') // returns ['username']`
 */
export function extractInterpolations(str: string): string[] {
  const interpolations = str.match(/{\s*[\w\.]+\s*}/g);

  // if we have interpolations strip '{}' from them
  if (interpolations !== null) {
    return interpolations
      .map((x) => {
        const match = x.match(/[\w\.]+/);

        return match ? match[0] : '';
      })
      .filter((m) => {
        return m !== '';
      });
  }

  return [];
}
