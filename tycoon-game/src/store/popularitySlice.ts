import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from './store';
import { logBase } from '../utils/mathUtils';
import { loadState } from './saves/actions';

export interface PopularityState {
    popularity: number; // Value between 0 and 1
    fans: number; // Number of fans
}

const initialState: PopularityState = {
    popularity: 0, // Start with 0 popularity
    fans: 0, // Start with 0 fans
};

// Thunk to update popularity based on market share
export const updatePopularity = createAsyncThunk<void, void, { state: RootState }>(
    'popularity/updatePopularity',
    async (_, { getState, dispatch }) => {
        const state = getState();
        const totalSales = state.market.currentMarket.reduce((acc, product) => acc + product.totalSales, 0);
        const playerSales = state.market.currentMarket.filter(product => product.isPlayer).reduce((acc, product) => acc + product.totalSales, 0);

        const marketShare = totalSales > 0 ? (playerSales / totalSales) : 0;
        const currentPopularity = state.popularity.popularity;

        let popularityChange = 0;


        const logBaseValue = 2.54;
        const maxFactor = logBase(100, logBaseValue);
        const maxIncrease = 0.1 / maxFactor;
        const maxDecrease = 0.05 / maxFactor;



        if (marketShare > currentPopularity / 3) {
            popularityChange = logBase(marketShare * 100, 2.54) * (1 - currentPopularity) * maxIncrease;
        } else {
            popularityChange = -logBase((1 - marketShare) * 100, 2.54) * (1 - currentPopularity) * maxDecrease;
        }

        popularityChange /= 100;

        // console.log("popularity change: ", popularityChange)
        const newPopularity = Math.max(0, Math.min(1, currentPopularity + popularityChange));
        dispatch(setPopularity(newPopularity));
    }
);

const popularitySlice = createSlice({
    name: 'popularity',
    initialState,
    reducers: {
        setPopularity: (state, action: PayloadAction<number>) => {
            state.popularity = Math.max(0, Math.min(1, action.payload)); // Ensure the value is between 0 and 1
        },
        addFans: (state, action: PayloadAction<number>) => {
            state.fans += action.payload;
        },
        removeFans: (state, action: PayloadAction<number>) => {
            state.fans = Math.max(0, state.fans - action.payload); // Ensure fans count doesn't go below 0
        },
    }, extraReducers: (builder) => {
        builder.addCase(loadState, (state, action: PayloadAction<RootState | undefined>) => {
            return action.payload?.popularity || state;
        });
    },
});

export const { setPopularity, addFans, removeFans } = popularitySlice.actions;
export default popularitySlice.reducer;
