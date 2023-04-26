import * as slidesActionsTypes from "./areasActionsTypes";
import { createAction } from "@reduxjs/toolkit";

const deleteAreas = createAction(slidesActionsTypes.DELETE_AREAS);
const addArea = createAction<Object>(slidesActionsTypes.ADD_AREA);
const updateInDragAreas = createAction<Object>(slidesActionsTypes.UPDATE_IN_DRAG_AREAS);
const updateAreas = createAction<Object>(slidesActionsTypes.UPDATE_AREAS);
const assignAreaIndex = createAction<number>(slidesActionsTypes.ASSIGN_AREA_INDEX);
const selectAreas = createAction<Array<number>>(slidesActionsTypes.SELECT_AREAS);
const updateArea = createAction<Object>(slidesActionsTypes.UPDATE_AREA);

export {
    deleteAreas,
    addArea,
    updateInDragAreas,
    updateAreas,
    assignAreaIndex,
    selectAreas,
    updateArea,
};