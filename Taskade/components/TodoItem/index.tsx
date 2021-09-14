import { useMutation, gql } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
} from "react-native";
import Checkbox from "../Checkbox";
import { Ionicons } from "@expo/vector-icons";

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: ID!, $content: String, $isCompleted: Boolean) {
    updateToDo(id: $id, content: $content, isCompleted: $isCompleted) {
      id
      content
      isCompleted
      taskList {
        progress
        todos {
          id
          content
          isCompleted
        }
      }
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteToDoMutation($deleteToDoId: ID!) {
    deleteToDo(id: $deleteToDoId) {
      id
      todos {
        id
        content
      }
    }
  }
`;

const GET_TASKLIST = gql`
  query GetTaskListMutation($id: ID!) {
    getTaskList(id: $id) {
      id
      todos {
        id
        content
        isCompleted
      }
    }
  }
`;

interface TodoItemProps {
  todo: {
    id: string;
    content: string;
    isCompleted: boolean;
  };
  onSubmit: () => void;
}

const TodoItem = ({ todo, onSubmit }: TodoItemProps) => {
  const [content, setContent] = useState("");
  const [isComplete, setIsComplete] = useState(true);
  const inputRef = useRef(null);

  const [updateTodo, { data, error, loading }] = useMutation(UPDATE_TODO);
  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);
  const [deleteTodo] = useMutation(DELETE_TODO, {
    refetchQueries: GET_TASKLIST,
  });

  const callUpdateTodo = () => {
    updateTodo({
      variables: { id: todo.id, content, isCompleted: isComplete },
    });
  };

  useEffect(() => {
    if (!todo) return;
    setContent(todo.content);
    setIsComplete(todo.isCompleted);
  }, [todo]);

  useEffect(() => {
    //put focus on first time mounted
    if (inputRef.current) {
      inputRef?.current?.focus();
    }
  }, [inputRef]);

  const onKeyPress = ({ nativeEvent }: any) => {
    if (nativeEvent.key === "Backspace" && content == "") {
      //Delete TodoItem
      console.log("Delete item");
    }
  };

  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", paddingVertical: 3 }}
    >
      <Checkbox
        isComplete={isComplete}
        onPress={() => {
          setIsComplete(!isComplete);
          callUpdateTodo();
        }}
      />
      <TextInput
        ref={inputRef}
        value={content}
        onChangeText={setContent}
        style={{ flex: 1, color: "black" }}
        multiline
        blurOnSubmit
        onSubmitEditing={onSubmit}
        onEndEditing={callUpdateTodo}
        onKeyPress={onKeyPress}
      />
      <TouchableOpacity
        onPress={() => deleteTodo({ variables: { deleteToDoId: todo.id } })}
      >
        <Ionicons name="trash-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default TodoItem;
