import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Product } from '../models/Product';
import { RootState } from './store';
import { loadState } from './saves/actions';

export interface ProductState {
    products: Product[];
    maxPerformanceStore: number; // New field to store the highest performance value
}

const initialState: ProductState = {
    products: [],
    maxPerformanceStore: 0,
};

// Thunk to update all products' performance scores relative to the max performance score
export const updateAllProductsPerformance = createAsyncThunk(
    'product/updateAllProductsPerformance',
    async (_, { dispatch, getState }) => {
        const state = getState() as RootState;
        const products = state.product.products;

        // Determine the maximum performance score
        const maxPerformance = Math.max(...products.map(product => product.scores.performance || 0));

        // Update all products' performance to be relative to the max performance score
        products.forEach(product => {
            const relativePerformance = product.scores.performance / maxPerformance;
            dispatch(updateProduct({ productId: product.id, updates: { attributes: { ...product.attributes, performance: relativePerformance } } }));
        });

        return maxPerformance;
    }
);

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        addProduct: (state, action: PayloadAction<Product>) => {
            state.products.push(action.payload);
        },
        updateProduct: (state, action: PayloadAction<{ productId: number, updates: Partial<Product> }>) => {
            const { productId, updates } = action.payload;
            const product = state.products.find(product => product.id === productId);
            if (product) {
                Object.assign(product, updates);
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadState, (state, action: PayloadAction<RootState | undefined>) => {
            return action.payload?.product || state;
        });
        builder.addCase(updateAllProductsPerformance.fulfilled, (state, action) => {
            state.maxPerformanceStore = action.payload;
        });
    },
});

export const { addProduct, updateProduct } = productSlice.actions;

export const selectProductById = (state: RootState, productId: number): Product | undefined => {
    return state.product.products.find(product => product.id === productId);
};

export default productSlice.reducer;
