import { Trans } from '@src/core/create-i17n';
import { isNull } from '@src/utils/is-null';
import { isObject } from '@src/utils/is-object';
/**
 * Attempts to resolve a dot notation ('parent.child') to read that value from an
 * object { parent: 'child' }.
 */
export function resolveKeyFromLocale(k: string, locale: Trans): string | null {
  const keys = k.split('.');

  if (keys.length === 1) {
    return k in locale ? (locale[k] as string) : null;
  }

  // @ts-expect-error - This reduce method is confused about the type of prev, k
  const possibleKey = keys.reduce((prev, k) => {
    if (isNull(prev)) {
      return null;
    } else if (isObject(prev) && k in prev) {
      return prev[k];
    }

    return null;
  }, locale);

  return isObject(possibleKey) ? null : (possibleKey as string);
}
