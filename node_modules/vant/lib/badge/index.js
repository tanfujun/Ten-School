"use strict";

exports.__esModule = true;
exports.default = void 0;

var _utils = require("../utils");

var _number = require("../utils/validate/number");

var _createNamespace = (0, _utils.createNamespace)('badge'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default = createComponent({
  props: {
    dot: Boolean,
    max: [Number, String],
    color: String,
    content: [Number, String],
    tag: {
      type: String,
      default: 'div'
    }
  },
  methods: {
    hasContent: function hasContent() {
      return !!(this.$scopedSlots.content || (0, _utils.isDef)(this.content) && this.content !== '');
    },
    renderContent: function renderContent() {
      var dot = this.dot,
          max = this.max,
          content = this.content;

      if (!dot && this.hasContent()) {
        if (this.$scopedSlots.content) {
          return this.$scopedSlots.content();
        }

        if ((0, _utils.isDef)(max) && (0, _number.isNumeric)(content) && +content > max) {
          return max + "+";
        }

        return content;
      }
    },
    renderBadge: function renderBadge() {
      var h = this.$createElement;

      if (this.hasContent() || this.dot) {
        return h("div", {
          "class": bem({
            dot: this.dot,
            fixed: !!this.$scopedSlots.default
          }),
          "style": {
            background: this.color
          }
        }, [this.renderContent()]);
      }
    }
  },
  render: function render() {
    var h = arguments[0];

    if (this.$scopedSlots.default) {
      var tag = this.tag;
      return h(tag, {
        "class": bem('wrapper')
      }, [this.$scopedSlots.default(), this.renderBadge()]);
    }

    return this.renderBadge();
  }
});

exports.default = _default;