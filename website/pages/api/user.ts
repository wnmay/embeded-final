// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import firebase from "../../lib/firebase"
import {
  getFirestore,
  doc,
  collection,
  setDoc,
  getDoc,
  deleteDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";

const db = getFirestore(firebase);
const toilets = collection(db, 'toilets');

getDocs(toilets).then((snapshot) => {
  console.log(snapshot.docs)
})

