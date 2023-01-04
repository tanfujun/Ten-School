<template>
	<view>
		<view class="image_container">
			<view class="image">
				<image :src="avatar" style="width: 175rpx;height: 175rpx;border-radius: 50%;" mode=""></image>
				<view class="zhezhao" @tap="updateImage">
					<image src="../../../static/icon/123.png" mode=""></image>
				</view>
			</view>
			<span style="margin-top: 30rpx;">点击更换头像</span>
		</view>
		<tan-input v-model="username" title="用户昵称" placeholder="请输入用户昵称">
		</tan-input>
		<tan-input v-model="phone" title="手机号码" placeholder='请填写您的联系方式'>
		</tan-input>
		
		<view style="width:100%;display: flex;justify-content:center;position: fixed;bottom: 40rpx;">
			<tan-button  width="650rpx" text="保存信息" @tap="update"></tan-button>
		</view>
	</view>
	
</template>

<script>
import { update } from 'lodash';

const user = uniCloud.importObject('user')
	export default {
		data() {
			return {
				username: '',
				phone:'123123',
				avatar:'https://wx.qlogo.cn/mmopen/vi_32/Hx7MFkCEmZVHziaTTiaHSiaCs4ApnH5CD0nYOhOg1nYUUMYtxMXkL6L4VL5icRfO5w4LGzW5ib0FZicwj2MficyYfZgCw/132'
			}
		},
		computed:{
			openid(){
				return this.$store.state.user.openid
			}
		},
		methods: {
			onChange(event) {
			    // event.detail 为当前输入的值
			    console.log(event.detail);
			  },
			  updateImage(){
				  var self = this;
				  	uni.chooseMedia({
				  			  count: 1,
				  			  mediaType: ['image','video'],
				  			  sourceType: ['album', 'camera'],
				  			  maxDuration: 30,
				  			  camera: 'back',
				  			  success:async function(res){
								let url = res.tempFiles[0].tempFilePath
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
											self.avatar = result.fileID
				  			  }
				  			})
			  },
			async update() {
				let result = await user.updateUserInfo({user_id:this.openid,user_name:this.username,user_avatar:this.avatar,user_phone:this.phone})
				if(result.status == 200){
					uni.showToast({
						title:'更改成功！'
					})
					this.$store.dispatch('getUserInfo',this.openid)
					setTimeout(function(){
						uni.navigateBack()
					},1000)
				}
			}
		},
		onLoad() {
			this.username =  this.$store.state.user.userinfo.user_name
			this.avatar = this.$store.state.user.userinfo.user_avatar
			this.phone = this.$store.state.user.userinfo.user_phone
		}
	}
</script>

<style lang="scss" scoped>
	*{
		font-size: 28rpx;
		font-family: '黑体'
	}
	.image_container{
		width: 100%;
		height: 400rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.image{
			display: flex;
			justify-content: center;
			align-items: center;
			width: 175rpx;
			height: 175rpx;
			border-radius: 50%;
			position: relative;
			.zhezhao{
				width: 100%;
				height: 100%;
				border-radius: 50%;
				display: flex;
				position: absolute;
				justify-content: center;
				align-items: center;
				background-color: rgba(0, 0, 0, 0.2);
				image{
					height: 50rpx;
					width: 50rpx;
				}
			}
		}
	}
</style>
