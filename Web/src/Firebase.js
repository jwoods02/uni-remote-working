import * as firebase from "firebase";
import firestore from "firebase/firestore";

// const settings = { timestampsInSnapshots: true };

const config = {
  apiKey: "",
  authDomain: "remoteruralworking.firebaseapp.com",
  databaseURL: "https://remoteruralworking.firebaseio.com",
  projectId: "remoteruralworking",
  storageBucket: "remoteruralworking.appspot.com",
  messagingSenderId: ""
};
firebase.initializeApp(config);

// firebase.firestore().settings(settings);

export default firebase;
