const {baseUrl} = require('../cite')


//通过code获取用户的openid，并在服务器端用openid初始化用户信息（仅在第一次登录时初始化）
module.exports = { 
	getOpenid(code,name,avatar){
		return uni.request({
		url:baseUrl+'/getOpenid',
		data:{
			code,
			name,
			avatar
		},
		method:'GET',
	})
},
	getUserInfo(openid){
		return uni.request({
			url:baseUrl+`/getUserInfo?openid=${openid}`,
			method:'GET'
		})
	}

}