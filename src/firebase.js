// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmoHx-m8vBBv0xzRxEF8W9mRSyNlfYFqE",
  authDomain: "flinnite-5e082.firebaseapp.com",
  projectId: "flinnite-5e082",
  storageBucket: "flinnite-5e082.appspot.com",
  messagingSenderId: "528741377517",
  appId: "1:528741377517:web:eb7c5d3ef56c9b207bf3e4",
  measurementId: "G-WRJVH5JHHX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);