import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar, ListItem } from "@rneui/themed";
import {
  doc,
  addDoc,
  serverTimestamp,
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../firebase";

const ChatItem = ({ id, chatName, enterChat }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchQuery = query(
      collection(doc(db, "chats", id), "messages"),
      orderBy("timeStamp", "desc")
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
  }, []);

  return (
    <TouchableOpacity onPress={() => enterChat(id, chatName)}>
      <ListItem key={id} bottomDivider>
        <Avatar
          rounded
          source={{
            uri: "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",
          }}
        />
        <ListItem.Content>
          <ListItem.Title style={{ fontWeight: "800", fontSize: 18 }}>
            {chatName}
          </ListItem.Title>
          <ListItem.Subtitle numberOfLines={1} elipsizeMode="tail">
            {messages[0] ? (
              <Text>
                <Text style={{ fontWeight: "700" }}>
                  {messages[0]?.data.displayName}
                </Text>
                {": "}
                {messages[0]?.data.message}
              </Text>
            ) : (
              <Text>No messages</Text>
            )}
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </TouchableOpacity>
  );
};

export default ChatItem;

const styles = StyleSheet.create({});
