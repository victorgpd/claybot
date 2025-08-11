import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { globalReducer } from "./globalReducer/slice";

export const rootReducer = combineReducers({ globalReducer });

const store = configureStore({ reducer: rootReducer });

export default store;

// RootState: para usar com useSelector e saber como é a estrutura do estado.
// AppDispatch: para tipar o dispatch com os middlewares do Redux Toolkit.

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
