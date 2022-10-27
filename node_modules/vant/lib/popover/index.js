"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _popperjs = require("@vant/popperjs");

var _utils = require("../utils");

var _constant = require("../utils/constant");

var _clickOutside = require("../mixins/click-outside");

var _icon = _interopRequireDefault(require("../icon"));

var _popup = _interopRequireDefault(require("../popup"));

// Mixins
// Components
var _createNamespace = (0, _utils.createNamespace)('popover'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default2 = createComponent({
  mixins: [(0, _clickOutside.ClickOutsideMixin)({
    event: 'touchstart',
    method: 'onClickOutside'
  })],
  props: {
    value: Boolean,
    trigger: String,
    overlay: Boolean,
    offset: {
      type: Array,
      default: function _default() {
        return [0, 8];
      }
    },
    theme: {
      type: String,
      default: 'light'
    },
    actions: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    placement: {
      type: String,
      default: 'bottom'
    },
    getContainer: {
      type: [String, Function],
      default: 'body'
    },
    closeOnClickAction: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    value: 'updateLocation',
    placement: 'updateLocation'
  },
  mounted: function mounted() {
    this.updateLocation();
  },
  beforeDestroy: function beforeDestroy() {
    if (this.popper) {
      this.popper.destroy();
      this.popper = null;
    }
  },
  methods: {
    createPopper: function createPopper() {
      return (0, _popperjs.createPopper)(this.$refs.wrapper, this.$refs.popover.$el, {
        placement: this.placement,
        modifiers: [{
          name: 'computeStyles',
          options: {
            adaptive: false,
            gpuAcceleration: false
          }
        }, (0, _extends2.default)({}, _popperjs.offsetModifier, {
          options: {
            offset: this.offset
          }
        })]
      });
    },
    updateLocation: function updateLocation() {
      var _this = this;

      this.$nextTick(function () {
        if (!_this.value) {
          return;
        }

        if (!_this.popper) {
          _this.popper = _this.createPopper();
        } else {
          _this.popper.setOptions({
            placement: _this.placement
          });
        }
      });
    },
    renderAction: function renderAction(action, index) {
      var _this2 = this;

      var h = this.$createElement;
      var icon = action.icon,
          text = action.text,
          disabled = action.disabled,
          className = action.className;
      return h("div", {
        "attrs": {
          "role": "menuitem"
        },
        "class": [bem('action', {
          disabled: disabled,
          'with-icon': icon
        }), className],
        "on": {
          "click": function click() {
            return _this2.onClickAction(action, index);
          }
        }
      }, [icon && h(_icon.default, {
        "attrs": {
          "name": icon
        },
        "class": bem('action-icon')
      }), h("div", {
        "class": [bem('action-text'), _constant.BORDER_BOTTOM]
      }, [text])]);
    },
    onToggle: function onToggle(value) {
      this.$emit('input', value);
    },
    onClickWrapper: function onClickWrapper() {
      if (this.trigger === 'click') {
        this.onToggle(!this.value);
      }
    },
    onTouchstart: function onTouchstart(event) {
      event.stopPropagation();
      this.$emit('touchstart', event);
    },
    onClickAction: function onClickAction(action, index) {
      if (action.disabled) {
        return;
      }

      this.$emit('select', action, index);

      if (this.closeOnClickAction) {
        this.$emit('input', false);
      }
    },
    onClickOutside: function onClickOutside() {
      this.$emit('input', false);
    },
    onOpen: function onOpen() {
      this.$emit('open');
    },

    /* istanbul ignore next */
    onOpened: function onOpened() {
      this.$emit('opened');
    },
    onClose: function onClose() {
      this.$emit('close');
    },

    /* istanbul ignore next */
    onClosed: function onClosed() {
      this.$emit('closed');
    }
  },
  render: function render() {
    var h = arguments[0];
    return h("span", {
      "ref": "wrapper",
      "class": bem('wrapper'),
      "on": {
        "click": this.onClickWrapper
      }
    }, [h(_popup.default, {
      "ref": "popover",
      "attrs": {
        "value": this.value,
        "overlay": this.overlay,
        "position": null,
        "transition": "van-popover-zoom",
        "lockScroll": false,
        "getContainer": this.getContainer
      },
      "class": bem([this.theme]),
      "on": {
        "open": this.onOpen,
        "close": this.onClose,
        "input": this.onToggle,
        "opened": this.onOpened,
        "closed": this.onClosed
      },
      "nativeOn": {
        "touchstart": this.onTouchstart
      }
    }, [h("div", {
      "class": bem('arrow')
    }), h("div", {
      "class": bem('content'),
      "attrs": {
        "role": "menu"
      }
    }, [this.slots('default') || this.actions.map(this.renderAction)])]), this.slots('reference')]);
  }
});

exports.default = _default2;