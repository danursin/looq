import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IRegisterProps {
    username?: string | undefined;
    onRegister(username: string): void;
}

interface IRegisterState {
    username: string;
    isLoading: boolean;
}

class Register extends React.Component<IRegisterProps, IRegisterState> {
    constructor(props: IRegisterProps) {
        super(props);
        this.state = { isLoading: false, username: this.props.username || "" };
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleTextInputChange = this.handleTextInputChange.bind(this);
    }

    public handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        this.setState({ isLoading: true });
        this.props.onRegister(this.state.username);
    }

    public handleTextInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ username: event.target.value });
    }

    public render() {
        return (
            <div className="card">
                <div className="card-header bg-primary text-white">Sign in</div>
                <div className="card-body">
                    <h4 className="text-primary">
                        <FontAwesomeIcon icon="user-alt" className="mr-1" />
                        Enter your moniker
                    </h4>
                    {this.state.isLoading && (
                        <p className="text-muted font-italic">
                            <FontAwesomeIcon icon="cog" spin={true} /> Signing in...
                        </p>
                    )}
                    {!this.state.isLoading && (
                        <form noValidate onSubmit={this.handleFormSubmit}>
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="express yourself"
                                    name="username"
                                    onChange={this.handleTextInputChange}
                                    value={this.state.username}
                                />
                                <div className="input-group-append">
                                    <button className="btn btn-outline-primary" type="submit" disabled={!this.state.username}>
                                        Register
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        );
    }
}

export default Register;
