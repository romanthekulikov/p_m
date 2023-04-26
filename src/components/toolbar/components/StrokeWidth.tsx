import React, {useEffect, useState} from "react";
import styles from "./styles/styles.module.css";
import * as areaContentActions from "../../../actions/area-content/areaContentActions";
import { connect, ConnectedProps } from "react-redux";

const mapDispatch = {
    updateText: areaContentActions.updateText,
    updateGraphicPrimitive: areaContentActions.updateGraphicPrimitive,
};

const connector = connect(null, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
    value: number,
    type: string,
};

function StrokeWidth(props: Props): JSX.Element
{
    const [value, setValue] = useState("");

    useEffect(() => {
        setValue(props.value.toString());
    }, [props.value]);

    const onChangeHandler = e =>
    {
        const eValue = e.target.value;
        const newValue: number = eValue && eValue >= 0 ? Number(eValue) : 0;

        setValue(newValue.toString());
        if (props.type === "text")
        {
            props.updateText({strokeWidth: newValue});
        }
        else if (props.type === "primitive")
        {
            props.updateGraphicPrimitive({strokeWidth: newValue});
        }
    }

    return (
        <div className={styles["text-stroke-width"]}>
            <div className={styles["stroke-width-icon"]}></div>
            <input className={styles["stroke-width"]} 
                type="number" 
                value={value} 
                onChange={onChangeHandler} 
            />
        </div>
    );
}

export default connector(StrokeWidth);