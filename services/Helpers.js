"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LooService_1 = require("./LooService");
const looService = new LooService_1.LooService();
const primaryEvent = "update";
function handleConnection(socket) {
    const id = socket.id;
    const state = looService.addUserShell(id);
    socket.emit(primaryEvent, state);
    socket.broadcast.emit(primaryEvent, state);
    socket.on("clear-app", () => {
        const state = looService.resetState();
        socket.broadcast.emit(primaryEvent, state);
    });
    socket.on("clear-user", () => {
        const state = looService.removeUser(id);
        socket.broadcast.emit(primaryEvent, state);
    });
    socket.on("enqueue", (note) => {
        const entry = {
            note: note,
            user: looService.getUser(id)
        };
        const state = looService.enqueue(entry);
        socket.emit(primaryEvent, state);
        socket.broadcast.emit(primaryEvent, state);
    });
    socket.on("dequeue", () => {
        const state = looService.dequeue(id);
        socket.emit(primaryEvent, state);
        socket.broadcast.emit(primaryEvent, state);
    });
    socket.on("set-loo", (looName) => {
        const state = looService.setLooName(looName);
        socket.emit(primaryEvent, state);
        socket.broadcast.emit(primaryEvent, state);
    });
    socket.on("register", (name) => {
        const state = looService.addUser({ id, name });
        socket.emit(primaryEvent, state);
        socket.broadcast.emit(primaryEvent, state);
    });
    socket.on("disconnect", () => {
        const state = looService.removeUser(id);
        socket.broadcast.emit(primaryEvent, state);
    });
}
exports.handleConnection = handleConnection;
