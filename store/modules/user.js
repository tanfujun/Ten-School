import userApi from '../../api/modules/user.js'
const user = uniCloud.importObject('user')

const state = {
	openid: uni.getStorageSync('openid'),
	userinfo: {
		user_name: '',
		user_avatar: '',
		user_credit: '',
		user_wallet: '',
		user_coupon: ''
	},
	address:{},
	takein:true
}

const mutations = {
	SET_OPENID(state, openid) {
		state.openid = openid
	},
	SET_ADDRESS(state,address){
		state.address = address
		state.takein = false
	},
	SET_TAKEIN(state,type){
		state.takein = type
	},
	SET_USERINFO(state, userinfo) {
		console.log(userinfo);
		const {
			user_name,
			user_avatar,
			user_credit,
			user_wallet,
			user_coupon
		} = userinfo
		state.userinfo = {
			user_name,
			user_avatar,
			user_credit,
			user_wallet,
			user_coupon
		}

	},
	RESET_USERINFO(state) {
		state.userinfo = {
			user_name: '',
			user_avatar: '',
			user_credit: '',
			user_wallet: '',
			user_coupon: ''
		}
	}

}

const actions = {
	//登录并初始化openid
	async login(context, {
		name,
		avatar
	}) {
		let data = await uni.login()
		let code = data[1].code
		
		//初始化用户 以用户openid为唯一标识
		let openid = ''
		let res = await user.getOpenid(code,{user_name:name,user_avatar:avatar})
		if(res.status===200){
			openid=res.openid
			uni.setStorageSync('openid', openid)
			context.commit('SET_OPENID', openid)
			context.dispatch('getUserInfo', openid)
		}
	},
	//获取用户头像与昵称
	async getUserProfile({
		commit,
		state,
		dispatch
	}) {
		uni.getUserProfile({
			desc: "获取用户信息",
			success: (result) => {
				let avatar = result.userInfo.avatarUrl
				let name = result.userInfo.nickName
				dispatch('login', {
					name,
					avatar
				})
			}
		})
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
	}


}

export default {
	state,
	mutations,
	actions
}
