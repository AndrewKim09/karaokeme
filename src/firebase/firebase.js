const firebaseConfig = {
  apiKey: "AIzaSyD6vU8RNC8U2MuFdj6nlu9lVkp-01MTEIE",
  authDomain: "karaokeme-bcfef.firebaseapp.com",
  projectId: "karaokeme-bcfef",
  storageBucket: "karaokeme-bcfef.firebasestorage.app",
  messagingSenderId: "279858686548",
  appId: "1:279858686548:web:5b6eaf685deee3da221bc1",
  measurementId: "G-8Z40DLP0DB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);