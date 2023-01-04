<template>
	<view class="container">

		<!-- 搜索框 -->
		<view class="search" @tap="openDrawer">
			<view class="search-input" @tap="showSearch=true">
				<image src="/static/common/search-icon.png" class="search-icon"></image>
				<view>搜索</view>
			</view>
		</view>
		<!-- 定位 -->
		<shopShow></shopShow>
		<view class="position">
			<view class="left">
				<view style="height: 80rpx;display: flex;align-items: center;">
					<u-tabs
					    :list="list1"
						@click="changePage"
					    lineWidth="20"
					    lineHeight="7"
						:current="current_index"
					    :lineColor="`url(${lineBg}) 100% 100%`"
					    :activeStyle="{
					        color: '#303133',
					        fontWeight: 'bold',
					        transform: 'scale(1.05)'
					    }"
					    :inactiveStyle="{
					        color: '#606266',
					        transform: 'scale(1)',
					    }"
					    itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;"
					    >
					    </u-tabs>
				</view>
<!-- 				<view class="shop_name">
					<image src="../../static/common/star_normal.png" class="icon" mode=""></image>
					<text style="overflow: hidden;text-overflow: ellipsis;">{{takein?'广州航海学院店':address.address}}</text>
					<image src="../../static/common/black_arrow_right.png" style="width: 40rpx;height: 40rpx;margin-left: 5rpx;margin-top: 4rpx;" mode=""></image>
				</view>
				<text class="meter">距我666m</text> -->
			</view>
			<view class="right">
				<view :class="takein?'active':'ziqu'" @tap="updateTakein(true)">
					<text>取号</text>
				</view>
				<view :class="takein?'waimai':'active'" @tap="updateTakein(false)">
					<text>外卖</text>
				</view>
			</view>
		</view> 
		<u-line color="#eee"></u-line>
		<!-- 提示 -->
		<view class="tip"></view>

		<!-- 主体内容 -->
		<comment v-show="!show_goods" ></comment>
		<view class="context" v-show="show_goods">
	
				<!-- 左侧tabbar栏 -->
<!-- 				<van-col span="6">
					<scroll-view class="left" scroll-y="true" scroll-with-animation>
						<view :class="(active === item._id ?'active' : '')" @click="activeTap(item._id)"
							v-for="item in CategoryList" :key="item._id"> 
							<image :src="item.category_image_url" mode=""></image>
							<text>{{item.name}}</text>
						</view>
					</scroll-view>
				</van-col> -->
				<!-- 右侧商品 -->
		<scroll-view class="right" scroll-y="true" scroll-with-animation :scroll-top="scrollTop"
						@scroll="handlescroll">
						<view class="scroll-right" v-for="item in CategoryList" :key="item._id">
							<!-- <text class="categoryName">{{item.meal_name}}</text> -->
							<view class="product" >
								<image :src="item.meal_img" mode="" @tap="openPopup(item._id)"></image>
								<view class="product-right">
									<text class="good-name" @tap="openPopup(item._id)">{{item.meal_name}}</text>
									<view class="description" @tap="openPopup(item._id)">{{item.meal_desc}}</view>
									<view class="bottom">
										<text class="price">￥{{item.meal_price}}</text>
										<view class="add">
											<image v-show="item.num>0" @tap="subtract(item._id)" class="icon" style="margin-right: 10rpx;" src="../../static/purcase/subtract.png" mode=""></image>
											<text v-show="item.num>0">{{item.num}}</text>
											<image class="icon" style="margin-left: 10rpx;" @tap="add(item._id)" src="../../static/purcase/add.png" mode=""></image>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="" style="height: 150rpx;">
							
						</view>
					</scroll-view>



		</view>

		<!-- 购物车（固定在底部） -->
		<view class="cart" v-if="cart.length>=1">
			<view class="left" @tap="openCart">
				<image src="../../static/purcase/购物.png" mode=""></image>
			</view>
			<view class="price">
				<text>￥{{totalPrice}}</text>
			</view>
			<view class="settle" @tap="gotoAddOrder">
				<text>结算</text>
			</view>
		</view>
		
		
		<!-- 购物车详情（弹窗） -->
		<uni-popup ref="cart" background-color="#fff">
				<view class="cart_detail">
					<view class="top">
						<view class="left">
							<text class="mendian">门店订单<text class="blue">自提/外送</text></text>
						</view>
						<view class="right" @tap="DeleteCart">
							<image src="../../static/common/delete.png" class="icon" mode=""></image>
							<text>清空购物车</text>
						</view>
					</view>
					<scroll-view style="max-height: 670rpx;"  scroll-y="true" scroll-with-animation>
					<view class="detail" v-for="good in cart">
						<image :src="good.meal_img" mode=""></image>
						<view class="right">
							<view class="title">
								<text>{{good.meal_name}}</text>
							</view>
							<view class="label">
								
							</view>
							<view class="price">
								<text>￥{{good.meal_price}}</text>
								<view class="add">
										<image v-show="good.num>0" @tap="subtract(good._id)" class="icon" style="margin-right: 10rpx;" src="../../static/purcase/subtract.png" mode=""></image>
									<text v-show="good.num>0">{{good.num}}</text>
									<image class="icon" style="margin-left: 10rpx;" @tap="add(good._id)" src="../../static/purcase/add.png" mode=""></image>
								</view>
							</view>
						</view>
					</view>
					</scroll-view>
					<view class="" style="height: 100rpx;"></view>
				</view>
		</uni-popup>
		
		<!-- 抽屉，搜索商品内容 -->
		<uni-drawer ref="showRight" mode="left" :mask-click="false">
			<view class="search-container">
				<uni-search-bar clearButton="always" cancelButton="always" placeholder="请输入搜索商品名称" @input="search"  :focus="isfocus" v-model="searchValue"
								@cancel="cancel" >
				</uni-search-bar>
				
				<view class="showSearchList" v-if="searchList.length>=1" >
					<scroll-view scroll-y="true" >
						<view class="milk" v-for="item in searchList" @tap="openPopup(item._id)">
							<view class="left">
								<image :src="item.meal_img"></image>
								<text>{{item.meal_name}}</text>
							</view>
							<view class="right">
								<text>￥{{item.meal_price}}</text>
							</view>
						</view>
					</scroll-view>
				</view>
				
