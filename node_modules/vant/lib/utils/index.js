"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.noop = noop;
exports.isDef = isDef;
exports.isFunction = isFunction;
exports.isObject = isObject;
exports.isPromise = isPromise;
exports.get = get;
exports.isEmpty = isEmpty;
exports.isServer = exports.inBrowser = exports.addUnit = exports.createNamespace = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _create = require("./create");

exports.createNamespace = _create.createNamespace;

var _unit = require("./format/unit");

exports.addUnit = _unit.addUnit;
var inBrowser = typeof window !== 'undefined';
exports.inBrowser = inBrowser;
var isServer = _vue.default.prototype.$isServer; // eslint-disable-next-line @typescript-eslint/no-empty-function

exports.isServer = isServer;

function noop() {}

function isDef(val) {
  return val !== undefined && val !== null;
}

function isFunction(val) {
  return typeof val === 'function';
}

function isObject(val) {
  return val !== null && typeof val === 'object';
}

function isPromise(val) {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
}

function get(object, path) {
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


function isEmpty(value) {
  if (value == null) {
    return true;
  }

  if (typeof value !== 'object') {
    return true;
  }

  return Object.keys(value).length === 0;
}