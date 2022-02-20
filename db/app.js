// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA8vE5HTFSXKeOepQABsPdymumUfTRNegM",
    authDomain: "calhacks2022-website.firebaseapp.com",
    projectId: "calhacks2022-website",
    storageBucket: "calhacks2022-website.appspot.com",
    messagingSenderId: "684230793158",
    appId: "1:684230793158:web:78433b233b80cd8c0dc4c7",
    measurementId: "G-W762QTR6TR"
};

let app;

if (getApps().length === 0) {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

export default app;