<template>
	<view class="container">
		<text class="top-text">当前城市</text>
		<van-empty v-if="addressList.length<1" description="暂时无地址" />
		<van-swipe-cell right-width="60" v-for="address in addressList" :key="address._id">
			<view class="address-container" @tap="choose(address)">
				<view class="top">
					<view class="address">
						<text class="right"><text class="default" v-if="address.isdefault==1">默认</text>{{address.address}}</text>
						</view>
						<view class="update-address" @click.stop="updateAddress(address._id)">
							<image src="../../../static/address/修改.png" mode=""></image>
						</view>
				</view>
				<view class="bottom">
					<text style="margin-right: 20rpx;">{{address.name}}{{address.sex==1?"(先生)":"(女士)"}}</text><text>{{address.phone}}</text>
				</view>
			</view>
		  <view slot="right" @tap="deleteAddress(address._id)" class="van-swipe-cell__right">删除</view>
		</van-swipe-cell>
		
		
		<view class="button" @tap="gotoAdd">
			<image src="../../../static/address/加_色块.png" mode=""></image>
			<text>添加地址</text>
		</view>
		<view style="height: 200rpx;">
			<text></text>
		</view>
	</view>
	
	
</template>

<script>
	const addressCloud = uniCloud.importObject('address')
	export default {
		data() {
			return {
				addressList:[]
			}
		},
		methods: {
			
			async getAddress(){
				let openid = uni.getStorageSync('openid')
				let addressList = await addressCloud.getUserAddress(openid)
				let index = addressList.findIndex(item => item.isdefault===1)
				if(index !== -1){
					let arr = addressList[0]
					addressList[0] = addressList[index]
					addressList[index] = arr
				}
				
				this.addressList = addressList
			},
			gotoAdd(){
				uni.navigateTo({
					url:'/pages/user/add/add'
				})
			},
			updateAddress(id){
				uni.navigateTo({
					url:`/pages/user/add/add?address_id=${id}`,
				})
			},
			async deleteAddress(id){
				let result = await addressCloud.deleteAddress(id)
				if(result.status === 200){
					uni.showToast({
						title:'删除成功！'
					})
					setTimeout(()=>{this.getAddress()},1000)
					
				}else{
					
					uni.showToast({
						title:'删除失败！',
						icon:"error"
					})
				}
			},
			choose(address){
				this.$store.commit('SET_ADDRESS',address)
				// uni.navigateTo({
				// 	url:'/pages/purchase/purchase'
				// })
				let pages = getCurrentPages()
				let prevPages = pages[pages.length -2]
				prevPages.$vm.phone = address.phone
				prevPages.$vm.address = address.address
				// prevPages.$vm.voucher_user_id = voucher_user_id
				uni.navigateBack()
			}
		},
		onLoad() {
			// console.log(this.getAddress);
			this.getAddress()
		}
	}
</script>

<style>
	page{
		background-color: #f7f7f7;
		box-sizing: border-box;
	}
</style>


<style scoped lang="scss">
	.container{
		width: 100%;
		padding-top: 40rpx;
		.van-swipe-cell__right{
			background-color: #ee0a24;
			box-sizing: border-box;
			width: 120rpx;
			height: 100%;
			display: flex;
			color: #fff;
			// font-size: 20rpx
			justify-content: center;
			align-items: center;
		}
		.top-text{
			margin-left: 30rpx;
			font-size: 26rpx;
			font-weight: bold;
		}
		.address-container{
			box-sizing: border-box;
			width: 100%;
			background-color: #ffffff;
			height: 200rpx;
			margin-top: 20rpx;
			padding-left: 40rpx;
			padding-top: 5rpx;
			.top{
				width: 100%;
				margin-top: 20rpx;
				display: flex;
				height: 80rpx;
				padding-right: 20rpx;
				box-sizing: border-box;
				justify-content: space-between;
				align-items: flex-start;
				.address{
						display: flex;
						.right{
							font-size: 28rpx;
							font-weight: bold;
							line-height: 50rpx;
							display: block;
						}
						width: 70%;
						.default{
							color: #b2ab87;
							font-size: 22rpx;
							border:1rpx solid #b2ab87;
							padding: 4rpx;
							margin-right: 4rpx;
							// display: inline-block;
						}
					}
				.update-address{
					margin-right: 20rpx;
					image{
						height: 30rpx;
						width: 30rpx;
					}
				}
			}
			.bottom{
				color: #949494;
				margin-top: 20rpx;
				font-size: 27rpx;
			}
			
		}
		.button{
			width: 90%;
			// margin: 0 auto;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100rpx;
			position: fixed;
			bottom: 25rpx;
			left: 30rpx;
			background-color: #000000;
			color: #ffffff;
			image{
				width: 30rpx;
				height: 30rpx;
				margin-right: 10rpx;
			}
		}
	}
</style>
