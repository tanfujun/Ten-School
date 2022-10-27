"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("../utils");

var _relation = require("../mixins/relation");

var _router = require("../utils/router");

var _createNamespace = (0, _utils.createNamespace)('tab'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default = createComponent({
  mixins: [(0, _relation.ChildrenMixin)('vanTabs')],
  props: (0, _extends2.default)({}, _router.routeProps, {
    dot: Boolean,
    name: [Number, String],
    // @deprecated
    info: [Number, String],
    badge: [Number, String],
    title: String,
    titleStyle: null,
    titleClass: null,
    disabled: Boolean
  }),
  data: function data() {
    return {
      inited: false
    };
  },
  computed: {
    computedName: function computedName() {
      var _this$name;

      return (_this$name = this.name) != null ? _this$name : this.index;
    },
    isActive: function isActive() {
      var active = this.computedName === this.parent.currentName;

      if (active) {
        this.inited = true;
      }

      return active;
    }
  },
  watch: {
    title: function title() {
      this.parent.setLine();
      this.parent.scrollIntoView();
    },
    inited: function inited(val) {
      var _this = this;

      if (this.parent.lazyRender && val) {
        this.$nextTick(function () {
          _this.parent.$emit('rendered', _this.computedName, _this.title);
        });
      }
    }
  },
  render: function render(h) {
    var slots = this.slots,
        parent = this.parent,
        isActive = this.isActive;
    var slotContent = slots();

    if (process.env.NODE_ENV === 'development' && this.info) {
      console.warn('[Vant] Tab: "info" prop is deprecated, use "badge" prop instead.');
    }

    if (!slotContent && !parent.animated) {
      return;
    }

    var show = parent.scrollspy || isActive;
    var shouldRender = this.inited || parent.scrollspy || !parent.lazyRender;
    var Content = shouldRender ? slotContent : h();

    if (parent.animated) {
      return h("div", {
        "attrs": {
          "role": "tabpanel",
          "aria-hidden": !isActive
        },
        "class": bem('pane-wrapper', {
          inactive: !isActive
        })
      }, [h("div", {
        "class": bem('pane')
      }, [Content])]);
    }

    return h("div", {
      "directives": [{
        name: "show",
        value: show
      }],
      "attrs": {
        "role": "tabpanel"
      },
      "class": bem('pane')
    }, [Content]);
  }
});

exports.default = _default;