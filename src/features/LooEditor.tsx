import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ss from "../services/SocketService";

interface ILooEditorState {
    isEditingLoo: boolean;
    loo: string;
}

interface ILooEditorProps {
    loo: string;
}

class LooEditor extends React.Component<ILooEditorProps, ILooEditorState> {
    constructor(props: ILooEditorProps) {
        super(props);

        this.state = {
            isEditingLoo: false,
            loo: this.props.loo
        };

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleTextInputChange = this.handleTextInputChange.bind(this);
    }

    public handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        ss.setLoo(this.state.loo);
        this.setState({ isEditingLoo: false });
    }

    public handleTextInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ loo: event.target.value });
    }

    public render() {
        return (
            <div>
                {!this.state.isEditingLoo && (
                    <h2 className="text-muted">
                        {this.props.loo}

                        <button
                            type="button"
                            className="btn btn-link"
                            onClick={() => this.setState({ isEditingLoo: true })}
                            title="Edit Loo Name"
                        >
                            <FontAwesomeIcon icon="pencil-alt" />
                        </button>
                    </h2>
                )}
                {this.state.isEditingLoo && (
                    <form noValidate onSubmit={this.handleFormSubmit}>
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="loo needs a name"
                                name="loo"
                                onChange={this.handleTextInputChange}
                                value={this.state.loo}
                            />
                            <div className="input-group-append">
                                <button
                                    className="btn btn-outline-dark"
                                    type="button"
                                    onClick={() => this.setState({ isEditingLoo: false })}
                                >
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
            </div>
        );
    }
}
export default LooEditor;
