import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { takeLoanAsync, updateLoanInterest } from './bankSlice';
import { checkNewReleases } from './competitorSlice';
import { incrementMonthly } from './consumerSlice';
import { updateDevelopmentProgress } from './hardwareSlice';
import { updateDailyHype } from './marketingSlice';
import { updateDailySales } from './marketSlice';
import { addNotificationWithGameDate, removeOldNotifications } from './notificationSlice';
import { updatePopularity } from './popularitySlice';
import { advanceResearchProgress } from './resaearchSlice';
import { loadState } from './saves/actions';
import { AppDispatch, RootState } from './store';
import { subtractMonthlyRent } from './officeSlice';
import { paySalaries } from './employeeSlice';
import { scriptApi } from '@/components/mods/ScriptManager';

export interface GameState {
  day: number;
  month: number;
  year: number;
  cash: number;
  previousDayCash: number;
  yearlyProfits: number[];
  gameSpeed: number;
  taxValue: number;
  devMode: boolean;
  processing: boolean; // Processing flag
  lose: boolean; // Flag to track if the player has lost
}

const initialState: GameState = {
  day: 1,
  month: 0, // January (0-11)
  year: 1970,
  cash: 10000,
  previousDayCash: 10000, // Initialize with the same value as cash
  yearlyProfits: [0, 0, 0],
  gameSpeed: 1,
  taxValue: 40,
  devMode: false,
  processing: false,
  lose: false,
};

export const nextDay = createAsyncThunk<void, void, { state: RootState; dispatch: AppDispatch }>(
  'game/nextDay',
  async (_, { dispatch, getState }) => {
    await dispatch(gameSlice.actions.setProcessing(true)); // Set processing flag to true

    const state = getState();
    const { day, month, year, cash } = state.game;

    // Emit script event onPreDay, before day switch
    await scriptApi.emit('onPreDay', { day, month, year });

    const currentDate = new Date(year, month, day);
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);

    // Update previousDayCash before incrementing the day
    await dispatch(gameSlice.actions.updatePreviousDayCash(cash));

    await dispatch(gameSlice.actions.incrementDay({
      day: newDate.getDate(),
      month: newDate.getMonth(),
      year: newDate.getFullYear(),
    }));

    await dispatch(advanceResearchProgress());
    await dispatch(updateDevelopmentProgress(1));
    await dispatch(updateDailySales());
    await dispatch(updatePopularity());
    await dispatch(updateDailyHype());

    // Check if the player's cash is negative and invoke cashRescue if necessary
    if (state.game.cash < 0) {
      await dispatch(cashRescue());
    }

    if (newDate.getDate() === 1) {
      await dispatch(nextMonth());
    }
    if (newDate.getMonth() === 0 && newDate.getDate() === 1) {
      await dispatch(nextYear());
    }

    // Emit script event onPostDay, after day switch
    await scriptApi.emit('onPostDay', {
      day: newDate.getDate(),
      month: newDate.getMonth(),
      year: newDate.getFullYear(),
    });
    
    
    await dispatch(gameSlice.actions.setProcessing(false)); // Set processing flag to false
  }
);

export const nextMonth = createAsyncThunk<void, void, { state: RootState; dispatch: AppDispatch }>(
  'game/nextMonth',
  async (_, { dispatch, getState }) => {
    const state = getState();

    // Emit script event onPreMonth, before month switch
    await scriptApi.emit('onPreMonth', { month: state.game.month, year: state.game.year });

    const { loanInterest } = state.bank;
    if (loanInterest > 0) {
      dispatch(gameSlice.actions.subtractCash(loanInterest));
    }
    await dispatch(updateLoanInterest());
    await dispatch(checkNewReleases());
    await dispatch(removeOldNotifications());
    await dispatch(subtractMonthlyRent());
    await dispatch(paySalaries());

    await dispatch(incrementMonthly({ year: state.game.year, month: state.game.month }));

    // Emit script event onPostMonth, after month switch
    await scriptApi.emit('onPostMonth', { month: state.game.month, year: state.game.year });
  }
);


export const nextYear = createAsyncThunk<void, void, { state: RootState; dispatch: AppDispatch }>(
  'game/nextYear',
  async (_, { dispatch, getState }) => {
    const state = getState();

    // Emit script event onPreYear, before year switch
    await scriptApi.emit('onPreYear', { year: state.game.year });

    const { cash } = state.game;

    // Emit script event onPostYear, after year switch
    await scriptApi.emit('onPostYear', { year: state.game.year });
  }
);


export const cashRescue = createAsyncThunk<void, void, { state: RootState; dispatch: AppDispatch }>(
  'game/cashRescue',
  async (_, { dispatch, getState }) => {
    const state = getState();
    const { cash, lose } = state.game;
    const { loan, maxLoan } = state.bank;

    // If the player has already lost, do nothing
    if (lose) return;

    if (cash < 0) {
      const neededAmount = Math.abs(cash); // Amount needed to bring cash to 0
      const availableLoanAmount = maxLoan - loan;

      if (availableLoanAmount >= neededAmount) {
        // Take a loan only if the available loan amount is enough to cover the needed amount
        await dispatch(takeLoanAsync(neededAmount));
        dispatch(addNotificationWithGameDate(`You were forced to take a loan of $${neededAmount.toFixed(0)} to cover your debts.`));
      } else {
        await dispatch(gameSlice.actions.setLose(true)); // Player loses if they cannot take a sufficient loan
      }
    }
  }
);

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    incrementDay: (state, action: PayloadAction<{ day: number, month: number, year: number }>) => {
      state.day = action.payload.day;
      state.month = action.payload.month;
      state.year = action.payload.year;
    },
    addCash: (state, action: PayloadAction<number>) => {
      state.cash += action.payload;
    },
    subtractCash: (state, action: PayloadAction<number>) => {
      state.cash -= action.payload;
    },
    setGameSpeed: (state, action: PayloadAction<number>) => {
      state.gameSpeed = action.payload;
    },
    toggleDevMode: (state) => {
      state.devMode = !state.devMode;
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.processing = action.payload; // Set processing flag
    },
    updatePreviousDayCash: (state, action: PayloadAction<number>) => {
      state.previousDayCash = action.payload; // Update previous day cash
    },
    setLose: (state, action: PayloadAction<boolean>) => {
      state.lose = action.payload; // Set lose flag
    },
    setTaxValue: (state, action: PayloadAction<number>) => {
      state.taxValue = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadState, (state, action: PayloadAction<RootState | undefined>) => {
      return action.payload?.game || state;
    });
  }
});

export const {
  addCash,
  subtractCash,
  setGameSpeed,
  toggleDevMode,
  setProcessing,
  updatePreviousDayCash,
  setLose,
  setTaxValue 
} = gameSlice.actions;
export default gameSlice.reducer;
