import React from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface CheckboxProps {
  isComplete: boolean;
  onPress: () => void;
}

const Checkbox = (props: CheckboxProps) => {
  const { isComplete, onPress } = props;
  const name = isComplete
    ? "checkbox-marked-circle"
    : "checkbox-blank-circle-outline";
  return (
    <Pressable onPress={onPress}>
      <MaterialCommunityIcons name={name} size={24} color="black" />
    </Pressable>
  );
};

export default Checkbox;
