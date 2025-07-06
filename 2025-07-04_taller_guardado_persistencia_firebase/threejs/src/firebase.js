import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDE9VJ65f3x6BDX7OoInbSDpvRVb4Zgu3c",
  authDomain: "computacionvisual-taller49.firebaseapp.com",
  databaseURL: "https://computacionvisual-taller49-default-rtdb.firebaseio.com",
  projectId: "computacionvisual-taller49",
  storageBucket: "computacionvisual-taller49.firebasestorage.app",
  messagingSenderId: "261686577954",
  appId: "1:261686577954:web:1f0ab81948616e723a737b"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);