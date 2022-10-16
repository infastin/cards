import BwipJsOrig from 'bwip-js';

declare namespace BwipJs {
	type RawReturn = {
		// One-dimensional return
		bbs: number[],
		bhs: number[],
		sbs: number[],

		// Two-dimensional return
		pixs: number[],
		pixx: number,
		pixy: number,
	};
};

declare namespace BwipJsExtra {
	export function raw(encoder: string, text: string, opts?: string): BwipJs.RawReturn[];
};

const BwipJs: (typeof BwipJsOrig & typeof BwipJsExtra) = BwipJsOrig as any;

export default BwipJs;
