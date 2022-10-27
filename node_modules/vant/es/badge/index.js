import { isDef, createNamespace } from '../utils';
import { isNumeric } from '../utils/validate/number';

var _createNamespace = createNamespace('badge'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
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
      return !!(this.$scopedSlots.content || isDef(this.content) && this.content !== '');
    },
    renderContent: function renderContent() {
      var dot = this.dot,
          max = this.max,
          content = this.content;

      if (!dot && this.hasContent()) {
        if (this.$scopedSlots.content) {
          return this.$scopedSlots.content();
        }

        if (isDef(max) && isNumeric(content) && +content > max) {
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