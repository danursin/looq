import * as React from "react";
import * as io from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface IAppUser {
    id: string;
    name?: string;
}

export interface IQueueEntry {
    user: IAppUser;
    note?: string;
}

export interface IAppState {
    loo: string;
    users: IAppUser[];
    queue: IQueueEntry[];
}

interface IMainState {
    user: string;
    loo: string;
    queueNote: string;
    isEditingLoo: boolean;
    appState?: IAppState;
}

class Main extends React.Component<{}, IMainState> {
    private socket: SocketIOClient.Socket;
    constructor(props: {}) {
        super(props);

        this.socket = io("https://looq.herokuapp.com/");

        this.handleClearUser = this.handleClearUser.bind(this);
        this.handleDequeue = this.handleDequeue.bind(this);
        this.handleEnqueue = this.handleEnqueue.bind(this);
        this.handleLooNameChange = this.handleLooNameChange.bind(this);
        this.handleLooNameSubmit = this.handleLooNameSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleNameSubmit = this.handleNameSubmit.bind(this);
        this.handleQueueNoteChange = this.handleQueueNoteChange.bind(this);
        this.handleResetApp = this.handleResetApp.bind(this);
        this.handleSocketStateChange = this.handleSocketStateChange.bind(this);
        this.isUserActive = this.isUserActive.bind(this);
        this.isUserInQueue = this.isUserInQueue.bind(this);
        this.setIsEditingLoo = this.setIsEditingLoo.bind(this);

        const user = localStorage.getItem("APP_USERNAME") || "";

        this.state = { user, loo: "", queueNote: "", isEditingLoo: false };

        this.socket.on("update", this.handleSocketStateChange);
    }

    public componentDidMount() {
        if (this.state.user) {
            this.socket.emit("register", this.state.user);
        }
    }

    public handleSocketStateChange(appState: IAppState) {
        if (this.state.user) {
            this.setState({
                appState
            });
        }
    }

    public handleQueueNoteChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ queueNote: event.target.value });
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
        this.socket.emit("set-loo", this.state.loo);
        this.setState({ isEditingLoo: false });
    }

    public handleNameSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!this.state.user) {
            return;
        }
        localStorage.setItem("APP_USERNAME", this.state.user);
        this.socket.emit("register", this.state.user);
    }

    public handleResetApp() {
        if (confirm("Are you sure you want to reset the app?")) {
            localStorage.removeItem("APP_USERNAME");
            this.setState({ user: "", loo: "", queueNote: "", appState: undefined });
            this.socket.emit("clear-app");
        }
    }

    public handleClearUser() {
        if (confirm("Are you sure you want to clear your user data?")) {
            const oldUsername = this.state.user;
            localStorage.removeItem("APP_USERNAME");
            this.setState({ user: "", loo: "", queueNote: "", appState: undefined });
            this.socket.emit("clear-user", oldUsername);
        }
    }

    public handleEnqueue(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        this.socket.emit("enqueue", this.state.queueNote);
        this.setState({
            queueNote: ""
        });
    }

    public handleDequeue() {
        this.socket.emit("dequeue");
    }

    public setIsEditingLoo(state: boolean) {
        this.setState({ isEditingLoo: state });
    }

    public isUserActive(user: IAppUser): boolean {
        return !!this.state.appState && this.state.appState.users.some(u => u.name === user.name);
    }

    public isUserInQueue(): boolean {
        return !!this.state.appState && this.state.appState.queue.some(q => q.user.name === this.state.user);
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

                        {!this.state.appState.queue.length && (
                            <p className="alert alert-info">
                                <FontAwesomeIcon icon="toilet" className="mr-1" />
                                The Loo Q is empty, go ahead!
                            </p>
                        )}

                        {!!this.state.appState.queue.length && (
                            <div>
                                <h3 className="text-primary">Current Loo Q</h3>
                                <ul className="list-group">
                                    {this.state.appState.queue.map((item, index) => (
                                        <li className="list-group-item" key={index}>
                                            <div className="d-flex justify-content-between">
                                                <h4 className={`mb-0 my-auto ${this.isUserActive(item.user) ? "text-success" : ""}`}>
                                                    <FontAwesomeIcon icon="user-alt" className="mr-1" />
                                                    {item.user.name}
                                                </h4>

                                                {item.note && <span className="text-muted my-auto">{item.note}</span>}
                                                <div>
                                                    {this.state.user === item.user.name && (
                                                        <button type="button" className="btn btn-link" onClick={this.handleDequeue}>
                                                            <FontAwesomeIcon icon="trash" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {!this.isUserInQueue() && (
                            <div>
                                <h3 className="text-primary">Enter the Loo Q!</h3>
                                <form noValidate onSubmit={this.handleEnqueue}>
                                    <div className="input-group mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Describe your intent..."
                                            onChange={this.handleQueueNoteChange}
                                            value={this.state.queueNote}
                                        />
                                        <div className="input-group-append">
                                            <button className="btn btn-outline-primary" type="submit">
                                                GO
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}

                        <h3 className="text-warning mt-3" style={{ paddingTop: "300px" }}>
                            Clear my user data <small className="text-muted">(logged in as {this.state.user})</small>
                        </h3>
                        <button type="button" className="btn btn-block btn-outline-warning" onClick={this.handleClearUser}>
                            Clear your current settings
                        </button>

                        <h3 className="text-danger mt-3">Reset</h3>
                        <button type="button" className="btn btn-block btn-outline-danger" onClick={this.handleResetApp}>
                            Reset app to initial state
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

export default Main;
