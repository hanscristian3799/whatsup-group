import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { db, auth } from "../firebase";
import {
  doc,
  addDoc,
  serverTimestamp,
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { Avatar, Divider } from "@rneui/base";

const ChatScreen = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "",
      headerLeft: () => (
        <View style={styles.headerStyle}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={24} color="#000" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{route.params.chatName}</Text>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const fetchQuery = query(
      collection(doc(db, "chats", route.params.id), "messages"),
      orderBy("timeStamp", "asc")
    );

    const unsubscribe = onSnapshot(fetchQuery, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    return unsubscribe;
  }, [route]);

  const send = async () => {
    Keyboard.dismiss();

    await addDoc(collection(doc(db, "chats", route.params.id), "messages"), {
      timeStamp: serverTimestamp(),
      message: input,
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL,
    });

    setInput("");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView style={styles.chatContainer}>
              {messages.map(({ id, data }) =>
                data.email === auth.currentUser.email ? (
                  <View key={id} style={styles.me}>
                    <Text style={{ color: "#FFFF" }}>{data.message}</Text>
                  </View>
                ) : (
                  <View key={id} style={styles.other}>
                    <Avatar
                      position="absolute"
                      containerStyle={{
                        position: "absolute",
                        bottom: -10,
                        left: -5,
                      }}
                      bottom={-10}
                      left={-5}
                      source={{ uri: data.photoURL }}
                      rounded
                      size={30}
                    />
                    <Text style={{marginBottom: 10}}>{data.message}</Text>
                    <Divider />
                    <Text style={styles.othersName}>{data.displayName}</Text>
                  </View>
                )
              )}
            </ScrollView>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Type a message..."
                style={styles.input}
                value={input}
                onChangeText={(text) => setInput(text)}
              />
              <TouchableOpacity onPress={send}>
                <Ionicons name="send" size={24} color="#00CC66" />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  headerStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    color: "#000",
    marginLeft: 10,
    fontWeight: "600",
  },
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    width: "100%",
  },
  input: {
    bottom: 0,
    height: 40,
    flex: 1,
    borderColor: "transparent",
    backgroundColor: "#ECECEC",
    borderWidth: 1,
    marginRight: 10,
    padding: 10,
    borderRadius: 20,
    color: "gray",
  },
  chatContainer: {
    flexDirection: "column-reverse",
    paddingVertical: 15,
    backgroundColor: "#ECECEC",
  },
  me: {
    position: "relative",
    alignSelf: "flex-end",
    backgroundColor: "#00CC66",
    marginVertical: 10,
    marginEnd: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    maxWidth: "80%",
  },
  profileAvatar: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: 30,
    height: 30,
    borderRadius: 50,
  },
  other: {
    position: "relative",
    alignSelf: "flex-start",
    backgroundColor: "#FFF",
    marginVertical: 10,
    marginStart: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    padding: 10,
    maxWidth: "80%",
  },
  othersName: {
    marginStart: 10,
    paddingTop: 10,
    fontWeight: "700",
  },
});
