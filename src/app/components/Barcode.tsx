import {Svg, Rect} from 'react-native-svg';
import React from 'react';
import BwipJs from '../models/BwipJs';
import Database from '../models/Database';
import {BSON} from 'realm';

export const BarcodeTypes = {
	CODE128: "code128",
	CODE93: "code93",
	CODE39: "code39",
	PDF417: "pdf417",
	EAN8: "ean8",
	EAN13: "ean13",
	QR: "qrcode",
};

export type BarcodeProps = {
	value: string;
	format?: string;
};

type Rectangle = {
	x: number;
	y: number;
	width: number;
	height: number;
};

const Barcode = ({value, format = "CODE128"}: BarcodeProps) => {
	const [width, setWidth] = React.useState<number>(0);
	const [height, setHeight] = React.useState<number>(0);

	const db = Database.useDatabase();

	const getRectangles1D = (encoding: BwipJs.RawReturn): Rectangle[] => {
		const unitWidth = 1 / encoding.sbs.reduce((pSum, number) => pSum + number, 0);

		const rects = [];
		let x = 0

		for (let i = 0; i < encoding.sbs.length; ++i) {
			const barWidth = encoding.sbs[i];

			if (i % 2 == 0) {
				rects.push({
					x: x,
					y: 0,
					width: unitWidth * barWidth,
					height: 1,
				});
			}

			x += unitWidth * barWidth;
		}

		return rects;
	};

	const getRectangles2D = (encoding: BwipJs.RawReturn): Rectangle[] => {
		const unitWidth = 1 / encoding.pixx;
		const unitHeight = 1 / encoding.pixy;

		const rects = [];
		let y = 0;

		for (let i = 0; i < encoding.pixy; ++i) {
			let barWidth = 0;
			let x = 0;

			for (let j = 0; j < encoding.pixx; ++j) {
				if (encoding.pixs[i * encoding.pixx + j]) {
					barWidth++;
				} else if (barWidth > 0) {
					rects.push({
						x: x - unitWidth * barWidth,
						y: y,
						width: unitWidth * barWidth,
						height: unitHeight,
					});

					barWidth = 0;
				}

				x += unitWidth;
			}

			if (barWidth > 0) {
				rects.push({
					x: x - unitWidth * barWidth,
					y: y,
					width: unitWidth * barWidth,
					height: unitHeight,
				});
			}

			y += unitHeight;
		}

		return rects;
	};

	const getRectangles = () => {
		let encoding: BwipJs.RawReturn;
		const barcode = db.objects(Database.Barcode).filtered(
			`code == $0 && format == $1 LIMIT(1)`,
			value, format
		);

		if (barcode.length > 0) {
			encoding = BSON.deserialize(barcode[0].data) as BwipJs.RawReturn;
		} else {
			try {
				encoding = BwipJs.raw(BarcodeTypes[format], value)[0];
				db.write(() => {
					db.create(
						Database.Barcode,
						Database.Barcode.generate({
							code: value,
							format: format,
							data: BSON.serialize(encoding),
						})
					);
				});
			} catch (err) {
				console.error(err);
				return [];
			}
		}

		if (encoding.sbs) {
			return getRectangles1D(encoding);
		} else {
			return getRectangles2D(encoding);
		}
	}

	const rects = getRectangles();

	return (
		<Svg
			onLayout={(props) => {
				setWidth(props.nativeEvent.layout.width);
				setHeight(props.nativeEvent.layout.height);
			}}
		>
			{rects.map((rect, i) => {
				return <Rect
					key={i}
					fill="black"
					x={width * rect.x + 0.5}
					y={height * rect.y + 0.5}
					width={width * rect.width + 0.5}
					height={height * rect.height + 0.5}
				/>
			})}
		</Svg>
	);
};

export default React.memo(Barcode);
