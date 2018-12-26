import * as React from "react";
import "./App.css";
import logo from "./logo.png";
import Main from "./features/Main";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserAlt, faPencilAlt, faInfoCircle, faTrash, faToilet, faToiletPaper } from "@fortawesome/free-solid-svg-icons";

library.add(faUserAlt, faPencilAlt, faInfoCircle, faTrash, faToilet, faToiletPaper);

interface IRootState {
    username?: string;
}
class App extends React.Component<{}, IRootState> {
    constructor(props: {}) {
        super(props);
        const username: string | null = localStorage.getItem("APP_USERNAME");

        this.state = { username: username || undefined };
    }

    public render() {
        return (
            <div>
                <nav className="navbar navbar-light bg-light">
                    <a className="navbar-brand" href="#">
                        <img src={logo} width="30" height="30" alt="" />
                        <span className="pl-2">loo q</span>
                    </a>
                    {this.state.username && <span className="nav-item badge badge-secondary badge-pill">{this.state.username}</span>}
                </nav>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col">
                            <Main setUsername={username => this.setState({ username })} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
