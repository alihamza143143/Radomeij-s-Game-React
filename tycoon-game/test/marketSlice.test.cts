import { Attributes, createConsumerPopulation } from '@/models/ConsumerPopulation';
import { Product, ProductAttributes } from '@/models/Product';
import { checkNewReleases } from '@/store/competitorSlice';
import marketSlice, { updateDailySales } from '@/store/marketSlice';
import { AppDispatch } from '@/store/store';
import { configureStore } from '@reduxjs/toolkit';

// Mocking other slices
const gameSlice = {
    year: 2024,
    month: 8,
    day: 1,
};

const productAttributes: ProductAttributes = {
    performance: 80,
    price: 20,
    brand: 1,
    durability: 50,
};

const productSlice = {
    products: [
        { id: 1, name: 'Product 1', releaseDate: { year: 2024, month: 8 }, attributes: productAttributes },
        { id: 2, name: 'Product 2', releaseDate: { year: 2024, month: 7 }, attributes: productAttributes },
    ] as Product[],
};

const consumerAttributes: Attributes = {
    price: 1,
    brand: 1,
    performance: 1,
    durability: 1,
};

const consumerSlice = {
    populations: [
        createConsumerPopulation('Population 1', 1000, { 2024: 1000, 2025: 1100 }, consumerAttributes),
    ],
};

const popularitySlice = {
    fans: 100,
};

const initialState = {
    game: gameSlice,
    product: productSlice,
    consumer: consumerSlice,
    popularity: popularitySlice,
    market: {
        currentMarket: [],
        historicalMarket: [],
    },
};

// Configure mock store
const mockStore = configureStore({
    reducer: {
        market: marketSlice,
        game: (state = gameSlice) => state,
        product: (state = productSlice) => state,
        consumer: (state = consumerSlice) => state,
        popularity: (state = popularitySlice) => state,
    },
    preloadedState: initialState,
});

describe('marketSlice', () => {
    let dispatch: AppDispatch;

    beforeEach(() => {
        dispatch = mockStore.dispatch;
    });

    it('should add new products to market', async () => {
        await dispatch(checkNewReleases());

        const state = mockStore.getState().market;
        expect(state.currentMarket.length).toBe(1);
        expect(state.currentMarket[0].productName).toBe('Product 1');
    });

    it('should update daily sales correctly', async () => {
        // First, add a product to the market
        await dispatch(checkNewReleases());

        // Then, update daily sales
        await dispatch(updateDailySales());

        const state = mockStore.getState().market;
        expect(state.currentMarket.length).toBe(1);
        expect(state.currentMarket[0].dailySales).toBeGreaterThan(0);
        expect(state.currentMarket[0].totalSales).toBeGreaterThan(0);
    });
});
