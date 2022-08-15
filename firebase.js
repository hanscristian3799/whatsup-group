import { initializeApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";
import { getFirestore } from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBeiO77Ec5qd0DEn10BsKFYYtgdib45wNw",
  authDomain: "signal-clone-b6a57.firebaseapp.com",
  projectId: "signal-clone-b6a57",
  storageBucket: "signal-clone-b6a57.appspot.com",
  messagingSenderId: "325390587144",
  appId: "1:325390587144:web:10717451e46be32ed288bd",
  storageBucket: "gs://signal-clone-b6a57.appspot.com",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const storage = getStorage(app);

export const firebaseSignUp = async (email, name, password, imageUrl) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, {
    displayName: name,
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

export const uploadProfilePicture = async (imgUrl, userId) => {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };

    xhr.onerror = function () {
      reject(new TypeError("Network request error!"));
    };

    xhr.responseType = "blob";
    xhr.open("GET", imgUrl, true);
    xhr.send(null);
  });

  const storageRef = ref(storage, `user/${userId}`);
  const upload = await uploadBytes(storageRef, blob);
  if (upload.metadata.timeCreated) {
    return {
      status: true,
      data: upload.metadata.timeCreated,
    };
  }
  return {
    status: false,
    msg: err.message,
  };
};

export const updateProfilePicture = async (userId) => {
  const storageRef = ref(storage, `user/${userId}`);
  getDownloadURL(storageRef).then((url) => {
    updateProfile(auth.currentUser, {
      photoURL: url,
    })
  });
};

export const updateUserProfile = async (newName, imageUrl) => {
  await updateProfile(auth.currentUser, {
    displayName: newName,
  });
  if (imageUrl) {
    await uploadProfilePicture(imageUrl, auth.currentUser.uid);
    await updateProfilePicture(auth.currentUser.uid);
  }
};
