import React from "react";
import GraphicPrimitiveService from "../../../../../common/service/graphicPrimitiveService";
import type * as types from "../../../../../common/types";
import { connect } from "react-redux";

const connector = connect(null, null);

type Props = {graphicPrimitiveElement: types.GraphicPrimitiveInfo};

function TriangleComponent(props: Props): JSX.Element
{
    const strokeWidth: number = Number(props.graphicPrimitiveElement.strokeWidth);

    const bottomPoint: number = GraphicPrimitiveService.getTriangleBottomPoint(strokeWidth);
    const topPoint: number = GraphicPrimitiveService.getTriangleTopPoint(strokeWidth);
    const bottomLeftPoint: number = GraphicPrimitiveService.getTriangleBottomLeftPoint(strokeWidth);
    const bottomRightPoint: number = GraphicPrimitiveService.getTriangleBottomRightPoint(strokeWidth);

    return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" >
            <polygon strokeWidth={strokeWidth} stroke={props.graphicPrimitiveElement.strokeColor} 
            fill={props.graphicPrimitiveElement.color} points={bottomLeftPoint + "," + bottomPoint + " " + 
            GraphicPrimitiveService.triangleMax / 2 + "," + topPoint + " " + bottomRightPoint + "," + bottomPoint}/>
        </svg>
    );
}

export default connector(TriangleComponent);