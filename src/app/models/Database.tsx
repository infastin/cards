import {Realm, createRealmContext} from '@realm/react';

class Card extends Realm.Object {
	_id: Realm.BSON.ObjectId;
	title: string;
	code: string;
	format: string;
	color: string;

	static generate = ({title, code, format, color}: Database.Card.GenerateProps): Database.Card.Schema => {
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
		primaryKey: "_id",
		properties: {
			_id: "objectId",
			title: "string",
			code: "string",
			format: "string",
			color: "string",
		},
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
		type GenerateProps = {
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
