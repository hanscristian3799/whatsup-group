import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Avatar } from "@rneui/base";
import { auth } from "../firebase";
import { Button } from "@rneui/base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";

const ProfileScreen = ({ navigation }) => {
  const signUserOut = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("Login");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <View style={styles.profileContainer}>
      <Avatar
        source={{
          uri: auth.currentUser.photoURL,
        }}
        rounded
        size={96}
      />
      <View style={styles.nameContainer}>
        <View style={styles.onlineStatus}></View>
        <Text style={styles.displayName}>{auth.currentUser.displayName}</Text>
      </View>
      <Text style={styles.email}>{auth.currentUser.email}</Text>
      <Button
        containerStyle={{ width: 150, marginTop: 20 }}
        buttonStyle={{ borderColor: "#000" }}
        title="Logout"
        type="outline"
        titleStyle={{ color: "#000" }}
        icon={
          <MaterialCommunityIcons
            name="exit-to-app"
            size={24}
            color="black"
            style={{ marginRight: 10 }}
          />
        }
        onPress={signUserOut}
      />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: Dimensions.get("window").height,
  },
  nameContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  onlineStatus: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: "#00CC66",
    marginRight: 10,
  },
  displayName: {
    fontWeight: "700",
    fontSize: 20,
  },
  email: {
    marginBottom: 10,
    fontWeight: "500",
    fontSize: 18,
  },
});
