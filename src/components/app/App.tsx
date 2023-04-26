import React from "react";
import Toolbar from "../toolbar/Toolbar";
import ControlPanel from "../controlPanel/ControlPanel";
import Workspace from "../workspace/Workspace";
import appStyles from "./styles/app.module.css";
import "./styles/commonStyles.css";
import { connect } from "react-redux";
import Fullscreen from "../fullscreen/Fullscreen";

const connector = connect(null);

function App(): JSX.Element 
{
    return (
        <div className={appStyles["app"]}>
            <div>
                <ControlPanel />
                <Toolbar />
            </div>

            <Workspace />
            <Fullscreen />
        </div>
    );
}

export default connector(App);