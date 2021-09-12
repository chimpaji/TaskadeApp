require("dotenv").config();
const { MongoClient } = require("mongodb");
const { ApolloServer, gql } = require("apollo-server");
const bcrypt = require("bcrypt");
const { DB_URI, DB_NAME } = process.env;
const saltRounds = 10;

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

  type Mutation {
    signUp(input: SignupInput): AuthUser
    signIn(input: SigninInput): AuthUser
  }

  input SigninInput {
    email: String!
    password: String!
  }

  input SignupInput {
    email: String!
    password: String!
    name: String!
    avatar: String
  }

  type AuthUser {
    user: User!
    token: String!
  }
`;

const resolvers = {
  User: {
    id: (root, data, context) => {
      //root will show what mutation return in User
      console.log("root", root);
      return root._id;
    },
  },
  Query: {},
  Mutation: {
    signUp: async (root, data, context) => {
      const { db } = context;
      const { input } = data;
      const existUser = await db
        .collection("Users")
        .findOne({ email: input.email });
      if (existUser) throw new Error(`Email ${input.email} already exists`);
      const hashedPassword = bcrypt.hashSync(input.password, saltRounds);
      const newUser = { ...input, password: hashedPassword };
      let id;
      const result = await db
        .collection("Users")
        .insertOne(newUser, function (error, response) {
          if (error) {
            console.log("Error occurred while inserting");
            // return
          } else {
            console.log("inserted record", response);
            id = response.insertedIds;
            return response;
          }
        });
      const user = await db.collection("Users").findOne({ email: input.email });
      console.log("resutl=>", result);
      console.log("user=>", user);
      return { user: user, token: "token123" };
    },
    signIn: async (root, data, context) => {
      const { input } = data;
      const { db } = context;

      const existUser = await db
        .collection("Users")
        .findOne({ email: input.email });
      if (!existUser) throw new Error("Invalid Credentials");

      const validPassword = bcrypt.compareSync(
        input.password,
        existUser.password
      );
      if (!validPassword) throw new Error("Invalid Credentials");

      return { token: "token123", user: existUser };
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
