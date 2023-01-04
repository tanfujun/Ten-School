import Vue from 'vue'
import Vuex from 'vuex'


import user from './modules/user.js'
import order from './modules/order.js'
import getters from './getters.js'
import shop from './modules/shop.js'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		user,order,shop
	},
	getters
})
