import * as io from "socket.io-client";

class SocketService {
    public readonly socket: SocketIOClient.Socket;
    private readonly localStorageUsernameKey = "APP_USERNAME";
    private readonly socketUrl = "https://looq.herokuapp.com/";

    constructor() {
        this.socket = io(this.socketUrl);
    }

    public register(username: string) {
        this.setUsername(username);
        this.socket.emit("register", username);
    }

    public setLoo(looName: string) {
        this.socket.emit("set-loo", looName);
    }

    public enqueue(note?: string) {
        this.socket.emit("enqueue", note);
    }

    public dequeue(username?: string) {
        this.socket.emit("dequeue", username);
    }

    public clearApp() {
        localStorage.removeItem(this.localStorageUsernameKey);
        this.socket.emit("clear-app");
    }

    public clearUser(username: string) {
        localStorage.removeItem(this.localStorageUsernameKey);
        this.socket.emit("clear-user", username);
    }

    public getUsername(): string | undefined {
        return localStorage.getItem(this.localStorageUsernameKey) || undefined;
    }

    public setUsername(username: string) {
        localStorage.setItem(this.localStorageUsernameKey, username);
    }
}

export default new SocketService();
