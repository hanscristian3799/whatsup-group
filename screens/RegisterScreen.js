import React, { useLayoutEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Input, Text, Avatar } from "@rneui/base";
import { StatusBar } from "expo-status-bar";
import stylesGlobal from "../styles/index";
import { firebaseSignUp, updateProfilePicture, uploadProfilePicture } from "../firebase";
import HeaderBackButton from "../components/HeaderBackButton";
import * as ImagePicker from "expo-image-picker";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const uploadFile = async (imageUrl, userId) => {
    const data = await uploadProfilePicture(imageUrl, userId);
    if (data.status) return true;
    return false;
  };

  const register = async () => {
    try {
      setIsLoading(true);
      const user = await firebaseSignUp(email, fullName, password, imageUrl);
      if (user) {
        if (imageUrl) {
          const uploadFileStatus = await uploadFile(imageUrl, user);
          if (uploadFileStatus) {
            await updateProfilePicture(user);
            setIsLoading(false);
            navigation.replace("Login")
          } else {
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
          navigation.replace("Login")
        }
      }
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
      setImageUrl(result.uri);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />

      <HeaderBackButton navigation={navigation} color="#00CC66" />

      <Text h3>Join Chat Communities</Text>

      <Text style={{ marginBottom: 50, fontSize: 20, color: "grey" }}>
        Create an account
      </Text>

      <TouchableOpacity activeOpacity={0.5} onPress={showImagePicker}>
        {imageUrl ? (
          <Avatar
            source={{
              uri: imageUrl,
            }}
            rounded
            size={96}
          />
        ) : (
          <Avatar
            icon={{ name: "image", type: "font-awesome" }}
            containerStyle={{ backgroundColor: "#00CC66" }}
            rounded
            size={96}
          />
        )}
      </TouchableOpacity>

      <View style={styles.input}>
        <Input
          placeholder="Full Name"
          type="text"
          value={fullName}
          onChangeText={(text) => setFullName(text)}
        />
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="Password"
          type="password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>

      <Button
        containerStyle={stylesGlobal.authButton}
        loading={isLoading}
        disabled={isLoading || !fullName || !email || !password}
        color="#00CC66"
        raised
        title="Register"
        onPress={register}
      />

      <View style={styles.loginSuggestContainer}>
        <Text>Already have an account?</Text>
        <Button
          disabled={isLoading}
          title={
            <Text style={{ color: "#00CC66", fontWeight: "700" }}>
              Login here!
            </Text>
          }
          type="clear"
          onPress={() => navigation.goBack()}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 30,
  },
  loginSuggestContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    width: 300,
    marginTop: 20,
  },
});
