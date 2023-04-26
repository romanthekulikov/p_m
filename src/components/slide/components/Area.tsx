import React, {useEffect, useState} from "react";
import GraphicPrimitiveComponent from "./components/GraphicPrimitiveComponent";
import TextComponent from "./components/TextComponent";
import ImageComponent from "./components/ImageComponent";
import type * as types from "../../../common/types";
import areaStyles from "./area.module.css";
import * as areaActions from "../../../actions/areas/areasActions";
import { connect, ConnectedProps } from "react-redux";
import AreaService from "../../../common/service/areaService";

const mapDispatch = {
    selectAreas: areaActions.selectAreas,
    assignAreaIndex: areaActions.assignAreaIndex,
    updateArea: areaActions.updateArea,
};

const connector = connect(null, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
    areaElement: types.Area, 
    areaIndex: number,
    isCurrentSlide: boolean,
    slideRef: HTMLDivElement|null,
    isControl: boolean,
    isFullscreenMode: boolean
};

function Area(props: Props): JSX.Element
{
    const workboardSlide: Element = document.querySelectorAll("#workboard-slide")[0];

    const widthScalingFactorFullscreen: number = AreaService.getWidthScalingFactorFullscreen(workboardSlide.clientWidth);
    const heightScalingFactorFullscreen: number = AreaService.getHeightScalingFactorFullscreen(workboardSlide.clientHeight);

    const marginLeft: number = AreaService.getMarginLeft(
        props.isFullscreenMode, 
        props.areaElement, 
        widthScalingFactorFullscreen,
        props.isCurrentSlide,
        workboardSlide,
        props.slideRef
    );

    const marginTop: number = AreaService.getMarginTop(
        props.isFullscreenMode, 
        props.areaElement, 
        heightScalingFactorFullscreen,
        props.isCurrentSlide,
        workboardSlide,
        props.slideRef
    )

    const style = {
        marginLeft: marginLeft,
        marginTop: marginTop,
        width: AreaService.getWidth(props.areaElement.width, props.isFullscreenMode, widthScalingFactorFullscreen),
        height: AreaService.getHeight(props.areaElement.height, props.isFullscreenMode, heightScalingFactorFullscreen),
        transform: AreaService.getTransform(props.isCurrentSlide, workboardSlide)
    };

    useEffect(() => {
        if (!props.isCurrentSlide) return;

        const areaElement = document.querySelectorAll("#" + props.areaElement.id)[0];

        function onMouseDown() {
            document.addEventListener("mouseup", onMouseUp);

            if (!props.isFullscreenMode)
            {
                props.isControl ? props.selectAreas([props.areaIndex]) : 
                    props.assignAreaIndex(props.areaIndex);
            }
        }

        function onMouseUp() {
            if (!props.isControl && (areaElement.clientWidth !== props.areaElement.width || areaElement.clientHeight !== props.areaElement.height))
            {
                props.updateArea({width: areaElement.clientWidth, height: areaElement.clientHeight});
            }
            document.removeEventListener("mouseup", onMouseUp);
        }

        areaElement.addEventListener("mousedown", onMouseDown);

        return () => {
            areaElement.removeEventListener("mousedown", onMouseDown);
        }
    }, [props.isControl, props.areaElement, props.areaIndex]);

    return (
        <div id={props.areaElement.id} style={style}
        className={props.isCurrentSlide ? areaStyles["area-wrapper"] : areaStyles["area-wrapper-scale"]}>
            { props.areaElement.contains?.type === "text" && 
                <TextComponent textElement={props.areaElement.contains} isFullscreenMode={props.isFullscreenMode} widthScalingFactorFullscreen={widthScalingFactorFullscreen}/>
            }

            { props.areaElement.contains?.type === "primitive" && 
                <GraphicPrimitiveComponent areaElement={props.areaElement}/>
            }

            { (props.areaElement.contains?.type === "imageUrl" || props.areaElement.contains?.type === "imageBase64") && 
                <ImageComponent imageElement={props.areaElement.contains}/>
            }
        </div>
    );
}

export default connector(Area);