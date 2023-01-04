<template>
	<view class="container">
		<u-search :clearabled="true" margin="20rpx 20rpx" bgColor="#fff" placeholder="搜索商家店铺名称" borderColor="#eee" @search="search" :showAction="false" v-model="keyword"></u-search>
		<u-sticky bgColor="#fff">
			<view style="height: 80rpx;display: flex;align-items: center;">
				<u-tabs
				    :list="list1"
				    lineWidth="20"
				    lineHeight="7"
				    :lineColor="`url(${lineBg}) 100% 100%`"
				    :activeStyle="{
				        color: '#303133',
				        fontWeight: 'bold',
				        transform: 'scale(1.05)'
				    }"
					@change="getInfo"
				    :inactiveStyle="{
				        color: '#606266',
				        transform: 'scale(1)',
				    }"
				    itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;"
				    >
				    </u-tabs>
			</view>
		  </u-sticky>
		  <u-empty
		  	v-if="ShopList.length<=0&&showWinner==false"
		          mode="data"
		  		text="列表暂时为空~"
		          icon="http://cdn.uviewui.com/uview/empty/data.png"
		  >
		  </u-empty>
		  <view class="card_container" v-show="!showWinner">
				<view class="card" v-for="item in ShopList" :key="item._id" @click="gotoPurchase(item._id)">
					<u--image :src="item.shop_img" width="200rpx" height="200rpx" radius="10rpx"></u--image>
					<view class="right">
						<view class="title">
							<u--text :lines="1" bold :text="item.shop_name" size="30rpx"></u--text>
							<text class="on $u-primary">营业中</text>
						</view>
						
						<view class="text_info">
							<text  class="u-info">{{item.shop_opentime}}</text>
						</view>
						<view class="text_info">
							<text  class="u-info">起送 ￥0</text><text class="u-info" style="margin-left: 5rpx;">配送 约￥1</text>
						</view>
						<view class="stand_container" style="margin-top: 15rpx;">
								<text class="stand $u-warning-dark">{{item.shop_stand}}</text> 
						</view>
							
						
					</view>
				</view>
		  </view>
		  <winnerMeal v-show="showWinner"></winnerMeal>
	</view>
</template>

<script>
	const shop = uniCloud.importObject('shop')
	const special_tool = uniCloud.importObject('special_tool')
	import winnerMeal from './winnerMeal.vue'
	export default {
		components:{
			winnerMeal
		},
		data() {
			return {
				keyword:'',
				showWinner:false,
				lineBg:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAOCAYAAABdC15GAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFxSURBVHgBzZNRTsJAEIb/WTW+lpiY+FZPIDew3ABP4GJ8hxsI9zBpOYHeQDwBPQI+mRiRvpLojtPdYhCorQqF/6GdbGd2vvwzBXZcNAt4oj1ANeUoAT5iqkUjbEFLHNmhD1YPEvpZ3ghkGlVDCkc94/BmHMq998I5ONiY1ZBfpKAyuOtgAc5yOEDmYEWNh32BHF91sGHZHmwW4azciN9aQwnz3SJEgOmte+R2tdLprTYoa50mvuomlLpD4Y3oQZnov6D2RzCqI93bWOHaEmAGqQUyRBlZR1WfarcD/EJ2z8DtzDGvsMCwpm8XOCfDUsVOCYhiqRxI/CTQo4UOvjzO7Pow18vfywneuUHHUUxLn55lLw5JFpZ8bEUcY8oXdOLWiHLTxvoGpLqoUmy6dBT15o/ox3znpoycAmxUsiJTbs1cmxeVKp+0zmFIS7bGWiVghC7Vwse8jFKAX9eljh4ggKLLv7uaQvG9/F59Oo2SouxPu7OTCxN/s8wAAAAASUVORK5CYII=',
				list1: [{
				          name: '南区饭堂',
				                }, {
				                    name: '北区饭堂',
				                }, {
				                    name: '饭菜推荐',
									badge:{
										isDot:true
									}
				                },],
				ShopList:[],
			};
		},
		methods:{
			async search(){
				console.log(this.keyword);
				const shop = uniCloud.importObject('shop')
				let res = await shop.searchShop({name:this.keyword})
				if(res.code == 200){
					this.ShopList = res.data
				}	
			},
			async gotoPurchase(shop_id){
				this.$store.commit('SET_SHOP_ID',shop_id)
				await this.$store.dispatch('getMealInfo',shop_id)
				uni.navigateTo({
					url:`/pages/purchase/purchase`
				},true)
			},
			async getNorthShopInfo(){
				let result = await shop.getShopByLoc("北区")
				this.ShopList = result.data
				console.log(this.ShopList);
			},
			async getSouthShopInfo(){
				let result = await shop.getShopByLoc("南区")
				this.ShopList = result.data
			},
			async getWinnerMeal(){
				let result = await special_tool.winnerMeal()
				this.$store.commit('SET_WINNERMEAL',result.data)
			},
			async getInfo(item){
				if(item.index == 0){
					this.getSouthShopInfo()
					console.log(this.showWinner);
				}
				
				if(item.index == 1){
					this.getNorthShopInfo()
					console.log(this.showWinner);
				}
				if(item.index == 2){
					await this.getWinnerMeal()
					this.showWinner = true
					return
				}
				this.showWinner = false
			}
		},
		onLoad() {
			this.getSouthShopInfo()
		}
	}
</script>

<style>
	page{
		/* background-color: #fff; */
	}
</style>
<style lang="scss" scoped>
		.container{
			.card_container{
				padding: 10rpx 10rpx;
				
				.card{
					padding: 15rpx;
					border-radius: 10rpx;
					background-color: #fff;
					margin-bottom: 10rpx;
					display: flex;
					.right{
						flex: 1;
						margin-left: 10rpx;
						.title{
							display: flex;
							.on{
								background-color: $u-primary-light;
								font-size: 22rpx;
								border-radius: 10rpx;
								padding: 5rpx;
							}
							
						}
						.text_info{
							display: flex;
							margin-top: 5rpx;
							font-size: 22rpx
						}
						.stand_container{
							.stand{
								background-color: $u-warning-light;
								// margin-top: 15rpx;
								// display: block;
								font-size: 22rpx;
								// max-width: 350rpx;
								border-radius: 10rpx;
								padding: 5rpx;
								white-space: nowrap;
								overflow: hidden;
								text-overflow: ellipsis;
							}
						}
						
					}
				}
			}
		}
</style>
