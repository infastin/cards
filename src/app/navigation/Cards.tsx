import React from "react";
import {Dimensions, FlatList, NativeScrollEvent, NativeSyntheticEvent, SafeAreaView, ScaledSize, StyleSheet, View} from "react-native";
import {AnimatedFAB, MD3Theme, withTheme, Modal, Portal, MD3LightTheme} from "react-native-paper";
import LoyaltyCard from "../components/LoyaltyCard";
import Database from "../models/Database";
import {StackProps} from "../types/Navigation";
import * as Clipboard from "expo-clipboard";
import {ColorPalletteStr} from "../types/Colors";
import Barcode from "../components/Barcode";

export type CardsProps = StackProps<"AddCard"> & {
	theme: MD3Theme;
};

type ModalBarcodeProps = {
	code: string,
	format: string,
	width: number,
	height: number,
};

const Cards = ({navigation}: CardsProps) => {
	const [onTop, setOnTop] = React.useState<boolean>(true)
	const [dimension, setDimension] = React.useState<ScaledSize>(Dimensions.get("window"));

	const [modalVisible, setModalVisible] = React.useState<boolean>(false);
	const [modalBarcodeProps, setModalBarcodeProps] = React.useState<ModalBarcodeProps>(null as any);

	React.useEffect(() => {
		const listener = Dimensions.addEventListener("change", ({window}) => setDimension(window));
		return () => listener.remove();
	}, []);

	const onScroll = ({nativeEvent}: NativeSyntheticEvent<NativeScrollEvent>) => {
		const curPos = nativeEvent.contentOffset.y;
		setOnTop(curPos <= 0);
	};

	const modalHeight = Math.round(0.6 * dimension.height) - 32;

	const db = Database.useDatabase();
	const cardsData = Database.useQuery(Database.Card);

	return (
		<SafeAreaView style={styles.container}>
			<FlatList
				contentContainerStyle={styles.cards}
				onScroll={onScroll}
				data={cardsData}
				keyExtractor={card => card._id.toString()}
				renderItem={({item}) => (
					<LoyaltyCard
						title={item.title}
						code={item.code}
						format={item.format}
						bgColor={item.color}
						fgColor={ColorPalletteStr[item.color].fg.onSurface}
						onCopy={async () => await Clipboard.setStringAsync(item.code)}
						onDelete={() => {
							db.write(() => {
								db.delete(db.objectForPrimaryKey("Card", item._id));
							});
						}}
						onPress={() => {
							let barcodeWidth: number;
							let barcodeHeight: number;

							if (item.format === "QR") {
								barcodeWidth = Math.round(0.4 * modalHeight);
								barcodeHeight = barcodeWidth;
							} else {
								barcodeWidth = Math.round(0.8 * modalHeight);
								barcodeHeight = Math.round(0.3 * modalHeight);
							}

							setModalBarcodeProps({
								code: item.code,
								format: item.format,
								width: barcodeWidth,
								height: barcodeHeight,
							});
							setModalVisible(true);
						}}
					/>
				)}
			/>
			<AnimatedFAB
				icon={'plus'}
				label={'Add'}
				extended={onTop}
				onPress={() => navigation.navigate("AddCard")}
				animateFrom="right"
				style={styles.add}
			/>
			<Portal>
				<Modal
					visible={modalVisible}
					onDismiss={() => setModalVisible(false)}
					style={styles.modalWrapper}
					contentContainerStyle={[styles.modal, {
						backgroundColor: MD3LightTheme.colors.elevation.level3,
					}]}
				>
					<View style={{justifyContent: "center", alignItems: "center"}}>
						{modalBarcodeProps &&
							<View style={{
								transform: [{rotate: "90deg"}],
								width: modalBarcodeProps.width,
								height: modalBarcodeProps.height
							}}>
								<Barcode
									value={modalBarcodeProps.code}
									format={modalBarcodeProps.format}
								/>
							</View>
						}
					</View>
				</Modal>
			</Portal>
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
	modalWrapper: {
		alignItems: "center"
	},
	modal: {
		borderRadius: 21,
		padding: 16,
		width: "80%",
		height: "60%",
	},
});

export default withTheme(Cards);
