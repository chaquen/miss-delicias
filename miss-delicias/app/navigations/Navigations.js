import React from 'react';
import { Icon } from 'react-native-elements';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import RestaurantsScreenStacks from './RestaurantsStacks';
import TopListsScreenStacks from './TopListsStacks';
import SearchScreenStacks from './SearchStacks';
import MyAccountScreenStacks from './MyAccountStacks';

//Here write the stack of navigation
const NavigationStacks = createBottomTabNavigator({
	Restaurants:{
		screen: RestaurantsScreenStacks,
		navigationOptions: () => ({
			tabBarLabel:'Restaurantes',
			tabBarIcon: ({ tintColor }) => (
				<Icon
					type = 'material-community'
					name = 'silverware-fork-knife'
					size = {22}
					color = {tintColor}
				/>

			)
		})
	},
	TopLists:{
		screen: TopListsScreenStacks,
		navigationOptions: () => ({
			tabBarLabel:'Los mejores',
			tabBarIcon: ({ tintColor }) => (
				<Icon
					type = 'material-community'
					name = 'star-outline'
					size = {22}
					color = {tintColor}
				/>

			)
		})
	},
	Search:{
		screen: SearchScreenStacks,
		navigationOptions: () => ({
			tabBarLabel:'Buscar',
			tabBarIcon: ({ tintColor }) => (
				<Icon
					type = 'material-community'
					name = 'magnify'
					size = {22}
					color = {tintColor}
				/>

			)
		})
	},
	Account: { 
		screen:MyAccountScreenStacks,
		navigationOptions: () => ({
			tabBarLabel:'Mi cuenta',
			tabBarIcon: ({ tintColor }) => (
				<Icon
					type = 'material-community'
					name = 'home-account'
					size = {22}
					color = {tintColor}
				/>

			)
		})
	}
},
{
	//Routes Managment AQUI SE MARCA EN QUE SCREEN SE QUIERE ARRANCAR 
	initialRouteName:"Restaurants",
	order:["Restaurants","TopLists","Search","Account"],
	tabBarOptions:{
		inactiveTintColor: "#646464",
		activeTintColor: "#00a680"
	}
}); 

export default createAppContainer(NavigationStacks); 