import * as socketIO from "socket.io";
import { LooService, IQueueEntry } from "./LooService";

const looService: LooService = new LooService();
const primaryEvent = "update";

export function handleConnection(socket: socketIO.Socket): void {
    const id = socket.id;
    const state = looService.addUser({ id });
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

    socket.on("enqueue", (note?: string) => {
        const entry: IQueueEntry = {
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

    socket.on("set-loo", (looName?: string) => {
        const state = looService.setLooName(looName);
        socket.emit(primaryEvent, state);
        socket.broadcast.emit(primaryEvent, state);
    });

    socket.on("register", (name: string) => {
        const state = looService.addUser({ id, name });
        socket.emit(primaryEvent, state);
        socket.broadcast.emit(primaryEvent, state);
    });

    socket.on("disconnect", () => {
        const state = looService.removeUser(id);
        socket.broadcast.emit(primaryEvent, state);
    });
}
