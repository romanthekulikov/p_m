import React, { useEffect, useState } from "react";
import workspaceStyles from "./workspace.module.css";
import type { RootState } from "../../store";
import * as consts from "../../common/consts";
import {redo, undo} from "../../actions/local-history/localHistoryActions";
import { deleteAreas } from "../../actions/areas/areasActions";
import { deleteSlides } from "../../actions/slides/slidesActions";
import { connect, ConnectedProps } from "react-redux";
import SlidesGroup from "./slidesGroup/SlidesGroup";
import Workboard from "./workboard/Workboard";

const mapState = (state: RootState) => ({
    presentationElements: state.presentationElements
});

const mapDispatch = {
    undo: undo,
    redo: redo,
    deleteAreas: deleteAreas,
    deleteSlides: deleteSlides,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

function Workspace(props: Props): JSX.Element 
{
    const [isControl, setIsControl] = useState(false);

    const deleteSelected = () => {
        const updatedPresentationElements = props.presentationElements;

        (updatedPresentationElements.currentAreaIndex !== consts.notSelectedIndex 
        || updatedPresentationElements.selectedAreasIndexes.length > 0) 
            ? props.deleteAreas() : props.deleteSlides();
    }

    const onKeyDown = e => {
        switch (e.key.toLowerCase()) {
            case "control":
                setIsControl(true);
                break;
            case "delete":
                deleteSelected();
                break;
            case "z":
                if (isControl)
                {
                    props.undo();
                }
                break;
            case "y":
                if (isControl)
                {
                    props.redo();
                }
                break;
        }
    }

    const onKeyUp = e => {
        if (e.key === "Control")
        {
            setIsControl(false);
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("keyup", onKeyUp);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("keyup", onKeyUp);
        }
    }, [isControl, props.presentationElements]);

    return (
        <div className={workspaceStyles["workspace"]}>
            <Workboard isControl={isControl} />
            <SlidesGroup isControl={isControl} />
        </div>
    );
}

export default connector(Workspace);