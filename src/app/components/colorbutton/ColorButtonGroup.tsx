import {StyleProp, View, ViewStyle} from "react-native";
import React from "react";

export type ColorButtonContextType = {
	color: string;
	onColorChange?: (color: string) => void;
};

export const ColorButtonContext = React.createContext<ColorButtonContextType>(null as any);

export type ColorButtonGroupProps = {
	color: string;
	onColorChange?: (color: string) => void;
	children?: React.ReactNode;
	style?: StyleProp<ViewStyle>;
};

const ColorButtonGroup = ({color, onColorChange, children, style}: ColorButtonGroupProps) => {
	return (
		<ColorButtonContext.Provider value={{color, onColorChange}}>
			<View style={style}>{children}</View>
		</ColorButtonContext.Provider>
	);
};

export default ColorButtonGroup;
