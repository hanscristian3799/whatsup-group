import { initializeApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeiO77Ec5qd0DEn10BsKFYYtgdib45wNw",
  authDomain: "signal-clone-b6a57.firebaseapp.com",
  projectId: "signal-clone-b6a57",
  storageBucket: "signal-clone-b6a57.appspot.com",
  messagingSenderId: "325390587144",
  appId: "1:325390587144:web:10717451e46be32ed288bd",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const firebaseSignUp = async (email, name, password, imageUrl) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, {
    displayName: name,
    photoURL:
      imageUrl ||
      "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",
  });
  return user.uid;
};

export const checkUser = async () => {
  const loggedUser = await onAuthStateChanged(auth, (user) => {
    if (user) {
      return { loggedUser, user };
    }
  });
};

export const signIn = async (email, password) => {
  const loggedUser = await signInWithEmailAndPassword(auth, email, password);
  console.log("LOGGED", loggedUser.user.stsTokenManager.accessToken);
  if (loggedUser) {
    const user = {
      displayName: loggedUser.user.displayName,
      email: loggedUser.user.email,
      photoURL: loggedUser.user.photoURL,
      token: loggedUser.user.stsTokenManager.accessToken,
    };
    return { status: true, user };
  }
  return { status: false };
};
