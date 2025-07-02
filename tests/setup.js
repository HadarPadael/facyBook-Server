const mongoose = require("mongoose");
// creates an in memoty DB
const { MongoMemoryServer } = require("mongodb-memory-server");
const express = require("express");

const userRoutes = require("../routes/user");
const postRoutes = require("../routes/post");
const tokenRoutes = require("../routes/token");

let mongo;
let app;

// will run once before all tests
beforeAll(async () => {
  // create a brand new instance of mongoDB for this run
  mongo = await MongoMemoryServer.create();
  // connect mongoose to this specific DB and get its URL
  await mongoose.connect(mongo.getUri());

  // create an express app
  app = express();
  // add json middleware
  app.use(express.json());
  // load routes
  app.use("/api/users", userRoutes);
  app.use("/api/posts", postRoutes);
  app.use("/api/tokens", tokenRoutes);
});

// will run after each test to cleanup the DB so tests wont pollute each other
afterEach(async () => {
  // get all DB collections and remove them one by one
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

// after all tests are finished, this cleanup method runs to stop the in-memort DB we created
afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

// make app available globally in all tests
global.app = app; 
