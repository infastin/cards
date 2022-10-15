/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */


import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React from 'react';

import Header from './src/app/components/Header';
import Cards from './src/app/navigation/Cards';
import AddCard from './src/app/navigation/AddCard';
import {StackParamList} from './src/app/navigation/Types';
import Scan from './src/app/navigation/Scan';

const App = () => {
	const Stack = createStackNavigator<StackParamList>()

	return (
		<Stack.Navigator
			initialRouteName="Cards"
			screenOptions={{
				header: Header,
				headerMode: "screen"
			}}
		>
			<Stack.Screen name="Cards" component={Cards} />
			<Stack.Screen
				name="AddCard"
				component={AddCard}
				options={{
					...TransitionPresets.FadeFromBottomAndroid,
				}}
			/>
			<Stack.Screen name="Scan" component={Scan} />
		</Stack.Navigator>
	)
};

export default App;
