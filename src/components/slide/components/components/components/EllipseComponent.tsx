import React from "react";
import GraphicPrimitiveService from "../../../../../common/service/graphicPrimitiveService";
import type * as types from "../../../../../common/types";
import { connect } from "react-redux";

const connector = connect(null, null);

type Props = {
    graphicPrimitiveElement: types.GraphicPrimitiveInfo,
    width: number,
    height: number,
};

function EllipseComponent(props: Props): JSX.Element
{
    const valueX: number = GraphicPrimitiveService.getEllipseValueX(props.graphicPrimitiveElement.strokeWidth, props.width);
    const valueY: number = GraphicPrimitiveService.getEllipseValueY(props.graphicPrimitiveElement.strokeWidth, props.height);

    return (
        <svg width="100%" height="100%">
            <ellipse fill={props.graphicPrimitiveElement.color} strokeWidth={valueX === 1 ? "98%" : props.graphicPrimitiveElement.strokeWidth} 
            stroke={props.graphicPrimitiveElement.strokeColor} cx="50%" cy="50%" rx={valueX + "%"} ry={valueY + "%"}/>
        </svg>
    );
}

export default connector(EllipseComponent);