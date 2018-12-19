import * as React from "react";
import "./App.css";
import logo from "./logo.png";
import Main from "./features/Main";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserAlt, faPencilAlt, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

library.add(faUserAlt, faPencilAlt, faInfoCircle);

class App extends React.Component {
    public render() {
        return (
            <div>
                <nav className="navbar navbar-light bg-light">
                    <a className="navbar-brand" href="#">
                        <img src={logo} width="30" height="30" alt="" />
                        <span className="pl-2">loo q</span>
                    </a>
                </nav>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col">
                            <Main />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
