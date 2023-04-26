import React, {useState, useEffect} from "react";
import { connect, ConnectedProps } from "react-redux";
import * as areaContentActions from "../../../actions/area-content/areaContentActions";

const mapDispatch = {
    updateText: areaContentActions.updateText
};

const connector = connect(null, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
    additionalClass: string,
    value: string|number,
};

function InputComponent(props: Props): JSX.Element
{
    const [value, setValue] = useState("");

    useEffect(() => {
        setValue(props.value.toString());
    }, [props.value]);

    const onChangeHandler = e => {
        const eValue = e.target.value;

        if (typeof props.value === "number")
        {
            const newValue: number = eValue && eValue >= 0 ? Number(eValue) : 0;
            
            setValue(newValue.toString());
            props.updateText({fontSize: newValue});
        }
        else
        {
            const newValue: string = eValue.toString();

            setValue(newValue);
            props.updateText({font: newValue});
        }
    }

    return (
        <input className={props.additionalClass} value={value} onChange={onChangeHandler} type="text"/>
    );
}

export default connector(InputComponent);