require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const { ApolloServer, gql } = require("apollo-server");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { DB_URI, DB_NAME, JWT_SECRET } = process.env;
const saltRounds = 10;

const getToken = async (user) => {
  const token = await jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: "30d",
  });
  return token;
};

const getUserFromToken = async (token, db) => {
  if (!token) return null;

  const tokenPayload = await jwt.verify(token, JWT_SECRET);
  //   console.log("tokenPayload", tokenPayload);
  if (!tokenPayload?.id) return null;
  const id = tokenPayload.id;
  const user = await db.collection("Users").findOne({ _id: ObjectId(id) });
  if (!user) return null;

  return user;
};

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

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      //we need user data on every req
      const token = req.headers["authorization"];
      const user = await getUserFromToken(token, db);
      return { db, user };
    },
  });

  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};

start().catch(console.error);

const typeDefs = gql`
  type Query {
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

    createTaskList(taskTitle: String!): TaskList!
    updateTaskList(id: ID!, title: String!): TaskList!
    deleteTaskList(id: ID!): Boolean!
    getTaskList(id: ID!): TaskList!
    addUserToTaskList(userId: ID!, taskListId: ID!): TaskList!

    createToDo(content: String!, taskListId: ID!): ToDo!
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
  Query: {
    myTaskList: async (root, data, context) => {
      const { db, user } = context;
      if (!user) throw new Error(`Authorization Error. Please login`);
      return await db
        .collection("TaskLists")
        .find({ userIds: user._id })
        .toArray();
    },
  },
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
      return { user: user, token: "token123" };
    },
    signIn: async (root, data, context) => {
      //will show db and user data
      console.log("context=>", context);
      const { input } = data;
      const { db } = context;
      const existUser = await db
        .collection("Users")
        .findOne({ email: input.email });
      const validPassword =
        existUser && bcrypt.compareSync(input.password, existUser.password);

      if (!existUser || !validPassword) throw new Error("Invalid Credentials");

      const token = await getToken(existUser);

      return { token, user: existUser };
    },
    createTaskList: async (_, data, context) => {
      const { taskTitle } = data;
      const { db, user } = context;
      console.log(user);
      if (!user) throw new Error("Authentication Error. Please login");

      const newTaskList = {
        title: taskTitle,
        createdAt: new Date().toISOString(),
        userIds: [user?._id],
      };
      const result = await db.collection("TaskLists").insertOne(newTaskList);
      console.log("result=>", result);
      const taskList = await db
        .collection("TaskLists")
        .findOne({ _id: result?.insertedId });
      console.log("taskList=>", taskList);
      return taskList;
    },
    updateTaskList: async (root, data, context) => {
      const { id, title } = data;
      const { db, user } = context;
      if (!user) throw new Error("Authentication Error. Please login");

      const query = { _id: ObjectId(id) };
      const update = { $set: { title } };
      const options = { returnNewDocument: true };
      const result = await db.collection("TaskLists").updateOne(query, update);

      return await db.collection("TaskLists").findOne(query);
    },
    deleteTaskList: async (root, data, context) => {
      const { db, user } = context;
      const { id } = data;
      if (!user) throw new Error("Authentication Error. Please login");
      //TODO: check if the user's id is in userIds
      const query = { _id: ObjectId(id) };
      const result = db.collection("TaskLists").deleteOne(query);
      return true;
    },
    getTaskList: async (root, data, context) => {
      const { db, user } = context;
      const { id } = data;
      if (!user) throw new Error("Authentication Error. Please login");

      const query = { _id: ObjectId(id) };
      return await db.collection("TaskLists").findOne(query);
    },
    addUserToTaskList: async (root, data, context) => {
      const { db, user } = context;
      const { userId, taskListId } = data;
      if (!user) throw new Error(`Authorization Error. Please login`);

      const query = { _id: ObjectId(taskListId) };
      const update = { $push: { userIds: ObjectId(userId) } };
      const existedTaskList = await db.collection("TaskLists").findOne(query);
      if (!existedTaskList) return null;
      if (existedTaskList.userIds.find((dbId) => dbId.toString() === userId)) {
        return existedTaskList;
      }

      const result = await db.collection("TaskLists").updateOne(query, update);
      //reducing requesting time to db by using existedTaskList data
      existedTaskList.userIds.push(ObjectId(userId));
      return existedTaskList;
    },
    createToDo: async (root, data, context) => {
      const { db, user } = context;
      const { content, taskListId } = data;
      if (!user) throw new Error(`Authorization error. Please login`);

      const newToDo = { content, taskListId, isCompleted: false };
      const result = await db.collection("ToDos").insertOne(newTodo);
    },
  },
  TaskList: {
    id: ({ _id, id }) => _id || id,
    progress: () => 0,
    users: async ({ userIds }, _, { db }) =>
      Promise.all(
        userIds.map((userId) => db.collection("Users").findOne({ _id: userId }))
      ),
  },
  User: {
    id: (root, data, context) => {
      //root will show what mutation return in User
      return root._id;
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
