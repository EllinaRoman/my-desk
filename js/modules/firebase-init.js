import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { 
    initializeFirestore, 
    persistentLocalCache, 
    persistentMultipleTabManager 
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBSwV3C2fMps1AxGWYXckDBDONUJvjRyb0",
  authDomain: "my-desk-ee5fc.firebaseapp.com",
  projectId: "my-desk-ee5fc",
  storageBucket: "my-desk-ee5fc.firebasestorage.app",
  messagingSenderId: "362766784576",
  appId: "1:362766784576:web:f2d0244c306c601402e7a5"
};

const app = initializeApp(firebaseConfig);

const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider, onAuthStateChanged };