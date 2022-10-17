import {expo as app} from "../../../app.json";
import raw from "raw.macro";

export default {
	version: app.version,
	source: app.githubUrl,
	license: "GNU General Public License v3.0",
	name: app.name,
	pkgName: app.android.package,
	icon: require("../../../assets/icon.png"),
	iconAuthor: "Flat-Icons-com",
	iconAuthorUrl: "https://www.flaticon.com/authors/flat-icons-com",
	licenseText: raw("../../../LICENSE"),
};
