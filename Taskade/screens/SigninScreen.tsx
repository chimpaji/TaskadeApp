import { useNavigation } from "@react-navigation/core";
import React, { useState } from "react";
import {
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

  const onSubmit = () => {
    //submit form
    console.log(email, " ", password);
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
        }}
      >
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
