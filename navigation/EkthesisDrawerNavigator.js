import React from 'react';
import { Platform, Text } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';

import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import Colours from '../constants/Colours';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CategoriesScreen from '../screens/shop/CategoriesScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import FavoritesScreen from '../screens/shop/FavoritesScreen';
import AdminProductsScreen from '../screens/admin/AdminProductsScreen';
import EditProductScreen from '../screens/admin/EditProductScreen';

const defaultNavOptions = {
	headerBackTitle: 'Πίσω',
	headerStyle: {
		backgroundColor: Platform.OS === 'android' ? Colours.gr_brown : ''
	},
	headerTitleStyle: {
		fontFamily: 'GFSNeohellenic-Bold',
		fontSize: 22
	},
	headerBackTitleStyle: {
		fontFamily: 'GFSNeohellenic-Regular',
		fontSize: 22
	},
	headerTintColor: Platform.OS === 'android' ? 'white' : Colours.gr_brown
};

const EkthesisNavigator = createStackNavigator(
	{
		Categories: CategoriesScreen,
		ProductsOverview: ProductsOverviewScreen,
		DetailScreen: ProductDetailScreen,
		Cart: CartScreen
	},
	{
		defaultNavigationOptions: defaultNavOptions
	}
);

const FavNavigator = createStackNavigator(
	{
		Favorites: FavoritesScreen,
	},
	{
		defaultNavigationOptions: defaultNavOptions
	}
);

const OrdersNavigator = createStackNavigator(
	{
		Orders: OrdersScreen
	},
	{
		// navigationOptions only apply if this Screen here, belongs to another Navigator
		navigationOptions: {
			drawerLabel: 'Παραγγελίες',
		},
		defaultNavigationOptions: defaultNavOptions
	}
);


const AdminNavigator = createStackNavigator(
	{
		Admin: AdminProductsScreen,
		EditProduct: EditProductScreen
	},
	{
		defaultNavigationOptions: defaultNavOptions
	}
);

const MainNavigator = createDrawerNavigator(
	{
		Ekthesis: {
			screen: EkthesisNavigator,
			navigationOptions: {
				drawerLabel: 'Εκθεσις',
				drawerIcon: (drawerConfig) => (
					<Ionicons
						name={Platform.OS === 'android' ? 'md-home' : 'ios-home'}
						size={23}
						color={drawerConfig.tintColor}
					/>
				)
			}
		},
		Favorites: {
			screen: FavNavigator,
			navigationOptions: {
				drawerIcon: (tabInfo) => {
					return <MaterialIcons name="favorite" size={25} color={tabInfo.tintColor} />;
				},
				tabBarColor: Colours.gr_brown,
				drawerLabel:
					Platform.OS === 'android' ? (
						<Text style={{ fontFamily: 'GFSNeohellenic-Bold' }}>Αγαπημένα</Text>
					) : (
						'Αγαπημένα'
					)
			}
		},
		Orders: {
			screen: OrdersNavigator,
			navigationOptions: {
				drawerIcon: (tabInfo) => {
					return (
						<Ionicons
							name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
							size={25}
							color={tabInfo.tintColor}
						/>
					);
				},
				tabBarColor: Colours.gr_brown,
				tabBarLabel:
					Platform.OS === 'android' ? (
						<Text style={{ fontFamily: 'GFSNeohellenic-Bold' }}>Παραγγελίες</Text>
					) : (
						'Παραγγελίες'
					)
			}
		},
		Admin: {
			screen: AdminNavigator,
			navigationOptions: {
				drawerIcon: (tabInfo) => {
					return (
						<FontAwesome
						name='user-o'
						size={23}
						color={tabInfo.tintColor}
					/>
					);
				},
				tabBarColor: Colours.gr_brown,
				tabBarLabel:
					Platform.OS === 'android' ? (
						<Text style={{ fontFamily: 'GFSNeohellenic-Bold' }}>Παραγγελίες</Text>
					) : (
						'Παραγγελίες'
					)
			}
		}
	},
	{
		contentOptions: {
			activeTintColor: Colours.gr_brown,
			labelStyle: {
				fontFamily: 'GFSNeohellenic-Bold',
				fontSize: 20
			}
		},
		drawerWidth: 200
	}
);

export default createAppContainer(MainNavigator);
