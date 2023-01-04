<template>
	<view class="container">
		<view class="coupon" v-for="coupon in couponList">
			<view class="top">
				<view class="left">
					<text class="font-size">{{coupon.VoucherDetail[0].deno}}</text><text style="font-size: 32rpx;">元</text>
				</view>
				<view class="center">
					<text>{{coupon.VoucherDetail[0].name}}</text>
					<text style="font-size: 24rpx;font-weight: normal;margin-top: 15rpx;">有效期 {{coupon.VoucherDetail[0].start_date}}到{{coupon.VoucherDetail[0].end_date}}</text>
				</view>
				<view class="right" @tap="gotoPurchase">
					<text>点击使用</text>
				</view>
			</view>
			<view class="bottom">
				<text style="color: #d7ab85;border: 1rpx solid #d7ab85;padding: 2rpx 6rpx;margin-right: 10rpx;">门店可用</text><text>满任意金额即可以使用，优惠多多！</text>
			</view>
		</view>
		<u-empty
			v-if="!couponList.length"
		        mode="coupon"
		        icon="http://cdn.uviewui.com/uview/empty/coupon.png"
		>
		</u-empty>
		
	</view>
</template>

<script>
	const voucherCloud = uniCloud.importObject('voucher')
	export default {
		data() {
			return {
				couponList:[]
			}
		},
		methods: {
			gotoPurchase(){
				uni.switchTab({
					url:'/pages/purchase/shop_select'
				})
			}
		},
		async onLoad() {
			let user_id = uni.getStorageSync('openid')
			let couponList = await voucherCloud.getVoucherByUserId(user_id)
			this.couponList = couponList
		}
	}
</script>

<style scoped lang="scss">
	
	$text-gold:#d7ab85;
	$text-normal:#333333;
	$text-assist:#6e716f;
	$big-font:70rpx;
	$normal-font:32rpx;
	$small-font:27rpx;
	$less-font:24rpx;
	.container{
		.coupon{
			padding: 0 20rpx;
			border-radius: 10rpx;
			margin-top: 20rpx;
			box-shadow: $box-shadow;
			.top{
				display: flex;
				align-items: center;
				background-color: #fff;
				height: 200rpx;
				border-bottom: 2rpx solid #c9cecb;
				.center{
					flex: 1;
					display: flex;
					font-size: $normal-font;
					flex-direction: column;
					color: $text-normal;
					margin-left: 20rpx;
					font-weight: bold;
				}
				.left{
					display: flex;
					// flex-direction: column;
					justify-content: center;
					font-size: $big-font;
					align-items: baseline;
					color: $text-gold;
					width: 150rpx;
				}
				.right{
					width: 120rpx;
					height: 50rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: $less-font;
					margin-right: 30rpx;
					border-radius: 5rpx;
					color: #fff;
					background-color: $text-gold;
				}
			}
			.bottom{
				background-color: #f8f8f8;
				padding-left: 30rpx;
				font-size: $small-font;
				height: 80rpx;
				color: $text-assist;
				display: flex;
				align-items: center;
			}
		}
		
	}
	

</style>
