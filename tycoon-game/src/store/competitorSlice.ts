import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Product } from '../models/Product';
import { AppDispatch, RootState } from './store';
import { loadState } from './saves/actions';
import { addProductToMarketThunk } from './marketSlice';
import { addNotificationWithGameDate } from './notificationSlice';
import { scriptApi } from '@/components/mods/ScriptManager'; // Upewnij się, że masz poprawny import scriptApi

export interface CompetitorState {
    products: Product[];
}

const initialState: CompetitorState = {
    products: [],
};

export const checkNewReleases = createAsyncThunk<void, void, { state: RootState; dispatch: AppDispatch }>(
    'market/checkNewReleases',
    async (_, { dispatch, getState }) => {
        const state = getState();
        const currentYear = state.game.year;
        const currentMonth = state.game.month;
        const products = state.competitors.products;
        const isPlayer = false; // Ustawienie flagi isPlayer dla produktów non-player
        const price = 50;

        products.forEach(product => {
            if (product.releaseDate.year === currentYear && product.releaseDate.month === currentMonth) {
                dispatch(addProductToMarketThunk({ product, isPlayer, price }));
                const message = "New product on market: " + product.name;
                dispatch(addNotificationWithGameDate(message as string));

                // Emitowanie zdarzenia onCompetitorProductReleased po wydaniu nowego produktu
                scriptApi.emit('onCompetitorProductReleased', { product });
            }
        });
    }
);

const competitorSlice = createSlice({
    name: 'competitor',
    initialState,
    reducers: {
        addProduct: (state, action: PayloadAction<Product>) => {
            state.products.push(action.payload);

            // Emitowanie zdarzenia onCompetitorProductAdded po dodaniu nowego produktu
            scriptApi.emit('onCompetitorProductAdded', { product: action.payload });
        },
        loadProducts: (state, action: PayloadAction<Product[]>) => {
            state.products = action.payload;

            // Emitowanie zdarzenia onCompetitorProductsLoaded po załadowaniu produktów
            scriptApi.emit('onCompetitorProductsLoaded', { products: state.products });
        },
        updateProduct: (state, action: PayloadAction<{ productId: number, updates: Partial<Product> }>) => {
            const { productId, updates } = action.payload;
            const product = state.products.find(product => product.id === productId);
            if (product) {
                Object.assign(product, updates);

                // Emitowanie zdarzenia onCompetitorProductUpdated po zaktualizowaniu produktu
                scriptApi.emit('onCompetitorProductUpdated', { product });
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadState, (state, action: PayloadAction<RootState | undefined>) => {
            return action.payload?.product || state;
        });
    },
});

export const { addProduct, loadProducts, updateProduct } = competitorSlice.actions;

export const selectComptetitorProductById = (state: RootState, productId: number): Product | undefined => {
    return state.competitors.products.find(product => product.id === productId);
};

export default competitorSlice.reducer;
