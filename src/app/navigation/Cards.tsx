import React from "react";
import {Dimensions, FlatList, NativeScrollEvent, NativeSyntheticEvent, SafeAreaView, ScaledSize, StyleSheet, View} from "react-native";
import {AnimatedFAB, MD3Theme, withTheme, Modal, Portal, MD3LightTheme} from "react-native-paper";
import * as Brightness from "expo-brightness";
import LoyaltyCard from "../components/LoyaltyCard";
import Database from "../models/Database";
import {StackProps} from "../models/Navigation";
import * as Clipboard from "expo-clipboard";
import {ColorPalletteStr} from "../models/Colors";
import Barcode from "../components/Barcode";
import Locale from "../locale";
import Infobar from "../components/Infobar";

export type CardsProps = StackProps<"AddCard"> & {
	theme: MD3Theme;
};

type ModalBarcodeProps = {
	code: string;
	format: string;
	width: number;
	height: number;
	transform: boolean;
};

const Cards = ({navigation}: CardsProps) => {
	const [onTop, setOnTop] = React.useState<boolean>(true)
	const [dimension, setDimension] = React.useState<ScaledSize>(Dimensions.get("window"));

	const [oldBrightness, setOldBrightness] = React.useState<number>(0);
	const [modalVisible, setModalVisible] = React.useState<boolean>(false);
	const [modalBarcodeProps, setModalBarcodeProps] = React.useState<ModalBarcodeProps | null>(null);

	const [infoVisible, setInfoVisible] = React.useState<boolean>(false);
	const [infoMsg, setInfoMsg] = React.useState<string>("");


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
	const loc = Locale.useLocale();

	return (
		<SafeAreaView style={styles.container}>
			<FlatList
				contentContainerStyle={{paddingVertical: 12}}
				onScroll={onScroll}
				data={cardsData}
				keyExtractor={card => card._id.toString()}
				renderItem={({item}) => (
					<View style={{paddingHorizontal: 12}}>
						<LoyaltyCard
							title={item.title}
							code={item.code}
							format={item.format}
							bgColor={item.color}
							fgColor={ColorPalletteStr[item.color].fg.onSurface}
							onCopy={() => {
								(async () => await Clipboard.setStringAsync(item.code))();
								setInfoMsg(`${loc.t("infoLabel")}: ${loc.t("codeCopied")}`);
								setInfoVisible(true);
							}}
							onDelete={() => {
								db.write(() => {
									db.delete(db.objectForPrimaryKey(Database.Card, item._id));
								});
							}}
							onPress={() => {
								let barcodeWidth: number;
								let barcodeHeight: number;
								let transform: boolean;

								if (item.format === "QR") {
									barcodeWidth = Math.round(0.4 * modalHeight);
									barcodeHeight = barcodeWidth;
									transform = false;
								} else {
									barcodeWidth = Math.round(0.8 * modalHeight);
									barcodeHeight = Math.round(0.3 * modalHeight);
									transform = true;
								}

								setModalBarcodeProps({
									code: item.code,
									format: item.format,
									width: barcodeWidth,
									height: barcodeHeight,
									transform: transform,
								});

								setModalVisible(true);

								(async () => {
									const old = await Brightness.getBrightnessAsync();
									setOldBrightness(old);
								})();

								Brightness.setBrightnessAsync(0.8);
							}}
						/>
					</View>
				)}
			/>
			<Infobar
				text={infoMsg}
				visible={infoVisible}
				duration={3500}
				onDismiss={() => {
					setInfoVisible(false);
					setInfoMsg("");
				}}
			/>
			<AnimatedFAB
				icon={"plus"}
				label={loc.t("AddFB")}
				extended={onTop}
				onPress={() => navigation.navigate("AddCard")}
				animateFrom="right"
				style={styles.add}
			/>
			<Portal>
				<Modal
					visible={modalVisible}
					onDismiss={() => {
						Brightness.setBrightnessAsync(oldBrightness);
						setModalVisible(false)
					}}
					style={styles.modalWrapper}
					contentContainerStyle={[styles.modal, {
						backgroundColor: MD3LightTheme.colors.elevation.level3,
					}]}
				>
					<View style={{justifyContent: "center", alignItems: "center"}}>
						{modalBarcodeProps &&
							<View style={{
								transform: modalBarcodeProps.transform ? [{rotate: "90deg"}] : undefined,
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
