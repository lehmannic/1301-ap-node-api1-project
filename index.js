const express = require("express");

const server = express();
server.use(express.json());

server.get("/hello", (res, req) => {
  req.send("hello world");
});

const port = 8000;
server.listen(port, () => console.log("server running"));
