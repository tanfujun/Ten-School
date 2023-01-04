<template>
	<view class="container">
		<view class="head" style="height: 500rpx;background-color: #424141;">
			<image src="../../../static/返回.png" style="height: 40rpx;width: 40rpx;" @tap="back" mode=""></image>
		</view>
		<view class="context">
			<view class="avatar">
				<image src="https://thirdwx.qlogo.cn/mmopen/vi_32/iaxgvyIjNFomliaYdicSfSG79hLibCvuIxmbVQJaJQgTptY2FX4L2kQ41dgeA1Bqic8DnCSBaN2IOhlTAibvgADV3duw/132" mode=""></image>
				<text class="name">谭先生</text>
			</view>
			<view class="useWallet">
				<text>扫下方二维码加作者微信联系作者</text>
			</view>
			
			<view class="code">
				<!-- <text class="normal">此二维码可累计积分(不支持付款)</text> -->
				<image src="../../../static/user/code.png" mode=""></image>
				<!-- <text class="flash">会员码每30秒刷新一次</text> -->
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
						width: 400rpx;
						height: 400rpx;
						// margin-top: 40rpx;
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
