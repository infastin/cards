import Database from "./Database";
import Realm, { BSON } from "realm";
import BwipJs from "./BwipJs";
import { BarcodeTypes } from "../components/Barcode";

export class Exception {
	msg: string;
	err: Error;

	constructor(msg: string, err: Error) {
		this.msg = msg;
		this.err = err;
	}
};

export type WriteBarcodeParams = {
	db: Realm;
	format: string;
	code: string;
};

export type FindBarcodeParams = WriteBarcodeParams;

const findBarcode = ({ db, format, code }: WriteBarcodeParams): Realm.BSON.ObjectId | undefined => {
	let barcode = db.objects(Database.Barcode).filtered(
		`code == $0 && format == $1 LIMIT(1)`,
		code, format
	);

	if (barcode.length > 0) {
		return barcode[0]._id;
	}

	return undefined;
};

export const writeBarcode = ({ db, format, code }: WriteBarcodeParams): Realm.BSON.ObjectId => {
	let bid = findBarcode({ db, format, code });

	if (bid === undefined) {
		const data = BSON.serialize(BwipJs.raw(BarcodeTypes[format], code)[0]);
		db.write(() => {
			const obj = db.create(
				Database.Barcode,
				Database.Barcode.generate({
					code: code,
					format: format,
					data: data,
				})
			);
			bid = obj._id;
		});
	}

	return bid;
}

export type WriteCardParams = {
	db: Realm;
	format: string;
	code: string;
	title: string;
	color: string;
	bid?: Realm.BSON.ObjectId;
};

export const writeCard = ({ db, ...params }: WriteCardParams): Realm.BSON.ObjectId => {
	let id: Realm.BSON.ObjectId;

	if (params.bid || (params.bid = findBarcode({ db, format: params.format, code: params.code }))) {
		try {
			db.write(() => {
				const card = db.create(Database.Card, Database.Card.generate({
					title: params.title,
					format: params.format,
					code: params.code,
					color: params.color,
					bid: params.bid
				}))
				id = card._id;
			});
		} catch (err) {
			throw new Exception("dbBadWrite", err);
		}
	} else {
		let data: ArrayBuffer;

		try {
			data = BSON.serialize(BwipJs.raw(BarcodeTypes[params.format], params.code)[0]);
		} catch (err) {
			const strError: String = err.toString();
			const errorMsg = strError.split(":")[1].trim();
			throw new Exception(errorMsg, err);
		}

		try {
			db.write(() => {
				const barcode = db.create(
					Database.Barcode,
					Database.Barcode.generate({
						code: params.code,
						format: params.format,
						data: data,
					})
				);

				const card = db.create(Database.Card, Database.Card.generate({
					title: params.title,
					format: params.format,
					code: params.code,
					color: params.color,
					bid: barcode._id
				}));

				id = card._id;
			});
		} catch (err) {
			throw new Exception("dbBadWrite", err);
		}
	}

	return id;
}

export type WriteManyCardsParams = {
	db: Realm;
	cards: {
		format: string;
		code: string;
		title: string;
		color: string;
		bid?: Realm.BSON.ObjectId;
	}[];
};

export const writeManyCards = ({ db, cards }: WriteManyCardsParams) => {
	if (cards.length == 1) {
		writeCard({ db, ...cards[0] })
		return;
	}

	try {
		db.write(() => {
			let table = new Map<{ format: string, code: string }, Realm.BSON.ObjectId>()

			for (const card of cards) {
				if (
					card.bid ||
					(card.bid = table.get({ format: card.format, code: card.code })) ||
					(card.bid = findBarcode({ db, format: card.format, code: card.code }))
				) {
					db.create(Database.Card, Database.Card.generate({
						title: card.title,
						format: card.format,
						code: card.code,
						color: card.color,
						bid: card.bid
					}))
				} else {
					let data: ArrayBuffer;

					try {
						data = BSON.serialize(BwipJs.raw(BarcodeTypes[card.format], card.code)[0]);
					} catch (err) {
						const strError: String = err.toString();
						const errorMsg = strError.split(":")[1].trim();
						throw new Exception(errorMsg, err);
					}

					const barcode = db.create(
						Database.Barcode,
						Database.Barcode.generate({
							code: card.code,
							format: card.format,
							data: data,
						})
					);

					db.create(Database.Card, Database.Card.generate({
						title: card.title,
						format: card.format,
						code: card.code,
						color: card.color,
						bid: barcode._id
					}));

					table.set({ format: card.format, code: card.code }, barcode._id);
				}
			}
		});
	} catch (err) {
		throw new Exception("dbBadWrite", err);
	}
}
