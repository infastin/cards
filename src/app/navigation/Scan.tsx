import Svg, {Defs, Mask, Rect} from "react-native-svg";
import React from "react";
import {Camera, useCameraDevices, useFrameProcessor, Frame} from "react-native-vision-camera";
import {useKeepAwake} from "expo-keep-awake";
import {View, StyleSheet} from "react-native";
import {Button, Text} from "react-native-paper";
import {StackProps} from "../models/Navigation";
import {MD3Theme} from "react-native-paper/lib/typescript/types";
import Locale from "../locale";
import {scanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';
import {useSharedValue, runOnJS} from "react-native-reanimated";
import Icon from "react-native-paper/src/components/Icon";
import * as IntentLauncher from 'expo-intent-launcher';
import Intent from "../models/Intent";
import AppInfo from "../models/AppInfo";

const ScanTypesCodes = {
	CODE128: BarcodeFormat.CODE_128,
	CODE93: BarcodeFormat.CODE_93,
	CODE39: BarcodeFormat.CODE_39,
	PDF417: BarcodeFormat.PDF417,
	EAN8: BarcodeFormat.EAN_8,
	EAN13: BarcodeFormat.EAN_13,
	QR: BarcodeFormat.QR_CODE,
};
const ScanTypesAll = Object.values(ScanTypesCodes);
const ScanTypesStr = Object.fromEntries(
	Object.entries(ScanTypesCodes).map(
		([k, v]) => [v, k]
	)
);

export const ScanTypes = Object.assign(
	ScanTypesCodes,
	{
		Str: ScanTypesStr,
		ALL: ScanTypesAll
	}
);

type Point = {
	x: number;
	y: number;
};

export type ScanProps = StackProps<"Scan"> & {
	theme: MD3Theme,
};

const Scan = ({navigation, route}: ScanProps) => {
	const [hasPermission, setHasPermission] = React.useState<boolean>(false);
	const [active, setActive] = React.useState<boolean>(true);
	const barcodeScanned = useSharedValue<boolean>(false);

	const devices = useCameraDevices();
	const device = devices.back;

	React.useEffect(() => {
		(async () => {
			const status = await Camera.requestCameraPermission();
			setHasPermission(status === "authorized");
		})();
	}, []);

	const onBarcodeScanned = ({format, data}: {format: BarcodeFormat, data: string}) => {
		setActive(false);
		navigation.navigate("AddCard", {
			code: data,
			format: ScanTypes.Str[format],
		})
	}

	useKeepAwake();

	const frameProcessor = useFrameProcessor((frame: Frame) => {
		"worklet";

		const barcodes = scanBarcodes(frame, route.params.types, {checkInverted: true});
		const width = frame.width;
		const height = frame.height;

		for (const barcode of barcodes) {
			let wTopLeft: Point;
			let wBottomRight: Point;
			let topLeft: Point;
			let bottomRight: Point;

			if (width > height) {
				wTopLeft = {x: Math.floor(0.1 * height), y: Math.floor(0.2 * width)};
				wBottomRight = {x: Math.floor(0.9 * height), y: Math.floor(0.5 * width)};
				topLeft = barcode.cornerPoints[3];
				bottomRight = barcode.cornerPoints[1];
			} else {
				wTopLeft = {x: Math.floor(0.1 * width), y: Math.floor(0.2 * height)};
				wBottomRight = {x: Math.floor(0.9 * width), y: Math.floor(0.5 * height)};
				topLeft = barcode.cornerPoints[0];
				bottomRight = barcode.cornerPoints[2];
			}

			if (
				wTopLeft.x > topLeft.x || wTopLeft.x > bottomRight.x ||
				wBottomRight.x < topLeft.x || wBottomRight.x < bottomRight.x ||
				wTopLeft.y > topLeft.y || wTopLeft.y > bottomRight.y ||
				wBottomRight.y < topLeft.y || wBottomRight.y < bottomRight.y
			) {
				continue;
			}

			if (barcodeScanned.value) {
				return;
			}

			barcodeScanned.value = true;

			runOnJS(onBarcodeScanned)({
				format: barcode.format,
				data: barcode.rawValue
			});
		}
	}, [route.params.types, barcodeScanned]);

	const loc = Locale.useLocale();

	return (
		<>
			{hasPermission && device ?
				<View>
					<Camera
						style={StyleSheet.absoluteFill}
						device={device}
						isActive={active}
						frameProcessor={frameProcessor}
						frameProcessorFps={5}
					/>
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
						<Text variant="titleMedium" style={styles.help}>{loc.t("scanHelpMsg")}</Text>
					</View>
				</View>
				:
				<View style={[StyleSheet.absoluteFill, styles.placeholderContainer]}>
					<View style={styles.placeholderGroup}>
						<Icon color="white" source="camera" size={64} />
						<Text variant="headlineMedium" style={styles.placeholderText}>
							{loc.t("scanPlaceholderText")}
						</Text>
						<Button mode="contained" onPress={async () => {
							await IntentLauncher.startActivityAsync({
								action: IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
								data: `package:${AppInfo.pkgName}`
							})
						}}>
							{loc.t("scanGotoSettings")}
						</Button>
					</View>
				</View>
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
	},
	placeholderContainer: {
		backgroundColor: "rgba(0, 0, 0, 0.5)"
	},
	placeholderGroup: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 16,
	},
	placeholderText: {
		color: "white",
		textAlign: "center",
		marginBottom: 16,
	},
});

export default Scan;
