import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Text, View } from "../components/Themed";
import EditScreenInfo from "../components/EditScreenInfo";
import ProjectItem from "../components/ProjectItem";
import { useQuery, gql } from "@apollo/client";

export default function ProjectScreen() {
  const myProject = gql`
    query Query {
      myTaskList {
        id
        title
        createdAt
      }
    }
  `;
  const { data, error, loading } = useQuery(myProject);

  const [projects, setProjects] = useState(null);

  const project = [
    { id: "123", title: "first project", createdAt: "4d" },
    { id: "234", title: "secound project", createdAt: "5d" },
    { id: "345", title: "third project", createdAt: "6d" },
  ];
  console.log("data=>", data);

  useEffect(() => {
    if (data) {
      setProjects(data?.myTaskList);
    }
  }, [data]);

  // if (loading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center" }}>
  //       <ActivityIndicator color="black" size="large" />
  //     </View>
  //   );
  // }

  useEffect(() => {
    if (error) {
      Alert.alert(error.message);
    }
  }, [error]);

  return (
    <View style={styles.container}>
      {/* Projects/TaskList */}
      {loading && <ActivityIndicator color="black" size="large" />}
      <FlatList
        data={projects}
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
