<template>
	<view class="container">
		<u-empty
			v-if="winnerMeal.length<=0"
		        mode="data"
				text="列表暂时为空~"
		        icon="http://cdn.uviewui.com/uview/empty/data.png"
		>
		</u-empty>
		<view class="card_container">
						<view class="card" v-for="item in winnerMeal" :key="item._id" @click="gotoPurchase(item.meal_info.meal_forShop)">
							<u--image :src="item.meal_info.meal_img" width="200rpx" height="200rpx" radius="10rpx"></u--image>
							<view class="right">
								<view class="title">
									<u--text :lines="1" bold :text="item.meal_info.meal_name" size="30rpx"></u--text>
									<view class="right1">
										<text class="on u-warning-dark">销量：{{item.num}}</text>
									</view>
									
									<!-- <u--text :lines="1" bold text="销量：" size="30rpx"></u--text> -->
								</view>
								<view class="">
									<u-rate :value="5.0" readonly activeColor="#ee6334"></u-rate>
								</view>
								<view class="text_info">
									
									<text  class="u-info">￥{{item.meal_info.meal_price}}</text>
								</view>
								<view class="text_info">
									<!-- <text  class="u-info">起送 ￥0</text><text class="u-info" style="margin-left: 5rpx;">配送 约￥1</text> -->
								</view>
								<view class="stand_container" style="margin-top: 15rpx;">
										<text class="stand $u-warning-dark">点击进入商品所属商家</text>
								</view>
									
								
							</view>
						</view>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				
			};
		},
		computed:{
			...mapState({winnerMeal:state=>state.shop.winnerMeal})
		},
		methods:{
			async gotoPurchase(shop_id){
				this.$store.commit('SET_SHOP_ID',shop_id)
				await this.$store.dispatch('getMealInfo',shop_id)
				uni.navigateTo({
					url:`/pages/purchase/purchase`
				},true)
			},
		},
		mounted() {
		}
	}
</script>

<style lang="scss" scoped>
.container{
	.card_container{
		padding: 10rpx 10rpx;
		
		.card{
			padding: 15rpx;
			border-radius: 10rpx;
			background-color: #fff;
			margin-bottom: 10rpx;
			display: flex;
			.right{
				flex: 1;
				margin-left: 10rpx;
				
				.title{
					display: flex;
					width: 100%;
					
					justify-content: flex-end;
					.right1{
						display: flex;
						// margin-left: 200rpx;
						.on{
							// background-color: $u-primary-light;
							font-size: 22rpx;
							font-weight: bold;
							border-radius: 10rpx;
							padding: 5rpx;
						}
					}

					
				}
				.text_info{
					display: flex;
					margin-top: 5rpx;
					font-size: 22rpx
				}
				.stand_container{
					.stand{
						background-color: $u-warning-light;
						// margin-top: 15rpx;
						// display: block;
						font-size: 22rpx;
						// max-width: 350rpx;
						border-radius: 10rpx;
						padding: 5rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}
				
			}
		}
	}
}
</style>
