import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
   apiKey: "AIzaSyBGas7s_5s4P8VhdcVkNN9X0mMf7_YQDoI",
   authDomain: "blogs-project-116a2.firebaseapp.com",
   projectId: "blogs-project-116a2",
   storageBucket: "blogs-project-116a2.appspot.com",
   messagingSenderId: "547089633117",
   appId: "1:547089633117:web:1f8aab65afa7bb021462b4"
 };

 firebase.initializeApp(firebaseConfig)

 const projectAuth = firebase.auth()
 const projectFirestore = firebase.firestore() //set up connection
 const projectStorage = firebase.storage()
 const timestamp = firebase.firestore.FieldValue.serverTimestamp

 export { projectAuth, projectFirestore, projectStorage, timestamp }