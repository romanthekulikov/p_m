import * as slidesActionsTypes from "./convertActionsTypes";
import { createAction } from "@reduxjs/toolkit";

const convertJsonToState = createAction<string>(slidesActionsTypes.CONVERT_JSON_TO_STATE);
const convertStateToJson = createAction(slidesActionsTypes.CONVERT_STATE_TO_JSON);

export {
    convertJsonToState,
    convertStateToJson,
};