import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HOME_EN from '../locales/en/home.json';
import HOME_VI from '../locales/vi/home.json';
import STUDY_EN from '../locales/en/study.json';
import STUDY_VI from '../locales/vi/study.json';

const resources = {
  en: {
    home: HOME_EN,
    study: STUDY_EN

  },
  vi: {
    home: HOME_VI,
    study: STUDY_VI
  }
};

const defaultNS = 'home';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    debug: true,
    resources,
    lng: "en",
    fallbackLng: "en",
    ns: ['home','study'],
    defaultNS,
    interpolation: {
      escapeValue: false
    }
  });