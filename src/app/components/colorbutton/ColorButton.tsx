import {Animated, StyleProp, StyleSheet, View, ViewStyle} from "react-native";
import React, {useRef, useState} from "react";
import {MD3Theme, TouchableRipple, withTheme} from "react-native-paper";
import {ColorButtonContext, ColorButtonContextType} from "./ColorButtonGroup";
import {getRippleColor, getSelectionColor, isChecked} from "./utils";
import Color from "color";

export type ColorButtonProps = {
	color: string;
	theme: MD3Theme;
	onPress?: () => void;
	status?: boolean;
	disabled?: boolean;
	style?: StyleProp<ViewStyle>;
};

const ColorButtonComponent = ({color, theme, status, disabled, onPress, style}: ColorButtonProps) => {
	const handlePress = ({
		onPress,
		color,
		onColorChange,
	}: {
		onPress?: () => void,
		color: string,
		onColorChange?: (color: string) => void,
	}) => {
		if (onPress && onColorChange) {
			console.warn("onPress and onColorChange should't be used together!")
		}

		onColorChange ? onColorChange(color) : onPress?.()
	};

	return (
		<View style={style}>
			<ColorButtonContext.Consumer>
				{(context?: ColorButtonContextType) => {
					const checked = isChecked({
						color: color,
						status: status ? status : false,
						contextColor: context?.color,
					});

					const rippleColor = getRippleColor({
						theme: theme,
						color: color,
						disabled: disabled ? disabled : false,
					});

					const selectionColor = getSelectionColor({
						theme: theme,
						checked: checked,
						disabled: disabled ? disabled : false,
					});

					return (
						<TouchableRipple
							borderless={true}
							style={styles.container}
							onPress={() => handlePress({
								onPress: onPress,
								color: color,
								onColorChange: context?.onColorChange,
							})}
							rippleColor={rippleColor}
						>
							<Animated.View
								style={[
									StyleSheet.absoluteFill,
									{
										borderColor: selectionColor,
										borderWidth: 2,
										borderRadius: 20,
									}
								]}
							>
								<View style={[StyleSheet.absoluteFill, styles.circleContainer]}>
									<View style={[styles.circle, {backgroundColor: color}]} />
								</View>
							</Animated.View>
						</TouchableRipple >
					)
				}}
			</ColorButtonContext.Consumer>
		</View>
	);
};

ColorButtonComponent.displayName = "ColorButton";

const styles = StyleSheet.create({
	container: {
		width: 40,
		height: 40,
		borderRadius: 20,
	},
	circleContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	circle: {
		margin: 5,
		width: 30,
		height: 30,
		borderRadius: 15,
	}
});

export default withTheme(ColorButtonComponent);
