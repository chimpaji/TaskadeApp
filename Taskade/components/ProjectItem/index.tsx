import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

interface ProjectItemProps {
  project: {
    id: string;
    title: string;
    createdAt: string;
  };
}

const ProjectItem = ({ project }: ProjectItemProps) => {
  const onPress = () => {
    console.warn(`Opening ${project.title}`);
  };
  return (
    <TouchableOpacity style={styles.touchable} onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="document-outline" size={24} color="black" />
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.upperInfo}>
            <View style={styles.taskTextContainer}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                {project.title}
              </Text>
              <Text style={{ opacity: 0.5, marginLeft: 3 }}>
                {project.createdAt}
              </Text>
            </View>
            <View>
              <Text>Progress</Text>
            </View>
          </View>
          <View style={styles.lowerInfo}>
            <View style={styles.extraFnContainer}>
              <AntDesign name="calendar" size={24} color="black" />
              <Text>Date</Text>
            </View>
            <View style={styles.extraFnContainer}>
              <Ionicons name="ios-person-add-outline" size={24} color="black" />
              <Text>Assign</Text>
            </View>
            <View style={styles.extraFnContainer}>
              <AntDesign name="tago" size={24} color="black" />
              <Text>Tag</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProjectItem;

const styles = StyleSheet.create({
  touchable: { width: "100%", marginVertical: 10 },
  container: {
    flexDirection: "row",
    flexGrow: 1,
    // backgroundColor: "red",
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "#c8ccc9",
    opacity: 0.7,
    borderRadius: 10,
    flexShrink: 0,
    padding: 8,
    margin: 5,
  },
  infoContainer: {
    width: "85%",
    paddingLeft: 2,
    borderBottomColor: "black",
    borderBottomWidth: 2,
  },
  lowerInfo: { flexDirection: "row", paddingBottom: 10 },
  upperInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  taskTextContainer: { flexDirection: "row", alignItems: "center" },
  extraFnContainer: {
    backgroundColor: "white",
    opacity: 0.8,
    paddingHorizontal: 4,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 2,
  },
});
