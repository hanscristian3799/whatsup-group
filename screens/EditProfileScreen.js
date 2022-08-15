import {
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import HeaderBackButton from "../components/HeaderBackButton";
import { auth, updateUserProfile } from "../firebase";
import { Avatar, Button } from "@rneui/base";
import { IMG_PLACEHOLDER } from "../helpers/constant";
import { Input } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import { reload } from "firebase/auth";
import { editUser, user } from "../redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";

const EditProfileScreen = ({ navigation }) => {
  const currUser = useSelector(user)

  const dispatch = useDispatch();
  const [photoURL, setPhotoURL] = useState(
    currUser.photoURL ? currUser.photoURL : IMG_PLACEHOLDER
  );
  const [name, setName] = useState(currUser.displayName);
  const [email, setEmail] = useState(currUser.email);
  const [isLoading, setIsLoading] = useState(false);

  const updateUserData = async () => {
    try {
      const photo = photoURL === IMG_PLACEHOLDER ? null : photoURL;
      setIsLoading(true);
      await updateUserProfile(name, photo);
      await reload(auth.currentUser);
      dispatch(
        editUser({
          displayName: auth.currentUser.displayName,
          photoURL: auth.currentUser.photoURL,
        })
      );
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      alert(error.message);
    }
  };

  const showImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've to accept the permission to add a profile photo!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.cancelled) {
      setPhotoURL(result.uri);
    }
  };

  return (
    <View>
      <HeaderBackButton navigation={navigation} color="#00CC66" />
      <View style={{ alignItems: "center", marginTop: 120 }}>
        <TouchableOpacity activeOpacity={0.5} onPress={showImagePicker}>
          <Avatar
            source={{
              uri: photoURL,
            }}
            rounded
            size={96}
          />
        </TouchableOpacity>
        <View style={styles.fields}>
          <Input
            placeholder="Name"
            type="text"
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <Input placeholder="Email" type="email" value={email} disabled />
          <Button
            color="#00CC66"
            containerStyle={{ marginTop: 10 }}
            title="Save"
            disabled={isLoading}
            loading={isLoading}
            onPress={updateUserData}
          />
        </View>
      </View>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  fields: {
    width: 300,
    marginTop: 20,
  },
});
