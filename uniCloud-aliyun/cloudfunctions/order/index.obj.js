const db =uniCloud.database()
const orderCloud = db.collection('order')
const order_detail = db.collection('order_detail')
const voucher_user = db.collection('voucher_user')
const user = db.collection('user')
const voucher = uniCloud.importObject('voucher')
const milk_good = db.collection('milk_good')

module.exports = {
	_before: function () { // 通用预处理器

	},
	async createOrder(orderinfo,goodinfo,voucher_user_id){
		let result = await orderCloud.add({...orderinfo}) 
		
		for(item of goodinfo){
			await order_detail.add({...item})
		
		}
		if(voucher_user_id){
			await voucher.deleteUserVoucher(voucher_user_id,orderinfo.user_id)
		}
		
		return {
			status:200,
			message:'删除成功！'
		}
	},
	//获取用户订单
	async getUserOrder(user_id){
		let result = await order_detail.aggregate().lookup({
			from:'milk_good',
			localField:"good_id",
			foreignField:"_id",
			as:"Detail"
		}).end()
		//订单商品信息
		let goodInfo = result.data
		let order_result = await orderCloud.where({user_id}).get()
		// 用户订单信息
		let user_order = order_result.data
		user_order.forEach(item => {
			item.goodsInfo = []
			for(good of goodInfo){
				if(item.code === good.order_code){
					item.goodsInfo.push(good)
				}
			}
		})
		return user_order
		
	}
}
         