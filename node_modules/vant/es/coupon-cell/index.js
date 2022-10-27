import _mergeJSXProps from "@vue/babel-helper-vue-jsx-merge-props";
// Utils
import { createNamespace, isDef } from '../utils';
import { inherit } from '../utils/functional'; // Components

import Cell from '../cell'; // Types

var _createNamespace = createNamespace('coupon-cell'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1],
    t = _createNamespace[2];

function formatValue(props) {
  var coupons = props.coupons,
      chosenCoupon = props.chosenCoupon,
      currency = props.currency;
  var coupon = coupons[+chosenCoupon];

  if (coupon) {
    var value = 0;

    if (isDef(coupon.value)) {
      value = coupon.value;
    } else if (isDef(coupon.denominations)) {
      value = coupon.denominations;
    }

    return "-" + currency + " " + (value / 100).toFixed(2);
  }

  return coupons.length === 0 ? t('tips') : t('count', coupons.length);
}

function CouponCell(h, props, slots, ctx) {
  var selected = props.coupons[+props.chosenCoupon];
  var value = formatValue(props);
  return h(Cell, _mergeJSXProps([{
    "class": bem(),
    "attrs": {
      "value": value,
      "title": props.title || t('title'),
      "border": props.border,
      "isLink": props.editable,
      "valueClass": bem('value', {
        selected: selected
      })
    }
  }, inherit(ctx, true)]));
}

CouponCell.model = {
  prop: 'chosenCoupon'
};
CouponCell.props = {
  title: String,
  coupons: {
    type: Array,
    default: function _default() {
      return [];
    }
  },
  currency: {
    type: String,
    default: '¥'
  },
  border: {
    type: Boolean,
    default: true
  },
  editable: {
    type: Boolean,
    default: true
  },
  chosenCoupon: {
    type: [Number, String],
    default: -1
  }
};
export default createComponent(CouponCell);