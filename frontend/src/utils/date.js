export function formatDate(date) {

    if (typeof date === 'string') {
        date = new Date(date);
    }    

    if (!(date instanceof Date) || isNaN(date)) {
        return 'Data non valida';
    }

    const now = new Date();
    const diff = now - date; // Differenza in millisecondi
    const oneDay = 24 * 60 * 60 * 1000; // Millisecondi in un giorno

    const optionsDate = { day: '2-digit', month: 'short' };
    const formattedDate = date.toLocaleDateString('it-IT', optionsDate).replace('.', '');

    if (diff > oneDay) {
        return formattedDate; // Mostra solo "16 giu" se sono passate più di 24 ore
    }

    const optionsTime = { hour: '2-digit', minute: '2-digit' };
    const formattedTime = date.toLocaleTimeString('it-IT', optionsTime);
        
    return `${formattedTime} - ${formattedDate}`;
}



