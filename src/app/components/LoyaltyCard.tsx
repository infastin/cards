import React, {useState} from "react";
import {StyleSheet} from "react-native";
import {Card, Avatar, IconButton, Menu} from "react-native-paper";
import Barcode from "../components/Barcode"

export type LoyaltyCardProps = {
	title: string;
	code: string;
};

const LoyaltyCard = ({title, code}: LoyaltyCardProps) => {
	const [visible, setVisible] = useState(false);

	return (
		<Card style={styles.card}>
			<Card.Title
				title={title}
				titleVariant="titleMedium"
				subtitleVariant="titleSmall"
				subtitle={code}
				left={(props) => <Avatar.Text {...props} label={title[0]} />}
				right={
					(props) => {
						return (
							<Menu
								visible={visible}
								onDismiss={() => setVisible(false)}
								anchor={
									<IconButton {...props} icon="dots-vertical" onPress={() => setVisible(true)} />
								}
							>
								<Menu.Item leadingIcon="delete" title="Delete" onPress={() => console.log("Delete")} />
								<Menu.Item leadingIcon="content-copy" title="Copy code" onPress={() => console.log("Copy")} />
							</Menu>
						)
					}
				}
			/>
			<Card.Content>
				<Card mode="contained" style={{backgroundColor: "white"}}>
					<Card.Content style={styles.barcode}>
						<Barcode value={code} width="80%" height="64" />
					</Card.Content>
				</Card>
			</Card.Content>
		</Card>
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
