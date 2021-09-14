import { useQuery, gql, useMutation } from "@apollo/client";
import { useNavigation, useRoute } from "@react-navigation/core";
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

const GET_TASKLIST = gql`
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

const ADD_TODO = gql`
  mutation createTodo($content: String!, $taskListId: ID!) {
    createToDo(content: $content, taskListId: $taskListId) {
      content
      isCompleted
      taskList {
        id
        title
        todos {
          id
          content
          isCompleted
        }
      }
    }
  }
`;

export default function ToDoScreen() {
  const route = useRoute();
  const { id } = route.params;
  // console.log("id=>", id);

  const { data, error, loading } = useQuery(GET_TASKLIST, {
    variables: { id },
  });

  const [
    addTodo,
    { data: AddTodoData, error: AddTodoError, loading: AddTodoLoading },
  ] = useMutation(ADD_TODO);

  const [title, setTitle] = useState("");
  const [todos, setTodos] = useState([
    { id: "12456789", content: "", isCompleted: false },
  ]);
  // console.log("data=>", data);

  useEffect(() => {
    if (data) {
      setTitle(data.getTaskList.title);
      setTodos(data?.getTaskList?.todos);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      Alert.alert("Error fetching data", error.message);
    }
  }, [error]);

  const createNewItem = (atIndex: number) => {
    console.log("creating Item");

    addTodo({ variables: { content: "", taskListId: id } });
    // const newTodos = [...todos];
    // newTodos.splice(atIndex, 0, {
    //   id: (Math.floor(Math.random() * 100) + 10).toString(),
    //   content: "",
    //   isCompleted: false,
    // });
    // setTodos(newTodos);
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
