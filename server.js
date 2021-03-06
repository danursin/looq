const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const helpers = require("./services/Helpers");

const app = express();
app.use(express.static(__dirname + "/build"));

const server = http.createServer(app);
const port = +(process.env.PORT || 2500);

const io = socketIO.listen(server);

io.sockets.on("connection", helpers.handleConnection);

app.get("/", (_req, res) => res.sendFile(__dirname + "/build/index.html"));

server.listen(port);

console.log(`Listening on port: ${port}`);
