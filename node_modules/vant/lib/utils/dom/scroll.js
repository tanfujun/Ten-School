"use strict";

exports.__esModule = true;
exports.getScroller = getScroller;
exports.getScrollTop = getScrollTop;
exports.setScrollTop = setScrollTop;
exports.getRootScrollTop = getRootScrollTop;
exports.setRootScrollTop = setRootScrollTop;
exports.getElementTop = getElementTop;
exports.getVisibleHeight = getVisibleHeight;
exports.getVisibleTop = getVisibleTop;

function isWindow(val) {
  return val === window;
} // get nearest scroll element
// https://github.com/vant-ui/vant/issues/3823


var overflowScrollReg = /scroll|auto|overlay/i;

function getScroller(el, root) {
  if (root === void 0) {
    root = window;
  }

  var node = el;

  while (node && node.tagName !== 'HTML' && node.tagName !== 'BODY' && node.nodeType === 1 && node !== root) {
    var _window$getComputedSt = window.getComputedStyle(node),
        overflowY = _window$getComputedSt.overflowY;

    if (overflowScrollReg.test(overflowY)) {
      return node;
    }

    node = node.parentNode;
  }

  return root;
}

function getScrollTop(el) {
  var top = 'scrollTop' in el ? el.scrollTop : el.pageYOffset; // iOS scroll bounce cause minus scrollTop

  return Math.max(top, 0);
}

function setScrollTop(el, value) {
  if ('scrollTop' in el) {
    el.scrollTop = value;
  } else {
    el.scrollTo(el.scrollX, value);
  }
}

function getRootScrollTop() {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

function setRootScrollTop(value) {
  setScrollTop(window, value);
  setScrollTop(document.body, value);
} // get distance from element top to page top or scroller top


function getElementTop(el, scroller) {
  if (isWindow(el)) {
    return 0;
  }

  var scrollTop = scroller ? getScrollTop(scroller) : getRootScrollTop();
  return el.getBoundingClientRect().top + scrollTop;
}

function getVisibleHeight(el) {
  if (isWindow(el)) {
    return el.innerHeight;
  }

  return el.getBoundingClientRect().height;
}

function getVisibleTop(el) {
  if (isWindow(el)) {
    return 0;
  }

  return el.getBoundingClientRect().top;
}