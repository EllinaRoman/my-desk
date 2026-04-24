const DB_NAME = 'LibraryDB';
const STORE_NAME = 'books';


const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};


export const saveToDB = async (book) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        store.put(book);
        transaction.oncomplete = () => {
            resolve(book);
        };
        transaction.onerror = () => reject(transaction.error);
    });
};

export const getAllBooks = async () => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const updateBookStatus = async (id, newStatus) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        const getRequest = store.get(id);

        const statusTextMap = {
            'want': 'Хочу',
            'future': 'Потом',
            'not-reading': 'Не буду',
            'reading': 'Читаю',
            'completed': 'Прочитано',
        };

        getRequest.onsuccess = () => {
            const book = getRequest.result;
            if (book) {
                book.status = newStatus;
                book.statusText = statusTextMap[newStatus] || newStatus;
                store.put(book);
            }
        };

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
};

export const deleteBook = async (id) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        const request = store.delete(id); // Вот она, команда удаления

        request.onsuccess = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
};


export const updateFullBook = async (updatedBook) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        store.put(updatedBook);

        transaction.oncomplete = () => resolve(updatedBook);
        transaction.onerror = () => reject(transaction.error);
    });
};