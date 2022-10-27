<template>
	<view class="container">
		 <view class="phone">
		 	<view class="left">
		 		<text>联系电话</text>
				<input type="text" v-model="phone" style="margin-left: 20rpx;">
		 	</view>
			<view class="right">
				<text>自动填写</text>
			</view>
		 </view>
		 <view class="getTime">
		 	<text>取餐时间</text>
			<text style="margin-top: 20rpx;font-size: 28rpx;color: #DBA871;font-weight: normal;">冰淇淋/鲜食等产品无需等待，可立即向店员领取</text>
		 </view>
		 <view class="goodList">
		 	<view class="good">
		 		<text class="title">商品列表</text>
				<view class="List">
					
						<scroll-view class="left" scroll-x="true" >
						<image v-for="good in cart" :src="good.images" mode="heightFix"></image>
						</scroll-view>
					
					<view class="right">
						<text>共{{totalNum}}件</text>
						<image src="../../../static/common/black_arrow_right.png" mode=""></image>
					</view>
				</view>
		 	</view>
			<view class="coupon" @tap="gotoSelectCoupon">
				<view class="left">
					<text>喜茶券</text><text class="quan">券</text>
				</view>
				<view class="right">
					<text v-show="deno">-￥{{deno}}</text>
					<image src="../../../static/common/black_arrow_right.png" class="icon" mode=""></image>
				</view>
			</view>
			<view class="remark" @tap="gotoRemark">
				<view class="left">
					<text>备注</text>
				</view>
				<view class="right" >
					<text >{{remark}}</text>
					<image src="../../../static/common/black_arrow_right.png" class="icon" mode=""></image>
				</view>
			</view>
			<view class="total">
				<text>共{{totalNum}}件商品，小计<text style="font-size: 32rpx;font-weight: bold;">{{totalPrice}}</text></text>
			</view>
		 </view>
		 
		 <view class="pay">
		 	<text class="left">支付方式</text>
			<view class="right">
				<image src="../../../static/purcase/weixin-pay.png" class="icon" mode=""></image>
				<text style="margin-left: 10rpx;">微信支付</text>
			</view>
		 </view>
		 
		 <view class="settle">
		 	<view class="left">
		 		<text>合计：<text style="font-size: 34rpx;font-weight: bold;">{{totalPrice}}</text></text>
		 	</view>
			<view class="right" @tap="addOrder">
				<text>支付</text>
			</view>
		 </view>
	</view>
</template>

<script>
	import dayjs from 'dayjs'
	const voucherCloud = uniCloud.importObject('voucher')
	const orderCloud = uniCloud.importObject('order')
	export default {
		data() {
			return {
				cart:[],
				deno:'', //优惠券优惠价格
				//接收用户修改的备注信息
				voucher_id:'',
				voucher_user_id:'',
				amount:'',
				remark:'',
				phone:''
			}
		},
		watch:{
			voucher_id:{
				async handler(newVal){
					if(newVal){
						let result = await voucherCloud.getVoucherById(newVal)
						this.deno = result.deno
					}
				},
			}
		},
		computed:{
			totalNum(){
				let Num = 0;
				this.cart.forEach(item => {
					Num = Num + item.num
				})
				return Num
			},
			totalPrice(){
				let Price = 0;
				this.cart.forEach(item => {
					Price = Price + item.price*item.num
				})
				let total = Price.toFixed(2)
				if(this.deno){
					total = total - this.deno
					if(total <= 0){
						total = 0
					}
					total = total.toFixed(2)
				}
				return total
			},
		},
		onLoad(query) {
			let cart = JSON.parse(query.cart)
			this.cart = cart
			console.log('cart:',cart);
		},
		methods: {
			gotoRemark(){
				uni.navigateTo({
					url:'/pages/order/remark/remark'
				})
			},
			gotoSelectCoupon(){
				uni.navigateTo({
					url:'/pages/purchase/selectCoupon/selectCoupon'
				})
			},
			async addOrder(){
				if(this.phone){
					let user_id = uni.getStorageSync('openid')
					let code = dayjs().format('YYYY') + dayjs().unix()
					let create_time = dayjs().format('YYYY-MM-DD HH:mm:ss')
					let order = {
						user_id:user_id,
						code:code,
						amount:this.totalPrice,
						remark:this.remark,
						phone:this.phone,
						create_time
					}
					if(this.voucher_id){
						order.voucher_id = this.voucher_id
					}
					let goodList = []
					this.cart.forEach(item => {
						goodList.push({order_code:code,good_id:item._id,actual_price:item.price,num:item.num})
					})
					try{
						let result = await orderCloud.createOrder(order,goodList,this.voucher_user_id)
						if(result.status === 200){
							uni.showToast({
								title:'下单成功！'
							})
							setTimeout(()=>{
								uni.navigateBack()
							},1000)
							
						}
					}catch(e){
						uni.showToast({
							title:'下单失败！',
							icon:'error'
						})
					}
				}else{
					uni.showToast({
						title:'请输入手机号！',
						icon:'error'
					})
				}
				
				
			}
		}
	}
