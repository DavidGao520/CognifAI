import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDvmm57a_Ev6OehaXs5K3n71dypKy3UTic",
  authDomain: "cognifai-8871a.firebaseapp.com",
  projectId: "cognifai-8871a",
  storageBucket: "cognifai-8871a.firebasestorage.app",
  messagingSenderId: "650526846832",
  appId: "1:650526846832:web:b7863b89fdfdc58e77a9b5",
  measurementId: "G-EKD5WM5PHX",
  databaseURL: "https://cognifai-8871a-default-rtdb.firebaseio.com",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);
export default app;
