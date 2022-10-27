
const db = uniCloud.database()

module.exports = {
	_before: function () { // 通用预处理器

	},
	
	async getCategory(){
		const milk_good = db.collection('milk_good')
		const milk_category = db.collection('milk_category')
		let res = await milk_category.aggregate().lookup({
			from:'milk_good',
			localField:"_id",
			foreignField:"category_id",
			as:"product"
		}).end()
		return res.data
	},
	async getDetail(id){
		const milk_good = await db.collection('milk_good').where({_id:id}).get()
		return milk_good.data[0]
	}

}
