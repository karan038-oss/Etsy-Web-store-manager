// Firebase SDK v12+

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-storage.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRRov3euSrMZQSeJkFJIZjBcu7quo6wQM",
  authDomain: "etsy---web-store-manager-2f352.firebaseapp.com",
  databaseURL: "https://etsy---web-store-manager-2f352-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "etsy---web-store-manager-2f352",
  storageBucket: "etsy---web-store-manager-2f352.firebasestorage.app",
  messagingSenderId: "500175926393",
  appId: "1:500175926393:web:93f027f8e291ecb9ee10a8",
  measurementId: "G-RX1TJD03BT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const realtimeDB = getDatabase(app);

// Export Services
export {
  app,
  db,
  auth,
  storage,
  realtimeDB
};