import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database";
//리얼타임 데이터 베이스가지고 오기

const firebaseConfig = {
  apiKey: "AIzaSyCoHc_0jwyGIXSdzFV73aZ_zXc06TeJYpM",
  authDomain: "image-community-9d16c.firebaseapp.com",
  projectId: "image-community-9d16c",
  storageBucket: "image-community-9d16c.appspot.com",
  messagingSenderId: "1071305956614",
  appId: "1:1071305956614:web:4d4a0c99139f21809fd287",
  measurementId: "G-Y3K6XDQLGH",
};

firebase.initializeApp(firebaseConfig);

const apiKey = firebaseConfig.apiKey;
const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();
const realtime = firebase.database();

export { auth, apiKey, firestore, storage, realtime };
