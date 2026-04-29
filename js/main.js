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
import './modules/tags.js';
import './modules/randomBook.js';
import './modules/editBook.js';
import './modules/scrollTop.js';

import { renderBooks } from './modules/library.js';
import { subscribeToAuthChanges } from './modules/storage.js';
import { auth, onAuthStateChanged } from './modules/firebase-init.js';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(() => { })
            .catch(err => console.error('Ошибка SW:', err));
    });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Авторизован как:", user.email);
    } else {
        console.log("Пользователь не залогинен");
    }
});

subscribeToAuthChanges(async () => {
    await renderBooks();
    document.getElementById('app-loader').style.display = 'none';
});

