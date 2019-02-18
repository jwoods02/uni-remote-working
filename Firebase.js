import * as firebase from "firebase";
import firestore from "firebase/firestore";

const settings = { timestampsInSnapshots: true };

const config = {
  apiKey: "AIzaSyB3eOEQaPomF624RwDBl3bmO97guiN-TRs",
  authDomain: "remoteruralworking.firebaseapp.com",
  databaseURL: "https://remoteruralworking.firebaseio.com",
  projectId: "remoteruralworking",
  storageBucket: "remoteruralworking.appspot.com",
  messagingSenderId: "397948314964"
};
firebase.initializeApp(config);

firebase.firestore().settings(settings);

export default firebase;
