import {
    doc,
    setDoc,
    getDocs,
    collection,
    deleteDoc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { db, auth, onAuthStateChanged } from './firebase-init.js';

export let currentUser = null;

const FIREBASE_USERS_COLLECTION = 'users';
const FIREBASE_BOOKS_SUBCOLLECTION = 'books';
const INDEXED_DB_NAME = 'my-shelf-local-db';
const INDEXED_DB_VERSION = 1;
const INDEXED_DB_STORE = 'books';

let resolveAuthReady;
const authReady = new Promise((resolve) => {
    resolveAuthReady = resolve;
});

let cachedBooks = null;

const authSubscribers = new Set();

const openIndexedDB = () => new Promise((resolve, reject) => {
    const request = indexedDB.open(INDEXED_DB_NAME, INDEXED_DB_VERSION);

    request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(INDEXED_DB_STORE)) {
            database.createObjectStore(INDEXED_DB_STORE, { keyPath: 'id' });
        }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
});

const runIDBRequest = (request) => new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
});

const getLocalBooks = async () => {
    const database = await openIndexedDB();
    const transaction = database.transaction(INDEXED_DB_STORE, 'readonly');
    const store = transaction.objectStore(INDEXED_DB_STORE);
    const result = await runIDBRequest(store.getAll());
    database.close();

    return result.sort((a, b) => Number(b.id) - Number(a.id));
};

const saveLocalBook = async (book) => {
    const database = await openIndexedDB();
    const transaction = database.transaction(INDEXED_DB_STORE, 'readwrite');
    const store = transaction.objectStore(INDEXED_DB_STORE);

    await runIDBRequest(store.put(book));
    await new Promise((resolve, reject) => {
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);
    });

    database.close();
    return book;
};

const deleteLocalBook = async (id) => {
    const database = await openIndexedDB();
    const transaction = database.transaction(INDEXED_DB_STORE, 'readwrite');
    const store = transaction.objectStore(INDEXED_DB_STORE);

    await runIDBRequest(store.delete(id));
    await new Promise((resolve, reject) => {
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);
    });

    database.close();
};

const getUserBooksCollectionRef = (uid) => collection(db, FIREBASE_USERS_COLLECTION, uid, FIREBASE_BOOKS_SUBCOLLECTION);

const saveRemoteBook = async (user, book) => {
    await setDoc(doc(db, FIREBASE_USERS_COLLECTION, user.uid, FIREBASE_BOOKS_SUBCOLLECTION, String(book.id)), book);
    return book;
};

const getRemoteBooks = async (user) => {
    const q = query(getUserBooksCollectionRef(user.uid), orderBy('id', 'desc'));
    const querySnapshot = await getDocs(q);

    const books = [];
    querySnapshot.forEach((docSnapshot) => {
        books.push(docSnapshot.data());
    });
    return books;
};


const deleteRemoteBook = async (user, id) => {
    await deleteDoc(doc(db, FIREBASE_USERS_COLLECTION, user.uid, FIREBASE_BOOKS_SUBCOLLECTION, String(id)));
};

const syncLocalBooksToUser = async (user) => {
    const [localBooks, remoteBooks] = await Promise.all([
        getLocalBooks(),
        getRemoteBooks(user)
    ]);

    const remoteIds = new Set(remoteBooks.map((book) => String(book.id)));

    const uploadPromises = localBooks
        .filter((book) => !remoteIds.has(String(book.id)))
        .map((book) => saveRemoteBook(user, book));

    await Promise.all(uploadPromises);
};

onAuthStateChanged(auth, async (user) => {
    cachedBooks = null;
    currentUser = user;

    if (user) {
        try {
            await syncLocalBooksToUser(user);
        } catch (error) {
            console.error('Ошибка синхронизации локальных книг с Firebase:', error);
        }
    }

    resolveAuthReady?.();
    resolveAuthReady = null;

    authSubscribers.forEach((callback) => callback(user));
});

const waitAuthReady = async () => {
    await authReady;
};

export const subscribeToAuthChanges = (callback) => {
    authSubscribers.add(callback);
    return () => authSubscribers.delete(callback);
};

export const saveToDB = async (book) => {
    cachedBooks = null;
    await waitAuthReady();

    if (currentUser) {
        return saveRemoteBook(currentUser, book);
    }

    return saveLocalBook(book);
};

export const getAllBooks = async () => {
    await waitAuthReady();

    if (cachedBooks) return cachedBooks;

    if (currentUser) {
        cachedBooks = await getRemoteBooks(currentUser);
    } else {
        cachedBooks = await getLocalBooks();
    }

    return cachedBooks;
};


export const deleteBook = async (id) => {
    cachedBooks = null;
    await waitAuthReady();
    await deleteLocalBook(id);

    if (currentUser) {
        await deleteRemoteBook(currentUser, id);
    }
};

export const updateFullBook = async (updatedBook) => {
    cachedBooks = null;
    return saveToDB(updatedBook);
};

const statusTextMap = {
    want: 'Хочу',
    future: 'Потом',
    'not-reading': 'Брошено',
    reading: 'Читаю',
    completed: 'Прочитано'
};

export const updateBookStatus = async (id, newStatus) => {
    const allBooks = await getAllBooks();
    const book = allBooks.find((b) => b.id === id || String(b.id) === String(id));

    if (!book) return null;

    book.status = newStatus;

    book.statusText = statusTextMap[newStatus] || newStatus;

    return saveToDB(book);
};