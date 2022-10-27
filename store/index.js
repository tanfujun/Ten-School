import Vue from 'vue'
import Vuex from 'vuex'


import user from './modules/user.js'
import getters from './getters.js'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		user
	},
	getters
})
