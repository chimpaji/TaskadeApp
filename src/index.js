require("dotenv").config();

const { MongoClient } = require("mongodb");
const { ApolloServer, gql } = require("apollo-server");
const { DB_URI, DB_NAME } = process.env;

async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

const start = async () => {
  const client = new MongoClient(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  const db = client.db(DB_NAME);
  await listDatabases(client);

  const context = { db };

  const server = new ApolloServer({ typeDefs, resolvers, context });

  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};

start().catch(console.error);

const typeDefs = gql`
  type Query {
    myUsers: [User!]!
    myTaskList: [TaskList!]!
    myTodo: [ToDo!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    avatar: String
  }

  type TaskList {
    id: ID!
    createdAt: String!
    title: String!
    progress: Float!
    users: [User!]!
    todos: [ToDo!]!
  }

  type ToDo {
    id: ID!
    content: String!
    isCompleted: Boolean!
    taskList: TaskList!
  }
`;

const resolvers = {
  Query: {},
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
