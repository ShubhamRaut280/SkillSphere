import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCfG57NefXQrS4r71TsXNdjAvCGJyHQuMU",
  authDomain: "react-lssem.firebaseapp.com",
  projectId: "react-lssem",
  storageBucket: "react-lssem.appspot.com",
  messagingSenderId: "245314939115",
  appId: "1:245314939115:web:a3cdeab9343d07151936ae"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export { auth, db };
