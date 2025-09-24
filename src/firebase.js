//import firebase from 'firebase/app';
import { getFirestore } from 'firebase/firestore'
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

//ultima version
const firebaseConfig = {
  apiKey: "AIzaSyCVVL2C5Tuz5HQSjptupQxc5yIjdtEA7XA",
  authDomain: "lab-seeds.firebaseapp.com",
  projectId: "lab-seeds",
  storageBucket: "lab-seeds.appspot.com",
  messagingSenderId: "188796667433",
  appId: "1:188796667433:web:6316404073c65b8a2a3e38",
  measurementId: "G-5ENP04680T"
};

const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore();
export const auth = getAuth(firebaseApp)

setPersistence(auth, browserLocalPersistence)