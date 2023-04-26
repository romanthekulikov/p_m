import React from "react";
import styles from "./styles/button.module.css";
import { connect } from "react-redux";

const connector = connect(null, null);

type Props = {
    additionalClass: string,
    onClick: Function,
};

function Button(props: Props): JSX.Element
{
    const buttonHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        props.onClick();
    };

    return (
        <button className={styles['button'] + " " + props.additionalClass} onClick={buttonHandler}>
        </button>
    );
}

export default connector(Button);