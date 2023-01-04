<template>
	<view class="container">
		<view class="head" style="height: 500rpx;background-color: #424141;">
			<image src="../../../static/返回.png" style="height: 40rpx;width: 40rpx;" @tap="back" mode=""></image>
		</view>
		<view class="context">
			<view class="avatar">
				<image :src="userInfo.user_avatar" mode=""></image>
				<text class="name">{{userInfo.user_name}}</text>
			</view>
			<view class="useWallet">
				<text>使用钱包支付(您还未开通钱包)</text>
			</view>
			
			<view class="code">
				<text class="normal">此二维码可累计积分(不支持付款)</text>
				<image src="https://api.qrserver.com/v1/create-qr-code/?size=150%C3%97150&data=http://www.baidu.com" mode=""></image>
				<text class="flash">会员码每30秒刷新一次</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				
			}
		},
		computed:{
			...mapState({userInfo:state=>state.user.userinfo})
		},
		methods: {
			back(){
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped lang="scss">
		.container{
			position: relative;
			.head{
				image{
					margin-top: 100rpx;
					margin-left: 40rpx;
				}
			}
			.context{
				position: absolute;
				display: flex;
				width: 100%;
				flex-direction: column;
				top:420rpx;
				.avatar{
					display: flex;
					// width: 100;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					image{
						height: 150rpx;
						width: 150rpx;
						border-radius: 100rpx;
					}
					.name{
						font-size: 36rpx;
						font-weight: bold;
						margin-top: 20rpx;
					}
				}
			
				.useWallet{
					margin-top: 60rpx;
					display: flex;
					justify-content: center;
					font-size: 27rpx;
					height: 50rpx;
					border-bottom: 1rpx solid $border-color;
					color: $text-color-assist;
				}
				.code{
					margin-top: 200rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					.normal{
						font-size: 27rpx;
					}
					image{
						width: 250rpx;
						height: 250rpx;
						margin-top: 40rpx;
					}
					.flash{
						font-size: 26rpx;
						margin-top: 20rpx;
						color: $text-color-assist;
					}
				}
			}
		}
</style>
