import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { Avatar } from "@rneui/base";
import { auth } from "../firebase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import { user } from "../redux/slices/userSlice";
import { useSelector } from "react-redux";

const buttonItems = [
  {
    title: "Logout",
    iconName: "exit-to-app",
  },
  {
    title: "Edit Profile",
    iconName: "account-edit",
    screen: "EditProfile",
  },
];

const ProfileScreen = ({ navigation }) => {
  const currUser = useSelector(user)

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
      {currUser.photoURL ? (
        <Avatar
          source={{
            uri: currUser.photoURL,
          }}
          rounded
          size={96}
        />
      ) : (
        <Avatar
          icon={{ name: "person", type: "material" }}
          containerStyle={{ backgroundColor: "#CCCC" }}
          rounded
          size={96}
        />
      )}

      <View style={styles.nameContainer}>
        <View style={styles.onlineStatus}></View>
        <Text style={styles.displayName}>{currUser.displayName}</Text>
      </View>
      <Text style={styles.email}>{currUser.email}</Text>

      {buttonItems.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            style={styles.profileButton}
            onPress={() =>
              item.title === "Logout"
                ? signUserOut()
                : navigation.navigate(item.screen)
            }
          >
            <MaterialCommunityIcons
              name={item.iconName}
              size={24}
              color="black"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.buttonText}>{item.title}</Text>
          </TouchableOpacity>
        );
      })}
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
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
    width: 150,
    marginTop: 20,
    borderWidth: 0.5,
    borderColor: "#000",
    padding: 8,
    borderRadius: 2,
  },
  buttonText: {
    flex: 1,
    color: "#000",
    fontWeight: "500",
    fontSize: 16,
  },
});
