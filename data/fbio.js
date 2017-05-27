import * as firebase from "firebase";

firebase.initializeApp({
    apiKey: "AIzaSyB4meRiDuw4GQbbAA7T5B8zF_z7UIqcKEU",
    authDomain: "transportame-c5b3a.firebaseapp.com",
    databaseURL: "https://transportame-c5b3a.firebaseio.com",
    storageBucket: "transportame-c5b3a.appspot.com",
});

export const login = async (email, password) => {
  return firebase.auth().signInWithEmailAndPassword(email, password);
};

export const logout = async () => {
  return firebase.auth().signOut();
};

export const register = async (email, password) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
};
