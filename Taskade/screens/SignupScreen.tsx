import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { gql, useMutation } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignupScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const SIGN_UP_MUTATION = gql`
    mutation Mutation(
      $email: String!
      $password: String!
      $name: String!
      $avatar: String
    ) {
      signUp(
        input: {
          email: $email
          password: $password
          name: $name
          avatar: $avatar
        }
      ) {
        token
        user {
          id
          name
          email
        }
      }
    }
  `;
  const [signUp, { data, error, loading }] = useMutation(SIGN_UP_MUTATION);

  const onSubmit = () => {
    //submit form
    console.log(email, " ", password);
    try {
      signUp({ variables: { email, password, name } });
      console.log("yes");
    } catch (error) {
      Alert.alert("onSubmit eorrr");
    }
  };

  if (data) {
    //save token in data to localStorage
    AsyncStorage.setItem("token", data.signUp.token, (error) => {
      if (error) {
        console.log();

        Alert.alert("hi");
      }
      //navigate to homeScreen
      navigation.navigate("Home");
    });
  }

  useEffect(() => {
    if (error) {
      Alert.alert(error.message);
      console.log("some error");
    }
  }, [error]);

  return (
    <View
      style={{
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        padding: 6,
      }}
    >
      {loading && <ActivityIndicator />}
      <TextInput
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        style={{
          marginVertical: 25,
          borderBottomWidth: 1,
          padding: 2,
          width: "100%",
          fontSize: 20,
        }}
      />
      <TextInput
        placeholder="Enter your email address"
        value={email}
        onChangeText={setEmail}
        style={{
          marginVertical: 25,
          borderBottomWidth: 1,
          padding: 2,
          width: "100%",
          fontSize: 20,
        }}
      />

      <TextInput
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          marginVertical: 25,
          borderBottomWidth: 1,
          padding: 2,
          width: "100%",
          fontSize: 20,
          marginTop: 12,
        }}
      />
      <TouchableOpacity
        disabled={loading}
        onPress={onSubmit}
        style={{
          backgroundColor: "black",
          width: "100%",
          padding: 10,
          alignItems: "center",
          borderRadius: 10,
        }}
      >
        {loading && <ActivityIndicator size="large" color="#fffff" />}
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: 20,
          }}
        >
          Sign up
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("SigninScreen");
        }}
      >
        <Text
          style={{
            color: "black",
            fontWeight: "bold",
            fontSize: 20,
            marginTop: 20,
          }}
        >
          Alraedy have account? Sign in
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;
