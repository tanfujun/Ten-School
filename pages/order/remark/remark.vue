<template>
	<view class="container">
			<textarea class="input" v-model="remark"  placeholder="请输入备注"/>
			<view class="button" @tap="addRemark">
				<text>提交</text>
			</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				remark:''
			}
		},
		methods: {
			addRemark(){
				let pages = getCurrentPages()
				let prevPage = pages[pages.length - 2]
				prevPage.$vm.remark = this.remark
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped lang="scss">
	.container{
		box-sizing: border-box;
		padding: 0 40rpx;
		margin-top: 40rpx;
		.input{
			width: 100%;
			height: 300rpx;
			box-sizing: border-box;
			padding: 10rpx 10rpx;
			font-size: 28rpx;
			background-color: #fff;
			border: 2rpx solid #c7c7c7;
		}
		.button{
			background-color: #000;
			display: flex;
			border-radius: 10rpx;
			height: 100rpx;
			justify-content: center;
			align-items: center;
			color: #fff;
			font-size: 34rpx;
			margin-top: 80rpx;
		}
}
</style>
