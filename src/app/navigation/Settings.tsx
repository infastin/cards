import React from "react";
import {MD3Theme} from "react-native-paper/lib/typescript/types";
import {Button, Dialog, List, Menu, Portal, TextInput, TouchableRipple, Text, withTheme} from "react-native-paper";
import Locale from "../locale";
import {StackProps} from "../models/Navigation";
import {FlatList, LayoutRectangle, SafeAreaView, ScrollView, View, StyleSheet} from "react-native";
import Database from "../models/Database";
import dayjs from "dayjs";
import * as IntentLauncher from 'expo-intent-launcher';
import {BSON} from "realm";
import Intent from "../models/Intent";
import RNFS from "react-native-fs";
import {Exception, writeManyCards} from "../models/DatabaseWrite";
import {Buffer} from 'buffer';
import {useStateCallback} from "../models/Hooks";
import Infobar from "../components/Infobar";

export type SettingsProps = StackProps<"Settings"> & {
	theme: MD3Theme,
};

const Settings = ({theme}: SettingsProps) => {
	const [langDialogVisible, setLangDialogVisible] = React.useState<boolean>(false);
	const [themeDialogVisible, setThemeDialogVisible] = React.useState<boolean>(false);
	const [exportDialogVisible, setExportDialogVisible] = useStateCallback<boolean>(false);

	const [exportMenuVisible, setExportMenuVisible] = React.useState<boolean>(false);
	const [exportIconLayout, setExportIconLayout] = React.useState<LayoutRectangle>({x: 0, y: 0, width: 0, height: 0});
	const [exportTextLayout, setExportTextLayout] = React.useState<LayoutRectangle>({x: 0, y: 0, width: 0, height: 0});
	const [exportIconName, setExportIconName] = React.useState<string>("menu-down");

	const [infoVisible, setInfoVisible] = React.useState<boolean>(false);
	const [infoMsg, setInfoMsg] = React.useState<string>("");
	const [infoVariant, setInfoVariant] = React.useState<"info" | "error" | "success">("info");

	const exportFormats = [
		{
			label: "Cards (.json)",
			value: "json",
		},
		{
			label: "Binary (.bson)",
			value: "bson"
		}
	]

	const formatMimeTypes = {
		bson: "application/octet-stream",
		json: "application/json",
	};

	const [exportFormat, setExportFormat] = React.useState<typeof exportFormats[0]>(exportFormats[0]);

	const loc = Locale.useLocale();

	const db = Database.useDatabase();
	const settings = Database.useQuery(Database.Settings)[0];

	const exportCards = ({format, share}: {format: string, share: boolean}) => {
		const date = dayjs().format("YYYYMMDD-HHmmss");
		const exportFilename = `Cards-${date}.${format}`;
		const cards = db.objects(Database.Card);

		let data: string;
		switch (format) {
			case "bson":
				data = BSON.serialize(cards).toString("binary");
				break;
			default:
			case "json":
				data = JSON.stringify(cards);
				break;
		}

		if (share) {
			const exportPath = RNFS.CachesDirectoryPath + "/" + exportFilename;
			(async () => {
				await RNFS.writeFile(exportPath, data);
				await IntentLauncher.startActivityAsync({
					action: Intent.Action.CHOOSER,
					extra: {
						[Intent.Extra.INTENT]: {
							action: Intent.Action.SEND,
							type: formatMimeTypes[format],
							flags: Intent.Flags.GRANT_READ_URI_PERMISSION,
							extra: {
								[Intent.Extra.STREAM]: exportPath,
							}
						}
					}
				});
			})();
		} else {
			(async () => {
				const intentResult = await IntentLauncher.startActivityAsync({
					action: Intent.Action.CREATE_DOCUMENT,
					category: Intent.Category.OPENABLE,
					type: formatMimeTypes[format],
					extra: {
						[Intent.Extra.TITLE]: exportFilename,
					}
				});

				if (intentResult.resultCode === IntentLauncher.ResultCode.Success) {
					await RNFS.writeFile(intentResult.data, data);
				}
			})();
		}
	};

	const importCards = () => {
		(async () => {
			const intentResult = await IntentLauncher.startActivityAsync({
				action: Intent.Action.OPEN_DOCUMENT,
				category: Intent.Category.OPENABLE,
				type: "application/*",
				extra: {
					[Intent.Extra.MIME_TYPES]: Object.values(formatMimeTypes),
				}
			});

			if (intentResult.resultCode === IntentLauncher.ResultCode.Success) {
				const data = await RNFS.readFile(intentResult.data);
				let cards: Database.Card.Schema[];

				try {
					cards = JSON.parse(data);
				} catch {
					try {
						const cardsBson = BSON.deserialize(Buffer.from(data, "binary"));
						cards = Object.values(cardsBson);
					} catch {
						setInfoVariant("error");
						setInfoMsg(`${loc.t("errorLabel")}: ${loc.t("invalidFile")}`);
						setInfoVisible(true);
						return;
					}
				}

				for (const i in cards) {
					cards[i].bid = undefined;
				}

				try {
					writeManyCards({db, cards});
					setInfoVariant("success");
					setInfoMsg(`${loc.t("successLabel")}: ${loc.t("importSuccess")}`);
					setInfoVisible(true);
				} catch (err) {
					const error: Exception = err;
					setInfoVariant("error");
					setInfoMsg(`${loc.t("errorLabel")}: ${loc.t(error.msg)}`);
					setInfoVisible(true);
				}
			}
		})();
	};

	const exportMenuShow = () => {
		setExportMenuVisible(true);
		setExportIconName("menu-up");
	};

	const exportMenuHide = (opts: {label: string, value: string} | undefined) => {
		if (opts) {
			setExportFormat(opts);
		}
		setExportMenuVisible(false);
		setExportIconName("menu-down");
	};

	const langData = {
		system: loc.t("settingsLangSystem"),
		...Locale.Languages,
	};

	const themeData = {
		system: loc.t("settingsThemeSystem"),
		dark: loc.t("settingsThemeDark"),
		light: loc.t("settingsThemeLight")
	};

	const langDataList = Object.entries(langData);
	const themeDataList = Object.entries(themeData);

	return (
		<SafeAreaView style={{flex: 1}}>
			<ScrollView>
				<List.Section title={loc.t("settingsApperance")}>
					<List.Item
						title={loc.t("settingsLang")}
						description={langData[settings.lang]}
						left={(props) => <List.Icon {...props} icon="web" />}
						onPress={() => setLangDialogVisible(true)}
					/>
					<List.Item
						title={loc.t("settingsTheme")}
						description={themeData[settings.theme]}
						left={(props) => <List.Icon {...props} icon="brush-variant" />}
						onPress={() => setThemeDialogVisible(true)}
					/>
				</List.Section>
				<List.Section title={loc.t("settingsIAE")}>
					<List.Item
						title={loc.t("settingsImport")}
						left={(props) => <List.Icon {...props} icon="database-import" />}
						onPress={importCards}
					/>
					<List.Item
						title={loc.t("settingsExport")}
						left={(props) => <List.Icon {...props} icon="database-export" />}
						onPress={() => setExportDialogVisible(true)}
					/>
				</List.Section>
			</ScrollView>
			<Infobar
				variant={infoVariant}
				text={infoMsg}
				visible={infoVisible}
				duration={3500}
				onDismiss={() => {
					setInfoVisible(false);
					setInfoMsg("");
					setInfoVariant("info");
				}}
			/>
			<Portal>
				<Dialog
					visible={langDialogVisible}
					onDismiss={() => setLangDialogVisible(false)}
				>
					<Dialog.Title>{loc.t("settingsLang")}</Dialog.Title>
					<Dialog.ScrollArea style={{height: "60%"}}>
						<FlatList
							data={langDataList}
							keyExtractor={item => item[0]}
							renderItem={({item}) => (
								<List.Item
									title={item[1]}
									onPress={() => {
										const settings = db.objects(Database.Settings)[0];
										db.write(() => {
											settings.lang = item[0];
										});
									}}
								/>
							)}
						/>
					</Dialog.ScrollArea>
				</Dialog>
				<Dialog
					visible={themeDialogVisible}
					onDismiss={() => setThemeDialogVisible(false)}
				>
					<Dialog.Title>{loc.t("settingsTheme")}</Dialog.Title>
					<Dialog.ScrollArea style={{height: "60%"}}>
						<FlatList
							data={themeDataList}
							keyExtractor={item => item[0]}
							renderItem={({item}) => (
								<List.Item
									title={item[1]}
									onPress={() => {
										const settings = db.objects(Database.Settings)[0];
										db.write(() => {
											settings.theme = item[0];
										});
									}}
								/>
							)}
						/>
					</Dialog.ScrollArea>
				</Dialog>
				<Dialog
					visible={exportDialogVisible}
					onDismiss={() => setExportDialogVisible(false)}
				>
					<Dialog.Title>{loc.t("settingsExportTitle")}</Dialog.Title>
					<Dialog.Content>
						<Menu
							visible={exportMenuVisible}
							onDismiss={() => exportMenuHide(undefined)}
							anchor={
								<View
									style={{backgroundColor: theme.colors.surface}}
									onLayout={(e) => setExportTextLayout(e.nativeEvent.layout)}
								>
									<TouchableRipple onPress={exportMenuShow}>
										<TextInput
											editable={false}
											label={loc.t("settingsExportFormat")}
											value={exportFormat.label}
											style={{backgroundColor: "transparent"}}
											right={
												<TextInput.Icon
													icon={exportIconName}
													onLayout={(e) => setExportIconLayout(e.nativeEvent.layout)}
													onPress={exportMenuShow}
												/>
											}
										/>
									</TouchableRipple>
								</View>
							}
							style={{
								width: exportTextLayout.width,
								marginTop: exportIconLayout.height,
							}}
						>
							{exportFormats.map(({label, value}, index) => (
								<List.Item
									key={index}
									onPress={() => exportMenuHide({label, value})}
									title={label}
								/>
							))}
						</Menu>
						<View style={styles.menuExportButtonGroup}>
							<Button
								mode="outlined"
								style={styles.menuExportShare}
								onPress={() => {
									setExportDialogVisible(false, () => {
										exportCards({format: exportFormat.value, share: true})
									});
								}}
							>
								{loc.t("settingsExportShare")}
							</Button>
							<Button
								mode="contained"
								style={styles.menuExportSave}
								onPress={() => {
									setExportDialogVisible(false, () => {
										exportCards({format: exportFormat.value, share: false})
									});
								}}
							>
								{loc.t("settingsExportSave")}
							</Button>
						</View>
					</Dialog.Content>
				</Dialog>
			</Portal>
		</SafeAreaView>
	)
};

const styles = StyleSheet.create({
	menuExportButtonGroup: {
		flexDirection: "row",
		marginTop: 12,
	},
	menuExportSave: {
		flex: 2,
		marginHorizontal: 6,
	},
	menuExportShare: {
		flex: 1,
		marginHorizontal: 6,
	}
});

export default withTheme(Settings);
