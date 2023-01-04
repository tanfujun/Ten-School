<template>
	<view>
		<!-- <van-tabs> -->
		  <!-- <van-tab title="当日订单"> -->
			  <view class="today-order">
				  <van-empty v-if="OrderList.length<1" description="暂时无订单" />
				  <view class="order-container" v-for="order in OrderList">
				  	<view class="shop" @tap="gotoOrderDetail(order.code._value)">
				  						<view class="left">
											<image src="../../static/icon/商家.png" mode=""></image>
				  							<text>{{order.code.order_detail[0].shop_info.shop_name}}</text>
				  						</view>
				  						<view class="right">
				  							<text style="margin-bottom: 2rpx;">已完成</text>
				  							<image src="../../static/common/black_arrow_right.png" class="icon" mode=""></image>
				  						</view>
				  	</view>
				  					<view class="good-image">
				  						<img :src="img.meal_info.meal_img" v-for="img in order.code.order_detail"></img>
				  					</view>
				  					<view class="order-info">
				  						<view class="left">
				  							<text>订单编号:<text style="margin-left: 20rpx;">{{order.code._value}}</text></text>
				  							<text style="margin-top: 2rpx;">下单时间:<text style="margin-left: 20rpx;">{{getTime(order.addtime)}}</text></text>
				  						</view>
				  						<view class="right">
				  							<text>￥{{order.actual_price}}</text>
				  						</view>
				  					</view>
				  					<view class="button_List">
										<view class="getOther" @click="changeCode(order.code._value)">
											<text>删除订单</text>
										</view>
										<view class="getOther" @click="gotoPurchase(order.code.order_detail[0].shop_info._id)">
											<text>去评价</text>
										</view>
				  						<view class="getOther" @click="getSame(order.code.order_detail[0].shop_info._id,order.code.order_detail,order.address)">
				  							<text>再来一单</text>
				  						</view>
				  					</view>
				  					
				  </view>
				  </view>
				  <u-modal :show="show" showCancelButton title="提示" content='确定要删除该订单吗?' @cancel="show = false" @confirm="deleteOrder"></u-modal>
				  <view style="padding-bottom: 40rpx;">
				  <u-loadmore :status="status"  />
				  </view>
	</view>
</template>

<script>
	import dayjs from 'dayjs'
	const orderCloud = uniCloud.importObject('order')
	export default {
		data() {
			return {
				OrderList:[],
				isLogin:true,
				show:false,
				currentCode:'',
				status:'loadmore'
			}
		},
		methods: {
			getTime(time){
				return dayjs(time).format("YYYY-MM-DD HH:mm")
			},
			async getOrderList(start = 0){
				let user_id = uni.getStorageSync('openid')
				if(user_id){
					if(this.status == 'nomore')return;
					try{
						if(start == 0){
							let result = await orderCloud.getUserOrder({start,user_id})
							if(result.code ==200){
								this.OrderList = result.data
								console.log(this.OrderList);
							}else{
								this.status = nomore
							}
						}else{
							
							if(this.status == 'loadmore'){
								this.status = 'loading'
								let result = await orderCloud.getUserOrder({start,user_id})
								if(result!=null&&result.code ==200){
									this.OrderList = this.OrderList.concat(result.data)
									
									if(result.data.length<6){
										this.status = 'nomore'
									}else{
										this.status = 'loadmore'
									}
								}else{
									this.status = 'nomore'
								}
							}
						}
					}catch(e){
						//TODO handle the exception
						console.log("error",e);
						this.status = 'nomore'
					}

				}
			},
			async gotoPurchase(shop_id){
				this.$store.commit('SET_SHOP_ID',shop_id)
				await this.$store.dispatch('getMealInfo',shop_id)
				uni.navigateTo({
					url:`/pages/purchase/purchase?show_goods=${false}`
				},true)
			},
			gotoOrderDetail(code){
				uni.navigateTo({
					url:`/pages/order/order_detail/order_detail?code=${code}`
				})
			},
			getSame(shop_id,mealList,address){
				this.$store.commit('SET_SHOP_ID',shop_id)
				if(address){
					this.$store.commit('SET_SHOP_ID',false)
				}else{
					this.$store.commit('SET_SHOP_ID',true)
				}
				let cart = mealList.map((item)=>{
					let cartItem = {...item.meal_info}
					cartItem.num = item.num
					return cartItem
				})
				
				cart = JSON.stringify(cart)
				// console.log(cart);
				uni.navigateTo({
					url:`/pages/order/addOrder/addOrder?cart=${cart}`
				},true)
			},
			changeCode(code){
				this.currentCode = code
				this.show = true
			},
			async deleteOrder(){
				let user_id = uni.getStorageSync('openid')
				let res = await orderCloud.delUserOrder({code:this.currentCode,user_id:user_id})
				if(res.code == 200){
					uni.showToast({
						title:'删除成功！',
						icon:'success'
					})
					this.status = 'loadmore'
					this.show = false
					this.getOrderList()
				}
			}
			
		},
		onLoad() {
			this.getOrderList()
		},
		onReachBottom() {
			this.getOrderList(this.OrderList[this.OrderList.length-1]._id)
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
			display: flex;
			align-items: center;
			image{
				width: 36rpx;
				height: 36rpx;
				margin-right: 10rpx;
			}
			font-size: $normal-size;
			color: $text-normal;
			font-weight: bold;
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
		width: 600rpx;
		height: 100rpx;
		white-space: nowrap;
		overflow: scroll;
		img{
			height: 100rpx;
			margin-right: 10rpx;
			width: 100rpx;
			object-fit: contain;
			border-radius: 10rpx;
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
			margin-right: 15rpx;
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
