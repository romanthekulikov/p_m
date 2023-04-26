import React, { useEffect, useState } from "react";
import styles from "./styles/styles.module.css";
import { connect, ConnectedProps } from "react-redux";
import type { RootState } from "../../../store";

const mapState = (state: RootState) => ({
    title: state.title,
});

const connector = connect(mapState, null);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

function PresentationName(props: Props): JSX.Element
{
    const [value, setValue] = useState("");
    const [title, setTitle] = useState("");

    useEffect(() => {
        if (props.title !== title)
        {
            setTitle(props.title);
            setValue(props.title);
        }

        const nameMessage = document.querySelectorAll("#name-message")[0];

        value !== props.title ? nameMessage.classList.add(styles["message-active"]) :
            nameMessage.classList.remove(styles["message-active"]);
    }, [value, title, props.title]);

    return (
        <div className={styles["presentation-name"]}>
            <input id="presentation-name" className={styles["presentation-name-input"]} value={value} placeholder="Введите название" 
                onChange={(e) => {setValue(e.target.value)}}></input>
            <a id="name-message" className={styles["message"]}>Название не сохранено</a>
        </div>
    );
}

export default connector(PresentationName);