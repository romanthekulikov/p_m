import * as areaContentActionsTypes from "./areaContentAcrionsTypes";
import { createAction } from "@reduxjs/toolkit";

const updateText = createAction<Object>(areaContentActionsTypes.UPDATE_TEXT);
const updateGraphicPrimitive = createAction<Object>(areaContentActionsTypes.UPDATE_GRAPHIC_PRIMITIVE);

export {
    updateText,
    updateGraphicPrimitive,
};