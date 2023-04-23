import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyB_aS5aJpUwOzmaaexySNNMvTE8bFJk4mk",
  authDomain: "pj-gamedice.firebaseapp.com",
  projectId: "pj-gamedice",
  storageBucket: "pj-gamedice.appspot.com",
  messagingSenderId: "310121941546",
  appId: "1:310121941546:web:62f68c3c4c5260d5bb9153",
  measurementId: "G-3GH41DF6YW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
