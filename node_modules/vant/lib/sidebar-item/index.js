"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("../utils");

var _relation = require("../mixins/relation");

var _router = require("../utils/router");

var _info = _interopRequireDefault(require("../info"));

var _createNamespace = (0, _utils.createNamespace)('sidebar-item'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default = createComponent({
  mixins: [(0, _relation.ChildrenMixin)('vanSidebar')],
  props: (0, _extends2.default)({}, _router.routeProps, {
    dot: Boolean,
    // @deprecated
    info: [Number, String],
    badge: [Number, String],
    title: String,
    disabled: Boolean
  }),
  computed: {
    select: function select() {
      return this.index === +this.parent.activeKey;
    }
  },
  methods: {
    onClick: function onClick() {
      if (this.disabled) {
        return;
      }

      this.$emit('click', this.index);
      this.parent.$emit('input', this.index);
      this.parent.setIndex(this.index);
      (0, _router.route)(this.$router, this);
    }
  },
  render: function render() {
    var _this$slots, _this$badge;

    var h = arguments[0];

    if (process.env.NODE_ENV === 'development' && this.info) {
      console.warn('[Vant] SidebarItem: "info" prop is deprecated, use "badge" prop instead.');
    }

    return h("a", {
      "class": bem({
        select: this.select,
        disabled: this.disabled
      }),
      "on": {
        "click": this.onClick
      }
    }, [h("div", {
      "class": bem('text')
    }, [(_this$slots = this.slots('title')) != null ? _this$slots : this.title, h(_info.default, {
      "attrs": {
        "dot": this.dot,
        "info": (_this$badge = this.badge) != null ? _this$badge : this.info
      },
      "class": bem('info')
    })])]);
  }
});

exports.default = _default;