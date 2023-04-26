import * as titleActionsTypes from "./titleActionsTypes";
import { createAction } from "@reduxjs/toolkit";

const changeTitle = createAction<string>(titleActionsTypes.CHANGE_TITLE);

export {
    changeTitle,
};