import {StackScreenProps} from "@react-navigation/stack";

export type StackParamList = {
	Cards: undefined,
	AddCard: {
		code?: string,
		format?: string,
		name?: string,
		color?: string,
	},
	Scan: {
		types: string[],
	},
	Settings: undefined,
};

export type StackProps<T extends keyof StackParamList> = StackScreenProps<StackParamList, T>;
