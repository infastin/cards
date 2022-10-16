import {MD3DarkTheme, MD3LightTheme} from "react-native-paper";

const ColorPalleteBG = {
	primary: MD3LightTheme.colors.primary,
	secondary: MD3LightTheme.colors.secondary,
	red: "#d32f2f",
	pink: "#c2185b",
	purple: "#7b1fa2",
	deepPurple: "#512da8",
	indigo: "#303f9f",
	blue: "#1976d2",
	lightBlue: "#0288d1",
	cyan: "#0097a7",
	teal: "#00796b",
	green: "#388e3c",
	lightGreen: "#689f38",
	lime: "#afb42b",
	yellow: "#fbc02d",
	amber: "#ffa000",
	orange: "#f57c00",
	deepOrange: "#e64a19",
	brown: "#5d4037",
	gray: "#616161",
	blueGray: "#455a64",
};

const ColorPalleteFG = {
	primary: {
		onBackground: MD3DarkTheme.colors.onBackground,
		onSurface: MD3DarkTheme.colors.onSurface,
		onSurfaceVariant: MD3DarkTheme.colors.onSurfaceVariant
	},
	secondary: {
		onBackground: MD3DarkTheme.colors.onBackground,
		onSurface: MD3DarkTheme.colors.onSurface,
		onSurfaceVariant: MD3DarkTheme.colors.onSurfaceVariant
	},
	red: {
		onBackground: MD3DarkTheme.colors.onBackground,
		onSurface: MD3DarkTheme.colors.onSurface,
		onSurfaceVariant: MD3DarkTheme.colors.onSurfaceVariant
	},
	pink: {
		onBackground: MD3DarkTheme.colors.onBackground,
		onSurface: MD3DarkTheme.colors.onSurface,
		onSurfaceVariant: MD3DarkTheme.colors.onSurfaceVariant
	},
	purple: {
		onBackground: MD3DarkTheme.colors.onBackground,
		onSurface: MD3DarkTheme.colors.onSurface,
		onSurfaceVariant: MD3DarkTheme.colors.onSurfaceVariant
	},
	deepPurple: {
		onBackground: MD3DarkTheme.colors.onBackground,
		onSurface: MD3DarkTheme.colors.onSurface,
		onSurfaceVariant: MD3DarkTheme.colors.onSurfaceVariant
	},
	indigo: {
		onBackground: MD3DarkTheme.colors.onBackground,
		onSurface: MD3DarkTheme.colors.onSurface,
		onSurfaceVariant: MD3DarkTheme.colors.onSurfaceVariant
	},
	blue: {
		onBackground: MD3DarkTheme.colors.onBackground,
		onSurface: MD3DarkTheme.colors.onSurface,
		onSurfaceVariant: MD3DarkTheme.colors.onSurfaceVariant
	},
	lightBlue: {
		onBackground: MD3LightTheme.colors.onBackground,
		onSurface: MD3LightTheme.colors.onSurface,
		onSurfaceVariant: MD3LightTheme.colors.onSurfaceVariant
	},
	cyan: {
		onBackground: MD3LightTheme.colors.onBackground,
		onSurface: MD3LightTheme.colors.onSurface,
		onSurfaceVariant: MD3LightTheme.colors.onSurfaceVariant
	},
	teal: {
		onBackground: MD3DarkTheme.colors.onBackground,
		onSurface: MD3DarkTheme.colors.onSurface,
		onSurfaceVariant: MD3DarkTheme.colors.onSurfaceVariant
	},
	green: {
		onBackground: MD3LightTheme.colors.onBackground,
		onSurface: MD3LightTheme.colors.onSurface,
		onSurfaceVariant: MD3LightTheme.colors.onSurfaceVariant
	},
	lightGreen: {
		onBackground: MD3LightTheme.colors.onBackground,
		onSurface: MD3LightTheme.colors.onSurface,
		onSurfaceVariant: MD3LightTheme.colors.onSurfaceVariant
	},
	lime: {
		onBackground: MD3LightTheme.colors.onBackground,
		onSurface: MD3LightTheme.colors.onSurface,
		onSurfaceVariant: MD3LightTheme.colors.onSurfaceVariant
	},
	yellow: {
		onBackground: MD3LightTheme.colors.onBackground,
		onSurface: MD3LightTheme.colors.onSurface,
		onSurfaceVariant: MD3LightTheme.colors.onSurfaceVariant
	},
	amber: {
		onBackground: MD3LightTheme.colors.onBackground,
		onSurface: MD3LightTheme.colors.onSurface,
		onSurfaceVariant: MD3LightTheme.colors.onSurfaceVariant
	},
	orange: {
		onBackground: MD3LightTheme.colors.onBackground,
		onSurface: MD3LightTheme.colors.onSurface,
		onSurfaceVariant: MD3LightTheme.colors.onSurfaceVariant
	},
	deepOrange: {
		onBackground: MD3LightTheme.colors.onBackground,
		onSurface: MD3LightTheme.colors.onSurface,
		onSurfaceVariant: MD3LightTheme.colors.onSurfaceVariant
	},
	brown: {
		onBackground: MD3DarkTheme.colors.onBackground,
		onSurface: MD3DarkTheme.colors.onSurface,
		onSurfaceVariant: MD3DarkTheme.colors.onSurfaceVariant
	},
	gray: {
		onBackground: MD3DarkTheme.colors.onBackground,
		onSurface: MD3DarkTheme.colors.onSurface,
		onSurfaceVariant: MD3DarkTheme.colors.onSurfaceVariant
	},
	blueGray: {
		onBackground: MD3DarkTheme.colors.onBackground,
		onSurface: MD3DarkTheme.colors.onSurface,
		onSurfaceVariant: MD3DarkTheme.colors.onSurfaceVariant
	},
};

export const ColorPallette = Object.fromEntries(
	Object.entries(ColorPalleteBG).map(
		([k, v]) => [k, {bg: v, fg: ColorPalleteFG[k]}]
	)
);

export const ColorPalletteStr = Object.fromEntries(
	Object.entries(ColorPallette).map(
		([k, v]) => [v.bg, {name: k, fg: v.fg}]
	)
);
