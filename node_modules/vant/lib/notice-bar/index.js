"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _utils = require("../utils");

var _raf = require("../utils/dom/raf");

var _bindEvent = require("../mixins/bind-event");

var _icon = _interopRequireDefault(require("../icon"));

var _createNamespace = (0, _utils.createNamespace)('notice-bar'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default = createComponent({
  mixins: [(0, _bindEvent.BindEventMixin)(function (bind) {
    // fix cache issues with forwards and back history in safari
    // see: https://guwii.com/cache-issues-with-forwards-and-back-history-in-safari/
    bind(window, 'pageshow', this.reset);
  })],
  inject: {
    vanPopup: {
      default: null
    }
  },
  props: {
    text: String,
    mode: String,
    color: String,
    leftIcon: String,
    wrapable: Boolean,
    background: String,
    scrollable: {
      type: Boolean,
      default: null
    },
    delay: {
      type: [Number, String],
      default: 1
    },
    speed: {
      type: [Number, String],
      default: 60
    }
  },
  data: function data() {
    return {
      show: true,
      offset: 0,
      duration: 0,
      wrapWidth: 0,
      contentWidth: 0
    };
  },
  watch: {
    scrollable: 'reset',
    text: {
      handler: 'reset',
      immediate: true
    }
  },
  created: function created() {
    // https://github.com/vant-ui/vant/issues/8634
    if (this.vanPopup) {
      this.vanPopup.onReopen(this.reset);
    }
  },
  activated: function activated() {
    this.reset();
  },
  methods: {
    onClickIcon: function onClickIcon(event) {
      if (this.mode === 'closeable') {
        this.show = false;
        this.$emit('close', event);
      }
    },
    onTransitionEnd: function onTransitionEnd() {
      var _this = this;

      this.offset = this.wrapWidth;
      this.duration = 0; // wait for Vue to render offset
      // using nextTick won't work in iOS14

      (0, _raf.raf)(function () {
        // use double raf to ensure animation can start
        (0, _raf.doubleRaf)(function () {
          _this.offset = -_this.contentWidth;
          _this.duration = (_this.contentWidth + _this.wrapWidth) / _this.speed;

          _this.$emit('replay');
        });
      });
    },
    // not an exposed-api, but may used by some users
    start: function start() {
      this.reset();
    },
    // @exposed-api
    reset: function reset() {
      var _this2 = this;

      var delay = (0, _utils.isDef)(this.delay) ? this.delay * 1000 : 0;
      this.offset = 0;
      this.duration = 0;
      this.wrapWidth = 0;
      this.contentWidth = 0;
      clearTimeout(this.startTimer);
      this.startTimer = setTimeout(function () {
        var _this2$$refs = _this2.$refs,
            wrap = _this2$$refs.wrap,
            content = _this2$$refs.content;

        if (!wrap || !content || _this2.scrollable === false) {
          return;
        }

        var wrapWidth = wrap.getBoundingClientRect().width;
        var contentWidth = content.getBoundingClientRect().width;

        if (_this2.scrollable || contentWidth > wrapWidth) {
          (0, _raf.doubleRaf)(function () {
            _this2.offset = -contentWidth;
            _this2.duration = contentWidth / _this2.speed;
            _this2.wrapWidth = wrapWidth;
            _this2.contentWidth = contentWidth;
          });
        }
      }, delay);
    }
  },
  render: function render() {
    var _this3 = this;

    var h = arguments[0];
    var slots = this.slots,
        mode = this.mode,
        leftIcon = this.leftIcon,
        onClickIcon = this.onClickIcon;
    var barStyle = {
      color: this.color,
      background: this.background
    };
    var contentStyle = {
      transform: this.offset ? "translateX(" + this.offset + "px)" : '',
      transitionDuration: this.duration + 's'
    };

    function LeftIcon() {
      var slot = slots('left-icon');

      if (slot) {
        return slot;
      }

      if (leftIcon) {
        return h(_icon.default, {
          "class": bem('left-icon'),
          "attrs": {
            "name": leftIcon
          }
        });
      }
    }

    function RightIcon() {
      var slot = slots('right-icon');

      if (slot) {
        return slot;
      }

      var iconName;

      if (mode === 'closeable') {
        iconName = 'cross';
      } else if (mode === 'link') {
        iconName = 'arrow';
      }

      if (iconName) {
        return h(_icon.default, {
          "class": bem('right-icon'),
          "attrs": {
            "name": iconName
          },
          "on": {
            "click": onClickIcon
          }
        });
      }
    }

    return h("div", {
      "attrs": {
        "role": "alert"
      },
      "directives": [{
        name: "show",
        value: this.show
      }],
      "class": bem({
        wrapable: this.wrapable
      }),
      "style": barStyle,
      "on": {
        "click": function click(event) {
          _this3.$emit('click', event);
        }
      }
    }, [LeftIcon(), h("div", {
      "ref": "wrap",
      "class": bem('wrap'),
      "attrs": {
        "role": "marquee"
      }
    }, [h("div", {
      "ref": "content",
      "class": [bem('content'), {
        'van-ellipsis': this.scrollable === false && !this.wrapable
      }],
      "style": contentStyle,
      "on": {
        "transitionend": this.onTransitionEnd
      }
    }, [this.slots() || this.text])]), RightIcon()]);
  }
});

exports.default = _default;