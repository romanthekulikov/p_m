import React, { useState, useEffect } from "react";
import Slide from "../../slide/Slide";
import slidesGroupStyles from "./slidesGroup.module.css";
import * as slideActions from "../../../actions/slides/slidesActions";
import { connect, ConnectedProps } from "react-redux";
import type { RootState } from "../../../store";
import SlidesGroupService from "../../../common/service/slidesGroupService";

const mapState = (state: RootState) => ({
    currSlideIndex: state.presentationElements.currentSlideIndex,
    slidesGroup: state.presentationElements.slidesGroup,
    selectedSlidesIndexes: state.presentationElements.selectedSlidesIndexes,
});

const mapDispatch = {
    moveSlides: slideActions.moveSlides,
    assignSlideIndex: slideActions.assignSlideIndex,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
    isControl: boolean,
};

function SlidesGroup(props: Props): JSX.Element
{
    const [isDrag, setIsDrag] = useState(false);
    const [isMove, setIsMove] = useState(false);

    useEffect(() => {
        const slidesGroupElement = document.querySelectorAll("#slides-group")[0];

        function onMouseMove() {
            setIsMove(true);
        }

        function onMouseUp(e) {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            setIsDrag(false);

            slidesGroupElement.classList.remove(slidesGroupStyles["slides-group-active"]);

            if (isMove)
            {
                props.moveSlides(
                    SlidesGroupService.getInsertPositionToMove(e, props.slidesGroup)
                );
            }
        }

        function onMouseDown(e) {
            if (SlidesGroupService.getIsSelectSlidesCheck(
            e, props.slidesGroup, props.currSlideIndex, props.selectedSlidesIndexes))
            {
                setIsMove(false);
                setIsDrag(true);
                slidesGroupElement.classList.add(slidesGroupStyles["slides-group-active"]);
            }
            else if (!props.isControl)
            {
                props.assignSlideIndex(props.slidesGroup.length - 1);
            }
        };

        SlidesGroupService.updateSlidesSelect(
            props.slidesGroup, 
            props.currSlideIndex, 
            props.selectedSlidesIndexes, 
            slidesGroupStyles["slide-wrapper-selected"]
        );

        slidesGroupElement.addEventListener("mousedown", onMouseDown);
        if (isDrag) 
        {
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        }

        return () => {
            slidesGroupElement.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };
    });  

    const slideComponents = props.slidesGroup.map((slideElement, index) => {
        return (
            <li key={slideElement.id} id={slideElement.id} className={props.currSlideIndex === index ? 
            slidesGroupStyles["slide-wrapper-current"] : slidesGroupStyles["slide-wrapper"]}>
                <Slide slideElement={slideElement} 
                    index={index} 
                    isCurrent={false} 
                    isControl={props.isControl} 
                    isFullscreenMode={false} 
                />
            </li>
        );
    });

    return (
        <ol id="slides-group" className={slidesGroupStyles["slides-group"]}>
            {slideComponents}
        </ol>
    );
}

export default connector(SlidesGroup);