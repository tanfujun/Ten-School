<template>
	<view class="container">
		<keep-alive>
		<view class="text-container">
			<u--textarea v-model="text" height="200rpx" placeholder="请输入发表内容" count></u--textarea>
		</view>
		<u-upload
				:fileList="fileList1"
				@afterRead="afterRead"
				@delete="deletePic"
				name="1"
				multiple
				:maxCount="9"
			></u-upload>
			<view class="switch">
				<u-switch v-model="isSearch" @change="change"></u-switch><text style="margin-left: 20rpx;">发布失物招领</text>
			</view>
			<view style="margin-top: 80rpx;">
				<u-button  type="primary" size="18"  text="发布" @click="publish"></u-button>
			</view>
			
			
			</keep-alive>
			
			<u-notify ref="uNotify" message="发布成功!"></u-notify>
	</view>
</template>

<script>
	let treeHole = uniCloud.importObject('treeHole')
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				text: '',
				fileList1: [],
				isSearch:false
			}
		},
		computed:{
			...mapState({openid:state=>state.user.openid})
		},
		methods:{
			change(e){
				console.log(e,this.isSearch);
			},
			async deletePic(event) {
				
							
							let result = await treeHole.deleteImage(this.fileList1[event.index].url)
							 if(result.status == 200){
								 this[`fileList${event.name}`].splice(event.index, 1)
							 }
		},
		// 新增图片
		async afterRead(event) {
							// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
							let lists = [].concat(event.file)
							let fileListLen = this[`fileList${event.name}`].length
							lists.map((item) => {
								this[`fileList${event.name}`].push({
									...item,
									status: 'uploading',
									message: '上传中'
								})
							})
							for (let i = 0; i < lists.length; i++) {
								const result = await this.uploadFilePromise(lists[i].url)
								console.log(result);
								let item = this[`fileList${event.name}`][fileListLen]
								this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
									status: 'success',
									message: '',
									url: result
								}))
								fileListLen++
							}
							console.log(this.fileList1);
						},
		async uploadFilePromise(url) {
							const result = await uniCloud.uploadFile({
											filePath: url,
											cloudPath: `${new Date().getTime()}2022.jpg`,
											onUploadProgress: function(progressEvent) {
										          console.log(progressEvent);
										          var percentCompleted = Math.round(
										            (progressEvent.loaded * 100) / progressEvent.total
										          );
										        }
										});
										return result.fileID
										console.log(result);
						},
						
		async publish(){
			
			if(this.text == ''){
				this.$refs.uNotify.error('发布内容为空！')
			}else{
				let imageList = []
				if(this.fileList1.length){
					this.fileList1.forEach((item)=>{
						imageList.push(item.url)
					})
				}
				console.log(imageList);
				let date = new Date();
				let hole ={
					user_id:this.openid,
					hole_type:this.isSearch?"失物招领":"树洞",
					hole_content:this.text,
					hole_img: imageList,
				}
				let result = await treeHole.addHole(hole)
				if(result.code == 200){
					this.$refs.uNotify.success('发布成功！')
					setTimeout(()=>{
						uni.navigateBack()
					},1000)
				}
			}
	
		}
		
		
		}
	
	}
</script>

<style>
	page{
		background-color: #fff;
	}
</style>
<style lang="scss" scoped>
	.container{
		padding: 20rpx 20rpx;
		.text-container{
			margin-bottom: 20rpx;
		}
		.switch{
			display: flex;
			font-size: 28rpx;
			align-items: center;
			margin-top: 50rpx;
		}
	}
</style>