<!-- 				<view class="context" v-else >
					<view class="history">
						<text class="title">历史搜索</text>
						<view class="label-container">
						<text class="label" v-for="label in historySearch" @tap="openPopup(label._id)">
								{{label.name}}
							</text>
						</view>
					</view>
					<view class="hot">
						<text class="title">热门搜索</text>
						<view class="label-container">
						<text class="label" v-for="label in hotSearch" @tap="openPopup(label._id)">
								{{label.name}}
							</text>
						</view>
					</view>
					
				</view> -->
			</view>
		</uni-drawer>
		
		<!-- 商品详细（弹窗） -->
		<uni-popup ref="popup" background-color="#fff" >
			<view class="good_detail">
				<view class="image_container">
					<image :src="milk_detail.meal_img" mode=""></image>
					<image @tap="closePopup" style="height: 60rpx;width: 60rpx;" class="icon" src="../../static/purcase/304错误、关闭、取消-圆框.png" mode=""></image>
				</view>
				
				<view class="context">
					<text class="milk_name">{{milk_detail.meal_name}}</text>
					<view class="label_container">
						
					</view>
					<text class="title">产品描述</text>
					<text class="description">{{milk_detail.meal_desc}}</text>
				</view>
				<view style="border-bottom: 0.5rpx solid #e5e5e5;margin-top: 60rpx;" class="">
					
				</view>
				<view class="bottom">
					<view class="price">
						<text>￥{{milk_detail.meal_price}}</text>
						<view class="add">
							<image v-show="milk_detail.num>0" @tap="subtract(milk_detail._id)" class="icon" style="margin-right: 10rpx;" src="../../static/purcase/subtract.png" mode=""></image>
							<text v-show="milk_detail.num>0">{{milk_detail.num}}</text>
							<image class="icon" style="margin-left: 10rpx;" @tap="add(milk_detail._id)" src="../../static/purcase/add.png" mode=""></image>
						</view>
					</view>
					<view class="button" @tap="closePopup(milk_detail._id)">
						<text>添加至购物车</text>
						
					</view>
				</view>
			</view>
				
		</uni-popup>
	</view>
	
</template>

