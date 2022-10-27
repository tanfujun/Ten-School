import _mergeJSXProps2 from "@vue/babel-helper-vue-jsx-merge-props";
import _mergeJSXProps from "@vue/babel-helper-vue-jsx-merge-props";
import { deepClone } from '../utils/deep-clone';
import { createNamespace, inBrowser, isObject } from '../utils';
import { range } from '../utils/format/number';
import { preventDefault, on, off } from '../utils/dom/event';
import { TouchMixin } from '../mixins/touch';
var DEFAULT_DURATION = 200; // 惯性滑动思路:
// 在手指离开屏幕时，如果和上一次 move 时的间隔小于 `MOMENTUM_LIMIT_TIME` 且 move
// 距离大于 `MOMENTUM_LIMIT_DISTANCE` 时，执行惯性滑动

export var MOMENTUM_LIMIT_TIME = 300;
export var MOMENTUM_LIMIT_DISTANCE = 15;

var _createNamespace = createNamespace('picker-column'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

function getElementTranslateY(element) {
  var style = window.getComputedStyle(element);
  var transform = style.transform || style.webkitTransform;
  var translateY = transform.slice(7, transform.length - 1).split(', ')[5];
  return Number(translateY);
}

function isOptionDisabled(option) {
  return isObject(option) && option.disabled;
} // use standard WheelEvent:
// https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent


var supportMousewheel = inBrowser && 'onwheel' in window;
var mousewheelTimer = null;
export default createComponent({
  mixins: [TouchMixin],
  props: {
    valueKey: String,
    readonly: Boolean,
    allowHtml: Boolean,
    className: String,
    itemHeight: Number,
    defaultIndex: Number,
    swipeDuration: [Number, String],
    visibleItemCount: [Number, String],
    initialOptions: {
      type: Array,
      default: function _default() {
        return [];
      }
    }
  },
  data: function data() {
    return {
      offset: 0,
      duration: 0,
      options: deepClone(this.initialOptions),
      currentIndex: this.defaultIndex
    };
  },
  created: function created() {
    if (this.$parent.children) {
      this.$parent.children.push(this);
    }

    this.setIndex(this.currentIndex);
  },
  mounted: function mounted() {
    this.bindTouchEvent(this.$el);

    if (supportMousewheel) {
      on(this.$el, 'wheel', this.onMouseWheel, false);
    }
  },
  destroyed: function destroyed() {
    var children = this.$parent.children;

    if (children) {
      children.splice(children.indexOf(this), 1);
    }

    if (supportMousewheel) {
      off(this.$el, 'wheel');
    }
  },
  watch: {
    initialOptions: 'setOptions',
    defaultIndex: function defaultIndex(val) {
      this.setIndex(val);
    }
  },
  computed: {
    count: function count() {
      return this.options.length;
    },
    baseOffset: function baseOffset() {
      return this.itemHeight * (this.visibleItemCount - 1) / 2;
    }
  },
  methods: {
    setOptions: function setOptions(options) {
      if (JSON.stringify(options) !== JSON.stringify(this.options)) {
        this.options = deepClone(options);
        this.setIndex(this.defaultIndex);
      }
    },
    onTouchStart: function onTouchStart(event) {
      if (this.readonly) {
        return;
      }

      this.touchStart(event);

      if (this.moving) {
        var translateY = getElementTranslateY(this.$refs.wrapper);
        this.offset = Math.min(0, translateY - this.baseOffset);
        this.startOffset = this.offset;
      } else {
        this.startOffset = this.offset;
      }

      this.duration = 0;
      this.transitionEndTrigger = null;
      this.touchStartTime = Date.now();
      this.momentumOffset = this.startOffset;
    },
    onTouchMove: function onTouchMove(event) {
      if (this.readonly) {
        return;
      }

      this.touchMove(event);

      if (this.direction === 'vertical') {
        this.moving = true;
        preventDefault(event, true);
      }

      this.offset = range(this.startOffset + this.deltaY, -(this.count * this.itemHeight), this.itemHeight);
      var now = Date.now();

      if (now - this.touchStartTime > MOMENTUM_LIMIT_TIME) {
        this.touchStartTime = now;
        this.momentumOffset = this.offset;
      }
    },
    onTouchEnd: function onTouchEnd() {
      var _this = this;

      if (this.readonly) {
        return;
      }

      var distance = this.offset - this.momentumOffset;
      var duration = Date.now() - this.touchStartTime;
      var allowMomentum = duration < MOMENTUM_LIMIT_TIME && Math.abs(distance) > MOMENTUM_LIMIT_DISTANCE;

      if (allowMomentum) {
        this.momentum(distance, duration);
        return;
      }

      var index = this.getIndexByOffset(this.offset);
      this.duration = DEFAULT_DURATION;
      this.setIndex(index, true); // compatible with desktop scenario
      // use setTimeout to skip the click event Emitted after touchstart

      setTimeout(function () {
        _this.moving = false;
      }, 0);
    },
    onMouseWheel: function onMouseWheel(event) {
      var _this2 = this;

      if (this.readonly) {
        return;
      }

      preventDefault(event, true); // simply combine touchstart and touchmove

      var translateY = getElementTranslateY(this.$refs.wrapper);
      this.startOffset = Math.min(0, translateY - this.baseOffset);
      this.momentumOffset = this.startOffset;
      this.transitionEndTrigger = null; // directly use deltaY, see https://caniuse.com/?search=deltaY
      // use deltaY to detect direction for not special setting device
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event

      var deltaY = event.deltaY;

      if (this.startOffset === 0 && deltaY < 0) {
        return;
      } // get offset
      // if necessary, can adjust distance value to make scrolling smoother


      var distance = -deltaY;
      this.offset = range(this.startOffset + distance, -(this.count * this.itemHeight), this.itemHeight);

      if (mousewheelTimer) {
        clearTimeout(mousewheelTimer);
      }

      mousewheelTimer = setTimeout(function () {
        _this2.onTouchEnd();

        _this2.touchStartTime = 0;
      }, MOMENTUM_LIMIT_TIME);
    },
    onTransitionEnd: function onTransitionEnd() {
      this.stopMomentum();
    },
    onClickItem: function onClickItem(index) {
      if (this.moving || this.readonly) {
        return;
      }

      this.transitionEndTrigger = null;
      this.duration = DEFAULT_DURATION;
      this.setIndex(index, true);
    },
    adjustIndex: function adjustIndex(index) {
      index = range(index, 0, this.count);

      for (var i = index; i < this.count; i++) {
        if (!isOptionDisabled(this.options[i])) return i;
      }

      for (var _i = index - 1; _i >= 0; _i--) {
        if (!isOptionDisabled(this.options[_i])) return _i;
      }
    },
    getOptionText: function getOptionText(option) {
      if (isObject(option) && this.valueKey in option) {
        return option[this.valueKey];
      }

      return option;
    },
    setIndex: function setIndex(index, emitChange) {
      var _this3 = this;

      index = this.adjustIndex(index) || 0;
      var offset = -index * this.itemHeight;

      var trigger = function trigger() {
        if (index !== _this3.currentIndex) {
          _this3.currentIndex = index;

          if (emitChange) {
            _this3.$emit('change', index);
          }
        }
      }; // trigger the change event after transitionend when moving


      if (this.moving && offset !== this.offset) {
        this.transitionEndTrigger = trigger;
      } else {
        trigger();
      }

      this.offset = offset;
    },
    setValue: function setValue(value) {
      var options = this.options;

      for (var i = 0; i < options.length; i++) {
        if (this.getOptionText(options[i]) === value) {
          return this.setIndex(i);
        }
      }
    },
    getValue: function getValue() {
      return this.options[this.currentIndex];
    },
    getIndexByOffset: function getIndexByOffset(offset) {
      return range(Math.round(-offset / this.itemHeight), 0, this.count - 1);
    },
    momentum: function momentum(distance, duration) {
      var speed = Math.abs(distance / duration);
      distance = this.offset + speed / 0.003 * (distance < 0 ? -1 : 1);
      var index = this.getIndexByOffset(distance);
      this.duration = +this.swipeDuration;
      this.setIndex(index, true);
    },
    stopMomentum: function stopMomentum() {
      this.moving = false;
      this.duration = 0;

      if (this.transitionEndTrigger) {
        this.transitionEndTrigger();
        this.transitionEndTrigger = null;
      }
    },
    genOptions: function genOptions() {
      var _this4 = this;

      var h = this.$createElement;
      var optionStyle = {
        height: this.itemHeight + "px"
      };
      return this.options.map(function (option, index) {
        var _domProps;

        var text = _this4.getOptionText(option);

        var disabled = isOptionDisabled(option);
        var data = {
          style: optionStyle,
          attrs: {
            role: 'button',
            tabindex: disabled ? -1 : 0
          },
          class: [bem('item', {
            disabled: disabled,
            selected: index === _this4.currentIndex
          })],
          on: {
            click: function click() {
              _this4.onClickItem(index);
            }
          }
        };
        var childData = {
          class: 'van-ellipsis',
          domProps: (_domProps = {}, _domProps[_this4.allowHtml ? 'innerHTML' : 'textContent'] = text, _domProps)
        };
        return h("li", _mergeJSXProps([{}, data]), [_this4.slots('option', option) || h("div", _mergeJSXProps2([{}, childData]))]);
      });
    }
  },
  render: function render() {
    var h = arguments[0];
    var wrapperStyle = {
      transform: "translate3d(0, " + (this.offset + this.baseOffset) + "px, 0)",
      transitionDuration: this.duration + "ms",
      transitionProperty: this.duration ? 'all' : 'none'
    };
    return h("div", {
      "class": [bem(), this.className]
    }, [h("ul", {
      "ref": "wrapper",
      "style": wrapperStyle,
      "class": bem('wrapper'),
      "on": {
        "transitionend": this.onTransitionEnd
      }
    }, [this.genOptions()])]);
  }
});