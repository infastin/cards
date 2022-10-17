enum Action {
	CREATE_DOCUMENT = "android.intent.action.CREATE_DOCUMENT",
	OPEN_DOCUMENT = "android.intent.action.OPEN_DOCUMENT",
	CHOOSER = "android.intent.action.CHOOSER",
	SEND = "android.intent.action.SEND",
	VIEW = "android.intent.action.VIEW",
};

enum Category {
	OPENABLE = "android.intent.category.OPENABLE",
};

enum Extra {
	TITLE = "android.intent.extra.TITLE",
	TEXT = "android.intent.extra.TEXT",
	INTENT = "android.intent.extra.INTENT",
	STREAM = "android.intent.extra.STREAM",
	MIME_TYPES = "android.intent.extra.MIME_TYPES",
};

enum Flags {
	GRANT_WRITE_URI_PERMISSION = 0x00000002,
	GRANT_READ_URI_PERMISSION = 0x00000001,
};

export default {
	Action: Action,
	Category: Category,
	Extra: Extra,
	Flags: Flags,
};
