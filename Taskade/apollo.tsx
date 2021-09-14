import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

const URI = "http://192.168.0.131:4000";

export const client = new ApolloClient({
  uri: URI,
  cache: new InMemoryCache(),
});
