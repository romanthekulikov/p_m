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

function RectangleComponent(props: Props): JSX.Element
{
    const width: number = GraphicPrimitiveService.getRectangleWidth(props.graphicPrimitiveElement.strokeWidth, props.width);
    const height: number = GraphicPrimitiveService.getRectangleHeight(props.graphicPrimitiveElement.strokeWidth, props.height);

    return (
        <svg width="100%" height="100%">
            <rect strokeWidth={props.graphicPrimitiveElement.strokeWidth} stroke={props.graphicPrimitiveElement.strokeColor}
            fill={props.graphicPrimitiveElement.color} width={width + "%"} height={height + "%"}
            x={props.graphicPrimitiveElement.strokeWidth / 2} y={props.graphicPrimitiveElement.strokeWidth / 2} />
        </svg>
    );
}

export default connector(RectangleComponent);