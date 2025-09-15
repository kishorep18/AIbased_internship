
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  "projectId": "studio-2914549997-68bc8",
  "appId": "1:447929177538:web:86b2423567cf61721b725b",
  "storageBucket": "studio-2914549997-68bc8.firebasestorage.app",
  "apiKey": "AIzaSyDJpsE02a2BUXdn5S68yYuTXH-Jbnxj5yc",
  "authDomain": "studio-2914549997-68bc8.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "447929177538"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
