import * as firebase from "firebase/app";
import "firebase/messaging";

var firebaseConfig = {
  apiKey: "AIzaSyD5cdBcOSRlKuKa9QjRBoFDA6p_5mLGlMM",
  authDomain: "artaka-mpos.firebaseapp.com",
  databaseURL: "https://artaka-mpos.firebaseio.com",
  projectId: "artaka-mpos",
  storageBucket: "artaka-mpos.appspot.com",
  messagingSenderId: "96038767508",
  appId: "1:96038767508:web:4a3a86fff8db49d6c1dd81",
  measurementId: "G-X8B0QL18EQ"
};

//Project Settings => Add Firebase to your web app
const initializedFirebaseApp = firebase.initializeApp(firebaseConfig);

const messaging = initializedFirebaseApp.messaging();
messaging.usePublicVapidKey(
	// Project Settings => Cloud Messaging => Web Push certificates
  "BAeFgh_np8NSdbBGVi8u_YmZGeMtKq6TawNm3gxn2TV4-gMVm2Cna_PDlq8sIT9oeiKO8lcsMGqI9NbeQCGVUFE"
);

export { messaging };
