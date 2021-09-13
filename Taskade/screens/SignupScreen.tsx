import { useNavigation } from "@react-navigation/core";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";

const SignupScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
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
