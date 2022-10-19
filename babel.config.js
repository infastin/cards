module.exports = function(api) {
	api.cache(false);
	return {
		presets: ['babel-preset-expo'],
		plugins: [
			"preval", "macros",
			["react-native-reanimated/plugin", {
				globals: ["__scanCodes"],
			}]
		]
	};
};
