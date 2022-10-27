"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("../utils");

var _router = require("../utils/router");

var _relation = require("../mixins/relation");

var _icon = _interopRequireDefault(require("../icon"));

var _info = _interopRequireDefault(require("../info"));

// Utils
// Mixins
// Components
var _createNamespace = (0, _utils.createNamespace)('tabbar-item'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default = createComponent({
  mixins: [(0, _relation.ChildrenMixin)('vanTabbar')],
  props: (0, _extends2.default)({}, _router.routeProps, {
    dot: Boolean,
    icon: String,
    name: [Number, String],
    // @deprecated
    info: [Number, String],
    badge: [Number, String],
    iconPrefix: String
  }),
  data: function data() {
    return {
      nameMatched: false
    };
  },
  computed: {
    active: function active() {
      var routeMode = this.parent.route;

      if (routeMode && '$route' in this) {
        var to = this.to,
            $route = this.$route;
        var config = (0, _utils.isObject)(to) ? to : {
          path: to
        };
        return !!$route.matched.find(function (r) {
          // vue-router 3.x $route.matched[0].path is empty in / and its children paths
          var path = r.path === '' ? '/' : r.path;
          var pathMatched = config.path === path;
          var nameMatched = (0, _utils.isDef)(config.name) && config.name === r.name;
          return pathMatched || nameMatched;
        });
      }

      return this.nameMatched;
    }
  },
  methods: {
    onClick: function onClick(event) {
      var _this = this;

      if (!this.active) {
        this.parent.triggerChange(this.name || this.index, function () {
          (0, _router.route)(_this.$router, _this);
        });
      }

      this.$emit('click', event);
    },
    genIcon: function genIcon() {
      var h = this.$createElement;
      var slot = this.slots('icon', {
        active: this.active
      });

      if (slot) {
        return slot;
      }

      if (this.icon) {
        return h(_icon.default, {
          "attrs": {
            "name": this.icon,
            "classPrefix": this.iconPrefix
          }
        });
      }
    }
  },
  render: function render() {
    var _this$badge;

    var h = arguments[0];
    var active = this.active;
    var color = this.parent[active ? 'activeColor' : 'inactiveColor'];

    if (process.env.NODE_ENV === 'development' && this.info) {
      console.warn('[Vant] TabbarItem: "info" prop is deprecated, use "badge" prop instead.');
    }

    return h("div", {
      "class": bem({
        active: active
      }),
      "style": {
        color: color
      },
      "on": {
        "click": this.onClick
      }
    }, [h("div", {
      "class": bem('icon')
    }, [this.genIcon(), h(_info.default, {
      "attrs": {
        "dot": this.dot,
        "info": (_this$badge = this.badge) != null ? _this$badge : this.info
      }
    })]), h("div", {
      "class": bem('text')
    }, [this.slots('default', {
      active: active
    })])]);
  }
});

exports.default = _default;