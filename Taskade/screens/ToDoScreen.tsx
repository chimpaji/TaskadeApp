import { useQuery, gql } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import Checkbox from "../components/Checkbox";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import TodoItem from "../components/TodoItem";
import { RootTabScreenProps } from "../types";

export default function ToDoScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const myTaskList = gql`
    query GetTaskListMutation($id: ID!) {
      getTaskList(id: $id) {
        id
        title
        users {
          name
          email
        }
        todos {
          id
          content
          isCompleted
        }
      }
    }
  `;
  const { data, error, loading } = useQuery(myTaskList);

  const [title, setTitle] = useState("");
  const [todos, setTodos] = useState([
    { id: "1", content: "Buy milk", isCompleted: true },
    { id: "2", content: "Buy cereal", isCompleted: true },
    { id: "3", content: "Buy LED", isCompleted: true },
  ]);

  useEffect(() => {
    if (data) {
      setTodos(data?.getTaskList?.todos);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      Alert.alert(error.message);
    }
  }, [error]);

  const createNewItem = (atIndex: number) => {
    const newTodos = [...todos];
    newTodos.splice(atIndex, 0, {
      id: (Math.floor(Math.random() * 100) + 10).toString(),
      content: "",
      isCompleted: false,
    });
    setTodos(newTodos);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={-120}
    >
      <View style={styles.container}>
        <TextInput
          style={styles.title}
          value={title}
          placeholder={"Title"}
          onChangeText={setTitle}
        />
        <FlatList
          style={{ width: "100%", height: "100%" }}
          data={todos}
          renderItem={({ item, index }) => (
            <TodoItem todo={item} onSubmit={() => createNewItem(index + 1)} />
          )}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    width: "100%",
    marginBottom: 12,
    fontWeight: "bold",
    color: "black",
  },
});
