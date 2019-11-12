import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, FlatList, Button, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import CustomButton from '../../components/UI/CustomButton';
import CartItem from '../../components/shop/CartItem';
import * as cartActions from '../../store/actions/cart';
import * as ordersActions from '../../store/actions/orders';
import Card from '../../components/UI/Card';
import Colours from '../../constants/Colours';
import BoldText from '../../components/UI/BoldText';

const CartScreen = (props) => {
	const [ isLoading, setIsLoading ] = useState(false);
	const [ error, setError ] = useState();
	const dispatch = useDispatch();
	const cartTotalAmount = useSelector((state) => state.cart.totalAmount);

	const cartItems = useSelector((state) => {
		// TRANSFORM AN OBJECT INTO AN ARRAY
		const transformedCartItems = [];
		for (const key in state.cart.items) {
			const index = state.cart.items[key].index;
			// Use splice to keep the order when adding/subtracting
			transformedCartItems.splice(index, 0, {
				id: key,
				index: state.cart.items[key].index,
				title: state.cart.items[key].title,
				price: state.cart.items[key].price,
				quantity: state.cart.items[key].quantity,
				sum: state.cart.items[key].sum
			});
		}
		// return transformedCartItems.sort((a, b) => (a.productId > b.productId ? 1 : -1));
		return transformedCartItems;
	});

	const sendOrderHandler = async () => {
		setError(null);
		setIsLoading(true);
		try {
			// Note on the server, 1 cartItems is 0, 2 = 1 etc...
			await dispatch(ordersActions.addOrder(cartItems, cartTotalAmount));
		} catch (err) {
			setError(err.message);
		}
		setIsLoading(false);
		props.navigation.navigate('Orders');
	};

	if (error) {
		return (
			<View style={styles.centered}>
				<BoldText>Σφάλμα στη διαδικασία αποστολής της παραγγελίας. Παρακαλώ ελέγξτε τη σύνδεσή σας.</BoldText>
				{Platform.OS === 'android' ? (
					<CustomButton
						title="Δοκιμάστε Ξανά"
						onPress={() => dispatch(ordersActions.addOrder(cartItems, cartTotalAmount))}
						color={Colours.chocolate}
					/>
				) : (
					<Button
						title="Δοκιμάστε Ξανά"
						onPress={() => dispatch(ordersActions.addOrder(cartItems, cartTotalAmount))}
						color={Colours.chocolate}
					/>
				)}
			</View>
		);
	}
	const renderCardItem = (itemData) => {
		return (
			<Card style={styles.summary}>
				<CartItem
					quantity={itemData.item.quantity}
					price={itemData.item.price}
					title={itemData.item.title}
					amount={itemData.item.sum}
					changeQuantity // Needed to show the plus/minus buttons.
					onAddProduct={() => {
						dispatch(cartActions.addToCard(itemData.item));
					}}
					onRemoveProduct={() => {
						dispatch(cartActions.removeFromCart(itemData.item.id));
					}}

					// onRemoveAll={() => dispatch(cartActions.removeFromCart(itemData.item.id))}
				/>
			</Card>
		);
	};

	// NOTE: cartItems is an array!!! (Because of the FlatList down below)
	if (cartItems.length === 0) {
		return (
			<LinearGradient
				colors={[ Colours.moccasin_light, Colours.chocolate, Colours.maroon ]}
				// start={{ x: 0, y: 1 }}
				// end={{ x: 0, y: 0 }}
				style={styles.gradient}
			>
				<Card style={styles.summary}>
					<BoldText style={styles.centered}> Το καλάθι σας είναι άδειο...</BoldText>
				</Card>
			</LinearGradient>
		);
	}

	if (isLoading) {
		return (
			<LinearGradient
				colors={[ Colours.moccasin_light, Colours.chocolate, Colours.maroon ]}
				// start={{ x: 0, y: 1 }}
				// end={{ x: 0, y: 0 }}
				style={styles.gradient}
			>
				<Card style={styles.summary}>
					<ActivityIndicator size="large" color={Colours.chocolate} />
				</Card>
			</LinearGradient>
		);
	}

	return (
		<LinearGradient
			colors={[ Colours.moccasin_light, Colours.chocolate, Colours.maroon ]}
			// start={{ x: 0, y: 1 }}
			// end={{ x: 0, y: 0 }}
			style={styles.gradient}
		>
			<Card style={styles.summary}>
				<BoldText style={styles.summaryText}>
					{/* Use Math.round etc to remove the -0... */}
					Τελικό Σύνολο: {Math.round(cartTotalAmount.toFixed(2) * 100) / 100}
					<Text style={styles.euro}> €</Text>
				</BoldText>
				{Platform.OS === 'android' ? (
					<CustomButton
						// color={cartItems.length === 0 ? 'gray' : ''}
						style={styles.customButton}
						textStyle={styles.buttonText}
						title="Εκτέλεση παραγγελίας"
						disabled={cartItems.length === 0}
						onPress={sendOrderHandler}
					/>
				) : (
					<Button
						color={Colours.chocolate}
						title="Εκτέλεση παραγγελίας"
						disabled={cartItems.length === 0}
						onPress={sendOrderHandler}
					/>
				)}
			</Card>
			<SafeAreaView style={styles.flatListContainer}>
				<FlatList
					contentContainerStyle={styles.flatListStyle}
					data={cartItems}
					keyExtractor={(item) => item.id}
					renderItem={renderCardItem}
				/>
			</SafeAreaView>
		</LinearGradient>
	);
};

CartScreen.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'Το καλάθι σας'
		// headerRight: (
		// 	<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
		// 		<Item
		// 			title="goBack"
		// 			iconName={Platform.OS === 'android' ? 'md-arrow-back' : 'ios-arrow-back'}
		// 			onPress={() => navigation.pop()}
		// 		/>
		// 	</HeaderButtons>
		// ),
		// headerRight: (
		// 	<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
		// 		<Item
		// 			title="card"
		// 			iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
		// 			onPress={() => navigation.navigate({routeName: 'Cart'})}
		// 		/>
		// 	</HeaderButtons>
		// )
	};
};

const styles = StyleSheet.create({
	gradient: {
		flex: 1,
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	flatListContainer: {
		flex: 1,
		width: '100%',
		maxWidth: '100%',
		maxHeight: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20
	},
	flatListStyle: {
		paddingBottom: 50
	},
	summary: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		margin: 10,
		padding: 10
	},
	amound: {
		maxWidth: '90%'
	},
	euro: {
		fontSize: 14,
		color: '#888'
	},
	customButton: {
		width: '40%',
		height: 50
	},
	buttonText: {
		paddingLeft: 7
	},
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 12
	}
});

export default CartScreen;
