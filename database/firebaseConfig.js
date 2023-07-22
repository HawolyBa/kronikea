import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { GoogleAuthProvider } from "firebase/auth";


const prodConfig = {
  apiKey: "AIzaSyBI9ITjYUCZ6YedemNiY9EXmKMLEx6yCys",
  authDomain: "story-center.firebaseapp.com",
  databaseURL: "https://story-center.firebaseio.com",
  projectId: "story-center",
  storageBucket: "story-center.appspot.com",
  messagingSenderId: "1095246518275",
  appId: "1:1095246518275:web:de42acc0aab573506e5636"
};

const devConfig = {
  apiKey: `${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
  authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}`,
  databaseURL: `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}`,
  projectId: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`,
  storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}`,
  messagingSenderId: `${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}`,
  appId: `${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}`,
};

const config = process.env.NODE_ENV === "production" ? prodConfig : devConfig;

const app = initializeApp(config);
const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)
const provider = new GoogleAuthProvider();

export { db, auth, storage, provider, app };
export default config;