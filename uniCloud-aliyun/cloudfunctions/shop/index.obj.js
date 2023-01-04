// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129

const db = uniCloud.database()
// 连接数据库
const shop_list = db.collection('shop');
module.exports = {
	_before: function () { // 通用预处理器

	},
	async getAllShop(){		//获取所有店铺
		let res = await db.collection('shop').get().catch((err)=>{
			return {
				code:500,
				msg:"查询失败",
				data:null
			}
		});
		return {
			code:200,
			msg:"查询成功",
			data:res.data
		}
	},
	async getShopByLoc(shop_loc){	//通过所属区域查找店铺
	//输入店铺所属区域shop_loc
		let res = await shop_list.where({
			shop_loc:shop_loc
		}).get().catch((err)=>{
			return {
				code:500,
				msg:"所属区域内店铺查询失败",
				data:null
			}
		});
		return {
			code:200,
			msg:"查询所属区域内店铺列表成功",
			data:res.data
		}
	},
	async getShopByType(shop_type){	//通过店铺种类查找店铺
	//输入店铺种类shop_type
		let res = await shop_list.where({
			shop_type:shop_type
		}).get().catch((err)=>{
			return {
				code:500,
				msg:"根据店铺种类查询店铺列表失败",
				data:null
			}
		});
		return {
			code:200,
			msg:"根据种类查询店铺列表成功",
			data:res.data
		}

	},
	async getShopComment(id){		//获取店铺评价
	let dbJql = uniCloud.databaseForJQL();
		let shop_comment = await dbJql.collection('shop_comment').where({
			comment_forShop:id
		}).getTemp();
		let res = await dbJql.collection(shop_comment,'user')
		.get().catch((err)=>{
			return {
				code:500,
				msg:"获取评论失败",
				data:null
			}
		})
		return {
			code:200,
			msg:"查询店铺评论列表成功",
			data:res.data
		}

	},
	async addShopComment(comment){	//增加店铺评论
	/*
	comment是一个json {}
	var date = new Date();
	var nowTime = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+(date.getDate()-1)+' '+date.getHours()+':'+date.getMinutes();
	var comment ={
		comment_forShop:"店铺编号",
		comment_time:"2022-12-17 16:42",
		comment_writer:"用户openid",
		comment_content:"评论内容"
	}
	*/
		var date = new Date().getTime();
		let res = await db.collection('shop_comment').add({
			comment_forShop:comment.comment_forShop,
			comment_time:date,
			comment_writer:comment.comment_writer,
			comment_content:comment.comment_content
		}).catch((err)=>{
			return {
				code:500,
				msg:err.message|| '新增失败'
			}
		});
		return {
			code:200,
			msg:"发送评论成功",
			data:res
		};
	},
	async searchShop(option){
		//传入一个option，带有匹配字段
		// var option ={
		// 	name:"南"
		// }
		let res = await db.collection('shop')
		.where({
			shop_name:new RegExp(option.name,'g')
		}).get().catch((err)=>{
			return {
				code:500,
				msg:"报错了！",
				data:null
			}
		})
		return {
			code:200,
			msg:"获取搜索数据成功",
			data:res.data
		}
		;
	}

}
