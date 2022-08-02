import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native";
import ChatItem from "../components/ChatItem";
import { TouchableOpacity } from "react-native";
import { Avatar } from "@rneui/themed";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";
import AntDesign from "@expo/vector-icons/AntDesign";
import { user } from "../redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { clearCurrentUserData } from "../redux/slices/userSlice";

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const [chats, setChats] = useState([]);
  const currentUser = useSelector(user);

  const signUserOut = () => {
    signOut(auth)
      .then(() => {
        dispatch(clearCurrentUserData());
        navigation.replace("Login");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "chats"), (snapshot) => {
      setChats(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    return unsubscribe;
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: currentUser.displayName,
      headerTintColor: "white",
      headerLeft: () => (
        <View style={{ marginRight: 20 }}>
          <TouchableOpacity onPress={signUserOut}>
            <Avatar
              rounded
              source={{
                uri: auth?.currentUser?.photoURL,
              }}
            />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 70,
            marginRight: 10,
          }}
        >
          <TouchableOpacity>
            <AntDesign size={24} color="white" name="camerao" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("AddChat")}>
            <AntDesign size={24} color="white" name="edit" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

  const enterChat = (id, chatName) => {
    navigation.navigate("Chat", {
      id,
      chatName,
    });
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        {chats.map(({ id, data: { chatName } }) => (
          <ChatItem
            key={id}
            id={id}
            chatName={chatName}
            enterChat={enterChat}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});
