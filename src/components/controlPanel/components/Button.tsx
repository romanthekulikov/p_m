import React from "react";
import styles from "./styles/button.module.css";
import { connect } from "react-redux";

const connector = connect(null, null);

type Props = {
    onClick: Function,
    actionName: string,
};

function Button(props: Props): JSX.Element
{
    const buttonHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        props.onClick();
    };

    return (
        <button className={styles['button']} onClick={buttonHandler}>
            {props.actionName}
        </button>
    );
}

export default connector(Button);