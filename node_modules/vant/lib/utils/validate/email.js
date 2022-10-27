"use strict";

exports.__esModule = true;
exports.isEmail = isEmail;

/* eslint-disable */
function isEmail(value) {
  var reg = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  return reg.test(value.trim());
}