import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCQOgkA23VX7zJyEWW8w55YTPPSjuQsE7U",
  authDomain: "mamatomyamembeded.firebaseapp.com",
  databaseURL:
    "https://mamatomyamembeded-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mamatomyamembeded",
  storageBucket: "mamatomyamembeded.firebasestorage.app",
  messagingSenderId: "394377159816",
  appId: "1:394377159816:web:94672218c0c5480f472b3d",
  measurementId: "G-1HCYK84DCV",
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
