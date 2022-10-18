import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Appbar, Menu} from 'react-native-paper';
import {getHeaderTitle} from '@react-navigation/elements';
import {StackHeaderProps} from '@react-navigation/stack';
import Locale from '../locale';

const Header = ({options, route, navigation, back}: StackHeaderProps) => {
	const [visible, setVisible] = useState(false);
	const name = getHeaderTitle(options, route.name);
	const loc = Locale.useLocale();
	const title = loc.t(name);

	return (
		<Appbar.Header
			mode="small"
			style={name === "Scan" ? styles.headerScan : undefined}
		>
			{back && <Appbar.BackAction
				color={name === "Scan" ? "#ffffff" : undefined}
				onPress={() => navigation.goBack()}
			/>}
			<Appbar.Content color={name === "Scan" ? "#ffffff" : undefined} title={title} />
			<Menu
				visible={visible}
				onDismiss={() => setVisible(false)}
				anchor={(name === "Cards" || name === "AddCard") && <Appbar.Action
					icon="dots-vertical"
					onPress={() => setVisible(true)}
				/>}
			>
				<Menu.Item title={loc.t("HeaderMenuSettings")} onPress={() => {
					setVisible(false);
					navigation.navigate("Settings");
				}} />
				<Menu.Item title={loc.t("HeaderMenuAbout")} onPress={() => {
					setVisible(false);
					navigation.navigate("About");
				}} />
			</Menu>

		</Appbar.Header>
	)
};

const styles = StyleSheet.create({
	headerScan: {
		backgroundColor: "transparent",
		position: "absolute",
		width: "100%",
		top: 0,
		left: 0,
	},
});

export default Header;
