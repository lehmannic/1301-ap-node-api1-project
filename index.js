const express = require("express");
var { nanoid } = require("nanoid"); // https://stackoverflow.com/questions/61374991/how-to-use-nanoid-module-on-nodejs

const server = express();
server.use(express.json());

server.get("/hello", (req, res) => {
  res.send("hello world");
});

let users = [
  {
    id: nanoid(5), // hint: use the shortid npm package to generate it
    name: "Jane Doe", // String, required
    bio: "Not Tarzan's Wife, another Jane", // String, required
  },
  {
    id: nanoid(5), // hint: use the shortid npm package to generate it
    name: "Bob Ross", // String, required
    bio: "Painting is FUN", // String, required
  },
];

// GET all users
server.get("/api/users", (req, res) => {
  try {
    // Returns an array users
    res.status(200).json(users);
  } catch {
    res
      .status(500)
      .json({ message: "The users information could not be retrieved" });
  }
});

// GET user (from ID)
server.get("/api/users/:id", (req, res) => {
  try {
    const id = req.params.id;
    const foundUser = users.find((user) => user.id === id);
    // Returns the user object if foundUser is defined
    // --> if undefined ... "user not found"
    foundUser
      ? res.status(200).json(foundUser)
      : res
          .status(200)
          .json({ message: "The user with the specified ID does not exist." });
  } catch {
    res
      .status(500)
      .json({ message: "The user information could not be retrieved" });
  }
});

// POST user (requires NAME & BIO)
server.post("/api/users", (req, res) => {
  // Creates a user using the information sent inside the request body
  try {
    const { name, bio } = req.body;
    const newUser = { id: nanoid(5), name, bio };
    // add user if name & bio are defined
    // --> if either is undefined... status 400 "please provide.."
    if (!name || !bio) {
      res
        .status(400)
        .json({ errorMessage: "Please provide name and bio for the user." });
    } else {
      users.push(newUser);
      res.status(201).json(newUser);
    }
  } catch {
    res.status(500).json({
      message: "There was an error while saving the user to the database.",
    });
  }
});

// DELETE user (from ID)
server.delete("/api/users/:id", (req, res) => {
  try {
    const id = req.params.id;
    // tries to find user
    const foundUser = users.find((user) => user.id === id);
    // 1. removes the user with the specified id
    // --> https://stackoverflow.com/questions/15287865/remove-array-element-based-on-object-property
    if (foundUser) {
      for (var i = users.length - 1; i >= 0; --i) {
        if (users[i].id == id) {
          users.splice(i, 1);
        }
      }
      // 2. returns the deleted user
      res.status(200).json(foundUser);
    } else {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." });
    }
  } catch {
    res.status(500).json({ message: "The user could not be removed." });
  }
});

// UPDATE user
server.put("/api/users/:id", (req, res) => {
  try {
    const id = req.params.id;
    const { name, bio } = req.body;
    const foundUser = users.find((user) => user.id === id);

    if (!name || !bio) {
      res
        .status(400)
        .json({ errorMessage: "Please provide name and bio for the user." });
    } else {
      if (foundUser) {
        Object.assign(foundUser, { name, bio });
        res.status(200).json(foundUser);
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    }
  } catch {
    res
      .status(500)
      .json({ message: "The user information could not be modified." });
  }
});

const port = 8000;
server.listen(port, () => console.log("server running"));
