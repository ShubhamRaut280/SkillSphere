// Import the necessary functions from Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"; // Import auth functions from 'firebase/auth'
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfG57NefXQrS4r71TsXNdjAvCGJyHQuMU",
  authDomain: "react-lssem.firebaseapp.com",
  projectId: "react-lssem",
  storageBucket: "react-lssem.firebasestorage.app",
  messagingSenderId: "245314939115",
  appId: "1:245314939115:web:a3cdeab9343d07151936ae"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// Export the auth and db instances for use in other parts of the app
export { auth, db, createUserWithEmailAndPassword }; // Exporting the auth functions
export default firebaseApp;
