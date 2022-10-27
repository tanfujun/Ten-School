// Utils
import { createNamespace, isDef, addUnit } from '../utils';
import { scrollLeftTo, scrollTopTo } from './utils';
import { route } from '../utils/router';
import { isHidden } from '../utils/dom/style';
import { on, off } from '../utils/dom/event';
import { unitToPx } from '../utils/format/unit';
import { BORDER_TOP_BOTTOM } from '../utils/constant';
import { callInterceptor } from '../utils/interceptor';
import { getScroller, getVisibleTop, getElementTop, getVisibleHeight, setRootScrollTop } from '../utils/dom/scroll'; // Mixins

import { ParentMixin } from '../mixins/relation';
import { BindEventMixin } from '../mixins/bind-event'; // Components

import Title from './Title';
import Sticky from '../sticky';
import Content from './Content';

var _createNamespace = createNamespace('tabs'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  mixins: [ParentMixin('vanTabs'), BindEventMixin(function (bind) {
    if (!this.scroller) {
      this.scroller = getScroller(this.$el);
    }

    bind(window, 'resize', this.resize, true);

    if (this.scrollspy) {
      bind(this.scroller, 'scroll', this.onScroll, true);
    }
  })],
  inject: {
    vanPopup: {
      default: null
    }
  },
  model: {
    prop: 'active'
  },
  props: {
    color: String,
    border: Boolean,
    sticky: Boolean,
    animated: Boolean,
    swipeable: Boolean,
    scrollspy: Boolean,
    background: String,
    lineWidth: [Number, String],
    lineHeight: [Number, String],
    beforeChange: Function,
    titleActiveColor: String,
    titleInactiveColor: String,
    type: {
      type: String,
      default: 'line'
    },
    active: {
      type: [Number, String],
      default: 0
    },
    ellipsis: {
      type: Boolean,
      default: true
    },
    duration: {
      type: [Number, String],
      default: 0.3
    },
    offsetTop: {
      type: [Number, String],
      default: 0
    },
    lazyRender: {
      type: Boolean,
      default: true
    },
    swipeThreshold: {
      type: [Number, String],
      default: 5
    }
  },
  data: function data() {
    return {
      position: '',
      currentIndex: null,
      lineStyle: {
        backgroundColor: this.color
      }
    };
  },
  computed: {
    // whether the nav is scrollable
    scrollable: function scrollable() {
      return this.children.length > this.swipeThreshold || !this.ellipsis;
    },
    navStyle: function navStyle() {
      return {
        borderColor: this.color,
        background: this.background
      };
    },
    currentName: function currentName() {
      var activeTab = this.children[this.currentIndex];

      if (activeTab) {
        return activeTab.computedName;
      }
    },
    offsetTopPx: function offsetTopPx() {
      return unitToPx(this.offsetTop);
    },
    scrollOffset: function scrollOffset() {
      if (this.sticky) {
        return this.offsetTopPx + this.tabHeight;
      }

      return 0;
    }
  },
  watch: {
    color: 'setLine',
    active: function active(name) {
      if (name !== this.currentName) {
        this.setCurrentIndexByName(name);
      }
    },
    children: function children() {
      var _this = this;

      this.setCurrentIndexByName(this.active);
      this.setLine();
      this.$nextTick(function () {
        _this.scrollIntoView(true);
      });
    },
    currentIndex: function currentIndex() {
      this.scrollIntoView();
      this.setLine(); // scroll to correct position

      if (this.stickyFixed && !this.scrollspy) {
        setRootScrollTop(Math.ceil(getElementTop(this.$el) - this.offsetTopPx));
      }
    },
    scrollspy: function scrollspy(val) {
      if (val) {
        on(this.scroller, 'scroll', this.onScroll, true);
      } else {
        off(this.scroller, 'scroll', this.onScroll);
      }
    }
  },
  mounted: function mounted() {
    var _this2 = this;

    this.init(); // https://github.com/vant-ui/vant/issues/7959

    if (this.vanPopup) {
      this.vanPopup.onReopen(function () {
        _this2.setLine();
      });
    }
  },
  activated: function activated() {
    this.init();
    this.setLine();
  },
  methods: {
    // @exposed-api
    resize: function resize() {
      this.setLine();
    },
    init: function init() {
      var _this3 = this;

      this.$nextTick(function () {
        _this3.inited = true;
        _this3.tabHeight = getVisibleHeight(_this3.$refs.wrap);

        _this3.scrollIntoView(true);
      });
    },
    // update nav bar style
    setLine: function setLine() {
      var _this4 = this;

      var shouldAnimate = this.inited;
      this.$nextTick(function () {
        var titles = _this4.$refs.titles;

        if (!titles || !titles[_this4.currentIndex] || _this4.type !== 'line' || isHidden(_this4.$el)) {
          return;
        }

        var title = titles[_this4.currentIndex].$el;
        var lineWidth = _this4.lineWidth,
            lineHeight = _this4.lineHeight;
        var left = title.offsetLeft + title.offsetWidth / 2;
        var lineStyle = {
          width: addUnit(lineWidth),
          backgroundColor: _this4.color,
          transform: "translateX(" + left + "px) translateX(-50%)"
        };

        if (shouldAnimate) {
          lineStyle.transitionDuration = _this4.duration + "s";
        }

        if (isDef(lineHeight)) {
          var height = addUnit(lineHeight);
          lineStyle.height = height;
          lineStyle.borderRadius = height;
        }

        _this4.lineStyle = lineStyle;
      });
    },
    // correct the index of active tab
    setCurrentIndexByName: function setCurrentIndexByName(name) {
      var matched = this.children.filter(function (tab) {
        return tab.computedName === name;
      });
      var defaultIndex = (this.children[0] || {}).index || 0;
      this.setCurrentIndex(matched.length ? matched[0].index : defaultIndex);
    },
    setCurrentIndex: function setCurrentIndex(currentIndex) {
      var newIndex = this.findAvailableTab(currentIndex);

      if (!isDef(newIndex)) {
        return;
      }

      var newTab = this.children[newIndex];
      var newName = newTab.computedName;
      var shouldEmitChange = this.currentIndex !== null;
      this.currentIndex = newIndex;

      if (newName !== this.active) {
        this.$emit('input', newName);

        if (shouldEmitChange) {
          this.$emit('change', newName, newTab.title);
        }
      }
    },
    findAvailableTab: function findAvailableTab(index) {
      var diff = index < this.currentIndex ? -1 : 1;

      while (index >= 0 && index < this.children.length) {
        if (!this.children[index].disabled) {
          return index;
        }

        index += diff;
      }
    },
    // emit event when clicked
    onClick: function onClick(item, index) {
      var _this5 = this;

      var _this$children$index = this.children[index],
          title = _this$children$index.title,
          disabled = _this$children$index.disabled,
          computedName = _this$children$index.computedName;

      if (disabled) {
        this.$emit('disabled', computedName, title);
      } else {
        callInterceptor({
          interceptor: this.beforeChange,
          args: [computedName],
          done: function done() {
            _this5.setCurrentIndex(index);

            _this5.scrollToCurrentContent();
          }
        });
        this.$emit('click', computedName, title);
        route(item.$router, item);
      }
    },
    // scroll active tab into view
    scrollIntoView: function scrollIntoView(immediate) {
      var titles = this.$refs.titles;

      if (!this.scrollable || !titles || !titles[this.currentIndex]) {
        return;
      }

      var nav = this.$refs.nav;
      var title = titles[this.currentIndex].$el;
      var to = title.offsetLeft - (nav.offsetWidth - title.offsetWidth) / 2;
      scrollLeftTo(nav, to, immediate ? 0 : +this.duration);
    },
    onSticktScroll: function onSticktScroll(params) {
      this.stickyFixed = params.isFixed;
      this.$emit('scroll', params);
    },
    // @exposed-api
    scrollTo: function scrollTo(name) {
      var _this6 = this;

      this.$nextTick(function () {
        _this6.setCurrentIndexByName(name);

        _this6.scrollToCurrentContent(true);
      });
    },
    scrollToCurrentContent: function scrollToCurrentContent(immediate) {
      var _this7 = this;

      if (immediate === void 0) {
        immediate = false;
      }

      if (this.scrollspy) {
        var target = this.children[this.currentIndex];
        var el = target == null ? void 0 : target.$el;

        if (el) {
          var to = getElementTop(el, this.scroller) - this.scrollOffset;
          this.lockScroll = true;
          scrollTopTo(this.scroller, to, immediate ? 0 : +this.duration, function () {
            _this7.lockScroll = false;
          });
        }
      }
    },
    onScroll: function onScroll() {
      if (this.scrollspy && !this.lockScroll) {
        var index = this.getCurrentIndexOnScroll();
        this.setCurrentIndex(index);
      }
    },
    getCurrentIndexOnScroll: function getCurrentIndexOnScroll() {
      var children = this.children;

      for (var index = 0; index < children.length; index++) {
        var top = getVisibleTop(children[index].$el);

        if (top > this.scrollOffset) {
          return index === 0 ? 0 : index - 1;
        }
      }

      return children.length - 1;
    }
  },
  render: function render() {
    var _this8 = this,
        _ref;

    var h = arguments[0];
    var type = this.type,
        animated = this.animated,
        scrollable = this.scrollable;
    var Nav = this.children.map(function (item, index) {
      var _item$badge;

      return h(Title, {
        "ref": "titles",
        "refInFor": true,
        "attrs": {
          "type": type,
          "dot": item.dot,
          "info": (_item$badge = item.badge) != null ? _item$badge : item.info,
          "title": item.title,
          "color": _this8.color,
          "isActive": index === _this8.currentIndex,
          "disabled": item.disabled,
          "scrollable": scrollable,
          "activeColor": _this8.titleActiveColor,
          "inactiveColor": _this8.titleInactiveColor
        },
        "style": item.titleStyle,
        "class": item.titleClass,
        "scopedSlots": {
          default: function _default() {
            return item.slots('title');
          }
        },
        "on": {
          "click": function click() {
            _this8.onClick(item, index);
          }
        }
      });
    });
    var Wrap = h("div", {
      "ref": "wrap",
      "class": [bem('wrap', {
        scrollable: scrollable
      }), (_ref = {}, _ref[BORDER_TOP_BOTTOM] = type === 'line' && this.border, _ref)]
    }, [h("div", {
      "ref": "nav",
      "attrs": {
        "role": "tablist"
      },
      "class": bem('nav', [type, {
        complete: this.scrollable
      }]),
      "style": this.navStyle
    }, [this.slots('nav-left'), Nav, type === 'line' && h("div", {
      "class": bem('line'),
      "style": this.lineStyle
    }), this.slots('nav-right')])]);
    return h("div", {
      "class": bem([type])
    }, [this.sticky ? h(Sticky, {
      "attrs": {
        "container": this.$el,
        "offsetTop": this.offsetTop
      },
      "on": {
        "scroll": this.onSticktScroll
      }
    }, [Wrap]) : Wrap, h(Content, {
      "attrs": {
        "count": this.children.length,
        "animated": animated,
        "duration": this.duration,
        "swipeable": this.swipeable,
        "currentIndex": this.currentIndex
      },
      "on": {
        "change": this.setCurrentIndex
      }
    }, [this.slots()])]);
  }
});