<script>
	const meal = uniCloud.importObject('meal')
	import lodash from 'lodash'
	import shopShow from './shop_show.vue'
	import comment from './comment.vue'
	import {mapState} from 'vuex'
import { getMealByShop } from '../../uniCloud-aliyun/cloudfunctions/meal/index.obj'
	const goods = uniCloud.importObject('goods')
	export default {
		data() {
			return {
				active: 20,
				current_index:0,
				show_goods:true,
				scrollTop: 0,  //右侧商品滑动区当前的位置
				CategoryList:[], //分类列表及对应所有商品
				searchValue:'', //搜索内容
				searchList:[],  //搜索商品数组
				isfocus:true,
				isWaimai:false,
				lineBg:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAOCAYAAABdC15GAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFxSURBVHgBzZNRTsJAEIb/WTW+lpiY+FZPIDew3ABP4GJ8hxsI9zBpOYHeQDwBPQI+mRiRvpLojtPdYhCorQqF/6GdbGd2vvwzBXZcNAt4oj1ANeUoAT5iqkUjbEFLHNmhD1YPEvpZ3ghkGlVDCkc94/BmHMq998I5ONiY1ZBfpKAyuOtgAc5yOEDmYEWNh32BHF91sGHZHmwW4azciN9aQwnz3SJEgOmte+R2tdLprTYoa50mvuomlLpD4Y3oQZnov6D2RzCqI93bWOHaEmAGqQUyRBlZR1WfarcD/EJ2z8DtzDGvsMCwpm8XOCfDUsVOCYhiqRxI/CTQo4UOvjzO7Pow18vfywneuUHHUUxLn55lLw5JFpZ8bEUcY8oXdOLWiHLTxvoGpLqoUmy6dBT15o/ox3znpoycAmxUsiJTbs1cmxeVKp+0zmFIS7bGWiVghC7Vwse8jFKAX9eljh4ggKLLv7uaQvG9/F59Oo2SouxPu7OTCxN/s8wAAAAASUVORK5CYII=',
				//Tabs标签
				list1: [{
				          name: '商品',
				          }, 
						{
				        name: '店铺评价',
				          },],
				totalPrice:0,//购物车总价格
				cart:[],//购物车数据
				//商品详细信息
				milk_detail:{
					
				},
				historySearch:[
					{name:'芝芝莓莓 ®',
					_id:'6343cc93664ca50001e7b1db',
					},
					{name:'未来肉芝士堡',
					_id:'6343cccdf808ea000115228c',
					},
					{name:'混坚果',
					_id:'634430210a5aba0001e77825',
					},
					], //历史搜索
				hotSearch:[
					{name:'芝芝莓莓 ®',
					_id:'6343cc93664ca50001e7b1db',
					},
					{name:'夹心小方(咸蛋黄味)',
					_id:'63443052737e280001537712',
					},
					{name:'芝芝桃桃',
					_id:'634430e36758c00001276622',
					},
					{name:'多肉杨梅',
					_id:'63443111bf704d00011f3799',
					},
				] //热门搜索
			}
		},
		components:{
			shopShow,comment
		},
		watch:{
			//监视搜索框内容，当为空时清楚搜索商品数组
			searchValue(newVal){
				if(!newVal){
					this.searchList = []
				}
			},
			
			cart:{
				handler(newVal,oldVal){
					let price = 0 
					newVal.forEach(item => {
						price = price + item.num*item.meal_price
					})
					console.log('newCart:',newVal);
					this.totalPrice = price.toFixed(2)
					if(!newVal.length){
						this.CategoryList = this.CategoryList.map(item =>{item.num = 0; return item})
						this.$refs.cart.close()
						console.log(this.CategoryList);
					}
				},
				deep:true
			}
			
		},
		computed:{
			...mapState({shop_id:state=>state.order.shop_id,address:state => state.user.address,takein:state => state.order.takein,shop_meal:state=>state.order.mealInfo.meal_data._id.shop_meal})
		},
		methods: {
			//切换评论页面
			changePage(item){
				if(item.index == 0){
					this.show_goods = true
				}else{
					this.show_goods = false
				}
			},
			updateTakein(type){
				this.$store.commit('SET_TAKEIN',type)
			},
			gotoAddress(){
				uni.navigateTo({
					url:'/pages/user/address/address'
				},true)
			},
			gotoAddOrder(){
				let cart = JSON.stringify(this.cart)
				uni.navigateTo({
					url:`/pages/order/addOrder/addOrder?cart=${cart}`
				},true)
			},
			DeleteCart(){
				this.cart = []
				this.$refs.cart.close()
			},
			openCart(){
				this.$refs.cart.open('bottom')
			},
			subtract(id){
				let newList = this.CategoryList.map((item) =>{
					if(item._id == id){
						item.num--
						this.subtractCart(item)
						return item
					}else return item
				})
				this.CategoryList = newList
			},
			add(id){
				console.log(this.CategoryList,id);
				let newList = this.CategoryList.map((item) =>{
					if(item._id == id){
						item.num++
						this.addCart(item)
						return item
					}else return item
				})
				this.CategoryList = newList
			},
			addCart(good){
				let index = this.cart.findIndex(item => item._id === good._id)
				
				if(index === -1){
					this.cart.push(good)
				}else{

					 this.$set(this.cart,index,good)
					}
					console.log(this.cart);
			},
			subtractCart(good){
				let index = this.cart.findIndex(item => item._id == good._id)
				console.log(index,good.num);
				if(good.num == 0){
					this.cart.splice(index,1)
				}else{
					 this.$set(this.cart,index,good)
				}
				console.log(this.cart);
			},
			cancel(){
				this.$refs.showRight.close();
			},
			async search(value){
				console.log(value);
				if(value){
					let result = await meal.searchMealInShop({
						meal_forShop:this.shop_id,
						name:value
					})
					if(result.code == 200){
						this.searchList = result.data
					}
				}
				
			},
			
			handlescroll(e) {
			},
			get(){
				this.scrollTop = 20
				console.log(1232);
			},
			openDrawer(){
				this.isfocus = true
				this.$refs.showRight.open();
			},
			// 打开弹窗
			async openPopup(good_id){
				let result = await meal.getMealInfo(good_id)
				this.milk_detail = result.data[0]
				console.log('milk_detail:',this.milk_detail);
				this.$refs.showRight.close();
				this.$refs.popup.open('center')
			},
			closePopup(good_id){
				this.add(good_id)
				this.$refs.popup.close()
			},
		},
		created() {
			console.log(this.shop_meal);
		},
		async onLoad(query) {
			let CategoryList = this.shop_meal
			console.log(this.shop_meal);
			// console.log(CategoryList);
			CategoryList.forEach(item=>{
				item.num = 0 
			})
			console.log(query);
			if(query.show_goods=='false'){
				this.show_goods = false
				this.current_index = 1
			}
			this.CategoryList = CategoryList
			// this.$nextTick(()=>{
			// 	this.getModeHeight()
			// })
		}
	}
