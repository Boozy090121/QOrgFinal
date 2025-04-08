// Firebase configuration for PCI Quality Organization Dashboard
// This is a placeholder file that will be updated with actual Firebase configuration

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase configuration object - Updated with user-provided values
const firebaseConfig = {
  apiKey: "AIzaSyBZaXCFzSHoXAgiLgFs6lQa5C3PCLVVccY",
  authDomain: "qorg-6cf85.firebaseapp.com",
  projectId: "qorg-6cf85",
  storageBucket: "qorg-6cf85.appspot.com",
  messagingSenderId: "50981153700",
  appId: "1:50981153700:web:cfd087706950b22c4f6f31",
  measurementId: "G-N5YSEHRT6B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics if supported
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log("Firebase Analytics initialized.");
    }
  });
}

export { analytics };
export default app;
