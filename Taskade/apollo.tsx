import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

import { setContext } from "@apollo/client/link/context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const URI = "http://192.168.0.131:4000";
// const URI = "http://localhost:4000";

const httpLink = createHttpLink({
  uri: URI,
});

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists

  const token = await AsyncStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  console.log("headerss=>", headers);

  return {
    headers: {
      ...headers,
      authorization: token || "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
