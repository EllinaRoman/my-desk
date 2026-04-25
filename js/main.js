import './modules/firebase-init.js';
import './modules/storage.js';
import './modules/ui-helpers.js';
import './modules/addBook.js';
import './modules/auth.js';
import './modules/modals.js';
import './modules/navigation.js';
import './modules/theme.js';
import './modules/filtres.js';
import './modules/status-glider.js';
import './modules/tags-trops.js';
import './modules/randomBook.js';
import './modules/editBook.js';

import { renderBooks } from './modules/library.js';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('../sw.js')
            .then(reg => {})
            .catch(err => console.error('Ошибка SW:', err));
    });
}

renderBooks();


