import React, {useContext} from 'react';
import {I18n} from 'i18n-js';
import * as Localization from 'expo-localization';
import preval from 'babel-plugin-preval/macro';

export type LocaleProviderProps = {
	locale: string;
	children?: React.ReactNode,
};

const Languages = {
	"en-US": "English",
	"ru-RU": "Русский",
};

const translations = preval`
	const AddCard = require('./AddCard.json');
	const Cards = require('./Cards.json');
	const LoyaltyCard = require('./LoyaltyCard.json');
	const Header = require('./Header.json');
	const Scan = require('./Scan.json');
	const Settings = require('./Settings.json');
	const Errors = require('./Errors.json');
	const Success = require('./Success.json');
	const Info = require('./Info.json');
	const About = require('./About.json');
	const Routes = require('./Routes.json');
	const merge = require('deepmerge');
	module.exports = merge.all([
		AddCard, Cards, Success, LoyaltyCard, Info,
		Header, Scan, Settings, Errors, About, Routes
	]);
`;

const i18n = new I18n(translations);

i18n.defaultLocale = "en-US";
i18n.enableFallback = true;

const LocaleContext = React.createContext<I18n>(i18n);

const LocaleProvider = ({locale, children}: LocaleProviderProps) => {
	if (locale === "system") {
		i18n.locale = Localization.locale;
	} else {
		i18n.locale = locale;
	}

	return (
		<LocaleContext.Provider value={i18n}>
			{children}
		</LocaleContext.Provider>
	);
};

const useLocale = () => useContext(LocaleContext);

const Locale = {
	Provider: LocaleProvider,
	useLocale: useLocale,
	Languages: Languages,
};

export default Locale;
