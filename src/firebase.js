
import * as firebase from "firebase/app";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMRVabvxt_83oDYq3s9dg6z4WvY6pJqXk",
  authDomain: "vue-poll-970c5.firebaseapp.com",
  databaseURL: "https://vue-poll-970c5-default-rtdb.firebaseio.com/",
  projectId: "vue-poll-970c5",
  storageBucket: "vue-poll-970c5.appspot.com",
  messagingSenderId: "411819235217",
  appId: "1:411819235217:web:24ebc2be19c60a9a87ac30"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

export default (app);
