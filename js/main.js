console.log('main start');

import './modules/form.js';
import './modules/modals.js';
import './modules/status-glider.js';
import './modules/tags-trops.js';
import './modules/theme.js';
import './modules/ui-helpers.js';
import './modules/randomBook.js';
import './modules/editBook.js';
import './modules/storage.js';
import './modules/library.js';

import { renderBooks } from './modules/library.js';

renderBooks();
