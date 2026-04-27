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

onAuthStateChanged(auth, (user) => {
    currentUser = user;
})

const STORE_NAME = 'books';


export const saveToDB = async (book) => {
    await setDoc(doc(db, STORE_NAME, String(book.id)), book);
    return book;
};

export const getAllBooks = async () => {
    const q = query(collection(db, STORE_NAME), orderBy("id", "desc"));
    const querySnapshot = await getDocs(q);
    
    const books = [];
    querySnapshot.forEach((doc) => {
        books.push(doc.data());
    });
    return books;
};

export const deleteBook = async (id) => {
    await deleteDoc(doc(db, STORE_NAME, String(id)));
};

export const updateFullBook = async (updatedBook) => {
    return await saveToDB(updatedBook);
};


export const updateBookStatus = async (id, newStatus) => {
    const allBooks = await getAllBooks();
    const book = allBooks.find(b => b.id === id || String(b.id) === String(id));
    
    if (book) {
        book.status = newStatus;

        const statusTextMap = {
            'want': 'Хочу',
            'future': 'Потом',
            'not-reading': 'Брошено',
            'reading': 'Читаю',
            'completed': 'Прочитано',
        };
        
        book.statusText = statusTextMap[newStatus] || newStatus;
        
        return await saveToDB(book);
    }
};