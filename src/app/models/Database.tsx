import { Realm, createRealmContext } from '@realm/react';

class Card extends Realm.Object {
	_id: Realm.BSON.ObjectId;
	title: string;
	code: string;
	format: string;
	color: string;
	bid: Realm.BSON.ObjectId;

	static generate = ({ title, code, format, color, bid }: Database.Card.GenerateProps): Database.Card.Schema => {
		return {
			_id: new Realm.BSON.ObjectId(),
			title: title,
			code: code,
			format: format,
			color: color,
			bid: bid,
		}
	}

	static schema = {
		name: "Card",
		primaryKey: "_id",
		properties: {
			_id: "objectId",
			title: "string",
			code: "string",
			format: "string",
			color: "string",
			bid: "objectId",
		},
	};
}

class Barcode extends Realm.Object {
	_id: Realm.BSON.ObjectId;
	code: string;
	format: string;
	data: ArrayBuffer;

	static generate = ({ code, format, data }: Database.Barcode.GenerateProps): Database.Barcode.Schema => {
		return {
			_id: new Realm.BSON.ObjectId(),
			code: code,
			format: format,
			data: data,
		};
	};

	static schema = {
		name: "Barcode",
		primaryKey: "_id",
		properties: {
			_id: "objectId",
			code: "string",
			format: "string",
			data: "data",
		},
	};
}

class Settings extends Realm.Object {
	_id: Realm.BSON.ObjectId;
	theme: string;
	lang: string;

	static generate = ({ theme, lang }: Database.Settings.GenerateProps): Database.Settings.Schema => {
		return {
			_id: new Realm.BSON.ObjectId(),
			theme: theme,
			lang: lang,
		};
	};

	static schema = {
		name: "Settings",
		primaryKey: "_id",
		properties: {
			_id: "objectId",
			theme: "string",
			lang: "string",
		}
	}
};

const DatabaseContext = createRealmContext({
	schema: [Card, Barcode, Settings],
});

const Database = {
	Context: DatabaseContext,
	Provider: DatabaseContext.RealmProvider,
	useDatabase: DatabaseContext.useRealm,
	useObject: DatabaseContext.useRealm,
	useQuery: DatabaseContext.useQuery,
	Card: Card,
	Barcode: Barcode,
	Settings: Settings,
};

declare namespace Database {
	type Object<T extends Realm.Object> = T;

	type BarcodeObject = Object<Barcode>;
	namespace Barcode {
		type GenerateProps = {
			code: string;
			format: string;
			data: ArrayBuffer;
		}

		type Schema = GenerateProps & {
			_id: Realm.BSON.ObjectId;
		}
	}

	type CardObject = Object<Card>;
	namespace Card {
		type GenerateProps = {
			title: string;
			code: string;
			format: string;
			color: string;
			bid: Realm.BSON.ObjectId;
		};

		type Schema = GenerateProps & {
			_id: Realm.BSON.ObjectId;
		}
	}

	type SettingsObject = Object<Settings>;
	namespace Settings {
		type GenerateProps = {
			theme: string;
			lang: string;
		}

		type Schema = GenerateProps & {
			_id: Realm.BSON.ObjectId;
		}
	}
}

export default Database;
