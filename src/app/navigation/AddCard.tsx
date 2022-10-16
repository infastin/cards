import React from "react";
import {Dimensions, FlatList, ScaledSize, StyleSheet, View} from "react-native";
import {Button, TextInput, MD3Theme, withTheme, Text, HelperText, Chip, Snackbar} from "react-native-paper";
import ColorButton from "../components/colorbutton";
import {ScanTypes} from "./Scan";
import {StackProps} from "../models/Navigation";
import Database from "../models/Database";
import {ColorPallette} from "../models/Colors";
import BwipJs from "../models/BwipJs";
import {BarcodeTypes} from "../components/Barcode";
import {BSON} from "realm";
import Locale from "../locale";

export type AddCardProps = StackProps<"AddCard"> & {
	theme: MD3Theme,
};

type Error = {
	is: boolean;
	text: string;
};

const AddCard = ({theme, navigation, route}: AddCardProps) => {
	const colorList = Object.entries(ColorPallette).map(([, v]) => v.bg);
	const [selColor, setSelColor] = React.useState<string>(colorList[0]);

	const formatList: string[] = Object.values(ScanTypes.Str);
	const [selFormat, setSelFormat] = React.useState<string>(route.params?.format ? route.params.format : formatList[0]);

	const [titleValue, setTitleValue] = React.useState<string>("");
	const [titleError, setTitleError] = React.useState<Error>({is: false, text: ""});

	const [codeValue, setCodeValue] = React.useState<string>(route.params?.code ? route.params.code : "");
	const [codeError, setCodeError] = React.useState<Error>({is: false, text: ""});

	const [snackVisible, setSnackVisible] = React.useState<boolean>(false);
	const [snackMsg, setSnackMsg] = React.useState<string>("");

	const [colorListKey, setColorListKey] = React.useState<"colorListKey0" | "colorListKey1">("colorListKey0");
	const dimension = React.useRef<ScaledSize>(Dimensions.get("window"));

	const db = Database.useDatabase();
	const loc = Locale.useLocale();

	React.useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			if (!route.params) {
				return;
			}

			if (route.params.format) {
				setSelFormat(route.params.format);
			}

			if (route.params.code) {
				setCodeValue(route.params.code);
			}
		});

		return unsubscribe;
	}, [navigation, route]);

	React.useEffect(() => {
		const listener = Dimensions.addEventListener("change", ({window}) => {
			dimension.current = window;
			setColorListKey(colorListKey == "colorListKey0" ? "colorListKey1" : "colorListKey0");
		});
		return () => listener.remove();
	}, [colorListKey]);

	const onAddPress = () => {
		let errors = 0;

		if (titleValue.length == 0) {
			setTitleError({is: true, text: loc.t("titleError")});
			errors++;
		}

		if (codeValue.length == 0) {
			setCodeError({is: true, text: loc.t("codeError")});
			errors++;
		}

		if (errors != 0) {
			return;
		}

		let bid: Realm.BSON.ObjectId;
		let barcode = db.objects(Database.Barcode).filtered(
			`code == $0 && format == $1 LIMIT(1)`,
			codeValue, selFormat
		);

		if (barcode.length > 0) {
			bid = barcode[0]._id;
		} else {
			try {
				const data = BwipJs.raw(BarcodeTypes[selFormat], codeValue)[0];
				db.write(() => {
					const obj = db.create(
						Database.Barcode,
						Database.Barcode.generate({
							code: codeValue,
							format: selFormat,
							data: BSON.serialize(data),
						})
					);
					bid = obj._id;
				});
			} catch (err) {
				const strError: string = err.toString();
				const errorMsg = strError.split(":")[1].trim();
				setSnackMsg(`${loc.t("snackMsgLabel")}: ${errorMsg}`);
				setSnackVisible(true);
				return;
			}
		}

		db.write(() => {
			db.create(
				Database.Card,
				Database.Card.generate({
					title: titleValue,
					code: codeValue,
					format: selFormat,
					color: selColor,
					bid: bid,
				})
			);
		});

		navigation.navigate("Cards");
	};

	const onTitleChange = (value: string) => {
		if (titleError) {
			setTitleError({is: false, text: ""});
		}
		setTitleValue(value);
	}

	const onCodeChange = (value: string) => {
		if (codeError) {
			setCodeError({is: false, text: ""});
		}
		setCodeValue(value);
	}

	const formatData = formatList.map((format, index) => {
		return {
			index: index,
			format: format
		}
	});

	const colorData = colorList.map((color, index) => {
		return {
			index: index,
			color: color,
		};
	});

	return (
		<View>
			<View style={styles.container}>
				<View style={styles.inputContainer}>
					<TextInput
						mode="outlined"
						label={loc.t("titleLabel")}
						onChangeText={onTitleChange}
						error={titleError.is}
					/>
					<HelperText type="error" visible={titleError.is}>
						{titleError.text}
					</HelperText>
					<TextInput
						mode="outlined"
						label={loc.t("codeLabel")}
						onChangeText={onCodeChange}
						error={codeError.is}
						value={codeValue}
					/>
					<HelperText type="error" visible={codeError.is}>
						{codeError.text}
					</HelperText>
				</View>
				<View style={styles.formatContainer}>
					<Text style={styles.choose} variant="titleSmall">{loc.t("chooseFormatLabel")}</Text>
					<FlatList
						numColumns={3}
						data={formatData}
						keyExtractor={item => `formatItem-${item.index}`}
						columnWrapperStyle={{
							justifyContent: "space-between"
						}}
						renderItem={({item}) => (
							<Chip
								style={selFormat === item.format ? styles.formatSelected : styles.format}
								mode={selFormat === item.format ? "flat" : "outlined"}
								onPress={() => setSelFormat(item.format)}
							>
								{item.format}
							</Chip>
						)}
					/>
				</View>
				<View style={styles.colorContainer}>
					<Text style={styles.choose} variant="titleSmall">{loc.t("chooseColorLabel")}</Text>
					<ColorButton.Group color={selColor} onColorChange={(color) => setSelColor(color)} >
						<FlatList
							key={colorListKey}
							numColumns={Math.floor(dimension.current.width / 46)}
							getItemLayout={(_data, index) => ({
								length: 46,
								offset: 46 * index,
								index: index
							})}
							data={colorData}
							keyExtractor={(item) => `colorButton-${item.index}`}
							renderItem={({item}) => (
								<ColorButton style={styles.colorButton} color={item.color} />
							)}
						/>
					</ColorButton.Group>
				</View>
				<View style={styles.buttonContainer}>
					<Button
						style={styles.scanButton}
						mode="outlined"
						onPress={() => {
							navigation.navigate("Scan", {
								types: ScanTypes.ALL,
							});
						}}
					>
						{loc.t("scanButton")}
					</Button>
					<Button
						style={styles.addButton}
						mode="contained"
						onPress={onAddPress}
					>
						{loc.t("addButton")}
					</Button>
				</View>
			</View>
			<Snackbar
				style={{backgroundColor: theme.colors.errorContainer}}
				visible={snackVisible}
				duration={3500}
				onDismiss={() => {
					setSnackVisible(false);
					setSnackMsg("");
				}}
			>
				<Text style={{color: theme.colors.onErrorContainer}}>{snackMsg}</Text>
			</Snackbar>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 12,
	},
	inputContainer: {
		marginTop: 6,
		marginBottom: 6,
	},
	formatContainer: {
		marginTop: 6,
		marginBottom: 6,
	},
	choose: {
		marginBottom: 6,
	},
	format: {
		margin: 3,
		flex: 1,
	},
	formatSelected: {
		margin: 4,
		flex: 1,
	},
	buttonContainer: {
		marginTop: 6,
		marginBottom: 6,
		flexDirection: "row",
	},
	scanButton: {
		flex: 1,
		marginRight: 6,
	},
	addButton: {
		flex: 2,
		marginLeft: 6,
	},
	colorContainer: {
		marginTop: 6,
		marginBottom: 6,
	},
	colorButton: {
		margin: 3,
	},
});

export default withTheme(AddCard);
