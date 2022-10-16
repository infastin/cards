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
import {StackParamList} from './src/app/models/Navigation';
import Scan from './src/app/navigation/Scan';
import {Settings} from './src/app/navigation/Settings';
import {DarkTheme, LightTheme, PaperProvider, NavigationContainer} from './src/app/models/Theme';
import {Appearance} from 'react-native';
import Locale from './src/app/locale';
import Database from './src/app/models/Database';

const App = () => {
	const db = Database.useDatabase();

	let settings: Database.SettingsObject;
	const settings_array = Database.useQuery(Database.Settings);

	if (settings_array.length == 0) {
		db.write(() => {
			settings = db.create(Database.Settings, Database.Settings.generate({
				lang: "system",
				theme: "system",
			}));
		});
	} else {
		settings = settings_array[0];
	}

	let scheme: string;
	if (settings.theme === "system") {
		scheme = Appearance.getColorScheme();
	} else {
		scheme = settings.theme;
	}
	let theme = scheme === "dark" ? DarkTheme : LightTheme;

	const Stack = createStackNavigator<StackParamList>();

	return (
		<PaperProvider theme={theme}>
			<Locale.Provider locale={settings.lang}>
				<NavigationContainer theme={theme}>
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
						<Stack.Screen name="Settings" component={Settings} />
					</Stack.Navigator>
				</NavigationContainer>
			</Locale.Provider>
		</PaperProvider>
	)
};

export default App;
