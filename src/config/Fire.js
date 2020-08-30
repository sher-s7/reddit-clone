import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';

var firebaseConfig = {
    apiKey: "AIzaSyALa8GeH2a5h2BOZsz8j9-te3ZWC0bl0eg",
    authDomain: "reddit-clone-a7ea1.firebaseapp.com",
    databaseURL: "https://reddit-clone-a7ea1.firebaseio.com",
    projectId: "reddit-clone-a7ea1",
    storageBucket: "reddit-clone-a7ea1.appspot.com",
    messagingSenderId: "223825051168",
    appId: "1:223825051168:web:75afdf0fd5320c0001c645",
    measurementId: "G-4B8BKQJZ5S"
  };
  const fire = firebase.initializeApp(firebaseConfig);

  export default fire;