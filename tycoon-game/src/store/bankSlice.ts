import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addCash, subtractCash } from './gameSlice'; // Importujemy akcje do aktualizacji gotówki
import { AppDispatch, RootState } from './store';
import { loadState } from './saves/actions';
import { scriptApi } from '@/components/mods/ScriptManager'; // Upewnij się, że masz poprawny import scriptApi

export interface BankState {
  loan: number;
  loanInterest: number;
  maxLoan: number;
}

const initialState: BankState = {
  loan: 0,
  loanInterest: 0,
  maxLoan: 100000,
};

export const updateMaxLoanAsync = createAsyncThunk<void, void, { state: RootState; dispatch: AppDispatch }>(
  'bank/updateMaxLoanAsync',
  async (_, { dispatch, getState }) => {
    // Tutaj znajdzie się logika aktualizacji maxLoan w przyszłości
    // const state = getState();
    // const averageProfit = state.game.yearlyProfits.reduce((a, b) => a + b, 0) / state.game.yearlyProfits.length;
    // const maxLoanAmount = Math.max(100000, averageProfit);
    // dispatch(bankSlice.actions.setMaxLoan(maxLoanAmount));
  }
);

export const takeLoanAsync = createAsyncThunk<void, number, { state: RootState; dispatch: AppDispatch }>(
  'bank/takeLoanAsync',
  async (amount, { dispatch }) => {
    dispatch(bankSlice.actions.takeLoan(amount));
    dispatch(addCash(amount)); // Dodanie gotówki do stanu gry

    // Emitowanie zdarzenia onLoanTaken po wzięciu pożyczki
    await scriptApi.emit('onLoanTaken', { amount });
  }
);

export const repayLoanAsync = createAsyncThunk<void, number, { state: RootState; dispatch: AppDispatch }>(
  'bank/repayLoanAsync',
  async (amount, { dispatch, getState }) => {
    const state = getState();
    const { loan } = state.bank;

    if (loan < amount) {
      amount = loan; // Jeśli kwota spłaty jest większa niż pożyczka, spłać tylko tyle, ile wynosi pożyczka
    }

    dispatch(bankSlice.actions.repayLoan(amount));
    dispatch(subtractCash(amount)); // Odejmowanie gotówki ze stanu gry

    // Emitowanie zdarzenia onLoanRepaid po spłacie pożyczki
    await scriptApi.emit('onLoanRepaid', { amount });
  }
);

const bankSlice = createSlice({
  name: 'bank',
  initialState,
  reducers: {
    takeLoan: (state, action: PayloadAction<number>) => {
      state.loan += action.payload;
      state.loanInterest = state.loan * 0.05; // 5% odsetki
    },
    repayLoan: (state, action: PayloadAction<number>) => {
      state.loan -= action.payload;
      if (state.loan < 0) state.loan = 0;
      state.loanInterest = state.loan * 0.05; // aktualizacja odsetek
    },
    updateLoanInterest: (state) => {
      if (state.loan > 0) {
        state.loanInterest = state.loan * 0.05;
      }
    },
    setMaxLoan: (state, action: PayloadAction<number>) => {
      state.maxLoan = action.payload; // Aktualizacja maxLoan
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadState, (state, action: PayloadAction<RootState | undefined>) => {
      return action.payload?.bank || state;
    });
  }
});

export const { takeLoan, repayLoan, updateLoanInterest, setMaxLoan } = bankSlice.actions;
export default bankSlice.reducer;
