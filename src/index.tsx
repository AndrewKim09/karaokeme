import React from 'react';
import ReactDOM from 'react-dom/client'; 
import App from './App';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "karaokeme-bcfef.firebaseapp.com",
    projectId: "karaokeme-bcfef",
    storageBucket: "karaokeme-bcfef.firebasestorage.app",
    messagingSenderId: "279858686548",
    appId: "1:279858686548:web:5b6eaf685deee3da221bc1",
    measurementId: "G-8Z40DLP0DB"
  };
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

root.render(
  <App />
);
