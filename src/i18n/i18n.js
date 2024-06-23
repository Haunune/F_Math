import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HOME_EN from '../locales/en/home.json';
import HOME_VI from '../locales/vi/home.json';
import STUDY_EN from '../locales/en/study.json';
import STUDY_VI from '../locales/vi/study.json';
import INFO_EN from '../locales/en/information.json';
import INFO_VI from '../locales/vi/information.json';
import LOGIN_EN from '../locales/en/login.json';
import LOGIN_VI from '../locales/vi/login.json';


const resources = {
  en: {
    home: HOME_EN,
    study: STUDY_EN,
    info: INFO_EN,
    login: LOGIN_EN
  },
  vi: {
    home: HOME_VI,
    study: STUDY_VI,
    info: INFO_VI,
    login: LOGIN_VI
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
    ns: ['home','study','info', 'login'],
    defaultNS,
    interpolation: {
      escapeValue: false
    }
  });