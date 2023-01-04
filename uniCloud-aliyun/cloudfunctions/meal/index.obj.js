// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database();
const meal_list = db.collection('shop_meal');
const dbCmd = db.command;
module.exports = {
	_before: function () { // 通用预处理器

	},
	async getMealByShop(id){	//查询店铺所有菜品
		//输入店铺id
		console.log(id,"测试数据111")
		let dbJql = uniCloud.databaseForJQL();
		let shop = await dbJql.collection('shop').where({_id:id})
		.getTemp();
		let testShop = await dbJql.collection('shop').where({
			_id:id
		}).get();
		console.log(testShop.data,"测试数据2")
		let res = await dbJql.collection(shop,'shop_meal').get()
		.catch((err)=>{
			return {
				code:500,
				msg:"获取店铺菜品数据失败",
				data:null
			}
		});
		if(res.data){
			let type_list = await db.collection('meal_type').where({
				"shop_id":id
			}).get().catch((err)=>{
				return {
					code:500,
					msg:"获取菜品分类列表失败",
					data:res.data[0]
				}
			});
			if(type_list.data.length>0){
				return {
					code:200,
					msg:"获取成功,带有分类列表",
					data:{
						meal_data:res.data[0],
						type_data:type_list.data
					}
				}
			}else{
				return {
					code:200,
					msg:"获取成功,没有分类列表",
					data:{
						meal_data:res.data[0],
						type_data:[]
					}
				}
			}
			
			
		}else{
			return {
				code:500,
				msg:"获取店铺菜品数据失败",
				data:null
			}
		}
	},
	async getMealInfo(id){		//获得菜品详细信息
	//输入菜品编号meal_id
		let res = await meal_list.doc(id).get().catch((err)=>{
			return {
				code:500,
				msg:"获取店铺菜品数据失败",
				data:null
			}
		});
		
		if(res.data){
			return {
				code:200,
				msg:"获取成功",
				data:res.data
			}
		}else{
			return {
				code:500,
				msg:"获取店铺菜品数据失败",
				data:null
			}
		}
	},
	async getMealByTypeInShop(id,type){		//通过菜品种类查询菜品
		let res = await meal_list.where({
			meal_forShop:id,
			meal_type:type
		}).get().catch((err)=>{
			return {
				code:500,
				msg:"获取失败",
				data:null
			}
		});
		
		if(res.data){
			return {
				code:200,
				msg:"获取成功",
				data:res.data
			}
		}else{
			return {
				code:500,
				msg:"获取店铺菜品数据失败",
				data:null
			}
		}
	},
	async searchMealInShop(option){
		//传入option 带有店铺id和匹配字段
		// var option = {
		// 	meal_forShop:"店铺id",
		// 	name:"匹配字段"
		// }
		let res = await db.collection('shop_meal')
		.where({
			meal_forShop:option.meal_forShop,
			meal_name:new RegExp(option.name,'g')
		})
		.get()
		.catch((err)=>{
			return {
				code:500,
				msg:"搜索出错了",
				data:null
			}
		})
		return {
			code:200,
			msg:"搜索菜品成功",
			data:res.data
		}
	},
	async searchMeal(option){
		//传入option 带有匹配字段和分页的菜品id
		// var option = {
		// 	name:"匹配字段",
		//	start:0
		// }
		let dbJql = uniCloud.databaseForJQL();
		if(option.start)option._id = dbCmd.lt(option.start);
		let meal_list = await dbJql.collection('shop_meal')
		.where({
			meal_name:new RegExp(option.name,'g')
		})
		.orderBy("_id","desc")
		.limit(6)
		.getTemp()
		let res = await dbJql.collection(meal_list,'shop').get()
		return {
			code:200,
			msg:"搜索菜品成功",
			data:res.data
		}
	}
}
