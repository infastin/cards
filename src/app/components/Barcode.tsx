import {Svg, Rect} from 'react-native-svg';
import React from 'react';
import BwipJs from '../types/BwipJs';

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
	const getRectangles1D = (encoding: BwipJs.RawReturn): Rectangle[] => {
		const unitWidth = 100 / encoding.sbs.reduce((pSum, number) => pSum + number, 0);

		let rects = [];
		let x = 0
		let y = 0

		for (let i = 0; i < encoding.sbs.length; ++i) {
			const barWidth = encoding.sbs[i];

			if (i % 2 != 0) {
				rects.push({
					x: x - unitWidth * barWidth,
					y: y,
					width: unitWidth * barWidth,
					height: 100,
				});
			}

			x += unitWidth * barWidth;
		}

		return rects;
	};

	const getRectangles2D = (encoding: BwipJs.RawReturn): Rectangle[] => {
		const unitWidth = 100 / encoding.pixx;
		const unitHeight = 100 / encoding.pixy;

		let rects = [];
		let y = 0;

		for (let j = 0; j < encoding.pixy; ++j) {
			let barWidth = 0;
			let x = 0;

			for (let i = 0; i < encoding.pixx; ++i) {
				if (encoding.pixs[j * encoding.pixx + i]) {
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
		try {
			const encoding = BwipJs.raw(BarcodeTypes[format], value)[0];
			if (encoding.sbs) {
				return getRectangles1D(encoding);
			} else {
				return getRectangles2D(encoding);
			}
		} catch (err) {
			console.error(err);
			return [];
		}
	}

	const rects = getRectangles();

	return (
		<Svg>
			{rects.map((rect, i) => {
				return <Rect
					key={i}
					fill="black"
					x={rect.x + "%"}
					y={rect.y + "%"}
					width={rect.width + "%"}
					height={(rect.height + 0.5) + "%"}
				/>
			})}
		</Svg>
	);
};

export default React.memo(Barcode);
