<template>
	<view class="container">
		<tan-input v-model="address.name" title='联系人' placeholder="请输入收货人的姓名">
		</tan-input>
		<view class="radio_container">
				<text class="title">性别</text>
				<view class="input">
					<radio-group  @change="updateSex">
						<label class="radio">
							<radio color="#000" style="transform:scale(0.7)" value="1" :checked="isMan" /><text>先生</text>
						</label>
						<label class="secRadio">
							<radio color="#000" style="transform:scale(0.7)" value="0" :checked="isWoman" /><text>女士</text>
						</label>
					</radio-group>
				</view>	
		</view>
		<tan-input v-model="address.phone"  title="手机号" placeholder="请填写收货手机号码" style="margin-top: 20rpx;">
		</tan-input>
		<tan-input v-model="address.address" title="收货地址" placeholder="请填写收货地址">
		</tan-input>
		<view class="radio_bottom">
				<view :class="address.isdefault===1?'Radio':'active'" @tap="changeDefault">
					<image src="../../../static/address/对勾小.png" mode=""></image>
				</view>
					<text>设为默认地址</text>

		</view>
		<view style="width:100%;display: flex;justify-content:center;position: fixed;bottom: 40rpx;">
			<tan-button  width="650rpx" text="保存" @tap="update"></tan-button>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template> 

<script>
	const addressCloud = uniCloud.importObject('address')
	import tanInput from '@/pages/user/add/tanInput.vue'
	export default {
		components:{
			tanInput
		},
		computed:{
			sexTitle(){
				return this.address.sex===1?'男':'女'
			}
		},
		data() {
			return {
				isChecked:true,
				address:{
					name:'',
					sex:'',
					phone:'', 
					address:'',
					isdefault:0,
					user_id:''
				},
				isMan:false,
				isWoman:false,
				address_id:''
			}
		},
		methods: {
			async update(){
				// console.log(this.address);
				let pages = getCurrentPages()
				let beforePage = pages[pages.length-2]
				this.address.user_id = uni.getStorageSync('openid')
				try{
					if(this.address_id){
						if(this.address.address == ''||this.address.name == ''||this.address.phone == ''||this.address.sex == ''){
								this.$refs.uToast.show({
							type: 'error',
							icon: false,
							message: "请将信息补全！",
							iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
						})
						}else{
							console.log(this.address,this.address_id);
							await addressCloud.updateAddress(this.address,this.address_id) 
							uni.showToast({
								title:'保存成功！'
							})
							// uni.navigateTo({
							// 	url:'/pages/user/address/address'
							// })
							uni.navigateBack({
								success:function(){
									beforePage.onLoad()
								}
							})
						}

					}else{
						if(this.address.address == ''||this.address.name == ''||this.address.phone == ''||this.address.sex == ''){
							this.$refs.uToast.show({
						type: 'error',
						icon: false,
						message: "请将信息补全！",
						iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
					})
						}else{
							await addressCloud.updateAddress(this.address)
							uni.navigateBack({
								success:function(){
									beforePage.onLoad()
								}
							})
							uni.showToast({
								title:'保存成功！'
							})
						}

					}
				}catch(e){
					uni.showToast({
						title:'保存失败！',
					})
				}
				
			},
			updateSex(e){
				this.address.sex = e.detail.value
				console.log(e.detail.value);
			},
			changeDefault(){
				if(this.address.isdefault){
					this.address.isdefault = 0
				}else{
					this.address.isdefault = 1
				}
			}
			
		},
		async onLoad(query){
			if(query.address_id){
				let result = await addressCloud.getAddress(query.address_id);
				this.address_id = query.address_id
				this.address.name = result[0].name
				this.address.phone = result[0].phone
				this.address.sex = result[0].sex
				this.address.user_id = result[0].user_id
				this.address.isdefault = result[0].isdefault
				// console.log(this.sex);
				this.address.address = result[0].address
				console.log(result[0].sex,result[0].sex===1);
				if(result[0].sex==1){
					this.isMan = true
				}else{
					this.isWoman = true
				}
			}
		}
	}
</script>

<style>
page{
	background-color: #f7f7f7;
}
</style>

<style scoped lang="scss">
	.container{
		// padding-bottom: 200rpx;
		box-sizing: border-box;
		// padding-top: 40rpx;
		.radio_container{
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
				width: 135rpx;
			}
			.input{
				// width: 400rpx;
				// margin-left: 60rpx;
				font-size: 28rpx;
				flex:1;
				display: flex;
				.radio{
					color: #000;
				}
				.secRadio{
					margin-left: 60rpx;
				}
				justify-content: flex-start;
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
		.radio_bottom{
			background-color: #fff;
			height: 100rpx;
			display: flex;
			align-items: center;
			// justify-content: space-between;
			font-size: 29rpx;
			border-bottom:2rpx solid #e4e4e4;
			.Radio{
				image{
					width: 35rpx;
					height: 35rpx;
				}
				width: 35rpx;
				height: 35rpx;
				margin-top: 4rpx;
				margin-right: 15rpx;
				border: 1rpx solid #e4e4e4;
				border-radius: 100rpx;
				margin-left: 40rpx;
				
			}
			.active{
				// @extend .Radio;
				width: 35rpx;
				height: 35rpx;
				border: 1rpx solid #e4e4e4;
				border-radius: 100rpx;
				margin-top: 4rpx;
				margin-right: 15rpx;
				margin-left: 40rpx; 
				image{
					display: none;
				}
			}
		}
	}
</style>