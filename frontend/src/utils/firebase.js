// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth , GoogleAuthProvider} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "loginvirtualcourses-b4151.firebaseapp.com",
  projectId: "loginvirtualcourses-b4151",
  storageBucket: "loginvirtualcourses-b4151.firebasestorage.app",
  messagingSenderId: "556052769979",
  appId: "1:556052769979:web:0da679c8b3c934861f4d9e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" }) // yeh add karo


export {auth , provider}