import { isFunctionType } from '@src/utils/is-function';
import { isNumber } from '@src/utils/is-number';
import { extractInterpolations } from '@src/core/extract-interpolations';
import { replaceInterpolations } from '@src/core/replace-interpolations';
import { resolveKeyFromLocale } from '@src/core/resolve-key-from-locale';
import { merge } from '@src/utils/merge';

export type Trans = {
  [key: string]: string | Trans;
};

/**
 * This is the API that is returned from createi17n.
 * Right now we have only one method which handles translations.
 */
export interface i17n {
  t: (key: string, interpolations?: Interpolations) => string;
  extend: (extended: Trans) => void;
}

export interface i17nConfig {
  translations: Trans;
  cache?: Map<string, string | InterpolatedFn>;
  /**
   * When enabled warning logs will write to the console for missing keys.
   */
  loggingEnabled?: boolean;
}

/**
 * This is a method that accepts a record of interpolations such as { user: 'drew' } and returns a string
 * with the interpolations.
 */
export type InterpolatedFn = (interpolations: Interpolations) => string;

/**
 * The shape of interpolations. They may only be a key => value pair of strings: { user: 'drew' }.
 */
export type Interpolations = Record<string, string | number>;

/**
 * The possibilities for specifying counts in an interpolation.
 *
 * { comment__one: 'comment', comment__many: 'comments' }
 */
export enum CountValueIndicators {
  One = 'one',
  Many = 'many',
}

/**
 * The interpolations key that determines if we should do a lookup for __one or __many (CountValueIndicators).
 */
export const COUNT_KEY = 'count';

function getCountValue(count: number): CountValueIndicators {
  if (count === 0) {
    return CountValueIndicators.Many;
  }

  return count === 1 ? CountValueIndicators.One : CountValueIndicators.Many;
}

function buildCountValueKey(k: string, count: number): string {
  return `${k}__${getCountValue(count)}`;
}

/**
 * Initialize the core i17n instance.
 */
export function createi17n(config: i17nConfig): i17n {
  const cache = config.cache || new Map<string, string | InterpolatedFn>();
  let translations: Trans = config.translations;
  const loggingEnabled = Boolean(config.loggingEnabled);

  /**
   * Allow extension of the i17n.
   * Clear the cache in the chance there are collisions with new keys that previously were cached.
   */
  function extend(extended: Trans) {
    translations = merge(translations, extended);

    cache.clear();
  }

  function fromCache(key: string, interpolations?: Interpolations): { key: string; value: string; cacheHit: true } {
    const cachedValue = cache.get(key)!;

    return {
      key,
      value: isFunctionType(cachedValue) ? cachedValue(interpolations ?? {}) : cachedValue,
      cacheHit: true,
    };
  }

  /**
   * If the translation has interpolations with the key { COUNT_KEY }
   * it will attempt to resolve to {key}__one or {key}__many.
   */
  function resolveKeyWithPotentialCountValue(
    key: string,
    interpolations?: Interpolations,
  ):
    | { key: string; value: string; cacheHit: true }
    | { key: string; value: string; cacheHit: false }
    | { key: string; value: null; cacheHit: false } {
    if (interpolations && COUNT_KEY in interpolations && isNumber(interpolations[COUNT_KEY])) {
      const keyWithAppendedCount = buildCountValueKey(key, interpolations[COUNT_KEY] as number);

      if (cache.has(keyWithAppendedCount)) {
        return fromCache(keyWithAppendedCount);
      }

      const potentialResolvedKey = resolveKeyFromLocale(keyWithAppendedCount, translations);

      if (potentialResolvedKey) {
        return {
          key: keyWithAppendedCount,
          value: potentialResolvedKey,
          cacheHit: false,
        };
      }
    }

    if (cache.has(key)) {
      return fromCache(key, interpolations);
    }

    return { key, value: resolveKeyFromLocale(key, translations), cacheHit: false };
  }

  /**
   * Translate a key to the locale value.
   * If the key has been resolved before, a cache lookup will be made
   * instead of recomputing it.
   * If the key does not exist, it will return the string that is passed in.
   */
  function t(k: string, interpolations?: Interpolations): string {
    const { key, value, cacheHit } = resolveKeyWithPotentialCountValue(k, interpolations);

    if (cacheHit) {
      return value;
    }

    if (value) {
      // If options are passed and there are interpolations found, create an interpolator function to cache for future hits.
      // This cached method prevents the future lookup of this key but allows for interpolating with new values each time.
      if (interpolations && extractInterpolations(value).length > 0) {
        const interpolatedFn: InterpolatedFn = (interps: Interpolations) => replaceInterpolations(value, interps);

        cache.set(key, interpolatedFn);

        return interpolatedFn(interpolations);
      }

      cache.set(key, value);

      return value;
    }

    warn(`No translation was found for key '${key}'.`);

    return key;
  }

  function warn(message: string): void {
    if (loggingEnabled) {
      console.warn(`[i17n warn]: ${message}`);
    }
  }

  return {
    t,
    extend,
  };
}
