// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvCv5R9xpwiSz77TJga3xEXAkw9BqotXw",
  authDomain: "funny-math-37552.firebaseapp.com",
  databaseURL: "https://funny-math-37552-default-rtdb.firebaseio.com",
  projectId: "funny-math-37552",
  storageBucket: "funny-math-37552.appspot.com",
  messagingSenderId: "370202238756",
  appId: "1:370202238756:web:175b2455a2404956825db1",
  measurementId: "G-V721SDCM9N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const analytics = getAnalytics(app)

// cài đặt đăng nhập với google
const auth = getAuth();
const storage = getStorage();

export {database, auth, storage, analytics}