<script>
	export default {
		onLoad() {
			
		},
		onShow: function() {
			console.log('App Show')
			// this.$store.dispatch('login')
			
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-ui/index.scss";
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';
	

	// 设置整个项目的背景色
	page {
		background-color: #f5f5f5;
	}
	
	.font-12{
		font-size: 24rpx;
		color: rgb(152, 152, 152);
	}

	/* #endif */
	.example-info {
		font-size: 14rpx;
		padding: 10rpx;
	}
</style>
