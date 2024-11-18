// Import the necessary functions from Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // Import the getAuth function for authentication

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

// Initialize Firebase Authentication
export const auth = getAuth(firebaseApp); // Use getAuth to get the auth instance

export default firebaseApp;
