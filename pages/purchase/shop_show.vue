<template>
	<view class="container">
		<view class="shop">
			<view class="left">
				<view class="title">
					<image src="../../static/icon/商家.png" mode=""></image>
					<text style="margin-left: 10rpx;">{{meal_data.shop_name}}</text>
				</view>
				<text class="u-info info">{{meal_data.shop_stand}}</text>
				<text class="u-info info">商家类型：{{meal_data.shop_type}}</text>
				<view class="icon-text-container">
					<view class="icon-text">
						<u-icon name="bell" color="#f1a532" size="22rpx"></u-icon>
						<text class="u-warning-dark" style="font-size: 22rpx;margin-left: 5rpx;">{{meal_data.shop_opentime}}营业</text>
					</view>
					<view class="icon-text">
						<u-icon name="checkmark-circle" color="#f1a532" size="22rpx"></u-icon>
						<text class="u-warning-dark" style="font-size: 22rpx;margin-left: 5rpx;">支持排队取号</text>
					</view>
				</view>
				<view class="icon-text" style="margin-top: 10rpx;">
					<u-icon name="phone" color="#f1a532" size="22rpx"></u-icon>
					<text class="u-warning-dark" style="font-size: 22rpx;margin-left: 5rpx;">{{meal_data.shop_number}}</text>
				</view>
			</view>
			<view class="right">
				<u--image :src="meal_data.shop_img" width="125rpx" height="125rpx" radius="10rpx"></u--image>
			</view>
		</view>
	</view>
</template>

<script>
	const meal = uniCloud.importObject('meal')
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
			};
		},
		computed:{...mapState({shop_id:state=>state.order.shop_id,meal_data:state=>state.order.mealInfo.meal_data})},
		methods:{
			async getDetail(){
			},

		},
		mounted() {
			this.getDetail()
		},
		onLoad() {
			
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		width: 100%;
		box-sizing: border-box;
		padding: 0 20rpx;
		// margin-bottom: 10rpx;
		margin-top: 20rpx;
		.shop{
			box-sizing: border-box;
			border-radius: 10rpx;
			padding: 10rpx;
			padding-top: 15rpx;
			border: 1rpx solid #eee;
			// height: 250rpx;
			width: 100%;
			box-shadow: $box-shadow;
			display: flex;
			justify-content: space-between;
			.left{
				display: flex;
				flex-direction: column;
				.icon-text{
					display: flex;
					margin-right: 10rpx;
				}
				.icon-text-container{
					margin-top: 10rpx;
					display: flex;
					
				}
				.info{
					font-size: 22rpx;
					margin-top:10rpx;
				}
				
				.title{
					display: flex;
					font-size: 32rpx;
					font-weight: 600;
					align-items: center;
					image{
						width: 36rpx;
						height: 36rpx;
						display: flex;
					}
				}
			}
		}
	}
</style>
