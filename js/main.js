import './modules/firebase-init.js';
import './modules/storage.js';
import './modules/addBook.js';
import './modules/modals.js';
import './modules/navigation.js';
import './modules/theme.js';
import './modules/ui-helpers.js';
import './modules/filtres.js';
import './modules/status-glider.js';
import './modules/tags-trops.js';
import './modules/randomBook.js';
import './modules/editBook.js';
import './modules/library.js';

import { renderBooks } from './modules/library.js';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('../sw.js')
            .then(reg => console.log('SW зарегистрирован!', reg))
            .catch(err => console.log('Ошибка SW:', err));
    });
}

renderBooks();