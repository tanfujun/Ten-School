<template>
	<view class="container">
			<image src="../../../static/货币.png" mode=""></image>
			<u-count-to :endVal="pay" fontSize="100rpx" :decimals='2' separator=","></u-count-to>
			<text class="$u-info">今日消费</text>
			<text class="$u-info" v-if="pay>1000">好吃的固然很多，但也不要过渡消费哦~</text>
	</view>
</template>

<script>
		import {mapState} from 'vuex'
	const tool = uniCloud.importObject('special_tool')
	export default {
		data() {
			return {
				pay:''
			};
		},
		methods:{
			async getUserPay(){
				// let user_id = uni.getStorageInfoSync('openid')
				let res = await tool.userTodayPay(this.user_id)
				this.pay = res.data.totalPay
				console.log(this.pay);
			}
		},
		computed:{
			...mapState({userInfo:state=>state.user.userinfo,user_id:state => state.user.openid})
		},
		onLoad() {
			this.getUserPay()
		}
	}
</script>

<style lang="scss" scoped>
.container{
		// width: 100vw;
		// height: 100vh;
		display: flex;
		align-items: center;
		// justify-content: center;
		flex-direction: column;
		image{
			margin-top: 200rpx;
			margin-bottom: 50rpx;
			width: 150rpx;
			height: 150rpx;
		}
		text{
			font-size: 24rpx;
			margin-bottom: 30rpx;
			
		}
		}
</style>
