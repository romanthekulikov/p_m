import * as slidesActionsTypes from "./slidesActionsTypes";
import { createAction } from "@reduxjs/toolkit";

const deleteSlides = createAction(slidesActionsTypes.DELETE_SLIDES);
const addSlide = createAction(slidesActionsTypes.ADD_SLIDE);
const moveSlides = createAction<number>(slidesActionsTypes.MOVE_SLIDES);
const assignSlideIndex = createAction<number>(slidesActionsTypes.ASSIGN_SLIDE_INDEX);
const selectSlides = createAction<Array<number>>(slidesActionsTypes.SELECT_SLIDES);
const updateSlideProperty = createAction<Object>(slidesActionsTypes.UPDATE_SLIDE_PROPERTY);

export {
    deleteSlides,
    addSlide,
    moveSlides,
    assignSlideIndex,
    selectSlides,
    updateSlideProperty,
};