import { combineReducers, configureStore } from '@reduxjs/toolkit';
import gameReducer from './gameSlice';
import bankReducer from './bankSlice';
import researchReducer from './resaearchSlice';
import hardwareReducer from './hardwareSlice';
import consumerReducer from './consumerSlice';
import productReducer from './productSlice';
import marketReducer from './marketSlice';
import playerHistoryReducer from './playerHistorySlice';
import marketingReducer from './marketingSlice';
import productReviewReducer from './productReviewSlice';
import popularityReviewReducer from './popularitySlice';
import notificationReducer from './notificationSlice';
import competitorReducer from './competitorSlice';
import settingsReducer from './settingsSlice';
import officeReducer from './officeSlice';
import employeeReducer from './employeeSlice';
import eventReducer from './eventSlice';
import scriptManagerReducer from './scriptManagerSlice';
import { saveState, getSavesList, deleteState, loadState } from './saves/saves';
import { resetState } from './saves/actions';

const appReducer = {
  game: gameReducer,
  bank: bankReducer,
  research: researchReducer,
  hardware: hardwareReducer,
  consumers: consumerReducer,
  product: productReducer,
  market: marketReducer,
  playerHistory: playerHistoryReducer,
  marketing: marketingReducer,
  productReview: productReviewReducer,
  popularity: popularityReviewReducer,
  notifications: notificationReducer,
  competitors: competitorReducer,
  office: officeReducer,
  employee: employeeReducer,
  events: eventReducer,
  scriptManager: scriptManagerReducer,
  settings: settingsReducer,
};

const rootReducer = (state: any, action: any) => {
  if (action.type === resetState.type) {
    console.log("state really reseted");
    state = undefined;
  }
  return combineReducers(appReducer)(state, action);
};

const store = configureStore({
  reducer: rootReducer,
});

// Typy dla RootState i AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Akcje do zapisu, odczytu, pobierania listy i usuwania stanu
export const saveGameState = (name: string) => saveState(name, store.getState());
export const loadGameState = (name: string) => store.dispatch({ type: 'LOAD_STATE', payload: loadState(name) });
export const getGameSaves = () => getSavesList();
export const deleteGameState = (name: string) => deleteState(name);

export default store;
