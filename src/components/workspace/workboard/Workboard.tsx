import React, { useState, useEffect } from "react";
import Slide from "../../slide/Slide";
import workboadStyles from "./workboard.module.css";
import * as areaActions from "../../../actions/areas/areasActions";
import { connect, ConnectedProps } from "react-redux";
import type { RootState } from "../../../store";
import * as types from "../../../common/types";
import areaStyles from "../../slide/components/area.module.css";
import * as consts from "../../../common/consts";
import WorkboardService from "../../../common/service/workboardService";

const mapState = (state: RootState) => ({
    slidesGroup: state.presentationElements.slidesGroup,
    currSlideIndex: state.presentationElements.currentSlideIndex,
    currAreaIndex: state.presentationElements.currentAreaIndex,
    selectedAreasIndexes: state.presentationElements.selectedAreasIndexes,
    presentationElements: state.presentationElements,
});

const mapDispatch = {
    updateInDragAreas: areaActions.updateInDragAreas,
    updateAreas: areaActions.updateAreas,
    assignAreaIndex: areaActions.assignAreaIndex,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
    isControl: boolean,
};

function Workboard(props: Props): JSX.Element {
    const [areasSelect, setAreasSelect] = useState(Array<types.AreaSelect>);
    const [isDrag, setIsDrag] = useState(false);
    const [isMove, setIsMove] = useState(false);

    const saveAreasCoords = (e) => {
        if (!props.slidesGroup.length) return;

        const areasInfo: Array<types.AreaSelect> = WorkboardService.createAreasInfo(
            e, props.slidesGroup, props.currSlideIndex, props.currAreaIndex, props.selectedAreasIndexes
        );

        setAreasSelect(areasInfo);
    }

    useEffect(() => {
        const workboard = document.querySelectorAll("#workboard")[0];
        const workboardSlide: Element = document.querySelectorAll("#workboard-slide")[0];
        const workboardSlidePosition = workboardSlide.getBoundingClientRect();

        function onMouseMove(e) {
            props.updateInDragAreas({
                areasSelect: [...areasSelect], 
                newAreaLastX: WorkboardService.getNewDragCoordX(e, workboardSlidePosition.x, areasSelect), 
                newAreaLastY: WorkboardService.getNewDragCoordY(e, workboardSlidePosition.y, areasSelect)
            });

            setIsMove(true);
        }

        function onMouseUp() {
            setIsDrag(false);

            if (!isMove) return;

            props.updateAreas({
                areasSelect: areasSelect, 
                slidePosX: workboardSlidePosition.x, 
                slidePosY: workboardSlidePosition.y
            });

            setIsMove(false);
        }

        function onMouseDown(e) {
            if (!props.slidesGroup.length) return;

            let isSelect: boolean = false;
            let isResize: boolean = false;
            
            props.slidesGroup[props.currSlideIndex].areas.map((area, index) => {
                const resizeCheck: boolean = WorkboardService.getCursorInResizeCheck(e, area.id) && !props.isControl;
                const selectCheck: boolean = WorkboardService.getCursorInAreaCheck(e, area) && 
                (index === props.currAreaIndex || props.selectedAreasIndexes.includes(index));

                if (resizeCheck)
                {
                    isSelect = false;
                    isResize = true;
                }
                else if (selectCheck) 
                {
                    isSelect = true;
                }
            });

            if (isSelect) {
                saveAreasCoords(e);
                setIsDrag(true);
            }
            else if (!props.isControl && !isResize) {
                setAreasSelect([]);
                props.assignAreaIndex(consts.notSelectedIndex);
            }
        };

        WorkboardService.updateWorkboardSize();

        window.onresize = () => {
            WorkboardService.updateWorkboardSize();
        }

        WorkboardService.updateAreasSelect(
            props.slidesGroup, 
            props.currSlideIndex, 
            props.currAreaIndex, 
            props.selectedAreasIndexes,
            areaStyles["area-wrapper-selected"]
        );

        workboard.addEventListener("mousedown", onMouseDown);
        if (isDrag)
        {
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        }

        return () => {
            workboard.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        }
    }, [areasSelect, isDrag, props.presentationElements, props.isControl]);

    return (
        <div id="workboard" className={workboadStyles["workboard"]}>
            <div id="workboard-slide" className={props.slidesGroup.length 
                ? workboadStyles["workboard__slide"] 
                : workboadStyles["workboard__without-slide"]}
            >
                {props.slidesGroup.length !== 0 &&
                    <Slide slideElement={props.slidesGroup[props.currSlideIndex]} 
                        index={props.currSlideIndex} 
                        isCurrent={true} 
                        isControl={props.isControl}
                        isFullscreenMode={false}
                    />
                }
            </div>
        </div>
    );
}

export default connector(Workboard);