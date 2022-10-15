import {BarCodeScanner, BarCodeScannerResult} from "expo-barcode-scanner";
import Svg, {Defs, Mask, Rect} from "react-native-svg";
import React from "react";
import {Camera, CameraType} from "expo-camera";
import {ScaledSize, Dimensions, View, StyleSheet} from "react-native";
import {Text} from "react-native-paper";
import {StackProps} from "./Types";
import {MD3Theme} from "react-native-paper/lib/typescript/types";

const ScanTypesCodes = {
	CODABAR: BarCodeScanner.Constants.BarCodeType.codabar,
	CODE128: BarCodeScanner.Constants.BarCodeType.code128,
	CODE93: BarCodeScanner.Constants.BarCodeType.code93,
	CODE39: BarCodeScanner.Constants.BarCodeType.code39,
	AZTEC: BarCodeScanner.Constants.BarCodeType.aztec,
	PDF417: BarCodeScanner.Constants.BarCodeType.pdf417,
	EAN8: BarCodeScanner.Constants.BarCodeType.ean8,
	EAN13: BarCodeScanner.Constants.BarCodeType.ean13,
	ITF14: BarCodeScanner.Constants.BarCodeType.itf14,
};
const ScanTypesStr = Object.fromEntries(Object.entries(ScanTypesCodes).map(([k, v]) => [v, k]));
const ScanTypesAll = Object.values(ScanTypesCodes);

export const ScanTypes = Object.assign(
	ScanTypesCodes,
	{
		Str: ScanTypesStr,
		ALL: ScanTypesAll
	}
);

export type ScanProps = StackProps<"Scan"> & {
	theme: MD3Theme,
};

const Scan = ({theme, navigation, route}: ScanProps) => {
	const [hasPermission, setHasPermission] = React.useState<boolean>(false);
	const [dimension, setDimension] = React.useState<ScaledSize>(null as any);

	React.useEffect(() => {
		(async () => {
			const status = await Camera.requestCameraPermissionsAsync();
			setHasPermission(status.status === "granted");
		})();

		setDimension(Dimensions.get("window"));
	}, []);

	React.useEffect(() => {
		const listener = Dimensions.addEventListener("change", ({window}) => setDimension(window));
		return () => listener.remove();
	});

	const onBarCodeScanned = (result: BarCodeScannerResult) => {
		if (!route.params.types.find((type) => type === result.type)) {
			return;
		}

		const wTopLeft = {x: Math.floor(0.1 * dimension.width), y: Math.floor(0.2 * dimension.height)};
		const wBottomRight = {x: Math.floor(0.9 * dimension.width), y: Math.floor(0.5 * dimension.height)};
		const topLeft = result.cornerPoints[0];
		const bottomRight = result.cornerPoints[2];

		if (
			wTopLeft.x > topLeft.x || wTopLeft.x > bottomRight.x ||
			wBottomRight.x < topLeft.x || wBottomRight.x < bottomRight.x ||
			wTopLeft.y > topLeft.y || wTopLeft.y > bottomRight.y ||
			wBottomRight.y < topLeft.y || wBottomRight.y < bottomRight.y
		) {
			return;
		}

		navigation.goBack();
		navigation.navigate("AddCard", {
			code: result.data,
			format: ScanTypes.Str[result.type],
		});
	};

	return (
		<>
			{hasPermission ?
				<BarCodeScanner
					style={StyleSheet.absoluteFill}
					type={CameraType.back}
					onBarCodeScanned={onBarCodeScanned}
					barCodeTypes={route.params.types}
				>
					<Svg>
						<Defs>
							<Mask id="mask">
								<Rect width="100%" height="100%" fill="white" />
								<Rect x="10%" y="20%" width="80%" height="30%" rx="16" fill="black" />
								<Rect x="10%" y="60%" width="80%" height="8%" rx="8" fill="black" />
							</Mask>
						</Defs>
						<Rect mask="url(#mask)" width="100%" height="100%" fill="black" fillOpacity={0.5} />
						<Rect x="10%" y="20%" width="80%" height="30%" rx="16" stroke="white" strokeWidth="2" />
					</Svg>
					<View style={styles.helpContainer}>
						<Text variant="titleMedium" style={styles.help}>Point the camera at the barcode</Text>
					</View>
				</BarCodeScanner>
				:
				undefined
			}
		</>
	)
};

const styles = StyleSheet.create({
	helpContainer: {
		position: "absolute",
		width: "80%",
		top: "60%",
		height: "8%",
		left: "10%",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 8,
		backgroundColor: "rgba(0, 0, 0, 0.75)",
	},
	help: {
		color: "white",
	}
});

export default Scan;
