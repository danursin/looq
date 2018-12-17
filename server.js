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

const primaryEvent = "update";

io.sockets.on("connection", socket => {
    console.log(`Connection created: ${socket.id}`);

    socket.on("clear", () => {
        state.users = [];
        state.requests = [];
        socket.broadcast.emit(primaryEvent, state);
    });

    socket.on("clear-user", user => {
        state.users = state.users.filter(u => u !== user);
        state.requests = state.requests.filter(r => r.user !== user);
        socket.broadcast.emit(primaryEvent, state);
    });

    socket.on("set-loo", data => {
        if (data) {
            state.loo = data;
        }
        socket.emit(primaryEvent, state);
        socket.broadcast.emit(primaryEvent, state);
    });

    socket.on("register", user => {
        if (!user) {
            console.error(`Register event raised with incomplete data: ${JSON.stringify(user)}`);
            return;
        }

        if (state.users.some(u => u === user)) {
            console.log(`User ${user} is already present`);
        } else {
            state.users.push(user);
        }
        socket.emit(primaryEvent, state);
        socket.broadcast.emit(primaryEvent, state);
    });

    socket.on("disconnect", () => {
        const userIndex = state.users.indexOf(u => u === data.user);
        if (userIndex >= 0) {
            state.users.splice(userIndex, 1);
        }
        socket.broadcast.emit(primaryEvent, state);
    });
});

app.get("/", (_req, res) => res.sendFile(__dirname + "/build/index.html"));

server.listen(port);

console.log(`Listening on port: ${port}`);
