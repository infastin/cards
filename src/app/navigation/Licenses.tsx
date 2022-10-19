import React from "react";
import { ScrollView, View } from "react-native";
import { Dialog, Text, IconButton, List, Portal } from "react-native-paper";
import * as IntentLauncher from 'expo-intent-launcher';
import Intent from "../models/Intent";
import licenses from "../../../licenses.json";
import { FlashList } from "@shopify/flash-list";
import Locale from "../locale";

const Licenses = () => {
	const [dialogVisible, setDialogVisible] = React.useState<boolean>(false);
	const [dialogText, setDialogText] = React.useState<string>("");
	const licensesList = Object.entries(licenses);
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
		<View style={{ flex: 1 }}>
			<FlashList
				data={licensesList}
				keyExtractor={(item) => item[0]}
				estimatedItemSize={65}
				renderItem={({ item }) => {
					return (
						<List.Item
							title={item[1].name}
							description={`${item[1].version} • ${item[1].licenses}`}
							right={() => (
								<IconButton
									icon="open-in-new"
									onPress={() => item[1].repository && openUrl(item[1].repository)}
								/>
							)}
							onPress={() => {
								setDialogText(item[1].licenseText);
								setDialogVisible(true);
							}}
						/>
					)
				}}
			/>
			<Portal>
				<Dialog
					visible={dialogVisible}
					onDismiss={() => setDialogVisible(false)}
				>
					<Dialog.Title>{loc.t("licenseTitle")}</Dialog.Title>
					<Dialog.ScrollArea style={{ maxHeight: "60%" }}>
						<ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
							<Text variant="bodySmall">{dialogText}</Text>
						</ScrollView>
					</Dialog.ScrollArea>
				</Dialog>
			</Portal>
		</View>
	)
};

export default Licenses;
