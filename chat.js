import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, onChildRemoved, remove, update, onValue, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// 1. FIREBASE CONFIG
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

// 2. USER DATA
const username = localStorage.getItem("username");
const gender = localStorage.getItem("gender");
if (!username) window.location.href = "index.html";

document.getElementById("displayUser").innerText = username;
let currentRoom = "general";
let activeListeners = [];
let typingTimeout;

// 3. SEND MESSAGE (Attached to window so HTML can see it)
window.sendMessage = async function() {
    const input = document.getElementById("msg");
    const text = input.value.trim();
    
    if (!text) return;

    try {
        await push(ref(db, "rooms/" + currentRoom), {
            user: username,
            text: text,
            timestamp: Date.now()
        });
        input.value = "";
        // Reset typing status
        set(ref(db, `typing/${currentRoom}/${username}`), null);
    } catch (e) {
        console.error("Error sending:", e);
        alert("Failed to send! Check your internet or Firebase Rules.");
    }
};

// 4. ROOM LOGIC
window.openRoom = function(room) {
    currentRoom = room;
    document.getElementById("messages").innerHTML = "";
    document.getElementById("roomTitle").innerText = "# " + room;

    // Remove old listeners
    activeListeners.forEach(off => off());
    activeListeners = [];

    // Listen for Messages
    const roomRef = ref(db, "rooms/" + room);
    activeListeners.push(onChildAdded(roomRef, (snap) => renderMessage(snap.key, snap.val())));
    activeListeners.push(onChildRemoved(roomRef, (snap) => document.getElementById(snap.key)?.remove()));

    // Listen for Typing
    const typingRef = ref(db, `typing/${room}`);
    onValue(typingRef, (snapshot) => {
        const typers = snapshot.val() || {};
        const otherTypers = Object.keys(typers).filter(u => u !== username);
        document.getElementById("typingIndicator").innerText = 
            otherTypers.length > 0 ? `${otherTypers[0]} is typing...` : "";
    });
};

// 5. RENDER & UI
function renderMessage(id, data) {
    const isMe = data.user === username;
    const time = new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const div = document.createElement("div");
    div.className = "message-wrapper";
    div.id = id;
    div.innerHTML = `
        <div class="message-content">
            <div class="msg-meta">
                <span class="msg-user ${isMe ? 'me' : ''}">${data.user}</span>
                <span class="msg-time">${time}</span>
            </div>
            <div class="msg-body">
                ${data.image ? `<img src="${data.image}" class="chat-img">` : `<span class="msg-text">${data.text}</span>`}
                <div class="msg-actions">
                    <button onclick="addEmoji('${id}', '🔥')">🔥</button>
                    ${isMe ? `<button onclick="deleteMsg('${id}')">Delete</button>` : ''}
                </div>
            </div>
        </div>
    `;
    const container = document.getElementById("messages");
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

// 6. TYPING INDICATOR TRIGGER
document.getElementById("msg").addEventListener("input", () => {
    set(ref(db, `typing/${currentRoom}/${username}`), true);
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        set(ref(db, `typing/${currentRoom}/${username}`), null);
    }, 2000);
});

// 7. OTHER UTILITIES
window.deleteMsg = (id) => {
    if(confirm("Delete message?")) remove(ref(db, `rooms/${currentRoom}/${id}`));
};

window.logout = () => {
    localStorage.clear();
    window.location.href = "index.html";
};

// Enter key support
document.getElementById("msg").addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

// Initialize Room
openRoom("general");