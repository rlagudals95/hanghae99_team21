import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC9rCMVUMT2SwB9TaE0Ww8ehtvD25oJ1J8",
  authDomain: "sparta-react-15fb3.firebaseapp.com",
  projectId: "sparta-react-15fb3",
  storageBucket: "sparta-react-15fb3.appspot.com",
  messagingSenderId: "971471391477",
  appId: "1:971471391477:web:29b4fc8ec136393b6d53bc",
  measurementId: "G-LEE70HB3B6",
};

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

export { firestore };
