import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Uses Next/React env variables prefixed with NEXT_PUBLIC so they are available in the browser.
const firebaseConfig = {
  apiKey: "AIzaSyBzq9HBEY51SlymXcgNkw5TfchgaWh9fjw",
  authDomain: "shravan-a3695.firebaseapp.com",
  projectId: "shravan-a3695",
  storageBucket: "shravan-a3695.firebasestorage.app",
  messagingSenderId: "159383556999",
  appId: "1:159383556999:web:bd37e22fe3521587e67922"
};

// Initialize app only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
