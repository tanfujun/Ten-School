import { createNamespace } from '../utils';
import { BORDER_TOP_BOTTOM } from '../utils/constant';
import { callInterceptor } from '../utils/interceptor';
import { ParentMixin } from '../mixins/relation';

var _createNamespace = createNamespace('tabbar'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  mixins: [ParentMixin('vanTabbar')],
  props: {
    route: Boolean,
    zIndex: [Number, String],
    placeholder: Boolean,
    activeColor: String,
    beforeChange: Function,
    inactiveColor: String,
    value: {
      type: [Number, String],
      default: 0
    },
    border: {
      type: Boolean,
      default: true
    },
    fixed: {
      type: Boolean,
      default: true
    },
    safeAreaInsetBottom: {
      type: Boolean,
      default: null
    }
  },
  data: function data() {
    return {
      height: null
    };
  },
  computed: {
    fit: function fit() {
      if (this.safeAreaInsetBottom !== null) {
        return this.safeAreaInsetBottom;
      } // enable safe-area-inset-bottom by default when fixed


      return this.fixed;
    }
  },
  watch: {
    value: 'setActiveItem',
    children: 'setActiveItem'
  },
  mounted: function mounted() {
    var _this = this;

    if (this.placeholder && this.fixed) {
      var setHeight = function setHeight() {
        _this.height = _this.$refs.tabbar.getBoundingClientRect().height;
      };

      setHeight(); // https://github.com/vant-ui/vant/issues/10131

      setTimeout(setHeight, 100);
    }
  },
  methods: {
    setActiveItem: function setActiveItem() {
      var _this2 = this;

      this.children.forEach(function (item, index) {
        item.nameMatched = item.name === _this2.value || index === _this2.value;
      });
    },
    triggerChange: function triggerChange(active, afterChange) {
      var _this3 = this;

      callInterceptor({
        interceptor: this.beforeChange,
        args: [active],
        done: function done() {
          _this3.$emit('input', active);

          _this3.$emit('change', active);

          afterChange();
        }
      });
    },
    genTabbar: function genTabbar() {
      var _ref;

      var h = this.$createElement;
      return h("div", {
        "ref": "tabbar",
        "style": {
          zIndex: this.zIndex
        },
        "class": [(_ref = {}, _ref[BORDER_TOP_BOTTOM] = this.border, _ref), bem({
          unfit: !this.fit,
          fixed: this.fixed
        })]
      }, [this.slots()]);
    }
  },
  render: function render() {
    var h = arguments[0];

    if (this.placeholder && this.fixed) {
      return h("div", {
        "class": bem('placeholder'),
        "style": {
          height: this.height + "px"
        }
      }, [this.genTabbar()]);
    }

    return this.genTabbar();
  }
});