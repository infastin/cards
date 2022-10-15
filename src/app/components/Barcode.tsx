import {Svg, Rect} from 'react-native-svg';
import JsBarcode from 'jsbarcode';
import React from 'react';

export type BarcodeProps = {
	value: string;
	format?: string;
	width?: string;
	height?: string;
};

type Encoding = {
	data: string;
	options: JsBarcode.Options;
	text: string;
};

type Rectangle = {
	x: number;
	y: number;
	width: number;
};

const Barcode = ({value, format = "CODE128", width = "200", height = "50"}: BarcodeProps) => {
	const encode = () => {
		const data = {encodings: []}
		JsBarcode(data, value, {format: format})
		return data.encodings[0]
	};

	const getRectangles = (encoding: Encoding): Rectangle[] => {
		const binary = encoding.data;
		const unitWidth = 100 / binary.length;

		let rects = [];
		let barWidth = 0
		let x = 0
		let yFrom = 0

		for (let b = 0; b < binary.length; ++b) {
			if (binary[b] === "1") {
				barWidth++;
			} else if (barWidth > 0) {
				rects.push({
					x: x - unitWidth * barWidth,
					y: yFrom,
					width: unitWidth * barWidth,
				});

				barWidth = 0;
			}

			x += unitWidth;
		}

		if (barWidth > 0) {
			rects.push({
				x: x - unitWidth * (barWidth - 1),
				y: yFrom,
				width: unitWidth * barWidth,
			});
		}

		return rects;
	};

	const encoding = encode()
	const rects = getRectangles(encoding)

	return (
		<Svg width={width} height={height}>
			{rects.map((rect, i) => {
				return <Rect key={i} fill="black" x={rect.x + "%"} y={rect.y + "%"} width={rect.width + "%"} height="100%" />
			})}
		</Svg>
	);
};

export default React.memo(Barcode);
