import { createAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const loadState = createAction<RootState | undefined>('LOAD_STATE');
export const resetState = createAction<RootState | undefined>('RESET_STATE');