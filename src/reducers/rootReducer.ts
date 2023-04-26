import * as functions from "../common/functions";
import * as types from "../common/types";
import { createReducer } from "@reduxjs/toolkit";
import { redo, undo } from "../actions/local-history/localHistoryActions";
import * as slideActions from "../actions/slides/slidesActions";
import * as areaActions from "../actions/areas/areasActions";
import { convertJsonToState, convertStateToJson } from "../actions/convert/convertActions";
import * as areaContentActions from "../actions/area-content/areaContentActions";
import { changeTitle } from "../actions/title/titleActions";

const initialPresentationElements: types.PresentationElements = {
    slidesGroup: [],
    currentSlideIndex: -1,
    selectedSlidesIndexes: [],
    selectedAreasIndexes: [],
    currentAreaIndex: -1,
}

let initialState: types.PresentationMaker = {
    title: "",
    localHistory: [initialPresentationElements],
    presentationElements: initialPresentationElements,
    currentPresentationElementsIndex: 0,
};

const rootReducer = createReducer(initialState, (builder) => 
    builder
    .addCase(redo, (state, action) => {
        return functions.redo(state);
    })
    .addCase(undo, (state, action) => {
        return functions.undo(state);
    })
    .addCase(slideActions.deleteSlides, (state, action) => {
        return functions.deleteSlides(state);
    })
    .addCase(slideActions.addSlide, (state, action) => {
        return functions.addSlide(state);
    })
    .addCase(slideActions.moveSlides, (state, action) => {
        return functions.moveSlides(state, action.payload);
    })
    .addCase(slideActions.assignSlideIndex, (state, action) => {
        return functions.assignSlideIndex(state, action.payload);
    })
    .addCase(slideActions.selectSlides, (state, action) => {
        return functions.selectSlides(state, action.payload);
    })
    .addCase(slideActions.updateSlideProperty, (state, action) => {
        return functions.updateSlideProperty(state, action.payload);
    })
    .addCase(areaActions.deleteAreas, (state, action) => {
        return functions.deleteAreas(state);
    })
    .addCase(areaActions.addArea, (state, action) => {
        return functions.addArea(state, action.payload);
    })
    .addCase(areaActions.updateInDragAreas, (state, action) => {
        return functions.updateInDragAreas(state, action.payload);
    })
    .addCase(areaActions.updateAreas, (state, action) => {
        return functions.updateAreas(state, action.payload);
    })
    .addCase(areaActions.assignAreaIndex, (state, action) => {
        return functions.assignAreaIndex(state, action.payload);
    })
    .addCase(areaActions.selectAreas, (state, action) => {
        return functions.selectAreas(state, action.payload);
    })
    .addCase(areaActions.updateArea, (state, action) => {
        return functions.updateArea(state, action.payload);
    })
    .addCase(convertStateToJson, (state, action) => {
        return functions.convertStateToJson(state);
    })
    .addCase(convertJsonToState, (state, action) => {
        return functions.convertJsonToState(action.payload);
    })
    .addCase(areaContentActions.updateText, (state, action) => {
        return functions.updateText(state, action.payload);
    })
    .addCase(areaContentActions.updateGraphicPrimitive, (state, action) => {
        return functions.updateGraphicPrimitive(state, action.payload);
    })
    .addCase(changeTitle, (state, action) => {
        return functions.changeTitle(state, action.payload);
    })
);

export default rootReducer;