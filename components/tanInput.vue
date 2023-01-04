<template>
		<view class="input_container">
				<text class="title">{{title}}</text>
			<input type="text" name="" :value="value" class="input" :placeholder="placeholder" @input="$emit('input', $event.target.value)">
				<slot></slot>
		</view>
</template> 

<script>
	export default {
		name:'tanInput',
		props:['value','title','placeholder'],
		data() {
			return {

			}
		},
		methods: {
		}
	}
</script>


<style scoped lang="scss">
		.input_container{
			background-color: #fff;
			height: 100rpx;
			display: flex;
			align-items: center;
			// justify-content: space-between;
			font-size: 29rpx;
			border-bottom:2rpx solid #eeeeee;
			.title{
				// display: flex;
				margin-left: 40rpx;
				width: 140rpx;
			}
			.input{
				// width: 400rpx;
				// margin-left: 40rpx;
				font-size: 28rpx;
				flex:1;
				// background-color: #f2f;
			}
			.icon{
				image{
					width: 30rpx;
					height: 30rpx;
				}
				// margin-right: 20rpx;
				// margin-left: 20rpx;
			}
		}
</style>