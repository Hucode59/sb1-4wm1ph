import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCIAjqM39FZp3zC9sld67879NF9QmSWMHU",
  authDomain: "smartfinai.firebaseapp.com",
  projectId: "smartfinai",
  storageBucket: "smartfinai.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);