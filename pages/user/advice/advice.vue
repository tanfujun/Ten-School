<template>
	<view class="container">
		<textarea name="advice" id="advice" placeholder="请填写您的宝贵意见!" v-model="advice" ></textarea>
		<view class="button" @tap="pushAdvice">
			<text>提交建议</text>
		</view>
	</view>
</template>

<script>
	const adviceCloud = uniCloud.importObject('advice')
	export default {
		data() {
			return {
				advice:''
			}
		},
		methods: {
			async pushAdvice(){
				let user_id = uni.getStorageSync('openid')
				if(this.advice){
					let result = await adviceCloud.addAdvice({advice_text:this.advice,user_id})
					if(result.status === 200){
						uni.showToast({
							title:'反馈成功！'
						})
						this.advice = ''
					}
				}else{
					uni.showToast({
						title:'请输入内容',
						icon:"error"
					})
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.container{
		padding: 60rpx 40rpx;
		#advice{
			box-sizing: border-box;
			width: 100%;
			height: 300rpx;
			background-color: #fff;
			border: 2rpx solid #cecece;
			font-size: 28rpx;
			padding: 20rpx 20rpx;
		}
		.button{
			width: 100%;
			background-color: #000000;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 40rpx;
			height: 100rpx;
			color: #fff;
			font-size: 36rpx;
			border-radius: 10rpx;
		}
		
	}
</style>
