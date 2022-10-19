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

export const LightTheme = {
	...NavigationLightTheme,
	...PaperLightTheme,
	colors: {
		...NavigationLightTheme.colors,
		...PaperLightTheme.colors,
	}
}

export const DarkTheme = {
	...NavigationDarkTheme,
	...PaperDarkTheme,
	colors: {
		...NavigationDarkTheme.colors,
		...PaperDarkTheme.colors,
	}
};

export {PaperProvider, NavigationContainer};
