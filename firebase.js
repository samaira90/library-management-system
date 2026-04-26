import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBX97a4hxz5SsyNsuinUzFGRUF4DNsUcXo",
  const firebaseConfig = {
  apiKey: "AIzaSyBX97a4hxz5SsyNsuinUzFGRUF4DNsUcXo",
  authDomain: "library-management-syste-37317.firebaseapp.com",
  projectId: "library-management-syste-37317",
  storageBucket: "library-management-syste-37317.firebasestorage.app",
  messagingSenderId: "238467856232",
  appId: "1:238467856232:web:4c640359d891a0bd8988dd"
};
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);