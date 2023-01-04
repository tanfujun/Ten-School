// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database();
const dbCmd = db.command;
module.exports = {
	_before: function () { // 通用预处理器

	},
	async addHole(hole){	//发布树洞/失物招领
	//不用写hole_id和hole_addtime
	// var date = new Date();
	// var hole ={
	//	user_id:"用户编号openid"	
	// 	hole_type:"失物招领",
	// 	hole_content:"在地上发现一个苹果18s，现放在南饭二楼小卖部",
	// 	    hole_img: [
	// 	        {
	// 	            "tan": "https: //vkceyugu.cdn.bspapp.com/VKCEYUGU-60629e12-38df-4763-b955-ace6cc304213/63416336-5494-415b-a4e0-fb128a42cd4c.png"
	// 	        }
	// 	    ],
	// }
	hole['hole_id']=Date.now()+""
	hole['hole_addtime']=Date.now();
	
		let res = await db.collection('treeHole').add(hole).catch((err)=>{
			return {
				code:500,
				msg:err.message|| '新增失败'
			}
		});
		return {
			code:200,
			msg:"发送成功",
			data:res
		}
	},
	async getHole(event){	//通过树洞种类查询相关信息
		// var option ={
		// 	hole_type:"失物招领",
		// 	start:"639a20e2ce27770001dbbca8"("默认为0",分页的话传入id)
		// }
		var option = {
			hole_type:event.type
		}
		if(event.start)option._id = dbCmd.lt(event.start);
		let dbJql = uniCloud.databaseForJQL();
		let hole = await dbJql.collection('treeHole').where(option)
		.orderBy('_id desc,hole_addtime desc')
		.limit(6)
		.getTemp();
		let res = await dbJql.collection(hole,'user').get();
		if(res.data){
			return {
				code:200,
				msg:"查询成功",
				data:res.data
			}
		}else{
			return {
				code:500,
				msg:"查询失败",
				data:res
			}
		}
	},
	async getAllHole(event){
		var option ={}
		let dbJql = uniCloud.databaseForJQL();
		if(event.start)option._id = dbCmd.lt(event.start);
		let hole_list = await dbJql.collection('treeHole').where(option).orderBy('_id desc,hole_addtime desc').limit(6).getTemp();
		// let hole_list = await dbJql.collection('treeHole').where(option).orderBy('_id','desc').orderBy("hole_addtime","desc").limit(6).getTemp();
		let res = await dbJql.collection(hole_list,'user').get().catch((err)=>{
			return {
				code:500,
				data:null,
				msg:err
			}
		});
		if(res.data.length>0){
			var _hole_list = res.data;
			for(var i=0;i<_hole_list.length;i++){
				var _comment = await dbJql.collection('treeHole_comment').where({
					holeComment_id:_hole_list[i]["hole_id"]
				})
				.orderBy('holeComment_addtime','desc')
				.getTemp();
				
				var _comment_user = await dbJql.collection(_comment,'user').get();
				
				res.data[i]["_comment"]=_comment_user.data;
			}
			
			return {
				code:200,
				msg:"获取所有树洞成功",
				data:res.data
			}
			
		}
	},
	async addHoleComment(hole_comment){
		var date = new Date();
		// var hole_comment={
		// 	hole_id:"评论的树洞编号"
		// 	user_id:"用户编号openid"
		// 	comment_content:"在地上发现一个苹果18s，现放在南饭二楼小卖部",
		// }
		let res = await db.collection('treeHole_comment').add({
			holeComment_id:hole_comment.hole_id,
			user_id:hole_comment.user_id,
			holeComment_content:hole_comment.comment_content,
			holeComment_addtime:date.getTime()
		}).catch((err)=>{
			return {
				code:500,
				msg:"评论失败",
				data:hole_comment
			}
		})
		return {
			code:200,
			msg:"评论成功",
			data:res
		}
	},
	async delHoleComment(event){
		//传入event参数，里面有用户id和当前评论的id
		// var event = {
		// 	user_id:"用户id",
		// 	comment_id:"树洞评论编号"
		// }
		let flag = await db.collection('treeHole_comment').doc(event.comment_id).get();
		if(flag.data[0]["user_id"]==event.user_id){
			let res = await db.collection('treeHole_comment')
			.doc(event.comment_id)
			.remove().catch((err)=>{
				return {
					code:500,
					msg:"删除评论失败",
				}
			});
			return {
				code:200,
				msg:"树洞评论删除成功",
				data:null
			}
		}else{
			return {
				code:501,
				msg:"你没有权限删除评论",
			}
		}
		
		
	},
	//删除照片
		async deleteImage(url){
		let result = await uniCloud.deleteFile({
			    fileList: [url]
			  })
			  return {
				  status:200,
				  result
			  }
		}
}
