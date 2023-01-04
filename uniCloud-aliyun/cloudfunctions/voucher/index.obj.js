const db = uniCloud.database()
const voucher = db.collection('voucher')
const voucher_user = db.collection('voucher_user')
const user = db.collection('user')

module.exports = {
	_before: function () { // 通用预处理器

	},
	//获取所有优惠券信息
	async getVoucher(){
		let result = await voucher.get()
		return result.data
	},
	//通过优惠券id获取优惠券信息
	async getVoucherById(id){
		let result = await voucher.where({_id:id}).get()
		return result.data[0]
	},
	//用户兑换优惠券
	async addUserVoucher(voucher_id,user_id,newCredit){
		let result = await voucher_user.add({voucher_id,user_id})
		let voucher_user_list = await voucher_user.where({user_id:'o7P6g5LGewjw8ZRewLD9ZraxPX_g'}).get()
		let newCoupon = voucher_user_list.data.length
		await user.where({user_id:user_id}).update({user_credit:newCredit,user_coupon:newCoupon})
		return {
			status:200,
			message:"添加成功！",
			}
	},
	async deleteUserVoucher(id,user_id){
		let result = await voucher_user.where({_id:id}).remove()
		let voucher_user_list = await voucher_user.where({user_id}).get()
		let newCoupon = voucher_user_list.data.length
		await user.where({user_id:user_id}).update({user_coupon:newCoupon})
		return {
			status:200,
			message:"删除成功！"
		}
	},
	async getVoucherByUserId(user_id){
		
		let res = await voucher_user.aggregate().match({user_id}).lookup({
			from:'voucher',
			localField:"voucher_id",
			foreignField:"_id",
			as:"VoucherDetail"
		}).end()
		
		return res.data
	},
	async test(){
		let result = await voucher_user.where({user_id:'o7P6g5LGewjw8ZRewLD9ZraxPX_g'}).get()
		return result.data
	}
	
}
