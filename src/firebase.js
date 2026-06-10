import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyADfg-w1Ct7XoKGmDpviHDLVTT-KPykCd8",
  authDomain: "yatr-ai.firebaseapp.com",
  projectId: "yatr-ai",
  storageBucket: "yatr-ai.firebasestorage.app",
  messagingSenderId: "685088945771",
  appId: "1:685088945771:web:a94a57f3a371574023632e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);