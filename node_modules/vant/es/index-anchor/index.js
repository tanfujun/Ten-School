import { createNamespace } from '../utils';
import { ChildrenMixin } from '../mixins/relation';
import { BORDER_BOTTOM } from '../utils/constant';
import { getScrollTop, getRootScrollTop } from '../utils/dom/scroll';

var _createNamespace = createNamespace('index-anchor'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  mixins: [ChildrenMixin('vanIndexBar', {
    indexKey: 'childrenIndex'
  })],
  props: {
    index: [Number, String]
  },
  data: function data() {
    return {
      top: 0,
      left: null,
      rect: {
        top: 0,
        height: 0
      },
      width: null,
      active: false
    };
  },
  computed: {
    sticky: function sticky() {
      return this.active && this.parent.sticky;
    },
    anchorStyle: function anchorStyle() {
      if (this.sticky) {
        return {
          zIndex: "" + this.parent.zIndex,
          left: this.left ? this.left + "px" : null,
          width: this.width ? this.width + "px" : null,
          transform: "translate3d(0, " + this.top + "px, 0)",
          color: this.parent.highlightColor
        };
      }
    }
  },
  mounted: function mounted() {
    var rect = this.$el.getBoundingClientRect();
    this.rect.height = rect.height;
  },
  methods: {
    scrollIntoView: function scrollIntoView() {
      this.$el.scrollIntoView();
    },
    getRect: function getRect(scroller, scrollerRect) {
      var el = this.$el;
      var elRect = el.getBoundingClientRect();
      this.rect.height = elRect.height;

      if (scroller === window || scroller === document.body) {
        this.rect.top = elRect.top + getRootScrollTop();
      } else {
        this.rect.top = elRect.top + getScrollTop(scroller) - scrollerRect.top;
      }

      return this.rect;
    }
  },
  render: function render() {
    var _ref;

    var h = arguments[0];
    var sticky = this.sticky;
    return h("div", {
      "style": {
        height: sticky ? this.rect.height + "px" : null
      }
    }, [h("div", {
      "style": this.anchorStyle,
      "class": [bem({
        sticky: sticky
      }), (_ref = {}, _ref[BORDER_BOTTOM] = sticky, _ref)]
    }, [this.slots('default') || this.index])]);
  }
});