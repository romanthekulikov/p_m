import * as localHistoryActionsTypes from "./localHistoryActionsTypes";
import { createAction } from "@reduxjs/toolkit";

const redo = createAction(localHistoryActionsTypes.REDO);
const undo = createAction(localHistoryActionsTypes.UNDO);

export {
    redo,
    undo,
};