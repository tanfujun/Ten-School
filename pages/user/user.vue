<template>
	<view class="container">
		<view class="img-container">
			<img src="https://go.cdn.heytea.com/storage/products/2019/12/18/01954797f3fb470cb6ba1606476c658c.png"
				alt="">
		</view>

		<view class="context">
			<view class="avatar">
				<view class="left">
					<view class="introduce" v-if="isLogin">
						<text >你好，{{name?name:"wechatUser"}}</text>
						<text class="welcome">欢迎来到校园综合性服务平台，优惠多多！</text>
					</view>
					<text v-else @tap="login">点我一键登录！</text>
				</view>
				<view class="right">
					<van-image round width="140rpx" height="140rpx"
						@tap="gotoSet"
						:src="avatar?avatar:'https://wx.qlogo.cn/mmopen/vi_32/Hx7MFkCEmZVHziaTTiaHSiaCs4ApnH5CD0nYOhOg1nYUUMYtxMXkL6L4VL5icRfO5w4LGzW5ib0FZicwj2MficyYfZgCw/132'" />
				</view>
			</view>

			<view class="row">
				<view class="grid" open-type="navigate" @tap="gotoVoucher">
					<image src="/static/my/me_icon_points.png"></image>
					<!-- <view class="value">{{user_pay?user_pay:0}}</view> -->
					<view class="title">个人消费</view>
				</view>
				<view class="grid" open-type="navigate" @tap="gotoCoupon">
					<image src="/static/my/me_icon_quan.png"></image>
					<!-- <view class="value">{{coupon?coupon:0}}</view> -->
					<view class="title">代金券</view>
				</view>
<!-- 				<view class="grid" open-type="navigate" @tap="gotoWallet">
					<image src="/static/my/me_icon_wallet.png"></image>
					<view class="value">{{wallet?wallet:0}}</view>
					<view class="title">钱包</view>
				</view> -->
			</view>

			<view class="xinqiubobao">
				<view class="title">星球播报</view>
				<swiper class="swiper" next-margin="50px" autoplay :interval="5000" :duration="500" circular>
					<swiper-item class="swiper-item" v-for="(item, index) in boardcast" :key="index">
						<view class="swiper-item-wrapper">
							<image :src="item.coverPic" class="img"></image>
							<view class="desc">
								<view class="title">{{ item.title }}</view>
								<view class="subtitle">{{ item.subtitle }}</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>

			<view class="setting">
				<van-cell @tap="gotoOrder" title="我的订单" is-link />
				<van-cell @tap="gotoCode" title="会员码" is-link />
				<van-cell @tap="gotoCall" title="联系客服" is-link />
				<van-cell @tap="gotoAdvice" title="反馈意见" is-link />
				<van-cell @tap="logout" v-if="isLogin" title="退出登录" style="margin-bottom: 200rpx;" is-link />
			</view>
			<view style="height: 50rpx;">
				
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	const special_tool = uniCloud.importObject('special_tool')
	export default {
		data() {
			return {
				boardcast: [{
						title: "喜茶制粽，现正预售中",
						subtitle: "2020喜茶制粽端午礼盒",
						coverPic: "https://go.cdn.heytea.com/storage/products/2020/05/25/d7f9a7e9ea3747778d301b443147cd82.png",
					},
					{
						title: "来颗布蕾QQ麻薯球",
						subtitle: "灵感之茶，与音乐共生",
						coverPic: "https://go.cdn.heytea.com/storage/products/2020/05/25/0346c403e88243eaa76aa334097ad8ec.png",
					},
					{
						title: "喜茶星球会员升级啦",
						subtitle: "点击了解升级详情",
						coverPic: "https://go.cdn.heytea.com/storage/products/2020/05/08/0a11147144ff42629e6eca9eeec53215.png",
					}
		],
		userinfo:{},
		user_pay:''
			}
		},
		computed: {
			...mapState({
				name: state => state.user.userinfo.user_name,
				isLogin: state => state.user.isLogin,
				avatar: state => state.user.userinfo.user_avatar,
				credit: state => state.user.userinfo.user_credit,
				wallet: state => state.user.userinfo.user_wallet,
				coupon: state => state.user.userinfo.user_coupon,
				user_id:state => state.user.openid
				
			})
		},
		onLoad() {
			this.getUserInfo()
			
		},
		onTabItemTap() {
			if(!uni.getStorageSync('openid')){
				this.logout()
			}
			// if(uni.getStorageSync('openid')){
			// 	this.$store.dispatch('getUserInfo')
			// }
		},
		methods: {
			login() {
				this.$store.dispatch('login',true)
				
				console.log(this.isLogin);
			},
			async getUserPay(){
				let res = await special_tool.userTodayPay(this.user_id)
				this.user_pay = res.data.totalPay
				console.log(this.user_pay);
			},
			gotoOrder(){
				
				uni.navigateTo({
					url:'/pages/order/order'
				},true)
			},
			gotoSet(){
				uni.navigateTo({
					url:'/pages/user/set_userinfo/set_userinfo'
				},true)
			},
			async getUserInfo(){
				let openid = uni.getStorageSync('openid')
				console.log("openid:",openid);
				if(openid){
					this.$store.dispatch('getUserInfo')
				}
				
			},
			logout(){
				this.$store.dispatch('logout')
				
			},
			gotoAdvice(){
				uni.navigateTo({
					url:'/pages/user/advice/advice'
				},true)
			},
			gotoCall(){
				uni.navigateTo({
					url:'/pages/user/call/call'
				})
			},
			gotoCode(){
				uni.navigateTo({
					url:'/pages/user/code/code'
				},true)
			},
			gotoVoucher(){
				uni.navigateTo({
					url:'/pages/user/userTodayPay/userTodayPay'
				},true)
			},
			gotoCoupon(){
				uni.navigateTo({
					url:'/pages/user/coupon/coupon'
				},true)
			},
			gotoWallet(){
				uni.navigateTo({
					url:'/pages/user/wallet/wallet'
				},true)
			},
			
		}
	}
