import React, { useLayoutEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Input, Icon, Text } from "@rneui/base";
import { StatusBar } from "expo-status-bar";
import stylesGlobal from "../styles/index";
import { firebaseSignUp } from "../firebase";
import { AntDesign } from "@expo/vector-icons";
import HeaderBackButton from "../components/HeaderBackButton";

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

      <HeaderBackButton navigation={navigation} color="#00CC66" />

      <Text h3>Join Chat Communities</Text>

      <Text style={{ marginBottom: 50, fontSize: 20, color: "grey" }}>
        Create an account
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
  },
});
