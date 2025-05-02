import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { en } from './en'
import { fr } from './fr'
import { de } from './de'

const resources = {
    en: { translation: en },
    fr: { translation: fr },
    de: { translation: de }
}

i18n.use(initReactI18next).init({
    compatibilityJSON: 'v4',
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    }
})

export default i18n