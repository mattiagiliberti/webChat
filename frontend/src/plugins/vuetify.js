import { createVuetify } from 'vuetify';
import 'vuetify/styles'; // Importa gli stili base di Vuetify
import { aliases, mdi } from 'vuetify/iconsets/mdi'; // Usa icone Material Design

export default createVuetify({
  theme: {
    defaultTheme: 'light', // Puoi cambiarlo in 'dark' o un tema personalizzato
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
});
