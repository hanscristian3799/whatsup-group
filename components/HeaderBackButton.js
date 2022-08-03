import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

const HeaderBackButton = ({ navigation, color }) => {
  return (
    <TouchableOpacity
      style={[styles.backButton]}
      onPress={() => navigation.goBack()}
    >
      <AntDesign name="arrowleft" size={36} color={color ? color : "#000"} />
    </TouchableOpacity>
  );
};

export default HeaderBackButton;

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 50,
    left: 30,
  },
});
