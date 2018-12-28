import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IAppState, IAppUser } from "./Main";
import ss from "../services/SocketService";

interface IQueueProps {
    username: string;
    appState: IAppState;
}

class Queue extends React.Component<IQueueProps> {
    constructor(props: IQueueProps) {
        super(props);

        this.handleDequeue = this.handleDequeue.bind(this);
        this.isUserActive = this.isUserActive.bind(this);
    }

    public isUserActive(user: IAppUser): boolean {
        return this.props.appState.users.some(u => u.name === user.name);
    }

    public handleDequeue(user: IAppUser) {
        if (user.name !== this.props.username) {
            if (!confirm("That's not you... Are you sure they should leave the queue?")) {
                return;
            }
        }
        ss.dequeue();
    }

    public render() {
        return (
            <table className="table table-sm text-center">
                <tbody>
                    {this.props.appState.queue.map((item, index) => (
                        <tr key={index}>
                            <td className="align-middle">
                                <span className="badge badge-dark">{index + 1}</span>
                            </td>
                            <td className="align-middle">
                                <span className={this.isUserActive(item.user) ? "text-success" : ""}>{item.user.name}</span>
                            </td>
                            <td className="align-middle">
                                {item.note && (
                                    <span className="text-muted">
                                        <small className="font-italic">Intends to</small> {item.note}
                                    </span>
                                )}
                            </td>
                            <td className="align-middle">
                                {
                                    <button
                                        type="button"
                                        className="btn btn-link text-danger"
                                        onClick={() => this.handleDequeue(item.user)}
                                    >
                                        <FontAwesomeIcon icon="trash" />
                                    </button>
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
}
export default Queue;
