const state = {
	winnerMeal:[]
}

const mutations = {
	SET_WINNERMEAL(state,mealList){
		state.winnerMeal = mealList
		console.log(state.winnerMeal);
	}
}

const actions = {}

export default {state,mutations,actions}