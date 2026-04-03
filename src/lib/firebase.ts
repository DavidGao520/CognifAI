import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDvmm57a_Ev6OehaXs5K3n71dypKy3UTic",
  authDomain: "cognifai-8871a.firebaseapp.com",
  projectId: "cognifai-8871a",
  storageBucket: "cognifai-8871a.firebasestorage.app",
  messagingSenderId: "650526846832",
  appId: "1:650526846832:web:b7863b89fdfdc58e77a9b5",
  measurementId: "G-EKD5WM5PHX",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
