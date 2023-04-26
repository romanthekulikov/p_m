import React from "react";
import { connect } from "react-redux";
import waitingPopUpStyles from "./waitingPopUp.module.css";

const connector = connect(null);

function WaitingPopUp(prop: {isPopUp: boolean, name: string}): JSX.Element {
    return (
        <div className={prop.isPopUp ? waitingPopUpStyles["pop-up-active"] : waitingPopUpStyles["pop-up-inactive"]}>
            <div className={waitingPopUpStyles["pop-up"]}>
                <a>{prop.name}</a>
            </div>
        </div>
    );
}

export default connector(WaitingPopUp);