import { useMutation, gql } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SigninScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const SIGN_IN_MUTATION = gql`
    mutation Mutation($email: String!, $password: String!) {
      signIn(input: { email: $email, password: $password }) {
        token
        user {
          id
          name
          email
        }
      }
    }
  `;
  const [signIn, { data, error, loading }] = useMutation(SIGN_IN_MUTATION);

  if (data) {
    //save token data to localStorage
    AsyncStorage.setItem("token", data.signIn.token, (error) => {
      if (error) console.log(error.message);
      //navigate to homeScreen
      navigation.navigate("Home");
    });
  }

  useEffect(() => {
    if (error) {
      Alert.alert(error.message);
    }
  }, [error]);

  const onSubmit = () => {
    //submit form
    console.log(email, " ", password);
    try {
      signIn({ variables: { email, password } });
      console.log("hiiii");
    } catch (error) {
      console.log("signin error=>", error);
    }
  };
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
        onPress={onSubmit}
        style={{
          backgroundColor: "black",
          width: "100%",
          padding: 10,
          alignItems: "center",
          borderRadius: 10,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {loading && <ActivityIndicator size="large" color="white" />}

        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: 20,
          }}
        >
          Sign in
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("SignupScreen");
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
          New here? Sign up
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SigninScreen;

const styles = StyleSheet.create({});
