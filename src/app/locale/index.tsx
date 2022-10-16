import React, {useContext, useState} from 'react';
import {I18n} from 'i18n-js';
import * as Localization from 'expo-localization';
import Routes from './Routes';
import AddCard from './AddCard';
import Cards from './Cards';
import LoyaltyCard from './LoyaltyCard';
import Header from './Header';
import merge from 'deepmerge';
import Scan from './Scan';
import Settings from './Settings';

const Languages = {
	"en-US": "English",
	"ru-RU": "Русский",
};

export type LocaleProviderProps = {
	locale: string;
	children?: React.ReactNode,
};

const translations = merge.all([Routes, Cards, AddCard, LoyaltyCard, Header, Scan, Settings]);
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
