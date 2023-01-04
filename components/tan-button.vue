<template>
	<view class="button" :style="{width,height}">
		<slot></slot>
		<text>{{text}}</text>
	</view>
</template>

<script>
	export default {
		name:"tan-button",
		props:['width','height','text'],
		data() {
			return {
				
			};
		}
	}
</script>

<style scoped lang="scss">
	.button{
		height: 100rpx;
		width: 100%;
		min-width: 200rpx;
		background-color: #000;
		display: flex;
		justify-content: center;
		align-items: center;
		color:#fff;
		font-size: 30rpx;
	}

</style>