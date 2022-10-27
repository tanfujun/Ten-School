const db = uniCloud.database()


module.exports = {
	_before: function () { // 通用预处理器

	},
	//通过openid获取用户的地址
	async getUserAddress(id){
		const address = await db.collection('address').where({user_id:id}).get()
		return address.data
	},
	async getAddress(id){
		const address = await db.collection('address').where({_id:id}).get()
		return address.data
	},
	async updateAddress(address,id){
		const addressTable = db.collection('address')
		let result = await addressTable.get()
		let allAddress = result.data
		//如果更新的数据中地址设为默认地址，则将以前设为默认地址的数据取消默认
		if(address.isdefault ===1){
			let index = allAddress.findIndex(item => item.isdefault === 1)
			if(index != -1){
				let address_id = allAddress[index]._id
				allAddress[index].isdefault = 0
				delete allAddress[index]._id
				await addressTable.where({_id:address_id}).update({...allAddress[index]})
			}
			
		}
		if(id){
			await addressTable.where({_id:id}).update({
				...address
			})
			return {
				status:200,
				message:"添加成功！"
			}
		}else{
			await addressTable.add({
				...address
			})
			return {
				status:200,
				message:"添加成功！"
			}
		}
	},
	
	async deleteAddress(id){
		
		const result = await db.collection('address').where({_id:id}).remove()
		if(result.deleted === 1){
			return {
				status:200,
				message:"删除成功！"
			}
		}else{
			return {
				status:500,
				message:"删除失败！"
			}
		}
		
	},
	
	async test(){
		const addressTable = db.collection('address')
		let result = addressTable.get()
		let allAddress = result.data
		return allAddress
	}
}
