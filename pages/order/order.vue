<template>
	<view>
		<van-tabs>
		  <van-tab title="当日订单">
			  <view class="today-order">
				  <van-empty v-if="TodayList.length<1" description="暂时无订单" />
				  <view class="order-container" v-for="order in TodayList">
				  	<view class="shop" @tap="gotoOrderDetail(order.code)">
				  						<view class="left">
				  							<text>广州航海学院店</text>
				  						</view>
				  						<view class="right">
				  							<text style="margin-bottom: 2rpx;">已完成</text>
				  							<image src="../../static/common/black_arrow_right.png" class="icon" mode=""></image>
				  						</view>
				  	</view>
				  					<view class="good-image">
				  						<image :src="img.Detail[0].images" v-for="img in order.goodsInfo" mode="heightFix"></image>
				  					</view>
				  					<view class="order-info">
				  						<view class="left">
				  							<text>订单编号:<text style="margin-left: 20rpx;">{{order.code}}</text></text>
				  							<text style="margin-top: 2rpx;">下单时间:<text style="margin-left: 20rpx;">{{order.create_time}}</text></text>
				  						</view>
				  						<view class="right">
				  							<text>￥{{order.amount}}</text>
				  						</view>
				  					</view>
				  					<view class="button_List">
				  						<navigator class="getOther">
				  							<text>再来一单</text>
				  						</navigator>
				  					</view>
				  					
				  </view>
				  </view>
				  
		  </van-tab>
		  <van-tab title="历史订单">
			  <view class="history-order">
				  <van-empty v-if="historyList.length<1" description="暂时无订单" />
				  <view class="order-container" v-for="order in historyList">
				  	<view class="shop" @tap="gotoOrderDetail(order.code)">
						<view class="left">
							<text>广州航海学院店</text>
						</view>
						<view class="right">
							<text style="margin-bottom: 2rpx;">已完成</text>
							<image src="../../static/common/black_arrow_right.png" class="icon" mode=""></image>
						</view>
				  	</view>
					<view class="good-image">
						<image :src="img.Detail[0].images" v-for="img in order.goodsInfo" mode="heightFix"></image>
					</view>
					<view class="order-info">
						<view class="left">
							<text>订单编号:<text style="margin-left: 20rpx;">{{order.code}}</text></text>
							<text style="margin-top: 2rpx;">下单时间:<text style="margin-left: 20rpx;">{{order.create_time}}</text></text>
						</view>
						<view class="right">
							<text>￥{{order.amount}}</text>
						</view>
					</view>
					<view class="button_List">
						<navigator class="getOther">
							<text>再来一单</text>
						</navigator>
					</view>
					
				  </view>
			  </view>
		  </van-tab>
		</van-tabs>
	</view>
</template>

<script>
	import dayjs from 'dayjs'
	const orderCloud = uniCloud.importObject('order')
	export default {
		data() {
			return {
				
				historyList:[],
				TodayList:[],
				isLogin:true,
			}
		},
		methods: {
			async getOrderList(){
				let user_id = uni.getStorageSync('openid')
				if(user_id){
					let orderList = await orderCloud.getUserOrder(user_id)
					orderList.forEach(item =>{
						let currentTime = dayjs().format('YYYY-MM-DD')
						let orderTime = dayjs(item.create_time).format('YYYY-MM-DD')
						if(currentTime === orderTime){
							this.TodayList.push(item)
						}else{
							this.historyList.push(item)
						}
					})
				}
			},
			gotoOrderDetail(code){
				uni.navigateTo({
					url:`/pages/order/order_detail/order_detail?code=${code}`
				})
			}
		},
		onTabItemTap() {
			this.historyList = []
			this.TodayList = []
			this.getOrderList()
		}
	}
</script>

<style scoped lang="scss">

$text-normal:#3c3c3c;
$text-less:#636363;
$text-gold:#dba871;

$normal-size:29rpx;
$less-size:28rpx;

.icon{
	width: 35rpx;
	height: 35rpx;
}

.order-container{
	margin-top: 20rpx;
	background-color: #fff;
	padding: 40rpx 30rpx;
	display: flex;
	flex-direction: column;
	.shop{
		display: flex;
		.left{
			flex: 1;
			font-size: $normal-size;
			color: $text-normal;
		}
		.right{
			display: flex;
			align-items: center;
			font-size: 26rpx;
			color: $text-normal;
		}
	}
	.good-image{
		margin-top: 30rpx;
		image{
			height: 100rpx;
		}
	}
	.order-info{
		display: flex;
		align-items: center;
		margin-top: 30rpx;
		.left{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: 26rpx;
			color: $text-less;
		}
		.right{
			font-size: 34rpx;
			// font-weight: bold;
			color: $text-normal;
		}
	}
	.button_List{
		margin-top: 20rpx;
		display: flex;
		justify-content: flex-end;
		.getOther{
			width: 150rpx;
			height: 60rpx;
			border: 2rpx solid $text-gold;
			font-size: 26rpx;
			border-radius: 4rpx;
			color: $text-gold;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
}

// .today-order{
// 		height: 80vh;
// 		width: 100%;
// 		display: flex;
// 		align-items: center;
// 		justify-content: center;
		
// }

</style>
