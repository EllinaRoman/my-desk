import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { 
    initializeFirestore, 
    persistentLocalCache, 
    persistentMultipleTabManager 
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBF3VnLe7KiiNjcHyiB1xPBMEgjIiIpYFE",
  authDomain: "my-shelf-16ae6.firebaseapp.com",
  projectId: "my-shelf-16ae6",
  storageBucket: "my-shelf-16ae6.firebasestorage.app",
  messagingSenderId: "732693139093",
  appId: "1:732693139093:web:4834ce8b4c1e2494e2159c"
};

const app = initializeApp(firebaseConfig);

const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider };