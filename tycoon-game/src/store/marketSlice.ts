import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConsumerPopulation } from '../models/ConsumerPopulation';
import { HistoricalMarketEntry, MarketEntry } from '../models/Market';
import { Product } from '../models/Product';
import { updateExhausted } from './consumerSlice';
import { addCash, subtractCash } from './gameSlice';
import { addProduct, updateAllProductsPerformance, updateProduct } from './productSlice';
import { loadState } from './saves/actions';
import { AppDispatch, RootState } from './store';
import { calculateLikelihood } from '@/utils/consumerUtils';
import { addFans } from './popularitySlice';

export interface MarketState {
    currentMarket: MarketEntry[];
    historicalMarket: HistoricalMarketEntry[];
}

const initialState: MarketState = {
    currentMarket: [],
    historicalMarket: [],
};

export const addProductToMarketThunk = createAsyncThunk<void, { product: Product, isPlayer: boolean, price: number }, { state: RootState; dispatch: AppDispatch }>(
    'market/addProductToMarketThunk',
    async ({ product, isPlayer, price }, { dispatch, getState }) => {
        const state = getState();

        // First, add the product to the product slice
        await dispatch(addProduct(product));

        if (!isPlayer) { // Non-player CPU doesn't have set Performance Score
            const updatedPerformanceScore = Math.max(50, (state.product.maxPerformanceStore * product.attributes.performance));
            await dispatch(updateProduct({ productId: product.id, updates: { scores: { ...product.scores, performance: updatedPerformanceScore } } }));
        }


        // Add the new product to the market
        await dispatch(addProductToMarket({ product, isPlayer, price }));

        // Update performance scores for all products on the market
        await dispatch(updateAllProductsPerformance());
    }
);

export const updateDailySales = createAsyncThunk<void, void, { state: RootState; dispatch: AppDispatch }>(
    'market/updateDailySales',
    async (_, { dispatch, getState }) => {
        const state = getState();
        const { day, month, year } = state.game;
        const todayDate = new Date(year, month, day).toISOString();
        let currentMarket = state.market.currentMarket.map(entry => ({
            ...entry,
            weeklySales: [...entry.weeklySales], // Deep copy of weeklySales
        })); // Create a deep copy of currentMarket
        const consumers = state.consumers.populations;
        const fans = state.popularity.fans;
        const taxRate = state.game.taxValue / 100; // Convert tax value to a percentage

        if (currentMarket.length === 0) {
            return;
        }

        currentMarket.forEach(productOnMarket => {
            productOnMarket.dailySales = 0;
        });

        consumers.forEach(consumer => {
            calculateDailySalesForConsumer(currentMarket, consumer, state.product.products, dispatch);
        });

        // Add sales from fans for player's new products
        currentMarket.forEach(productOnMarket => {
            if (productOnMarket.daysOnMarket === 0 && productOnMarket.isPlayer) {
                productOnMarket.dailySales += fans;
                console.log("Your fans buy: " + fans + " of " + productOnMarket.productName)
            }
        });

        const entriesToMove = currentMarket.filter(productOnMarket => productOnMarket.dailySales === 0);
        currentMarket = currentMarket.filter(productOnMarket => productOnMarket.dailySales !== 0);

        let playerSoldCash = 0;
        currentMarket.forEach(productOnMarket => {
            const productIncome = productOnMarket.dailySales * productOnMarket.price;
            if (productOnMarket.isPlayer) {
                playerSoldCash += productIncome;
            }
            productOnMarket.totalSales += productOnMarket.dailySales;
            productOnMarket.totalProfit += productIncome;
            productOnMarket.daysOnMarket += 1;
            productOnMarket.weeklySales.push(productOnMarket.dailySales);
        });

        // Calculate tax and deduct it from player's income
        if (playerSoldCash > 0) {
            // console.log("player add to sold: " + playerSoldCash, taxRate);
            const taxAmount = playerSoldCash * taxRate;
            playerSoldCash -= taxAmount;
            // console.log(`Tax deducted: ${taxAmount}`);
        }

        // console.log("player playerSoldCash: " + playerSoldCash);
        if (playerSoldCash > 0) {
            // console.log("player gain: " + playerSoldCash);
            await dispatch(addCash(playerSoldCash));
        } else if (playerSoldCash < 0) {
            // console.log("player pay: " + playerSoldCash);
            await dispatch(subtractCash(-playerSoldCash));
        }

        await dispatch(updateMarket({ currentMarket, entriesToMove, todayDate }));
    }
);

const calculateDailySalesForConsumer = (
    currentMarket: MarketEntry[], consumer: ConsumerPopulation, products: Product[], dispatch: AppDispatch) => {
    const REST_RATIO = 0.04;
    const INTEREST_BORDER = 0.2;
    const FAN_THRESHOLD = 0.7; // Likelihood threshold to generate fans
    const FAN_BASE = 0.05; // Minimum fan generation value
    const FAN_RATE = 0.001; // Fans generated as 1 per mille of buyers

    let newExhaused = Math.max(0, Math.min(1, consumer.exhaused - REST_RATIO));

    let totalLikelihood = 0;
    let interestedProducts: MarketEntry[] = [];

    currentMarket.forEach(productOnMarket => {
        const product = products.find(p => p.id === productOnMarket.productId);
        if (!product) return;

        const likelihood = calculateLikelihood(consumer, product, productOnMarket.daysOnMarket);

        if (likelihood < INTEREST_BORDER) {
            return; // Skip this product; We don't care about unrelated products
        }

        interestedProducts.push(productOnMarket);
        totalLikelihood += likelihood;
        productOnMarket.tempLikelihood = likelihood; // Store for later reuse
    });

    const totalPopulation = (consumer.currentPopulation / 12) * (1 - consumer.exhaused);
    let sureBuyers = 0;

    const popularityBonus = 0.05;

    interestedProducts.forEach(productOnMarket => {
        const likelihood = productOnMarket.tempLikelihood || 0;
        const percentagePopulationShare = likelihood / totalLikelihood;

        productOnMarket.tmpSureBuyers = percentagePopulationShare * totalPopulation * (productOnMarket.popularity + popularityBonus);
        sureBuyers += productOnMarket.tmpSureBuyers || 0;
        productOnMarket.dailySales += productOnMarket.tmpSureBuyers;

        // Generate fans if likelihood is above the threshold
        if (productOnMarket.isPlayer && likelihood > FAN_THRESHOLD) {
            const fanLikelihood = FAN_BASE + ((likelihood - FAN_THRESHOLD) / (1 - FAN_THRESHOLD));
            const newFans = Math.round(productOnMarket.dailySales * fanLikelihood * FAN_RATE);
            if (!isNaN(newFans)) {
                dispatch(addFans(newFans));
            }
            console.log(`Generated ${newFans} fans for product ${productOnMarket.productName} in consumer group ${consumer.name}`);
        }
    });

    const uncertainBuyersTotal = totalPopulation - sureBuyers;
    if (uncertainBuyersTotal > 0) {
        interestedProducts.forEach(productOnMarket => {
            const likelihood = productOnMarket.tempLikelihood || 0;
            const percentagePopulationShare = likelihood / totalLikelihood;
            const uncertainBuyers = percentagePopulationShare * uncertainBuyersTotal;
            productOnMarket.dailySales += uncertainBuyers;
        });
    } else {
        const exhausedRatio = Math.abs(uncertainBuyersTotal) / totalPopulation;
        newExhaused += exhausedRatio;
    }

    dispatch(updateExhausted({ consumerId: consumer.name, newExhaused }));
};



const marketSlice = createSlice({
    name: 'market',
    initialState,
    reducers: {
        addProductToMarket: (state, action: PayloadAction<{ product: Product, isPlayer: boolean, price: number }>) => {
            const { product, isPlayer, price } = action.payload;
            const marketEntry: MarketEntry = {
                productId: product.id,
                productName: product.name,
                totalProfit: 0,
                totalSales: 0,
                dailySales: 0,
                weeklySales: [],
                daysOnMarket: 0,
                productionCost: product.attributes.price,
                isPlayer: isPlayer,
                popularity: product.attributes.brand,
                price: price,
                hype: 0
            };
            state.currentMarket.push(marketEntry);
            console.log("addProductToMarket", marketEntry);
        },
        updateMarket: (state, action: PayloadAction<{ currentMarket: MarketEntry[], entriesToMove: MarketEntry[], todayDate: string }>) => {
            state.currentMarket = action.payload.currentMarket;
            state.historicalMarket.push(...action.payload.entriesToMove.map(entry => ({
                ...entry,
                endDate: action.payload.todayDate, // Assuming you want to log when the entry was moved to historicalMarket
            })));
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loadState, (state, action: PayloadAction<RootState | undefined>) => {
            return action.payload?.market || state;
        });
    },
});

export const { addProductToMarket, updateMarket } = marketSlice.actions;
export default marketSlice.reducer;
