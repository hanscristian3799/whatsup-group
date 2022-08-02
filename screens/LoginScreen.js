import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Input, Image } from "@rneui/base";
import { StatusBar } from "expo-status-bar";
import stylesGlobal from "../styles/index";
import { auth, signIn } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Entypo } from "@expo/vector-icons";

const LoginScreen = ({ navigation }) => {
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const res = await signIn(email, password);

      if (res.status) {
        setIsLoading(false);
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

      <Entypo name="chat" size={180} color="#00CC66" style={{marginBottom: 30}} />

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
        color="#00CC66"
        title="Login"
        onPress={handleSignIn}
      />

      <View style={styles.registerSuggestContainer}>
        <Text style={{marginRight: 5}}>Dont have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={{ color: "#00CC66", fontWeight: "700" }}>
            Register here!
          </Text>
        </TouchableOpacity>
      </View>
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
  registerSuggestContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  input: {
    width: 300,
  },
  button: {
    width: 300,
    marginTop: 10,
  },
});
