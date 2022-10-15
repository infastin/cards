import {Realm, createRealmContext} from '@realm/react';

class Card extends Realm.Object {
	_id: Realm.BSON.ObjectId;
	title: string;
	code: string;
	format: string;
	color: string;

	static gen = ({title, code, format, color}: Database.Card.GenProps): Database.Card.Schema => {
		return {
			_id: new Realm.BSON.ObjectId(),
			title: title,
			code: code,
			format: format,
			color: color
		}
	}

	static schema = {
		name: "Card",
		properties: {
			_id: "int",
			title: "string",
			code: "string",
			format: "string",
			color: "string",
		},
		primaryKey: "_id",
	};
};

const DatabaseContext = createRealmContext({
	schema: [Card],
});

const Database = {
	Context: DatabaseContext,
	Provider: DatabaseContext.RealmProvider,
	useDatabase: DatabaseContext.useRealm,
	useObject: DatabaseContext.useRealm,
	useQuery: DatabaseContext.useQuery,
	Card: Card
};

declare namespace Database {
	namespace Card {
		type GenProps = {
			title: string,
			code: string,
			format: string,
			color: string,
		};

		type Schema = {
			_id: Realm.BSON.ObjectId;
			title: string,
			code: string,
			format: string,
			color: string,
		}
	}
};

export default Database;
