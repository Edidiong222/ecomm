// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyBRkF2f9Eataiqi4r49oxdPIXhXVnLMLwM",
  authDomain: "commealevu.firebaseapp.com",
  projectId: "commealevu",
  storageBucket: "commealevu.firebasestorage.app",
  messagingSenderId: "430131991547",
  appId: "1:430131991547:web:1e4d2133c3d1c77877f15e",
  measurementId: "G-MNTV7YGPHP"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);
export default app;
export const db = getFirestore(app);
export const storage = getStorage(app);


