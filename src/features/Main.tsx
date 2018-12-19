import * as React from "react";
import * as io from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IAppState {
    queue: Array<{
        user: string;
        note?: string;
    }>;
    users: string[];
    loo: string;
}

interface IMainState {
    user?: string;
    loo?: string;
    isEditingLoo: boolean;
    appState?: IAppState;
}

class Main extends React.Component<{}, IMainState> {
    private socket: SocketIOClient.Socket;
    constructor(props: {}) {
        super(props);

        this.socket = io("https://looq.herokuapp.com/");

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleLooNameChange = this.handleLooNameChange.bind(this);
        this.handleNameSubmit = this.handleNameSubmit.bind(this);
        this.handleLooNameSubmit = this.handleLooNameSubmit.bind(this);
        this.handleSocketStateChange = this.handleSocketStateChange.bind(this);
        this.handleResetApp = this.handleResetApp.bind(this);
        this.handleClearUser = this.handleClearUser.bind(this);
        this.setIsEditingLoo = this.setIsEditingLoo.bind(this);

        const user = localStorage.getItem("APP_USERNAME") || "";
        if (user) {
            this.socket.emit("register", user, (ack: any) => {
                console.log(ack);
            });
        }

        this.state = { user, loo: "", isEditingLoo: false };

        this.socket.on("update", this.handleSocketStateChange);
    }

    public handleSocketStateChange(appState: IAppState) {
        if (this.state.user) {
            this.setState({
                appState
            });
        }
    }

    public handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ user: event.target.value });
    }

    public handleLooNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ loo: event.target.value });
    }

    public handleLooNameSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!this.state.loo) {
            return;
        }
        this.socket.emit("set-loo", this.state.loo, (ack: any) => {
            console.log(ack);
        });

        this.setState({ isEditingLoo: false });
    }

    public handleNameSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!this.state.user) {
            return;
        }
        localStorage.setItem("APP_USERNAME", this.state.user);
        this.socket.emit("register", this.state.user, (ack: any) => {
            console.log(ack);
        });
    }

    public handleResetApp() {
        if (confirm("Are you sure you want to reset the app?")) {
            localStorage.removeItem("APP_USERNAME");
            this.setState({ user: "", appState: undefined });
            this.socket.emit("clear");
        }
    }

    public handleClearUser() {
        if (confirm("Are you sure you want to clear your user data?")) {
            const oldUsername = this.state.user;
            localStorage.removeItem("APP_USERNAME");
            this.setState({ user: "", appState: undefined });
            this.socket.emit("clear-user", oldUsername);
        }
    }

    public setIsEditingLoo(state: boolean) {
        this.setState({ isEditingLoo: state });
    }

    public render() {
        return (
            <div className="mt-2">
                {!this.state.appState && (
                    <div className="card">
                        <div className="card-header bg-primary text-white">Sign in</div>
                        <div className="card-body">
                            <h4 className="text-primary">
                                <FontAwesomeIcon icon="user-alt" className="mr-1" />
                                Enter your moniker
                            </h4>
                            <form noValidate onSubmit={this.handleNameSubmit}>
                                <div className="input-group mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="express yourself"
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
                        {!this.state.isEditingLoo && (
                            <h2 className="text-muted">
                                {this.state.appState.loo}

                                <button
                                    type="button"
                                    className="btn btn-link"
                                    onClick={() => this.setIsEditingLoo(true)}
                                    title="Edit Loo Name"
                                >
                                    <FontAwesomeIcon icon="pencil-alt" />
                                </button>
                            </h2>
                        )}
                        {this.state.isEditingLoo && (
                            <form noValidate onSubmit={this.handleLooNameSubmit}>
                                <div className="input-group mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="loo needs a name"
                                        onChange={this.handleLooNameChange}
                                        value={this.state.loo}
                                    />
                                    <div className="input-group-append">
                                        <button className="btn btn-outline-dark" type="button" onClick={() => this.setIsEditingLoo(false)}>
                                            Cancel
                                        </button>
                                    </div>
                                    <div className="input-group-append">
                                        <button className="btn btn-outline-primary" type="submit" disabled={!this.state.loo}>
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}

                        <h3 className="text-primary">Current Queue</h3>
                        <ul className="list-group">
                            {this.state.appState.queue.map((item, index) => (
                                <li className="list-group-item" key={index}>
                                    <h4>
                                        <FontAwesomeIcon icon="user-alt" className="mr-1" />
                                        {item.user}
                                    </h4>

                                    {item.note && <small className="text-muted">{item.note}</small>}
                                </li>
                            ))}
                        </ul>

                        <h3 className="text-warning mt-3">Clear my user data</h3>
                        <button type="button" className="btn btn-outline-warning" onClick={this.handleClearUser}>
                            Clear your current settings
                        </button>

                        <h3 className="text-danger mt-3">Reset</h3>
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
