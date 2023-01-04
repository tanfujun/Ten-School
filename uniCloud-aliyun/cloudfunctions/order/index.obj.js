const db = uniCloud.database();
const dbJql = uniCloud.databaseForJQL();
const voucher = uniCloud.importObject('voucher')
module.exports = {
	_before: function () { // 通用预处理器

	},
	async createOrder(order){	//生成订单
		/*
			order 参数是一个对象
			里面有order表的信息(user_id,actual_price,coupon_id,voucher_id(没使用的""就行),phone(没有就空字符串),address(没用就空字符串))，
			还有order_detail的信息，一个列表
			【
			{
				shop_id：xxx，
				meal_id：xxx，
				num：xxx，
				meal_price：xxx
			}，
			{
				
			}】
		*/
	   // var order={
		  //  code:"20221217",
		  //  user_id:"openid",
		  //  actual_price:11,
		  //  goods_list:[{
			 //   order_time:new Date().getTime(),
			 //   shop_id:"639adcab8917140001fc9027",
			 //   meal_id:"639caa1e90b26d0001a2d097",
			 //   num:1,
			 //   meal_price:11
		  //  }]
	   // }
	   let order_detail = order.goods_list;
	   const now = new Date().getTime();
	   var orderCode = now +'1229';
	   console.log(order_detail,"订单详情");
		//1.先添加到order订单表中的基本信息
		await db.collection('order').add({
			code:orderCode,
			user_id:order.user_id,
			actual_price:order.actual_price,
			coupon_id:order.coupon_id,
			addtime:now,
			num:order.num,
			phone:order.phone,
			address:order.address,
			remark:order.remark
		});
		
		// 2.添加到order_detail订单明细表中
		try{
			console.log("添加到order_detail订单明细表中");
			for(var i=0;i<order_detail.length;i++){
				order_detail[i]["code"]=orderCode;
				order_detail[i]["order_time"]=now;
				await db.collection('order_detail').add(order_detail[i]);
			}
			
		}catch(e){
			//TODO handle the exception
			console.log(e);
		}

		
		if(order.voucher_id){
			
			//进行消费券核销
			await voucher.deleteUserVoucher(order.voucher_id,order.user_id)
			
			// let couponResult = await db.collection('user').where({user_id:order.user_id}).get()
			// let newVoucherData = couponResult.data[0].user_coupon-1
			
			// await db.collection('user').where({user_id:order.user_id}).update({user_coupon:newVoucherData})
			
		}
		
		//3.返回订单信息
		let res = await db.collection('order').where({
			code:orderCode
		})
		.get().catch((err)=>{
			return {
				code:500,
				msg:"订单生成失败",
				data:null
			}
		})
		return {
			code:200,
			msg:"订单生成成功，返回订单数据",
			data:res.data
		}
	},
	async getUserOrder(event){		//获取用户订单信息
		// var option = {
		// 	user_id:"openid",
		// 	start:0
		// }
		var option ={
			user_id:event.user_id
		}
		if(event.start)option._id = db.command.lt(event.start);
	//输入用户编号userId即openid
	//联合order和order_detail表查询用户订单信息
		let order = await dbJql.collection('order').where(option).getTemp();
		let user_order = await dbJql.collection(order,'order_detail')
		.orderBy('_id desc,addtime desc')
		.limit(6)
		.get().catch((err)=>{
			return {
				code:500,
				msg:"查询用户订单信息失败",
				data:null
			}
		});
		user_order = user_order.data;
		//遍历订单详情补充店铺和菜品信息
		for(var i=0;i<user_order.length;i++){
			//获取订单详情
			let _detail = user_order[i].code.order_detail;
			for(var j=0;j<_detail.length;j++){
				//查询店铺信息
				let shop = await db.collection('shop').where({
					_id:_detail[j].shop_id
				}).get();
				user_order[i].code.order_detail[j]["shop_info"]=shop.data[0];
				
				//查询菜品信息
				let meal = await db.collection('shop_meal').where({
					_id:_detail[j].meal_id
				}).get();
				user_order[i].code.order_detail[j]["meal_info"]=meal.data[0];
			}
		}
		
		return {
			code:200,
			msg:"查询用户订单成功",
			data:user_order
		}
	},
	async getOrderInfo(code){	//通过订单号查询订单详情
		// var testCode = "20221215kkk";
		let order = await dbJql.collection('order').where({
			code:code
		}).getTemp();
		let order_list = await dbJql.collection(order,'order_detail').get().catch((err)=>{
			return {
				code:500,
				msg:"查询订单详情失败",
				data:null
			}
		});
		order_list = order_list.data;
		for(var i=0;i<order_list.length;i++){
			//获取订单详情
			let _detail = order_list[i].code.order_detail;
			for(var j=0;j<_detail.length;j++){
				//查询店铺信息
				let shop = await db.collection('shop').where({
					_id:_detail[j].shop_id
				}).get();
				order_list[i].code.order_detail[j]["shop_info"]=shop.data[0];
				
				//查询菜品信息
				let meal = await db.collection('shop_meal').where({
					_id:_detail[j].meal_id
				}).get();
				order_list[i].code.order_detail[j]["meal_info"]=meal.data[0];
			}
		}
		return {
			code:200,
			msg:"查询订单详情成功",
			data:order_list
		}
	},
	async delUserOrder(info){	//删除用户订单
		//传入用户user_id(即openid)和订单编号code
		let res = await db.collection('order').where({
			code:info.code,
			user_id:info.user_id
		}).remove();
		if(res.deleted){
			await db.collection('order_detail').where({
				code:info.code
			}).remove();
			return {
				"code":200,
				"msg":"删除成功"
			};
		}else{
			return {
				"code":500,
				"msg":"删除失败,数据库出问题"
			};
		}
		
		
	}
}
