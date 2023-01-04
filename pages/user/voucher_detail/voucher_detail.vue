<template>
	<view class="container">
			<image :src="voucher.image" mode="widthFix"></image>
			<view class="context">
				<view class="title">
					<text class="name">{{voucher.name}}</text>
					<text class="count">{{voucher.require}}<text class="jifen">积分</text></text>
				</view>
				<view class="description">
					<text class="left">商品类型</text><text class="right">现金券</text>
				</view>
				<view class="description">
					<text class="left">有效期限</text><text class="right">{{voucher.start_date}}到{{voucher.end_date}}</text>
				</view>
				<view class="description">
					<text class="left">卡券面额</text><text class="right">{{voucher.deno}}元</text>
				</view>
				<view class="description">
					<text class="left">卡券门槛</text><text class="right">无门槛</text>
				</view>
				<view class="description">
					<text class="left">可用商品</text><text class="right">全部商品</text>
				</view>
				<view class="description">
					<text class="left">可用门店</text><view class="right">全部门店</view>
				</view>
				<view class="description"> 
					<text class="left">可用场景</text><view class="right">仅限在喜茶GO小程序下单时，选择“外卖配送”后可用</view>
				</view> 
			</view>
			
			<view class="button" @tap="openDialog" v-if="isEnough">
				<text>立即兑换</text>
			</view>
			<view class="button_disabled" v-else>
				<text>积分不足</text>
			</view>
			
			<!-- 询问是否兑换窗口	 -->
			<uni-popup ref="alertDialog" type="dialog">
							<uni-popup-dialog type="info" cancelText="关闭" confirmText="兑换" content="你确定要兑换该优惠券吗？" @confirm="dialogConfirm"
								></uni-popup-dialog>
			</uni-popup>
			<u-toast ref="uToast"></u-toast>
	</view>
</template> 

<script>
	import {mapState} from 'vuex'
	const voucherCloud = uniCloud.importObject('voucher')
	export default {
		data() {
			return {
				voucher:{},
				isEnough:true,
			}
		},
		computed:{
			...mapState({user_credit:state => state.user.userinfo.user_credit}),
		},
		methods: {
			openDialog(){
				this.$refs.alertDialog.open()
			},
			async dialogConfirm(){
				let user_id = uni.getStorageSync('openid')
				let newCredit = this.user_credit - parseInt(this.voucher.require)
				let result = await voucherCloud.addUserVoucher(this.voucher._id,user_id,newCredit)
				if(result.status === 200){
					this.$store.dispatch('getUserInfo')
					this.$refs.uToast.show({
						type: 'default',
						message: "兑换成功！",
						iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/default.png'
					})
				}else{
					uni.showToast({
						title:'兑换失败！',
						icon:'error'
					})
				}
				
			},
			
		},
		async onLoad(query) {
			// console.log(query.id);
			let result = await voucherCloud.getVoucherById(query.id)
			this.voucher = result
			
			//判断积分是否足够兑换券
			let require = parseInt(this.voucher.require)
			let isEnough = this.user_credit>=require
			this.isEnough = isEnough
		}
	}
</script>

<style>
	page{
		background-color: #fff;
	}
</style>

<style scoped lang="scss">
	$color-hui:#b2b2b2;
	$color-black:#434343;
	$color-gold:#deab7a;
	$color-goldless:#e9d5bb;
	$text-title:35rpx;
	$text-context:28rpx;
	$text-assist:26rpx;
.container{
	.title{
		display: flex;
		margin-left: 30rpx;
		flex-direction: column;
		margin-bottom: 30rpx;
		.name{
			color: $color-black;
		}
		.count{
			margin-top: 10rpx;
			color: $color-gold;
			.jifen{
				color: $color-hui;
				font-size: $text-assist;
				margin-left: 20rpx;
			}
		}
		
	}
	.description{
		padding: 0 20rpx;
		margin-top: 30rpx;
		display: flex;
		.left{
			font-size: $text-context;
			color:$color-black;
			width: 20%;
		}
		.right{
			font-size: $text-assist;
			color: $color-hui;
			// margin-left: 30rpx;
			width: 70%;
		}
	}
	image{
		width: 100%;
	}
	.button{
		width: 100%;
		height: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: $text-title;
		position: fixed;
		bottom: 0;
		color: #fff;
		background-color: $color-gold;
	}
	.button_disabled{
		@extend .button;
		background-color:$color-goldless;
	}
}

</style>