</script>

<style scoped lang="scss">
	.container{
		.icon{
			width: 40rpx;
			height: 40rpx;
		}
		.phone{
			display: flex;
			justify-content: space-between;
			padding: 0 30rpx;
			height: 100rpx;
			background-color: #fff;
			align-items: center;
			.left{
				font-size: 28rpx;
				flex: 1;
				display: flex;
			}
			.right{
				text{
					color: $color-primary;
					font-size: 26rpx;
					border: 2rpx solid $color-primary;
					padding: 0 2rpx;
				}
			}
		}
	
		.getTime{
			display: flex;
			flex-direction: column;
			padding-left: 30rpx;
			font-size: 28rpx;
			margin-top: 20rpx;
			font-weight: bold;
			background-color: #fff;
			height: 150rpx;
			justify-content: center;
		}
	
		.goodList{
			margin-top: 20rpx;
			padding-left: 30rpx;
			background-color: #fff;
			.good{
				display: flex;
				flex-direction: column;
				border-bottom: 2rpx solid #eee;
				.title{
					margin-top: 20rpx;
					font-size: 28rpx;
					font-weight: bold;
				}
				.List{
					margin-top: 80rpx;
					display: flex;
					align-items: center;
					.left{
						// flex: 1;
						max-width: 75%;
						white-space:nowrap;
						image{
							height: 100rpx;
							// width: 125rpx;
						}
					}
					.right{
						display: flex;
						flex: 1;
						justify-content: flex-end;
						align-items: center;
						font-size: 27rpx;
						image{
							width: 40rpx;
							height: 40rpx;
						}
					}
				}
			}
			.coupon{
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 100rpx;
				.left{
					font-size: 28rpx;
					.quan{
						font-size: 20rpx;
						background-color: $color-primary;
						color: #fff;
						margin-left: 4rpx;
						padding: 2rpx 4rpx;
						// font-weight: bold;
					}
				}
				.right{
					font-size: 28rpx;
					display: flex;
					align-items: center;
					color: #949494;
				}
			}
			.remark{
				@extend .coupon;
				.right{
					color: $text-color-base;
					text{
						max-width: 200rpx;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					
				}
			}
			.total{
				height: 100rpx;
				background-color: #fff;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				font-size: 26rpx;
				padding-right: 30rpx;
			}
		}
	
		.pay{
			margin-top: 40rpx;
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 30rpx;
			background-color: #fff;
			.left{
				font-size: 28rpx;
			}
			.right{
				display: flex;
				align-items: center;
				font-size: 28rpx;
				// margin-right: 30rpx;
			}
		}
		
		.settle{
			height: 110rpx;
			width: 100%;
			position: fixed;
			bottom: 0;
			background-color: #fff;
			display: flex;
			.left{
				flex: 1;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				font-size: 26rpx;
				margin-right: 20rpx;
			}
			.right{
				width: 225rpx;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: #409eeb;
				color: #fff;
				font-size: 36rpx;
			}
		}
	}
</style>
