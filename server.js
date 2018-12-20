const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const app = express();
app.use(express.static(__dirname + "/build"));

const server = http.createServer(app);
const port = +(process.env.PORT || 2500);

const io = socketIO.listen(server);

const primaryEvent = "update";
const defaultLooName = "loo dog";

const state = {
    users: [],
    queue: [],
    loo: defaultLooName
};

io.sockets.on("connection", socket => {
    state.users.push({ id: socket.id });
    console.log(`Users: ${JSON.stringify(state.users)}`);

    socket.on("clear", () => {
        state.users = [];
        state.queue = [];
        state.loo = defaultLooName;
        socket.broadcast.emit(primaryEvent, state);
    });

    socket.on("clear-user", user => {
        state.users = state.users.filter(u => u !== user);
        state.queue = state.queue.filter(r => r.user !== user);
        socket.broadcast.emit(primaryEvent, state);
    });

    socket.on("enqueue", data => {
        console.log(`Enqueue from id: ${socket.id}`);

        const user = state.users.find(u => u.connectionID === socket.ID);
        state.queue.push({
            user,
            ...data
        });
        socket.emit(primaryEvent, state);
        socket.broadcast.emit(primaryEvent, state);
    });

    socket.on("dequeue", () => {
        console.log(`Dequeue from id: ${socket.id}`);
        const user = state.users.find(u => u.connectionID === socket.ID);
        state.queue = state.queue.filter(r => r.user !== user);
        socket.emit(primaryEvent, state);
        socket.broadcast.emit(primaryEvent, state);
    });

    socket.on("set-loo", data => {
        state.loo = data || defaultLooName;
        socket.emit(primaryEvent, state);
        socket.broadcast.emit(primaryEvent, state);
    });

    socket.on("register", data => {
        console.log(`Registering: ${data.user} with socket ID ${data.id}`);
        console.log(`Other Users: ${JSON.stringify(state.users)}`);
        const existingUser = state.users.find(u => u.id === socket.id);
        existingUser.user = data.user;

        socket.emit(primaryEvent, state);
        socket.broadcast.emit(primaryEvent, state);
    });

    socket.on("disconnect", () => {
        state.users = state.users.filter(u => u.connectionID !== socket.id);
        socket.broadcast.emit(primaryEvent, state);
    });
});

app.get("/", (_req, res) => res.sendFile(__dirname + "/build/index.html"));

server.listen(port);

console.log(`Listening on port: ${port}`);
