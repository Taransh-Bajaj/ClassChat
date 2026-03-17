import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
    getDatabase, ref, push, onChildAdded, onChildChanged, onChildRemoved, remove, update, onValue, set
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { 
    getStorage, ref as sRef, uploadBytes, getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyC-MzFHtQLrwh8Ds5u5YOe-wk-D9UPk94k",
    authDomain: "class-chat-d8a0c.firebaseapp.com",
    databaseURL: "https://class-chat-d8a0c-default-rtdb.firebaseio.com",
    projectId: "class-chat-d8a0c",
    storageBucket: "class-chat-d8a0c.firebasestorage.app",
    messagingSenderId: "699485801199",
    appId: "1:699485801199:web:66ca3c98f29d6f0d2f291a"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

// EXPOSE TO WINDOW (The "Fixed" Way)
window.fb = { 
    db, ref, push, onChildAdded, onChildChanged, onChildRemoved, 
    remove, update, onValue, set, storage, sRef, uploadBytes, getDownloadURL 
};

console.log("Firebase Initialized ✅");