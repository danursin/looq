import * as React from "react";
import * as io from "socket.io-client";

interface IAppState {
    users: string[];
    loo: string;
}

interface IMainState {
    user?: string;
    appState?: IAppState;
}

class Main extends React.Component<{}, IMainState> {
    private socket: SocketIOClient.Socket;
    constructor(props: {}) {
        super(props);

        this.socket = io("https://looq.herokuapp.com/");

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleNameSubmit = this.handleNameSubmit.bind(this);
        this.handleSocketStateChange = this.handleSocketStateChange.bind(this);
        this.handleResetApp = this.handleResetApp.bind(this);
        this.handleClearUser = this.handleClearUser.bind(this);

        const user = localStorage.getItem("APP_USERNAME") || "";
        if (user) {
            this.socket.emit("register", { user }, (ack: any) => {
                console.log(ack);
            });
        }

        this.state = { user };

        this.socket.on("update", this.handleSocketStateChange);
    }

    public handleSocketStateChange(appState: IAppState) {
        this.setState({
            appState
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
        this.socket.emit("register", { user: this.state.user }, (ack: any) => {
            console.log(ack);
        });
    }

    public handleResetApp() {
        if (confirm("Are you sure you want to reset the app?")) {
            this.socket.emit("clear");
        }
    }

    public handleClearUser() {
        if (confirm("Are you sure you want to clear your user data?")) {
            const oldUsername = this.state.user;
            localStorage.removeItem("APP_USERNAME");
            this.setState({ user: undefined, appState: undefined });
            this.socket.emit("clear-user", oldUsername);
        }
    }

    public render() {
        return (
            <div className="mt-2">
                {!this.state.appState && (
                    <div className="card">
                        <div className="card-header bg-primary text-white">Sign in</div>
                        <div className="card-body">
                            <h4 className="text-primary">Enter your name to get started</h4>
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
                                    <div className="input-group-append">
                                        <button className="btn btn-outline-primary" type="submit" disabled={!this.state.user}>
                                            Register
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {this.state.appState && (
                    <div>
                        <h3 className="text-primary">Active Users</h3>
                        <ul>
                            {this.state.appState.users.map((user, index) => (
                                <li key={index}>{user}</li>
                            ))}
                        </ul>

                        <h3 className="text-warning">Clear my user data</h3>
                        <button type="button" className="btn btn-outline-warning" onClick={this.handleClearUser}>
                            Clear your current settings
                        </button>

                        <h3 className="text-danger">Reset</h3>
                        <button type="button" className="btn btn-outline-danger" onClick={this.handleResetApp}>
                            Reset app to initial state
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

export default Main;
