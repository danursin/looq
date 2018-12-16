import * as React from "react";
import * as io from "socket.io-client";

interface IMainState {
    user?: string;
    users: string[];
    loo?: string;
}

interface IAppState {
    users: string[];
    loo: string;
}

interface IRegisterRequest {
    user: string;
}

class Main extends React.Component<{}, IMainState> {
    private socket: SocketIOClient.Socket;
    constructor(props: {}) {
        super(props);

        this.socket = io("https://looq.herokuapp.com/");

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleNameSubmit = this.handleNameSubmit.bind(this);
        this.handleSocketStateChange = this.handleSocketStateChange.bind(this);

        const user = localStorage.getItem("APP_USERNAME") || undefined;
        if (user) {
            this.socket.emit("register", { user });
            this.state;
        }

        this.state = { user, users: [] };

        this.socket.on("update", this.handleSocketStateChange);
    }

    public handleSocketStateChange(appState: IAppState) {
        this.setState({
            users: appState.users,
            loo: appState.loo
        });
    }

    public handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ user: event.target.value });
    }

    public handleNameSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!this.state.user) {
            return;
        }

        localStorage.setItem("APP_USERNAME", this.state.user);

        const request: IRegisterRequest = {
            user: this.state.user
        };

        this.socket.emit("register", request);
    }

    public render() {
        return (
            <div className="row d-flex justify-content-center mt-3">
                <div className="col-8">
                    <p className="alert alert-info text-center">You are not yet registered. Enter your name to get started</p>
                    <form noValidate onSubmit={this.handleNameSubmit}>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">@</span>
                            </div>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Username"
                                onChange={this.handleNameChange}
                                value={this.state.user}
                            />
                        </div>
                        <button type="submit" className="btn btn-outline-primary btn-block" disabled={!this.state.user}>
                            Register
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Main;
