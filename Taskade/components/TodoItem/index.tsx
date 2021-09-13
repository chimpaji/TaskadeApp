import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput } from "react-native";
import Checkbox from "../Checkbox";

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
    console.log("hi");

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
        onKeyPress={onKeyPress}
      />
    </View>
  );
};

export default TodoItem;
