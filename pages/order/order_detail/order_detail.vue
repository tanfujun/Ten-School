<template>
	<view class="container">
		<view class="header">
			<image src="../../../static/order/商店.png" mode="heightFix"></image>
			<text class="center">订单已完成</text>
			<text class="bottom">感谢您的支持，欢迎再次光临</text>
		</view>
		<scroll-view class="scroll" scroll-y="true" >
			<view class="context">
				<view class="goodinfo" v-for="good in detail.goodsInfo">
					<view class="left">
						<text>{{good.Detail[0].name}}</text>
						<text style="font-size: 22rpx;color: #999;height: 60rpx;overflow: hidden;margin-top: 10rpx;display: -webkit-box;-webkit-box-orient: vertical;text-overflow: ellipsis;-webkit-line-clamp: 2;">{{good.Detail[0].description}}</text>
					</view>
					<view class="right">
						<text style="margin-right: 20rpx;">X{{good.num}}</text>
						<text>￥{{good.Detail[0].price}}</text>
					</view>
				</view>
				<view class="goodTotal">
					<text>商品折后总价</text>
					<text>￥{{detail.amount}}</text>
				</view>
				<view class="total">
					<text>合计</text>
					<text>￥{{detail.amount}}</text>
				</view>
				<view class="remark">
					<text>如需退款，请联系门店</text>
					<text>下单时间：{{detail.create_time}}</text>
					<text>取茶号：8884</text>
					<text>订单编号：{{detail.code}}</text>
					<text>备注信息：{{detail.remark}}</text>
				</view>
			</view>
		</scroll-view>
		
	</view>
</template>

<script>
	const orderCloud = uniCloud.importObject('order')
	export default {
		data() {
			return {
				detail:{}
			}
		},
		methods: {
			async getOrderDetail(code){
				let user_id = uni.getStorageSync('openid')
				let orderInfo = await orderCloud.getUserOrder(user_id)
				let index = orderInfo.findIndex(item => item.code === code)
				if(index != -1){
					this.detail = orderInfo[index]
				}
				console.log(this.detail);
			}
		},
		onLoad(query) {
			this.getOrderDetail(query.code)
		}
	}
</script>

<style>
	page{
		background-color: #eaeaea;
	}
</style>

<style scoped lang="scss">
		.container{
			padding: 0 40rpx;
			.header{
				display: flex;
				flex-direction: column;
				align-items: center;
				box-shadow: $box-shadow;
				height: 400rpx;
				margin-top: 100rpx;
				background-color: #fff;
				border-top-left-radius: 30rpx;
				border-top-right-radius: 30rpx;
				// justify-content: space-evenly;
				image{
					height: 100rpx;
					margin-top: 80rpx;
				}
				.center{
					font-size: 35rpx;
					color: $color-primary;
					font-weight: bold;
					margin-top: 40rpx;
				}
				.bottom{
					font-size: 26rpx;
					color: $text-color-assist;
					margin-top: 10rpx;
				}
			}
		
			.context{
				background-color: #f6f6f6;
				display: flex;
				flex-direction: column;
				box-shadow: $box-shadow;
				padding: 0 40rpx;
				margin-top: 20rpx;
				// height: 800rpx;
				color: $text-color-base;
				.goodinfo{
					display: flex;
					margin-top: 60rpx;
					height: 80rpx;
					align-items: center;
					.left{
						font-size: 27rpx;
						display: flex;
						flex-direction: column;
						flex: 1;
						padding-right: 20rpx;
					}
					.right{
						font-size: 28rpx;
						font-weight: bold;
					}
				}
				.goodTotal{
					margin-top: 40rpx;
					display: flex;
					justify-content: space-between;
					font-size: 30rpx;
				}
				.total{
					@extend .goodTotal;
					margin-top: 30rpx;
					font-size: 34rpx;
					font-weight: bold;
					border-top: 1rpx dashed $border-color;
					border-bottom: 1rpx solid #e2e2e2;
					height: 100rpx;
					align-items: center;
				}
				.remark{
					margin-top: 40rpx;
					display: flex;
					line-height: 45rpx;
					flex-direction: column;
					font-size: 25rpx;
					color: $text-color-assist;
					margin-bottom: 20rpx;
				}
			}
			.scroll{
				max-height: 1000rpx;
			}
			
		}
</style>
