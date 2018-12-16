const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const app = express();
app.use(express.static(__dirname + "/build"));

const server = http.createServer(app);
const port = +(process.env.PORT || 2500);

const io = socketIO.listen(server);

const state = {
    users: [],
    requests: [],
    loo: "awww shit"
};

io.sockets.on("connection", socket => {
    console.log(`Connection created: ${socket.id}`);

    socket.on("register", data => {
        if (state.users.some(u => u === data.user)) {
            console.log(`User ${data.user} is already present`);
        } else {
            state.users.push(data.user);
        }
        socket.emit("register", state);
    });

    socket.on("enqueue", data => {
        console.log(`Enqueue: ${data}`);
        socket.emit("enqueue", state);
    });

    socket.on("dequeue", data => {
        console.log(`Dequeue: ${data}`);
        socket.emit("dequeue", state);
    });

    socket.on("disconnect", () => {
        const userIndex = state.users.indexOf(u => u === data.user);
        if (userIndex >= 0) {
            state.users.splice(userIndex, 1);
        }
        socket.emit("disconnect", state);
    });
});

app.get("/", (_req, res) => res.sendFile(__dirname + "/build/index.html"));

server.listen(port);

console.log(`Listening on port: ${port}`);
