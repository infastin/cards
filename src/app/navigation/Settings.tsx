import React, {useState} from "react";
import {MD3Theme} from "react-native-paper/lib/typescript/types";
import {Dialog, List, Portal} from "react-native-paper";
import Locale from "../locale";
import {StackProps} from "../models/Navigation";
import {FlatList, SafeAreaView, ScrollView, View} from "react-native";
import Database from "../models/Database";

export type SettingsProps = StackProps<"Settings"> & {
	theme: MD3Theme,
};

export const Settings = ({}: SettingsProps) => {
	const [langDialogVisible, setLangDialogVisible] = useState<boolean>(false);
	const [themeDialogVisible, setThemeDialogVisible] = useState<boolean>(false);

	const loc = Locale.useLocale();

	const db = Database.useDatabase();
	const settings = Database.useQuery(Database.Settings)[0];

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
		<View>
			<SafeAreaView>
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
						/>
						<List.Item
							title={loc.t("settingsExport")}
							left={(props) => <List.Icon {...props} icon="database-export" />}
						/>
					</List.Section>
					<List.Section title={loc.t("settingsIcons")}>
						<List.Item
							title={loc.t("settingsManageIcons")}
							left={(props) => <List.Icon {...props} icon="package-variant" />}
						/>
						<List.Item
							title={loc.t("settingsImportIcons")}
							left={(props) => <List.Icon {...props} icon="package-down" />}
						/>
					</List.Section>
				</ScrollView>
			</SafeAreaView>
			<Portal>
				<Dialog
					visible={langDialogVisible}
					onDismiss={() => setLangDialogVisible(false)}
				>
					<Dialog.Title>{loc.t("settingsLang")}</Dialog.Title>
					<Dialog.ScrollArea>
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
			</Portal>
			<Portal>
				<Dialog
					visible={themeDialogVisible}
					onDismiss={() => setThemeDialogVisible(false)}
				>
					<Dialog.Title>{loc.t("settingsTheme")}</Dialog.Title>
					<Dialog.ScrollArea>
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
			</Portal>
		</View>
	)
};
