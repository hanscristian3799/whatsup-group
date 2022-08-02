import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Button, Input } from "@rneui/base";
import Icon from "react-native-vector-icons/FontAwesome";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const AddChatScreen = ({ navigation }) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addNewChat = async () => {
    try {
      setIsLoading(true);
      const writtenDoc = await addDoc(collection(db, "chats"), {
        chatName: input,
      });
      if (writtenDoc) {
        setIsLoading(false);
        navigation.goBack();
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Chat name"
        type="text"
        value={input}
        onChangeText={(text) => setInput(text)}
        leftIcon={<Icon name="wechat" size={24} style={{ marginRight: 10 }} />}
      />
      <Button
        disabled={isLoading}
        loading={isLoading}
        title="Add Chat"
        color="#2C6BED"
        onPress={addNewChat}
      />
    </View>
  );
};

export default AddChatScreen;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    padding: 30,
    backgroundColor: "white",
  },
});
