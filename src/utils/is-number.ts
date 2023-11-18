import { getTag } from '@src/utils/get-tag';
import { isObjectLike } from '@src/utils/is-object-like';

export function isNumber(value?: any): value is number {
  return typeof value === 'number' || (isObjectLike(value) && getTag(value) === '[object Number]');
}
