const meal = uniCloud.importObject('meal')

const state = {
		takein:true,
		shop_id:uni.getStorageInfoSync('shop_id'),
		mealInfo:{}
		
}

const mutations = {
	SET_TAKEIN(state,type){
		state.takein = type
	},
	SET_SHOP_ID(state,id){
		state.shop_id = id
		uni.setStorageSync('shop_id',id)
	},
	SET_MEALINFO(state,mealInfo){
		state.mealInfo = {...mealInfo}
	}
}

const actions = {
	async getMealInfo({state,commit},shop_id){
		let result = await meal.getMealByShop(shop_id)
		console.log(result,shop_id);
		if(result.code == 200){
			commit('SET_MEALINFO',result.data)
			console.log('mealInfo:',state.mealInfo.meal_data._id.shop_meal);
		}

	}
}

export default {state,mutations,actions}