import React from "react";
import {View, Image, StyleSheet, ScrollView} from "react-native";
import {Dialog, List, Portal, Text} from "react-native-paper";
import {expo as app} from "../../../app.json";
import AppInfo from "../models/AppInfo";
import * as IntentLauncher from 'expo-intent-launcher';
import Intent from "../models/Intent";
import {StackProps} from "../models/Navigation";
import Locale from "../locale";

const About = ({navigation}: StackProps<"About">) => {
	const [dialogVisible, setDialogVisible] = React.useState<boolean>(false);
	const loc = Locale.useLocale();

	const openUrl = (url: string) => {
		(async () => {
			await IntentLauncher.startActivityAsync({
				action: Intent.Action.VIEW,
				data: url,
			});
		})();
	};

	return (
		<View>
			<View style={styles.header}>
				<Image source={AppInfo.icon} style={[styles.icon, styles.headerItem]} />
				<Text variant="headlineMedium" style={styles.headerItem}>{AppInfo.name}</Text>
			</View>
			<View>
				<List.Item
					title={loc.t("versionTitle")}
					description={app.version}
					left={(props) => <List.Icon {...props} icon="information-outline" />}
				/>
				<List.Item
					title={loc.t("licenseTitle")}
					description={AppInfo.license}
					left={(props) => <List.Icon {...props} icon="file" />}
					onPress={() => setDialogVisible(true)}
				/>
				<List.Item
					title={loc.t("thirdpartyTitle")}
					left={(props) => <List.Icon {...props} icon="file-outline" />}
					onPress={() => navigation.navigate("Licenses")}
				/>
				<List.Item
					title={loc.t("sourceTitle")}
					description={AppInfo.source}
					left={(props) => <List.Icon {...props} icon="github" />}
					onPress={() => openUrl(AppInfo.source)}
				/>
				<List.Item
					title={loc.t("iconTitle")}
					description={`${loc.t("iconCreatedBy")} Flat-Icons-com`}
					left={(props) => <List.Icon {...props} icon="auto-fix" />}
					onPress={() => openUrl(AppInfo.iconAuthorUrl)}
				/>
			</View>
			<Portal>
				<Dialog
					visible={dialogVisible}
					onDismiss={() => setDialogVisible(false)}
				>
					<Dialog.Title>{loc.t("licenseTitle")}</Dialog.Title>
					<Dialog.ScrollArea style={{maxHeight: "60%"}}>
						<ScrollView contentContainerStyle={{paddingVertical: 20}}>
							<Text>{AppInfo.licenseText}</Text>
						</ScrollView>
					</Dialog.ScrollArea>
				</Dialog>
			</Portal>

		</View>
	)
};

const styles = StyleSheet.create({
	header: {
		justifyContent: "center",
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 16,
	},
	headerItem: {
		marginHorizontal: 6,
	},
	icon: {
		width: 72,
		height: 72,
	},
});

export default About;
