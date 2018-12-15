import * as React from "react";
import * as io from "socket.io-client";

class Main extends React.Component {
    private socket: SocketIOClient.Socket;
    constructor(props: {}) {
        super(props);
        this.socket = io();

        this.socket.emit("register", {
            hello: "World"
        });
    }

    public render() {
        return <p>Hello</p>;
    }
}

export default Main;
