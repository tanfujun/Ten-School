"use strict";

exports.__esModule = true;
exports.callInterceptor = callInterceptor;

var _ = require(".");

function callInterceptor(options) {
  var interceptor = options.interceptor,
      args = options.args,
      done = options.done;

  if (interceptor) {
    var returnVal = interceptor.apply(void 0, args);

    if ((0, _.isPromise)(returnVal)) {
      returnVal.then(function (value) {
        if (value) {
          done();
        }
      }).catch(_.noop);
    } else if (returnVal) {
      done();
    }
  } else {
    done();
  }
}