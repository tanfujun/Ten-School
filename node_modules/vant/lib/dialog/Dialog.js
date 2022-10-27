"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _babelHelperVueJsxMergeProps = _interopRequireDefault(require("@vue/babel-helper-vue-jsx-merge-props"));

var _utils = require("../utils");

var _constant = require("../utils/constant");

var _popup = require("../mixins/popup");

var _button = _interopRequireDefault(require("../button"));

var _goodsAction = _interopRequireDefault(require("../goods-action"));

var _goodsActionButton = _interopRequireDefault(require("../goods-action-button"));

var _createNamespace = (0, _utils.createNamespace)('dialog'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1],
    t = _createNamespace[2];

var _default = createComponent({
  mixins: [(0, _popup.PopupMixin)()],
  props: {
    title: String,
    theme: String,
    width: [Number, String],
    message: String,
    className: null,
    callback: Function,
    beforeClose: Function,
    messageAlign: String,
    cancelButtonText: String,
    cancelButtonColor: String,
    confirmButtonText: String,
    confirmButtonColor: String,
    showCancelButton: Boolean,
    overlay: {
      type: Boolean,
      default: true
    },
    allowHtml: {
      type: Boolean,
      default: true
    },
    transition: {
      type: String,
      default: 'van-dialog-bounce'
    },
    showConfirmButton: {
      type: Boolean,
      default: true
    },
    closeOnPopstate: {
      type: Boolean,
      default: true
    },
    closeOnClickOverlay: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      loading: {
        confirm: false,
        cancel: false
      }
    };
  },
  methods: {
    onClickOverlay: function onClickOverlay() {
      this.handleAction('overlay');
    },
    handleAction: function handleAction(action) {
      var _this = this;

      this.$emit(action); // show not trigger close event when hidden

      if (!this.value) {
        return;
      }

      if (this.beforeClose) {
        this.loading[action] = true;
        this.beforeClose(action, function (state) {
          if (state !== false && _this.loading[action]) {
            _this.onClose(action);
          }

          _this.loading.confirm = false;
          _this.loading.cancel = false;
        });
      } else {
        this.onClose(action);
      }
    },
    onClose: function onClose(action) {
      this.close();

      if (this.callback) {
        this.callback(action);
      }
    },
    onOpened: function onOpened() {
      var _this2 = this;

      this.$emit('opened');
      this.$nextTick(function () {
        var _this2$$refs$dialog;

        (_this2$$refs$dialog = _this2.$refs.dialog) == null ? void 0 : _this2$$refs$dialog.focus();
      });
    },
    onClosed: function onClosed() {
      this.$emit('closed');
    },
    onKeydown: function onKeydown(event) {
      var _this3 = this;

      if (event.key === 'Escape' || event.key === 'Enter') {
        // skip keyboard events of child elements
        if (event.target !== this.$refs.dialog) {
          return;
        }

        var onEventType = {
          Enter: this.showConfirmButton ? function () {
            return _this3.handleAction('confirm');
          } : _utils.noop,
          Escape: this.showCancelButton ? function () {
            return _this3.handleAction('cancel');
          } : _utils.noop
        };
        onEventType[event.key]();
        this.$emit('keydown', event);
      }
    },
    genRoundButtons: function genRoundButtons() {
      var _this4 = this;

      var h = this.$createElement;
      return h(_goodsAction.default, {
        "class": bem('footer')
      }, [this.showCancelButton && h(_goodsActionButton.default, {
        "attrs": {
          "size": "large",
          "type": "warning",
          "text": this.cancelButtonText || t('cancel'),
          "color": this.cancelButtonColor,
          "loading": this.loading.cancel
        },
        "class": bem('cancel'),
        "on": {
          "click": function click() {
            _this4.handleAction('cancel');
          }
        }
      }), this.showConfirmButton && h(_goodsActionButton.default, {
        "attrs": {
          "size": "large",
          "type": "danger",
          "text": this.confirmButtonText || t('confirm'),
          "color": this.confirmButtonColor,
          "loading": this.loading.confirm
        },
        "class": bem('confirm'),
        "on": {
          "click": function click() {
            _this4.handleAction('confirm');
          }
        }
      })]);
    },
    genButtons: function genButtons() {
      var _this5 = this,
          _ref;

      var h = this.$createElement;
      var multiple = this.showCancelButton && this.showConfirmButton;
      return h("div", {
        "class": [_constant.BORDER_TOP, bem('footer')]
      }, [this.showCancelButton && h(_button.default, {
        "attrs": {
          "size": "large",
          "loading": this.loading.cancel,
          "text": this.cancelButtonText || t('cancel'),
          "nativeType": "button"
        },
        "class": bem('cancel'),
        "style": {
          color: this.cancelButtonColor
        },
        "on": {
          "click": function click() {
            _this5.handleAction('cancel');
          }
        }
      }), this.showConfirmButton && h(_button.default, {
        "attrs": {
          "size": "large",
          "loading": this.loading.confirm,
          "text": this.confirmButtonText || t('confirm'),
          "nativeType": "button"
        },
        "class": [bem('confirm'), (_ref = {}, _ref[_constant.BORDER_LEFT] = multiple, _ref)],
        "style": {
          color: this.confirmButtonColor
        },
        "on": {
          "click": function click() {
            _this5.handleAction('confirm');
          }
        }
      })]);
    },
    genContent: function genContent(hasTitle, messageSlot) {
      var h = this.$createElement;

      if (messageSlot) {
        return h("div", {
          "class": bem('content')
        }, [messageSlot]);
      }

      var message = this.message,
          messageAlign = this.messageAlign;

      if (message) {
        var _bem, _domProps;

        var data = {
          class: bem('message', (_bem = {
            'has-title': hasTitle
          }, _bem[messageAlign] = messageAlign, _bem)),
          domProps: (_domProps = {}, _domProps[this.allowHtml ? 'innerHTML' : 'textContent'] = message, _domProps)
        };
        return h("div", {
          "class": bem('content', {
            isolated: !hasTitle
          })
        }, [h("div", (0, _babelHelperVueJsxMergeProps.default)([{}, data]))]);
      }
    }
  },
  render: function render() {
    var h = arguments[0];

    if (!this.shouldRender) {
      return;
    }

    var message = this.message;
    var messageSlot = this.slots();
    var title = this.slots('title') || this.title;
    var Title = title && h("div", {
      "class": bem('header', {
        isolated: !message && !messageSlot
      })
    }, [title]);
    return h("transition", {
      "attrs": {
        "name": this.transition
      },
      "on": {
        "afterEnter": this.onOpened,
        "afterLeave": this.onClosed
      }
    }, [h("div", {
      "directives": [{
        name: "show",
        value: this.value
      }],
      "attrs": {
        "role": "dialog",
        "aria-labelledby": this.title || message,
        "tabIndex": 0
      },
      "class": [bem([this.theme]), this.className],
      "style": {
        width: (0, _utils.addUnit)(this.width)
      },
      "ref": "dialog",
      "on": {
        "keydown": this.onKeydown
      }
    }, [Title, this.genContent(title, messageSlot), this.theme === 'round-button' ? this.genRoundButtons() : this.genButtons()])]);
  }
});

exports.default = _default;