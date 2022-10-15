import React, {useState} from 'react';
import {Appbar, Menu} from 'react-native-paper';
import {getHeaderTitle} from '@react-navigation/elements';
import {StackHeaderProps} from '@react-navigation/stack';

const Header = ({options, route, navigation, back}: StackHeaderProps) => {
	const [visible, setVisible] = useState(false);
	const title = getHeaderTitle(options, route.name)

	return (
		<Appbar.Header>
			{back && <Appbar.BackAction onPress={() => navigation.goBack()} />}
			<Appbar.Content title={title} />
			<Menu
				visible={visible}
				onDismiss={() => setVisible(false)}
				anchor={<Appbar.Action icon="dots-vertical" onPress={() => setVisible(true)} />}
			>
				<Menu.Item title="Settings" onPress={() => console.log("Settings")} />
				<Menu.Item title="About" onPress={() => console.log("About")} />
			</Menu>

		</Appbar.Header>
	)
};

export default Header;
