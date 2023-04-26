import React, { useEffect, useState } from "react";
import styles from "./styles/styles.module.css";
import buttonStyles from "./styles/button.module.css";
import * as consts from "../../../common/consts";
import { updateSlideProperty } from "../../../actions/slides/slidesActions";
import { assignAreaIndex } from "../../../actions/areas/areasActions";
import * as areaContentActions from "../../../actions/area-content/areaContentActions";
import { connect, ConnectedProps } from "react-redux";
import type { RootState } from "../../../store";

const mapState = (state: RootState) => ({
    currAreaIndex: state.presentationElements.currentAreaIndex,
});

const mapDispatch = {
    updateSlideProperty: updateSlideProperty,
    updateText: areaContentActions.updateText,
    updateGraphicPrimitive: areaContentActions.updateGraphicPrimitive,
    assignAreaIndex: assignAreaIndex,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
    type: string,
    styleName: string,
};

function ColorSelector(props: Props): JSX.Element {
    const [areaIndex, setAreaIndex] = useState(0);

    useEffect(() => {
        const input = document.querySelectorAll("#" + props.type)[0];

        if (props.currAreaIndex !== consts.notSelectedIndex) {
            setAreaIndex(props.currAreaIndex);
        }

        const onFocusoutHandler = (e) => {
            const color: string = e.target.value;

            props.assignAreaIndex(areaIndex);

            switch (props.type) {
                case "background":
                    props.updateSlideProperty({backgroundImage: {type: "imageUrl", path: ""}, backgroundColor: color});
                    break;
                case "text":
                    props.updateText({color: color});
                    break;
                case "textStroke":
                    props.updateText({strokeColor: color});
                    break;
                case "primitive":
                    props.updateGraphicPrimitive({color: color});
                    break;
                case "primitiveStroke":
                    props.updateGraphicPrimitive({strokeColor: color});
            }
        }

        input.addEventListener("focusout", onFocusoutHandler);

        return () => {
            input.removeEventListener("focusout", onFocusoutHandler);
        }
    });

    return (
        <label className={buttonStyles["button"]}>
            <div className={styles["color-button"] + " " + styles[props.styleName]}></div>
            <input id={props.type} className={styles["input"]} type="color" ></input>
        </label>
    );
}

export default connector(ColorSelector);