</script>

<style>
	page{
		background-color: #fff;
	}
</style>

<style scoped lang="scss">
	.container{
		background-color: #fff;
		
		.position{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 40rpx;
			padding-right: 40rpx;
			height: 120rpx;
			.left{
				width: 200rpx;
				// .shop_name{
				// 	display: flex;
				// 	align-items: center;
				// 	margin-top: 10rpx;
				// 	font-size: 32rpx;
				// 	font-weight: bold;
				// 	color: $text-color-base;
				// 	// max-width: 500rpx;
				// 	text{
				// 		// width: 300rpx;
				// 		max-width: 300rpx;
				// 		overflow: hidden;
				// 		display: -webkit-box;
				// 		-webkit-box-orient: vertical;
				// 		text-overflow: ellipsis;
				// 		-webkit-line-clamp: 1;
				// 	}
				// 	.icon{
				// 		margin-right: 10rpx;
				// 		width: 30rpx;
				// 		height: 30rpx;
				// 	}
				// }
				// .meter{
				// 	font-size: 28rpx;
				// 	color: $text-color-assist;
				// 	margin-top: 10rpx;
				// }
			}
			.right{
				display: flex;
				background-color: #f6f6f6;
				border: 1rpx solid #d9d9d9;
				border-radius: 40rpx;
				width: 220rpx;
				height: 70rpx;
				font-size: 26rpx;
				.ziqu{
					width: 50%;
					border-radius: 40rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #878787;
					
				}
				.waimai{
					width: 50%;
					border-radius: 40rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #878787;
				}
				.active{
					@extend .ziqu;
					color: #fff;
					background-color: #343434;
				}
			}
		}
		
		.search-container{
			width: 750rpx;
			box-sizing: border-box;
			height: 100vh;
			background-color: #fff;
			
			.showSearchList{
				padding: 0 40rpx;
				font-size: 28rpx;
				.milk{
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 20rpx;
					.left{
						display: flex;
						align-items: center;
						image{
							width: 150rpx;
							height: 150rpx;
							border-radius: 10rpx;
							margin-right: 10rpx;
							// height: 125rpx;
						}
					}
				}
			}
			
			.context{
				margin-top: 20rpx;
				padding: 0 40rpx;
				.history{
					display: flex;
					flex-direction: column;
					.title{
						font-size: 28rpx;
						font-weight: bold;
					}
					.label-container{
						// margin-top: 20rpx;
						display: flex;
						// justify-content: ;
						
						flex-wrap: wrap;
					}
				}
				.hot{
					margin-top: 100rpx;
					@extend .history
				}
				
				.label{
					background-color: #f5f5f7;
					border-radius: 30rpx;
					color: #8c8c8c;
					margin-right: 20rpx;
					margin-top: 20rpx;
					// display: inline-block;
					border: 2rpx solid #f5f5f7;
					font-size: 25rpx;
					padding: 6rpx 20rpx;
				}
				
			}
			
		}
	
		.good_detail{
			width: 675rpx;
			
			.image_container{
				position: relative;
				image{
					width: 100%;
					height: 400rpx;
				}
				.icon{
					position: absolute;
					right: 15rpx;
					top: 10rpx;
				}
			}
			
			.context{
				padding-left: 30rpx;
				padding-right: 20rpx;
				display: flex;
				flex-direction: column;
				box-sizing: border-box;
				
				.milk_name{
					font-size: 37rpx;
					font-weight: bold;
				}
				.title{
					margin-top: 30rpx;
					font-size: 26rpx;
					color: #b4b4b4;
				}
				.description{
					margin-top: 10rpx;
					font-size: 26rpx;
					color: #b4b4b4;
				}
				
			}
			
			.bottom{
				margin-top: 20rpx;
				margin-bottom: 30rpx;
				padding: 0 30rpx;
				width: 100%;
				box-sizing: border-box;
				.price{
					font-size: 38rpx;
					font-weight: bold;
					margin-bottom: 30rpx;
					display: flex;
					justify-content: space-between;
				}
				.add{
					display: flex;
					align-items: center;
				}
				.button{
					width: 100%;
					height: 100rpx;
					display: flex;
					border-radius: 10rpx;
					background-color: #409eeb;
					justify-content: center;
					align-items: center;
					font-size: 30rpx;
					color: #ffffff;
				}
			}
			
			// height: 1000rpx;
			
		}
		
		.cart{
			position: fixed;
			bottom: 0;
			width: 100%;
			height: 100rpx;
			z-index: 999;
			display: flex;
			.left{
				width: 120rpx;
				height: 120rpx;
				border-radius: 100rpx;
				background-color: #fff;
				position: absolute;
				bottom: 15rpx;
				left: 15rpx;
				box-shadow: $box-shadow;
				display: flex;
				align-items: center;
				justify-content: center;
				image{
					width: 80rpx;
					height: 80rpx;
					
				}
			}
			.price{
				background-color: #f0f0f1;
				flex: 1;
				padding-left: 140rpx;
				padding-top: 15rpx;
				font-size: 42rpx;
				font-weight: bold;
			}
			.settle{
				background-color: #409eeb;
				width: 200rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #ffffff;
			}
		}
	
		.cart_detail{
			// height: 500rpx;
			box-sizing: border-box;
			.top{
				display: flex;
				justify-content: space-between;
				height: 100rpx;
				align-items: center;
				padding: 0 20rpx;
				border-bottom: 1px solid #d9d9d9;
				.left{
					display: flex;
					align-items: center;
					.mendian{
						font-size: 30rpx;
						font-weight: bold;
					}
					.blue{
						font-size: 20rpx;
						color: #409eeb;
						margin-left: 10rpx;
						margin-bottom: 10rpx;
						border: 2rpx solid #409eeb;
						padding: 2rpx 8rpx;
					}
				}
				.right{
					display: flex;
					font-size: 28rpx;
					color: #b4b4b4;
				}
			}
			.detail{
				display: flex;
				width: 100%;
				border-bottom: 1px solid #d9d9d9;
				padding-bottom: 20rpx;
				box-sizing: border-box;
				image{
					width: 220rpx;
					height: 200rpx;
				}
				.right{
					flex: 1;
					display: flex;
					margin-left: 10rpx;
					flex-direction: column;
					// align-items: flex-end;
					.title{
						margin-top: 26rpx;
						font-weight: bold;
						color: $text-color-base;
						// flex: 1;
						font-size: 30rpx;
					}
					.label{
						// flex: 1;
						display: flex;
						margin-top: 5rpx;
						flex-direction: column;
						justify-content: flex-start;
						font-size: 24rpx;
						color: #b4b4b4;
						// align-items: flex-start;
					}
					.price{
						display: flex;
						justify-content: space-between;
						align-items: flex-end;
						flex: 1;
						color: $text-color-base;
						font-size: 34rpx;
						.add{
							display: flex;
							align-items: center;
							margin-right: 20rpx;
							image{
								width: 40rpx;
								height: 40rpx;
							}
						}
					}
				}
			}
		}
	}
	.icon{
		width: 40rpx;
		height: 40rpx;
	}
	.search {
		width: 100%;
		margin-top: 20rpx;
		padding-left: 40rpx;
		padding-right: 40rpx;
		box-sizing: border-box;

		.search-input {
			height: 60rpx;
			background-color: #eaeaea;
			border-radius: 40rpx;
			width: 100%;
			// height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28rpx;

			.search-icon {
				width: 30rpx;
				height: 30rpx;
				margin-right: 10rpx;
			}
		}
		
		
	}

	.context {
		width: 100%;
		margin-top: 20rpx;
		box-sizing: border-box;
		padding-right: 35rpx;
		.left {
			height: 1178rpx;
			background-color: #f6f6f6;
			view {
				background-color: #f6f6f6;
				height: 150rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				font-size: 28rpx;
				color: #8c8c8c;
				image{
					height: 60rpx;
					width: 50rpx;
					margin-bottom: 10rpx;
				}
				&.active {
					background-color: #ffffff;
					color: #2d2d2d;
					border-left: 7rpx solid rgb(219, 168, 133);
				}
			}
		}

		.right {
			height: 1178rpx;
			margin-left: 20rpx;
			margin-top: 20rpx;
			width: 100%;
			
			.scroll-right{
				display: flex;
				flex-direction: column;
				.categoryName{
					color: #8c8c8c;
					font-size: 28rpx;
					margin-top: 10rpx;
					margin-bottom: 10rpx;
				}
					.product{
						display: flex;
						align-items: center;
						margin-top: 10rpx;
						background-color: #fff;
						// margin-bottom: 10rpx;
						border: 2rpx solid #eee;
						border-radius: 10rpx;
						padding: 20rpx;
						width: 670rpx;
						// box-sizing: border-box;
						image{
							width: 230rpx;
							height: 200rpx;
							border-radius: 10rpx;
							margin-right: 20rpx;
						}
						.product-right{ 
							margin-left: 10rpx;
							display: flex;
							flex: 1;
							// padding-right: 50rpx;
							box-sizing: border-box;
							flex-direction: column;
							.good-name{ 
								font-size: 28rpx;
								color: #2d2d2d;
							}
							.description{
								margin-top: 20rpx;
								height: 65rpx;
								width: 100%;
								font-size: 25rpx;
								color: #8c8c8c;
								overflow:hidden;
								text-overflow:ellipsis;
								display:-webkit-box;
								-webkit-box-orient:vertical;
								-webkit-line-clamp:2;
							}
							.bottom{
								display: flex;
								width: 100%;
								justify-content: space-between;
								align-items: center;
								.price{
									margin-top: 20rpx;
									font-size: 35rpx;
									font-weight: bold;
								}
								.add{
									display: flex;
									flex: 1;
									justify-content: flex-end;
									align-items: center;
									.icon{
										width: 38rpx;
										height: 38rpx;
										
										
									}
									margin-top: 22rpx;
								}
							}
							
						}
					}
			}
			
		}
	}


</style>
