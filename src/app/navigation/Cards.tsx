import React from "react";
import {FlatList, NativeScrollEvent, NativeSyntheticEvent, SafeAreaView, ScrollView, StyleSheet} from "react-native";
import {AnimatedFAB, Props, MD3Theme, withTheme} from "react-native-paper";
import LoyaltyCard from "../components/LoyaltyCard";
import Database from "../models/Database";
import {StackProps} from "./Types";

export type CardsProps = StackProps<"AddCard"> & {
	theme: MD3Theme;
};

const Cards = ({navigation, theme}: CardsProps) => {
	const [onTop, setOnTop] = React.useState<boolean>(true)

	const onScroll = ({nativeEvent}: NativeSyntheticEvent<NativeScrollEvent>) => {
		const curPos = nativeEvent.contentOffset.y;
		setOnTop(curPos <= 0);
	};

	const cardsData = Database.useQuery(Database.Card);

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.cards} onScroll={onScroll}>
				<FlatList
					data={cardsData}
					keyExtractor={card => card._id.toString()}
					renderItem={({item}) => (
						<LoyaltyCard title={item.title} code={item.code} />
					)}
				/>
			</ScrollView>
			<AnimatedFAB
				icon={'plus'}
				label={'Add'}
				extended={onTop}
				onPress={() => navigation.navigate("AddCard")}
				animateFrom="right"
				style={styles.add}
			/>
		</SafeAreaView>
	)
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexGrow: 1,
	},
	cards: {
		padding: 12,
	},
	add: {
		bottom: 16,
		right: 16,
		position: "absolute",
	},
});

export default withTheme(Cards);
