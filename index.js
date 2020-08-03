const express = require("express");
var { nanoid } = require("nanoid"); // https://stackoverflow.com/questions/61374991/how-to-use-nanoid-module-on-nodejs

const server = express();
server.use(express.json());

server.get("/hello", (req, res) => {
  res.send("hello world");
});

let users = [
  {
    id: nanoid(), // hint: use the shortid npm package to generate it
    name: "Jane Doe", // String, required
    bio: "Not Tarzan's Wife, another Jane", // String, required
  },
];

// GET all users
server.get("/api/users", (req, res) => {
  // Returns an array users
  res.status(200).send(users);
});

// GET user (from ID)
server.get("/api/users/:id", (req, res) => {
  // save id from url ^^
  const id = req.params.id;
  // tries to find user
  const foundUser = users.find((user) => user.id === id);
  // Returns the user object if foundUser is defined
  foundUser
    ? res.status(200).send(foundUser)
    : res.status(200).send("user not found");
});

// POST user
server.post("/api/users", (req, res) => {
  // Creates a user using the information sent inside the request body
});

// DELETE user (from ID)
server.delete("/api/users/:id", (req, res) => {
  // 1. removes the user with the specified id
  // 2. returns the deleted user
});

server.put("/api/users/:id", (req, res) => {
  // 1. updates the user with the specified id using data from the request body
  // 2. returns the modified user
});

const port = 8000;
server.listen(port, () => console.log("server running"));
