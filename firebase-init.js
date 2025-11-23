// --- IMPORTANT ---
// Replace the config object below with your Firebase project's config.
// You can get this from Firebase Console -> Project Settings -> General -> Your apps -> Firebase SDK snippet
// Keep this file in the site root. Do NOT commit real credentials to public repos if you care about security.

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqJTjLS4Sf6YwTzh9S-qo5IT8O3gst524",
  authDomain: "photodiary-d9be2.firebaseapp.com",
  projectId: "photodiary-d9be2",
  storageBucket: "photodiary-d9be2.firebasestorage.app",
  messagingSenderId: "517719198940",
  appId: "1:517719198940:web:502ba6e04a3d6ebbc03819"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
