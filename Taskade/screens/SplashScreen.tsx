import { useNavigation } from "@react-navigation/core";
import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

//This will be the first screen to arrange user to signin screen/ home screen up to their token data
//in localStorage
const SplashScreen = () => {
  const navigation = useNavigation();

  //check if there's token
  const isAuthenticated = async () => {
    // await AsyncStorage.removeItem("token");
    const token = await AsyncStorage.getItem("token");
    return !!token;
  };

  // direct user upto isAuthenticated condition
  useEffect(() => {
    const checkUser = async () => {
      const isAuth = await isAuthenticated();
      if (isAuth) {
        navigation.navigate("Home");
      } else {
        navigation.navigate("SigninScreen");
      }
    };
    checkUser();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#000000" />
    </View>
  );
};

export default SplashScreen;
