// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "f-math-80591.firebaseapp.com",
  projectId: "f-math-80591",
  storageBucket: "f-math-80591.appspot.com",
  messagingSenderId: "741371895800",
  appId: "1:741371895800:web:529f6dbe913a9ecaff400d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// cài đặt đăng nhập với google
const auth = getAuth();
const storage = getStorage();

export {database, auth, storage}