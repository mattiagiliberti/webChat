import { createVuetify } from 'vuetify';
import 'vuetify/styles'; // Importa gli stili base di Vuetify
import { aliases, mdi } from 'vuetify/iconsets/mdi'; // Usa icone Material Design
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

export default createVuetify({
  theme: {
    defaultTheme: 'dark', // Puoi cambiarlo in 'dark' o un tema personalizzato
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
});
