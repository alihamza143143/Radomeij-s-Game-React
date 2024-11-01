// store/playerHistorySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../models/Product';
import { RootState } from './store';
import { loadState } from './saves/actions';

export interface PlayerHistoryState {
    createdProducts: Product[];
    visibleProducts: number[]; // Added to manage visibility of products
}

const initialState: PlayerHistoryState = {
    createdProducts: [],
    visibleProducts: [], // Initialize with an empty array
};

const playerHistorySlice = createSlice({
    name: 'playerHistory',
    initialState,
    reducers: {
        addCreatedProduct: (state, action: PayloadAction<Product>) => {
            state.createdProducts.push(action.payload);
            state.visibleProducts.push(action.payload.id); // Automatically show new products
        },
        loadCreatedProducts: (state, action: PayloadAction<Product[]>) => {
            state.createdProducts = action.payload;
            state.visibleProducts = action.payload.map(product => product.id); // Show all loaded products
        },
        hideProduct: (state, action: PayloadAction<number>) => {
            state.visibleProducts = state.visibleProducts.filter(id => id !== action.payload);
        },
        showProduct: (state, action: PayloadAction<number>) => {
            if (!state.visibleProducts.includes(action.payload)) {
                state.visibleProducts.push(action.payload);
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadState, (state, action: PayloadAction<RootState | undefined>) => {
            return action.payload?.playerHistory || state;
        });
    },
});

export const { addCreatedProduct, loadCreatedProducts, hideProduct, showProduct } = playerHistorySlice.actions;
export default playerHistorySlice.reducer;
