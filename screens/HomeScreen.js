import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native";
import ChatItem from "../components/ChatItem";
import { TouchableOpacity } from "react-native";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "chats"),
      (snapshot) => {
        setChats(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      },
      (error) => {
        alert("Something's wrong");
      }
    );

    return unsubscribe;
  }, []);

  const enterChat = (id, chatName) => {
    navigation.navigate("Chat", {
      id,
      chatName,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.chatsContainer}>
        {chats.length !== 0 ? (
          chats.map(({ id, data: { chatName } }) => (
            <ChatItem
              key={id}
              id={id}
              chatName={chatName}
              enterChat={enterChat}
            />
          ))
        ) : (
          <View style={styles.noChatsContainer}>
              <MaterialCommunityIcons
                name="chat-remove-outline"
                size={32}
                color="black"
              />
              <Text>No conversation(s) found</Text>
          </View>
        )}
      </ScrollView>
      <TouchableOpacity
        onPress={() => navigation.navigate("AddChat")}
        style={[styles.addChat, styles.shadow]}
      >
        <View>
          <MaterialIcons name="chat" size={24} color="#00CC66" />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  chatsContainer: {
    height: "100%",
  },
  addChat: {
    position: "absolute",
    bottom: 30,
    right: 30,
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: "#FFFF",
    shadowColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  shadow: {
    //IOS
    // shadowColor: "#808080",
    // shadowOffset: {width: -2, height: 4},
    // shadowOpacity: 0.2,
    // shadowRadius: 3,
    elevation: 5,
    shadowColor: "#808080",
  },
  noChatsContainer: {
    alignItems: "center",
    justifyContent:"center",
    height: Dimensions.get('window').height
  }
});
