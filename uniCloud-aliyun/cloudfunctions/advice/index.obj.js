const db = uniCloud.database()
const advice = db.collection('advice')

module.exports = {
	_before: function () { // 通用预处理器

	},
	async addAdvice(info){
		let result = await advice.add({...info})
		return {status:200,message:'添加成功！'}
	}
	
}
