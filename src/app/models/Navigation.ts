import {StackScreenProps} from "@react-navigation/stack";
import {BarcodeFormat} from "vision-camera-code-scanner";

export type StackParamList = {
	Cards: undefined,
	AddCard: {
		code?: string,
		format?: string,
		name?: string,
		color?: string,
	},
	Scan: {
		types: BarcodeFormat[],
		hasPermission: boolean,
	},
	Settings: undefined,
	About: undefined,
	Licenses: undefined,
};

export type StackProps<T extends keyof StackParamList> = StackScreenProps<StackParamList, T>;
