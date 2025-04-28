import { createVuetify } from 'vuetify';
import 'vuetify/styles'; // Importa gli stili base di Vuetify
import { aliases, mdi } from 'vuetify/iconsets/mdi'; // Usa icone Material Design
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import  it from 'vuetify/lib/locale/it.mjs'; 

export default createVuetify({
  theme: {
    defaultTheme: 'dark', // Puoi cambiarlo in 'dark' o un tema personalizzato
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  locale: {
    date: {
      locale: {
        it: 'it-IT',
      },
    },
    locale: 'it',
    fallback: 'it',
    messages:{ it, it}
  },
});
