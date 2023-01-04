<template>
	
	<view class="u-page">
		<view class="comment">
			<u--textarea v-model="comment" placeholder="请输入评价内容" count ></u--textarea>
			<view class="button">
				<view class="" style="width: 200rpx;">
				<u-button type="primary" size="mini" text="评价" @click="publish"></u-button>
				</view>
			</view>
		</view>

		<view class="u-demo-block" v-for="(item,index) in commentList" :key="item._id">
			<!-- <text class="u-demo-block__title">多图模式</text> -->
			<view class="u-demo-block__content">
				<view class="album">
					<view class="album__avatar" style="border-radius: 50%;">
						<image
						    :src="item.comment_writer[0].user_avatar"
						    mode=""
						    style="width: 64rpx;height: 64rpx;border-radius: 50%;"
						></image>
					</view>
					<view class="album__content">
						<u--text
						    :text="item.comment_writer[0].user_name"
						    color="#303133"
						    bold
						    size="30rpx"
						></u--text>
						<u--text
						    margin="0 0 16rpx 0"
							size="24rpx"
						    :text="item.comment_content"
						></u--text>
						<u--text
						    :text="getTime(item.comment_time)"
							type="info"
							size="22rpx"
							margin="0 0 16rpx 0"
						></u--text>
						<!-- <u-album :urls="urls2"></u-album>	 -->
					</view>
				</view>
			</view>
		</view>
<u-notify ref="uNotify" message="Hi uView"></u-notify>
	</view>
</template>

<script>
	import dayjs from 'dayjs'
	import {mapState} from 'vuex'
	const shop = uniCloud.importObject('shop')
	export default {
		data() {
			return {
				albumWidth: 0,
				show:true,
				comment:'',
				commentList:[],
				urls1: [{
					src2: 'https://cdn.uviewui.com/uview/album/1.jpg',
				}],
				urls2: [
					'https://cdn.uviewui.com/uview/album/1.jpg',
					'https://cdn.uviewui.com/uview/album/2.jpg',
					'https://cdn.uviewui.com/uview/album/3.jpg',
					'https://cdn.uviewui.com/uview/album/4.jpg',
					'https://cdn.uviewui.com/uview/album/5.jpg',
					'https://cdn.uviewui.com/uview/album/6.jpg',
					'https://cdn.uviewui.com/uview/album/7.jpg',
					'https://cdn.uviewui.com/uview/album/8.jpg',
					'https://cdn.uviewui.com/uview/album/9.jpg',
					'https://cdn.uviewui.com/uview/album/10.jpg',
				],
			}
		},
		computed:{
			...mapState({shop_id:state=>state.order.shop_id,user_id:state=>state.user.openid})
		},
		methods:{
			getTime(time){
				return dayjs(time).format("YYYY-MM-DD HH:mm")
			},
			change(){
				console.log(123);
			},
			async getComment(){
				let res = await shop.getShopComment(this.shop_id)
				if(res.code == 200){
					this.commentList = res.data.reverse()
					console.log(this.commentList);
				}
			},
			async publish(){
				if(this.comment == ''){
					this.$refs.uNotify.error('请输入评论内容！')
				}else{
					let result = await shop.addShopComment({comment_forShop:this.shop_id,comment_writer:this.user_id,comment_content:this.comment})
					if(result.code == 200){
							this.$refs.uNotify.success('发布成功！')
							this.comment = ''
							this.getComment()
					}
				}
				
				

				
			}
		},
		mounted() {
			this.getComment()
		}
	}
</script>

<style lang="scss">
	
	.u-page{
		.comment{
			// height: 400rpx;
			.button{
				display: flex;
				width: 100%;
				justify-content: flex-end;
				margin: 20rpx 0rpx;
			}
		}
	}
	.u-page{
		padding: 0 30rpx;
		.u-demo-block{
			margin-top: 20rpx;
			border-bottom: 2rpx solid #eee
		}
		.u-demo-block__content{
			margin-bottom: 10rpx;
			
		}
	}
	.album {
		@include flex;
		align-items: flex-start;

		&__avatar {
			background-color: $u-bg-color;
			// padding: 5px;
			// border-radius: 3px;
		}

		&__content {
			margin-left: 10px;
			flex: 1;
		}
	}
</style>