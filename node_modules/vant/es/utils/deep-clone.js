import { isDef } from './index';
export function deepClone(obj) {
  if (!isDef(obj)) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(function (item) {
      return deepClone(item);
    });
  }

  if (typeof obj === 'object') {
    var to = {};
    Object.keys(obj).forEach(function (key) {
      to[key] = deepClone(obj[key]);
    });
    return to;
  }

  return obj;
}