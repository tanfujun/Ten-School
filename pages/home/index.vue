<template>
	<view class="container">
		<view>
		<swiper class="banner-swiper" circular autoplay :interval="5000" :duration="1000">
			<swiper-item class="banner-swiper-item" v-for="(item, index) in swipers" :key="index">
				<image :src="item" mode="widthFix"></image>
			</swiper-item>
		</swiper>
		</view>
		<view class="context">
			<view class="get_container">
				<view class="left"  @tap="gotoOrder"><img src="/static/home/home_icon_ziqu1.png" alt="" srcset=""><text class="font-20">门店自取</text><text class="font-12">下单免配送费</text></view></navigatorurl>
				<view class="right" @tap="gotoAddress"><img src="/static/home/home_icon_waimai1.png" alt="" srcset=""><text class="font-20">外卖</text><text class="font-12">无需接触 送喜到家</text></view>
			</view>
			
			<view class="credit">
				<view class="left" @tap="gotoVoucher">
					<text class="base">我的积分<text class="num">{{credit?credit:0}}</text></text>
					<text class="assist">可兑换喜茶券和丰富灵感周边</text>
				</view>
				<view class="right" @tap="gotoCode">
					<image src="../../static/home/home_icon_erweima.png" mode=""></image>
					<text class="assist">会员码</text>
				</view>
			</view>
			
			<view class="image">
				<image src="../../static/home/封面图.jpg" mode="widthFix" ></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() { 
			return {
				swipers: [
					"https://go.cdn.heytea.com/storage/ad/2020/05/21/bfd57914d80d4671b19f5d0ccc176cd5.jpg",
					"https://go.cdn.heytea.com/storage/ad/2020/05/24/49f9b50738dd47878cf1ab54c2eee2e0.jpg",
					"https://go.cdn.heytea.com/storage/ad/2020/05/01/e1c6915022c849fd9492377021aef454.jpg",
					"https://go.cdn.heytea.com/storage/ad/2020/04/27/db60b797c1cd4afabe9666e7df958ffd.jpg",
					"https://go.cdn.heytea.com/storage/ad/2020/05/21/4ba53dda599345bdaf28a08420dd1b6f.jpg"
				],
				
			}
		},	
		computed:{
			...mapState({credit:state => state.user.userinfo.user_credit})
		},
		methods: {
			async getMessage(){
				let data =  await uniCloud.callFunction({
					name:'add',
					data:{"message":"hello"}
				}) 
				console.log(data.result);
				this.context = data.result.message;
			},
			gotoCode(){
				uni.navigateTo({
					url:'/pages/user/code/code'
				},true)
			},
			gotoOrder(){
				uni.switchTab({
					url: '/pages/purchase/purchase'
				});
				console.log(123)
			},
			gotoAddress(){
				uni.navigateTo({
					url:'/pages/user/address/address'
				},true)
			},
			gotoVoucher(){
				uni.navigateTo({
					url:'/pages/user/voucher/voucher'
				},true)
			}
			},
		async onLoad() {
			//判断是否登录，如果用户名不存在则登录
			if(!uni.getStorageInfoSync('user_name')){
				this.$store.dispatch('login') 
			}
			
			let openid = uni.getStorageSync('openid')
			// console.log("openid:",openid);
			if(openid){
				await this.$store.dispatch('getUserInfo',openid);
				// this.credit = this.$store.state.user.userinfo.user_credit
				console.log(this.$store.state.user.userinfo.user_credit);
			}
			
		},
		
	}
	
	
</script>

<style scoped lang="scss">
	
	.container{
		// width: 100%;
		
		display: flex;
		flex-direction: column;

	}


	.banner-swiper {
		width: 100%;
		height: 600rpx;
		.banner-swiper-item {
			image {
				width: 100%;
			}
		}
	}
	
	.context{
		box-sizing: border-box;
		width: 100%;
		padding-left: 40rpx;
		padding-right: 40rpx;
		margin-top: -20rpx;
		z-index: 2;
		
		.get_container{
			width: 100%;	
			background-color: #fff;
			height: 350rpx;
			display: block;
			border-radius:10rpx;
			margin-top: -60rpx;
			display: flex;
			justify-content: space-evenly;
			align-items: center;
			box-shadow: $box-shadow;
			.font-20{
				font-size: 45rpx;
				font-weight: bold;
				margin-bottom: 20rpx;
			}
			.right{
				&:nth-child(1):after {
					content: '';
					position: absolute;
					right: -60rpx;
					top: 0;
					bottom: 0;
					width: 2rpx;
					background-color: #cccccc;
				}
					margin-right: 10rpx;
					display: flex;
					flex-direction: column;
					position: relative;
					justify-content: space-between;
					align-items: center;
					img{
						height: 120rpx;
						width: 120rpx;
						margin-bottom: 20rpx;
					}
					
			}
			.left{
				@extend .right
			}
			
		}
		
		.image{
			margin-top: 60rpx;
			width: 100%;
			image{
				border-radius: 20rpx;
				width: 100%;
			}
		}
	
		.credit{
			margin-top: 40rpx;
			display: flex;
			justify-content: space-between;
			.left{
				display: flex;
				flex-direction: column;
				flex: 1;
				.assist{
					font-size: 26rpx;
					color: $text-color-assist;
					margin-top: 10rpx;
				}
				.base{
					color: $text-color-base;
					font-size: 32rpx;
					.num{
						margin-left: 10rpx;
						font-size: 40rpx;
						font-weight: bold;
					}
				}
				
			}
			.right{
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 130rpx;
				.assist{
					font-size: 26rpx;
					color: $text-color-assist;
					margin-top: 10rpx;
					
				}
				border-left: 2rpx solid #cbcbcb;
				// padding-right: 20rpx;
			}
			image{
				width: 60rpx;
				height: 60rpx;
			}
		}
	
	}
	
	
</style>
