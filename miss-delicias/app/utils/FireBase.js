import firebase from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyCtkxR32a8FMH9O7T8qnSrE6LWxK5v-600",
    authDomain: "miss-delicias.firebaseapp.com",
    databaseURL: "https://miss-delicias.firebaseio.com",
    projectId: "miss-delicias",
    storageBucket: "miss-delicias.appspot.com",
    messagingSenderId: "424029481239",
    appId: "1:424029481239:web:30bfaf8f27c14e63e06f52"
  };

export const firebaseApp =firebase.initializeApp(firebaseConfig);

