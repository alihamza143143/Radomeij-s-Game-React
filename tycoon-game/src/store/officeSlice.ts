import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from './store';
import { loadState } from './saves/actions';
import { subtractCash } from './gameSlice';
import { playSound } from '@/utils/soundUtils';

export interface Office {
    id: number;
    name: string;
    rentCost: number;
    maxEmployees: number;
}

export interface OfficeState {
    currentOffice: Office | null;
    availableOffices: Office[];
}

const initialState: OfficeState = {
    currentOffice: null,
    availableOffices: [],
};

// Thunk to update the current office without subtracting rent
export const updateOffice = createAsyncThunk<
    void,
    number, // officeId
    { state: RootState; dispatch: AppDispatch }
>(
    'office/updateOffice',
    async (officeId, { dispatch, getState }) => {
        const state = getState();
        const selectedOffice = state.office.availableOffices.find(
            office => office.id === officeId
        );

        if (selectedOffice) {
            // Play a sound indicating the office change
            dispatch(playSound(4));

            // Set the selected office as the current office
            dispatch(setCurrentOffice(officeId));
        }
    }
);

// Thunk to subtract rent cost at the end of the month
export const subtractMonthlyRent = createAsyncThunk<
    void,
    void,
    { state: RootState; dispatch: AppDispatch }
>(
    'office/subtractMonthlyRent',
    async (_, { dispatch, getState }) => {
        const state = getState();
        const currentOffice = state.office.currentOffice;

        if (currentOffice) {
            // Subtract the rent cost from player's cash
            await dispatch(subtractCash(currentOffice.rentCost));
        }
    }
);

const officeSlice = createSlice({
    name: 'office',
    initialState,
    reducers: {
        setAvailableOffices: (state, action: PayloadAction<Office[]>) => {
            state.availableOffices = action.payload;

            // Automatyczne ustawienie pierwszego darmowego biura jako currentOffice
            const freeOffice = state.availableOffices.find(office => office.rentCost === 0);
            if (freeOffice) {
                state.currentOffice = freeOffice;
            } else if (state.availableOffices.length > 0) {
                // Jeśli nie ma darmowego biura, ustaw pierwsze dostępne
                state.currentOffice = state.availableOffices[0];
            }
        },
        setCurrentOffice: (state, action: PayloadAction<number>) => {
            const selectedOffice = state.availableOffices.find(
                office => office.id === action.payload
            );
            if (selectedOffice) {
                state.currentOffice = selectedOffice;
            }
        },
        resetCurrentOffice: (state) => {
            state.currentOffice = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadState, (state, action: PayloadAction<RootState | undefined>) => {
            return action.payload?.office || state;
        });
    },
});

export const { setAvailableOffices, setCurrentOffice, resetCurrentOffice } = officeSlice.actions;
export default officeSlice.reducer;
