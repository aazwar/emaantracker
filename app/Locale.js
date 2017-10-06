import I18n from 'i18n-js';

I18n.translations = {
  en: require('./Locale-en').default,
  id: require('./Locale-id').default,
  ar: require('./Locale-ar').default,
  ur: require('./Locale-ur').default,
};
I18n.defaultLocale = 'en';
I18n.isRTL = () => I18n.locale.match(/ar|ur/);
