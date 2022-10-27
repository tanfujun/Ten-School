import _extends from "@babel/runtime/helpers/esm/extends";
import _mergeJSXProps from "@vue/babel-helper-vue-jsx-merge-props";
// Utils
import { createNamespace } from '../utils';
import { emit, inherit } from '../utils/functional';
import { BORDER_SURROUND } from '../utils/constant';
import { routeProps, functionalRoute } from '../utils/router'; // Components

import Icon from '../icon';
import Loading from '../loading'; // Types

var _createNamespace = createNamespace('button'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

function Button(h, props, slots, ctx) {
  var _ref;

  var tag = props.tag,
      icon = props.icon,
      type = props.type,
      color = props.color,
      plain = props.plain,
      disabled = props.disabled,
      loading = props.loading,
      hairline = props.hairline,
      loadingText = props.loadingText,
      iconPosition = props.iconPosition;
  var style = {};

  if (color) {
    style.color = plain ? color : 'white';

    if (!plain) {
      // Use background instead of backgroundColor to make linear-gradient work
      style.background = color;
    } // hide border when color is linear-gradient


    if (color.indexOf('gradient') !== -1) {
      style.border = 0;
    } else {
      style.borderColor = color;
    }
  }

  function onClick(event) {
    if (props.loading) {
      event.preventDefault();
    }

    if (!loading && !disabled) {
      emit(ctx, 'click', event);
      functionalRoute(ctx);
    }
  }

  function onTouchstart(event) {
    emit(ctx, 'touchstart', event);
  }

  var classes = [bem([type, props.size, {
    plain: plain,
    loading: loading,
    disabled: disabled,
    hairline: hairline,
    block: props.block,
    round: props.round,
    square: props.square
  }]), (_ref = {}, _ref[BORDER_SURROUND] = hairline, _ref)];

  function renderIcon() {
    if (loading) {
      return slots.loading ? slots.loading() : h(Loading, {
        "class": bem('loading'),
        "attrs": {
          "size": props.loadingSize,
          "type": props.loadingType,
          "color": "currentColor"
        }
      });
    }

    if (slots.icon) {
      return h("div", {
        "class": bem('icon')
      }, [slots.icon()]);
    }

    if (icon) {
      return h(Icon, {
        "attrs": {
          "name": icon,
          "classPrefix": props.iconPrefix
        },
        "class": bem('icon')
      });
    }
  }

  function renderContent() {
    var content = [];

    if (iconPosition === 'left') {
      content.push(renderIcon());
    }

    var text;

    if (loading) {
      text = loadingText;
    } else {
      text = slots.default ? slots.default() : props.text;
    }

    if (text) {
      content.push(h("span", {
        "class": bem('text')
      }, [text]));
    }

    if (iconPosition === 'right') {
      content.push(renderIcon());
    }

    return content;
  }

  return h(tag, _mergeJSXProps([{
    "style": style,
    "class": classes,
    "attrs": {
      "type": props.nativeType,
      "disabled": disabled
    },
    "on": {
      "click": onClick,
      "touchstart": onTouchstart
    }
  }, inherit(ctx)]), [h("div", {
    "class": bem('content')
  }, [renderContent()])]);
}

Button.props = _extends({}, routeProps, {
  text: String,
  icon: String,
  color: String,
  block: Boolean,
  plain: Boolean,
  round: Boolean,
  square: Boolean,
  loading: Boolean,
  hairline: Boolean,
  disabled: Boolean,
  iconPrefix: String,
  nativeType: String,
  loadingText: String,
  loadingType: String,
  tag: {
    type: String,
    default: 'button'
  },
  type: {
    type: String,
    default: 'default'
  },
  size: {
    type: String,
    default: 'normal'
  },
  loadingSize: {
    type: String,
    default: '20px'
  },
  iconPosition: {
    type: String,
    default: 'left'
  }
});
export default createComponent(Button);