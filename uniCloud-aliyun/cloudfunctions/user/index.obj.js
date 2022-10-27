// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database()


module.exports = {
	_before: function() { // 通用预处理器

	},
	// *
	//  * method1方法描述
	//  * @param {string} param1 参数1描述
	//  * @returns {object} 返回值描述


	//用用户的code获取小程序用户openid并且在服务端查询是否有该用户，无则注册用户并初始化用户信息
	async getOpenid(code, userinfo) {
		let url =
			`https://api.weixin.qq.com/sns/jscode2session?appid=wx30dae6d4ee747155&secret=1c4c0e31ea6c876a1a3bdbcae5a6c158&js_code=${code}&grant_type=authorization_code`
		const res = await uniCloud.httpclient.request(url, {
			method: "GET",
			dataType: "json"
		})

		if (res.status === 200) {
			let openid = res.data.openid
			const user = await db.collection('user').where({
				user_id: openid
			}).get()
			if (user.data.length === 1) {
				return {
					status: 200,
					openid
				}
			} else {
				let result = await db.collection("user").add({
					user_id: openid,
					user_name: userinfo.user_name,
					user_avatar: userinfo.user_avatar,
					user_credit: 500,
					user_coupon: 0,
					user_wallet: 24
				})
				return {
					status: 200,
					openid
				}
			}
		} else {
			return {
				error: "falied"
			}
		}

	},
	//通过openid获取用户所有信息
	async getUserInfo(openid) {

		const user = await db.collection('user').where({
			user_id: openid
		}).get()
		return {
			status: 200,
			user
		}
	},
}
