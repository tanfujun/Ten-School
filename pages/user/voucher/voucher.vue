<template>
	<view class="container">
		<view class="top">
			<text class="title">可用积分</text>
			<view class="num">
				<text>{{user_credit}}</text>
			</view>
			<view class="mx">
				<!-- <text>积分明细</text><text>|</text><text>兑换记录</text> -->
			</view>
		</view>
		
		
		
		<view class="voucher_container">
			<view class="voucher" v-for="voucher in voucherList" :key="voucher._id" @click="gotoDetail(voucher._id)">
				<image :src="voucher.image" mode="widthFix"></image>
				<text class="name">{{voucher.name}}</text>
				<view class="count">
					<text style="font-size: 30rpx;color:#e8c07b">{{voucher.require}}</text><text style="font-size: 27rpx;color:#676767;">积分</text>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	const voucherCloud = uniCloud.importObject('voucher')
	export default {
		data() {
			return {
				voucherList:[]
			}
		},
		methods:{
			gotoDetail(id){
				uni.navigateTo({
					url:`/pages/user/voucher_detail/voucher_detail?id=${id}`
				})
			},
			async getvoucherList(){
				let result = await voucherCloud.getVoucher()
					this.voucherList = result;
					// console.log(result,this.user_credit);
			}
			
		},
		computed:{
			...mapState({user_credit:state => state.user.userinfo.user_credit})
		},
		onLoad() {
			this.getvoucherList()
		}
	}
</script>

<style scoped lang="scss">
	.container{
		.top{
			background: url('@/static/voucher/me_img_banner_mall.png') no-repeat;
			background-size: 100%;
			box-sizing: border-box;
			background-position: 50% 80%;
			// position: relative;
			padding: 30rpx 40rpx;
			width: 100%;
			height: 350rpx;
			display: flex;
			flex-direction: column;
			.title{
				font-size: 28rpx;
				color: #676767;
			}
			.num{
				color: #676767;
				margin-top: 20rpx;
				flex: 1;
				font-size: 70rpx;
				font-weight: bold;
			}
			.mx{
				font-size: 28rpx;
				color: #505050;
				display: flex;
				width: 300rpx;
				justify-content: space-evenly;
			}
		}
	
		.voucher_container{
			background-color: #fff;
			margin-top: 20rpx;
			display: flex;
			flex-wrap: wrap;
			.voucher{
				display: flex;
				flex-direction: column;
				.name{
					font-size: 27rpx;
					color: #1f1f1f;
					margin-left: 30rpx;
				}
				.count{
					margin-left: 30rpx;
					margin-top: 30rpx;
					margin-bottom: 20rpx;
				}
				image{
					width: 375rpx;
				}
			}
		}
	}
</style>
