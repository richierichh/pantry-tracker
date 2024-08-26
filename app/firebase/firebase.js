// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import {getFirestore} from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDF_yiV-0olTEWZUf9NIK8KDkVJYDwT_g",
  authDomain: "proj-f5d0d.firebaseapp.com",
  projectId: "proj-f5d0d",
  storageBucket: "proj-f5d0d.appspot.com",
  messagingSenderId: "697672060907",
  appId: "1:697672060907:web:7c7af6eea6ee2bb21993ae",
  measurementId: "G-T47Y8YNYNN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
//const analytics = getAnalytics(app);
const db = getFirestore(app);

export {app, auth,db}