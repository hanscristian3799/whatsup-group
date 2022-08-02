import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import { Button, Input, Image } from "@rneui/base";
import { StatusBar } from "expo-status-bar";
import stylesGlobal from "../styles/index";
import { auth, signIn } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { setCurrentUser } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       navigation.replace("Home");
  //     }
  //   });

  //   return unsubscribe;
  // }, []);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const res = await signIn(email, password);

      if (res.status) {
        setIsLoading(false);
        dispatch(setCurrentUser(res.user));
        navigation.replace("Home");
      } else {
        setIsLoading(false);
        alert("Something wrong");
      }
    } catch (error) {
      setIsLoading(false);
      alert(error.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={{
          uri: "https://blog.mozilla.org/internetcitizen/files/2018/08/signal-logo.png",
        }}
        style={{ width: 200, height: 200 }}
      />

      <View style={styles.input}>
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
        disabled={isLoading}
        loading={isLoading}
        color="#2C6BED"
        title="Login"
        onPress={handleSignIn}
      />
      <Button
        containerStyle={stylesGlobal.authButton}
        disabled={isLoading}
        color="#2C6BED"
        title="Register"
        type="outline"
        onPress={() => navigation.navigate("Register")}
      />
      <View style={{ height: 50 }}></View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
  },
  input: {
    width: 300,
  },
  button: {
    width: 300,
    marginTop: 10,
  },
});
