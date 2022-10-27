import _extends from "@babel/runtime/helpers/esm/extends";
import _mergeJSXProps from "@vue/babel-helper-vue-jsx-merge-props";
import Vue from 'vue'; // Utils

import { createNamespace } from '../utils';
import { emit, inherit } from '../utils/functional'; // Mixins

import { popupMixinProps } from '../mixins/popup'; // Components

import Icon from '../icon';
import Popup from '../popup';
import Loading from '../loading'; // Types

var _createNamespace = createNamespace('action-sheet'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

function ActionSheet(h, props, slots, ctx) {
  var title = props.title,
      cancelText = props.cancelText,
      closeable = props.closeable;

  function onCancel() {
    emit(ctx, 'input', false);
    emit(ctx, 'cancel');
  }

  function Header() {
    if (title) {
      return h("div", {
        "class": bem('header')
      }, [title, closeable && h(Icon, {
        "attrs": {
          "name": props.closeIcon
        },
        "class": bem('close'),
        "on": {
          "click": onCancel
        }
      })]);
    }
  }

  function Option(item, index) {
    var disabled = item.disabled,
        loading = item.loading,
        callback = item.callback;

    function onClickOption(event) {
      event.stopPropagation();

      if (disabled || loading) {
        return;
      }

      if (callback) {
        callback(item);
      }

      if (props.closeOnClickAction) {
        emit(ctx, 'input', false);
      }

      Vue.nextTick(function () {
        emit(ctx, 'select', item, index);
      });
    }

    function OptionContent() {
      if (loading) {
        return h(Loading, {
          "class": bem('loading-icon')
        });
      }

      return [h("span", {
        "class": bem('name')
      }, [item.name]), item.subname && h("div", {
        "class": bem('subname')
      }, [item.subname])];
    }

    return h("button", {
      "attrs": {
        "type": "button"
      },
      "class": [bem('item', {
        disabled: disabled,
        loading: loading
      }), item.className],
      "style": {
        color: item.color
      },
      "on": {
        "click": onClickOption
      }
    }, [OptionContent()]);
  }

  function CancelText() {
    if (cancelText) {
      return [h("div", {
        "class": bem('gap')
      }), h("button", {
        "attrs": {
          "type": "button"
        },
        "class": bem('cancel'),
        "on": {
          "click": onCancel
        }
      }, [cancelText])];
    }
  }

  function Description() {
    var description = (slots.description == null ? void 0 : slots.description()) || props.description;

    if (description) {
      return h("div", {
        "class": bem('description')
      }, [description]);
    }
  }

  return h(Popup, _mergeJSXProps([{
    "class": bem(),
    "attrs": {
      "position": "bottom",
      "round": props.round,
      "value": props.value,
      "overlay": props.overlay,
      "duration": props.duration,
      "lazyRender": props.lazyRender,
      "lockScroll": props.lockScroll,
      "getContainer": props.getContainer,
      "closeOnPopstate": props.closeOnPopstate,
      "closeOnClickOverlay": props.closeOnClickOverlay,
      "safeAreaInsetBottom": props.safeAreaInsetBottom
    }
  }, inherit(ctx, true)]), [Header(), Description(), h("div", {
    "class": bem('content')
  }, [props.actions && props.actions.map(Option), slots.default == null ? void 0 : slots.default()]), CancelText()]);
}

ActionSheet.props = _extends({}, popupMixinProps, {
  title: String,
  actions: Array,
  duration: [Number, String],
  cancelText: String,
  description: String,
  getContainer: [String, Function],
  closeOnPopstate: Boolean,
  closeOnClickAction: Boolean,
  round: {
    type: Boolean,
    default: true
  },
  closeable: {
    type: Boolean,
    default: true
  },
  closeIcon: {
    type: String,
    default: 'cross'
  },
  safeAreaInsetBottom: {
    type: Boolean,
    default: true
  },
  overlay: {
    type: Boolean,
    default: true
  },
  closeOnClickOverlay: {
    type: Boolean,
    default: true
  }
});
export default createComponent(ActionSheet);