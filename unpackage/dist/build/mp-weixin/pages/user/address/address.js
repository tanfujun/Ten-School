(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/user/address/address"],{"0ea3":function(t,e,n){},"1ffc":function(t,e,n){},2107:function(t,e,n){"use strict";n.r(e);var r=n("6dca"),a=n("ca9b");for(var u in a)"default"!==u&&function(t){n.d(e,t,(function(){return a[t]}))}(u);n("b470"),n("4f68");var s,c=n("f0c5"),o=Object(c["a"])(a["default"],r["b"],r["c"],!1,null,"4a16ff92",null,!1,r["a"],s);e["default"]=o.exports},"4f68":function(t,e,n){"use strict";var r=n("0ea3"),a=n.n(r);a.a},"6dca":function(t,e,n){"use strict";var r;n.d(e,"b",(function(){return a})),n.d(e,"c",(function(){return u})),n.d(e,"a",(function(){return r}));var a=function(){var t=this,e=t.$createElement;t._self._c},u=[]},"79a5":function(t,e,n){"use strict";(function(t){n("1aaf"),n("a9ff");r(n("66fd"));var e=r(n("2107"));function r(t){return t&&t.__esModule?t:{default:t}}wx.__webpack_require_UNI_MP_PLUGIN__=n,t(e.default)}).call(this,n("543d")["createPage"])},b470:function(t,e,n){"use strict";var r=n("1ffc"),a=n.n(r);a.a},c7f7:function(t,e,n){"use strict";(function(t,r){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=u(n("a34a"));function u(t){return t&&t.__esModule?t:{default:t}}function s(t,e,n,r,a,u,s){try{var c=t[u](s),o=c.value}catch(d){return void n(d)}c.done?e(o):Promise.resolve(o).then(r,a)}function c(t){return function(){var e=this,n=arguments;return new Promise((function(r,a){var u=t.apply(e,n);function c(t){s(u,r,a,c,o,"next",t)}function o(t){s(u,r,a,c,o,"throw",t)}c(void 0)}))}}var o=t.importObject("address"),d={data:function(){return{addressList:[]}},methods:{getAddress:function(){var t=this;return c(a.default.mark((function e(){var n,u,s,c;return a.default.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n=r.getStorageSync("openid"),e.next=3,o.getUserAddress(n);case 3:u=e.sent,s=u.findIndex((function(t){return 1===t.isdefault})),-1!==s&&(c=u[0],u[0]=u[s],u[s]=c),t.addressList=u;case 7:case"end":return e.stop()}}),e)})))()},gotoAdd:function(){r.navigateTo({url:"/pages/user/add/add"})},updateAddress:function(t){r.navigateTo({url:"/pages/user/add/add?address_id=".concat(t)})},deleteAddress:function(t){var e=this;return c(a.default.mark((function n(){var u;return a.default.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,o.deleteAddress(t);case 2:u=n.sent,200===u.status?(r.showToast({title:"删除成功！"}),setTimeout((function(){e.getAddress()}),1e3)):r.showToast({title:"删除失败！",icon:"error"});case 4:case"end":return n.stop()}}),n)})))()},choose:function(t){this.$store.commit("SET_ADDRESS",t),r.switchTab({url:"/pages/purchase/purchase"})}},onLoad:function(){this.getAddress()}};e.default=d}).call(this,n("a9ff")["default"],n("543d")["default"])},ca9b:function(t,e,n){"use strict";n.r(e);var r=n("c7f7"),a=n.n(r);for(var u in r)"default"!==u&&function(t){n.d(e,t,(function(){return r[t]}))}(u);e["default"]=a.a}},[["79a5","common/runtime","common/vendor"]]]);