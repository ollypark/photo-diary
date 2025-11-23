// --- IMPORTANT ---
// Replace the config object below with your Firebase project's config.
// You can get this from Firebase Console -> Project Settings -> General -> Your apps -> Firebase SDK snippet
// Keep this file in the site root. Do NOT commit real credentials to public repos if you care about security.

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
  // Shortcuts
  window.db = firebase.firestore();
  window.storage = firebase.storage();
} else {
  console.warn("Firebase SDK not loaded. Make sure you have an internet connection or the SDK script tags.");
}
