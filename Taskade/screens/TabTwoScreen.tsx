import * as React from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../components/Themed";
import EditScreenInfo from "../components/EditScreenInfo";
import ProjectItem from "../components/ProjectItem";

export default function TabTwoScreen() {
  const project = [
    { id: "123", title: "first project", createdAt: "4d" },
    { id: "234", title: "secound project", createdAt: "5d" },
    { id: "345", title: "third project", createdAt: "6d" },
  ];

  return (
    <View style={styles.container}>
      {/* Projects/TaskList */}
      <FlatList
        data={project}
        renderItem={({ item }) => <ProjectItem project={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
