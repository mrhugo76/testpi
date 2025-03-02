// Firebase 配置（替换为你的 Firebase 项目配置）
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment, serverTimestamp, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

        const firebaseConfig = {
            apiKey: "AIzaSyDeVfwTVQJAmJirX4J1Rmw4yyUOvx1rcCY",
            authDomain: "petro-7417e.firebaseapp.com",
            projectId: "petro-7417e",
            storageBucket: "petro-7417e.appspot.com",
            messagingSenderId: "710734339424",
            appId: "1:710734339424:web:9149ad35d8a7a957e1d205",
            measurementId: "G-29P6068RQ3"
        };
// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, doc, setDoc, getDoc, updateDoc, increment, serverTimestamp, collection, query, where, getDocs, createUserWithEmailAndPassword, signInWithEmailAndPassword };
