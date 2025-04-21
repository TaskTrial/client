// firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
//import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyCHaCv76jPr5SFEm_IUxxvhlnabimX8pa4",
  authDomain: "client-830ef.firebaseapp.com",
  projectId: "client-830ef",
  storageBucket: "client-830ef.firebasestorage.app",
  messagingSenderId: "427225327183",
  appId: "1:427225327183:web:464911eab9fa53c117ec3a",
  measurementId: "G-XKH5FTJGFW",
};

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
