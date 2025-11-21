import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translations
import indexEn from "../../public/locales/en/index.json";
import authEn from "../../public/locales/en/auth.json";
import dashboardEn from "../../public/locales/en/dashboard.json";

const resources = {
	en: {
		index: indexEn,
		auth: authEn,
		dashboard: dashboardEn,
	},
};

i18n.use(initReactI18next).init({
	resources,
	lng: "en",
	fallbackLng: "en",
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
