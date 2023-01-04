const db = uniCloud.database()
const dbCmd = db.command;
		var date = new Date(Date.now()+8*60*60*1000);
		var _startTime = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
		var startTime = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
		var nowTime = Date.now();
		var endTime = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+"23:59:59"
		startTime = new Date(startTime).getTime()-8*60*60*1000;
		endTime = new Date(endTime).getTime()-8*60*60*1000;

module.exports = {
	_before: function () { // 通用预处理器

	},
	//店铺销量冠军
	async winnerShop(){
		// 算出哪家店销量最多
		let shop_list = await db.collection('order_detail').aggregate()
		.match({
			'order_time':dbCmd.and(dbCmd.gt(startTime),dbCmd.lt(nowTime)) 
		})
		.group(
		{
			_id:'$shop_id',
			num:db.command.aggregate.sum(1)
		})
		.sort({
			num:-1
		})
		.limit(10)
		.end();
		shop_list = shop_list.data;
		
		//补充一波店铺信息
		for(var i = 0;i<shop_list.length;i++){
			let shop_info = await db.collection('shop').doc(shop_list[i]["_id"]).get();
			shop_list[i]["shop_info"]=shop_info.data[0];
		}
		if(shop_list.length>0){
			return {
				code:200,
				msg:"获取成功",
				data:shop_list
			}
		}else{
			return {
				code:500,
				msg:"获取失败",
				data:[]
			}
		}
	},
	//饭菜销量冠军
	async winnerMeal(){
		let meal_list = await db.collection('order_detail').aggregate()
		.match({
			'order_time':dbCmd.and(dbCmd.gt(startTime),dbCmd.lt(nowTime)) 
		})
		.group(
		{
			_id:'$meal_id',
			num:db.command.aggregate.sum(1)
		})
		.sort({
			num:-1
		})
		.limit(10)
		.end();
		meal_list = meal_list.data;
				
		for(var i = 0;i<meal_list.length;i++){
			let meal_info = await db.collection('shop_meal').doc(meal_list[i]["_id"]).get();
			meal_list[i]["meal_info"]=meal_info.data[0];
		}
		
		if(meal_list.length>0){
			return {
				code:200,
				msg:"获取成功",
				data:meal_list
			}
		}else{
			return {
				code:500,
				msg:"获取失败",
				data:[]
			}
		}
	},
	//个人今日消费
	async userTodayPay(userId){
		let user_money = await db.collection('order').aggregate()
		.match({
			'addtime':dbCmd.and(dbCmd.gt(startTime),dbCmd.lt(nowTime)),
			'user_id':userId
		})
		.end();
		user_money = user_money.data;
		
		let totalPay=0;
		for(var i=0;i<user_money.length;i++){
			if(typeof(user_money[i]["actual_price"])=='string'){
				totalPay += Number(user_money[i]["actual_price"]);
			}else{
				totalPay += user_money[i]["actual_price"];
			}
		}
		return {
			code:200,
			msg:"获取今日消费数据成功",
			data:{
				_startTime:_startTime,
				totalPay:totalPay
			}
		};
	}
}
