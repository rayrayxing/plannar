// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLGTnLcimAFXOj9jjBAGsU9-xSMUr7DQY",
  authDomain: "openhands-793d7.firebaseapp.com",
  projectId: "openhands-793d7",
  storageBucket: "openhands-793d7.firebasestorage.app",
  messagingSenderId: "536726681341",
  appId: "1:536726681341:web:2ee2fc0dbd4df4d9513094",
  measurementId: "G-NGNBBGL7V5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Export Firebase services
export { app, analytics, auth, db };
