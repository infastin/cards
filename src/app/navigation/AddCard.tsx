import React from "react";
import {FlatList, StyleSheet, View} from "react-native";
import {Button, TextInput, MD3Theme, withTheme, Text, HelperText, Chip} from "react-native-paper";
import ColorButton from "../components/colorbutton";
import {ScanTypes} from "./Scan";
import {StackProps} from "./Types";
import Database from "../models/Database";

export type AddCardProps = StackProps<"AddCard"> & {
	theme: MD3Theme,
};

type Error = {
	is: boolean;
	text: string;
};

const AddCard = ({theme, navigation, route}: AddCardProps) => {
	const colorList = ["red", "black", "green", "cyan"];
	const [selColor, setSelColor] = React.useState<string>(colorList[0]);

	const formatList: string[] = Object.values(ScanTypes.Str);
	const [selFormat, setSelFormat] = React.useState<string>(route.params?.format ? route.params.format : formatList[0]);

	const [titleValue, setTitleValue] = React.useState<string>("");
	const [titleError, setTitleError] = React.useState<Error>({is: false, text: ""});

	const [codeValue, setCodeValue] = React.useState<string>(route.params?.code ? route.params.code : "");
	const [codeError, setCodeError] = React.useState<Error>({is: false, text: ""});

	const db = Database.useDatabase();

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

			return unsubscribe;
		});
	}, [navigation, route]);

	const onAddPress = () => {
		let errors = 0;

		if (titleValue.length == 0) {
			setTitleError({is: true, text: "Title is empty!"});
			errors++;
		}

		if (codeValue.length == 0) {
			setCodeError({is: true, text: "Code is empty!"});
			errors++;
		}

		if (errors != 0) {
			return;
		}

		db.write(() => {
			db.create(
				"Card",
				Database.Card.gen({
					title: titleValue,
					code: codeValue,
					format: selFormat,
					color: selColor
				})
			);
		});
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
		<View style={styles.container}>
			<View style={styles.inputContainer}>
				<TextInput
					mode="outlined"
					label="Title"
					onChangeText={onTitleChange}
					error={titleError.is}
				/>
				<HelperText type="error" visible={titleError.is}>
					{titleError.text}
				</HelperText>
				<TextInput
					mode="outlined"
					label="Code"
					onChangeText={onCodeChange}
					error={codeError.is}
					value={codeValue}
				/>
				<HelperText type="error" visible={codeError.is}>
					{codeError.text}
				</HelperText>
			</View>
			<View style={styles.formatContainer}>
				<Text style={styles.choose} variant="titleSmall">Choose format</Text>
				<FlatList
					style={styles.formatGroup}
					numColumns={3}
					data={formatData}
					keyExtractor={item => "formatItem" + item.index}
					renderItem={({item}) => (
						<Chip
							style={[styles.format]}
							mode="flat"
							selected={selFormat === item.format}
							onPress={() => setSelFormat(item.format)}
						>
							{item.format}
						</Chip>
					)}
				/>
			</View>
			<View style={styles.colorContainer}>
				<Text style={styles.choose} variant="titleSmall">Choose color</Text>
				<ColorButton.Group style={styles.colorGroup} color={selColor} onColorChange={(color) => setSelColor(color)}>
					<FlatList
						data={colorData}
						numColumns={8}
						renderItem={({item}) => (
							<ColorButton style={[styles.colorButton]} color={item.color} />
						)}
						keyExtractor={item => "colorButton" + item.index}
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
					Scan
				</Button>
				<Button
					style={styles.addButton}
					mode="contained"
					onPress={onAddPress}
				>
					Add
				</Button>
			</View>
		</View >
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
	formatGroup: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	format: {
		margin: 3,
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
	choose: {
		marginBottom: 6,
	},
	colorGroup: {
		flexDirection: "row",
	},
	colorButton: {
		margin: 3,
	},
});

export default withTheme(AddCard);
