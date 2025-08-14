// src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBetrPHvyoC_A4-zpiARficKkD65yIeTTg",
  authDomain: "jobapplicationsystem-c2ec0.firebaseapp.com",
  projectId: "jobapplicationsystem-c2ec0",
  storageBucket: "jobapplicationsystem-c2ec0.appspot.com",
  messagingSenderId: "1073596076185",
  appId: "1:1073596076185:web:e96aa64a96e191aee4e808"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);

// Export everything
export { app, db, storage };
