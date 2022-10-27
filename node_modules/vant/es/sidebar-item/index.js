import _extends from "@babel/runtime/helpers/esm/extends";
import { createNamespace } from '../utils';
import { ChildrenMixin } from '../mixins/relation';
import { route, routeProps } from '../utils/router';
import Info from '../info';

var _createNamespace = createNamespace('sidebar-item'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  mixins: [ChildrenMixin('vanSidebar')],
  props: _extends({}, routeProps, {
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
      route(this.$router, this);
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
    }, [(_this$slots = this.slots('title')) != null ? _this$slots : this.title, h(Info, {
      "attrs": {
        "dot": this.dot,
        "info": (_this$badge = this.badge) != null ? _this$badge : this.info
      },
      "class": bem('info')
    })])]);
  }
});