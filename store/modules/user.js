import userApi from '../../api/modules/user.js'
const user = uniCloud.importObject('user')
const state = {
	openid: uni.getStorageInfoSync('openid'),
	userinfo: {
		user_name: '',
		user_avatar: '',
		user_credit: '',
		user_wallet: '',
		user_coupon: '',
		user_phone:''
	},
	address:{
		
	},
	isLogin:false,
}
const mutations = {
	SET_OPENID(state, openid) {
		state.openid = openid
	},
	LOGIN(state,login){
		state.isLogin = login
	},
	LOGOUT(state){
		state.isLogin = false
	},
	SET_ADDRESS(state,address){
		state.address = address
		console.log(state.address);
		// state.takein = false
	},

	SET_USERINFO(state, userinfo) {
		console.log(userinfo);
		const {
			user_name,
			user_avatar,
			user_credit,
			user_wallet,
			user_coupon,
			user_phone
		} = userinfo
		state.userinfo = {
			user_name,
			user_avatar,
			user_credit,
			user_wallet,
			user_coupon,
			user_phone
		}

	},
	RESET_USERINFO(state) {
		state.userinfo = {
			user_name: '',
			user_avatar: '',
			user_credit: '',
			user_wallet: '',
			user_coupon: '',
			user_phone:''
		}
	}

}

const actions = {
	//登录并初始化openid
	async login(context,login) {
		let data = await uni.login()
		let code = data[1].code
		
		//初始化用户 以用户openid为唯一标识
		let openid = ''
		let res = await user.getOpenid(code)
		if(res.status===200){
			openid=res.openid
			uni.setStorageSync('openid', openid)
			context.commit('SET_OPENID', openid)
			context.dispatch('getUserInfo', openid)
			context.commit('LOGIN',login)
		}
	},
	//通过openid获取用户其他信息
	async getUserInfo({
		state,
		commit
	}, openid) {
		// console.log("state.openid:", state.openid, "openid:", openid);
		let result = await user.getUserInfo(state.openid?state.openid:openid)
		if(result.status==200){
			let userinfo = result.user.data[0]
			// console.log(userinfo);
			commit('SET_USERINFO', userinfo)
		}
	},
	logout({commit}){
		commit('RESET_USERINFO')
		uni.removeStorageSync('openid')
		commit('LOGOUT')
	}


}

export default {
	state,
	mutations,
	actions
}
