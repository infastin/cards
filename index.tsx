/**
 * @format
 */

import "@react-native-anywhere/polyfill-base64";
import 'react-native-get-random-values';
import 'expo-dev-client';
import {registerRootComponent} from "expo";
import {useState} from 'react';
import {Appearance} from 'react-native';
import Database from "./src/app/models/Database";
import App from './App';

import {
	Provider as PaperProvider,
	MD3DarkTheme as PaperDarkTheme,
	MD3LightTheme as PaperLightTheme,
} from 'react-native-paper';
import {
	NavigationContainer,
	DefaultTheme as NavigationLightTheme,
	DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';

const LightTheme = {
	...NavigationLightTheme,
	...PaperLightTheme,
	colors: {
		...NavigationLightTheme.colors,
		...PaperLightTheme.colors,
	}
}

const DarkTheme = {
	...NavigationDarkTheme,
	...PaperDarkTheme,
	colors: {
		...NavigationDarkTheme.colors,
		...PaperDarkTheme.colors,
	}
};

export default function Main() {
	const [scheme, setScheme] = useState(Appearance.getColorScheme());

	const onColorSchemeChange = ({colorScheme}: Appearance.AppearancePreferences) => {
		setScheme(colorScheme);
	};

	Appearance.addChangeListener(onColorSchemeChange);
	let theme = scheme === "dark" ? DarkTheme : LightTheme;

	return (
		<Database.Provider>
			<PaperProvider theme={theme}>
				<NavigationContainer theme={theme}>
					<App />
				</NavigationContainer>
			</PaperProvider>
		</Database.Provider>
	);
}

registerRootComponent(Main)
