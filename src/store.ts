import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers/rootReducer";

const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default store;