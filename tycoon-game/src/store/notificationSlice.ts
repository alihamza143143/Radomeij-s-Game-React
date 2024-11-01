import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppDispatch } from './store';

export interface Notify {
  id: number;
  message: string;
  date: {
    day: number;
    month: number;
    year: number;
  };
}

export interface NotificationState {
  notifications: Notify[];
}

const initialState: NotificationState = {
  notifications: [],
};

const isOlderThanOneYear = (notificationDate: { day: number; month: number; year: number }, currentDate: { day: number; month: number; year: number }) => {
  const notification = new Date(notificationDate.year, notificationDate.month - 1, notificationDate.day);
  const oneYearAgo = new Date(currentDate.year - 1, currentDate.month - 1, currentDate.day);
  return notification < oneYearAgo;
};

export const addNotificationWithGameDate = createAsyncThunk<void, string, { state: RootState; dispatch: AppDispatch }>(
  'notification/addNotificationWithGameDate',
  async (message, { dispatch, getState }) => {
    const state = getState();
    const { day, month, year } = state.game;
    const newNotification: Notify = {
      id: state.notifications.notifications.length ? state.notifications.notifications[state.notifications.notifications.length - 1].id + 1 : 1,
      message: message,
      date: { day, month, year },
    };
    await dispatch(notificationSlice.actions.addNotification(newNotification));
  }
);

export const addNotificationWithGameDate2 = createAsyncThunk<void, string, { state: RootState; dispatch: AppDispatch }>(
  'bank/takeLoanAsync',
  async (amount, { dispatch }) => {
  }
);

export const removeOldNotifications = createAsyncThunk<void, void, { state: RootState; dispatch: AppDispatch }>(
  'notification/removeOldNotifications',
  async (_, { dispatch, getState }) => {
    const state = getState();
    const currentDate = { day: state.game.day, month: state.game.month, year: state.game.year };

    const notificationsToRemove = state.notifications.notifications.filter(notification =>
      isOlderThanOneYear(notification.date, currentDate)
    );

    notificationsToRemove.forEach(notification => {
      dispatch(notificationSlice.actions.removeNotification(notification.id));
    });
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notify>) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action: PayloadAction<number>) => {
      state.notifications = state.notifications.filter(notification => notification.id !== action.payload);
    },
  }
});

export const { addNotification, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
