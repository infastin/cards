import React from "react";
import {Dimensions, Pressable, ScaledSize, StyleSheet, View} from "react-native";
import {Card, Avatar, IconButton, Menu} from "react-native-paper";
import Barcode from "../components/Barcode"

export type LoyaltyCardProps = {
	title: string;
	code: string;
	format?: string;
	onDelete?: () => void;
	onCopy?: () => void;
	onPress?: () => void;
	onLongPress?: () => void;
	bgColor?: string;
	fgColor?: string;
};

const LoyaltyCard = ({title, code, format, bgColor, fgColor, ...props}: LoyaltyCardProps) => {
	const [menuVisible, setMenuVisible] = React.useState<boolean>(false);
	const [dimension, setDimension] = React.useState<ScaledSize>(Dimensions.get("window"));

	React.useEffect(() => {
		const listener = Dimensions.addEventListener("change", ({window}) => setDimension(window));
		return () => listener.remove();
	}, []);

	const cardContentWidth = dimension.width - 60;

	let barcodeWidth: number;
	let barcodeHeight: number;

	if (format === "QR") {
		barcodeWidth = Math.round(0.4 * cardContentWidth);
		barcodeHeight = barcodeWidth;
	} else {
		barcodeWidth = Math.round(0.8 * cardContentWidth);
		barcodeHeight = Math.round(0.2 * cardContentWidth);
	}

	return (
		<View>
			<Card style={[styles.card, {backgroundColor: bgColor}]}>
				<Card.Title
					title={title}
					titleStyle={{color: fgColor}}
					titleVariant="titleMedium"
					subtitle={code}
					subtitleStyle={{color: fgColor}}
					subtitleVariant="titleSmall"
					left={(cardProps) => <Avatar.Text {...cardProps} label={title[0]} />}
					right={
						(cardProps) => {
							return (
								<Menu
									visible={menuVisible}
									onDismiss={() => setMenuVisible(false)}
									anchor={
										<IconButton {...cardProps} iconColor={fgColor} icon="dots-vertical" onPress={() => setMenuVisible(true)} />
									}
								>
									<Menu.Item leadingIcon="delete" title="Delete" onPress={() => {
										setMenuVisible(false);
										props.onDelete();
									}} />
									<Menu.Item leadingIcon="content-copy" title="Copy code" onPress={() => {
										setMenuVisible(false);
										props.onCopy();
									}} />
								</Menu>
							)
						}
					}
				/>
				<Card.Content>
					<Pressable onPress={props.onPress} onLongPress={props.onLongPress}>
						<Card mode="contained" style={{backgroundColor: "white"}}>
							<Card.Content style={styles.barcode}>
								<View style={{width: barcodeWidth, height: barcodeHeight}}>
									<Barcode value={code} format={format} />
								</View>
							</Card.Content>
						</Card>
					</Pressable>
				</Card.Content>
			</Card>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		marginTop: 6,
		marginBottom: 6,
	},
	barcode: {
		flex: 1,
		alignItems: "center",
	},
});

export default LoyaltyCard;
