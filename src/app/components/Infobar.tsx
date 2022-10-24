import {MD3Theme, Snackbar, Text, withTheme} from "react-native-paper";
import {Props as SnackbarProps} from "react-native-paper/src/components/Snackbar";

export type InfobarProps = Omit<SnackbarProps, "children"> & {
	theme: MD3Theme,
	variant?: "info" | "error" | "success",
	text: string,
};

const Infobar = ({variant = "info", text, style, ...props}: InfobarProps) => {
	const variants = {
		info: {
			bg: {backgroundColor: props.theme.colors.secondaryContainer},
			fg: {color: props.theme.colors.onSecondaryContainer},
		},
		error: {
			bg: {backgroundColor: props.theme.colors.errorContainer},
			fg: {color: props.theme.colors.onErrorContainer},
		},
		success: {
			bg: {backgroundColor: props.theme.colors.primaryContainer},
			fg: {color: props.theme.colors.onPrimaryContainer},
		},
	}

	return (
		<Snackbar
			style={[variants[variant].bg, style]}
			{...props}
		>
			<Text style={variants[variant].fg}>{text}</Text>
		</Snackbar>
	)
};

export default withTheme(Infobar);
