import { createStackNavigator } from 'react-navigation-stack';
import  RestaurantsScreen  from '../screens/Restaurants';
import AddRestaurants from '../screens/Restaurants/AddRestaurants'

const RestaurantsScreenStacks =  createStackNavigator({
	Restaurants: {
		screen : RestaurantsScreen,
		navigationOptions:() => ({
			title : "Restaurantes"
		})
	},
	AddRestaurants:{
		screen:AddRestaurants,
		navigationOptions: () => ({
			title: "Agregar Restaurante"
		})
	}
});



export default RestaurantsScreenStacks;