import React, { useLayoutEffect, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { Button, Input, Image, Text } from "@rneui/base";
import { StatusBar } from "expo-status-bar";
import stylesGlobal from "../styles/index";
import { firebaseSignUp } from "../firebase";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Register Account",
    });
  }, [navigation]);

  const register = async () => {
    try {
      setIsLoading(true);
      const user = await firebaseSignUp(email, fullName, password, imageUrl);
      if (user) {
        setIsLoading(false);
        navigation.goBack();
      }
    } catch (error) {
      setIsLoading(false);

      alert(error.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />

      <Text h3 style={{ marginBottom: 50 }}>
        Join Our Chat Community
      </Text>

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
        <Input
          placeholder="Image URL"
          type="text"
          value={imageUrl}
          onChangeText={(text) => setImageUrl(text)}
          onSubmitEditing={register}
        />
      </View>

      <Button
        containerStyle={stylesGlobal.authButton}
        loading={isLoading}
        disabled={isLoading}
        color="#2C6BED"
        raised
        title="Register"
        onPress={register}
      />
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
  },
  input: {
    width: 300,
  },
});
