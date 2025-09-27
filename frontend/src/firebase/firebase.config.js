import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, setLogLevel } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxi7nLBLomWPIMNsD1_bnGh7UuDbRQbWw",
  authDomain: "book-store-mern-app-f2625.firebaseapp.com",
  projectId: "book-store-mern-app-f2625",
  storageBucket: "book-store-mern-app-f2625.appspot.com",
  messagingSenderId: "1010540065764",
  appId: "1:1010540065764:web:17a53c84e4a9e2b23b0df1"
};

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

// Enable Firestore debug logs (optional, helps troubleshoot)
setLogLevel('debug');
