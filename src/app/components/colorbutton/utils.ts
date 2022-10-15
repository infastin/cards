import {MD3Theme} from "react-native-paper";
import Color from 'color';

export const isChecked = ({
	color,
	status,
	contextColor
}: {
	color: string,
	status: boolean,
	contextColor?: string
}): boolean => {
	if (contextColor) {
		return contextColor === color;
	}

	return status;
};

export const getRippleColor = ({
	theme,
	color,
	disabled
}: {
	theme: MD3Theme,
	color: string,
	disabled: boolean
}): string => {
	if (disabled) {
		return Color(theme.colors.onSurface).alpha(0.16).rgb().string();
	}
	return Color(color).fade(0.32).rgb().string()
};

export const getSelectionColor = ({
	theme,
	disabled,
	checked
}: {
	theme: MD3Theme,
	disabled: boolean,
	checked: boolean
}): string => {
	if (disabled) {
		return theme.colors.onSurfaceDisabled;
	}

	if (checked) {
		return theme.colors.primary;
	}

	return theme.colors.onSurfaceVariant;
};
