import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Register from "./Register";
import ss from "../services/SocketService";
import LooEditor from "./LooEditor";
import Queue from "./Queue";

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
    loo: string;
    queueNote: string;
    isEditingLoo: boolean;
    appState?: IAppState;
}

interface IMainProps {
    username: string | undefined;
    setUsername: (username: string | undefined) => void;
}

class Main extends React.Component<IMainProps, IMainState> {
    constructor(props: IMainProps) {
        super(props);

        this.handleClearUser = this.handleClearUser.bind(this);
        this.handleEnqueue = this.handleEnqueue.bind(this);
        this.handleLooNameChange = this.handleLooNameChange.bind(this);
        this.handleLooNameSubmit = this.handleLooNameSubmit.bind(this);
        this.handleQueueNoteChange = this.handleQueueNoteChange.bind(this);
        this.handleResetApp = this.handleResetApp.bind(this);
        this.handleRegistration = this.handleRegistration.bind(this);
        this.handleSocketStateChange = this.handleSocketStateChange.bind(this);
        this.isUserInQueue = this.isUserInQueue.bind(this);
        this.setIsEditingLoo = this.setIsEditingLoo.bind(this);

        this.state = { loo: "", queueNote: "", isEditingLoo: false };
        ss.socket.on("update", this.handleSocketStateChange);
        ss.socket.on("reconnect", () => {
            ss.socket.emit("reconnect", this.props.username);
        });
    }

    public handleSocketStateChange(appState: IAppState) {
        if (this.props.username) {
            this.setState({
                appState
            });
        }
    }

    public handleQueueNoteChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ queueNote: event.target.value });
    }

    public handleLooNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ loo: event.target.value });
    }

    public handleLooNameSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!this.state.loo) {
            return;
        }
        ss.setLoo(this.state.loo);
        this.setState({ isEditingLoo: false });
    }

    public handleResetApp() {
        if (confirm("Are you sure you want to reset the app?")) {
            this.setState({ loo: "", queueNote: "", appState: undefined });
            this.props.setUsername(undefined);
            ss.clearApp();
        }
    }

    public handleClearUser() {
        if (confirm("Are you sure you want to clear your user data?")) {
            const oldUsername = this.props.username as string;
            this.setState({ loo: "", queueNote: "", appState: undefined });
            ss.clearUser(oldUsername);
            this.props.setUsername(undefined);
        }
    }

    public handleEnqueue(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        ss.enqueue(this.state.queueNote);
        this.setState({
            queueNote: ""
        });
    }

    public setIsEditingLoo(state: boolean) {
        this.setState({ isEditingLoo: state });
    }

    public isUserInQueue(): boolean {
        return !!this.state.appState && this.state.appState.queue.some(q => q.user.name === this.props.username);
    }

    public handleRegistration(username: string) {
        this.props.setUsername(username);
        ss.register(username);
    }

    public render() {
        return (
            <div className="mt-2">
                {!this.state.appState && <Register onRegister={this.handleRegistration} username={this.props.username} />}

                {this.state.appState && (
                    <div>
                        <LooEditor loo={this.state.appState.loo} />

                        {!this.state.appState.queue.length && (
                            <p className="alert alert-info">
                                <FontAwesomeIcon icon="toilet" className="mr-1" />
                                The Loo Q is empty, go ahead!
                            </p>
                        )}

                        {!!this.props.username && !!this.state.appState.queue.length && (
                            <Queue appState={this.state.appState} username={this.props.username} />
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
                            Clear my user data <small className="text-muted" />
                        </h3>
                        <button type="button" className="btn btn-block btn-outline-warning" onClick={this.handleClearUser}>
                            Clear your current settings
                        </button>

                        <h3 className="text-danger mt-3">Reset App</h3>
                        <button type="button" className="btn btn-block btn-outline-danger mb-3" onClick={this.handleResetApp}>
                            Reset app to initial state
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

export default Main;
