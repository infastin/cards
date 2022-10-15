import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Appbar, Menu} from 'react-native-paper';
import {getHeaderTitle} from '@react-navigation/elements';
import {StackHeaderProps} from '@react-navigation/stack';

const Header = ({options, route, navigation, back}: StackHeaderProps) => {
	const [visible, setVisible] = useState(false);
	const title = getHeaderTitle(options, route.name)

	return (
		<Appbar.Header
			mode="small"
			statusBarHeight={0}
			style={title === "Scan" ? styles.headerScan : undefined}
		>
			{back && <Appbar.BackAction
				color={title === "Scan" ? "#ffffff" : undefined}
				onPress={() => navigation.goBack()}
			/>}
			<Appbar.Content color={title === "Scan" ? "#ffffff" : undefined} title={title} />
			<Menu
				visible={visible}
				onDismiss={() => setVisible(false)}
				anchor={<Appbar.Action
					color={title === "Scan" ? "#ffffff" : undefined}
					icon="dots-vertical"
					onPress={() => setVisible(true)}
				/>}
			>
				<Menu.Item title="Settings" onPress={() => console.log("Settings")} />
				<Menu.Item title="About" onPress={() => console.log("About")} />
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