</script>

<style scoped lang="scss">
	.container {
		width: 100%;
		position: relative;

		.img-container {
			img {
				width: 100%;
				height: 750rpx
			}

		}

		.context {
			position: absolute;
			box-sizing: border-box;
			width: 100%;
			height: 600rpx;
			margin-top: -200rpx;
			background-color: #f8f8f8;
			// z-index: 5;

			.avatar {
				width: 100%;
				display: flex;
				box-sizing: border-box;
				padding: 40rpx 40rpx 0 40rpx;
				background-color: $bg-color-white;
				justify-content: flex-end;
				justify-content: space-between;

				.left {
					font-size: 40rpx;
					font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
					font-weight: bold;
					.introduce{
						display: flex;
						flex-direction: column;
						.welcome{
							margin-top: 10rpx;
							font-size: 30rpx;
							font-weight: normal;
						}
					}
				}

				.right {
					image {
						width: 125rpx;
						height: 125rpx;
						border-radius: 100rpx;
					}
				}
			}

			.row {
				margin-top: $spacing-row-base;
				width: 100%;
				display: flex;
				align-items: center;
				background-color: $bg-color-white;
				// padding-bottom: 10rpx;

				.grid {
					flex: 1;
					flex-shrink: 0;
					display: flex;
					flex-direction: column;
					align-items: center;
					// margin-bottom: 20rpx;
					image {
						width: 100rpx;
						height: 100rpx;
					}

					.value {
						font-family: 'neutra';
						margin-bottom: $spacing-col-sm;
						font-size: $font-size-lg;
					}

					.title {
						font-size: $font-size-sm;
						color: $text-color-grey;
						margin-bottom: 20rpx;
					}
				}
			}

			.xinqiubobao {
				padding: 40rpx 40rpx 0 40rpx;
				width: 100%; 
				position: relative;

				.title {
					margin: 10rpx 0;
					font-size: $font-size-lg;
					font-weight: 500;
				}

				.swiper {
					height: 200rpx;
					margin-bottom: 10rpx;

					.swiper-item {

						.swiper-item-wrapper {
							display: flex;
							background-color: $bg-color-white;
							padding: 40rpx 60rpx;
							border-radius: $border-radius-base;
							align-items: center;
							margin-right: 40rpx;

							image {
								width: 100rpx;
								height: 100rpx;
								border-radius: 100%;
								margin-right: 20rpx;
							}

							.desc {
								display: flex;
								flex-direction: column;

								.title {
									font-size: $font-size-medium;
									font-weight: 500;
									margin-bottom: 10rpx;
								}

								.desc {
									font-size: $font-size-sm;
									color: $text-color-grey;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
