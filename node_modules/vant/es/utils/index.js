import Vue from 'vue';
export { createNamespace } from './create';
export { addUnit } from './format/unit';
export var inBrowser = typeof window !== 'undefined';
export var isServer = Vue.prototype.$isServer; // eslint-disable-next-line @typescript-eslint/no-empty-function

export function noop() {}
export function isDef(val) {
  return val !== undefined && val !== null;
}
export function isFunction(val) {
  return typeof val === 'function';
}
export function isObject(val) {
  return val !== null && typeof val === 'object';
}
export function isPromise(val) {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
}
export function get(object, path) {
  var keys = path.split('.');
  var result = object;
  keys.forEach(function (key) {
    var _result$key;

    result = isObject(result) ? (_result$key = result[key]) != null ? _result$key : '' : '';
  });
  return result;
}
/**
 * Checks if `value` is an empty object, collection, map, or set.
 *
 * Objects are considered empty if they have no own enumerable string keyed
 * properties.
 *
 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
 * jQuery-like collections are considered empty if they have a `length` of `0`.
 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
 *
 * @function isEmpty
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */

export function isEmpty(value) {
  if (value == null) {
    return true;
  }

  if (typeof value !== 'object') {
    return true;
  }

  return Object.keys(value).length === 0;
}